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
  "Plan A Conference": {
    "Plan A Conference": {
      "method": "POST",
      "path": "/1/kmeet/rooms",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "calendar_id",
          "field": "body_calendar_id"
        },
        {
          "name": "starting_at",
          "field": "body_starting_at"
        },
        {
          "name": "ending_at",
          "field": "body_ending_at"
        },
        {
          "name": "timezone",
          "field": "body_timezone"
        },
        {
          "name": "hostname",
          "field": "body_hostname"
        },
        {
          "name": "title",
          "field": "body_title"
        },
        {
          "name": "options",
          "field": "body_options"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Room Settings": {
    "Get Room Settings": {
      "method": "GET",
      "path": "/1/kmeet/rooms/{room_id}/settings",
      "pagination": "none",
      "pathParams": [
        {
          "name": "room_id",
          "field": "path_room_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  }
};

export class InfomaniakKMeet implements INodeType {
	description: INodeTypeDescription = {
  "displayName": "Infomaniak KMeet",
  "name": "infomaniakKMeet",
  "icon": "file:../../icons/meet.svg",
  "group": [
    "output"
  ],
  "version": 1,
  "description": "Interact with Infomaniak KMeet API",
  "defaults": {
    "name": "Infomaniak KMeet"
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
          "name": "Plan A Conference",
          "value": "Plan A Conference"
        },
        {
          "name": "Room Settings",
          "value": "Room Settings"
        }
      ],
      "default": "Plan A Conference",
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
            "Plan A Conference"
          ]
        }
      },
      "options": [
        {
          "name": "Plan A Conference",
          "value": "Plan A Conference"
        }
      ],
      "default": "Plan A Conference",
      "noDataExpression": true
    },
    {
      "displayName": "Calendar Id",
      "name": "body_calendar_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Plan A Conference"
          ],
          "operation": [
            "Plan A Conference"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the Infomaniak Calendar where you want to plan the meeting. Make a GET request on https://calendar.infomaniak.com/api/pim/calendar"
    },
    {
      "displayName": "Starting At",
      "name": "body_starting_at",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Plan A Conference"
          ],
          "operation": [
            "Plan A Conference"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Ending At",
      "name": "body_ending_at",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Plan A Conference"
          ],
          "operation": [
            "Plan A Conference"
          ]
        }
      },
      "required": true,
      "description": "Room settings can be deleted if this date expires. This field will be updated if event dates change in Infomaniak Calendar."
    },
    {
      "displayName": "Timezone",
      "name": "body_timezone",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Plan A Conference"
          ],
          "operation": [
            "Plan A Conference"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Hostname",
      "name": "body_hostname",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Plan A Conference"
          ],
          "operation": [
            "Plan A Conference"
          ]
        }
      },
      "required": true,
      "description": "Needed for rebuilding room url"
    },
    {
      "displayName": "Title",
      "name": "body_title",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Plan A Conference"
          ],
          "operation": [
            "Plan A Conference"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Options",
      "name": "body_options",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Plan A Conference"
          ],
          "operation": [
            "Plan A Conference"
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
            "Plan A Conference"
          ],
          "operation": [
            "Plan A Conference"
          ]
        }
      },
      "options": [
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Attendees",
          "name": "body_attendees",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Room Settings"
          ]
        }
      },
      "options": [
        {
          "name": "Get Room Settings",
          "value": "Get Room Settings"
        }
      ],
      "default": "Get Room Settings",
      "noDataExpression": true
    },
    {
      "displayName": "Room Id",
      "name": "path_room_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Room Settings"
          ],
          "operation": [
            "Get Room Settings"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the room settings"
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
