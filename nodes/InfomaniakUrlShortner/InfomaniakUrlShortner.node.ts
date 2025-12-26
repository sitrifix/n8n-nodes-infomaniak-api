import type { IDataObject, IExecuteFunctions, IHttpRequestMethods, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import { infomaniakApiRequest, infomaniakApiRequestAllItems, infomaniakApiRequestAllPages, getInfomaniakItems } from '../shared/GenericFunctions';

type OperationDefinition = {
	method: IHttpRequestMethods;
	path: string;
	pagination: 'limit-skip' | 'page-per-page' | 'none';
	pathParams: Array<{ name: string; field: string }>;
	queryParams: Array<{ name: string; field: string }>;
	optionalQueryCollectionName: string | null;
	bodyFields: Array<{ name: string; field: string }>;
	optionalBodyCollectionName: string | null;
	bodyFieldName: string | null;
};

const operations: Record<string, Record<string, OperationDefinition>> = {
  "Short URL": {
    "List Short Urls": {
      "method": "GET",
      "path": "/1/url-shortener",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "order_by",
          "field": "body_order_by"
        },
        {
          "name": "order_direction",
          "field": "body_order_direction"
        },
        {
          "name": "search",
          "field": "body_search"
        },
        {
          "name": "per_page",
          "field": "body_per_page"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Create A Short URL": {
      "method": "POST",
      "path": "/1/url-shortener",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "url",
          "field": "body_url"
        },
        {
          "name": "expiration_date",
          "field": "body_expiration_date"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "List Short Urls (2)": {
      "method": "GET",
      "path": "/2/url-shortener",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "order_by",
          "field": "body_order_by"
        },
        {
          "name": "order_direction",
          "field": "body_order_direction"
        },
        {
          "name": "search",
          "field": "body_search"
        },
        {
          "name": "per_page",
          "field": "body_per_page"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Create A Short URL (2)": {
      "method": "POST",
      "path": "/2/url-shortener",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "url",
          "field": "body_url"
        },
        {
          "name": "expiration_date",
          "field": "body_expiration_date"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Update A Short URL": {
      "method": "PUT",
      "path": "/1/url-shortener/{short_url_code}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "short_url_code",
          "field": "path_short_url_code"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": "body"
    },
    "Get Short URL Quota": {
      "method": "GET",
      "path": "/1/url-shortener/quota",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Get Short URL Quota (2)": {
      "method": "GET",
      "path": "/2/url-shortener/quota",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  }
};

export class InfomaniakUrlShortner implements INodeType {
	description: INodeTypeDescription = {
  "displayName": "Infomaniak URL Shortner",
  "name": "infomaniakUrlShortner",
  "icon": "file:../../icons/url-short.svg",
  "group": [
    "output"
  ],
  "version": 1,
  "description": "Interact with Infomaniak URL Shortner API",
  "defaults": {
    "name": "Infomaniak URL Shortner"
  },
  "inputs": [
    "main"
  ],
  "outputs": [
    "main"
  ],
  "credentials": [
    {
      "name": "infomaniakOAuth2Api",
      "required": true,
      "displayOptions": {
        "show": {
          "authentication": [
            "oauth2"
          ]
        }
      }
    },
    {
      "name": "infomaniakApiKeyApi",
      "required": true,
      "displayOptions": {
        "show": {
          "authentication": [
            "apiKey"
          ]
        }
      }
    }
  ],
  "properties": [
    {
      "displayName": "Authentication",
      "name": "authentication",
      "type": "options",
      "options": [
        {
          "name": "OAuth2",
          "value": "oauth2"
        },
        {
          "name": "API Key",
          "value": "apiKey"
        }
      ],
      "default": "oauth2"
    },
    {
      "displayName": "Resource",
      "name": "resource",
      "type": "options",
      "options": [
        {
          "name": "Short URL",
          "value": "Short URL"
        }
      ],
      "default": "Short URL",
      "required": true,
      "noDataExpression": true
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Short URL"
          ]
        }
      },
      "options": [
        {
          "name": "List Short Urls",
          "value": "List Short Urls"
        },
        {
          "name": "Create A Short URL",
          "value": "Create A Short URL"
        },
        {
          "name": "List Short Urls",
          "value": "List Short Urls (2)"
        },
        {
          "name": "Create A Short URL",
          "value": "Create A Short URL (2)"
        },
        {
          "name": "Update A Short URL",
          "value": "Update A Short URL"
        },
        {
          "name": "Get Short URL Quota",
          "value": "Get Short URL Quota"
        },
        {
          "name": "Get Short URL Quota",
          "value": "Get Short URL Quota (2)"
        }
      ],
      "default": "List Short Urls",
      "noDataExpression": true
    },
    {
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Short URL"
          ],
          "operation": [
            "List Short Urls"
          ]
        }
      },
      "options": [
        {
          "displayName": "Order By",
          "name": "body_order_by",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "code",
              "value": "code"
            },
            {
              "name": "url",
              "value": "url"
            },
            {
              "name": "created_at",
              "value": "created_at"
            },
            {
              "name": "expiration_date",
              "value": "expiration_date"
            }
          ]
        },
        {
          "displayName": "Order Direction",
          "name": "body_order_direction",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "ASC",
              "value": "ASC"
            },
            {
              "name": "DESC",
              "value": "DESC"
            }
          ]
        },
        {
          "displayName": "Search",
          "name": "body_search",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Per Page",
          "name": "body_per_page",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Url",
      "name": "body_url",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Short URL"
          ],
          "operation": [
            "Create A Short URL"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Short URL"
          ],
          "operation": [
            "Create A Short URL"
          ]
        }
      },
      "options": [
        {
          "displayName": "Expiration Date",
          "name": "body_expiration_date",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Short URL"
          ],
          "operation": [
            "List Short Urls (2)"
          ]
        }
      },
      "options": [
        {
          "displayName": "Order By",
          "name": "body_order_by",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "code",
              "value": "code"
            },
            {
              "name": "url",
              "value": "url"
            },
            {
              "name": "created_at",
              "value": "created_at"
            },
            {
              "name": "expiration_date",
              "value": "expiration_date"
            }
          ]
        },
        {
          "displayName": "Order Direction",
          "name": "body_order_direction",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "ASC",
              "value": "ASC"
            },
            {
              "name": "DESC",
              "value": "DESC"
            }
          ]
        },
        {
          "displayName": "Search",
          "name": "body_search",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Per Page",
          "name": "body_per_page",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Url",
      "name": "body_url",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Short URL"
          ],
          "operation": [
            "Create A Short URL (2)"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Short URL"
          ],
          "operation": [
            "Create A Short URL (2)"
          ]
        }
      },
      "options": [
        {
          "displayName": "Expiration Date",
          "name": "body_expiration_date",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Short Url Code",
      "name": "path_short_url_code",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Short URL"
          ],
          "operation": [
            "Update A Short URL"
          ]
        }
      },
      "required": true,
      "description": "Short url code"
    },
    {
      "displayName": "Body",
      "name": "body",
      "type": "json",
      "default": {},
      "required": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Short URL"
          ],
          "operation": [
            "Update A Short URL"
          ]
        }
      }
    },
    {
      "displayName": "Return Full Response",
      "name": "returnFullResponse",
      "type": "boolean",
      "default": false
    }
  ]
};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;
			const operationDef = operations[resource]?.[operation];
			if (!operationDef) {
				throw new NodeOperationError(this.getNode(), 'Operation not found');
			}

			const method = operationDef.method as IHttpRequestMethods;
			const pathParams: Record<string, any> = {};
			for (const param of operationDef.pathParams) {
				pathParams[param.name] = this.getNodeParameter(param.field, i);
			}

			const qs: Record<string, any> = {};
			for (const param of operationDef.queryParams) {
				qs[param.name] = this.getNodeParameter(param.field, i);
			}
			if (operationDef.optionalQueryCollectionName) {
				const optionalQuery = this.getNodeParameter(operationDef.optionalQueryCollectionName, i) || {};
				for (const [key, value] of Object.entries(optionalQuery as Record<string, any>)) {
					const rawKey = String(key).replace(/^query_/, '');
					qs[rawKey] = value;
				}
			}

			const body: Record<string, any> = {};
			if (operationDef.bodyFieldName) {
				Object.assign(body, this.getNodeParameter(operationDef.bodyFieldName, i));
			} else {
				for (const field of operationDef.bodyFields) {
					body[field.name] = this.getNodeParameter(field.field, i);
				}
				if (operationDef.optionalBodyCollectionName) {
					const optionalBody = this.getNodeParameter(operationDef.optionalBodyCollectionName, i) || {};
					for (const [key, value] of Object.entries(optionalBody as Record<string, any>)) {
						const rawKey = String(key).replace(/^body_/, '');
						body[rawKey] = value;
					}
				}
			}

			const endpoint = operationDef.path.replace(/\{([^}]+)\}/g, (_: string, key: string) => {
				const value = pathParams[key];
				if (value === undefined || value === null || value === '') {
					throw new NodeOperationError(this.getNode(), 'Missing required path parameter: ' + key);
				}
				return encodeURIComponent(String(value));
			});

			const returnFullResponse = this.getNodeParameter('returnFullResponse', i) as boolean;
			const hasPagination = false;
			const returnAll = hasPagination ? (this.getNodeParameter('returnAll', i, true) as boolean) : false;
			const limit = hasPagination ? (this.getNodeParameter('limit', i, 50) as number) : 50;

			try {
				let response: IDataObject | IDataObject[];
				if (returnAll && operationDef.pagination === 'limit-skip' && method === 'GET') {
					response = await infomaniakApiRequestAllItems.call(this, method, endpoint, body, qs);
				} else if (returnAll && operationDef.pagination === 'page-per-page' && method === 'GET') {
					response = await infomaniakApiRequestAllPages.call(this, method, endpoint, body, qs);
				} else {
					if (!returnAll && operationDef.pagination === 'limit-skip' && method === 'GET') {
						qs.limit = limit;
						qs.skip = qs.skip ?? 0;
					}
					if (!returnAll && operationDef.pagination === 'page-per-page' && method === 'GET') {
						qs.per_page = limit;
						qs.page = qs.page ?? 1;
					}
					response = await infomaniakApiRequest.call(this, method, endpoint, body, qs);
				}

				const output = Array.isArray(response)
					? response
					: returnFullResponse
						? [response]
						: getInfomaniakItems(response);
				for (const item of output) {
					returnData.push({ json: item });
				}
			} catch (error) {
				throw new NodeApiError(this.getNode(), error);
			}
		}

		return [returnData];
	}
}
