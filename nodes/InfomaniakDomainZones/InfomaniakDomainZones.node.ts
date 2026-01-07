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
  "Domain > DNSSEC": {
    "Check DNSSEC": {
      "method": "GET",
      "path": "/2/domains/{domain}/dnssec/check",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Enable DNSSEC": {
      "method": "POST",
      "path": "/2/domains/{domain}/dnssec/enable",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Disable DNSSEC": {
      "method": "POST",
      "path": "/2/domains/{domain}/dnssec/disable",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Domain > Nameservers": {
    "Update Nameservers": {
      "method": "PUT",
      "path": "/2/domains/{domain}/nameservers",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Domain > Zone": {
    "List Zones": {
      "method": "GET",
      "path": "/2/domains/{domain}/zones",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Zone": {
    "Show Zone": {
      "method": "GET",
      "path": "/2/zones/{zone}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "zone",
          "field": "path_zone"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Store Zone": {
      "method": "POST",
      "path": "/2/zones/{zone}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "zone",
          "field": "path_zone"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Update Zone": {
      "method": "PUT",
      "path": "/2/zones/{zone}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "zone",
          "field": "path_zone"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "skel",
          "field": "body_skel"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Delete Zone": {
      "method": "DELETE",
      "path": "/2/zones/{zone}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "zone",
          "field": "path_zone"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Zone Exists": {
      "method": "GET",
      "path": "/2/zones/{zone}/exists",
      "pagination": "none",
      "pathParams": [
        {
          "name": "zone",
          "field": "path_zone"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Zone > Dns Record": {
    "List Dns Records": {
      "method": "GET",
      "path": "/2/zones/{zone}/records",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "zone",
          "field": "path_zone"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Store Dns Record": {
      "method": "POST",
      "path": "/2/zones/{zone}/records",
      "pagination": "none",
      "pathParams": [
        {
          "name": "zone",
          "field": "path_zone"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "target",
          "field": "body_target"
        },
        {
          "name": "ttl",
          "field": "body_ttl"
        },
        {
          "name": "type",
          "field": "body_type"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Show Dns Record": {
      "method": "GET",
      "path": "/2/zones/{zone}/records/{record}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "record",
          "field": "path_record"
        },
        {
          "name": "zone",
          "field": "path_zone"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update Dns Record": {
      "method": "PUT",
      "path": "/2/zones/{zone}/records/{record}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "record",
          "field": "path_record"
        },
        {
          "name": "zone",
          "field": "path_zone"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete Dns Record": {
      "method": "DELETE",
      "path": "/2/zones/{zone}/records/{record}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "record",
          "field": "path_record"
        },
        {
          "name": "zone",
          "field": "path_zone"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Check Dns Records": {
      "method": "GET",
      "path": "/2/zones/{zone}/records/{record}/check",
      "pagination": "none",
      "pathParams": [
        {
          "name": "record",
          "field": "path_record"
        },
        {
          "name": "zone",
          "field": "path_zone"
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

export class InfomaniakDomainZones implements INodeType {
	description: INodeTypeDescription = {
  "displayName": "Infomaniak Domain Zones",
  "name": "infomaniakDomainZones",
  "icon": "file:../../icons/k.svg",
  "group": [
    "output"
  ],
  "version": 1,
  "description": "Interact with Infomaniak Domain Zones API",
  "defaults": {
    "name": "Infomaniak Domain Zones"
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
          "name": "Domain > DNSSEC",
          "value": "Domain > DNSSEC"
        },
        {
          "name": "Domain > Nameservers",
          "value": "Domain > Nameservers"
        },
        {
          "name": "Domain > Zone",
          "value": "Domain > Zone"
        },
        {
          "name": "Zone",
          "value": "Zone"
        },
        {
          "name": "Zone > Dns Record",
          "value": "Zone > Dns Record"
        }
      ],
      "default": "Domain > DNSSEC",
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
            "Domain > DNSSEC"
          ]
        }
      },
      "options": [
        {
          "name": "Check DNSSEC",
          "value": "Check DNSSEC"
        },
        {
          "name": "Enable DNSSEC",
          "value": "Enable DNSSEC"
        },
        {
          "name": "Disable DNSSEC",
          "value": "Disable DNSSEC"
        }
      ],
      "default": "Check DNSSEC",
      "noDataExpression": true
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Domain > DNSSEC"
          ],
          "operation": [
            "Check DNSSEC"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Domain > DNSSEC"
          ],
          "operation": [
            "Enable DNSSEC"
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
            "Domain > DNSSEC"
          ],
          "operation": [
            "Enable DNSSEC"
          ]
        }
      },
      "options": [
        {
          "displayName": "Dnssec Data",
          "name": "body_dnssec_data",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Domain > DNSSEC"
          ],
          "operation": [
            "Disable DNSSEC"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Domain > Nameservers"
          ]
        }
      },
      "options": [
        {
          "name": "Update Nameservers",
          "value": "Update Nameservers"
        }
      ],
      "default": "Update Nameservers",
      "noDataExpression": true
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Domain > Nameservers"
          ],
          "operation": [
            "Update Nameservers"
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
            "Domain > Nameservers"
          ],
          "operation": [
            "Update Nameservers"
          ]
        }
      },
      "options": [
        {
          "displayName": "Nameservers",
          "name": "body_nameservers",
          "type": "json",
          "default": {},
          "description": "Required without use_infomaniak_ns parameter. Array of nameservers to use for the domain"
        },
        {
          "displayName": "Use Infomaniak Ns",
          "name": "body_use_infomaniak_ns",
          "type": "boolean",
          "default": false,
          "description": "Required without nameservers parameter. Use Infomaniak nameservers for the domain"
        },
        {
          "displayName": "Verify Ns Availability",
          "name": "body_verify_ns_availability",
          "type": "boolean",
          "default": false,
          "description": "Verify ensure that the new nameservers are functional before making any changes. Default: false"
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
            "Domain > Zone"
          ]
        }
      },
      "options": [
        {
          "name": "List Zones",
          "value": "List Zones"
        }
      ],
      "default": "List Zones",
      "noDataExpression": true
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Domain > Zone"
          ],
          "operation": [
            "List Zones"
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
            "Domain > Zone"
          ],
          "operation": [
            "List Zones"
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
            "Zone"
          ]
        }
      },
      "options": [
        {
          "name": "Show Zone",
          "value": "Show Zone"
        },
        {
          "name": "Store Zone",
          "value": "Store Zone"
        },
        {
          "name": "Update Zone",
          "value": "Update Zone"
        },
        {
          "name": "Delete Zone",
          "value": "Delete Zone"
        },
        {
          "name": "Zone Exists",
          "value": "Zone Exists"
        }
      ],
      "default": "Show Zone",
      "noDataExpression": true
    },
    {
      "displayName": "Zone",
      "name": "path_zone",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Zone"
          ],
          "operation": [
            "Show Zone"
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
            "Zone"
          ],
          "operation": [
            "Show Zone"
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
      "displayName": "Zone",
      "name": "path_zone",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Zone"
          ],
          "operation": [
            "Store Zone"
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
            "Zone"
          ],
          "operation": [
            "Store Zone"
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
            "Zone"
          ],
          "operation": [
            "Store Zone"
          ]
        }
      },
      "options": [
        {
          "displayName": "Skel",
          "name": "body_skel",
          "type": "string",
          "default": "",
          "description": "A skel file to use for zone creation. SOA and infomaniak ns records will be ignored."
        }
      ]
    },
    {
      "displayName": "Zone",
      "name": "path_zone",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Zone"
          ],
          "operation": [
            "Update Zone"
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
            "Zone"
          ],
          "operation": [
            "Update Zone"
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
      "displayName": "Skel",
      "name": "body_skel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Zone"
          ],
          "operation": [
            "Update Zone"
          ]
        }
      },
      "required": true,
      "description": "A skel file to use for zone update. SOA and infomaniak ns records will be ignored."
    },
    {
      "displayName": "Zone",
      "name": "path_zone",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Zone"
          ],
          "operation": [
            "Delete Zone"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Zone",
      "name": "path_zone",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Zone"
          ],
          "operation": [
            "Zone Exists"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Zone > Dns Record"
          ]
        }
      },
      "options": [
        {
          "name": "List Dns Records",
          "value": "List Dns Records"
        },
        {
          "name": "Store Dns Record",
          "value": "Store Dns Record"
        },
        {
          "name": "Show Dns Record",
          "value": "Show Dns Record"
        },
        {
          "name": "Update Dns Record",
          "value": "Update Dns Record"
        },
        {
          "name": "Delete Dns Record",
          "value": "Delete Dns Record"
        },
        {
          "name": "Check Dns Records",
          "value": "Check Dns Records"
        }
      ],
      "default": "List Dns Records",
      "noDataExpression": true
    },
    {
      "displayName": "Zone",
      "name": "path_zone",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Zone > Dns Record"
          ],
          "operation": [
            "List Dns Records"
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
            "Zone > Dns Record"
          ],
          "operation": [
            "List Dns Records"
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
          "displayName": "Filter",
          "name": "query_filter",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Search",
          "name": "query_search",
          "type": "string",
          "default": ""
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
      "displayName": "Zone",
      "name": "path_zone",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Zone > Dns Record"
          ],
          "operation": [
            "Store Dns Record"
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
            "Zone > Dns Record"
          ],
          "operation": [
            "Store Dns Record"
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
      "displayName": "Target",
      "name": "body_target",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Zone > Dns Record"
          ],
          "operation": [
            "Store Dns Record"
          ]
        }
      },
      "required": true,
      "description": "Target of the dns record"
    },
    {
      "displayName": "Ttl",
      "name": "body_ttl",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Zone > Dns Record"
          ],
          "operation": [
            "Store Dns Record"
          ]
        }
      },
      "required": true,
      "description": "TTL of the dns record"
    },
    {
      "displayName": "Type",
      "name": "body_type",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Zone > Dns Record"
          ],
          "operation": [
            "Store Dns Record"
          ]
        }
      },
      "required": true,
      "description": "Type of the dns record",
      "options": [
        {
          "name": "A",
          "value": "A"
        },
        {
          "name": "AAAA",
          "value": "AAAA"
        },
        {
          "name": "CAA",
          "value": "CAA"
        },
        {
          "name": "CNAME",
          "value": "CNAME"
        },
        {
          "name": "DNAME",
          "value": "DNAME"
        },
        {
          "name": "DS",
          "value": "DS"
        },
        {
          "name": "MX",
          "value": "MX"
        },
        {
          "name": "NS",
          "value": "NS"
        },
        {
          "name": "SMIMEA",
          "value": "SMIMEA"
        },
        {
          "name": "SRV",
          "value": "SRV"
        },
        {
          "name": "SSHFP",
          "value": "SSHFP"
        },
        {
          "name": "TLSA",
          "value": "TLSA"
        },
        {
          "name": "TXT",
          "value": "TXT"
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
            "Zone > Dns Record"
          ],
          "operation": [
            "Store Dns Record"
          ]
        }
      },
      "options": [
        {
          "displayName": "Source",
          "name": "body_source",
          "type": "string",
          "default": "",
          "description": "Source of the dns record"
        }
      ]
    },
    {
      "displayName": "Record",
      "name": "path_record",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Zone > Dns Record"
          ],
          "operation": [
            "Show Dns Record"
          ]
        }
      },
      "required": true,
      "description": "Record identifier"
    },
    {
      "displayName": "Zone",
      "name": "path_zone",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Zone > Dns Record"
          ],
          "operation": [
            "Show Dns Record"
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
            "Zone > Dns Record"
          ],
          "operation": [
            "Show Dns Record"
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
      "displayName": "Record",
      "name": "path_record",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Zone > Dns Record"
          ],
          "operation": [
            "Update Dns Record"
          ]
        }
      },
      "required": true,
      "description": "Record identifier"
    },
    {
      "displayName": "Zone",
      "name": "path_zone",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Zone > Dns Record"
          ],
          "operation": [
            "Update Dns Record"
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
            "Zone > Dns Record"
          ],
          "operation": [
            "Update Dns Record"
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
            "Zone > Dns Record"
          ],
          "operation": [
            "Update Dns Record"
          ]
        }
      },
      "options": [
        {
          "displayName": "Target",
          "name": "body_target",
          "type": "string",
          "default": "",
          "description": "Target of the dns record"
        },
        {
          "displayName": "Ttl",
          "name": "body_ttl",
          "type": "number",
          "default": 0,
          "description": "TTL of the dns record"
        }
      ]
    },
    {
      "displayName": "Record",
      "name": "path_record",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Zone > Dns Record"
          ],
          "operation": [
            "Delete Dns Record"
          ]
        }
      },
      "required": true,
      "description": "Record identifier"
    },
    {
      "displayName": "Zone",
      "name": "path_zone",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Zone > Dns Record"
          ],
          "operation": [
            "Delete Dns Record"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Record",
      "name": "path_record",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Zone > Dns Record"
          ],
          "operation": [
            "Check Dns Records"
          ]
        }
      },
      "required": true,
      "description": "Record identifier"
    },
    {
      "displayName": "Zone",
      "name": "path_zone",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Zone > Dns Record"
          ],
          "operation": [
            "Check Dns Records"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Return All",
      "name": "returnAll",
      "type": "boolean",
      "default": true,
      "displayOptions": {
        "show": {
          "resource": [
            "Domain > Zone",
            "Zone > Dns Record"
          ],
          "operation": [
            "List Zones",
            "List Dns Records"
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
            "Domain > Zone",
            "Zone > Dns Record"
          ],
          "operation": [
            "List Zones",
            "List Dns Records"
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
