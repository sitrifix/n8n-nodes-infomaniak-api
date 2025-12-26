import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

const BASE_URL = 'https://api.infomaniak.com';
const DEFAULT_TIMEOUT = 30000;
const DEFAULT_PAGE_SIZE = 100;
const MAX_RETRIES = 3;

const wait = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const removeEmptyValues = (input: IDataObject = {}) => {
	const cleaned: IDataObject = {};
	for (const [key, value] of Object.entries(input)) {
		if (value === undefined || value === null || value === '') {
			continue;
		}
		cleaned[key] = value as IDataObject;
	}
	return cleaned;
};

const extractData = (response: IDataObject) => {
	if (response?.data !== undefined) {
		return response.data;
	}
	return response;
};

const toItemsArray = (response: IDataObject): IDataObject[] => {
	const data = extractData(response);
	if (Array.isArray(data)) {
		return data as IDataObject[];
	}
	if (data && typeof data === 'object') {
		return [data as IDataObject];
	}
	return [];
};

type RequestError = {
	statusCode?: number;
	response?: {
		statusCode?: number;
		status?: number;
		headers?: Record<string, string>;
	};
};

export async function infomaniakApiRequest(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject> {
	const authType = this.getNodeParameter('authentication', 0) as string;
	const credentialType = authType === 'oauth2' ? 'infomaniakOAuth2Api' : 'infomaniakApiKeyApi';

	const options: IHttpRequestOptions = {
		method,
		url: endpoint,
		baseURL: BASE_URL,
		qs: removeEmptyValues(qs),
		body: removeEmptyValues(body),
		json: true,
		timeout: DEFAULT_TIMEOUT,
	};

	if (!Object.keys(options.body as IDataObject).length) {
		delete options.body;
	}

	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
		try {
			const response = await this.helpers.requestWithAuthentication.call(
				this,
				credentialType,
				options,
			);

			if (response?.result && response.result !== 'success') {
				throw new NodeApiError(this.getNode(), response as JsonObject);
			}

			return response as IDataObject;
		} catch (error) {
			const requestError = error as RequestError;
			const statusCode =
				requestError?.response?.statusCode ||
				requestError?.statusCode ||
				requestError?.response?.status;

			const isRetryable = statusCode === 429 || statusCode === 503 || statusCode === 504;
			if (!isRetryable || attempt === MAX_RETRIES) {
				throw new NodeApiError(this.getNode(), error as JsonObject);
			}

			const retryAfterHeader =
				requestError?.response?.headers?.['retry-after'] ||
				requestError?.response?.headers?.['Retry-After'];
			const retryAfterSeconds = Number.parseInt(retryAfterHeader || '0', 10);
			const backoffMs = Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
				? retryAfterSeconds * 1000
				: 1000 * (attempt + 1);
			await wait(backoffMs);
		}
	}

	throw new NodeApiError(this.getNode(), {
		message: 'Request failed after retries.',
	} as JsonObject);
}

export async function infomaniakApiRequestAllItems(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
) {
	const returnData: IDataObject[] = [];
	let skip = 0;
	let hasMore = true;

	while (hasMore) {
		const response = await infomaniakApiRequest.call(this, method, endpoint, body, {
			...qs,
			limit: DEFAULT_PAGE_SIZE,
			skip,
		});
		const items = toItemsArray(response);
		returnData.push(...items);
		hasMore = items.length === DEFAULT_PAGE_SIZE;
		skip += DEFAULT_PAGE_SIZE;
	}

	return returnData;
}

export async function infomaniakApiRequestAllPages(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
) {
	const returnData: IDataObject[] = [];
	let page = 1;
	let hasMore = true;

	while (hasMore) {
		const response = await infomaniakApiRequest.call(this, method, endpoint, body, {
			...qs,
			per_page: DEFAULT_PAGE_SIZE,
			page,
		});
		const items = toItemsArray(response);
		returnData.push(...items);
		hasMore = items.length === DEFAULT_PAGE_SIZE;
		page += 1;
	}

	return returnData;
}

export const getInfomaniakItems = (response: IDataObject) => toItemsArray(response);
