const fs = require('node:fs');
const path = require('node:path');

const apiDir = path.resolve(__dirname, '..', 'api');
const nodesDir = path.resolve(__dirname, '..', 'nodes');
const packageJsonPath = path.resolve(__dirname, '..', 'package.json');

const METHOD_ORDER = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'];

const toTitleCase = (value) =>
	value
		.split(' ')
		.map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
		.join(' ');

const normalizeLabel = (value) => {
	if (!value) return '';
	const withSpaces = value
		.replace(/[_-]+/g, ' ')
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.replace(/\s+/g, ' ')
		.trim();
	const titled = toTitleCase(withSpaces);
	return titled
		.replace(/\bId\b/g, 'ID')
		.replace(/\bUrl\b/g, 'URL')
		.replace(/\bApi\b/g, 'API')
		.replace(/\bIp\b/g, 'IP');
};

const normalizeWords = (value) =>
	value
		.replace(/^infomaniak_api_/i, '')
		.replace(/\.json$/i, '')
		.replace(/[_\-]+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

const normalizeKey = (value) =>
	normalizeWords(value)
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.trim();

const toNodeName = (fileName) => {
	const base = normalizeWords(fileName);
	const parts = base.split(' ');
	return `Infomaniak${parts.map((part) => part.replace(/[^a-zA-Z0-9]/g, '')).filter(Boolean).map((part) => part[0].toUpperCase() + part.slice(1)).join('')}`;
};

const toDisplayName = (fileName) => {
	const base = normalizeWords(fileName);
	return `Infomaniak ${normalizeLabel(base)}`;
};

const toResourceLabel = (tag) => normalizeLabel(tag);

const toOperationLabelFromPath = (method, pathValue) => {
	const methodUpper = method.toUpperCase();
	const segments = pathValue
		.split('/')
		.filter(Boolean)
		.filter((segment) => !segment.match(/^\\d+$/));
	const lastSegment = segments[segments.length - 1] || '';
	const lastIsParam = lastSegment.startsWith('{') && lastSegment.endsWith('}');
	const nounSegment = lastIsParam ? segments[segments.length - 2] || 'resource' : lastSegment;
	const noun = normalizeLabel(nounSegment.replace(/[{}]/g, ''));

	if (methodUpper === 'GET') {
		if (lastIsParam) return `Get ${noun}`;
		return `List ${noun}`;
	}
	if (methodUpper === 'POST') return `Create ${noun}`;
	if (methodUpper === 'PUT' || methodUpper === 'PATCH') return `Update ${noun}`;
	if (methodUpper === 'DELETE') return `Delete ${noun}`;
	return `${methodUpper} ${noun}`;
};

const toOperationLabel = (method, pathValue, operation) => {
	if (operation.summary) return normalizeLabel(operation.summary);
	if (operation.operationId) return normalizeLabel(operation.operationId);
	return toOperationLabelFromPath(method, pathValue);
};

const ICON_MAP = {
	'kdrive': 'kdrive.svg',
	'kchat': 'kChat.svg',
	'kmeet': 'meet.svg',
	'newsletter': 'newsletter.svg',
	'eticket': 'etickets.svg',
	'public cloud': 'public-cloud.svg',
	'core ressource': 'k.svg',
	'swiss backup': 'swiss-backup.svg',
	'swiss backups': 'swiss-backup.svg',
	'url shortner': 'url-short.svg',
	'mail': 'mail.svg',
	'aitools': 'ai-tools.svg',
	'streaming radio': 'radio.svg',
	'streaming video': 'video.svg',
	'vod': 'vod.svg',
};

const resolveSchemaRef = (spec, schema) => {
	if (!schema || typeof schema !== 'object') return schema;
	if (!schema.$ref) return schema;
	const match = schema.$ref.match(/^#\/components\/schemas\/(.+)$/);
	if (!match) return schema;
	const key = match[1];
	return spec.components?.schemas?.[key] || schema;
};

const resolveParamRef = (spec, param) => {
	if (!param || typeof param !== 'object' || !param.$ref) return param;
	const match = param.$ref.match(/^#\/components\/parameters\/(.+)$/);
	if (!match) return param;
	const key = match[1];
	return spec.components?.parameters?.[key] || param;
};

const mapSchemaType = (spec, schema) => {
	const resolved = resolveSchemaRef(spec, schema) || {};
	const type = resolved.type;
	if (resolved.enum) return 'options';
	if (type === 'integer' || type === 'number') return 'number';
	if (type === 'boolean') return 'boolean';
	if (type === 'array' || type === 'object' || resolved.properties) return 'json';
	return 'string';
};

const mapSchemaToOptions = (spec, schema) => {
	const resolved = resolveSchemaRef(spec, schema) || {};
	if (!resolved || !resolved.enum) return [];
	return resolved.enum.map((value) => ({ name: String(value), value }));
};

const toFieldName = (prefix, name) => `${prefix}_${name}`.replace(/[^a-zA-Z0-9_]/g, '_');

const toFieldDisplayName = (name) => toTitleCase(name.replace(/[_\-]+/g, ' '));

const buildField = ({
	name,
	displayName,
	type,
	required,
	description,
	options,
	displayOptions,
}) => {
	const field = {
		displayName,
		name,
		type,
		default: type === 'boolean' ? false : type === 'number' ? 0 : type === 'json' ? {} : '',
		displayOptions,
	};
	if (required) field.required = true;
	if (description) field.description = description;
	if (type === 'options' && options) field.options = options;
	return field;
};

const getRequestBodySchema = (spec, operation) => {
	const requestBody = operation.requestBody;
	if (!requestBody || !requestBody.content) return null;
	const content = requestBody.content;
	const contentType =
		content['application/json'] ||
		content['application/*+json'] ||
		content['application/x-www-form-urlencoded'] ||
		Object.values(content)[0];
	if (!contentType || !contentType.schema) return null;
	return resolveSchemaRef(spec, contentType.schema);
};

const extractOperations = (spec) => {
	const operationsByTag = {};
	for (const [pathKey, pathItem] of Object.entries(spec.paths || {})) {
		for (const method of METHOD_ORDER) {
			const operation = pathItem[method];
			if (!operation) continue;
			const tags = Array.isArray(operation.tags) && operation.tags.length ? operation.tags : ['General'];
			const tag = tags[0];
			if (!operationsByTag[tag]) operationsByTag[tag] = [];

			const params = [
				...(Array.isArray(pathItem.parameters) ? pathItem.parameters : []),
				...(Array.isArray(operation.parameters) ? operation.parameters : []),
			].map((param) => resolveParamRef(spec, param)).filter(Boolean);

			operationsByTag[tag].push({
				method: method.toUpperCase(),
				path: pathKey,
				summary: toOperationLabel(method, pathKey, operation),
				params,
				requestBody: getRequestBodySchema(spec, operation),
				requestBodyRequired: operation.requestBody?.required === true,
			});
		}
	}
	return operationsByTag;
};

const buildNode = (fileName, spec) => {
	const nodeName = toNodeName(fileName);
	const displayName = toDisplayName(fileName);
	const operationsByTag = extractOperations(spec);
	const resources = Object.keys(operationsByTag).sort();

	const resourceOptions = resources.map((tag) => ({ name: toResourceLabel(tag), value: tag }));

	const properties = [];
	properties.push({
		displayName: 'Authentication',
		name: 'authentication',
		type: 'options',
		options: [
			{ name: 'OAuth2', value: 'oauth2' },
			{ name: 'API Key', value: 'apiKey' },
		],
		default: 'oauth2',
	});
	properties.push({
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		options: resourceOptions,
		default: resourceOptions[0]?.value || '',
		required: true,
		noDataExpression: true,
	});

	const operationsMap = {};
	const paginatedOperations = [];

	for (const resource of resources) {
		const ops = operationsByTag[resource];
		const operationOptions = ops.map((op) => ({
			name: op.summary,
			value: `${op.method} ${op.path}`,
		}));
		properties.push({
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			displayOptions: { show: { resource: [resource] } },
			options: operationOptions,
			default: operationOptions[0]?.value || '',
			noDataExpression: true,
		});

		operationsMap[resource] = {};

		for (const op of ops) {
			const operationValue = `${op.method} ${op.path}`;
			const displayOptions = { show: { resource: [resource], operation: [operationValue] } };

			const pathParams = op.params.filter((param) => param.in === 'path');
			const queryParams = op.params.filter((param) => param.in === 'query');

			const requiredQuery = queryParams.filter((param) => param.required);
			const optionalQuery = queryParams.filter((param) => !param.required);

			const pathParamFields = [];
			for (const param of pathParams) {
				const schema = param.schema || {};
				const type = mapSchemaType(spec, schema);
				const options = type === 'options' ? mapSchemaToOptions(spec, schema) : undefined;
				pathParamFields.push({ name: param.name, field: toFieldName('path', param.name) });
				properties.push(buildField({
					name: toFieldName('path', param.name),
					displayName: toFieldDisplayName(param.name),
					type,
					required: true,
					description: param.description,
					options,
					displayOptions,
				}));
			}

			const queryParamFields = [];
			for (const param of requiredQuery) {
				const schema = param.schema || {};
				const type = mapSchemaType(spec, schema);
				const options = type === 'options' ? mapSchemaToOptions(spec, schema) : undefined;
				queryParamFields.push({ name: param.name, field: toFieldName('query', param.name) });
				properties.push(buildField({
					name: toFieldName('query', param.name),
					displayName: toFieldDisplayName(param.name),
					type,
					required: true,
					description: param.description,
					options,
					displayOptions,
				}));
			}

			let optionalQueryCollectionName = null;
			if (optionalQuery.length) {
				optionalQueryCollectionName = `queryParameters`;
				properties.push({
					displayName: 'Additional Query Parameters',
					name: optionalQueryCollectionName,
					type: 'collection',
					placeholder: 'Add Parameter',
					default: {},
					displayOptions,
					options: optionalQuery.map((param) => {
						const schema = param.schema || {};
						const type = mapSchemaType(spec, schema);
						const options = type === 'options' ? mapSchemaToOptions(spec, schema) : undefined;
						return buildField({
							name: toFieldName('query', param.name),
							displayName: toFieldDisplayName(param.name),
							type,
							required: false,
							description: param.description,
							options,
							displayOptions: undefined,
						});
					}),
				});
			}

			const bodySchema = op.requestBody;
			const bodyFields = [];
			let bodyFieldName = null;
			let optionalBodyCollectionName = null;
			if (bodySchema) {
				const resolvedBody = resolveSchemaRef(spec, bodySchema);
				if (resolvedBody && resolvedBody.type === 'object' && resolvedBody.properties) {
					const requiredProps = Array.isArray(resolvedBody.required) ? resolvedBody.required : [];
					const bodyProps = Object.entries(resolvedBody.properties);
					for (const [propName, propSchema] of bodyProps) {
						const resolvedProp = resolveSchemaRef(spec, propSchema);
						const type = mapSchemaType(spec, resolvedProp);
						const options = type === 'options' ? mapSchemaToOptions(spec, resolvedProp) : undefined;
						const isRequired = requiredProps.includes(propName);
						bodyFields.push({ name: propName, field: toFieldName('body', propName) });
						if (isRequired) {
							properties.push(buildField({
								name: toFieldName('body', propName),
								displayName: toFieldDisplayName(propName),
								type,
								required: true,
								description: resolvedProp.description,
								options,
								displayOptions,
							}));
						}
					}

					const optionalBodyProps = bodyProps.filter(([propName]) => !resolvedBody.required?.includes(propName));
					if (optionalBodyProps.length) {
						optionalBodyCollectionName = 'bodyParameters';
						properties.push({
							displayName: 'Additional Body Fields',
							name: optionalBodyCollectionName,
							type: 'collection',
							placeholder: 'Add Field',
							default: {},
							displayOptions,
							options: optionalBodyProps.map(([propName, propSchema]) => {
								const resolvedProp = resolveSchemaRef(spec, propSchema);
								const type = mapSchemaType(spec, resolvedProp);
								const options = type === 'options' ? mapSchemaToOptions(spec, resolvedProp) : undefined;
								return buildField({
									name: toFieldName('body', propName),
									displayName: toFieldDisplayName(propName),
									type,
									required: false,
									description: resolvedProp.description,
									options,
									displayOptions: undefined,
								});
							}),
						});
					}
				} else {
					bodyFieldName = 'body';
					properties.push({
						displayName: 'Body',
						name: bodyFieldName,
						type: 'json',
						default: {},
						required: op.requestBodyRequired,
						displayOptions,
					});
				}
			}

			const queryNames = queryParams.map((param) => param.name);
			const pagination =
				queryNames.includes('limit') && queryNames.includes('skip')
					? 'limit-skip'
					: queryNames.includes('page') && queryNames.includes('per_page')
						? 'page-per-page'
						: 'none';
			if (pagination !== 'none' && op.method === 'GET') {
				paginatedOperations.push({ resource, operationValue });
			}

			operationsMap[resource][operationValue] = {
				method: op.method,
				path: op.path,
				pagination,
				pathParams: pathParamFields,
				queryParams: requiredQuery.map((param) => ({ name: param.name, field: toFieldName('query', param.name) })),
				optionalQueryCollectionName,
				bodyFields: bodyFields,
				optionalBodyCollectionName,
				bodyFieldName,
			};
		}
	}

	const paginationDisplayOptions = {
		show: {
			resource: paginatedOperations.map((entry) => entry.resource),
			operation: paginatedOperations.map((entry) => entry.operationValue),
		},
	};

	if (paginatedOperations.length) {
		properties.push({
			displayName: 'Return All',
			name: 'returnAll',
			type: 'boolean',
			default: true,
			displayOptions: paginationDisplayOptions,
		});
		properties.push({
			displayName: 'Limit',
			name: 'limit',
			type: 'number',
			default: 50,
			typeOptions: { minValue: 1, maxValue: 500 },
			displayOptions: {
				show: {
					...paginationDisplayOptions.show,
					returnAll: [false],
				},
			},
		});
	}

	properties.push({
		displayName: 'Return Full Response',
		name: 'returnFullResponse',
		type: 'boolean',
		default: false,
	});

	const iconKey = normalizeKey(fileName);
	const iconFile = ICON_MAP[iconKey] || 'k.svg';
	const iconPath = `file:../../icons/${iconFile}`;
	const fileContent = `import type { IDataObject, IExecuteFunctions, IHttpRequestMethods, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';\n` +
		`import { NodeApiError, NodeOperationError } from 'n8n-workflow';\n` +
		`import { infomaniakApiRequest, infomaniakApiRequestAllItems, infomaniakApiRequestAllPages, getInfomaniakItems } from '../shared/GenericFunctions';\n\n` +
		`type OperationDefinition = {\n` +
		`\tmethod: IHttpRequestMethods;\n` +
		`\tpath: string;\n` +
		`\tpagination: 'limit-skip' | 'page-per-page' | 'none';\n` +
		`\tpathParams: Array<{ name: string; field: string }>;\n` +
		`\tqueryParams: Array<{ name: string; field: string }>;\n` +
		`\toptionalQueryCollectionName: string | null;\n` +
		`\tbodyFields: Array<{ name: string; field: string }>;\n` +
		`\toptionalBodyCollectionName: string | null;\n` +
		`\tbodyFieldName: string | null;\n` +
		`};\n\n` +
		`const operations: Record<string, Record<string, OperationDefinition>> = ${JSON.stringify(operationsMap, null, 2)};\n\n` +
		`export class ${nodeName} implements INodeType {\n` +
		`\tdescription: INodeTypeDescription = ${JSON.stringify({
			displayName,
			name: nodeName[0].toLowerCase() + nodeName.slice(1),
			icon: iconPath,
			group: ['output'],
			version: 1,
			description: `Interact with ${displayName} API`,
			defaults: { name: displayName },
			inputs: ['main'],
			outputs: ['main'],
			credentials: [
				{
					name: 'infomaniakOAuth2Api',
					required: true,
					displayOptions: { show: { authentication: ['oauth2'] } },
				},
				{
					name: 'infomaniakApiKeyApi',
					required: true,
					displayOptions: { show: { authentication: ['apiKey'] } },
				},
			],
			properties,
		}, null, 2)};\n\n` +
		`\tasync execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {\n` +
		`\t\tconst items = this.getInputData();\n` +
		`\t\tconst returnData: INodeExecutionData[] = [];\n\n` +
		`\t\tfor (let i = 0; i < items.length; i++) {\n` +
		`\t\t\tconst resource = this.getNodeParameter('resource', i) as string;\n` +
		`\t\t\tconst operation = this.getNodeParameter('operation', i) as string;\n` +
		`\t\t\tconst operationDef = operations[resource]?.[operation];\n` +
		`\t\t\tif (!operationDef) {\n` +
		`\t\t\t\tthrow new NodeOperationError(this.getNode(), 'Operation not found');\n` +
		`\t\t\t}\n\n` +
		`\t\t\tconst method = operationDef.method as IHttpRequestMethods;\n` +
		`\t\t\tconst pathParams: Record<string, any> = {};\n` +
		`\t\t\tfor (const param of operationDef.pathParams) {\n` +
		`\t\t\t\tpathParams[param.name] = this.getNodeParameter(param.field, i);\n` +
		`\t\t\t}\n\n` +
		`\t\t\tconst qs: Record<string, any> = {};\n` +
		`\t\t\tfor (const param of operationDef.queryParams) {\n` +
		`\t\t\t\tqs[param.name] = this.getNodeParameter(param.field, i);\n` +
		`\t\t\t}\n` +
		`\t\t\tif (operationDef.optionalQueryCollectionName) {\n` +
		`\t\t\t\tconst optionalQuery = this.getNodeParameter(operationDef.optionalQueryCollectionName, i) || {};\n` +
		`\t\t\t\tfor (const [key, value] of Object.entries(optionalQuery as Record<string, any>)) {\n` +
		`\t\t\t\t\tconst rawKey = String(key).replace(/^query_/, '');\n` +
		`\t\t\t\t\tqs[rawKey] = value;\n` +
		`\t\t\t\t}\n` +
		`\t\t\t}\n\n` +
		`\t\t\tconst body: Record<string, any> = {};\n` +
		`\t\t\tif (operationDef.bodyFieldName) {\n` +
		`\t\t\t\tObject.assign(body, this.getNodeParameter(operationDef.bodyFieldName, i));\n` +
		`\t\t\t} else {\n` +
		`\t\t\t\tfor (const field of operationDef.bodyFields) {\n` +
		`\t\t\t\t\tbody[field.name] = this.getNodeParameter(field.field, i);\n` +
		`\t\t\t\t}\n` +
		`\t\t\t\tif (operationDef.optionalBodyCollectionName) {\n` +
		`\t\t\t\t\tconst optionalBody = this.getNodeParameter(operationDef.optionalBodyCollectionName, i) || {};\n` +
		`\t\t\t\t\tfor (const [key, value] of Object.entries(optionalBody as Record<string, any>)) {\n` +
		`\t\t\t\t\t\tconst rawKey = String(key).replace(/^body_/, '');\n` +
		`\t\t\t\t\t\tbody[rawKey] = value;\n` +
		`\t\t\t\t\t}\n` +
		`\t\t\t\t}\n` +
		`\t\t\t}\n\n` +
		`\t\t\tconst endpoint = operationDef.path.replace(/\\{([^}]+)\\}/g, (_: string, key: string) => {\n` +
		`\t\t\t\tconst value = pathParams[key];\n` +
		`\t\t\t\tif (value === undefined || value === null || value === '') {\n` +
		`\t\t\t\t\tthrow new NodeOperationError(this.getNode(), 'Missing required path parameter: ' + key);\n` +
		`\t\t\t\t}\n` +
		`\t\t\t\treturn encodeURIComponent(String(value));\n` +
		`\t\t\t});\n\n` +
		`\t\t\tconst returnFullResponse = this.getNodeParameter('returnFullResponse', i) as boolean;\n` +
		`\t\t\tconst hasPagination = ${paginatedOperations.length > 0};\n` +
		`\t\t\tconst returnAll = hasPagination ? (this.getNodeParameter('returnAll', i, true) as boolean) : false;\n` +
		`\t\t\tconst limit = hasPagination ? (this.getNodeParameter('limit', i, 50) as number) : 50;\n\n` +
		`\t\t\ttry {\n` +
		`\t\t\t\tlet response: IDataObject | IDataObject[];\n` +
		`\t\t\t\tif (returnAll && operationDef.pagination === 'limit-skip' && method === 'GET') {\n` +
		`\t\t\t\t\tresponse = await infomaniakApiRequestAllItems.call(this, method, endpoint, body, qs);\n` +
		`\t\t\t\t} else if (returnAll && operationDef.pagination === 'page-per-page' && method === 'GET') {\n` +
		`\t\t\t\t\tresponse = await infomaniakApiRequestAllPages.call(this, method, endpoint, body, qs);\n` +
		`\t\t\t\t} else {\n` +
		`\t\t\t\t\tif (!returnAll && operationDef.pagination === 'limit-skip' && method === 'GET') {\n` +
		`\t\t\t\t\t\tqs.limit = limit;\n` +
		`\t\t\t\t\t\tqs.skip = qs.skip ?? 0;\n` +
		`\t\t\t\t\t}\n` +
		`\t\t\t\t\tif (!returnAll && operationDef.pagination === 'page-per-page' && method === 'GET') {\n` +
		`\t\t\t\t\t\tqs.per_page = limit;\n` +
		`\t\t\t\t\t\tqs.page = qs.page ?? 1;\n` +
		`\t\t\t\t\t}\n` +
		`\t\t\t\t\tresponse = await infomaniakApiRequest.call(this, method, endpoint, body, qs);\n` +
		`\t\t\t\t}\n\n` +
		`\t\t\t\tconst output = Array.isArray(response)\n` +
		`\t\t\t\t\t? response\n` +
		`\t\t\t\t\t: returnFullResponse\n` +
		`\t\t\t\t\t\t? [response]\n` +
		`\t\t\t\t\t\t: getInfomaniakItems(response);\n` +
		`\t\t\t\tfor (const item of output) {\n` +
		`\t\t\t\t\treturnData.push({ json: item });\n` +
		`\t\t\t\t}\n` +
		`\t\t\t} catch (error) {\n` +
		`\t\t\t\tthrow new NodeApiError(this.getNode(), error);\n` +
		`\t\t\t}\n` +
		`\t\t}\n\n` +
		`\t\treturn [returnData];\n` +
		`\t}\n` +
		`}\n`;

	return { nodeName, fileContent, displayName };
};

const apiFiles = fs.readdirSync(apiDir).filter((file) => file.startsWith('infomaniak_api_') && file.endsWith('.json'));

const nodeEntries = [];

for (const fileName of apiFiles) {
	const spec = JSON.parse(fs.readFileSync(path.join(apiDir, fileName), 'utf8'));
	const { nodeName, fileContent } = buildNode(fileName, spec);
	const nodeDir = path.join(nodesDir, nodeName);
	fs.mkdirSync(nodeDir, { recursive: true });
	fs.writeFileSync(path.join(nodeDir, `${nodeName}.node.ts`), fileContent, 'utf8');
	nodeEntries.push(`dist/nodes/${nodeName}/${nodeName}.node.js`);
}

const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const credentials = pkg.n8n?.credentials || [
	'dist/credentials/InfomaniakApiKeyApi.credentials.js',
	'dist/credentials/InfomaniakOAuth2Api.credentials.js',
];

pkg.n8n = {
	...(pkg.n8n || {}),
	credentials,
	nodes: nodeEntries,
};

fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');

console.log('Generated nodes:', nodeEntries.length);
