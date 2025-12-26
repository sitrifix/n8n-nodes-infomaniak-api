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
  "Administrator": {
    "Create Administrator": {
      "method": "POST",
      "path": "/1/swiss_backups/{swiss_backup_id}/admin",
      "pagination": "none",
      "pathParams": [
        {
          "name": "swiss_backup_id",
          "field": "path_swiss_backup_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "email",
          "field": "body_email"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update Administrator": {
      "method": "PUT",
      "path": "/1/swiss_backups/{swiss_backup_id}/admin",
      "pagination": "none",
      "pathParams": [
        {
          "name": "swiss_backup_id",
          "field": "path_swiss_backup_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "email",
          "field": "body_email"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Billing": {
    "List Prices And Discounts": {
      "method": "GET",
      "path": "/1/swiss_backups/pricing",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Calculate The Price": {
      "method": "GET",
      "path": "/1/swiss_backups/calculate",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [
        {
          "name": "size",
          "field": "query_size"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Passwords": {
    "Request Administrator Password": {
      "method": "POST",
      "path": "/1/swiss_backups/{swiss_backup_id}/admin/request_password",
      "pagination": "none",
      "pathParams": [
        {
          "name": "swiss_backup_id",
          "field": "path_swiss_backup_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Request Slot Password": {
      "method": "POST",
      "path": "/1/swiss_backups/{swiss_backup_id}/slots/{slot_id}/request_password",
      "pagination": "none",
      "pathParams": [
        {
          "name": "swiss_backup_id",
          "field": "path_swiss_backup_id"
        },
        {
          "name": "slot_id",
          "field": "path_slot_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Product Management": {
    "List All Swiss Backups": {
      "method": "GET",
      "path": "/1/swiss_backups",
      "pagination": "limit-skip",
      "pathParams": [],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Swiss Backup Information": {
      "method": "GET",
      "path": "/1/swiss_backups/{swiss_backup_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "swiss_backup_id",
          "field": "path_swiss_backup_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update A Swiss Backup": {
      "method": "PUT",
      "path": "/1/swiss_backups/{swiss_backup_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "swiss_backup_id",
          "field": "path_swiss_backup_id"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "periodicity",
          "field": "body_periodicity"
        },
        {
          "name": "storage_reserved_acronis",
          "field": "body_storage_reserved_acronis"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Acronis Information": {
      "method": "GET",
      "path": "/1/swiss_backups/{swiss_backup_id}/acronis_informations",
      "pagination": "none",
      "pathParams": [
        {
          "name": "swiss_backup_id",
          "field": "path_swiss_backup_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Slots": {
    "List All Slots": {
      "method": "GET",
      "path": "/1/swiss_backups/{swiss_backup_id}/slots",
      "pagination": "none",
      "pathParams": [
        {
          "name": "swiss_backup_id",
          "field": "path_swiss_backup_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create": {
      "method": "POST",
      "path": "/1/swiss_backups/{swiss_backup_id}/slots",
      "pagination": "none",
      "pathParams": [
        {
          "name": "swiss_backup_id",
          "field": "path_swiss_backup_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "connection_type",
          "field": "body_connection_type"
        },
        {
          "name": "customer_name",
          "field": "body_customer_name"
        },
        {
          "name": "email",
          "field": "body_email"
        },
        {
          "name": "firstname",
          "field": "body_firstname"
        },
        {
          "name": "lang",
          "field": "body_lang"
        },
        {
          "name": "lastname",
          "field": "body_lastname"
        },
        {
          "name": "size",
          "field": "body_size"
        },
        {
          "name": "type",
          "field": "body_type"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Disable": {
      "method": "POST",
      "path": "/1/swiss_backups/{swiss_backup_id}/slots/{slot_id}/disable",
      "pagination": "none",
      "pathParams": [
        {
          "name": "swiss_backup_id",
          "field": "path_swiss_backup_id"
        },
        {
          "name": "slot_id",
          "field": "path_slot_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Enable": {
      "method": "POST",
      "path": "/1/swiss_backups/{swiss_backup_id}/slots/{slot_id}/enable",
      "pagination": "none",
      "pathParams": [
        {
          "name": "swiss_backup_id",
          "field": "path_swiss_backup_id"
        },
        {
          "name": "slot_id",
          "field": "path_slot_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Slot Information": {
      "method": "GET",
      "path": "/1/swiss_backups/{swiss_backup_id}/slots/{slot_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "swiss_backup_id",
          "field": "path_swiss_backup_id"
        },
        {
          "name": "slot_id",
          "field": "path_slot_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update": {
      "method": "PUT",
      "path": "/1/swiss_backups/{swiss_backup_id}/slots/{slot_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "swiss_backup_id",
          "field": "path_swiss_backup_id"
        },
        {
          "name": "slot_id",
          "field": "path_slot_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "activate_notifications",
          "field": "body_activate_notifications"
        },
        {
          "name": "customer_name",
          "field": "body_customer_name"
        },
        {
          "name": "email",
          "field": "body_email"
        },
        {
          "name": "lang",
          "field": "body_lang"
        },
        {
          "name": "send_mail",
          "field": "body_send_mail"
        },
        {
          "name": "size",
          "field": "body_size"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete": {
      "method": "DELETE",
      "path": "/1/swiss_backups/{swiss_backup_id}/slots/{slot_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "swiss_backup_id",
          "field": "path_swiss_backup_id"
        },
        {
          "name": "slot_id",
          "field": "path_slot_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "RClone Details": {
      "method": "GET",
      "path": "/1/swiss_backups/{swiss_backup_id}/slots/{slot_id}/rclone",
      "pagination": "none",
      "pathParams": [
        {
          "name": "swiss_backup_id",
          "field": "path_swiss_backup_id"
        },
        {
          "name": "slot_id",
          "field": "path_slot_id"
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

export class InfomaniakSwissBackup implements INodeType {
	description: INodeTypeDescription = {
  "displayName": "Infomaniak Swiss Backup",
  "name": "infomaniakSwissBackup",
  "icon": "file:../../icons/swiss-backup.svg",
  "group": [
    "output"
  ],
  "version": 1,
  "description": "Interact with Infomaniak Swiss Backup API",
  "defaults": {
    "name": "Infomaniak Swiss Backup"
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
          "name": "Administrator",
          "value": "Administrator"
        },
        {
          "name": "Billing",
          "value": "Billing"
        },
        {
          "name": "Passwords",
          "value": "Passwords"
        },
        {
          "name": "Product Management",
          "value": "Product Management"
        },
        {
          "name": "Slots",
          "value": "Slots"
        }
      ],
      "default": "Administrator",
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
            "Administrator"
          ]
        }
      },
      "options": [
        {
          "name": "Create Administrator",
          "value": "Create Administrator"
        },
        {
          "name": "Update Administrator",
          "value": "Update Administrator"
        }
      ],
      "default": "Create Administrator",
      "noDataExpression": true
    },
    {
      "displayName": "Swiss Backup Id",
      "name": "path_swiss_backup_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Administrator"
          ],
          "operation": [
            "Create Administrator"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Email",
      "name": "body_email",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Administrator"
          ],
          "operation": [
            "Create Administrator"
          ]
        }
      },
      "required": true,
      "description": "Email"
    },
    {
      "displayName": "Swiss Backup Id",
      "name": "path_swiss_backup_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Administrator"
          ],
          "operation": [
            "Update Administrator"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Email",
      "name": "body_email",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Administrator"
          ],
          "operation": [
            "Update Administrator"
          ]
        }
      },
      "required": true,
      "description": "Email"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Billing"
          ]
        }
      },
      "options": [
        {
          "name": "List Prices And Discounts",
          "value": "List Prices And Discounts"
        },
        {
          "name": "Calculate The Price",
          "value": "Calculate The Price"
        }
      ],
      "default": "List Prices And Discounts",
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
            "Billing"
          ],
          "operation": [
            "List Prices And Discounts"
          ]
        }
      },
      "options": [
        {
          "displayName": "Account Id",
          "name": "query_account_id",
          "type": "number",
          "default": 0,
          "description": "The account identifier"
        },
        {
          "displayName": "Currency Id",
          "name": "query_currency_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Swiss Backup Id",
          "name": "query_swiss_backup_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "With Renewal",
          "name": "query_with_renewal",
          "type": "boolean",
          "default": false
        }
      ]
    },
    {
      "displayName": "Size",
      "name": "query_size",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Billing"
          ],
          "operation": [
            "Calculate The Price"
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
            "Billing"
          ],
          "operation": [
            "Calculate The Price"
          ]
        }
      },
      "options": [
        {
          "displayName": "Currency Id",
          "name": "query_currency_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Due At",
          "name": "query_due_at",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Is Demo",
          "name": "query_is_demo",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Slot",
          "name": "query_slot",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Slot Mobile",
          "name": "query_slot_mobile",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Slot Server",
          "name": "query_slot_server",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Slot Virtual",
          "name": "query_slot_virtual",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Slot Workstation",
          "name": "query_slot_workstation",
          "type": "number",
          "default": 0
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
            "Passwords"
          ]
        }
      },
      "options": [
        {
          "name": "Request Administrator Password",
          "value": "Request Administrator Password"
        },
        {
          "name": "Request Slot Password",
          "value": "Request Slot Password"
        }
      ],
      "default": "Request Administrator Password",
      "noDataExpression": true
    },
    {
      "displayName": "Swiss Backup Id",
      "name": "path_swiss_backup_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Passwords"
          ],
          "operation": [
            "Request Administrator Password"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Swiss Backup to request."
    },
    {
      "displayName": "Swiss Backup Id",
      "name": "path_swiss_backup_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Passwords"
          ],
          "operation": [
            "Request Slot Password"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Swiss Backup to request."
    },
    {
      "displayName": "Slot Id",
      "name": "path_slot_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Passwords"
          ],
          "operation": [
            "Request Slot Password"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Slot to request."
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Product Management"
          ]
        }
      },
      "options": [
        {
          "name": "List All Swiss Backups",
          "value": "List All Swiss Backups"
        },
        {
          "name": "Swiss Backup Information",
          "value": "Swiss Backup Information"
        },
        {
          "name": "Update A Swiss Backup",
          "value": "Update A Swiss Backup"
        },
        {
          "name": "Acronis Information",
          "value": "Acronis Information"
        }
      ],
      "default": "List All Swiss Backups",
      "noDataExpression": true
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Product Management"
          ],
          "operation": [
            "List All Swiss Backups"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
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
            "Product Management"
          ],
          "operation": [
            "List All Swiss Backups"
          ]
        }
      },
      "options": [
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
          "displayName": "Limit",
          "name": "query_limit",
          "type": "number",
          "default": 0,
          "description": "*Optional parameter* that define the number of items to return<br />\nPart of the `offset` capacity\n"
        },
        {
          "displayName": "Skip",
          "name": "query_skip",
          "type": "number",
          "default": 0,
          "description": "*Optional parameter* that define the index of the first item to return (0 = first item)<br />\nPart of the `offset` capacity\n"
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
        },
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "string",
          "default": "",
          "description": "*Optional parameter* that define the field used for sorting<br />\nPart of the `sort` capacity\n"
        },
        {
          "displayName": "Order",
          "name": "query_order",
          "type": "options",
          "default": "",
          "description": "*Optional parameter* that define the default sort order<br />\nPart of the `sort` capacity\n",
          "options": [
            {
              "name": "asc",
              "value": "asc"
            },
            {
              "name": "desc",
              "value": "desc"
            }
          ]
        },
        {
          "displayName": "Order For",
          "name": "query_order_for",
          "type": "json",
          "default": {},
          "description": "*Optional parameter* that define the sorting order for a field<br />\nBy default **order** is used<br />\nPart of the `sort` capacity\n"
        }
      ]
    },
    {
      "displayName": "Swiss Backup Id",
      "name": "path_swiss_backup_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Product Management"
          ],
          "operation": [
            "Swiss Backup Information"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Swiss Backup to request."
    },
    {
      "displayName": "Swiss Backup Id",
      "name": "path_swiss_backup_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Product Management"
          ],
          "operation": [
            "Update A Swiss Backup"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Swiss Backup to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Product Management"
          ],
          "operation": [
            "Update A Swiss Backup"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the `account`"
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
            "Product Management"
          ],
          "operation": [
            "Update A Swiss Backup"
          ]
        }
      },
      "options": [
        {
          "displayName": "Periodicity",
          "name": "body_periodicity",
          "type": "options",
          "default": "",
          "description": "Commitment period (in years)",
          "options": [
            {
              "name": "0",
              "value": "0"
            },
            {
              "name": "1",
              "value": "1"
            },
            {
              "name": "2",
              "value": "2"
            },
            {
              "name": "3",
              "value": "3"
            }
          ]
        },
        {
          "displayName": "Storage Reserved Acronis",
          "name": "body_storage_reserved_acronis",
          "type": "number",
          "default": 0,
          "description": "Allocated storage size for Acronis (Bytes)"
        }
      ]
    },
    {
      "displayName": "Swiss Backup Id",
      "name": "path_swiss_backup_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Product Management"
          ],
          "operation": [
            "Acronis Information"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Swiss Backup to request."
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Slots"
          ]
        }
      },
      "options": [
        {
          "name": "List All Slots",
          "value": "List All Slots"
        },
        {
          "name": "Create",
          "value": "Create"
        },
        {
          "name": "Disable",
          "value": "Disable"
        },
        {
          "name": "Enable",
          "value": "Enable"
        },
        {
          "name": "Slot Information",
          "value": "Slot Information"
        },
        {
          "name": "Update",
          "value": "Update"
        },
        {
          "name": "Delete",
          "value": "Delete"
        },
        {
          "name": "RClone Details",
          "value": "RClone Details"
        }
      ],
      "default": "List All Slots",
      "noDataExpression": true
    },
    {
      "displayName": "Swiss Backup Id",
      "name": "path_swiss_backup_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Slots"
          ],
          "operation": [
            "List All Slots"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Swiss Backup to request."
    },
    {
      "displayName": "Swiss Backup Id",
      "name": "path_swiss_backup_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Slots"
          ],
          "operation": [
            "Create"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Swiss Backup to request."
    },
    {
      "displayName": "Customer Name",
      "name": "body_customer_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Slots"
          ],
          "operation": [
            "Create"
          ]
        }
      },
      "required": true,
      "description": "Customer name of the resource `{name}`"
    },
    {
      "displayName": "Email",
      "name": "body_email",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Slots"
          ],
          "operation": [
            "Create"
          ]
        }
      },
      "required": true,
      "description": "Email"
    },
    {
      "displayName": "Size",
      "name": "body_size",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Slots"
          ],
          "operation": [
            "Create"
          ]
        }
      },
      "required": true,
      "description": "Total storage size of the Swiss Backup product (Bytes)"
    },
    {
      "displayName": "Type",
      "name": "body_type",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Slots"
          ],
          "operation": [
            "Create"
          ]
        }
      },
      "required": true,
      "description": "Type of the resource `{name}`",
      "options": [
        {
          "name": "acronis",
          "value": "acronis"
        },
        {
          "name": "linux",
          "value": "linux"
        },
        {
          "name": "mobile",
          "value": "mobile"
        },
        {
          "name": "office",
          "value": "office"
        },
        {
          "name": "other",
          "value": "other"
        },
        {
          "name": "qnap",
          "value": "qnap"
        },
        {
          "name": "server",
          "value": "server"
        },
        {
          "name": "synology",
          "value": "synology"
        },
        {
          "name": "virtual",
          "value": "virtual"
        },
        {
          "name": "workstation",
          "value": "workstation"
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
            "Slots"
          ],
          "operation": [
            "Create"
          ]
        }
      },
      "options": [
        {
          "displayName": "Connection Type",
          "name": "body_connection_type",
          "type": "options",
          "default": "",
          "description": "Slot connection type (Swift, S3, FTP)",
          "options": [
            {
              "name": "ftp",
              "value": "ftp"
            },
            {
              "name": "s3",
              "value": "s3"
            },
            {
              "name": "swift",
              "value": "swift"
            }
          ]
        },
        {
          "displayName": "Firstname",
          "name": "body_firstname",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Lang",
          "name": "body_lang",
          "type": "number",
          "default": 0,
          "description": "Language identifier (1 = fr / 2 = en / 3 = de / 4 = it / 5 = es)"
        },
        {
          "displayName": "Lastname",
          "name": "body_lastname",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Swiss Backup Id",
      "name": "path_swiss_backup_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Slots"
          ],
          "operation": [
            "Disable"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Swiss Backup to request."
    },
    {
      "displayName": "Slot Id",
      "name": "path_slot_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Slots"
          ],
          "operation": [
            "Disable"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Slot to request."
    },
    {
      "displayName": "Swiss Backup Id",
      "name": "path_swiss_backup_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Slots"
          ],
          "operation": [
            "Enable"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Swiss Backup to request."
    },
    {
      "displayName": "Slot Id",
      "name": "path_slot_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Slots"
          ],
          "operation": [
            "Enable"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Slot to request."
    },
    {
      "displayName": "Swiss Backup Id",
      "name": "path_swiss_backup_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Slots"
          ],
          "operation": [
            "Slot Information"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Swiss Backup to request."
    },
    {
      "displayName": "Slot Id",
      "name": "path_slot_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Slots"
          ],
          "operation": [
            "Slot Information"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Slot to request."
    },
    {
      "displayName": "Swiss Backup Id",
      "name": "path_swiss_backup_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Slots"
          ],
          "operation": [
            "Update"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Swiss Backup to request."
    },
    {
      "displayName": "Slot Id",
      "name": "path_slot_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Slots"
          ],
          "operation": [
            "Update"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Slot to request."
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
            "Slots"
          ],
          "operation": [
            "Update"
          ]
        }
      },
      "options": [
        {
          "displayName": "Activate Notifications",
          "name": "body_activate_notifications",
          "type": "boolean",
          "default": false,
          "description": "True if the user wants to receive Acronis notifications"
        },
        {
          "displayName": "Customer Name",
          "name": "body_customer_name",
          "type": "string",
          "default": "",
          "description": "Customer name of the resource `{name}`"
        },
        {
          "displayName": "Email",
          "name": "body_email",
          "type": "string",
          "default": "",
          "description": "Email"
        },
        {
          "displayName": "Lang",
          "name": "body_lang",
          "type": "number",
          "default": 0,
          "description": "Language identifier (1 = fr / 2 = en / 3 = de / 4 = it / 5 = es)"
        },
        {
          "displayName": "Send Mail",
          "name": "body_send_mail",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Size",
          "name": "body_size",
          "type": "number",
          "default": 0,
          "description": "Total storage size of the Swiss Backup product (Bytes)"
        }
      ]
    },
    {
      "displayName": "Swiss Backup Id",
      "name": "path_swiss_backup_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Slots"
          ],
          "operation": [
            "Delete"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Swiss Backup to request."
    },
    {
      "displayName": "Slot Id",
      "name": "path_slot_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Slots"
          ],
          "operation": [
            "Delete"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Slot to request."
    },
    {
      "displayName": "Swiss Backup Id",
      "name": "path_swiss_backup_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Slots"
          ],
          "operation": [
            "RClone Details"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Swiss Backup to request."
    },
    {
      "displayName": "Slot Id",
      "name": "path_slot_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Slots"
          ],
          "operation": [
            "RClone Details"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Slot to request."
    },
    {
      "displayName": "Return All",
      "name": "returnAll",
      "type": "boolean",
      "default": true,
      "displayOptions": {
        "show": {
          "resource": [
            "Product Management"
          ],
          "operation": [
            "List All Swiss Backups"
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
            "Product Management"
          ],
          "operation": [
            "List All Swiss Backups"
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
