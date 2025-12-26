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
  "Address": {
    "GET /2/etickets/address": {
      "method": "GET",
      "path": "/2/etickets/address",
      "pagination": "page-per-page",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Customer": {
    "GET /2/etickets/customers/{customer_id}/logs": {
      "method": "GET",
      "path": "/2/etickets/customers/{customer_id}/logs",
      "pagination": "none",
      "pathParams": [
        {
          "name": "customer_id",
          "field": "path_customer_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Date": {
    "GET /2/etickets/date": {
      "method": "GET",
      "path": "/2/etickets/date",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Reservation": {
    "GET /2/etickets/reservation/{reservation_id}": {
      "method": "GET",
      "path": "/2/etickets/reservation/{reservation_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "reservation_id",
          "field": "path_reservation_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/etickets/reservation/{reservation_uuid}": {
      "method": "GET",
      "path": "/2/etickets/reservation/{reservation_uuid}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "reservation_id",
          "field": "path_reservation_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Survey": {
    "GET /2/etickets/surveys": {
      "method": "GET",
      "path": "/2/etickets/surveys",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/etickets/surveys/answers/tickets": {
      "method": "GET",
      "path": "/2/etickets/surveys/answers/tickets",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PATCH /2/etickets/surveys/answers/tickets": {
      "method": "PATCH",
      "path": "/2/etickets/surveys/answers/tickets",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "answers",
          "field": "body_answers"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /2/etickets/surveys/answers/passes": {
      "method": "GET",
      "path": "/2/etickets/surveys/answers/passes",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PATCH /2/etickets/surveys/answers/passes": {
      "method": "PATCH",
      "path": "/2/etickets/surveys/answers/passes",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "answers",
          "field": "body_answers"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Ticket": {
    "PATCH /2/etickets/ticket": {
      "method": "PATCH",
      "path": "/2/etickets/ticket",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "tickets",
          "field": "body_tickets"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  }
};

export class InfomaniakEticket implements INodeType {
	description: INodeTypeDescription = {
  "displayName": "Infomaniak Eticket",
  "name": "infomaniakEticket",
  "icon": "file:../../icons/etickets.svg",
  "group": [
    "output"
  ],
  "version": 1,
  "description": "Interact with Infomaniak Eticket API",
  "defaults": {
    "name": "Infomaniak Eticket"
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
          "name": "Address",
          "value": "Address"
        },
        {
          "name": "Customer",
          "value": "Customer"
        },
        {
          "name": "Date",
          "value": "Date"
        },
        {
          "name": "Reservation",
          "value": "Reservation"
        },
        {
          "name": "Survey",
          "value": "Survey"
        },
        {
          "name": "Ticket",
          "value": "Ticket"
        }
      ],
      "default": "Address",
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
            "Address"
          ]
        }
      },
      "options": [
        {
          "name": "List Addresses",
          "value": "GET /2/etickets/address"
        }
      ],
      "default": "GET /2/etickets/address",
      "noDataExpression": true
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Address"
          ],
          "operation": [
            "GET /2/etickets/address"
          ]
        }
      },
      "options": [
        {
          "displayName": "With",
          "name": "query_with",
          "type": "string",
          "default": "",
          "description": "*Optional* : Allows loading additional data about a resource, which may include related resources."
        },
        {
          "displayName": "Filters",
          "name": "query_filters",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order For",
          "name": "query_order_for",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Return",
          "name": "query_return",
          "type": "options",
          "default": "",
          "description": "*Optional* :  If you pass this parameter with the value `total`, then the response will be the number of items in the collection, instead of the items themselves.<br />\nPart of the `total` capacity\n",
          "options": [
            {
              "name": "total",
              "value": "total"
            }
          ]
        },
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "*Optional parameter* that define the page number<br />\nPart of the `pagination` capacity\n"
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "*Optional parameter* that define the number of items per page<br />\nPart of the `pagination` capacity\n"
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
            "Customer"
          ]
        }
      },
      "options": [
        {
          "name": "List Customer Email Logs",
          "value": "GET /2/etickets/customers/{customer_id}/logs"
        }
      ],
      "default": "GET /2/etickets/customers/{customer_id}/logs",
      "noDataExpression": true
    },
    {
      "displayName": "Customer Id",
      "name": "path_customer_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Customer"
          ],
          "operation": [
            "GET /2/etickets/customers/{customer_id}/logs"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Customer"
          ],
          "operation": [
            "GET /2/etickets/customers/{customer_id}/logs"
          ]
        }
      },
      "options": [
        {
          "displayName": "With",
          "name": "query_with",
          "type": "string",
          "default": "",
          "description": "*Optional* : Allows loading additional data about a resource, which may include related resources."
        },
        {
          "displayName": "Order For",
          "name": "query_order_for",
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
            "Date"
          ]
        }
      },
      "options": [
        {
          "name": "List Dates",
          "value": "GET /2/etickets/date"
        }
      ],
      "default": "GET /2/etickets/date",
      "noDataExpression": true
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Date"
          ],
          "operation": [
            "GET /2/etickets/date"
          ]
        }
      },
      "options": [
        {
          "displayName": "With",
          "name": "query_with",
          "type": "string",
          "default": "",
          "description": "*Optional* : Allows loading additional data about a resource, which may include related resources."
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
            "Reservation"
          ]
        }
      },
      "options": [
        {
          "name": "Get Reservation",
          "value": "GET /2/etickets/reservation/{reservation_id}"
        },
        {
          "name": "Get Reservation",
          "value": "GET /2/etickets/reservation/{reservation_uuid}"
        }
      ],
      "default": "GET /2/etickets/reservation/{reservation_id}",
      "noDataExpression": true
    },
    {
      "displayName": "Reservation Id",
      "name": "path_reservation_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Reservation"
          ],
          "operation": [
            "GET /2/etickets/reservation/{reservation_id}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Reservation"
          ],
          "operation": [
            "GET /2/etickets/reservation/{reservation_id}"
          ]
        }
      },
      "options": [
        {
          "displayName": "With",
          "name": "query_with",
          "type": "string",
          "default": "",
          "description": "*Optional* : Allows loading additional data about a resource, which may include related resources."
        }
      ]
    },
    {
      "displayName": "Reservation Id",
      "name": "path_reservation_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Reservation"
          ],
          "operation": [
            "GET /2/etickets/reservation/{reservation_uuid}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Reservation"
          ],
          "operation": [
            "GET /2/etickets/reservation/{reservation_uuid}"
          ]
        }
      },
      "options": [
        {
          "displayName": "With",
          "name": "query_with",
          "type": "string",
          "default": "",
          "description": "*Optional* : Allows loading additional data about a resource, which may include related resources."
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
            "Survey"
          ]
        }
      },
      "options": [
        {
          "name": "List Survey",
          "value": "GET /2/etickets/surveys"
        },
        {
          "name": "List Survey Ticket Answers",
          "value": "GET /2/etickets/surveys/answers/tickets"
        },
        {
          "name": "Patch Survey Ticket Answers",
          "value": "PATCH /2/etickets/surveys/answers/tickets"
        },
        {
          "name": "List Survey Pass Answers",
          "value": "GET /2/etickets/surveys/answers/passes"
        },
        {
          "name": "Patch Survey Ticket Answers",
          "value": "PATCH /2/etickets/surveys/answers/passes"
        }
      ],
      "default": "GET /2/etickets/surveys",
      "noDataExpression": true
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Survey"
          ],
          "operation": [
            "GET /2/etickets/surveys"
          ]
        }
      },
      "options": [
        {
          "displayName": "With",
          "name": "query_with",
          "type": "string",
          "default": "",
          "description": "*Optional* : Allows loading additional data about a resource, which may include related resources."
        },
        {
          "displayName": "Filters",
          "name": "query_filters",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order For",
          "name": "query_order_for",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Survey"
          ],
          "operation": [
            "GET /2/etickets/surveys/answers/tickets"
          ]
        }
      },
      "options": [
        {
          "displayName": "With",
          "name": "query_with",
          "type": "string",
          "default": "",
          "description": "*Optional* : Allows loading additional data about a resource, which may include related resources."
        },
        {
          "displayName": "Filters",
          "name": "query_filters",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order For",
          "name": "query_order_for",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Survey"
          ],
          "operation": [
            "PATCH /2/etickets/surveys/answers/tickets"
          ]
        }
      },
      "options": [
        {
          "displayName": "With",
          "name": "query_with",
          "type": "string",
          "default": "",
          "description": "*Optional* : Allows loading additional data about a resource, which may include related resources."
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
            "Survey"
          ],
          "operation": [
            "PATCH /2/etickets/surveys/answers/tickets"
          ]
        }
      },
      "options": [
        {
          "displayName": "Answers",
          "name": "body_answers",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Survey"
          ],
          "operation": [
            "GET /2/etickets/surveys/answers/passes"
          ]
        }
      },
      "options": [
        {
          "displayName": "With",
          "name": "query_with",
          "type": "string",
          "default": "",
          "description": "*Optional* : Allows loading additional data about a resource, which may include related resources."
        },
        {
          "displayName": "Filters",
          "name": "query_filters",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order For",
          "name": "query_order_for",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Survey"
          ],
          "operation": [
            "PATCH /2/etickets/surveys/answers/passes"
          ]
        }
      },
      "options": [
        {
          "displayName": "With",
          "name": "query_with",
          "type": "string",
          "default": "",
          "description": "*Optional* : Allows loading additional data about a resource, which may include related resources."
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
            "Survey"
          ],
          "operation": [
            "PATCH /2/etickets/surveys/answers/passes"
          ]
        }
      },
      "options": [
        {
          "displayName": "Answers",
          "name": "body_answers",
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
            "Ticket"
          ]
        }
      },
      "options": [
        {
          "name": "Edit Ticket",
          "value": "PATCH /2/etickets/ticket"
        }
      ],
      "default": "PATCH /2/etickets/ticket",
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
            "Ticket"
          ],
          "operation": [
            "PATCH /2/etickets/ticket"
          ]
        }
      },
      "options": [
        {
          "displayName": "Tickets",
          "name": "body_tickets",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Return All",
      "name": "returnAll",
      "type": "boolean",
      "default": true,
      "displayOptions": {
        "show": {
          "resource": [
            "Address"
          ],
          "operation": [
            "GET /2/etickets/address"
          ]
        }
      }
    },
    {
      "displayName": "Limit",
      "name": "limit",
      "type": "number",
      "default": 50,
      "typeOptions": {
        "minValue": 1,
        "maxValue": 500
      },
      "displayOptions": {
        "show": {
          "resource": [
            "Address"
          ],
          "operation": [
            "GET /2/etickets/address"
          ],
          "returnAll": [
            false
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
			const hasPagination = true;
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
