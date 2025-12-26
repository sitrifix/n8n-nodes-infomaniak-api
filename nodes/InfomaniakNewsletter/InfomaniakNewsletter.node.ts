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
  "API Key": {
    "API Key": {
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
    "List All Campaigns": {
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
    "Create Campaign": {
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
    "Delete Campaigns Bulk": {
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
    "Get Campaign": {
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
    "Edit Campaign": {
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
    "Delete Campaign": {
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
    "Get Tracking": {
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
    "Links Activity": {
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
    "Subscribers Activity": {
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
    "Test Campaign": {
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
    "Duplicate Campaign": {
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
    "Test Campaign (2)": {
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
    "Cancel Campaign": {
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
    "Schedule Campaign": {
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
    "List All Credits": {
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
    "Account Credits": {
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
    "Credits Details": {
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
    "List Credits Offers": {
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
    "Checkout": {
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
    "Display Domain": {
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
    "Delete Domain": {
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
    "List All Fields": {
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
    "Create A Field": {
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
    "Delete Fields": {
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
    "Update A Field": {
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
    "Delete A Field": {
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
    "List All Groups": {
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
    "Create A Group": {
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
    "Delete Groups": {
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
    "Fetch A Group": {
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
    "Update A Group": {
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
    "Delete A Group": {
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
    "List Subscribers": {
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
    "Assign Subscribers": {
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
    "Unassign Subscribers": {
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
    "Cancel An Operation": {
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
    "List All Segments": {
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
    "Create A Segment": {
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
    "Delete Segments": {
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
    "Fetch A Segment": {
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
    "Update A Segment": {
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
    "Delete A Segment": {
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
    "List Subscribers": {
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
    "List All Subscribers": {
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
    "Create A Subscriber": {
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
    "Delete Subscribers": {
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
    "Count Subscribers Status": {
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
    "Fetch A Subscriber": {
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
    "Update A Subscriber": {
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
    "Delete A Subscriber": {
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
    "Filter Subscribers": {
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
    "Export Subscribers": {
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
    "Import Subscribers": {
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
    "Upload Csv File": {
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
    "Forget A Subscriber": {
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
    "Unsubscribe Subscribers": {
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
    "Assign": {
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
    "Unassign": {
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
    "List All Templates": {
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
    "Show Html": {
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
    "Create Template From Campaign": {
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
    "Update Thumbnail": {
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
    "List All Webforms": {
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
    "Create A Webform": {
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
    "Bulk Delete Webform": {
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
    "List Themes": {
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
    "Fetch A Webform": {
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
    "Update A Webform": {
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
    "Delete A Webform": {
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
    "List Webform Fields": {
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
          "value": "API Key"
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
      "default": "API Key",
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
            "API Key"
          ]
        }
      },
      "options": [
        {
          "name": "API Key",
          "value": "API Key"
        }
      ],
      "default": "API Key",
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
            "API Key"
          ],
          "operation": [
            "API Key"
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
          "value": "List All Campaigns"
        },
        {
          "name": "Create Campaign",
          "value": "Create Campaign"
        },
        {
          "name": "Delete Campaigns Bulk",
          "value": "Delete Campaigns Bulk"
        },
        {
          "name": "Get Campaign",
          "value": "Get Campaign"
        },
        {
          "name": "Edit Campaign",
          "value": "Edit Campaign"
        },
        {
          "name": "Delete Campaign",
          "value": "Delete Campaign"
        },
        {
          "name": "Get Tracking",
          "value": "Get Tracking"
        },
        {
          "name": "Links Activity",
          "value": "Links Activity"
        },
        {
          "name": "Subscribers Activity",
          "value": "Subscribers Activity"
        },
        {
          "name": "Test Campaign",
          "value": "Test Campaign"
        },
        {
          "name": "Duplicate Campaign",
          "value": "Duplicate Campaign"
        },
        {
          "name": "Test Campaign",
          "value": "Test Campaign (2)"
        },
        {
          "name": "Cancel Campaign",
          "value": "Cancel Campaign"
        },
        {
          "name": "Schedule Campaign",
          "value": "Schedule Campaign"
        }
      ],
      "default": "List All Campaigns",
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
            "List All Campaigns"
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
            "List All Campaigns"
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
            "Create Campaign"
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
            "Create Campaign"
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
            "Create Campaign"
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
            "Create Campaign"
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
            "Create Campaign"
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
            "Create Campaign"
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
            "Delete Campaigns Bulk"
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
            "Delete Campaigns Bulk"
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
            "Delete Campaigns Bulk"
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
            "Get Campaign"
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
            "Get Campaign"
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
            "Get Campaign"
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
            "Get Campaign"
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
            "Edit Campaign"
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
            "Edit Campaign"
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
            "Edit Campaign"
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
            "Delete Campaign"
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
            "Delete Campaign"
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
            "Delete Campaign"
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
            "Get Tracking"
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
            "Get Tracking"
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
            "Get Tracking"
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
            "Links Activity"
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
            "Links Activity"
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
            "Subscribers Activity"
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
            "Subscribers Activity"
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
            "Subscribers Activity"
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
            "Test Campaign"
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
            "Test Campaign"
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
            "Test Campaign"
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
            "Duplicate Campaign"
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
            "Duplicate Campaign"
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
            "Duplicate Campaign"
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
            "Test Campaign (2)"
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
            "Test Campaign (2)"
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
            "Test Campaign (2)"
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
            "Cancel Campaign"
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
            "Cancel Campaign"
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
            "Cancel Campaign"
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
            "Schedule Campaign"
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
            "Schedule Campaign"
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
            "Schedule Campaign"
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
          "value": "List All Credits"
        },
        {
          "name": "Account Credits",
          "value": "Account Credits"
        },
        {
          "name": "Credits Details",
          "value": "Credits Details"
        },
        {
          "name": "List Credits Offers",
          "value": "List Credits Offers"
        },
        {
          "name": "Checkout",
          "value": "Checkout"
        }
      ],
      "default": "List All Credits",
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
            "List All Credits"
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
            "List All Credits"
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
            "Account Credits"
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
            "Account Credits"
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
            "Credits Details"
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
            "List Credits Offers"
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
            "Checkout"
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
            "Checkout"
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
          "value": "Display Domain"
        },
        {
          "name": "Delete Domain",
          "value": "Delete Domain"
        }
      ],
      "default": "Display Domain",
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
            "Display Domain"
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
            "Display Domain"
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
            "Delete Domain"
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
          "value": "List All Fields"
        },
        {
          "name": "Create A Field",
          "value": "Create A Field"
        },
        {
          "name": "Delete Fields",
          "value": "Delete Fields"
        },
        {
          "name": "Update A Field",
          "value": "Update A Field"
        },
        {
          "name": "Delete A Field",
          "value": "Delete A Field"
        }
      ],
      "default": "List All Fields",
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
            "List All Fields"
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
            "List All Fields"
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
            "Create A Field"
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
            "Create A Field"
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
            "Create A Field"
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
            "Create A Field"
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
            "Delete Fields"
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
            "Delete Fields"
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
            "Delete Fields"
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
            "Update A Field"
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
            "Update A Field"
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
            "Update A Field"
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
            "Delete A Field"
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
            "Delete A Field"
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
          "value": "List All Groups"
        },
        {
          "name": "Create A Group",
          "value": "Create A Group"
        },
        {
          "name": "Delete Groups",
          "value": "Delete Groups"
        },
        {
          "name": "Fetch A Group",
          "value": "Fetch A Group"
        },
        {
          "name": "Update A Group",
          "value": "Update A Group"
        },
        {
          "name": "Delete A Group",
          "value": "Delete A Group"
        },
        {
          "name": "List Subscribers",
          "value": "List Subscribers"
        },
        {
          "name": "Assign Subscribers",
          "value": "Assign Subscribers"
        },
        {
          "name": "Unassign Subscribers",
          "value": "Unassign Subscribers"
        }
      ],
      "default": "List All Groups",
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
            "List All Groups"
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
            "List All Groups"
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
            "Create A Group"
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
            "Create A Group"
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
            "Delete Groups"
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
            "Delete Groups"
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
            "Delete Groups"
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
            "Fetch A Group"
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
            "Fetch A Group"
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
            "Fetch A Group"
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
            "Update A Group"
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
            "Update A Group"
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
            "Update A Group"
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
            "Delete A Group"
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
            "Delete A Group"
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
            "List Subscribers"
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
            "List Subscribers"
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
            "List Subscribers"
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
            "Assign Subscribers"
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
            "Assign Subscribers"
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
            "Assign Subscribers"
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
            "Unassign Subscribers"
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
            "Unassign Subscribers"
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
            "Unassign Subscribers"
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
          "value": "Cancel An Operation"
        }
      ],
      "default": "Cancel An Operation",
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
            "Cancel An Operation"
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
            "Cancel An Operation"
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
          "value": "List All Segments"
        },
        {
          "name": "Create A Segment",
          "value": "Create A Segment"
        },
        {
          "name": "Delete Segments",
          "value": "Delete Segments"
        },
        {
          "name": "Fetch A Segment",
          "value": "Fetch A Segment"
        },
        {
          "name": "Update A Segment",
          "value": "Update A Segment"
        },
        {
          "name": "Delete A Segment",
          "value": "Delete A Segment"
        },
        {
          "name": "List Subscribers",
          "value": "List Subscribers"
        }
      ],
      "default": "List All Segments",
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
            "List All Segments"
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
            "List All Segments"
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
            "Create A Segment"
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
            "Create A Segment"
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
            "Create A Segment"
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
            "Delete Segments"
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
            "Delete Segments"
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
            "Delete Segments"
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
            "Delete Segments"
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
            "Fetch A Segment"
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
            "Fetch A Segment"
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
            "Fetch A Segment"
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
            "Update A Segment"
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
            "Update A Segment"
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
            "Update A Segment"
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
            "Delete A Segment"
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
            "Delete A Segment"
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
            "List Subscribers"
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
            "List Subscribers"
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
            "List Subscribers"
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
          "value": "List All Subscribers"
        },
        {
          "name": "Create A Subscriber",
          "value": "Create A Subscriber"
        },
        {
          "name": "Delete Subscribers",
          "value": "Delete Subscribers"
        },
        {
          "name": "Count Subscribers Status",
          "value": "Count Subscribers Status"
        },
        {
          "name": "Fetch A Subscriber",
          "value": "Fetch A Subscriber"
        },
        {
          "name": "Update A Subscriber",
          "value": "Update A Subscriber"
        },
        {
          "name": "Delete A Subscriber",
          "value": "Delete A Subscriber"
        },
        {
          "name": "Filter Subscribers",
          "value": "Filter Subscribers"
        },
        {
          "name": "Export Subscribers",
          "value": "Export Subscribers"
        },
        {
          "name": "Import Subscribers",
          "value": "Import Subscribers"
        },
        {
          "name": "Upload Csv File",
          "value": "Upload Csv File"
        },
        {
          "name": "Forget A Subscriber",
          "value": "Forget A Subscriber"
        },
        {
          "name": "Unsubscribe Subscribers",
          "value": "Unsubscribe Subscribers"
        },
        {
          "name": "Assign",
          "value": "Assign"
        },
        {
          "name": "Unassign",
          "value": "Unassign"
        }
      ],
      "default": "List All Subscribers",
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
            "List All Subscribers"
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
            "List All Subscribers"
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
            "Create A Subscriber"
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
            "Create A Subscriber"
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
            "Create A Subscriber"
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
            "Delete Subscribers"
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
            "Delete Subscribers"
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
            "Delete Subscribers"
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
            "Count Subscribers Status"
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
            "Fetch A Subscriber"
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
            "Fetch A Subscriber"
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
            "Fetch A Subscriber"
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
            "Update A Subscriber"
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
            "Update A Subscriber"
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
            "Update A Subscriber"
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
            "Update A Subscriber"
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
            "Delete A Subscriber"
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
            "Delete A Subscriber"
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
            "Filter Subscribers"
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
            "Filter Subscribers"
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
            "Filter Subscribers"
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
            "Export Subscribers"
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
            "Export Subscribers"
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
            "Export Subscribers"
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
            "Import Subscribers"
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
            "Import Subscribers"
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
            "Import Subscribers"
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
            "Upload Csv File"
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
            "Upload Csv File"
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
            "Forget A Subscriber"
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
            "Forget A Subscriber"
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
            "Unsubscribe Subscribers"
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
            "Unsubscribe Subscribers"
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
            "Unsubscribe Subscribers"
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
            "Assign"
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
            "Assign"
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
            "Assign"
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
            "Unassign"
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
            "Unassign"
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
            "Unassign"
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
            "Unassign"
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
          "value": "List All Templates"
        },
        {
          "name": "Show Html",
          "value": "Show Html"
        },
        {
          "name": "Create Template From Campaign",
          "value": "Create Template From Campaign"
        },
        {
          "name": "Update Thumbnail",
          "value": "Update Thumbnail"
        }
      ],
      "default": "List All Templates",
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
            "List All Templates"
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
            "List All Templates"
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
            "Show Html"
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
            "Show Html"
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
            "Create Template From Campaign"
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
            "Create Template From Campaign"
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
            "Create Template From Campaign"
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
            "Create Template From Campaign"
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
            "Update Thumbnail"
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
            "Update Thumbnail"
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
            "Update Thumbnail"
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
          "value": "List All Webforms"
        },
        {
          "name": "Create A Webform",
          "value": "Create A Webform"
        },
        {
          "name": "Bulk Delete Webform",
          "value": "Bulk Delete Webform"
        },
        {
          "name": "List Themes",
          "value": "List Themes"
        },
        {
          "name": "Fetch A Webform",
          "value": "Fetch A Webform"
        },
        {
          "name": "Update A Webform",
          "value": "Update A Webform"
        },
        {
          "name": "Delete A Webform",
          "value": "Delete A Webform"
        },
        {
          "name": "List Webform Fields",
          "value": "List Webform Fields"
        }
      ],
      "default": "List All Webforms",
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
            "List All Webforms"
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
            "List All Webforms"
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
            "Create A Webform"
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
            "Create A Webform"
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
            "Bulk Delete Webform"
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
            "Bulk Delete Webform"
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
            "Bulk Delete Webform"
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
            "List Themes"
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
            "Fetch A Webform"
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
            "Fetch A Webform"
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
            "Fetch A Webform"
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
            "Update A Webform"
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
            "Update A Webform"
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
            "Update A Webform"
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
            "Update A Webform"
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
            "Delete A Webform"
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
            "Delete A Webform"
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
            "List Webform Fields"
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
            "List Webform Fields"
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
            "List All Campaigns",
            "Get Tracking",
            "Subscribers Activity",
            "List All Credits",
            "Account Credits",
            "List All Fields",
            "List All Groups",
            "List Subscribers",
            "List All Segments",
            "List Subscribers",
            "List All Subscribers",
            "List All Templates",
            "List All Webforms"
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
            "List All Campaigns",
            "Get Tracking",
            "Subscribers Activity",
            "List All Credits",
            "Account Credits",
            "List All Fields",
            "List All Groups",
            "List Subscribers",
            "List All Segments",
            "List Subscribers",
            "List All Subscribers",
            "List All Templates",
            "List All Webforms"
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
