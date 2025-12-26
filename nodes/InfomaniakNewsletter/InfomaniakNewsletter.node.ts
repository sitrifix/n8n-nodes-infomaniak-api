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
  "ApiKey": {
    "GET /1/newsletters/{domain}/api-key": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/api-key",
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
  "Campaigns": {
    "GET /1/newsletters/{domain}/campaigns": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/campaigns",
      "pagination": "limit-skip",
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
    },
    "POST /1/newsletters/{domain}/campaigns": {
      "method": "POST",
      "path": "/1/newsletters/{domain}/campaigns",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "content_html",
          "field": "body_content_html"
        },
        {
          "name": "email_from_addr",
          "field": "body_email_from_addr"
        },
        {
          "name": "email_from_name",
          "field": "body_email_from_name"
        },
        {
          "name": "force_sended",
          "field": "body_force_sended"
        },
        {
          "name": "lang",
          "field": "body_lang"
        },
        {
          "name": "preheader",
          "field": "body_preheader"
        },
        {
          "name": "recipients",
          "field": "body_recipients"
        },
        {
          "name": "subject",
          "field": "body_subject"
        },
        {
          "name": "template_id",
          "field": "body_template_id"
        },
        {
          "name": "tracking_link",
          "field": "body_tracking_link"
        },
        {
          "name": "tracking_opening",
          "field": "body_tracking_opening"
        },
        {
          "name": "tracking_utm",
          "field": "body_tracking_utm"
        },
        {
          "name": "unsub_link",
          "field": "body_unsub_link"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /1/newsletters/{domain}/campaigns": {
      "method": "DELETE",
      "path": "/1/newsletters/{domain}/campaigns",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "select",
          "field": "body_select"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /1/newsletters/{domain}/campaigns/{campaign}": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/campaigns/{campaign}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "campaign",
          "field": "path_campaign"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "*",
          "field": "body__"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "PUT /1/newsletters/{domain}/campaigns/{campaign}": {
      "method": "PUT",
      "path": "/1/newsletters/{domain}/campaigns/{campaign}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "campaign",
          "field": "path_campaign"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "content_html",
          "field": "body_content_html"
        },
        {
          "name": "email_from_addr",
          "field": "body_email_from_addr"
        },
        {
          "name": "email_from_name",
          "field": "body_email_from_name"
        },
        {
          "name": "force_sended",
          "field": "body_force_sended"
        },
        {
          "name": "lang",
          "field": "body_lang"
        },
        {
          "name": "preheader",
          "field": "body_preheader"
        },
        {
          "name": "recipients",
          "field": "body_recipients"
        },
        {
          "name": "subject",
          "field": "body_subject"
        },
        {
          "name": "template_id",
          "field": "body_template_id"
        },
        {
          "name": "tracking_link",
          "field": "body_tracking_link"
        },
        {
          "name": "tracking_opening",
          "field": "body_tracking_opening"
        },
        {
          "name": "tracking_utm",
          "field": "body_tracking_utm"
        },
        {
          "name": "unsub_link",
          "field": "body_unsub_link"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /1/newsletters/{domain}/campaigns/{campaign}": {
      "method": "DELETE",
      "path": "/1/newsletters/{domain}/campaigns/{campaign}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "campaign",
          "field": "path_campaign"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "*",
          "field": "body__"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /1/newsletters/{domain}/campaigns/{campaign}/tracking": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/campaigns/{campaign}/tracking",
      "pagination": "limit-skip",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "campaign",
          "field": "path_campaign"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/newsletters/{domain}/campaigns/{campaign}/report/links": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/campaigns/{campaign}/report/links",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "campaign",
          "field": "path_campaign"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/newsletters/{domain}/campaigns/{campaign}/report/activity": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/campaigns/{campaign}/report/activity",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "campaign",
          "field": "path_campaign"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/newsletters/{domain}/campaigns/template/{template_uuid}/test": {
      "method": "POST",
      "path": "/1/newsletters/{domain}/campaigns/template/{template_uuid}/test",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "template_uuid",
          "field": "path_template_uuid"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "emails",
          "field": "body_emails"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/newsletters/{domain}/campaigns/{campaign}/duplicate": {
      "method": "POST",
      "path": "/1/newsletters/{domain}/campaigns/{campaign}/duplicate",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "campaign",
          "field": "path_campaign"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "*",
          "field": "body__"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /1/newsletters/{domain}/campaigns/{campaign}/test": {
      "method": "POST",
      "path": "/1/newsletters/{domain}/campaigns/{campaign}/test",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "campaign",
          "field": "path_campaign"
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
    "PUT /1/newsletters/{domain}/campaigns/{campaign}/cancel": {
      "method": "PUT",
      "path": "/1/newsletters/{domain}/campaigns/{campaign}/cancel",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "campaign",
          "field": "path_campaign"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "*",
          "field": "body__"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "PUT /1/newsletters/{domain}/campaigns/{campaign}/schedule": {
      "method": "PUT",
      "path": "/1/newsletters/{domain}/campaigns/{campaign}/schedule",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "campaign",
          "field": "path_campaign"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "started_at",
          "field": "body_started_at"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Credits": {
    "GET /1/newsletters/{domain}/credits": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/credits",
      "pagination": "limit-skip",
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
    },
    "GET /1/newsletters/{domain}/credits/accounts": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/credits/accounts",
      "pagination": "limit-skip",
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
    },
    "GET /1/newsletters/{domain}/credits/details": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/credits/details",
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
    "GET /1/newsletters/{domain}/credits/packs": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/credits/packs",
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
    "GET /1/newsletters/{domain}/credits/checkout/{id}": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/credits/checkout/{id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "id",
          "field": "path_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Domains": {
    "GET /1/newsletters/{domain}": {
      "method": "GET",
      "path": "/1/newsletters/{domain}",
      "pagination": "none",
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
    },
    "DELETE /1/newsletters/{domain}": {
      "method": "DELETE",
      "path": "/1/newsletters/{domain}",
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
  "Fields": {
    "GET /1/newsletters/{domain}/fields": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/fields",
      "pagination": "limit-skip",
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
    },
    "POST /1/newsletters/{domain}/fields": {
      "method": "POST",
      "path": "/1/newsletters/{domain}/fields",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "slug",
          "field": "body_slug"
        },
        {
          "name": "type",
          "field": "body_type"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /1/newsletters/{domain}/fields": {
      "method": "DELETE",
      "path": "/1/newsletters/{domain}/fields",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "filter",
          "field": "body_filter"
        },
        {
          "name": "select",
          "field": "body_select"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "PUT /1/newsletters/{domain}/fields/{field}": {
      "method": "PUT",
      "path": "/1/newsletters/{domain}/fields/{field}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "field",
          "field": "path_field"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/newsletters/{domain}/fields/{field}": {
      "method": "DELETE",
      "path": "/1/newsletters/{domain}/fields/{field}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "field",
          "field": "path_field"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Groups": {
    "GET /1/newsletters/{domain}/groups": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/groups",
      "pagination": "limit-skip",
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
    },
    "POST /1/newsletters/{domain}/groups": {
      "method": "POST",
      "path": "/1/newsletters/{domain}/groups",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/newsletters/{domain}/groups": {
      "method": "DELETE",
      "path": "/1/newsletters/{domain}/groups",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "filter",
          "field": "body_filter"
        },
        {
          "name": "select",
          "field": "body_select"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /1/newsletters/{domain}/groups/{group}": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/groups/{group}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "group",
          "field": "path_group"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /1/newsletters/{domain}/groups/{group}": {
      "method": "PUT",
      "path": "/1/newsletters/{domain}/groups/{group}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "group",
          "field": "path_group"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/newsletters/{domain}/groups/{group}": {
      "method": "DELETE",
      "path": "/1/newsletters/{domain}/groups/{group}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "group",
          "field": "path_group"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/newsletters/{domain}/groups/{group}/subscribers": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/groups/{group}/subscribers",
      "pagination": "limit-skip",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "group",
          "field": "path_group"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/newsletters/{domain}/groups/{group}/subscribers/assign": {
      "method": "POST",
      "path": "/1/newsletters/{domain}/groups/{group}/subscribers/assign",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "group",
          "field": "path_group"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "subscriber_ids",
          "field": "body_subscriber_ids"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/newsletters/{domain}/groups/{group}/subscribers/unassign": {
      "method": "POST",
      "path": "/1/newsletters/{domain}/groups/{group}/subscribers/unassign",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "group",
          "field": "path_group"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "subscriber_ids",
          "field": "body_subscriber_ids"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Operations": {
    "DELETE /1/newsletters/{domain}/operations/{operationId}": {
      "method": "DELETE",
      "path": "/1/newsletters/{domain}/operations/{operationId}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "operationId",
          "field": "path_operationId"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Segments": {
    "GET /1/newsletters/{domain}/segments": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/segments",
      "pagination": "limit-skip",
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
    },
    "POST /1/newsletters/{domain}/segments": {
      "method": "POST",
      "path": "/1/newsletters/{domain}/segments",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "data",
          "field": "body_data"
        },
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/newsletters/{domain}/segments": {
      "method": "DELETE",
      "path": "/1/newsletters/{domain}/segments",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "filter",
          "field": "body_filter"
        },
        {
          "name": "select",
          "field": "body_select"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /1/newsletters/{domain}/segments/{segment}": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/segments/{segment}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "segment",
          "field": "path_segment"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /1/newsletters/{domain}/segments/{segment}": {
      "method": "PUT",
      "path": "/1/newsletters/{domain}/segments/{segment}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "segment",
          "field": "path_segment"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "data",
          "field": "body_data"
        },
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /1/newsletters/{domain}/segments/{segment}": {
      "method": "DELETE",
      "path": "/1/newsletters/{domain}/segments/{segment}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "segment",
          "field": "path_segment"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/newsletters/{domain}/segments/{segment}/subscribers": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/segments/{segment}/subscribers",
      "pagination": "limit-skip",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "segment",
          "field": "path_segment"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Subscribers": {
    "GET /1/newsletters/{domain}/subscribers": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/subscribers",
      "pagination": "limit-skip",
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
    },
    "POST /1/newsletters/{domain}/subscribers": {
      "method": "POST",
      "path": "/1/newsletters/{domain}/subscribers",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "email",
          "field": "body_email"
        },
        {
          "name": "fields",
          "field": "body_fields"
        },
        {
          "name": "groups",
          "field": "body_groups"
        },
        {
          "name": "status",
          "field": "body_status"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /1/newsletters/{domain}/subscribers": {
      "method": "DELETE",
      "path": "/1/newsletters/{domain}/subscribers",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "filter",
          "field": "body_filter"
        },
        {
          "name": "segment",
          "field": "body_segment"
        },
        {
          "name": "select",
          "field": "body_select"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /1/newsletters/{domain}/subscribers/count_status": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/subscribers/count_status",
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
    "GET /1/newsletters/{domain}/subscribers/{subscriber}": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/subscribers/{subscriber}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "subscriber",
          "field": "path_subscriber"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /1/newsletters/{domain}/subscribers/{subscriber}": {
      "method": "PUT",
      "path": "/1/newsletters/{domain}/subscribers/{subscriber}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "subscriber",
          "field": "path_subscriber"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "fields",
          "field": "body_fields"
        },
        {
          "name": "groups",
          "field": "body_groups"
        },
        {
          "name": "status",
          "field": "body_status"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /1/newsletters/{domain}/subscribers/{subscriber}": {
      "method": "DELETE",
      "path": "/1/newsletters/{domain}/subscribers/{subscriber}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "subscriber",
          "field": "path_subscriber"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/newsletters/{domain}/subscribers/filter": {
      "method": "POST",
      "path": "/1/newsletters/{domain}/subscribers/filter",
      "pagination": "limit-skip",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "filter",
          "field": "body_filter"
        },
        {
          "name": "segment",
          "field": "body_segment"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /1/newsletters/{domain}/subscribers/export": {
      "method": "POST",
      "path": "/1/newsletters/{domain}/subscribers/export",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "filter",
          "field": "body_filter"
        },
        {
          "name": "segment",
          "field": "body_segment"
        },
        {
          "name": "select",
          "field": "body_select"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /1/newsletters/{domain}/subscribers/import": {
      "method": "POST",
      "path": "/1/newsletters/{domain}/subscribers/import",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "csv_enclosure",
          "field": "body_csv_enclosure"
        },
        {
          "name": "csv_separator",
          "field": "body_csv_separator"
        },
        {
          "name": "fields",
          "field": "body_fields"
        },
        {
          "name": "groups",
          "field": "body_groups"
        },
        {
          "name": "ipd_uuid",
          "field": "body_ipd_uuid"
        },
        {
          "name": "replace_fields",
          "field": "body_replace_fields"
        },
        {
          "name": "upload_id",
          "field": "body_upload_id"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /1/newsletters/{domain}/subscribers/import/upload": {
      "method": "POST",
      "path": "/1/newsletters/{domain}/subscribers/import/upload",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "content",
          "field": "body_content"
        },
        {
          "name": "file",
          "field": "body_file"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /1/newsletters/{domain}/subscribers/{subscriber}/forget": {
      "method": "DELETE",
      "path": "/1/newsletters/{domain}/subscribers/{subscriber}/forget",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "subscriber",
          "field": "path_subscriber"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /1/newsletters/{domain}/subscribers/unsubscribe": {
      "method": "PUT",
      "path": "/1/newsletters/{domain}/subscribers/unsubscribe",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "filter",
          "field": "body_filter"
        },
        {
          "name": "segment",
          "field": "body_segment"
        },
        {
          "name": "select",
          "field": "body_select"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "PUT /1/newsletters/{domain}/subscribers/assign": {
      "method": "PUT",
      "path": "/1/newsletters/{domain}/subscribers/assign",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "filter",
          "field": "body_filter"
        },
        {
          "name": "groups",
          "field": "body_groups"
        },
        {
          "name": "segment",
          "field": "body_segment"
        },
        {
          "name": "select",
          "field": "body_select"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "PUT /1/newsletters/{domain}/subscribers/unassign": {
      "method": "PUT",
      "path": "/1/newsletters/{domain}/subscribers/unassign",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "filter",
          "field": "body_filter"
        },
        {
          "name": "group_id",
          "field": "body_group_id"
        },
        {
          "name": "segment",
          "field": "body_segment"
        },
        {
          "name": "select",
          "field": "body_select"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Templates": {
    "GET /1/newsletters/{domain}/templates": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/templates",
      "pagination": "limit-skip",
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
    },
    "GET /1/newsletters/{domain}/templates/{template}/html": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/templates/{template}/html",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "template",
          "field": "path_template"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/newsletters/{domain}/campaigns/{campaign}/template/{template}": {
      "method": "POST",
      "path": "/1/newsletters/{domain}/campaigns/{campaign}/template/{template}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "campaign",
          "field": "path_campaign"
        },
        {
          "name": "template",
          "field": "path_template"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "*",
          "field": "body__"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "PUT /1/newsletters/{domain}/templates/{template}/update-thumbnails": {
      "method": "PUT",
      "path": "/1/newsletters/{domain}/templates/{template}/update-thumbnails",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "template",
          "field": "path_template"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "*",
          "field": "body__"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Webforms": {
    "GET /1/newsletters/{domain}/webforms": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/webforms",
      "pagination": "limit-skip",
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
    },
    "POST /1/newsletters/{domain}/webforms": {
      "method": "POST",
      "path": "/1/newsletters/{domain}/webforms",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "button",
          "field": "body_button"
        },
        {
          "name": "confirmation_url",
          "field": "body_confirmation_url"
        },
        {
          "name": "design",
          "field": "body_design"
        },
        {
          "name": "email_from_addr",
          "field": "body_email_from_addr"
        },
        {
          "name": "email_from_name",
          "field": "body_email_from_name"
        },
        {
          "name": "email_title",
          "field": "body_email_title"
        },
        {
          "name": "fields",
          "field": "body_fields"
        },
        {
          "name": "groups",
          "field": "body_groups"
        },
        {
          "name": "msg_ok",
          "field": "body_msg_ok"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "notify",
          "field": "body_notify"
        },
        {
          "name": "notify_address",
          "field": "body_notify_address"
        },
        {
          "name": "notify_lang",
          "field": "body_notify_lang"
        },
        {
          "name": "placeholder",
          "field": "body_placeholder"
        },
        {
          "name": "rgpd",
          "field": "body_rgpd"
        },
        {
          "name": "rgpd_msg",
          "field": "body_rgpd_msg"
        },
        {
          "name": "subtitle",
          "field": "body_subtitle"
        },
        {
          "name": "title",
          "field": "body_title"
        },
        {
          "name": "validation_url",
          "field": "body_validation_url"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /1/newsletters/{domain}/webforms": {
      "method": "DELETE",
      "path": "/1/newsletters/{domain}/webforms",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "filter",
          "field": "body_filter"
        },
        {
          "name": "select",
          "field": "body_select"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /1/newsletters/{domain}/webforms/themes": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/webforms/themes",
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
    "GET /1/newsletters/{domain}/webforms/{webform}": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/webforms/{webform}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "webform",
          "field": "path_webform"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /1/newsletters/{domain}/webforms/{webform}": {
      "method": "PUT",
      "path": "/1/newsletters/{domain}/webforms/{webform}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "webform",
          "field": "path_webform"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "button",
          "field": "body_button"
        },
        {
          "name": "confirmation_url",
          "field": "body_confirmation_url"
        },
        {
          "name": "design",
          "field": "body_design"
        },
        {
          "name": "email_from_addr",
          "field": "body_email_from_addr"
        },
        {
          "name": "email_from_name",
          "field": "body_email_from_name"
        },
        {
          "name": "email_title",
          "field": "body_email_title"
        },
        {
          "name": "fields",
          "field": "body_fields"
        },
        {
          "name": "groups",
          "field": "body_groups"
        },
        {
          "name": "msg_ok",
          "field": "body_msg_ok"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "notify",
          "field": "body_notify"
        },
        {
          "name": "notify_address",
          "field": "body_notify_address"
        },
        {
          "name": "notify_lang",
          "field": "body_notify_lang"
        },
        {
          "name": "placeholder",
          "field": "body_placeholder"
        },
        {
          "name": "rgpd",
          "field": "body_rgpd"
        },
        {
          "name": "rgpd_msg",
          "field": "body_rgpd_msg"
        },
        {
          "name": "subtitle",
          "field": "body_subtitle"
        },
        {
          "name": "title",
          "field": "body_title"
        },
        {
          "name": "validation_url",
          "field": "body_validation_url"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /1/newsletters/{domain}/webforms/{webform}": {
      "method": "DELETE",
      "path": "/1/newsletters/{domain}/webforms/{webform}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "webform",
          "field": "path_webform"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/newsletters/{domain}/webforms/{webform}/fields": {
      "method": "GET",
      "path": "/1/newsletters/{domain}/webforms/{webform}/fields",
      "pagination": "none",
      "pathParams": [
        {
          "name": "domain",
          "field": "path_domain"
        },
        {
          "name": "webform",
          "field": "path_webform"
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

export class InfomaniakNewsletter implements INodeType {
	description: INodeTypeDescription = {
  "displayName": "Infomaniak Newsletter",
  "name": "infomaniakNewsletter",
  "icon": "file:../../icons/newsletter.svg",
  "group": [
    "output"
  ],
  "version": 1,
  "description": "Interact with Infomaniak Newsletter API",
  "defaults": {
    "name": "Infomaniak Newsletter"
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
          "name": "API Key",
          "value": "ApiKey"
        },
        {
          "name": "Campaigns",
          "value": "Campaigns"
        },
        {
          "name": "Credits",
          "value": "Credits"
        },
        {
          "name": "Domains",
          "value": "Domains"
        },
        {
          "name": "Fields",
          "value": "Fields"
        },
        {
          "name": "Groups",
          "value": "Groups"
        },
        {
          "name": "Operations",
          "value": "Operations"
        },
        {
          "name": "Segments",
          "value": "Segments"
        },
        {
          "name": "Subscribers",
          "value": "Subscribers"
        },
        {
          "name": "Templates",
          "value": "Templates"
        },
        {
          "name": "Webforms",
          "value": "Webforms"
        }
      ],
      "default": "ApiKey",
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
            "ApiKey"
          ]
        }
      },
      "options": [
        {
          "name": "API Key",
          "value": "GET /1/newsletters/{domain}/api-key"
        }
      ],
      "default": "GET /1/newsletters/{domain}/api-key",
      "noDataExpression": true
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "ApiKey"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/api-key"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ]
        }
      },
      "options": [
        {
          "name": "List All Campaigns",
          "value": "GET /1/newsletters/{domain}/campaigns"
        },
        {
          "name": "Create Campaign",
          "value": "POST /1/newsletters/{domain}/campaigns"
        },
        {
          "name": "Delete Campaigns Bulk",
          "value": "DELETE /1/newsletters/{domain}/campaigns"
        },
        {
          "name": "Get Campaign",
          "value": "GET /1/newsletters/{domain}/campaigns/{campaign}"
        },
        {
          "name": "Edit Campaign",
          "value": "PUT /1/newsletters/{domain}/campaigns/{campaign}"
        },
        {
          "name": "Delete Campaign",
          "value": "DELETE /1/newsletters/{domain}/campaigns/{campaign}"
        },
        {
          "name": "Get Tracking",
          "value": "GET /1/newsletters/{domain}/campaigns/{campaign}/tracking"
        },
        {
          "name": "Links Activity",
          "value": "GET /1/newsletters/{domain}/campaigns/{campaign}/report/links"
        },
        {
          "name": "Subscribers Activity",
          "value": "GET /1/newsletters/{domain}/campaigns/{campaign}/report/activity"
        },
        {
          "name": "Test Campaign",
          "value": "POST /1/newsletters/{domain}/campaigns/template/{template_uuid}/test"
        },
        {
          "name": "Duplicate Campaign",
          "value": "POST /1/newsletters/{domain}/campaigns/{campaign}/duplicate"
        },
        {
          "name": "Test Campaign",
          "value": "POST /1/newsletters/{domain}/campaigns/{campaign}/test"
        },
        {
          "name": "Cancel Campaign",
          "value": "PUT /1/newsletters/{domain}/campaigns/{campaign}/cancel"
        },
        {
          "name": "Schedule Campaign",
          "value": "PUT /1/newsletters/{domain}/campaigns/{campaign}/schedule"
        }
      ],
      "default": "GET /1/newsletters/{domain}/campaigns",
      "noDataExpression": true
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/campaigns"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
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
            "Campaigns"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/campaigns"
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
          "displayName": "Date From",
          "name": "query_date_from",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Date To",
          "name": "query_date_to",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Filter",
          "name": "query_filter",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Newsletter Id",
          "name": "query_newsletter_id",
          "type": "number",
          "default": 0
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
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/campaigns"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Email From Addr",
      "name": "body_email_from_addr",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/campaigns"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Email From Name",
      "name": "body_email_from_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/campaigns"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Lang",
      "name": "body_lang",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/campaigns"
          ]
        }
      },
      "required": true,
      "options": [
        {
          "name": "de_DE",
          "value": "de_DE"
        },
        {
          "name": "en_GB",
          "value": "en_GB"
        },
        {
          "name": "es_ES",
          "value": "es_ES"
        },
        {
          "name": "fr_FR",
          "value": "fr_FR"
        },
        {
          "name": "it_IT",
          "value": "it_IT"
        }
      ]
    },
    {
      "displayName": "Subject",
      "name": "body_subject",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/campaigns"
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
            "Campaigns"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/campaigns"
          ]
        }
      },
      "options": [
        {
          "displayName": "Content Html",
          "name": "body_content_html",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Force Sended",
          "name": "body_force_sended",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Preheader",
          "name": "body_preheader",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Recipients",
          "name": "body_recipients",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Template Id",
          "name": "body_template_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Tracking Link",
          "name": "body_tracking_link",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Tracking Opening",
          "name": "body_tracking_opening",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Tracking Utm",
          "name": "body_tracking_utm",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Unsub Link",
          "name": "body_unsub_link",
          "type": "boolean",
          "default": false
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
            "Campaigns"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/campaigns"
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
            "Campaigns"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/campaigns"
          ]
        }
      },
      "options": [
        {
          "displayName": "Filter",
          "name": "query_filter",
          "type": "json",
          "default": {}
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
            "Campaigns"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/campaigns"
          ]
        }
      },
      "options": [
        {
          "displayName": "Select",
          "name": "body_select",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/campaigns/{campaign}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Campaign",
      "name": "path_campaign",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/campaigns/{campaign}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Campaign"
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
            "Campaigns"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/campaigns/{campaign}"
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
            "Campaigns"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/campaigns/{campaign}"
          ]
        }
      },
      "options": [
        {
          "displayName": "*",
          "name": "body__",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/campaigns/{campaign}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Campaign",
      "name": "path_campaign",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/campaigns/{campaign}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Campaign"
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
            "Campaigns"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/campaigns/{campaign}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Content Html",
          "name": "body_content_html",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Email From Addr",
          "name": "body_email_from_addr",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Email From Name",
          "name": "body_email_from_name",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Force Sended",
          "name": "body_force_sended",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Lang",
          "name": "body_lang",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "de_DE",
              "value": "de_DE"
            },
            {
              "name": "en_GB",
              "value": "en_GB"
            },
            {
              "name": "es_ES",
              "value": "es_ES"
            },
            {
              "name": "fr_FR",
              "value": "fr_FR"
            },
            {
              "name": "it_IT",
              "value": "it_IT"
            }
          ]
        },
        {
          "displayName": "Preheader",
          "name": "body_preheader",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Recipients",
          "name": "body_recipients",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Subject",
          "name": "body_subject",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Template Id",
          "name": "body_template_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Tracking Link",
          "name": "body_tracking_link",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Tracking Opening",
          "name": "body_tracking_opening",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Tracking Utm",
          "name": "body_tracking_utm",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Unsub Link",
          "name": "body_unsub_link",
          "type": "boolean",
          "default": false
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
            "Campaigns"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/campaigns/{campaign}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Campaign",
      "name": "path_campaign",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/campaigns/{campaign}"
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
            "Campaigns"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/campaigns/{campaign}"
          ]
        }
      },
      "options": [
        {
          "displayName": "*",
          "name": "body__",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/campaigns/{campaign}/tracking"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Campaign",
      "name": "path_campaign",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/campaigns/{campaign}/tracking"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Campaign"
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
            "Campaigns"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/campaigns/{campaign}/tracking"
          ]
        }
      },
      "options": [
        {
          "displayName": "Filter",
          "name": "query_filter",
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
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/campaigns/{campaign}/report/links"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Campaign",
      "name": "path_campaign",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/campaigns/{campaign}/report/links"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Campaign"
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/campaigns/{campaign}/report/activity"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Campaign",
      "name": "path_campaign",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/campaigns/{campaign}/report/activity"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Campaign"
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
            "Campaigns"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/campaigns/{campaign}/report/activity"
          ]
        }
      },
      "options": [
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Filter",
          "name": "query_filter",
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
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/campaigns/template/{template_uuid}/test"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Template Uuid",
      "name": "path_template_uuid",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/campaigns/template/{template_uuid}/test"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the template"
    },
    {
      "displayName": "Emails",
      "name": "body_emails",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/campaigns/template/{template_uuid}/test"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/campaigns/{campaign}/duplicate"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Campaign",
      "name": "path_campaign",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/campaigns/{campaign}/duplicate"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Campaign"
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
            "Campaigns"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/campaigns/{campaign}/duplicate"
          ]
        }
      },
      "options": [
        {
          "displayName": "*",
          "name": "body__",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/campaigns/{campaign}/test"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Campaign",
      "name": "path_campaign",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/campaigns/{campaign}/test"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Campaign"
    },
    {
      "displayName": "Email",
      "name": "body_email",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/campaigns/{campaign}/test"
          ]
        }
      },
      "required": true,
      "description": "Valid email address as per RFC 2821"
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/campaigns/{campaign}/cancel"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Campaign",
      "name": "path_campaign",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/campaigns/{campaign}/cancel"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Campaign"
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
            "Campaigns"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/campaigns/{campaign}/cancel"
          ]
        }
      },
      "options": [
        {
          "displayName": "*",
          "name": "body__",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/campaigns/{campaign}/schedule"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Campaign",
      "name": "path_campaign",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/campaigns/{campaign}/schedule"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Campaign"
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
            "Campaigns"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/campaigns/{campaign}/schedule"
          ]
        }
      },
      "options": [
        {
          "displayName": "Started At",
          "name": "body_started_at",
          "type": "number",
          "default": 0,
          "description": "Timestamp `{name}` has been started"
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
            "Credits"
          ]
        }
      },
      "options": [
        {
          "name": "List All Credits",
          "value": "GET /1/newsletters/{domain}/credits"
        },
        {
          "name": "Account Credits",
          "value": "GET /1/newsletters/{domain}/credits/accounts"
        },
        {
          "name": "Credits Details",
          "value": "GET /1/newsletters/{domain}/credits/details"
        },
        {
          "name": "List Credits Offers",
          "value": "GET /1/newsletters/{domain}/credits/packs"
        },
        {
          "name": "Checkout",
          "value": "GET /1/newsletters/{domain}/credits/checkout/{id}"
        }
      ],
      "default": "GET /1/newsletters/{domain}/credits",
      "noDataExpression": true
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Credits"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/credits"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
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
            "Credits"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/credits"
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
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Credits"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/credits/accounts"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
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
            "Credits"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/credits/accounts"
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
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Credits"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/credits/details"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Credits"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/credits/packs"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Credits"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/credits/checkout/{id}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Id",
      "name": "path_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Credits"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/credits/checkout/{id}"
          ]
        }
      },
      "required": true,
      "description": "l'id du Pack"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Domains"
          ]
        }
      },
      "options": [
        {
          "name": "Display Domain",
          "value": "GET /1/newsletters/{domain}"
        },
        {
          "name": "Delete Domain",
          "value": "DELETE /1/newsletters/{domain}"
        }
      ],
      "default": "GET /1/newsletters/{domain}",
      "noDataExpression": true
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Domains"
          ],
          "operation": [
            "GET /1/newsletters/{domain}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
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
            "Domains"
          ],
          "operation": [
            "GET /1/newsletters/{domain}"
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
          "displayName": "Newsletter Id",
          "name": "query_newsletter_id",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Domains"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Fields"
          ]
        }
      },
      "options": [
        {
          "name": "List All Fields",
          "value": "GET /1/newsletters/{domain}/fields"
        },
        {
          "name": "Create A Field",
          "value": "POST /1/newsletters/{domain}/fields"
        },
        {
          "name": "Delete Fields",
          "value": "DELETE /1/newsletters/{domain}/fields"
        },
        {
          "name": "Update A Field",
          "value": "PUT /1/newsletters/{domain}/fields/{field}"
        },
        {
          "name": "Delete A Field",
          "value": "DELETE /1/newsletters/{domain}/fields/{field}"
        }
      ],
      "default": "GET /1/newsletters/{domain}/fields",
      "noDataExpression": true
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Fields"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/fields"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
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
            "Fields"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/fields"
          ]
        }
      },
      "options": [
        {
          "displayName": "Filter",
          "name": "query_filter",
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
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Fields"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/fields"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Fields"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/fields"
          ]
        }
      },
      "required": true,
      "description": "Name of the resource `{name}`"
    },
    {
      "displayName": "Type",
      "name": "body_type",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Fields"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/fields"
          ]
        }
      },
      "required": true,
      "options": [
        {
          "name": "boolean",
          "value": "boolean"
        },
        {
          "name": "date_en",
          "value": "date_en"
        },
        {
          "name": "date_fr",
          "value": "date_fr"
        },
        {
          "name": "email",
          "value": "email"
        },
        {
          "name": "float",
          "value": "float"
        },
        {
          "name": "number",
          "value": "number"
        },
        {
          "name": "text",
          "value": "text"
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
            "Fields"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/fields"
          ]
        }
      },
      "options": [
        {
          "displayName": "Slug",
          "name": "body_slug",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Fields"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/fields"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Select",
      "name": "body_select",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Fields"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/fields"
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
            "Fields"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/fields"
          ]
        }
      },
      "options": [
        {
          "displayName": "Filter",
          "name": "body_filter",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Fields"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/fields/{field}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Field",
      "name": "path_field",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Fields"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/fields/{field}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Field"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Fields"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/fields/{field}"
          ]
        }
      },
      "required": true,
      "description": "Name of the resource `{name}`"
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Fields"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/fields/{field}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Field",
      "name": "path_field",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Fields"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/fields/{field}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Field"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Groups"
          ]
        }
      },
      "options": [
        {
          "name": "List All Groups",
          "value": "GET /1/newsletters/{domain}/groups"
        },
        {
          "name": "Create A Group",
          "value": "POST /1/newsletters/{domain}/groups"
        },
        {
          "name": "Delete Groups",
          "value": "DELETE /1/newsletters/{domain}/groups"
        },
        {
          "name": "Fetch A Group",
          "value": "GET /1/newsletters/{domain}/groups/{group}"
        },
        {
          "name": "Update A Group",
          "value": "PUT /1/newsletters/{domain}/groups/{group}"
        },
        {
          "name": "Delete A Group",
          "value": "DELETE /1/newsletters/{domain}/groups/{group}"
        },
        {
          "name": "List Subscribers",
          "value": "GET /1/newsletters/{domain}/groups/{group}/subscribers"
        },
        {
          "name": "Assign Subscribers",
          "value": "POST /1/newsletters/{domain}/groups/{group}/subscribers/assign"
        },
        {
          "name": "Unassign Subscribers",
          "value": "POST /1/newsletters/{domain}/groups/{group}/subscribers/unassign"
        }
      ],
      "default": "GET /1/newsletters/{domain}/groups",
      "noDataExpression": true
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Groups"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/groups"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
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
            "Groups"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/groups"
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
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Groups"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/groups"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Groups"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/groups"
          ]
        }
      },
      "required": true,
      "description": "Name of the resource `{name}`"
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Groups"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/groups"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Select",
      "name": "body_select",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Groups"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/groups"
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
            "Groups"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/groups"
          ]
        }
      },
      "options": [
        {
          "displayName": "Filter",
          "name": "body_filter",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Groups"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/groups/{group}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Group",
      "name": "path_group",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Groups"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/groups/{group}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Group"
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
            "Groups"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/groups/{group}"
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
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Groups"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/groups/{group}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Group",
      "name": "path_group",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Groups"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/groups/{group}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Group"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Groups"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/groups/{group}"
          ]
        }
      },
      "required": true,
      "description": "Name of the resource `{name}`"
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Groups"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/groups/{group}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Group",
      "name": "path_group",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Groups"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/groups/{group}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Group"
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Groups"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/groups/{group}/subscribers"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Group",
      "name": "path_group",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Groups"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/groups/{group}/subscribers"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Group"
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
            "Groups"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/groups/{group}/subscribers"
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
          "displayName": "Group Id",
          "name": "query_group_id",
          "type": "number",
          "default": 0
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
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Groups"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/groups/{group}/subscribers/assign"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Group",
      "name": "path_group",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Groups"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/groups/{group}/subscribers/assign"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Group"
    },
    {
      "displayName": "Subscriber Ids",
      "name": "body_subscriber_ids",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Groups"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/groups/{group}/subscribers/assign"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Groups"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/groups/{group}/subscribers/unassign"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Group",
      "name": "path_group",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Groups"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/groups/{group}/subscribers/unassign"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Group"
    },
    {
      "displayName": "Subscriber Ids",
      "name": "body_subscriber_ids",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Groups"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/groups/{group}/subscribers/unassign"
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
            "Operations"
          ]
        }
      },
      "options": [
        {
          "name": "Cancel An Operation",
          "value": "DELETE /1/newsletters/{domain}/operations/{operationId}"
        }
      ],
      "default": "DELETE /1/newsletters/{domain}/operations/{operationId}",
      "noDataExpression": true
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Operations"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/operations/{operationId}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "OperationId",
      "name": "path_operationId",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Operations"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/operations/{operationId}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Operation"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Segments"
          ]
        }
      },
      "options": [
        {
          "name": "List All Segments",
          "value": "GET /1/newsletters/{domain}/segments"
        },
        {
          "name": "Create A Segment",
          "value": "POST /1/newsletters/{domain}/segments"
        },
        {
          "name": "Delete Segments",
          "value": "DELETE /1/newsletters/{domain}/segments"
        },
        {
          "name": "Fetch A Segment",
          "value": "GET /1/newsletters/{domain}/segments/{segment}"
        },
        {
          "name": "Update A Segment",
          "value": "PUT /1/newsletters/{domain}/segments/{segment}"
        },
        {
          "name": "Delete A Segment",
          "value": "DELETE /1/newsletters/{domain}/segments/{segment}"
        },
        {
          "name": "List Subscribers",
          "value": "GET /1/newsletters/{domain}/segments/{segment}/subscribers"
        }
      ],
      "default": "GET /1/newsletters/{domain}/segments",
      "noDataExpression": true
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Segments"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/segments"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
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
            "Segments"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/segments"
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
          "displayName": "Newsletter Id",
          "name": "query_newsletter_id",
          "type": "number",
          "default": 0
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
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Segments"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/segments"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Data",
      "name": "body_data",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Segments"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/segments"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Segments"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/segments"
          ]
        }
      },
      "required": true,
      "description": "Name of the resource `{name}`"
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Segments"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/segments"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
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
            "Segments"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/segments"
          ]
        }
      },
      "options": [
        {
          "displayName": "Newsletter Id",
          "name": "query_newsletter_id",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Select",
      "name": "body_select",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Segments"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/segments"
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
            "Segments"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/segments"
          ]
        }
      },
      "options": [
        {
          "displayName": "Filter",
          "name": "body_filter",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Segments"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/segments/{segment}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Segment",
      "name": "path_segment",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Segments"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/segments/{segment}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Segment"
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
            "Segments"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/segments/{segment}"
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
          "displayName": "Newsletter Id",
          "name": "query_newsletter_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Segment Id",
          "name": "query_segment_id",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Segments"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/segments/{segment}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Segment",
      "name": "path_segment",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Segments"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/segments/{segment}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Segment"
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
            "Segments"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/segments/{segment}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Data",
          "name": "body_data",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "Name of the resource `{name}`"
        }
      ]
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Segments"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/segments/{segment}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Segment",
      "name": "path_segment",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Segments"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/segments/{segment}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Segment"
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Segments"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/segments/{segment}/subscribers"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Segment",
      "name": "path_segment",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Segments"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/segments/{segment}/subscribers"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Segment"
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
            "Segments"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/segments/{segment}/subscribers"
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
          "displayName": "Newsletter Id",
          "name": "query_newsletter_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Segment Id",
          "name": "query_segment_id",
          "type": "number",
          "default": 0
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
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ]
        }
      },
      "options": [
        {
          "name": "List All Subscribers",
          "value": "GET /1/newsletters/{domain}/subscribers"
        },
        {
          "name": "Create A Subscriber",
          "value": "POST /1/newsletters/{domain}/subscribers"
        },
        {
          "name": "Delete Subscribers",
          "value": "DELETE /1/newsletters/{domain}/subscribers"
        },
        {
          "name": "Count Subscribers Status",
          "value": "GET /1/newsletters/{domain}/subscribers/count_status"
        },
        {
          "name": "Fetch A Subscriber",
          "value": "GET /1/newsletters/{domain}/subscribers/{subscriber}"
        },
        {
          "name": "Update A Subscriber",
          "value": "PUT /1/newsletters/{domain}/subscribers/{subscriber}"
        },
        {
          "name": "Delete A Subscriber",
          "value": "DELETE /1/newsletters/{domain}/subscribers/{subscriber}"
        },
        {
          "name": "Filter Subscribers",
          "value": "POST /1/newsletters/{domain}/subscribers/filter"
        },
        {
          "name": "Export Subscribers",
          "value": "POST /1/newsletters/{domain}/subscribers/export"
        },
        {
          "name": "Import Subscribers",
          "value": "POST /1/newsletters/{domain}/subscribers/import"
        },
        {
          "name": "Upload Csv File",
          "value": "POST /1/newsletters/{domain}/subscribers/import/upload"
        },
        {
          "name": "Forget A Subscriber",
          "value": "DELETE /1/newsletters/{domain}/subscribers/{subscriber}/forget"
        },
        {
          "name": "Unsubscribe Subscribers",
          "value": "PUT /1/newsletters/{domain}/subscribers/unsubscribe"
        },
        {
          "name": "Assign",
          "value": "PUT /1/newsletters/{domain}/subscribers/assign"
        },
        {
          "name": "Unassign",
          "value": "PUT /1/newsletters/{domain}/subscribers/unassign"
        }
      ],
      "default": "GET /1/newsletters/{domain}/subscribers",
      "noDataExpression": true
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/subscribers"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
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
            "Subscribers"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/subscribers"
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
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/subscribers"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Email",
      "name": "body_email",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/subscribers"
          ]
        }
      },
      "required": true,
      "description": "Valid email address as per RFC 2821"
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
            "Subscribers"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/subscribers"
          ]
        }
      },
      "options": [
        {
          "displayName": "Fields",
          "name": "body_fields",
          "type": "json",
          "default": {},
          "description": "Object keys must correspond to field's key."
        },
        {
          "displayName": "Groups",
          "name": "body_groups",
          "type": "json",
          "default": {},
          "description": "An array of valid identifiers or the names of groups to be created."
        },
        {
          "displayName": "Status",
          "name": "body_status",
          "type": "string",
          "default": "",
          "description": "Status of the resource `{name}`"
        }
      ]
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/subscribers"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Select",
      "name": "body_select",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/subscribers"
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
            "Subscribers"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/subscribers"
          ]
        }
      },
      "options": [
        {
          "displayName": "Filter",
          "name": "body_filter",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Segment",
          "name": "body_segment",
          "type": "string",
          "default": "",
          "description": "Filter subscribers with a segment"
        }
      ]
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/subscribers/count_status"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/subscribers/{subscriber}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Subscriber",
      "name": "path_subscriber",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/subscribers/{subscriber}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Subscriber"
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
            "Subscribers"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/subscribers/{subscriber}"
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
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/subscribers/{subscriber}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Subscriber",
      "name": "path_subscriber",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/subscribers/{subscriber}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Subscriber"
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
            "Subscribers"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/subscribers/{subscriber}"
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
            "Subscribers"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/subscribers/{subscriber}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Fields",
          "name": "body_fields",
          "type": "json",
          "default": {},
          "description": "Object keys must correspond to field's key. Omitted values will be deleted."
        },
        {
          "displayName": "Groups",
          "name": "body_groups",
          "type": "json",
          "default": {},
          "description": "An array of valid identifiers or the names of groups to be created."
        },
        {
          "displayName": "Status",
          "name": "body_status",
          "type": "options",
          "default": "",
          "description": "Status of the resource `{name}`",
          "options": [
            {
              "name": "active",
              "value": "active"
            },
            {
              "name": "unsubscribed",
              "value": "unsubscribed"
            }
          ]
        }
      ]
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/subscribers/{subscriber}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Subscriber",
      "name": "path_subscriber",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/subscribers/{subscriber}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Subscriber"
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/subscribers/filter"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
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
            "Subscribers"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/subscribers/filter"
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
          "displayName": "Extra",
          "name": "query_extra",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "metadata",
              "value": "metadata"
            }
          ]
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
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/subscribers/filter"
          ]
        }
      },
      "options": [
        {
          "displayName": "Filter",
          "name": "body_filter",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Segment",
          "name": "body_segment",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/subscribers/export"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Select",
      "name": "body_select",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/subscribers/export"
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
            "Subscribers"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/subscribers/export"
          ]
        }
      },
      "options": [
        {
          "displayName": "Filter",
          "name": "body_filter",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Segment",
          "name": "body_segment",
          "type": "string",
          "default": "",
          "description": "Filter subscribers with a segment"
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
            "Subscribers"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/subscribers/import"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Fields",
      "name": "body_fields",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/subscribers/import"
          ]
        }
      },
      "required": true,
      "description": "Object keys must correspond to field's id (integer), or its description (type + name)."
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
            "Subscribers"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/subscribers/import"
          ]
        }
      },
      "options": [
        {
          "displayName": "Csv Enclosure",
          "name": "body_csv_enclosure",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Csv Separator",
          "name": "body_csv_separator",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Groups",
          "name": "body_groups",
          "type": "json",
          "default": {},
          "description": "An array of valid identifiers or the names of groups to be created."
        },
        {
          "displayName": "Ipd Uuid",
          "name": "body_ipd_uuid",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Replace Fields",
          "name": "body_replace_fields",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Upload Id",
          "name": "body_upload_id",
          "type": "number",
          "default": 0
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
            "Subscribers"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/subscribers/import/upload"
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
            "Subscribers"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/subscribers/import/upload"
          ]
        }
      },
      "options": [
        {
          "displayName": "Content",
          "name": "body_content",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "File",
          "name": "body_file",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/subscribers/{subscriber}/forget"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Subscriber",
      "name": "path_subscriber",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/subscribers/{subscriber}/forget"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Subscriber"
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/subscribers/unsubscribe"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Select",
      "name": "body_select",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/subscribers/unsubscribe"
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
            "Subscribers"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/subscribers/unsubscribe"
          ]
        }
      },
      "options": [
        {
          "displayName": "Filter",
          "name": "body_filter",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Segment",
          "name": "body_segment",
          "type": "string",
          "default": "",
          "description": "Filter subscribers with a segment"
        }
      ]
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/subscribers/assign"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Select",
      "name": "body_select",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/subscribers/assign"
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
            "Subscribers"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/subscribers/assign"
          ]
        }
      },
      "options": [
        {
          "displayName": "Filter",
          "name": "body_filter",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Groups",
          "name": "body_groups",
          "type": "json",
          "default": {},
          "description": "An array of valid identifiers or the names of groups to be created."
        },
        {
          "displayName": "Segment",
          "name": "body_segment",
          "type": "string",
          "default": "",
          "description": "Filter subscribers with a segment"
        }
      ]
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/subscribers/unassign"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Group Id",
      "name": "body_group_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/subscribers/unassign"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Select",
      "name": "body_select",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Subscribers"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/subscribers/unassign"
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
            "Subscribers"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/subscribers/unassign"
          ]
        }
      },
      "options": [
        {
          "displayName": "Filter",
          "name": "body_filter",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Segment",
          "name": "body_segment",
          "type": "string",
          "default": "",
          "description": "Filter subscribers with a segment"
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
            "Templates"
          ]
        }
      },
      "options": [
        {
          "name": "List All Templates",
          "value": "GET /1/newsletters/{domain}/templates"
        },
        {
          "name": "Show Html",
          "value": "GET /1/newsletters/{domain}/templates/{template}/html"
        },
        {
          "name": "Create Template From Campaign",
          "value": "POST /1/newsletters/{domain}/campaigns/{campaign}/template/{template}"
        },
        {
          "name": "Update Thumbnail",
          "value": "PUT /1/newsletters/{domain}/templates/{template}/update-thumbnails"
        }
      ],
      "default": "GET /1/newsletters/{domain}/templates",
      "noDataExpression": true
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Templates"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/templates"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
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
            "Templates"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/templates"
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
        }
      ]
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Templates"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/templates/{template}/html"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Template",
      "name": "path_template",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Templates"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/templates/{template}/html"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Template"
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Templates"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/campaigns/{campaign}/template/{template}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Campaign",
      "name": "path_campaign",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Templates"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/campaigns/{campaign}/template/{template}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Campaign"
    },
    {
      "displayName": "Template",
      "name": "path_template",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Templates"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/campaigns/{campaign}/template/{template}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Template"
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
            "Templates"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/campaigns/{campaign}/template/{template}"
          ]
        }
      },
      "options": [
        {
          "displayName": "*",
          "name": "body__",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Templates"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/templates/{template}/update-thumbnails"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Template",
      "name": "path_template",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Templates"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/templates/{template}/update-thumbnails"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Template"
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
            "Templates"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/templates/{template}/update-thumbnails"
          ]
        }
      },
      "options": [
        {
          "displayName": "*",
          "name": "body__",
          "type": "string",
          "default": ""
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
            "Webforms"
          ]
        }
      },
      "options": [
        {
          "name": "List All Webforms",
          "value": "GET /1/newsletters/{domain}/webforms"
        },
        {
          "name": "Create A Webform",
          "value": "POST /1/newsletters/{domain}/webforms"
        },
        {
          "name": "Bulk Delete Webform",
          "value": "DELETE /1/newsletters/{domain}/webforms"
        },
        {
          "name": "List Themes",
          "value": "GET /1/newsletters/{domain}/webforms/themes"
        },
        {
          "name": "Fetch A Webform",
          "value": "GET /1/newsletters/{domain}/webforms/{webform}"
        },
        {
          "name": "Update A Webform",
          "value": "PUT /1/newsletters/{domain}/webforms/{webform}"
        },
        {
          "name": "Delete A Webform",
          "value": "DELETE /1/newsletters/{domain}/webforms/{webform}"
        },
        {
          "name": "List Webform Fields",
          "value": "GET /1/newsletters/{domain}/webforms/{webform}/fields"
        }
      ],
      "default": "GET /1/newsletters/{domain}/webforms",
      "noDataExpression": true
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Webforms"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/webforms"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
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
            "Webforms"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/webforms"
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
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Webforms"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/webforms"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
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
            "Webforms"
          ],
          "operation": [
            "POST /1/newsletters/{domain}/webforms"
          ]
        }
      },
      "options": [
        {
          "displayName": "Button",
          "name": "body_button",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Confirmation Url",
          "name": "body_confirmation_url",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Design",
          "name": "body_design",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Email From Addr",
          "name": "body_email_from_addr",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Email From Name",
          "name": "body_email_from_name",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Email Title",
          "name": "body_email_title",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Fields",
          "name": "body_fields",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Groups",
          "name": "body_groups",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Msg Ok",
          "name": "body_msg_ok",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "Name of the resource `{name}`"
        },
        {
          "displayName": "Notify",
          "name": "body_notify",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Notify Address",
          "name": "body_notify_address",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Notify Lang",
          "name": "body_notify_lang",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Placeholder",
          "name": "body_placeholder",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Rgpd",
          "name": "body_rgpd",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Rgpd Msg",
          "name": "body_rgpd_msg",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Subtitle",
          "name": "body_subtitle",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Title",
          "name": "body_title",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Validation Url",
          "name": "body_validation_url",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Webforms"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/webforms"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Select",
      "name": "body_select",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Webforms"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/webforms"
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
            "Webforms"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/webforms"
          ]
        }
      },
      "options": [
        {
          "displayName": "Filter",
          "name": "body_filter",
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
            "Webforms"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/webforms/themes"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Webforms"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/webforms/{webform}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Webform",
      "name": "path_webform",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Webforms"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/webforms/{webform}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Webform"
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
            "Webforms"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/webforms/{webform}"
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
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Webforms"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/webforms/{webform}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Webform",
      "name": "path_webform",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Webforms"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/webforms/{webform}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Webform"
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
            "Webforms"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/webforms/{webform}"
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
            "Webforms"
          ],
          "operation": [
            "PUT /1/newsletters/{domain}/webforms/{webform}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Button",
          "name": "body_button",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Confirmation Url",
          "name": "body_confirmation_url",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Design",
          "name": "body_design",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Email From Addr",
          "name": "body_email_from_addr",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Email From Name",
          "name": "body_email_from_name",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Email Title",
          "name": "body_email_title",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Fields",
          "name": "body_fields",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Groups",
          "name": "body_groups",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Msg Ok",
          "name": "body_msg_ok",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "Name of the resource `{name}`"
        },
        {
          "displayName": "Notify",
          "name": "body_notify",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Notify Address",
          "name": "body_notify_address",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Notify Lang",
          "name": "body_notify_lang",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Placeholder",
          "name": "body_placeholder",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Rgpd",
          "name": "body_rgpd",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Rgpd Msg",
          "name": "body_rgpd_msg",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Subtitle",
          "name": "body_subtitle",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Title",
          "name": "body_title",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Validation Url",
          "name": "body_validation_url",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Webforms"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/webforms/{webform}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the `Domain` to request"
    },
    {
      "displayName": "Webform",
      "name": "path_webform",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Webforms"
          ],
          "operation": [
            "DELETE /1/newsletters/{domain}/webforms/{webform}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Webform"
    },
    {
      "displayName": "Domain",
      "name": "path_domain",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Webforms"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/webforms/{webform}/fields"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Domain"
    },
    {
      "displayName": "Webform",
      "name": "path_webform",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Webforms"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/webforms/{webform}/fields"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Webform"
    },
    {
      "displayName": "Return All",
      "name": "returnAll",
      "type": "boolean",
      "default": true,
      "displayOptions": {
        "show": {
          "resource": [
            "Campaigns",
            "Campaigns",
            "Campaigns",
            "Credits",
            "Credits",
            "Fields",
            "Groups",
            "Groups",
            "Segments",
            "Segments",
            "Subscribers",
            "Templates",
            "Webforms"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/campaigns",
            "GET /1/newsletters/{domain}/campaigns/{campaign}/tracking",
            "GET /1/newsletters/{domain}/campaigns/{campaign}/report/activity",
            "GET /1/newsletters/{domain}/credits",
            "GET /1/newsletters/{domain}/credits/accounts",
            "GET /1/newsletters/{domain}/fields",
            "GET /1/newsletters/{domain}/groups",
            "GET /1/newsletters/{domain}/groups/{group}/subscribers",
            "GET /1/newsletters/{domain}/segments",
            "GET /1/newsletters/{domain}/segments/{segment}/subscribers",
            "GET /1/newsletters/{domain}/subscribers",
            "GET /1/newsletters/{domain}/templates",
            "GET /1/newsletters/{domain}/webforms"
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
            "Campaigns",
            "Campaigns",
            "Campaigns",
            "Credits",
            "Credits",
            "Fields",
            "Groups",
            "Groups",
            "Segments",
            "Segments",
            "Subscribers",
            "Templates",
            "Webforms"
          ],
          "operation": [
            "GET /1/newsletters/{domain}/campaigns",
            "GET /1/newsletters/{domain}/campaigns/{campaign}/tracking",
            "GET /1/newsletters/{domain}/campaigns/{campaign}/report/activity",
            "GET /1/newsletters/{domain}/credits",
            "GET /1/newsletters/{domain}/credits/accounts",
            "GET /1/newsletters/{domain}/fields",
            "GET /1/newsletters/{domain}/groups",
            "GET /1/newsletters/{domain}/groups/{group}/subscribers",
            "GET /1/newsletters/{domain}/segments",
            "GET /1/newsletters/{domain}/segments/{segment}/subscribers",
            "GET /1/newsletters/{domain}/subscribers",
            "GET /1/newsletters/{domain}/templates",
            "GET /1/newsletters/{domain}/webforms"
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
