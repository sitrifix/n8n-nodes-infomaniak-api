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
  "Drive": {
    "PUT /2/drive/{drive_id}": {
      "method": "PUT",
      "path": "/2/drive/{drive_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "bill_reference",
          "field": "body_bill_reference"
        },
        {
          "name": "customer_name",
          "field": "body_customer_name"
        },
        {
          "name": "description",
          "field": "body_description"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/users": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/users",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /3/drive/{drive_id}/wake": {
      "method": "POST",
      "path": "/3/drive/{drive_id}/wake",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Drive > Activity": {
    "GET /2/drive/{drive_id}/activities": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/activities",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/activities": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/activities",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/activities/total": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/activities/total",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/files/{file_id}/activities": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/files/{file_id}/activities",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/files/activities": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/files/activities",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Drive > Activity > Report": {
    "GET /2/drive/{drive_id}/activities/reports": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/activities/reports",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/activities/reports": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/activities/reports",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "actions",
          "field": "body_actions"
        },
        {
          "name": "depth",
          "field": "body_depth"
        },
        {
          "name": "files",
          "field": "body_files"
        },
        {
          "name": "from",
          "field": "body_from"
        },
        {
          "name": "terms",
          "field": "body_terms"
        },
        {
          "name": "until",
          "field": "body_until"
        },
        {
          "name": "user_id",
          "field": "body_user_id"
        },
        {
          "name": "users",
          "field": "body_users"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/activities/reports/{report_id}": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/activities/reports/{report_id}",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "report_id",
          "field": "path_report_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /2/drive/{drive_id}/activities/reports/{report_id}": {
      "method": "DELETE",
      "path": "/2/drive/{drive_id}/activities/reports/{report_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "report_id",
          "field": "path_report_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/activities/reports/{report_id}/export": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/activities/reports/{report_id}/export",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "report_id",
          "field": "path_report_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Drive > Files": {
    "POST /2/drive/{drive_id}/files/exists": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/exists",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "ids",
          "field": "body_ids"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/files/largest": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/files/largest",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/files/last_modified": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/files/last_modified",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/files/most_versions": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/files/most_versions",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/files/my_shared": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/files/my_shared",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/files/shared_with_me": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/files/shared_with_me",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /3/drive/{drive_id}/files/team_directory": {
      "method": "POST",
      "path": "/3/drive/{drive_id}/files/team_directory",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "color",
          "field": "body_color"
        },
        {
          "name": "for_all_user",
          "field": "body_for_all_user"
        },
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/files/recents": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/files/recents",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Drive > Files > Action": {
    "POST /2/drive/{drive_id}/cancel": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/cancel",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "cancel_id",
          "field": "body_cancel_id"
        },
        {
          "name": "cancel_ids",
          "field": "body_cancel_ids"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Drive > Files > Archive": {
    "GET /2/drive/{drive_id}/files/archives/{archive_uuid}": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/files/archives/{archive_uuid}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "archive_uuid",
          "field": "path_archive_uuid"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /3/drive/{drive_id}/files/archives": {
      "method": "POST",
      "path": "/3/drive/{drive_id}/files/archives",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "except_file_ids",
          "field": "body_except_file_ids"
        },
        {
          "name": "file_ids",
          "field": "body_file_ids"
        },
        {
          "name": "parent_id",
          "field": "body_parent_id"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Drive > Files > Category": {
    "GET /2/drive/{drive_id}/categories": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/categories",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/categories": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/categories",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "color",
          "field": "body_color"
        },
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "PUT /2/drive/{drive_id}/categories/{category_id}": {
      "method": "PUT",
      "path": "/2/drive/{drive_id}/categories/{category_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "category_id",
          "field": "path_category_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "color",
          "field": "body_color"
        },
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/drive/{drive_id}/categories/{category_id}": {
      "method": "DELETE",
      "path": "/2/drive/{drive_id}/categories/{category_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "category_id",
          "field": "path_category_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/files/categories/{category_id}": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/categories/{category_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "category_id",
          "field": "path_category_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "file_ids",
          "field": "body_file_ids"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /2/drive/{drive_id}/files/categories/{category_id}": {
      "method": "DELETE",
      "path": "/2/drive/{drive_id}/files/categories/{category_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "category_id",
          "field": "path_category_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "file_ids",
          "field": "body_file_ids"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/files/{file_id}/categories/{category_id}": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/{file_id}/categories/{category_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        },
        {
          "name": "category_id",
          "field": "path_category_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /2/drive/{drive_id}/files/{file_id}/categories/{category_id}": {
      "method": "DELETE",
      "path": "/2/drive/{drive_id}/files/{file_id}/categories/{category_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        },
        {
          "name": "category_id",
          "field": "path_category_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /2/drive/{drive_id}/files/{file_id}/categories": {
      "method": "DELETE",
      "path": "/2/drive/{drive_id}/files/{file_id}/categories",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/files/{file_id}/categories/{category_id}/ai-feedback": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/{file_id}/categories/{category_id}/ai-feedback",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        },
        {
          "name": "category_id",
          "field": "path_category_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "valid",
          "field": "body_valid"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Drive > Files > Category > Right": {
    "GET /2/drive/{drive_id}/categories/rights": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/categories/rights",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/categories/rights": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/categories/rights",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "can_create_category",
          "field": "body_can_create_category"
        },
        {
          "name": "can_delete_category",
          "field": "body_can_delete_category"
        },
        {
          "name": "can_edit_category",
          "field": "body_can_edit_category"
        },
        {
          "name": "can_put_category_on_file",
          "field": "body_can_put_category_on_file"
        },
        {
          "name": "can_read_category_on_file",
          "field": "body_can_read_category_on_file"
        },
        {
          "name": "team_id",
          "field": "body_team_id"
        },
        {
          "name": "user_id",
          "field": "body_user_id"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Drive > Files > Dropbox": {
    "GET /2/drive/{drive_id}/files/{file_id}/dropbox": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/files/{file_id}/dropbox",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/files/{file_id}/dropbox": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/{file_id}/dropbox",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "alias",
          "field": "body_alias"
        },
        {
          "name": "email_when_finished",
          "field": "body_email_when_finished"
        },
        {
          "name": "limit_file_size",
          "field": "body_limit_file_size"
        },
        {
          "name": "password",
          "field": "body_password"
        },
        {
          "name": "valid_until",
          "field": "body_valid_until"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "PUT /2/drive/{drive_id}/files/{file_id}/dropbox": {
      "method": "PUT",
      "path": "/2/drive/{drive_id}/files/{file_id}/dropbox",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "alias",
          "field": "body_alias"
        },
        {
          "name": "email_when_finished",
          "field": "body_email_when_finished"
        },
        {
          "name": "limit_file_size",
          "field": "body_limit_file_size"
        },
        {
          "name": "password",
          "field": "body_password"
        },
        {
          "name": "valid_until",
          "field": "body_valid_until"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/drive/{drive_id}/files/{file_id}/dropbox": {
      "method": "DELETE",
      "path": "/2/drive/{drive_id}/files/{file_id}/dropbox",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/files/{file_id}/dropbox/invite": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/{file_id}/dropbox/invite",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "emails",
          "field": "body_emails"
        },
        {
          "name": "message",
          "field": "body_message"
        },
        {
          "name": "user_ids",
          "field": "body_user_ids"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/files/dropboxes": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/files/dropboxes",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /3/drive/{drive_id}/files/dropboxes": {
      "method": "POST",
      "path": "/3/drive/{drive_id}/files/dropboxes",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
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
          "name": "parent_directory_id",
          "field": "body_parent_directory_id"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Drive > Files > External import": {
    "GET /2/drive/{drive_id}/imports": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/imports",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /2/drive/{drive_id}/imports": {
      "method": "DELETE",
      "path": "/2/drive/{drive_id}/imports",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/imports/sharelink": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/imports/sharelink",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "destination_folder_id",
          "field": "body_destination_folder_id"
        },
        {
          "name": "except_file_ids",
          "field": "body_except_file_ids"
        },
        {
          "name": "file_ids",
          "field": "body_file_ids"
        },
        {
          "name": "password",
          "field": "body_password"
        },
        {
          "name": "sharelink_uuid",
          "field": "body_sharelink_uuid"
        },
        {
          "name": "source_drive_id",
          "field": "body_source_drive_id"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/imports/kdrive": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/imports/kdrive",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "application_drive_id",
          "field": "body_application_drive_id"
        },
        {
          "name": "directory_id",
          "field": "body_directory_id"
        },
        {
          "name": "source_path",
          "field": "body_source_path"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/imports/webdav": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/imports/webdav",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "application",
          "field": "body_application"
        },
        {
          "name": "directory_id",
          "field": "body_directory_id"
        },
        {
          "name": "endpoint",
          "field": "body_endpoint"
        },
        {
          "name": "login",
          "field": "body_login"
        },
        {
          "name": "password",
          "field": "body_password"
        },
        {
          "name": "source_path",
          "field": "body_source_path"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/imports/oauth": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/imports/oauth",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "access_token_id",
          "field": "body_access_token_id"
        },
        {
          "name": "application",
          "field": "body_application"
        },
        {
          "name": "application_drive_id",
          "field": "body_application_drive_id"
        },
        {
          "name": "auth_code",
          "field": "body_auth_code"
        },
        {
          "name": "directory_id",
          "field": "body_directory_id"
        },
        {
          "name": "skip_shared_files",
          "field": "body_skip_shared_files"
        },
        {
          "name": "source_path",
          "field": "body_source_path"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/imports/oauth/drives": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/imports/oauth/drives",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [
        {
          "name": "application",
          "field": "query_application"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/imports/{import_id}": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/imports/{import_id}",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "import_id",
          "field": "path_import_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /2/drive/{drive_id}/imports/{import_id}": {
      "method": "DELETE",
      "path": "/2/drive/{drive_id}/imports/{import_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "import_id",
          "field": "path_import_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/drive/{drive_id}/imports/{import_id}/cancel": {
      "method": "PUT",
      "path": "/2/drive/{drive_id}/imports/{import_id}/cancel",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "import_id",
          "field": "path_import_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Drive > Files > Favorite": {
    "POST /2/drive/{drive_id}/files/{file_id}/favorite": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/{file_id}/favorite",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /2/drive/{drive_id}/files/{file_id}/favorite": {
      "method": "DELETE",
      "path": "/2/drive/{drive_id}/files/{file_id}/favorite",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/files/favorites": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/files/favorites",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Drive > Files > File/Directory": {
    "DELETE /2/drive/{drive_id}/files/{file_id}": {
      "method": "DELETE",
      "path": "/2/drive/{drive_id}/files/{file_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/files/{file_id}/thumbnail": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/files/{file_id}/thumbnail",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/files/{file_id}/preview": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/files/{file_id}/preview",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/files/{file_id}/download": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/files/{file_id}/download",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/files/{file_id}/rename": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/{file_id}/rename",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
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
    "GET /2/drive/{drive_id}/files/{file_id}/sizes": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/files/{file_id}/sizes",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/files/{file_id}/hash": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/files/{file_id}/hash",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/files/{file_id}/copy-to-drive": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/{file_id}/copy-to-drive",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "source_drive_id",
          "field": "body_source_drive_id"
        },
        {
          "name": "source_file_id",
          "field": "body_source_file_id"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/files/{file_id}/temporary_url": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/files/{file_id}/temporary_url",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/files/{file_id}": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/files/{file_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/files/{file_id}/files": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/files/{file_id}/files",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/files/{file_id}/count": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/files/{file_id}/count",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /3/drive/{drive_id}/files/{file_id}/directory": {
      "method": "POST",
      "path": "/3/drive/{drive_id}/files/{file_id}/directory",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "color",
          "field": "body_color"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "only_for_me",
          "field": "body_only_for_me"
        },
        {
          "name": "relative_path",
          "field": "body_relative_path"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /3/drive/{drive_id}/files/{file_id}/file": {
      "method": "POST",
      "path": "/3/drive/{drive_id}/files/{file_id}/file",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "type",
          "field": "body_type"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /3/drive/{drive_id}/files/{file_id}/copy/{destination_directory_id}": {
      "method": "POST",
      "path": "/3/drive/{drive_id}/files/{file_id}/copy/{destination_directory_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        },
        {
          "name": "destination_directory_id",
          "field": "path_destination_directory_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /3/drive/{drive_id}/files/{file_id}/duplicate": {
      "method": "POST",
      "path": "/3/drive/{drive_id}/files/{file_id}/duplicate",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /3/drive/{drive_id}/files/{file_id}/convert": {
      "method": "POST",
      "path": "/3/drive/{drive_id}/files/{file_id}/convert",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /3/drive/{drive_id}/files/{file_id}/move/{destination_directory_id}": {
      "method": "POST",
      "path": "/3/drive/{drive_id}/files/{file_id}/move/{destination_directory_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        },
        {
          "name": "destination_directory_id",
          "field": "path_destination_directory_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "conflict",
          "field": "body_conflict"
        },
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /3/drive/{drive_id}/files/{file_id}/lock": {
      "method": "DELETE",
      "path": "/3/drive/{drive_id}/files/{file_id}/lock",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [
        {
          "name": "path",
          "field": "query_path"
        },
        {
          "name": "token",
          "field": "query_token"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Drive > Files > File/Directory > Access": {
    "POST /2/drive/{drive_id}/files/{file_id}/access/applications": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/{file_id}/access/applications",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "mode",
          "field": "body_mode"
        },
        {
          "name": "type",
          "field": "body_type"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/files/{file_id}/access": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/files/{file_id}/access",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/files/{file_id}/access": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/{file_id}/access",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "emails",
          "field": "body_emails"
        },
        {
          "name": "message",
          "field": "body_message"
        },
        {
          "name": "right",
          "field": "body_right"
        },
        {
          "name": "team_ids",
          "field": "body_team_ids"
        },
        {
          "name": "user_ids",
          "field": "body_user_ids"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/files/{file_id}/access/sync-parent": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/{file_id}/access/sync-parent",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/files/{file_id}/access/check": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/{file_id}/access/check",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "emails",
          "field": "body_emails"
        },
        {
          "name": "right",
          "field": "body_right"
        },
        {
          "name": "team_ids",
          "field": "body_team_ids"
        },
        {
          "name": "user_ids",
          "field": "body_user_ids"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Drive > Files > File/Directory > Access > Invitation": {
    "GET /2/drive/{drive_id}/files/{file_id}/access/invitations": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/files/{file_id}/access/invitations",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/files/{file_id}/access/invitations": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/{file_id}/access/invitations",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "emails",
          "field": "body_emails"
        },
        {
          "name": "message",
          "field": "body_message"
        },
        {
          "name": "right",
          "field": "body_right"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/files/{file_id}/access/invitations/check": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/{file_id}/access/invitations/check",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "emails",
          "field": "body_emails"
        },
        {
          "name": "user_ids",
          "field": "body_user_ids"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Drive > Files > File/Directory > Access > Request": {
    "GET /2/drive/{drive_id}/access/requests/{request_id}": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/access/requests/{request_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "request_id",
          "field": "path_request_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/drive/{drive_id}/access/requests/{request_id}/decline": {
      "method": "PUT",
      "path": "/2/drive/{drive_id}/access/requests/{request_id}/decline",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "request_id",
          "field": "path_request_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/files/{file_id}/access/requests": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/files/{file_id}/access/requests",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/files/{file_id}/access/requests": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/{file_id}/access/requests",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "message",
          "field": "body_message"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Drive > Files > File/Directory > Access > Teams": {
    "GET /2/drive/{drive_id}/files/{file_id}/access/teams": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/files/{file_id}/access/teams",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/files/{file_id}/access/teams": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/{file_id}/access/teams",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "message",
          "field": "body_message"
        },
        {
          "name": "right",
          "field": "body_right"
        },
        {
          "name": "team_ids",
          "field": "body_team_ids"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "PUT /2/drive/{drive_id}/files/{file_id}/access/teams/{team_id}": {
      "method": "PUT",
      "path": "/2/drive/{drive_id}/files/{file_id}/access/teams/{team_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        },
        {
          "name": "team_id",
          "field": "path_team_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "right",
          "field": "body_right"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /2/drive/{drive_id}/files/{file_id}/access/teams/{team_id}": {
      "method": "DELETE",
      "path": "/2/drive/{drive_id}/files/{file_id}/access/teams/{team_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        },
        {
          "name": "team_id",
          "field": "path_team_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Drive > Files > File/Directory > Access > Users": {
    "GET /2/drive/{drive_id}/files/{file_id}/access/users": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/files/{file_id}/access/users",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/files/{file_id}/access/users": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/{file_id}/access/users",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "message",
          "field": "body_message"
        },
        {
          "name": "right",
          "field": "body_right"
        },
        {
          "name": "user_ids",
          "field": "body_user_ids"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "PUT /2/drive/{drive_id}/files/{file_id}/access/users/{user_id}": {
      "method": "PUT",
      "path": "/2/drive/{drive_id}/files/{file_id}/access/users/{user_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        },
        {
          "name": "user_id",
          "field": "path_user_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "right",
          "field": "body_right"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /2/drive/{drive_id}/files/{file_id}/access/users/{user_id}": {
      "method": "DELETE",
      "path": "/2/drive/{drive_id}/files/{file_id}/access/users/{user_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        },
        {
          "name": "user_id",
          "field": "path_user_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/files/{file_id}/access/force": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/{file_id}/access/force",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Drive > Files > File/Directory > Comment": {
    "GET /2/drive/{drive_id}/files/{file_id}/comments": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/files/{file_id}/comments",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/files/{file_id}/comments": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/{file_id}/comments",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "body",
          "field": "body_body"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/files/{file_id}/comments/{comment_id}",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        },
        {
          "name": "comment_id",
          "field": "path_comment_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/{file_id}/comments/{comment_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        },
        {
          "name": "comment_id",
          "field": "path_comment_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "body",
          "field": "body_body"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}": {
      "method": "PUT",
      "path": "/2/drive/{drive_id}/files/{file_id}/comments/{comment_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        },
        {
          "name": "comment_id",
          "field": "path_comment_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "body",
          "field": "body_body"
        },
        {
          "name": "is_resolved",
          "field": "body_is_resolved"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}": {
      "method": "DELETE",
      "path": "/2/drive/{drive_id}/files/{file_id}/comments/{comment_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        },
        {
          "name": "comment_id",
          "field": "path_comment_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}/like": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/{file_id}/comments/{comment_id}/like",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        },
        {
          "name": "comment_id",
          "field": "path_comment_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}/unlike": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/{file_id}/comments/{comment_id}/unlike",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        },
        {
          "name": "comment_id",
          "field": "path_comment_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Drive > Files > File/Directory > Upload": {
    "DELETE /2/drive/{drive_id}/upload": {
      "method": "DELETE",
      "path": "/2/drive/{drive_id}/upload",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "directory_id",
          "field": "body_directory_id"
        },
        {
          "name": "directory_path",
          "field": "body_directory_path"
        },
        {
          "name": "file_name",
          "field": "body_file_name"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /3/drive/{drive_id}/upload": {
      "method": "POST",
      "path": "/3/drive/{drive_id}/upload",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [
        {
          "name": "total_size",
          "field": "query_total_size"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": "body"
    }
  },
  "Drive > Files > File/Directory > Upload > Session": {
    "DELETE /2/drive/{drive_id}/upload/session/{session_token}": {
      "method": "DELETE",
      "path": "/2/drive/{drive_id}/upload/session/{session_token}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "session_token",
          "field": "path_session_token"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /2/drive/{drive_id}/upload/session/batch": {
      "method": "DELETE",
      "path": "/2/drive/{drive_id}/upload/session/batch",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [
        {
          "name": "tokens",
          "field": "query_tokens"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /3/drive/{drive_id}/upload/session/start": {
      "method": "POST",
      "path": "/3/drive/{drive_id}/upload/session/start",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "conflict",
          "field": "body_conflict"
        },
        {
          "name": "created_at",
          "field": "body_created_at"
        },
        {
          "name": "directory_id",
          "field": "body_directory_id"
        },
        {
          "name": "directory_path",
          "field": "body_directory_path"
        },
        {
          "name": "file_id",
          "field": "body_file_id"
        },
        {
          "name": "file_name",
          "field": "body_file_name"
        },
        {
          "name": "last_modified_at",
          "field": "body_last_modified_at"
        },
        {
          "name": "total_chunks",
          "field": "body_total_chunks"
        },
        {
          "name": "total_size",
          "field": "body_total_size"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /3/drive/{drive_id}/upload/session/batch/start": {
      "method": "POST",
      "path": "/3/drive/{drive_id}/upload/session/batch/start",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
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
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /3/drive/{drive_id}/upload/session/{session_token}/chunk": {
      "method": "POST",
      "path": "/3/drive/{drive_id}/upload/session/{session_token}/chunk",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "session_token",
          "field": "path_session_token"
        }
      ],
      "queryParams": [
        {
          "name": "chunk_number",
          "field": "query_chunk_number"
        },
        {
          "name": "chunk_size",
          "field": "query_chunk_size"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": "body"
    },
    "POST /3/drive/{drive_id}/upload/session/{session_token}/finish": {
      "method": "POST",
      "path": "/3/drive/{drive_id}/upload/session/{session_token}/finish",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "session_token",
          "field": "path_session_token"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "created_at",
          "field": "body_created_at"
        },
        {
          "name": "last_modified_at",
          "field": "body_last_modified_at"
        },
        {
          "name": "total_chunk_hash",
          "field": "body_total_chunk_hash"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /3/drive/{drive_id}/upload/session/batch/finish": {
      "method": "POST",
      "path": "/3/drive/{drive_id}/upload/session/batch/finish",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
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
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Drive > Files > File/Directory > Version": {
    "GET /2/drive/{drive_id}/files/{file_id}/versions": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/files/{file_id}/versions",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /2/drive/{drive_id}/files/{file_id}/versions": {
      "method": "DELETE",
      "path": "/2/drive/{drive_id}/files/{file_id}/versions",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/drive/{drive_id}/files/{file_id}/versions/current": {
      "method": "PUT",
      "path": "/2/drive/{drive_id}/files/{file_id}/versions/current",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "keep_forever",
          "field": "body_keep_forever"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/files/{file_id}/versions/{version_id}": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/files/{file_id}/versions/{version_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        },
        {
          "name": "version_id",
          "field": "path_version_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/drive/{drive_id}/files/{file_id}/versions/{version_id}": {
      "method": "PUT",
      "path": "/2/drive/{drive_id}/files/{file_id}/versions/{version_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        },
        {
          "name": "version_id",
          "field": "path_version_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "keep_forever",
          "field": "body_keep_forever"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /2/drive/{drive_id}/files/{file_id}/versions/{version_id}": {
      "method": "DELETE",
      "path": "/2/drive/{drive_id}/files/{file_id}/versions/{version_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        },
        {
          "name": "version_id",
          "field": "path_version_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/files/{file_id}/versions/{version_id}/download": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/files/{file_id}/versions/{version_id}/download",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        },
        {
          "name": "version_id",
          "field": "path_version_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        },
        {
          "name": "version_id",
          "field": "path_version_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore/{destination_directory_id}": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore/{destination_directory_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        },
        {
          "name": "version_id",
          "field": "path_version_id"
        },
        {
          "name": "destination_directory_id",
          "field": "path_destination_directory_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/files/{file_id}/versions": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/files/{file_id}/versions",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /3/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore": {
      "method": "POST",
      "path": "/3/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        },
        {
          "name": "version_id",
          "field": "path_version_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /3/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore/{destination_directory_id}": {
      "method": "POST",
      "path": "/3/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore/{destination_directory_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        },
        {
          "name": "version_id",
          "field": "path_version_id"
        },
        {
          "name": "destination_directory_id",
          "field": "path_destination_directory_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Drive > Files > Search": {
    "GET /3/drive/{drive_id}/files/search": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/files/search",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/files/search/dropboxes": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/files/search/dropboxes",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/files/search/favorites": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/files/search/favorites",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/files/search/links": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/files/search/links",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/files/search/shared_with_me": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/files/search/shared_with_me",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/files/search/my_shared": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/files/search/my_shared",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/files/search/trash": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/files/search/trash",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Drive > Files > Share link > Archive": {
    "POST /2/app/{drive_id}/share/{sharelink_uuid}/archive": {
      "method": "POST",
      "path": "/2/app/{drive_id}/share/{sharelink_uuid}/archive",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "sharelink_uuid",
          "field": "path_sharelink_uuid"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "except_file_ids",
          "field": "body_except_file_ids"
        },
        {
          "name": "file_ids",
          "field": "body_file_ids"
        },
        {
          "name": "parent_id",
          "field": "body_parent_id"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /2/app/{drive_id}/share/{sharelink_uuid}/archive/{archive_uuid}/download": {
      "method": "GET",
      "path": "/2/app/{drive_id}/share/{sharelink_uuid}/archive/{archive_uuid}/download",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "sharelink_uuid",
          "field": "path_sharelink_uuid"
        },
        {
          "name": "archive_uuid",
          "field": "path_archive_uuid"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Drive > Files > Share link > Manage": {
    "GET /2/drive/{drive_id}/files/{file_id}/link": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/files/{file_id}/link",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/files/{file_id}/link": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/{file_id}/link",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "can_comment",
          "field": "body_can_comment"
        },
        {
          "name": "can_download",
          "field": "body_can_download"
        },
        {
          "name": "can_edit",
          "field": "body_can_edit"
        },
        {
          "name": "can_request_access",
          "field": "body_can_request_access"
        },
        {
          "name": "can_see_info",
          "field": "body_can_see_info"
        },
        {
          "name": "can_see_stats",
          "field": "body_can_see_stats"
        },
        {
          "name": "password",
          "field": "body_password"
        },
        {
          "name": "right",
          "field": "body_right"
        },
        {
          "name": "valid_until",
          "field": "body_valid_until"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "PUT /2/drive/{drive_id}/files/{file_id}/link": {
      "method": "PUT",
      "path": "/2/drive/{drive_id}/files/{file_id}/link",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "can_comment",
          "field": "body_can_comment"
        },
        {
          "name": "can_download",
          "field": "body_can_download"
        },
        {
          "name": "can_edit",
          "field": "body_can_edit"
        },
        {
          "name": "can_request_access",
          "field": "body_can_request_access"
        },
        {
          "name": "can_see_info",
          "field": "body_can_see_info"
        },
        {
          "name": "can_see_stats",
          "field": "body_can_see_stats"
        },
        {
          "name": "password",
          "field": "body_password"
        },
        {
          "name": "right",
          "field": "body_right"
        },
        {
          "name": "valid_until",
          "field": "body_valid_until"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/drive/{drive_id}/files/{file_id}/link": {
      "method": "DELETE",
      "path": "/2/drive/{drive_id}/files/{file_id}/link",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/files/{file_id}/link/invite": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/files/{file_id}/link/invite",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "emails",
          "field": "body_emails"
        },
        {
          "name": "message",
          "field": "body_message"
        },
        {
          "name": "user_ids",
          "field": "body_user_ids"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/files/links": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/files/links",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Drive > Files > Trash": {
    "DELETE /2/drive/{drive_id}/trash": {
      "method": "DELETE",
      "path": "/2/drive/{drive_id}/trash",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/trash/count": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/trash/count",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /2/drive/{drive_id}/trash/{file_id}": {
      "method": "DELETE",
      "path": "/2/drive/{drive_id}/trash/{file_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/trash/{file_id}/restore": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/trash/{file_id}/restore",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "destination_directory_id",
          "field": "body_destination_directory_id"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/trash/{file_id}/thumbnail": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/trash/{file_id}/thumbnail",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/trash/{file_id}/count": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/trash/{file_id}/count",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/trash": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/trash",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/trash/{file_id}": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/trash/{file_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/trash/{file_id}/files": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/trash/{file_id}/files",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /3/drive/{drive_id}/trash/{file_id}/count": {
      "method": "GET",
      "path": "/3/drive/{drive_id}/trash/{file_id}/count",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "file_id",
          "field": "path_file_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Drive > Invitations": {
    "GET /2/drive/{drive_id}/users/invitation": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/users/invitation",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/users/invitation/{invitation_id}": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/users/invitation/{invitation_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "invitation_id",
          "field": "path_invitation_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/drive/{drive_id}/users/invitation/{invitation_id}": {
      "method": "PUT",
      "path": "/2/drive/{drive_id}/users/invitation/{invitation_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "invitation_id",
          "field": "path_invitation_id"
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
          "name": "message",
          "field": "body_message"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "right",
          "field": "body_right"
        },
        {
          "name": "role",
          "field": "body_role"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/drive/{drive_id}/users/invitation/{invitation_id}": {
      "method": "DELETE",
      "path": "/2/drive/{drive_id}/users/invitation/{invitation_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "invitation_id",
          "field": "path_invitation_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/users/invitation/{invitation_id}/send": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/users/invitation/{invitation_id}/send",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "invitation_id",
          "field": "path_invitation_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Drive > Settings": {
    "GET /2/drive/{drive_id}/settings": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/settings",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/drive/{drive_id}/settings/ai": {
      "method": "PUT",
      "path": "/2/drive/{drive_id}/settings/ai",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "has_approved",
          "field": "body_has_approved"
        },
        {
          "name": "has_approved_ai_categories",
          "field": "body_has_approved_ai_categories"
        },
        {
          "name": "has_approved_content_search",
          "field": "body_has_approved_content_search"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "PUT /2/drive/{drive_id}/settings/link": {
      "method": "PUT",
      "path": "/2/drive/{drive_id}/settings/link",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "activate",
          "field": "body_activate"
        },
        {
          "name": "bgColor",
          "field": "body_bgColor"
        },
        {
          "name": "images",
          "field": "body_images"
        },
        {
          "name": "txtColor",
          "field": "body_txtColor"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "PUT /2/drive/{drive_id}/settings/trash": {
      "method": "PUT",
      "path": "/2/drive/{drive_id}/settings/trash",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "max_duration",
          "field": "body_max_duration"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/drive/{drive_id}/settings/office": {
      "method": "PUT",
      "path": "/2/drive/{drive_id}/settings/office",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "form",
          "field": "body_form"
        },
        {
          "name": "presentation",
          "field": "body_presentation"
        },
        {
          "name": "spreadsheet",
          "field": "body_spreadsheet"
        },
        {
          "name": "text",
          "field": "body_text"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "PUT /2/drive/{drive_id}/preferences": {
      "method": "PUT",
      "path": "/2/drive/{drive_id}/preferences",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "color",
          "field": "body_color"
        },
        {
          "name": "default_page",
          "field": "body_default_page"
        },
        {
          "name": "hide",
          "field": "body_hide"
        },
        {
          "name": "ui",
          "field": "body_ui"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Drive > Statistics": {
    "GET /2/drive/{drive_id}/statistics/sizes": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/statistics/sizes",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "interval",
          "field": "query_interval"
        },
        {
          "name": "metrics",
          "field": "query_metrics"
        },
        {
          "name": "until",
          "field": "query_until"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/statistics/sizes/export": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/statistics/sizes/export",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "interval",
          "field": "query_interval"
        },
        {
          "name": "metrics",
          "field": "query_metrics"
        },
        {
          "name": "until",
          "field": "query_until"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/statistics/activities/users": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/statistics/activities/users",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "until",
          "field": "query_until"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/statistics/activities/shared_files": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/statistics/activities/shared_files",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "until",
          "field": "query_until"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/statistics/activities": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/statistics/activities",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "interval",
          "field": "query_interval"
        },
        {
          "name": "metric",
          "field": "query_metric"
        },
        {
          "name": "until",
          "field": "query_until"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/statistics/activities/export": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/statistics/activities/export",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "interval",
          "field": "query_interval"
        },
        {
          "name": "metric",
          "field": "query_metric"
        },
        {
          "name": "until",
          "field": "query_until"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/statistics/activities/links": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/statistics/activities/links",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "until",
          "field": "query_until"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/statistics/activities/links/export": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/statistics/activities/links/export",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "until",
          "field": "query_until"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Drive > Users": {
    "GET /2/drive/{drive_id}/users": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/users",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/users": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/users",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "emails",
          "field": "body_emails"
        },
        {
          "name": "file_id",
          "field": "body_file_id"
        },
        {
          "name": "lang",
          "field": "body_lang"
        },
        {
          "name": "message",
          "field": "body_message"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "right",
          "field": "body_right"
        },
        {
          "name": "role",
          "field": "body_role"
        },
        {
          "name": "send_email",
          "field": "body_send_email"
        },
        {
          "name": "team_ids",
          "field": "body_team_ids"
        },
        {
          "name": "type",
          "field": "body_type"
        },
        {
          "name": "user_ids",
          "field": "body_user_ids"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /2/drive/{drive_id}/users/{user_id}": {
      "method": "GET",
      "path": "/2/drive/{drive_id}/users/{user_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "user_id",
          "field": "path_user_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/drive/{drive_id}/users/{user_id}": {
      "method": "PUT",
      "path": "/2/drive/{drive_id}/users/{user_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "user_id",
          "field": "path_user_id"
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
          "name": "role",
          "field": "body_role"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/drive/{drive_id}/users/{user_id}": {
      "method": "DELETE",
      "path": "/2/drive/{drive_id}/users/{user_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "user_id",
          "field": "path_user_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "notify",
          "field": "body_notify"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "PATCH /2/drive/{drive_id}/users/{user_id}/manager": {
      "method": "PATCH",
      "path": "/2/drive/{drive_id}/users/{user_id}/manager",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "user_id",
          "field": "path_user_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "roles",
          "field": "body_roles"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/users/{user_id}/lock": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/users/{user_id}/lock",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "user_id",
          "field": "path_user_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/drive/{drive_id}/users/{user_id}/unlock": {
      "method": "POST",
      "path": "/2/drive/{drive_id}/users/{user_id}/unlock",
      "pagination": "none",
      "pathParams": [
        {
          "name": "drive_id",
          "field": "path_drive_id"
        },
        {
          "name": "user_id",
          "field": "path_user_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Others": {
    "GET /2/drive": {
      "method": "GET",
      "path": "/2/drive",
      "pagination": "page-per-page",
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
    }
  },
  "Users": {
    "GET /2/drive/users": {
      "method": "GET",
      "path": "/2/drive/users",
      "pagination": "page-per-page",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/drive/users/{user_id}/drives": {
      "method": "GET",
      "path": "/2/drive/users/{user_id}/drives",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
        }
      ],
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
    "GET /2/drive/preferences": {
      "method": "GET",
      "path": "/2/drive/preferences",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PATCH /2/drive/preferences": {
      "method": "PATCH",
      "path": "/2/drive/preferences",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "date_format",
          "field": "body_date_format"
        },
        {
          "name": "default_drive",
          "field": "body_default_drive"
        },
        {
          "name": "density",
          "field": "body_density"
        },
        {
          "name": "list",
          "field": "body_list"
        },
        {
          "name": "sort_recent_file",
          "field": "body_sort_recent_file"
        },
        {
          "name": "tutorials",
          "field": "body_tutorials"
        },
        {
          "name": "use_shortcut",
          "field": "body_use_shortcut"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  }
};

export class InfomaniakKdrive implements INodeType {
	description: INodeTypeDescription = {
  "displayName": "Infomaniak Kdrive",
  "name": "infomaniakKdrive",
  "icon": "file:../../icons/kdrive.svg",
  "group": [
    "output"
  ],
  "version": 1,
  "description": "Interact with Infomaniak Kdrive API",
  "defaults": {
    "name": "Infomaniak Kdrive"
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
          "name": "Drive",
          "value": "Drive"
        },
        {
          "name": "Drive > Activity",
          "value": "Drive > Activity"
        },
        {
          "name": "Drive > Activity > Report",
          "value": "Drive > Activity > Report"
        },
        {
          "name": "Drive > Files",
          "value": "Drive > Files"
        },
        {
          "name": "Drive > Files > Action",
          "value": "Drive > Files > Action"
        },
        {
          "name": "Drive > Files > Archive",
          "value": "Drive > Files > Archive"
        },
        {
          "name": "Drive > Files > Category",
          "value": "Drive > Files > Category"
        },
        {
          "name": "Drive > Files > Category > Right",
          "value": "Drive > Files > Category > Right"
        },
        {
          "name": "Drive > Files > Dropbox",
          "value": "Drive > Files > Dropbox"
        },
        {
          "name": "Drive > Files > External Import",
          "value": "Drive > Files > External import"
        },
        {
          "name": "Drive > Files > Favorite",
          "value": "Drive > Files > Favorite"
        },
        {
          "name": "Drive > Files > File/Directory",
          "value": "Drive > Files > File/Directory"
        },
        {
          "name": "Drive > Files > File/Directory > Access",
          "value": "Drive > Files > File/Directory > Access"
        },
        {
          "name": "Drive > Files > File/Directory > Access > Invitation",
          "value": "Drive > Files > File/Directory > Access > Invitation"
        },
        {
          "name": "Drive > Files > File/Directory > Access > Request",
          "value": "Drive > Files > File/Directory > Access > Request"
        },
        {
          "name": "Drive > Files > File/Directory > Access > Teams",
          "value": "Drive > Files > File/Directory > Access > Teams"
        },
        {
          "name": "Drive > Files > File/Directory > Access > Users",
          "value": "Drive > Files > File/Directory > Access > Users"
        },
        {
          "name": "Drive > Files > File/Directory > Comment",
          "value": "Drive > Files > File/Directory > Comment"
        },
        {
          "name": "Drive > Files > File/Directory > Upload",
          "value": "Drive > Files > File/Directory > Upload"
        },
        {
          "name": "Drive > Files > File/Directory > Upload > Session",
          "value": "Drive > Files > File/Directory > Upload > Session"
        },
        {
          "name": "Drive > Files > File/Directory > Version",
          "value": "Drive > Files > File/Directory > Version"
        },
        {
          "name": "Drive > Files > Search",
          "value": "Drive > Files > Search"
        },
        {
          "name": "Drive > Files > Share Link > Archive",
          "value": "Drive > Files > Share link > Archive"
        },
        {
          "name": "Drive > Files > Share Link > Manage",
          "value": "Drive > Files > Share link > Manage"
        },
        {
          "name": "Drive > Files > Trash",
          "value": "Drive > Files > Trash"
        },
        {
          "name": "Drive > Invitations",
          "value": "Drive > Invitations"
        },
        {
          "name": "Drive > Settings",
          "value": "Drive > Settings"
        },
        {
          "name": "Drive > Statistics",
          "value": "Drive > Statistics"
        },
        {
          "name": "Drive > Users",
          "value": "Drive > Users"
        },
        {
          "name": "Others",
          "value": "Others"
        },
        {
          "name": "Users",
          "value": "Users"
        }
      ],
      "default": "Drive",
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
            "Drive"
          ]
        }
      },
      "options": [
        {
          "name": "Update Drive",
          "value": "PUT /2/drive/{drive_id}"
        },
        {
          "name": "Get Users",
          "value": "GET /3/drive/{drive_id}/users"
        },
        {
          "name": "Wake A Sleeping Drive Up",
          "value": "POST /3/drive/{drive_id}/wake"
        }
      ],
      "default": "PUT /2/drive/{drive_id}",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Bill Reference",
          "name": "body_bill_reference",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Customer Name",
          "name": "body_customer_name",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": "",
          "description": "Description of the resource `{name}`"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/users"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/users"
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
          "displayName": "Cursor",
          "name": "query_cursor",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Limit",
          "name": "query_limit",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order",
          "name": "query_order",
          "type": "options",
          "default": "",
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
          "default": {}
        },
        {
          "displayName": "Search",
          "name": "query_search",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Status",
          "name": "query_status",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Types",
          "name": "query_types",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "User Ids",
          "name": "query_user_ids",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/wake"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Activity"
          ]
        }
      },
      "options": [
        {
          "name": "Get Drive Activities Of All The Users.",
          "value": "GET /2/drive/{drive_id}/activities"
        },
        {
          "name": "Get Drive Activities Of All The Users.",
          "value": "GET /3/drive/{drive_id}/activities"
        },
        {
          "name": "Get Total Count Drive Activities Of All The Users.",
          "value": "GET /3/drive/{drive_id}/activities/total"
        },
        {
          "name": "Get File Activities",
          "value": "GET /3/drive/{drive_id}/files/{file_id}/activities"
        },
        {
          "name": "Get Root Activities",
          "value": "GET /3/drive/{drive_id}/files/activities"
        }
      ],
      "default": "GET /2/drive/{drive_id}/activities",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Activity"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/activities"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Activity"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/activities"
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
          "displayName": "Lang",
          "name": "query_lang",
          "type": "options",
          "default": "",
          "description": "Override the language of the request, in most cases when an e-mail is triggered in the request.",
          "options": [
            {
              "name": "de",
              "value": "de"
            },
            {
              "name": "en",
              "value": "en"
            },
            {
              "name": "es",
              "value": "es"
            },
            {
              "name": "fr",
              "value": "fr"
            },
            {
              "name": "it",
              "value": "it"
            }
          ]
        },
        {
          "displayName": "Actions",
          "name": "query_actions",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Depth",
          "name": "query_depth",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "children",
              "value": "children"
            },
            {
              "name": "file",
              "value": "file"
            },
            {
              "name": "folder",
              "value": "folder"
            },
            {
              "name": "unlimited",
              "value": "unlimited"
            }
          ]
        },
        {
          "displayName": "Files",
          "name": "query_files",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "From",
          "name": "query_from",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Terms",
          "name": "query_terms",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Until",
          "name": "query_until",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Users",
          "name": "query_users",
          "type": "json",
          "default": {}
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
          "displayName": "Total",
          "name": "query_total",
          "type": "boolean",
          "default": false,
          "description": "If set to true, return the total number of items. Total pages (<strong>pages</strong>) in response is also returned.\n<note>You can also use ?with=total parameter</note>\n"
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
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Activity"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/activities"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Activity"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/activities"
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
          "displayName": "Cursor",
          "name": "query_cursor",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Limit",
          "name": "query_limit",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order",
          "name": "query_order",
          "type": "options",
          "default": "",
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
          "default": {}
        },
        {
          "displayName": "Lang",
          "name": "query_lang",
          "type": "options",
          "default": "",
          "description": "Override the language of the request, in most cases when an e-mail is triggered in the request.",
          "options": [
            {
              "name": "de",
              "value": "de"
            },
            {
              "name": "en",
              "value": "en"
            },
            {
              "name": "es",
              "value": "es"
            },
            {
              "name": "fr",
              "value": "fr"
            },
            {
              "name": "it",
              "value": "it"
            }
          ]
        },
        {
          "displayName": "Actions",
          "name": "query_actions",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Depth",
          "name": "query_depth",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "children",
              "value": "children"
            },
            {
              "name": "file",
              "value": "file"
            },
            {
              "name": "folder",
              "value": "folder"
            },
            {
              "name": "unlimited",
              "value": "unlimited"
            }
          ]
        },
        {
          "displayName": "Files",
          "name": "query_files",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "From",
          "name": "query_from",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Terms",
          "name": "query_terms",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Until",
          "name": "query_until",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Users",
          "name": "query_users",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Activity"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/activities/total"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Activity"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/activities/total"
          ]
        }
      },
      "options": [
        {
          "displayName": "Actions",
          "name": "query_actions",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Depth",
          "name": "query_depth",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "children",
              "value": "children"
            },
            {
              "name": "file",
              "value": "file"
            },
            {
              "name": "folder",
              "value": "folder"
            },
            {
              "name": "unlimited",
              "value": "unlimited"
            }
          ]
        },
        {
          "displayName": "Files",
          "name": "query_files",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "From",
          "name": "query_from",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Terms",
          "name": "query_terms",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Until",
          "name": "query_until",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Users",
          "name": "query_users",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Activity"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/{file_id}/activities"
          ]
        }
      },
      "required": true,
      "description": "the drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Activity"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/{file_id}/activities"
          ]
        }
      },
      "required": true,
      "description": "the file identifier"
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
            "Drive > Activity"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/{file_id}/activities"
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
          "displayName": "Cursor",
          "name": "query_cursor",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Limit",
          "name": "query_limit",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order",
          "name": "query_order",
          "type": "options",
          "default": "",
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
          "default": {}
        },
        {
          "displayName": "Actions",
          "name": "query_actions",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Depth",
          "name": "query_depth",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "children",
              "value": "children"
            },
            {
              "name": "file",
              "value": "file"
            },
            {
              "name": "folder",
              "value": "folder"
            },
            {
              "name": "unlimited",
              "value": "unlimited"
            }
          ]
        },
        {
          "displayName": "From",
          "name": "query_from",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Terms",
          "name": "query_terms",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Until",
          "name": "query_until",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Users",
          "name": "query_users",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Activity"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/activities"
          ]
        }
      },
      "required": true,
      "description": "the drive identifier"
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
            "Drive > Activity"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/activities"
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
          "displayName": "Cursor",
          "name": "query_cursor",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Limit",
          "name": "query_limit",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order",
          "name": "query_order",
          "type": "options",
          "default": "",
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
          "default": {}
        },
        {
          "displayName": "Actions",
          "name": "query_actions",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Depth",
          "name": "query_depth",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "children",
              "value": "children"
            },
            {
              "name": "file",
              "value": "file"
            },
            {
              "name": "folder",
              "value": "folder"
            },
            {
              "name": "unlimited",
              "value": "unlimited"
            }
          ]
        },
        {
          "displayName": "From",
          "name": "query_from",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Terms",
          "name": "query_terms",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Until",
          "name": "query_until",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Users",
          "name": "query_users",
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
            "Drive > Activity > Report"
          ]
        }
      },
      "options": [
        {
          "name": "List Reports",
          "value": "GET /2/drive/{drive_id}/activities/reports"
        },
        {
          "name": "Create Report",
          "value": "POST /2/drive/{drive_id}/activities/reports"
        },
        {
          "name": "Get Report",
          "value": "GET /2/drive/{drive_id}/activities/reports/{report_id}"
        },
        {
          "name": "Delete Report",
          "value": "DELETE /2/drive/{drive_id}/activities/reports/{report_id}"
        },
        {
          "name": "Export Report",
          "value": "GET /2/drive/{drive_id}/activities/reports/{report_id}/export"
        }
      ],
      "default": "GET /2/drive/{drive_id}/activities/reports",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Activity > Report"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/activities/reports"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Activity > Report"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/activities/reports"
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
          "displayName": "Users",
          "name": "query_users",
          "type": "json",
          "default": {}
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
          "displayName": "Total",
          "name": "query_total",
          "type": "boolean",
          "default": false,
          "description": "If set to true, return the total number of items. Total pages (<strong>pages</strong>) in response is also returned.\n<note>You can also use ?with=total parameter</note>\n"
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
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Activity > Report"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/activities/reports"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Activity > Report"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/activities/reports"
          ]
        }
      },
      "options": [
        {
          "displayName": "Lang",
          "name": "query_lang",
          "type": "options",
          "default": "",
          "description": "Override the language of the request, in most cases when an e-mail is triggered in the request.",
          "options": [
            {
              "name": "de",
              "value": "de"
            },
            {
              "name": "en",
              "value": "en"
            },
            {
              "name": "es",
              "value": "es"
            },
            {
              "name": "fr",
              "value": "fr"
            },
            {
              "name": "it",
              "value": "it"
            }
          ]
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
            "Drive > Activity > Report"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/activities/reports"
          ]
        }
      },
      "options": [
        {
          "displayName": "Actions",
          "name": "body_actions",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Depth",
          "name": "body_depth",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "children",
              "value": "children"
            },
            {
              "name": "file",
              "value": "file"
            },
            {
              "name": "folder",
              "value": "folder"
            },
            {
              "name": "unlimited",
              "value": "unlimited"
            }
          ]
        },
        {
          "displayName": "Files",
          "name": "body_files",
          "type": "json",
          "default": {},
          "description": "List of files for which to retrieve activities"
        },
        {
          "displayName": "From",
          "name": "body_from",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Terms",
          "name": "body_terms",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Until",
          "name": "body_until",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "User Id",
          "name": "body_user_id",
          "type": "number",
          "default": 0,
          "description": "User identifier"
        },
        {
          "displayName": "Users",
          "name": "body_users",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Activity > Report"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/activities/reports/{report_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Report Id",
      "name": "path_report_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Activity > Report"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/activities/reports/{report_id}"
          ]
        }
      },
      "required": true,
      "description": "Report identifier"
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
            "Drive > Activity > Report"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/activities/reports/{report_id}"
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
          "displayName": "Total",
          "name": "query_total",
          "type": "boolean",
          "default": false,
          "description": "If set to true, return the total number of items. Total pages (<strong>pages</strong>) in response is also returned.\n<note>You can also use ?with=total parameter</note>\n"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Activity > Report"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/activities/reports/{report_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Report Id",
      "name": "path_report_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Activity > Report"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/activities/reports/{report_id}"
          ]
        }
      },
      "required": true,
      "description": "Report identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Activity > Report"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/activities/reports/{report_id}/export"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Report Id",
      "name": "path_report_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Activity > Report"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/activities/reports/{report_id}/export"
          ]
        }
      },
      "required": true,
      "description": "Report identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files"
          ]
        }
      },
      "options": [
        {
          "name": "Check File' Existence",
          "value": "POST /2/drive/{drive_id}/files/exists"
        },
        {
          "name": "Get Largest Files",
          "value": "GET /3/drive/{drive_id}/files/largest"
        },
        {
          "name": "Get Last Modified Files",
          "value": "GET /3/drive/{drive_id}/files/last_modified"
        },
        {
          "name": "Get Most Versioned Files",
          "value": "GET /3/drive/{drive_id}/files/most_versions"
        },
        {
          "name": "Get My Shared Files",
          "value": "GET /3/drive/{drive_id}/files/my_shared"
        },
        {
          "name": "Get Shared Files",
          "value": "GET /3/drive/{drive_id}/files/shared_with_me"
        },
        {
          "name": "Create Team Directory",
          "value": "POST /3/drive/{drive_id}/files/team_directory"
        },
        {
          "name": "List The Most Recent Files Or Directories Used By The User.",
          "value": "GET /3/drive/{drive_id}/files/recents"
        }
      ],
      "default": "POST /2/drive/{drive_id}/files/exists",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/exists"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Ids",
      "name": "body_ids",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/exists"
          ]
        }
      },
      "required": true,
      "description": "The ids of the files to check"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/largest"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Files"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/largest"
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
          "displayName": "Cursor",
          "name": "query_cursor",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Limit",
          "name": "query_limit",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order",
          "name": "query_order",
          "type": "options",
          "default": "",
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
          "default": {}
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/last_modified"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Files"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/last_modified"
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
          "displayName": "Cursor",
          "name": "query_cursor",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Limit",
          "name": "query_limit",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order",
          "name": "query_order",
          "type": "options",
          "default": "",
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
          "default": {}
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/most_versions"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Files"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/most_versions"
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
          "displayName": "Cursor",
          "name": "query_cursor",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Limit",
          "name": "query_limit",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order",
          "name": "query_order",
          "type": "options",
          "default": "",
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
          "default": {}
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/my_shared"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Files"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/my_shared"
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
          "displayName": "Cursor",
          "name": "query_cursor",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Limit",
          "name": "query_limit",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order",
          "name": "query_order",
          "type": "options",
          "default": "",
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
          "default": {}
        },
        {
          "displayName": "Type",
          "name": "query_type",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/shared_with_me"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Files"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/shared_with_me"
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
          "displayName": "Cursor",
          "name": "query_cursor",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Limit",
          "name": "query_limit",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order",
          "name": "query_order",
          "type": "options",
          "default": "",
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
          "default": {}
        },
        {
          "displayName": "Type",
          "name": "query_type",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/team_directory"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Files"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/team_directory"
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
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/team_directory"
          ]
        }
      },
      "required": true,
      "description": "Name of the team folder to create"
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
            "Drive > Files"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/team_directory"
          ]
        }
      },
      "options": [
        {
          "displayName": "Color",
          "name": "body_color",
          "type": "string",
          "default": "",
          "description": "Color of the directory for the user creating it"
        },
        {
          "displayName": "For All User",
          "name": "body_for_all_user",
          "type": "boolean",
          "default": false
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/recents"
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
            "Drive > Files"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/recents"
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
          "displayName": "Cursor",
          "name": "query_cursor",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Limit",
          "name": "query_limit",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order",
          "name": "query_order",
          "type": "options",
          "default": "",
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
          "default": {}
        },
        {
          "displayName": "Type",
          "name": "query_type",
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
            "Drive > Files > Action"
          ]
        }
      },
      "options": [
        {
          "name": "Undo Action",
          "value": "POST /2/drive/{drive_id}/cancel"
        }
      ],
      "default": "POST /2/drive/{drive_id}/cancel",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Action"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/cancel"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Files > Action"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/cancel"
          ]
        }
      },
      "options": [
        {
          "displayName": "Cancel Id",
          "name": "body_cancel_id",
          "type": "string",
          "default": "",
          "description": "The cancel identifier"
        },
        {
          "displayName": "Cancel Ids",
          "name": "body_cancel_ids",
          "type": "json",
          "default": {},
          "description": "The cancel identifiers"
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
            "Drive > Files > Archive"
          ]
        }
      },
      "options": [
        {
          "name": "Download Archive",
          "value": "GET /2/drive/{drive_id}/files/archives/{archive_uuid}"
        },
        {
          "name": "Build Archive",
          "value": "POST /3/drive/{drive_id}/files/archives"
        }
      ],
      "default": "GET /2/drive/{drive_id}/files/archives/{archive_uuid}",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Archive"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/archives/{archive_uuid}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Archive Uuid",
      "name": "path_archive_uuid",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Archive"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/archives/{archive_uuid}"
          ]
        }
      },
      "required": true,
      "description": "Archive uuid"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Archive"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/archives"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Files > Archive"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/archives"
          ]
        }
      },
      "options": [
        {
          "displayName": "Except File Ids",
          "name": "body_except_file_ids",
          "type": "json",
          "default": {},
          "description": "Array of files to exclude from the request; only used when parent_id is set, meaningless otherwise"
        },
        {
          "displayName": "File Ids",
          "name": "body_file_ids",
          "type": "json",
          "default": {},
          "description": "Array of files to include in the request; required without parent_id"
        },
        {
          "displayName": "Parent Id",
          "name": "body_parent_id",
          "type": "number",
          "default": 0,
          "description": "The directory containing the files to include in the request; required without file_ids"
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
            "Drive > Files > Category"
          ]
        }
      },
      "options": [
        {
          "name": "Get All Categories",
          "value": "GET /2/drive/{drive_id}/categories"
        },
        {
          "name": "Create Category",
          "value": "POST /2/drive/{drive_id}/categories"
        },
        {
          "name": "Edit Category",
          "value": "PUT /2/drive/{drive_id}/categories/{category_id}"
        },
        {
          "name": "Delete Category",
          "value": "DELETE /2/drive/{drive_id}/categories/{category_id}"
        },
        {
          "name": "Add Category On Files",
          "value": "POST /2/drive/{drive_id}/files/categories/{category_id}"
        },
        {
          "name": "Remove Category On Files",
          "value": "DELETE /2/drive/{drive_id}/files/categories/{category_id}"
        },
        {
          "name": "Add Category On File",
          "value": "POST /2/drive/{drive_id}/files/{file_id}/categories/{category_id}"
        },
        {
          "name": "Remove Category On File",
          "value": "DELETE /2/drive/{drive_id}/files/{file_id}/categories/{category_id}"
        },
        {
          "name": "Remove Categories On File",
          "value": "DELETE /2/drive/{drive_id}/files/{file_id}/categories"
        },
        {
          "name": "Validates An AI Generated Category",
          "value": "POST /2/drive/{drive_id}/files/{file_id}/categories/{category_id}/ai-feedback"
        }
      ],
      "default": "GET /2/drive/{drive_id}/categories",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/categories"
          ]
        }
      },
      "required": true,
      "description": "Drive Identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/categories"
          ]
        }
      },
      "required": true,
      "description": "Drive Identifier"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/categories"
          ]
        }
      },
      "required": true,
      "description": "Name of the Category"
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
            "Drive > Files > Category"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/categories"
          ]
        }
      },
      "options": [
        {
          "displayName": "Color",
          "name": "body_color",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/categories/{category_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive Identifier"
    },
    {
      "displayName": "Category Id",
      "name": "path_category_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/categories/{category_id}"
          ]
        }
      },
      "required": true,
      "description": "Category Identifier"
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
            "Drive > Files > Category"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/categories/{category_id}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Color",
          "name": "body_color",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "Name of the Category"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/categories/{category_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive Identifier"
    },
    {
      "displayName": "Category Id",
      "name": "path_category_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/categories/{category_id}"
          ]
        }
      },
      "required": true,
      "description": "Category Identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/categories/{category_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive Identifier"
    },
    {
      "displayName": "Category Id",
      "name": "path_category_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/categories/{category_id}"
          ]
        }
      },
      "required": true,
      "description": "Category Identifier"
    },
    {
      "displayName": "File Ids",
      "name": "body_file_ids",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/categories/{category_id}"
          ]
        }
      },
      "required": true,
      "description": "List of files to act upon"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/categories/{category_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive Identifier"
    },
    {
      "displayName": "Category Id",
      "name": "path_category_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/categories/{category_id}"
          ]
        }
      },
      "required": true,
      "description": "Category Identifier"
    },
    {
      "displayName": "File Ids",
      "name": "body_file_ids",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/categories/{category_id}"
          ]
        }
      },
      "required": true,
      "description": "List of files to act upon"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/categories/{category_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive Identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/categories/{category_id}"
          ]
        }
      },
      "required": true,
      "description": "File Identifier"
    },
    {
      "displayName": "Category Id",
      "name": "path_category_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/categories/{category_id}"
          ]
        }
      },
      "required": true,
      "description": "Category Identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}/categories/{category_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive Identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}/categories/{category_id}"
          ]
        }
      },
      "required": true,
      "description": "File Identifier"
    },
    {
      "displayName": "Category Id",
      "name": "path_category_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}/categories/{category_id}"
          ]
        }
      },
      "required": true,
      "description": "Category Identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}/categories"
          ]
        }
      },
      "required": true,
      "description": "Drive Identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}/categories"
          ]
        }
      },
      "required": true,
      "description": "File Identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/categories/{category_id}/ai-feedback"
          ]
        }
      },
      "required": true,
      "description": "Drive Identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/categories/{category_id}/ai-feedback"
          ]
        }
      },
      "required": true,
      "description": "File Identifier"
    },
    {
      "displayName": "Category Id",
      "name": "path_category_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/categories/{category_id}/ai-feedback"
          ]
        }
      },
      "required": true,
      "description": "Category Identifier"
    },
    {
      "displayName": "Valid",
      "name": "body_valid",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/categories/{category_id}/ai-feedback"
          ]
        }
      },
      "required": true,
      "description": "True if category is correct, False if incorrect. Removes category if False."
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category > Right"
          ]
        }
      },
      "options": [
        {
          "name": "Get",
          "value": "GET /2/drive/{drive_id}/categories/rights"
        },
        {
          "name": "Update/Create",
          "value": "POST /2/drive/{drive_id}/categories/rights"
        }
      ],
      "default": "GET /2/drive/{drive_id}/categories/rights",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category > Right"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/categories/rights"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Category > Right"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/categories/rights"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Files > Category > Right"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/categories/rights"
          ]
        }
      },
      "options": [
        {
          "displayName": "Can Create Category",
          "name": "body_can_create_category",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Can Delete Category",
          "name": "body_can_delete_category",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Can Edit Category",
          "name": "body_can_edit_category",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Can Put Category On File",
          "name": "body_can_put_category_on_file",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Can Read Category On File",
          "name": "body_can_read_category_on_file",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Team Id",
          "name": "body_team_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "User Id",
          "name": "body_user_id",
          "type": "number",
          "default": 0,
          "description": "User identifier"
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
            "Drive > Files > Dropbox"
          ]
        }
      },
      "options": [
        {
          "name": "Get Dropbox",
          "value": "GET /2/drive/{drive_id}/files/{file_id}/dropbox"
        },
        {
          "name": "Convert A Folder Into A Dropbox",
          "value": "POST /2/drive/{drive_id}/files/{file_id}/dropbox"
        },
        {
          "name": "Update Dropbox",
          "value": "PUT /2/drive/{drive_id}/files/{file_id}/dropbox"
        },
        {
          "name": "Delete Dropbox",
          "value": "DELETE /2/drive/{drive_id}/files/{file_id}/dropbox"
        },
        {
          "name": "Dropbox Invite",
          "value": "POST /2/drive/{drive_id}/files/{file_id}/dropbox/invite"
        },
        {
          "name": "Get Drop Boxes",
          "value": "GET /3/drive/{drive_id}/files/dropboxes"
        },
        {
          "name": "Create A New Dropbox",
          "value": "POST /3/drive/{drive_id}/files/dropboxes"
        }
      ],
      "default": "GET /2/drive/{drive_id}/files/{file_id}/dropbox",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Dropbox"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/dropbox"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Dropbox"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/dropbox"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > Dropbox"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/dropbox"
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
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Dropbox"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/dropbox"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Dropbox"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/dropbox"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > Dropbox"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/dropbox"
          ]
        }
      },
      "options": [
        {
          "displayName": "Alias",
          "name": "body_alias",
          "type": "string",
          "default": "",
          "description": "Alias of the dropbox"
        },
        {
          "displayName": "Email When Finished",
          "name": "body_email_when_finished",
          "type": "boolean",
          "default": false,
          "description": "Send an email when done"
        },
        {
          "displayName": "Limit File Size",
          "name": "body_limit_file_size",
          "type": "number",
          "default": 0,
          "description": "Maximum accepted file size (bytes)"
        },
        {
          "displayName": "Password",
          "name": "body_password",
          "type": "string",
          "default": "",
          "description": "Password for protecting the dropbox"
        },
        {
          "displayName": "Valid Until",
          "name": "body_valid_until",
          "type": "number",
          "default": 0,
          "description": "Maximum validity date"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Dropbox"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/dropbox"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Dropbox"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/dropbox"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > Dropbox"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/dropbox"
          ]
        }
      },
      "options": [
        {
          "displayName": "Alias",
          "name": "body_alias",
          "type": "string",
          "default": "",
          "description": "Alias of the dropbox"
        },
        {
          "displayName": "Email When Finished",
          "name": "body_email_when_finished",
          "type": "boolean",
          "default": false,
          "description": "Send an email when done"
        },
        {
          "displayName": "Limit File Size",
          "name": "body_limit_file_size",
          "type": "number",
          "default": 0,
          "description": "Maximum accepted file size (bytes)"
        },
        {
          "displayName": "Password",
          "name": "body_password",
          "type": "string",
          "default": "",
          "description": "Password for protecting the dropbox"
        },
        {
          "displayName": "Valid Until",
          "name": "body_valid_until",
          "type": "number",
          "default": 0,
          "description": "Maximum validity date"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Dropbox"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}/dropbox"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Dropbox"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}/dropbox"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Dropbox"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/dropbox/invite"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Dropbox"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/dropbox/invite"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > Dropbox"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/dropbox/invite"
          ]
        }
      },
      "options": [
        {
          "displayName": "Emails",
          "name": "body_emails",
          "type": "json",
          "default": {},
          "description": "List of emails to invite"
        },
        {
          "displayName": "Message",
          "name": "body_message",
          "type": "string",
          "default": "",
          "description": "Message to be sent"
        },
        {
          "displayName": "User Ids",
          "name": "body_user_ids",
          "type": "json",
          "default": {},
          "description": "List of user ids to invite by mail. Users must be in the drive's organisation "
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Dropbox"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/dropboxes"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Files > Dropbox"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/dropboxes"
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
          "displayName": "Cursor",
          "name": "query_cursor",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Limit",
          "name": "query_limit",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order",
          "name": "query_order",
          "type": "options",
          "default": "",
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
          "default": {}
        },
        {
          "displayName": "Type",
          "name": "query_type",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Dropbox"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/dropboxes"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Dropbox"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/dropboxes"
          ]
        }
      },
      "required": true,
      "description": "Name of the dropbox"
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
            "Drive > Files > Dropbox"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/dropboxes"
          ]
        }
      },
      "options": [
        {
          "displayName": "Parent Directory Id",
          "name": "body_parent_directory_id",
          "type": "number",
          "default": 0,
          "description": "Id of the directory in which dropbox will be created"
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
            "Drive > Files > External import"
          ]
        }
      },
      "options": [
        {
          "name": "List Imports",
          "value": "GET /2/drive/{drive_id}/imports"
        },
        {
          "name": "Clean Imports History",
          "value": "DELETE /2/drive/{drive_id}/imports"
        },
        {
          "name": "Import K Drive Sharelink",
          "value": "POST /2/drive/{drive_id}/imports/sharelink"
        },
        {
          "name": "Import K Drive",
          "value": "POST /2/drive/{drive_id}/imports/kdrive"
        },
        {
          "name": "Import Web DAV App",
          "value": "POST /2/drive/{drive_id}/imports/webdav"
        },
        {
          "name": "Import OAuth2 App",
          "value": "POST /2/drive/{drive_id}/imports/oauth"
        },
        {
          "name": "List Eligible Drives",
          "value": "GET /2/drive/{drive_id}/imports/oauth/drives"
        },
        {
          "name": "List Errored Import Files",
          "value": "GET /2/drive/{drive_id}/imports/{import_id}"
        },
        {
          "name": "Delete Import",
          "value": "DELETE /2/drive/{drive_id}/imports/{import_id}"
        },
        {
          "name": "Cancel Import",
          "value": "PUT /2/drive/{drive_id}/imports/{import_id}/cancel"
        }
      ],
      "default": "GET /2/drive/{drive_id}/imports",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/imports"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Files > External import"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/imports"
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
          "displayName": "Total",
          "name": "query_total",
          "type": "boolean",
          "default": false,
          "description": "If set to true, return the total number of items. Total pages (<strong>pages</strong>) in response is also returned.\n<note>You can also use ?with=total parameter</note>\n"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/imports"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/imports/sharelink"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Destination Folder Id",
      "name": "body_destination_folder_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/imports/sharelink"
          ]
        }
      },
      "required": true,
      "description": "ID of the destination folder for the copy"
    },
    {
      "displayName": "Sharelink Uuid",
      "name": "body_sharelink_uuid",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/imports/sharelink"
          ]
        }
      },
      "required": true,
      "description": "UUID of the share link to import"
    },
    {
      "displayName": "Source Drive Id",
      "name": "body_source_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/imports/sharelink"
          ]
        }
      },
      "required": true,
      "description": "ID of the kDrive containing the sharelink to copy"
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
            "Drive > Files > External import"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/imports/sharelink"
          ]
        }
      },
      "options": [
        {
          "displayName": "Except File Ids",
          "name": "body_except_file_ids",
          "type": "json",
          "default": {},
          "description": "Ids of files to be imported. If missing or empty, all files of the share link will be imported"
        },
        {
          "displayName": "File Ids",
          "name": "body_file_ids",
          "type": "json",
          "default": {},
          "description": "Ids of files to be imported. If missing or empty, all files of the share link will be imported"
        },
        {
          "displayName": "Password",
          "name": "body_password",
          "type": "string",
          "default": "",
          "description": "Password to access the sharelink, if password-protected"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/imports/kdrive"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Application Drive Id",
      "name": "body_application_drive_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/imports/kdrive"
          ]
        }
      },
      "required": true,
      "description": "Id of the kDrive containing the content to import"
    },
    {
      "displayName": "Directory Id",
      "name": "body_directory_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/imports/kdrive"
          ]
        }
      },
      "required": true,
      "description": "Destination directory identifier"
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
            "Drive > Files > External import"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/imports/kdrive"
          ]
        }
      },
      "options": [
        {
          "displayName": "Source Path",
          "name": "body_source_path",
          "type": "string",
          "default": "",
          "description": "Path of the folder to import, if different from the root"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/imports/webdav"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Application",
      "name": "body_application",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/imports/webdav"
          ]
        }
      },
      "required": true,
      "description": "Supported service or third-party service identifier for external import.<note><strong>kdrive</strong>: Import from another kDrive.</note><note><strong>nextcloud</strong>: Import from Nextcloud.</note><note><strong>owncloud</strong>: Import from ownCloud.</note><note><strong>webdav</strong>: Import from a generic WebDAV provider.</note>",
      "options": [
        {
          "name": "kdrive",
          "value": "kdrive"
        },
        {
          "name": "nextcloud",
          "value": "nextcloud"
        },
        {
          "name": "owncloud",
          "value": "owncloud"
        },
        {
          "name": "webdav",
          "value": "webdav"
        }
      ]
    },
    {
      "displayName": "Directory Id",
      "name": "body_directory_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/imports/webdav"
          ]
        }
      },
      "required": true,
      "description": "Destination directory identifier"
    },
    {
      "displayName": "Endpoint",
      "name": "body_endpoint",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/imports/webdav"
          ]
        }
      },
      "required": true,
      "description": "Webdav endpoint"
    },
    {
      "displayName": "Login",
      "name": "body_login",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/imports/webdav"
          ]
        }
      },
      "required": true,
      "description": "Webdav login"
    },
    {
      "displayName": "Password",
      "name": "body_password",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/imports/webdav"
          ]
        }
      },
      "required": true,
      "description": "Webdav password"
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
            "Drive > Files > External import"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/imports/webdav"
          ]
        }
      },
      "options": [
        {
          "displayName": "Source Path",
          "name": "body_source_path",
          "type": "string",
          "default": "",
          "description": "Path of the folder to import, if different from the root"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/imports/oauth"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Application",
      "name": "body_application",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/imports/oauth"
          ]
        }
      },
      "required": true,
      "description": "Supported service or third-party service identifier for external import.<note><strong>dropbox</strong>: Import from Dropbox.</note><note><strong>google</strong>: (deprecated) Import from Google Drive.</note><note><strong>google_drive</strong>: Import from Google Drive.</note><note><strong>onedrive</strong>: Import from Microsoft OneDrive.</note>",
      "options": [
        {
          "name": "dropbox",
          "value": "dropbox"
        },
        {
          "name": "google",
          "value": "google"
        },
        {
          "name": "google_drive",
          "value": "google_drive"
        },
        {
          "name": "onedrive",
          "value": "onedrive"
        }
      ]
    },
    {
      "displayName": "Directory Id",
      "name": "body_directory_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/imports/oauth"
          ]
        }
      },
      "required": true,
      "description": "Destination directory identifier"
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
            "Drive > Files > External import"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/imports/oauth"
          ]
        }
      },
      "options": [
        {
          "displayName": "Access Token Id",
          "name": "body_access_token_id",
          "type": "number",
          "default": 0,
          "description": "ID of the authentication token for the application"
        },
        {
          "displayName": "Application Drive Id",
          "name": "body_application_drive_id",
          "type": "string",
          "default": "",
          "description": "Application drive id selected"
        },
        {
          "displayName": "Auth Code",
          "name": "body_auth_code",
          "type": "string",
          "default": "",
          "description": "Authentication code of the application"
        },
        {
          "displayName": "Skip Shared Files",
          "name": "body_skip_shared_files",
          "type": "boolean",
          "default": false,
          "description": "Skip shared files during the import, if the application supports it"
        },
        {
          "displayName": "Source Path",
          "name": "body_source_path",
          "type": "string",
          "default": "",
          "description": "Path of the folder to import, if different from the root"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/imports/oauth/drives"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Application",
      "name": "query_application",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/imports/oauth/drives"
          ]
        }
      },
      "required": true,
      "options": [
        {
          "name": "dropbox",
          "value": "dropbox"
        },
        {
          "name": "google",
          "value": "google"
        },
        {
          "name": "google_drive",
          "value": "google_drive"
        },
        {
          "name": "onedrive",
          "value": "onedrive"
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
            "Drive > Files > External import"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/imports/oauth/drives"
          ]
        }
      },
      "options": [
        {
          "displayName": "Access Token Id",
          "name": "query_access_token_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Auth Code",
          "name": "query_auth_code",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/imports/{import_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Import Id",
      "name": "path_import_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/imports/{import_id}"
          ]
        }
      },
      "required": true,
      "description": "External import identifier"
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
            "Drive > Files > External import"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/imports/{import_id}"
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
          "displayName": "Total",
          "name": "query_total",
          "type": "boolean",
          "default": false,
          "description": "If set to true, return the total number of items. Total pages (<strong>pages</strong>) in response is also returned.\n<note>You can also use ?with=total parameter</note>\n"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/imports/{import_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Import Id",
      "name": "path_import_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/imports/{import_id}"
          ]
        }
      },
      "required": true,
      "description": "External import identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/imports/{import_id}/cancel"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Import Id",
      "name": "path_import_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > External import"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/imports/{import_id}/cancel"
          ]
        }
      },
      "required": true,
      "description": "External import identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Favorite"
          ]
        }
      },
      "options": [
        {
          "name": "Favorite File",
          "value": "POST /2/drive/{drive_id}/files/{file_id}/favorite"
        },
        {
          "name": "Unfavorite File",
          "value": "DELETE /2/drive/{drive_id}/files/{file_id}/favorite"
        },
        {
          "name": "Get Favorite Files List",
          "value": "GET /3/drive/{drive_id}/files/favorites"
        }
      ],
      "default": "POST /2/drive/{drive_id}/files/{file_id}/favorite",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Favorite"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/favorite"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Favorite"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/favorite"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Favorite"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}/favorite"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Favorite"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}/favorite"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Favorite"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/favorites"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Files > Favorite"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/favorites"
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
          "displayName": "Cursor",
          "name": "query_cursor",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Limit",
          "name": "query_limit",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order",
          "name": "query_order",
          "type": "options",
          "default": "",
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
          "default": {}
        },
        {
          "displayName": "Type",
          "name": "query_type",
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
            "Drive > Files > File/Directory"
          ]
        }
      },
      "options": [
        {
          "name": "Trash",
          "value": "DELETE /2/drive/{drive_id}/files/{file_id}"
        },
        {
          "name": "Thumbnail",
          "value": "GET /2/drive/{drive_id}/files/{file_id}/thumbnail"
        },
        {
          "name": "Preview",
          "value": "GET /2/drive/{drive_id}/files/{file_id}/preview"
        },
        {
          "name": "Download",
          "value": "GET /2/drive/{drive_id}/files/{file_id}/download"
        },
        {
          "name": "Rename",
          "value": "POST /2/drive/{drive_id}/files/{file_id}/rename"
        },
        {
          "name": "Get Size",
          "value": "GET /2/drive/{drive_id}/files/{file_id}/sizes"
        },
        {
          "name": "Hash",
          "value": "GET /2/drive/{drive_id}/files/{file_id}/hash"
        },
        {
          "name": "Copy To Drive",
          "value": "POST /2/drive/{drive_id}/files/{file_id}/copy-to-drive"
        },
        {
          "name": "Get A File Temporary URL",
          "value": "GET /2/drive/{drive_id}/files/{file_id}/temporary_url"
        },
        {
          "name": "Get File/Directory",
          "value": "GET /3/drive/{drive_id}/files/{file_id}"
        },
        {
          "name": "Get Files In Directory",
          "value": "GET /3/drive/{drive_id}/files/{file_id}/files"
        },
        {
          "name": "Count Element In Directory",
          "value": "GET /3/drive/{drive_id}/files/{file_id}/count"
        },
        {
          "name": "Create Directory",
          "value": "POST /3/drive/{drive_id}/files/{file_id}/directory"
        },
        {
          "name": "Create Default File",
          "value": "POST /3/drive/{drive_id}/files/{file_id}/file"
        },
        {
          "name": "Copy To Directory",
          "value": "POST /3/drive/{drive_id}/files/{file_id}/copy/{destination_directory_id}"
        },
        {
          "name": "Duplicate",
          "value": "POST /3/drive/{drive_id}/files/{file_id}/duplicate"
        },
        {
          "name": "Convert File",
          "value": "POST /3/drive/{drive_id}/files/{file_id}/convert"
        },
        {
          "name": "Move",
          "value": "POST /3/drive/{drive_id}/files/{file_id}/move/{destination_directory_id}"
        },
        {
          "name": "Unlock",
          "value": "DELETE /3/drive/{drive_id}/files/{file_id}/lock"
        }
      ],
      "default": "DELETE /2/drive/{drive_id}/files/{file_id}",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/thumbnail"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/thumbnail"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/thumbnail"
          ]
        }
      },
      "options": [
        {
          "displayName": "Height",
          "name": "query_height",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Width",
          "name": "query_width",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/preview"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/preview"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/preview"
          ]
        }
      },
      "options": [
        {
          "displayName": "As",
          "name": "query_as",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "pdf",
              "value": "pdf"
            },
            {
              "name": "text",
              "value": "text"
            }
          ]
        },
        {
          "displayName": "Height",
          "name": "query_height",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Quality",
          "name": "query_quality",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Width",
          "name": "query_width",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/download"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/download"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/download"
          ]
        }
      },
      "options": [
        {
          "displayName": "As",
          "name": "query_as",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "pdf",
              "value": "pdf"
            },
            {
              "name": "text",
              "value": "text"
            }
          ]
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/rename"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/rename"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/rename"
          ]
        }
      },
      "required": true,
      "description": "Name of the File/Directory"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/sizes"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/sizes"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/sizes"
          ]
        }
      },
      "options": [
        {
          "displayName": "Depth",
          "name": "query_depth",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "folder",
              "value": "folder"
            },
            {
              "name": "unlimited",
              "value": "unlimited"
            }
          ]
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/hash"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/hash"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/copy-to-drive"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/copy-to-drive"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Source Drive Id",
      "name": "body_source_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/copy-to-drive"
          ]
        }
      },
      "required": true,
      "description": "Source Drive Identifier"
    },
    {
      "displayName": "Source File Id",
      "name": "body_source_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/copy-to-drive"
          ]
        }
      },
      "required": true,
      "description": "Source File Identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/temporary_url"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/temporary_url"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/temporary_url"
          ]
        }
      },
      "options": [
        {
          "displayName": "Duration",
          "name": "query_duration",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/{file_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/{file_id}"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/{file_id}"
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
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/{file_id}/files"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/{file_id}/files"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/{file_id}/files"
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
          "displayName": "Cursor",
          "name": "query_cursor",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Limit",
          "name": "query_limit",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order",
          "name": "query_order",
          "type": "options",
          "default": "",
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
          "default": {}
        },
        {
          "displayName": "Type",
          "name": "query_type",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/{file_id}/count"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/{file_id}/count"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/{file_id}/count"
          ]
        }
      },
      "options": [
        {
          "displayName": "Depth",
          "name": "query_depth",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "folder",
              "value": "folder"
            },
            {
              "name": "unlimited",
              "value": "unlimited"
            }
          ]
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/directory"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/directory"
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
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/directory"
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
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/directory"
          ]
        }
      },
      "required": true,
      "description": "Name of the directory to create"
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
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/directory"
          ]
        }
      },
      "options": [
        {
          "displayName": "Color",
          "name": "body_color",
          "type": "string",
          "default": "",
          "description": "Color of the directory for the user creating it"
        },
        {
          "displayName": "Only For Me",
          "name": "body_only_for_me",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Relative Path",
          "name": "body_relative_path",
          "type": "string",
          "default": "",
          "description": "relative path of the folder to create, from the destination directory"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/file"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/file"
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
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/file"
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
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/file"
          ]
        }
      },
      "required": true,
      "description": "Name of the file to create"
    },
    {
      "displayName": "Type",
      "name": "body_type",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/file"
          ]
        }
      },
      "required": true,
      "description": "The extension of the file",
      "options": [
        {
          "name": "docx",
          "value": "docx"
        },
        {
          "name": "docxf",
          "value": "docxf"
        },
        {
          "name": "drawio",
          "value": "drawio"
        },
        {
          "name": "pptx",
          "value": "pptx"
        },
        {
          "name": "txt",
          "value": "txt"
        },
        {
          "name": "xlsx",
          "value": "xlsx"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/copy/{destination_directory_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/copy/{destination_directory_id}"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Destination Directory Id",
      "name": "path_destination_directory_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/copy/{destination_directory_id}"
          ]
        }
      },
      "required": true,
      "description": "Destination Directory identifier"
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
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/copy/{destination_directory_id}"
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
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/copy/{destination_directory_id}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "Name of the File/Directory"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/duplicate"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/duplicate"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/duplicate"
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
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/duplicate"
          ]
        }
      },
      "options": [
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "Name of the File/Directory"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/convert"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/convert"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/convert"
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
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/move/{destination_directory_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/move/{destination_directory_id}"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Destination Directory Id",
      "name": "path_destination_directory_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/move/{destination_directory_id}"
          ]
        }
      },
      "required": true,
      "description": "Destination Directory identifier"
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
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/move/{destination_directory_id}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Conflict",
          "name": "body_conflict",
          "type": "options",
          "default": "",
          "description": "Select what to do when a file with the same name already exists. The default conflict mode is error.<li><small><ul><strong>error</strong> : An error is returned without creating the file/session.</ul><ul><strong>rename</strong> : Rename the new file with an available name (ex. `file.txt` to `file (3).txt`).</ul></small></li>",
          "options": [
            {
              "name": "error",
              "value": "error"
            },
            {
              "name": "rename",
              "value": "rename"
            }
          ]
        },
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "Name of the File/Directory"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "DELETE /3/drive/{drive_id}/files/{file_id}/lock"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "DELETE /3/drive/{drive_id}/files/{file_id}/lock"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Path",
      "name": "query_path",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "DELETE /3/drive/{drive_id}/files/{file_id}/lock"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Token",
      "name": "query_token",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory"
          ],
          "operation": [
            "DELETE /3/drive/{drive_id}/files/{file_id}/lock"
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
            "Drive > Files > File/Directory > Access"
          ]
        }
      },
      "options": [
        {
          "name": "Allow External Applications",
          "value": "POST /2/drive/{drive_id}/files/{file_id}/access/applications"
        },
        {
          "name": "Get Multi Access",
          "value": "GET /2/drive/{drive_id}/files/{file_id}/access"
        },
        {
          "name": "Add Multi Access",
          "value": "POST /2/drive/{drive_id}/files/{file_id}/access"
        },
        {
          "name": "Synchronize With Parent Rights",
          "value": "POST /2/drive/{drive_id}/files/{file_id}/access/sync-parent"
        },
        {
          "name": "Check Access Change",
          "value": "POST /2/drive/{drive_id}/files/{file_id}/access/check"
        }
      ],
      "default": "POST /2/drive/{drive_id}/files/{file_id}/access/applications",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/applications"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/applications"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Type",
      "name": "body_type",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/applications"
          ]
        }
      },
      "required": true,
      "description": "List of applications.<note><strong>365</strong>: The 365 application.</note><note><strong>collabora</strong>: The collabora application.</note>",
      "options": [
        {
          "name": "365",
          "value": "365"
        },
        {
          "name": "collabora",
          "value": "collabora"
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
            "Drive > Files > File/Directory > Access"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/applications"
          ]
        }
      },
      "options": [
        {
          "displayName": "Mode",
          "name": "body_mode",
          "type": "options",
          "default": "",
          "description": "Asked mode to open the external wopi documents.<note><strong>edit</strong>: Open with the edit mode.</note><note><strong>view</strong>: Open with the view mode.</note>",
          "options": [
            {
              "name": "edit",
              "value": "edit"
            },
            {
              "name": "view",
              "value": "view"
            }
          ]
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/access"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/access"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > File/Directory > Access"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/access"
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
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > File/Directory > Access"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access"
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
          "displayName": "Lang",
          "name": "query_lang",
          "type": "options",
          "default": "",
          "description": "Override the language of the request, in most cases when an e-mail is triggered in the request.",
          "options": [
            {
              "name": "de",
              "value": "de"
            },
            {
              "name": "en",
              "value": "en"
            },
            {
              "name": "es",
              "value": "es"
            },
            {
              "name": "fr",
              "value": "fr"
            },
            {
              "name": "it",
              "value": "it"
            }
          ]
        }
      ]
    },
    {
      "displayName": "Right",
      "name": "body_right",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access"
          ]
        }
      },
      "required": true,
      "description": "Access level of {name}.<note><strong>manage</strong>: Can share, write and read the file.</note><note><strong>none</strong>: Can not act on the file.</note><note><strong>read</strong>: Can only read the file.</note><note><strong>write</strong>: Can write and read the file.</note>",
      "options": [
        {
          "name": "manage",
          "value": "manage"
        },
        {
          "name": "none",
          "value": "none"
        },
        {
          "name": "read",
          "value": "read"
        },
        {
          "name": "write",
          "value": "write"
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
            "Drive > Files > File/Directory > Access"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access"
          ]
        }
      },
      "options": [
        {
          "displayName": "Emails",
          "name": "body_emails",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Message",
          "name": "body_message",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Team Ids",
          "name": "body_team_ids",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "User Ids",
          "name": "body_user_ids",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/sync-parent"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/sync-parent"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/check"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/check"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Right",
      "name": "body_right",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/check"
          ]
        }
      },
      "required": true,
      "description": "Access level of {name}.<note><strong>manage</strong>: Can share, write and read the file.</note><note><strong>none</strong>: Can not act on the file.</note><note><strong>read</strong>: Can only read the file.</note><note><strong>write</strong>: Can write and read the file.</note>",
      "options": [
        {
          "name": "manage",
          "value": "manage"
        },
        {
          "name": "none",
          "value": "none"
        },
        {
          "name": "read",
          "value": "read"
        },
        {
          "name": "write",
          "value": "write"
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
            "Drive > Files > File/Directory > Access"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/check"
          ]
        }
      },
      "options": [
        {
          "displayName": "Emails",
          "name": "body_emails",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Team Ids",
          "name": "body_team_ids",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "User Ids",
          "name": "body_user_ids",
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
            "Drive > Files > File/Directory > Access > Invitation"
          ]
        }
      },
      "options": [
        {
          "name": "Invitation > Get Access",
          "value": "GET /2/drive/{drive_id}/files/{file_id}/access/invitations"
        },
        {
          "name": "Add Access",
          "value": "POST /2/drive/{drive_id}/files/{file_id}/access/invitations"
        },
        {
          "name": "Check Access",
          "value": "POST /2/drive/{drive_id}/files/{file_id}/access/invitations/check"
        }
      ],
      "default": "GET /2/drive/{drive_id}/files/{file_id}/access/invitations",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Invitation"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/access/invitations"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Invitation"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/access/invitations"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Invitation"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/invitations"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Invitation"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/invitations"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > File/Directory > Access > Invitation"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/invitations"
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
          "displayName": "Lang",
          "name": "query_lang",
          "type": "options",
          "default": "",
          "description": "Override the language of the request, in most cases when an e-mail is triggered in the request.",
          "options": [
            {
              "name": "de",
              "value": "de"
            },
            {
              "name": "en",
              "value": "en"
            },
            {
              "name": "es",
              "value": "es"
            },
            {
              "name": "fr",
              "value": "fr"
            },
            {
              "name": "it",
              "value": "it"
            }
          ]
        }
      ]
    },
    {
      "displayName": "Emails",
      "name": "body_emails",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Invitation"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/invitations"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Right",
      "name": "body_right",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Invitation"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/invitations"
          ]
        }
      },
      "required": true,
      "description": "Access level of {name}.<note><strong>manage</strong>: Can share, write and read the file.</note><note><strong>none</strong>: Can not act on the file.</note><note><strong>read</strong>: Can only read the file.</note><note><strong>write</strong>: Can write and read the file.</note>",
      "options": [
        {
          "name": "manage",
          "value": "manage"
        },
        {
          "name": "none",
          "value": "none"
        },
        {
          "name": "read",
          "value": "read"
        },
        {
          "name": "write",
          "value": "write"
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
            "Drive > Files > File/Directory > Access > Invitation"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/invitations"
          ]
        }
      },
      "options": [
        {
          "displayName": "Message",
          "name": "body_message",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Invitation"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/invitations/check"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Invitation"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/invitations/check"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > File/Directory > Access > Invitation"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/invitations/check"
          ]
        }
      },
      "options": [
        {
          "displayName": "Emails",
          "name": "body_emails",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "User Ids",
          "name": "body_user_ids",
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
            "Drive > Files > File/Directory > Access > Request"
          ]
        }
      },
      "options": [
        {
          "name": "Get Requested File Access From Its ID",
          "value": "GET /2/drive/{drive_id}/access/requests/{request_id}"
        },
        {
          "name": "Decline A File Access Request",
          "value": "PUT /2/drive/{drive_id}/access/requests/{request_id}/decline"
        },
        {
          "name": "Get Requested File Access From A File ID",
          "value": "GET /2/drive/{drive_id}/files/{file_id}/access/requests"
        },
        {
          "name": "Create A New File Access Request",
          "value": "POST /2/drive/{drive_id}/files/{file_id}/access/requests"
        }
      ],
      "default": "GET /2/drive/{drive_id}/access/requests/{request_id}",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Request"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/access/requests/{request_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Request Id",
      "name": "path_request_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Request"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/access/requests/{request_id}"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > File/Directory > Access > Request"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/access/requests/{request_id}"
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
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Request"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/access/requests/{request_id}/decline"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Request Id",
      "name": "path_request_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Request"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/access/requests/{request_id}/decline"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Request"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/access/requests"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Request"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/access/requests"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > File/Directory > Access > Request"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/access/requests"
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
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Request"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/requests"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Request"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/requests"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > File/Directory > Access > Request"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/requests"
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
            "Drive > Files > File/Directory > Access > Request"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/requests"
          ]
        }
      },
      "options": [
        {
          "displayName": "Message",
          "name": "body_message",
          "type": "string",
          "default": "",
          "description": "Message provided by the requestor of new access"
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
            "Drive > Files > File/Directory > Access > Teams"
          ]
        }
      },
      "options": [
        {
          "name": "Get Access",
          "value": "GET /2/drive/{drive_id}/files/{file_id}/access/teams"
        },
        {
          "name": "Add Access",
          "value": "POST /2/drive/{drive_id}/files/{file_id}/access/teams"
        },
        {
          "name": "Update Access",
          "value": "PUT /2/drive/{drive_id}/files/{file_id}/access/teams/{team_id}"
        },
        {
          "name": "Remove Access",
          "value": "DELETE /2/drive/{drive_id}/files/{file_id}/access/teams/{team_id}"
        }
      ],
      "default": "GET /2/drive/{drive_id}/files/{file_id}/access/teams",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Teams"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/access/teams"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Teams"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/access/teams"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Teams"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/teams"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Teams"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/teams"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > File/Directory > Access > Teams"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/teams"
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
          "displayName": "Lang",
          "name": "query_lang",
          "type": "options",
          "default": "",
          "description": "Override the language of the request, in most cases when an e-mail is triggered in the request.",
          "options": [
            {
              "name": "de",
              "value": "de"
            },
            {
              "name": "en",
              "value": "en"
            },
            {
              "name": "es",
              "value": "es"
            },
            {
              "name": "fr",
              "value": "fr"
            },
            {
              "name": "it",
              "value": "it"
            }
          ]
        }
      ]
    },
    {
      "displayName": "Right",
      "name": "body_right",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Teams"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/teams"
          ]
        }
      },
      "required": true,
      "description": "Access level of {name}.<note><strong>manage</strong>: Can share, write and read the file.</note><note><strong>none</strong>: Can not act on the file.</note><note><strong>read</strong>: Can only read the file.</note><note><strong>write</strong>: Can write and read the file.</note>",
      "options": [
        {
          "name": "manage",
          "value": "manage"
        },
        {
          "name": "none",
          "value": "none"
        },
        {
          "name": "read",
          "value": "read"
        },
        {
          "name": "write",
          "value": "write"
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
            "Drive > Files > File/Directory > Access > Teams"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/teams"
          ]
        }
      },
      "options": [
        {
          "displayName": "Message",
          "name": "body_message",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Team Ids",
          "name": "body_team_ids",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Teams"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/access/teams/{team_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Teams"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/access/teams/{team_id}"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Teams"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/access/teams/{team_id}"
          ]
        }
      },
      "required": true,
      "description": "Team identifier"
    },
    {
      "displayName": "Right",
      "name": "body_right",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Teams"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/access/teams/{team_id}"
          ]
        }
      },
      "required": true,
      "description": "Access level of {name}.<note><strong>manage</strong>: Can share, write and read the file.</note><note><strong>none</strong>: Can not act on the file.</note><note><strong>read</strong>: Can only read the file.</note><note><strong>write</strong>: Can write and read the file.</note>",
      "options": [
        {
          "name": "manage",
          "value": "manage"
        },
        {
          "name": "none",
          "value": "none"
        },
        {
          "name": "read",
          "value": "read"
        },
        {
          "name": "write",
          "value": "write"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Teams"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}/access/teams/{team_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Teams"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}/access/teams/{team_id}"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Teams"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}/access/teams/{team_id}"
          ]
        }
      },
      "required": true,
      "description": "Team identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Users"
          ]
        }
      },
      "options": [
        {
          "name": "Get Access",
          "value": "GET /2/drive/{drive_id}/files/{file_id}/access/users"
        },
        {
          "name": "Add Access",
          "value": "POST /2/drive/{drive_id}/files/{file_id}/access/users"
        },
        {
          "name": "Update Access",
          "value": "PUT /2/drive/{drive_id}/files/{file_id}/access/users/{user_id}"
        },
        {
          "name": "Remove Access",
          "value": "DELETE /2/drive/{drive_id}/files/{file_id}/access/users/{user_id}"
        },
        {
          "name": "Force Write Access",
          "value": "POST /2/drive/{drive_id}/files/{file_id}/access/force"
        }
      ],
      "default": "GET /2/drive/{drive_id}/files/{file_id}/access/users",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Users"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/access/users"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Users"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/access/users"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Users"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/users"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Users"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/users"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > File/Directory > Access > Users"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/users"
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
          "displayName": "Lang",
          "name": "query_lang",
          "type": "options",
          "default": "",
          "description": "Override the language of the request, in most cases when an e-mail is triggered in the request.",
          "options": [
            {
              "name": "de",
              "value": "de"
            },
            {
              "name": "en",
              "value": "en"
            },
            {
              "name": "es",
              "value": "es"
            },
            {
              "name": "fr",
              "value": "fr"
            },
            {
              "name": "it",
              "value": "it"
            }
          ]
        }
      ]
    },
    {
      "displayName": "Right",
      "name": "body_right",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Users"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/users"
          ]
        }
      },
      "required": true,
      "description": "Access level of {name}.<note><strong>manage</strong>: Can share, write and read the file.</note><note><strong>none</strong>: Can not act on the file.</note><note><strong>read</strong>: Can only read the file.</note><note><strong>write</strong>: Can write and read the file.</note>",
      "options": [
        {
          "name": "manage",
          "value": "manage"
        },
        {
          "name": "none",
          "value": "none"
        },
        {
          "name": "read",
          "value": "read"
        },
        {
          "name": "write",
          "value": "write"
        }
      ]
    },
    {
      "displayName": "User Ids",
      "name": "body_user_ids",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Users"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/users"
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
            "Drive > Files > File/Directory > Access > Users"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/users"
          ]
        }
      },
      "options": [
        {
          "displayName": "Message",
          "name": "body_message",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Users"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/access/users/{user_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Users"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/access/users/{user_id}"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Users"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/access/users/{user_id}"
          ]
        }
      },
      "required": true,
      "description": "User identifier"
    },
    {
      "displayName": "Right",
      "name": "body_right",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Users"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/access/users/{user_id}"
          ]
        }
      },
      "required": true,
      "description": "Access level of {name}.<note><strong>manage</strong>: Can share, write and read the file.</note><note><strong>none</strong>: Can not act on the file.</note><note><strong>read</strong>: Can only read the file.</note><note><strong>write</strong>: Can write and read the file.</note>",
      "options": [
        {
          "name": "manage",
          "value": "manage"
        },
        {
          "name": "none",
          "value": "none"
        },
        {
          "name": "read",
          "value": "read"
        },
        {
          "name": "write",
          "value": "write"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Users"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}/access/users/{user_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Users"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}/access/users/{user_id}"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Users"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}/access/users/{user_id}"
          ]
        }
      },
      "required": true,
      "description": "User identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Users"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/force"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Access > Users"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/access/force"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Comment"
          ]
        }
      },
      "options": [
        {
          "name": "Get File Comments",
          "value": "GET /2/drive/{drive_id}/files/{file_id}/comments"
        },
        {
          "name": "Add Comment",
          "value": "POST /2/drive/{drive_id}/files/{file_id}/comments"
        },
        {
          "name": "Get Comment Reply",
          "value": "GET /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}"
        },
        {
          "name": "Add Comment Reply",
          "value": "POST /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}"
        },
        {
          "name": "Modify Comment",
          "value": "PUT /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}"
        },
        {
          "name": "Delete Comment",
          "value": "DELETE /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}"
        },
        {
          "name": "Like Comment",
          "value": "POST /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}/like"
        },
        {
          "name": "Unlike Comment",
          "value": "POST /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}/unlike"
        }
      ],
      "default": "GET /2/drive/{drive_id}/files/{file_id}/comments",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/comments"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/comments"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/comments"
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
          "displayName": "Total",
          "name": "query_total",
          "type": "boolean",
          "default": false,
          "description": "If set to true, return the total number of items. Total pages (<strong>pages</strong>) in response is also returned.\n<note>You can also use ?with=total parameter</note>\n"
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
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/comments"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/comments"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/comments"
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
      "displayName": "Body",
      "name": "body_body",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/comments"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Comment Id",
      "name": "path_comment_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}"
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
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}"
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
          "displayName": "Total",
          "name": "query_total",
          "type": "boolean",
          "default": false,
          "description": "If set to true, return the total number of items. Total pages (<strong>pages</strong>) in response is also returned.\n<note>You can also use ?with=total parameter</note>\n"
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
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Comment Id",
      "name": "path_comment_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}"
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
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}"
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
      "displayName": "Body",
      "name": "body_body",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Comment Id",
      "name": "path_comment_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}"
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
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}"
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
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Body",
          "name": "body_body",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Is Resolved",
          "name": "body_is_resolved",
          "type": "boolean",
          "default": false
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Comment Id",
      "name": "path_comment_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}/like"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}/like"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Comment Id",
      "name": "path_comment_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}/like"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}/unlike"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}/unlike"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Comment Id",
      "name": "path_comment_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Comment"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}/unlike"
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
            "Drive > Files > File/Directory > Upload"
          ]
        }
      },
      "options": [
        {
          "name": "Cancel By Path",
          "value": "DELETE /2/drive/{drive_id}/upload"
        },
        {
          "name": "Upload",
          "value": "POST /3/drive/{drive_id}/upload"
        }
      ],
      "default": "DELETE /2/drive/{drive_id}/upload",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Upload"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/upload"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Files > File/Directory > Upload"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/upload"
          ]
        }
      },
      "options": [
        {
          "displayName": "Directory Id",
          "name": "body_directory_id",
          "type": "number",
          "default": 0,
          "description": "The directory destination root of the new file. Must be a directory.\n                        <note>If the identifier is unknown you can use only <strong>directory_path</strong>.</note>\n                        <note>The identifier <strong>1</strong> is the user root folder.</note>\n                        <note>Required without <strong>directory_path</strong></note>"
        },
        {
          "displayName": "Directory Path",
          "name": "body_directory_path",
          "type": "string",
          "default": "",
          "description": "The destination path of the new file. If the <strong> directory_id</strong> is provided the directory path is used as a relative path, otherwise it will be used as an absolute path. The destination should be a directory.\n                        <note>If the directory path does not exist, folders are created automatically.</note>\n                        <note>The path is a destination path, the file name should not be provided at the end.</note>\n                        <note>Required without <strong>directory_id</strong>.</note>"
        },
        {
          "displayName": "File Name",
          "name": "body_file_name",
          "type": "string",
          "default": "",
          "description": "The name of the file to create.\n                        <note>Slashes will be replaced by colons.</note>\n                        <note>Maximum bytes size is 255</note>"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Upload"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/upload"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Total Size",
      "name": "query_total_size",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Upload"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/upload"
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
            "Drive > Files > File/Directory > Upload"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/upload"
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
          "displayName": "Client Token",
          "name": "query_client_token",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Conflict",
          "name": "query_conflict",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "error",
              "value": "error"
            },
            {
              "name": "rename",
              "value": "rename"
            },
            {
              "name": "version",
              "value": "version"
            }
          ]
        },
        {
          "displayName": "Created At",
          "name": "query_created_at",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Directory Id",
          "name": "query_directory_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Directory Path",
          "name": "query_directory_path",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "File Name",
          "name": "query_file_name",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Last Modified At",
          "name": "query_last_modified_at",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Symbolic Link",
          "name": "query_symbolic_link",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Total Chunk Hash",
          "name": "query_total_chunk_hash",
          "type": "string",
          "default": ""
        }
      ]
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
            "Drive > Files > File/Directory > Upload"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/upload"
          ]
        }
      }
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Upload > Session"
          ]
        }
      },
      "options": [
        {
          "name": "Cancel Session",
          "value": "DELETE /2/drive/{drive_id}/upload/session/{session_token}"
        },
        {
          "name": "Batch : Cancel Sessions",
          "value": "DELETE /2/drive/{drive_id}/upload/session/batch"
        },
        {
          "name": "Start Session",
          "value": "POST /3/drive/{drive_id}/upload/session/start"
        },
        {
          "name": "Batch : Start Sessions",
          "value": "POST /3/drive/{drive_id}/upload/session/batch/start"
        },
        {
          "name": "Append Chunk To Session",
          "value": "POST /3/drive/{drive_id}/upload/session/{session_token}/chunk"
        },
        {
          "name": "Close Session",
          "value": "POST /3/drive/{drive_id}/upload/session/{session_token}/finish"
        },
        {
          "name": "Batch : Close Sessions",
          "value": "POST /3/drive/{drive_id}/upload/session/batch/finish"
        }
      ],
      "default": "DELETE /2/drive/{drive_id}/upload/session/{session_token}",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Upload > Session"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/upload/session/{session_token}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Session Token",
      "name": "path_session_token",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Upload > Session"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/upload/session/{session_token}"
          ]
        }
      },
      "required": true,
      "description": "Session token uuid"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Upload > Session"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/upload/session/batch"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Tokens",
      "name": "query_tokens",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Upload > Session"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/upload/session/batch"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Upload > Session"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/upload/session/start"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Files > File/Directory > Upload > Session"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/upload/session/start"
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
      "displayName": "Total Chunks",
      "name": "body_total_chunks",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Upload > Session"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/upload/session/start"
          ]
        }
      },
      "required": true,
      "description": "The total number of chunks attached to the session."
    },
    {
      "displayName": "Total Size",
      "name": "body_total_size",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Upload > Session"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/upload/session/start"
          ]
        }
      },
      "required": true,
      "description": "Expected total size of the file to upload. If the uploaded content does not match this size, an error will be returned.<note>the unit of size is defined in Bytes.</note>"
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
            "Drive > Files > File/Directory > Upload > Session"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/upload/session/start"
          ]
        }
      },
      "options": [
        {
          "displayName": "Conflict",
          "name": "body_conflict",
          "type": "options",
          "default": "",
          "description": "Select what to do when a file with the same name already exists. The default conflict mode is error.<li><small><ul><strong>error</strong> : An error is returned without creating the file/session.</ul><ul><strong>rename</strong> : Rename the new file with an available name (ex. `file.txt` to `file(3).txt`).</ul><ul><strong>version</strong> : Replace the content of the existing file (create a new version of the file).</ul></small></li>",
          "options": [
            {
              "name": "error",
              "value": "error"
            },
            {
              "name": "rename",
              "value": "rename"
            },
            {
              "name": "version",
              "value": "version"
            }
          ]
        },
        {
          "displayName": "Created At",
          "name": "body_created_at",
          "type": "number",
          "default": 0,
          "description": "Override the creation date metadata of the new file.<note>The value of this field will be capped at 24h from the current time.</note>"
        },
        {
          "displayName": "Directory Id",
          "name": "body_directory_id",
          "type": "number",
          "default": 0,
          "description": "The directory destination root of the new file. Must be a directory.\n                        <note>If the identifier is unknown you can use only <strong>directory_path</strong>.</note>\n                        <note>You can get your root private folder ID from <a href='/docs/api/get/3/drive/{drive_id}/files/{file_id}/files'>3/drive/{drive_id}/files/{file_id}/files</a>.\n                        <note>Required without <strong>directory_path</strong></note>"
        },
        {
          "displayName": "Directory Path",
          "name": "body_directory_path",
          "type": "string",
          "default": "",
          "description": "The destination path of the new file. If the <strong> directory_id</strong> is provided the directory path is used as a relative path, otherwise it will be used as an absolute path. The destination should be a directory.\n                        <note>If the directory path does not exist, folders are created automatically.</note>\n                        <note>The path is a destination path, the file name should not be provided at the end.</note>\n                        <note>Required without <strong>directory_id</strong>.</note>"
        },
        {
          "displayName": "File Id",
          "name": "body_file_id",
          "type": "number",
          "default": 0,
          "description": "File identifier of uploaded file.\n                        <note>This is an alternative to replace a file by its identifier, if this mode is used <strong>file_name</strong>, <strong>directory_id</strong>, <strong>conflict</strong> and <strong>directory_path</strong> params are automatically computed and cannot be provided.</note>\n                        <note>If you don't know the identifier, or you want to upload a new file, you should provide a filename and a directory destination.</note>"
        },
        {
          "displayName": "File Name",
          "name": "body_file_name",
          "type": "string",
          "default": "",
          "description": "The name of the file to create.\n                        <note>Slashes will be replaced by colons.</note>\n                        <note>Maximum bytes size is 255</note>"
        },
        {
          "displayName": "Last Modified At",
          "name": "body_last_modified_at",
          "type": "number",
          "default": 0,
          "description": "Override the update date metadata of the new file.<note>The value of this field will be capped at 24h from the current time.</note>"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Upload > Session"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/upload/session/batch/start"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Files > File/Directory > Upload > Session"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/upload/session/batch/start"
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
      "displayName": "*",
      "name": "body__",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Upload > Session"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/upload/session/batch/start"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Upload > Session"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/upload/session/{session_token}/chunk"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Session Token",
      "name": "path_session_token",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Upload > Session"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/upload/session/{session_token}/chunk"
          ]
        }
      },
      "required": true,
      "description": "Session token uuid"
    },
    {
      "displayName": "Chunk Number",
      "name": "query_chunk_number",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Upload > Session"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/upload/session/{session_token}/chunk"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Chunk Size",
      "name": "query_chunk_size",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Upload > Session"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/upload/session/{session_token}/chunk"
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
            "Drive > Files > File/Directory > Upload > Session"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/upload/session/{session_token}/chunk"
          ]
        }
      },
      "options": [
        {
          "displayName": "Chunk Hash",
          "name": "query_chunk_hash",
          "type": "string",
          "default": ""
        }
      ]
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
            "Drive > Files > File/Directory > Upload > Session"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/upload/session/{session_token}/chunk"
          ]
        }
      }
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Upload > Session"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/upload/session/{session_token}/finish"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Session Token",
      "name": "path_session_token",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Upload > Session"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/upload/session/{session_token}/finish"
          ]
        }
      },
      "required": true,
      "description": "Session token uuid"
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
            "Drive > Files > File/Directory > Upload > Session"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/upload/session/{session_token}/finish"
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
            "Drive > Files > File/Directory > Upload > Session"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/upload/session/{session_token}/finish"
          ]
        }
      },
      "options": [
        {
          "displayName": "Created At",
          "name": "body_created_at",
          "type": "number",
          "default": 0,
          "description": "Override the creation date metadata of the new file.<note>The value of this field will be capped at 24h from the current time.</note>"
        },
        {
          "displayName": "Last Modified At",
          "name": "body_last_modified_at",
          "type": "number",
          "default": 0,
          "description": "Override the update date metadata of the new file.<note>The value of this field will be capped at 24h from the current time.</note>"
        },
        {
          "displayName": "Total Chunk Hash",
          "name": "body_total_chunk_hash",
          "type": "string",
          "default": "",
          "description": "The hash of the content of the file. If provided and the uploaded content does not match this hash, an error will be returned. For a multi-chunk upload use the hash of the concatenation of the chunk's hashes.<note>Supported hashing algorithm: md5, sha1, sha256, sha512, xxh3, xxh32, xxh64, xxh128</note>"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Upload > Session"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/upload/session/batch/finish"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Files > File/Directory > Upload > Session"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/upload/session/batch/finish"
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
      "displayName": "*",
      "name": "body__",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Upload > Session"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/upload/session/batch/finish"
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
            "Drive > Files > File/Directory > Version"
          ]
        }
      },
      "options": [
        {
          "name": "List",
          "value": "GET /2/drive/{drive_id}/files/{file_id}/versions"
        },
        {
          "name": "Delete All",
          "value": "DELETE /2/drive/{drive_id}/files/{file_id}/versions"
        },
        {
          "name": "Update Current",
          "value": "PUT /2/drive/{drive_id}/files/{file_id}/versions/current"
        },
        {
          "name": "Get",
          "value": "GET /2/drive/{drive_id}/files/{file_id}/versions/{version_id}"
        },
        {
          "name": "Update",
          "value": "PUT /2/drive/{drive_id}/files/{file_id}/versions/{version_id}"
        },
        {
          "name": "Delete",
          "value": "DELETE /2/drive/{drive_id}/files/{file_id}/versions/{version_id}"
        },
        {
          "name": "Download",
          "value": "GET /2/drive/{drive_id}/files/{file_id}/versions/{version_id}/download"
        },
        {
          "name": "Restore",
          "value": "POST /2/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore"
        },
        {
          "name": "Restore To Directory",
          "value": "POST /2/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore/{destination_directory_id}"
        },
        {
          "name": "List",
          "value": "GET /3/drive/{drive_id}/files/{file_id}/versions"
        },
        {
          "name": "Restore",
          "value": "POST /3/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore"
        },
        {
          "name": "Restore To Directory",
          "value": "POST /3/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore/{destination_directory_id}"
        }
      ],
      "default": "GET /2/drive/{drive_id}/files/{file_id}/versions",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/versions"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/versions"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/versions"
          ]
        }
      },
      "options": [
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
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}/versions"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}/versions"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/versions/current"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/versions/current"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Keep Forever",
      "name": "body_keep_forever",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/versions/current"
          ]
        }
      },
      "required": true,
      "description": "Indicate whether the current version should be kept forever"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/versions/{version_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/versions/{version_id}"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Version Id",
      "name": "path_version_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/versions/{version_id}"
          ]
        }
      },
      "required": true,
      "description": "Version identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/versions/{version_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/versions/{version_id}"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Version Id",
      "name": "path_version_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/versions/{version_id}"
          ]
        }
      },
      "required": true,
      "description": "Version identifier"
    },
    {
      "displayName": "Keep Forever",
      "name": "body_keep_forever",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/versions/{version_id}"
          ]
        }
      },
      "required": true,
      "description": "Never delete this version from version history"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}/versions/{version_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}/versions/{version_id}"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Version Id",
      "name": "path_version_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}/versions/{version_id}"
          ]
        }
      },
      "required": true,
      "description": "Version identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/versions/{version_id}/download"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/versions/{version_id}/download"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Version Id",
      "name": "path_version_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/versions/{version_id}/download"
          ]
        }
      },
      "required": true,
      "description": "Version identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Version Id",
      "name": "path_version_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore"
          ]
        }
      },
      "required": true,
      "description": "Version identifier"
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
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore"
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
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore/{destination_directory_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore/{destination_directory_id}"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Version Id",
      "name": "path_version_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore/{destination_directory_id}"
          ]
        }
      },
      "required": true,
      "description": "Version identifier"
    },
    {
      "displayName": "Destination Directory Id",
      "name": "path_destination_directory_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore/{destination_directory_id}"
          ]
        }
      },
      "required": true,
      "description": "Directory identifier"
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
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore/{destination_directory_id}"
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
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore/{destination_directory_id}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "Name of File in the destination Directory"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/{file_id}/versions"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/{file_id}/versions"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/{file_id}/versions"
          ]
        }
      },
      "options": [
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
          "displayName": "Total",
          "name": "query_total",
          "type": "boolean",
          "default": false,
          "description": "If set to true, return the total number of items. Total pages (<strong>pages</strong>) in response is also returned.\n<note>You can also use ?with=total parameter</note>\n"
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
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Version Id",
      "name": "path_version_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore"
          ]
        }
      },
      "required": true,
      "description": "Version identifier"
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
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore"
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
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore/{destination_directory_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore/{destination_directory_id}"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Version Id",
      "name": "path_version_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore/{destination_directory_id}"
          ]
        }
      },
      "required": true,
      "description": "Version identifier"
    },
    {
      "displayName": "Destination Directory Id",
      "name": "path_destination_directory_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore/{destination_directory_id}"
          ]
        }
      },
      "required": true,
      "description": "Directory identifier"
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
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore/{destination_directory_id}"
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
            "Drive > Files > File/Directory > Version"
          ],
          "operation": [
            "POST /3/drive/{drive_id}/files/{file_id}/versions/{version_id}/restore/{destination_directory_id}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "Name of File in the destination Directory"
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
            "Drive > Files > Search"
          ]
        }
      },
      "options": [
        {
          "name": "Search File/directory",
          "value": "GET /3/drive/{drive_id}/files/search"
        },
        {
          "name": "Search Dropbox",
          "value": "GET /3/drive/{drive_id}/files/search/dropboxes"
        },
        {
          "name": "Search Favorite",
          "value": "GET /3/drive/{drive_id}/files/search/favorites"
        },
        {
          "name": "Search Sharelink",
          "value": "GET /3/drive/{drive_id}/files/search/links"
        },
        {
          "name": "Search Shared",
          "value": "GET /3/drive/{drive_id}/files/search/shared_with_me"
        },
        {
          "name": "Search My Shared",
          "value": "GET /3/drive/{drive_id}/files/search/my_shared"
        },
        {
          "name": "Search Trash",
          "value": "GET /3/drive/{drive_id}/files/search/trash"
        }
      ],
      "default": "GET /3/drive/{drive_id}/files/search",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Search"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/search"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Files > Search"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/search"
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
          "displayName": "Cursor",
          "name": "query_cursor",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Limit",
          "name": "query_limit",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order",
          "name": "query_order",
          "type": "options",
          "default": "",
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
          "default": {}
        },
        {
          "displayName": "Author Id",
          "name": "query_author_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Category",
          "name": "query_category",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Depth",
          "name": "query_depth",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "child",
              "value": "child"
            },
            {
              "name": "unlimited",
              "value": "unlimited"
            }
          ]
        },
        {
          "displayName": "Directory Id",
          "name": "query_directory_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Extensions",
          "name": "query_extensions",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Modified After",
          "name": "query_modified_after",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Modified At",
          "name": "query_modified_at",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "custom",
              "value": "custom"
            },
            {
              "name": "last_month",
              "value": "last_month"
            },
            {
              "name": "last_week",
              "value": "last_week"
            },
            {
              "name": "last_year",
              "value": "last_year"
            },
            {
              "name": "this_month",
              "value": "this_month"
            },
            {
              "name": "this_week",
              "value": "this_week"
            },
            {
              "name": "this_year",
              "value": "this_year"
            },
            {
              "name": "today",
              "value": "today"
            },
            {
              "name": "yesterday",
              "value": "yesterday"
            }
          ]
        },
        {
          "displayName": "Modified Before",
          "name": "query_modified_before",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Name",
          "name": "query_name",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Query",
          "name": "query_query",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Types",
          "name": "query_types",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Search"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/search/dropboxes"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Files > Search"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/search/dropboxes"
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
          "displayName": "Cursor",
          "name": "query_cursor",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Limit",
          "name": "query_limit",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order",
          "name": "query_order",
          "type": "options",
          "default": "",
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
          "default": {}
        },
        {
          "displayName": "Author Id",
          "name": "query_author_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Category",
          "name": "query_category",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Created After",
          "name": "query_created_after",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Created At",
          "name": "query_created_at",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "custom",
              "value": "custom"
            },
            {
              "name": "last_month",
              "value": "last_month"
            },
            {
              "name": "last_week",
              "value": "last_week"
            },
            {
              "name": "last_year",
              "value": "last_year"
            },
            {
              "name": "this_month",
              "value": "this_month"
            },
            {
              "name": "this_week",
              "value": "this_week"
            },
            {
              "name": "this_year",
              "value": "this_year"
            },
            {
              "name": "today",
              "value": "today"
            },
            {
              "name": "yesterday",
              "value": "yesterday"
            }
          ]
        },
        {
          "displayName": "Created Before",
          "name": "query_created_before",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Expires",
          "name": "query_expires",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "any",
              "value": "any"
            },
            {
              "name": "no",
              "value": "no"
            },
            {
              "name": "yes",
              "value": "yes"
            }
          ]
        },
        {
          "displayName": "Has Password",
          "name": "query_has_password",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "any",
              "value": "any"
            },
            {
              "name": "no",
              "value": "no"
            },
            {
              "name": "yes",
              "value": "yes"
            }
          ]
        },
        {
          "displayName": "Last Import After",
          "name": "query_last_import_after",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Last Import At",
          "name": "query_last_import_at",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "custom",
              "value": "custom"
            },
            {
              "name": "last_month",
              "value": "last_month"
            },
            {
              "name": "last_week",
              "value": "last_week"
            },
            {
              "name": "last_year",
              "value": "last_year"
            },
            {
              "name": "this_month",
              "value": "this_month"
            },
            {
              "name": "this_week",
              "value": "this_week"
            },
            {
              "name": "this_year",
              "value": "this_year"
            },
            {
              "name": "today",
              "value": "today"
            },
            {
              "name": "yesterday",
              "value": "yesterday"
            }
          ]
        },
        {
          "displayName": "Last Import Before",
          "name": "query_last_import_before",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Query",
          "name": "query_query",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Search"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/search/favorites"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Files > Search"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/search/favorites"
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
          "displayName": "Cursor",
          "name": "query_cursor",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Limit",
          "name": "query_limit",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order",
          "name": "query_order",
          "type": "options",
          "default": "",
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
          "default": {}
        },
        {
          "displayName": "Author Id",
          "name": "query_author_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Category",
          "name": "query_category",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Depth",
          "name": "query_depth",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "child",
              "value": "child"
            },
            {
              "name": "unlimited",
              "value": "unlimited"
            }
          ]
        },
        {
          "displayName": "Directory Id",
          "name": "query_directory_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Extensions",
          "name": "query_extensions",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Modified After",
          "name": "query_modified_after",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Modified At",
          "name": "query_modified_at",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "custom",
              "value": "custom"
            },
            {
              "name": "last_month",
              "value": "last_month"
            },
            {
              "name": "last_week",
              "value": "last_week"
            },
            {
              "name": "last_year",
              "value": "last_year"
            },
            {
              "name": "this_month",
              "value": "this_month"
            },
            {
              "name": "this_week",
              "value": "this_week"
            },
            {
              "name": "this_year",
              "value": "this_year"
            },
            {
              "name": "today",
              "value": "today"
            },
            {
              "name": "yesterday",
              "value": "yesterday"
            }
          ]
        },
        {
          "displayName": "Modified Before",
          "name": "query_modified_before",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Name",
          "name": "query_name",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Query",
          "name": "query_query",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Types",
          "name": "query_types",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Search"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/search/links"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Files > Search"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/search/links"
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
          "displayName": "Cursor",
          "name": "query_cursor",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Limit",
          "name": "query_limit",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order",
          "name": "query_order",
          "type": "options",
          "default": "",
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
          "default": {}
        },
        {
          "displayName": "Author Id",
          "name": "query_author_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Category",
          "name": "query_category",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Created After",
          "name": "query_created_after",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Created At",
          "name": "query_created_at",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "custom",
              "value": "custom"
            },
            {
              "name": "last_month",
              "value": "last_month"
            },
            {
              "name": "last_week",
              "value": "last_week"
            },
            {
              "name": "last_year",
              "value": "last_year"
            },
            {
              "name": "this_month",
              "value": "this_month"
            },
            {
              "name": "this_week",
              "value": "this_week"
            },
            {
              "name": "this_year",
              "value": "this_year"
            },
            {
              "name": "today",
              "value": "today"
            },
            {
              "name": "yesterday",
              "value": "yesterday"
            }
          ]
        },
        {
          "displayName": "Created Before",
          "name": "query_created_before",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Expires",
          "name": "query_expires",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "any",
              "value": "any"
            },
            {
              "name": "no",
              "value": "no"
            },
            {
              "name": "yes",
              "value": "yes"
            }
          ]
        },
        {
          "displayName": "Has Password",
          "name": "query_has_password",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "any",
              "value": "any"
            },
            {
              "name": "no",
              "value": "no"
            },
            {
              "name": "yes",
              "value": "yes"
            }
          ]
        },
        {
          "displayName": "Query",
          "name": "query_query",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Search"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/search/shared_with_me"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Files > Search"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/search/shared_with_me"
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
          "displayName": "Cursor",
          "name": "query_cursor",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Limit",
          "name": "query_limit",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order",
          "name": "query_order",
          "type": "options",
          "default": "",
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
          "default": {}
        },
        {
          "displayName": "Author Id",
          "name": "query_author_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Category",
          "name": "query_category",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Depth",
          "name": "query_depth",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "child",
              "value": "child"
            },
            {
              "name": "unlimited",
              "value": "unlimited"
            }
          ]
        },
        {
          "displayName": "Directory Id",
          "name": "query_directory_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Extensions",
          "name": "query_extensions",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Modified After",
          "name": "query_modified_after",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Modified At",
          "name": "query_modified_at",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "custom",
              "value": "custom"
            },
            {
              "name": "last_month",
              "value": "last_month"
            },
            {
              "name": "last_week",
              "value": "last_week"
            },
            {
              "name": "last_year",
              "value": "last_year"
            },
            {
              "name": "this_month",
              "value": "this_month"
            },
            {
              "name": "this_week",
              "value": "this_week"
            },
            {
              "name": "this_year",
              "value": "this_year"
            },
            {
              "name": "today",
              "value": "today"
            },
            {
              "name": "yesterday",
              "value": "yesterday"
            }
          ]
        },
        {
          "displayName": "Modified Before",
          "name": "query_modified_before",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Name",
          "name": "query_name",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Query",
          "name": "query_query",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Types",
          "name": "query_types",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Search"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/search/my_shared"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Files > Search"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/search/my_shared"
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
          "displayName": "Cursor",
          "name": "query_cursor",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Limit",
          "name": "query_limit",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order",
          "name": "query_order",
          "type": "options",
          "default": "",
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
          "default": {}
        },
        {
          "displayName": "Author Id",
          "name": "query_author_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Category",
          "name": "query_category",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Depth",
          "name": "query_depth",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "child",
              "value": "child"
            },
            {
              "name": "unlimited",
              "value": "unlimited"
            }
          ]
        },
        {
          "displayName": "Directory Id",
          "name": "query_directory_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Extensions",
          "name": "query_extensions",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Modified After",
          "name": "query_modified_after",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Modified At",
          "name": "query_modified_at",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "custom",
              "value": "custom"
            },
            {
              "name": "last_month",
              "value": "last_month"
            },
            {
              "name": "last_week",
              "value": "last_week"
            },
            {
              "name": "last_year",
              "value": "last_year"
            },
            {
              "name": "this_month",
              "value": "this_month"
            },
            {
              "name": "this_week",
              "value": "this_week"
            },
            {
              "name": "this_year",
              "value": "this_year"
            },
            {
              "name": "today",
              "value": "today"
            },
            {
              "name": "yesterday",
              "value": "yesterday"
            }
          ]
        },
        {
          "displayName": "Modified Before",
          "name": "query_modified_before",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Name",
          "name": "query_name",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Query",
          "name": "query_query",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Types",
          "name": "query_types",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Search"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/search/trash"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Files > Search"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/search/trash"
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
          "displayName": "Cursor",
          "name": "query_cursor",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Limit",
          "name": "query_limit",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order",
          "name": "query_order",
          "type": "options",
          "default": "",
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
          "default": {}
        },
        {
          "displayName": "Author Id",
          "name": "query_author_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Category",
          "name": "query_category",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Deleted After",
          "name": "query_deleted_after",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Deleted At",
          "name": "query_deleted_at",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "custom",
              "value": "custom"
            },
            {
              "name": "last_month",
              "value": "last_month"
            },
            {
              "name": "last_week",
              "value": "last_week"
            },
            {
              "name": "last_year",
              "value": "last_year"
            },
            {
              "name": "this_month",
              "value": "this_month"
            },
            {
              "name": "this_week",
              "value": "this_week"
            },
            {
              "name": "this_year",
              "value": "this_year"
            },
            {
              "name": "today",
              "value": "today"
            },
            {
              "name": "yesterday",
              "value": "yesterday"
            }
          ]
        },
        {
          "displayName": "Deleted Before",
          "name": "query_deleted_before",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Deleted By",
          "name": "query_deleted_by",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Query",
          "name": "query_query",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Types",
          "name": "query_types",
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
            "Drive > Files > Share link > Archive"
          ]
        }
      },
      "options": [
        {
          "name": "Build Archive",
          "value": "POST /2/app/{drive_id}/share/{sharelink_uuid}/archive"
        },
        {
          "name": "Download Sharelink Archive",
          "value": "GET /2/app/{drive_id}/share/{sharelink_uuid}/archive/{archive_uuid}/download"
        }
      ],
      "default": "POST /2/app/{drive_id}/share/{sharelink_uuid}/archive",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Share link > Archive"
          ],
          "operation": [
            "POST /2/app/{drive_id}/share/{sharelink_uuid}/archive"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Sharelink Uuid",
      "name": "path_sharelink_uuid",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Share link > Archive"
          ],
          "operation": [
            "POST /2/app/{drive_id}/share/{sharelink_uuid}/archive"
          ]
        }
      },
      "required": true,
      "description": "Sharelink token"
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
            "Drive > Files > Share link > Archive"
          ],
          "operation": [
            "POST /2/app/{drive_id}/share/{sharelink_uuid}/archive"
          ]
        }
      },
      "options": [
        {
          "displayName": "Except File Ids",
          "name": "body_except_file_ids",
          "type": "json",
          "default": {},
          "description": "Array of files to exclude from the request; only used when parent_id is set, meaningless otherwise"
        },
        {
          "displayName": "File Ids",
          "name": "body_file_ids",
          "type": "json",
          "default": {},
          "description": "Array of files to include in the request; required without parent_id"
        },
        {
          "displayName": "Parent Id",
          "name": "body_parent_id",
          "type": "number",
          "default": 0,
          "description": "The directory containing the files to include in the request; required without file_ids"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Share link > Archive"
          ],
          "operation": [
            "GET /2/app/{drive_id}/share/{sharelink_uuid}/archive/{archive_uuid}/download"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Sharelink Uuid",
      "name": "path_sharelink_uuid",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Share link > Archive"
          ],
          "operation": [
            "GET /2/app/{drive_id}/share/{sharelink_uuid}/archive/{archive_uuid}/download"
          ]
        }
      },
      "required": true,
      "description": "Sharelink token"
    },
    {
      "displayName": "Archive Uuid",
      "name": "path_archive_uuid",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Share link > Archive"
          ],
          "operation": [
            "GET /2/app/{drive_id}/share/{sharelink_uuid}/archive/{archive_uuid}/download"
          ]
        }
      },
      "required": true,
      "description": "Archive token"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Share link > Manage"
          ]
        }
      },
      "options": [
        {
          "name": "Get Share Link",
          "value": "GET /2/drive/{drive_id}/files/{file_id}/link"
        },
        {
          "name": "Create Share Link",
          "value": "POST /2/drive/{drive_id}/files/{file_id}/link"
        },
        {
          "name": "Update Share Link",
          "value": "PUT /2/drive/{drive_id}/files/{file_id}/link"
        },
        {
          "name": "Remove Share Link",
          "value": "DELETE /2/drive/{drive_id}/files/{file_id}/link"
        },
        {
          "name": "Share Link Invite",
          "value": "POST /2/drive/{drive_id}/files/{file_id}/link/invite"
        },
        {
          "name": "Get Share Link Files",
          "value": "GET /3/drive/{drive_id}/files/links"
        }
      ],
      "default": "GET /2/drive/{drive_id}/files/{file_id}/link",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Share link > Manage"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/link"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Share link > Manage"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/link"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > Share link > Manage"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/files/{file_id}/link"
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
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Share link > Manage"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/link"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Share link > Manage"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/link"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > Share link > Manage"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/link"
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
      "displayName": "Right",
      "name": "body_right",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Share link > Manage"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/link"
          ]
        }
      },
      "required": true,
      "description": "Permission of the shared link: no restriction (public), access by authenticated and authorized user (inherit) or public but protected by a password (password)",
      "options": [
        {
          "name": "inherit",
          "value": "inherit"
        },
        {
          "name": "password",
          "value": "password"
        },
        {
          "name": "public",
          "value": "public"
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
            "Drive > Files > Share link > Manage"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/link"
          ]
        }
      },
      "options": [
        {
          "displayName": "Can Comment",
          "name": "body_can_comment",
          "type": "boolean",
          "default": false,
          "description": "Allow users to to comment the shared files. It takes the same value as can_edit if unset or null"
        },
        {
          "displayName": "Can Download",
          "name": "body_can_download",
          "type": "boolean",
          "default": false,
          "description": "Allow users to download shared content"
        },
        {
          "displayName": "Can Edit",
          "name": "body_can_edit",
          "type": "boolean",
          "default": false,
          "description": "Allow users to edit the file content using the shared link"
        },
        {
          "displayName": "Can Request Access",
          "name": "body_can_request_access",
          "type": "boolean",
          "default": false,
          "description": "Allow connected users to join the folder via the shared link. It is not possible to join a file via a shared link"
        },
        {
          "displayName": "Can See Info",
          "name": "body_can_see_info",
          "type": "boolean",
          "default": false,
          "description": "Allow users to see information about the shared files"
        },
        {
          "displayName": "Can See Stats",
          "name": "body_can_see_stats",
          "type": "boolean",
          "default": false,
          "description": "Allow users to see statistics"
        },
        {
          "displayName": "Password",
          "name": "body_password",
          "type": "string",
          "default": "",
          "description": "The password if the permission password is set"
        },
        {
          "displayName": "Valid Until",
          "name": "body_valid_until",
          "type": "number",
          "default": 0,
          "description": "Maximum validity timestamp of the shared link"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Share link > Manage"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/link"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Share link > Manage"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/link"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > Share link > Manage"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/files/{file_id}/link"
          ]
        }
      },
      "options": [
        {
          "displayName": "Can Comment",
          "name": "body_can_comment",
          "type": "boolean",
          "default": false,
          "description": "Allow users to to comment the shared files. It takes the same value as can_edit if unset or null"
        },
        {
          "displayName": "Can Download",
          "name": "body_can_download",
          "type": "boolean",
          "default": false,
          "description": "Allow users to download shared content"
        },
        {
          "displayName": "Can Edit",
          "name": "body_can_edit",
          "type": "boolean",
          "default": false,
          "description": "Allow users to edit the file content using the shared link"
        },
        {
          "displayName": "Can Request Access",
          "name": "body_can_request_access",
          "type": "boolean",
          "default": false,
          "description": "Allow connected users to join the folder via the shared link. It is not possible to join a file via a shared link"
        },
        {
          "displayName": "Can See Info",
          "name": "body_can_see_info",
          "type": "boolean",
          "default": false,
          "description": "Allow users to see information about the shared files"
        },
        {
          "displayName": "Can See Stats",
          "name": "body_can_see_stats",
          "type": "boolean",
          "default": false,
          "description": "Allow users to see statistics"
        },
        {
          "displayName": "Password",
          "name": "body_password",
          "type": "string",
          "default": "",
          "description": "The password if the permission password is set"
        },
        {
          "displayName": "Right",
          "name": "body_right",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "inherit",
              "value": "inherit"
            },
            {
              "name": "password",
              "value": "password"
            },
            {
              "name": "public",
              "value": "public"
            }
          ]
        },
        {
          "displayName": "Valid Until",
          "name": "body_valid_until",
          "type": "number",
          "default": 0,
          "description": "Maximum validity timestamp of the shared link"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Share link > Manage"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}/link"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Share link > Manage"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/files/{file_id}/link"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Share link > Manage"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/link/invite"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Share link > Manage"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/link/invite"
          ]
        }
      },
      "required": true,
      "description": "File identifier"
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
            "Drive > Files > Share link > Manage"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/files/{file_id}/link/invite"
          ]
        }
      },
      "options": [
        {
          "displayName": "Emails",
          "name": "body_emails",
          "type": "json",
          "default": {},
          "description": "List of emails to invite"
        },
        {
          "displayName": "Message",
          "name": "body_message",
          "type": "string",
          "default": "",
          "description": "Message to be sent"
        },
        {
          "displayName": "User Ids",
          "name": "body_user_ids",
          "type": "json",
          "default": {},
          "description": "List of user ids to invite by mail. Users must be in the drive's organisation "
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Share link > Manage"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/links"
          ]
        }
      },
      "required": true,
      "description": "the drive identifier"
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
            "Drive > Files > Share link > Manage"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/files/links"
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
          "displayName": "Cursor",
          "name": "query_cursor",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Limit",
          "name": "query_limit",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order",
          "name": "query_order",
          "type": "options",
          "default": "",
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
          "default": {}
        },
        {
          "displayName": "Right",
          "name": "query_right",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Type",
          "name": "query_type",
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
            "Drive > Files > Trash"
          ]
        }
      },
      "options": [
        {
          "name": "Empty Trash",
          "value": "DELETE /2/drive/{drive_id}/trash"
        },
        {
          "name": "Count Directory/File In Trash",
          "value": "GET /2/drive/{drive_id}/trash/count"
        },
        {
          "name": "Remove File",
          "value": "DELETE /2/drive/{drive_id}/trash/{file_id}"
        },
        {
          "name": "Restore File",
          "value": "POST /2/drive/{drive_id}/trash/{file_id}/restore"
        },
        {
          "name": "Get Thumbnail",
          "value": "GET /2/drive/{drive_id}/trash/{file_id}/thumbnail"
        },
        {
          "name": "Count Directory/File In Trashed Directory",
          "value": "GET /2/drive/{drive_id}/trash/{file_id}/count"
        },
        {
          "name": "Get Files Of Trash",
          "value": "GET /3/drive/{drive_id}/trash"
        },
        {
          "name": "Get Trashed File",
          "value": "GET /3/drive/{drive_id}/trash/{file_id}"
        },
        {
          "name": "Get Files Of Trashed Directory",
          "value": "GET /3/drive/{drive_id}/trash/{file_id}/files"
        },
        {
          "name": "Count Directories/files In Trash",
          "value": "GET /3/drive/{drive_id}/trash/{file_id}/count"
        }
      ],
      "default": "DELETE /2/drive/{drive_id}/trash",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Trash"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/trash"
          ]
        }
      },
      "required": true,
      "description": "the drive identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Trash"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/trash/count"
          ]
        }
      },
      "required": true,
      "description": "the drive identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Trash"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/trash/{file_id}"
          ]
        }
      },
      "required": true,
      "description": "the drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Trash"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/trash/{file_id}"
          ]
        }
      },
      "required": true,
      "description": "the file identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Trash"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/trash/{file_id}/restore"
          ]
        }
      },
      "required": true,
      "description": "the drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Trash"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/trash/{file_id}/restore"
          ]
        }
      },
      "required": true,
      "description": "the file identifier"
    },
    {
      "displayName": "Destination Directory Id",
      "name": "body_destination_directory_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Trash"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/trash/{file_id}/restore"
          ]
        }
      },
      "required": true,
      "description": "Destination directory identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Trash"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/trash/{file_id}/thumbnail"
          ]
        }
      },
      "required": true,
      "description": "the drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Trash"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/trash/{file_id}/thumbnail"
          ]
        }
      },
      "required": true,
      "description": "the file identifier"
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
            "Drive > Files > Trash"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/trash/{file_id}/thumbnail"
          ]
        }
      },
      "options": [
        {
          "displayName": "Height",
          "name": "query_height",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Width",
          "name": "query_width",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Trash"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/trash/{file_id}/count"
          ]
        }
      },
      "required": true,
      "description": "the drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Trash"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/trash/{file_id}/count"
          ]
        }
      },
      "required": true,
      "description": "the file identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Trash"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/trash"
          ]
        }
      },
      "required": true,
      "description": "the drive identifier"
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
            "Drive > Files > Trash"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/trash"
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
          "displayName": "Cursor",
          "name": "query_cursor",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Limit",
          "name": "query_limit",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order",
          "name": "query_order",
          "type": "options",
          "default": "",
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
          "default": {}
        },
        {
          "displayName": "Type",
          "name": "query_type",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Trash"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/trash/{file_id}"
          ]
        }
      },
      "required": true,
      "description": "the drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Trash"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/trash/{file_id}"
          ]
        }
      },
      "required": true,
      "description": "the file identifier"
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
            "Drive > Files > Trash"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/trash/{file_id}"
          ]
        }
      },
      "options": [
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
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Trash"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/trash/{file_id}/files"
          ]
        }
      },
      "required": true,
      "description": "the drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Trash"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/trash/{file_id}/files"
          ]
        }
      },
      "required": true,
      "description": "the file identifier"
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
            "Drive > Files > Trash"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/trash/{file_id}/files"
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
          "displayName": "Cursor",
          "name": "query_cursor",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Limit",
          "name": "query_limit",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Order",
          "name": "query_order",
          "type": "options",
          "default": "",
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
          "default": {}
        },
        {
          "displayName": "Type",
          "name": "query_type",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Trash"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/trash/{file_id}/count"
          ]
        }
      },
      "required": true,
      "description": "the drive identifier"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Files > Trash"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/trash/{file_id}/count"
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
            "Drive > Files > Trash"
          ],
          "operation": [
            "GET /3/drive/{drive_id}/trash/{file_id}/count"
          ]
        }
      },
      "options": [
        {
          "displayName": "Depth",
          "name": "query_depth",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "folder",
              "value": "folder"
            },
            {
              "name": "unlimited",
              "value": "unlimited"
            }
          ]
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
            "Drive > Invitations"
          ]
        }
      },
      "options": [
        {
          "name": "Get User Invitation",
          "value": "GET /2/drive/{drive_id}/users/invitation"
        },
        {
          "name": "Get Invitation Information",
          "value": "GET /2/drive/{drive_id}/users/invitation/{invitation_id}"
        },
        {
          "name": "Update An Invitation",
          "value": "PUT /2/drive/{drive_id}/users/invitation/{invitation_id}"
        },
        {
          "name": "Delete Invitation",
          "value": "DELETE /2/drive/{drive_id}/users/invitation/{invitation_id}"
        },
        {
          "name": "Send Invitation",
          "value": "POST /2/drive/{drive_id}/users/invitation/{invitation_id}/send"
        }
      ],
      "default": "GET /2/drive/{drive_id}/users/invitation",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Invitations"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/users/invitation"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Invitations"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/users/invitation"
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
          "displayName": "Emails",
          "name": "query_emails",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Status",
          "name": "query_status",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "User Ids",
          "name": "query_user_ids",
          "type": "json",
          "default": {}
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
          "displayName": "Total",
          "name": "query_total",
          "type": "boolean",
          "default": false,
          "description": "If set to true, return the total number of items. Total pages (<strong>pages</strong>) in response is also returned.\n<note>You can also use ?with=total parameter</note>\n"
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Invitations"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/users/invitation/{invitation_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Invitation Id",
      "name": "path_invitation_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Invitations"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/users/invitation/{invitation_id}"
          ]
        }
      },
      "required": true,
      "description": "Invitation identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Invitations"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/users/invitation/{invitation_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Invitation Id",
      "name": "path_invitation_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Invitations"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/users/invitation/{invitation_id}"
          ]
        }
      },
      "required": true,
      "description": "Invitation identifier"
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
            "Drive > Invitations"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/users/invitation/{invitation_id}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Email",
          "name": "body_email",
          "type": "string",
          "default": "",
          "description": "Email"
        },
        {
          "displayName": "Message",
          "name": "body_message",
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
          "displayName": "Right",
          "name": "body_right",
          "type": "options",
          "default": "",
          "description": "Access level of {name}.<note><strong>manage</strong>: Can share, write and read the file.</note><note><strong>none</strong>: Can not act on the file.</note><note><strong>read</strong>: Can only read the file.</note><note><strong>write</strong>: Can write and read the file.</note>",
          "options": [
            {
              "name": "manage",
              "value": "manage"
            },
            {
              "name": "none",
              "value": "none"
            },
            {
              "name": "read",
              "value": "read"
            },
            {
              "name": "write",
              "value": "write"
            }
          ]
        },
        {
          "displayName": "Role",
          "name": "body_role",
          "type": "options",
          "default": "",
          "description": "Administration level of the user.<note><strong>admin</strong>: Administrator of the drive, can manage the drive (settings, invitations and users) and the files.</note><note><strong>user</strong>: Internal user can invite user and manage the files of his private directory and other directories with manage file access.</note>",
          "options": [
            {
              "name": "admin",
              "value": "admin"
            },
            {
              "name": "user",
              "value": "user"
            }
          ]
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Invitations"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/users/invitation/{invitation_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Invitation Id",
      "name": "path_invitation_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Invitations"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/users/invitation/{invitation_id}"
          ]
        }
      },
      "required": true,
      "description": "Invitation identifier"
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
            "Drive > Invitations"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/users/invitation/{invitation_id}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Send Email",
          "name": "query_send_email",
          "type": "boolean",
          "default": false
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Invitations"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/users/invitation/{invitation_id}/send"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Invitation Id",
      "name": "path_invitation_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Invitations"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/users/invitation/{invitation_id}/send"
          ]
        }
      },
      "required": true,
      "description": "Invitation identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Settings"
          ]
        }
      },
      "options": [
        {
          "name": "Get Drive's Settings",
          "value": "GET /2/drive/{drive_id}/settings"
        },
        {
          "name": "Update IA Settings",
          "value": "PUT /2/drive/{drive_id}/settings/ai"
        },
        {
          "name": "Update Share Link Settings",
          "value": "PUT /2/drive/{drive_id}/settings/link"
        },
        {
          "name": "Update Trash Settings",
          "value": "PUT /2/drive/{drive_id}/settings/trash"
        },
        {
          "name": "Update Office Settings",
          "value": "PUT /2/drive/{drive_id}/settings/office"
        },
        {
          "name": "Update Preferences",
          "value": "PUT /2/drive/{drive_id}/preferences"
        }
      ],
      "default": "GET /2/drive/{drive_id}/settings",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Settings"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/settings"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Settings"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/settings/ai"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Settings"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/settings/ai"
          ]
        }
      },
      "options": [
        {
          "displayName": "Has Approved",
          "name": "body_has_approved",
          "type": "boolean",
          "default": false,
          "description": "If the `User` consents to the AI scan."
        },
        {
          "displayName": "Has Approved Ai Categories",
          "name": "body_has_approved_ai_categories",
          "type": "boolean",
          "default": false,
          "description": "If the `User` consents to automatic `Categories` on `Files`."
        },
        {
          "displayName": "Has Approved Content Search",
          "name": "body_has_approved_content_search",
          "type": "boolean",
          "default": false,
          "description": "If the `User` consents to search in `Files` contents."
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Settings"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/settings/link"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Activate",
      "name": "body_activate",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Settings"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/settings/link"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "BgColor",
      "name": "body_bgColor",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Settings"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/settings/link"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "TxtColor",
      "name": "body_txtColor",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Settings"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/settings/link"
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
            "Drive > Settings"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/settings/link"
          ]
        }
      },
      "options": [
        {
          "displayName": "Images",
          "name": "body_images",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Settings"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/settings/trash"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "Max Duration",
      "name": "body_max_duration",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Settings"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/settings/trash"
          ]
        }
      },
      "required": true,
      "description": "Number of days to keep file in trash. <note>The unit is in days, and the available values depend on your offer.</note> check <strong>pack.limit.trash.options</strong>: <a href=\"/docs/api/get/2/drive/%7Bdrive_id%7D\">/drive/{drive_id}</a>"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Settings"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/settings/office"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Settings"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/settings/office"
          ]
        }
      },
      "options": [
        {
          "displayName": "Form",
          "name": "body_form",
          "type": "options",
          "default": "",
          "description": "List of applications.<note><strong>365</strong>: The 365 application.</note><note><strong>onlyoffice</strong>: The onlyoffice application.</note>",
          "options": [
            {
              "name": "365",
              "value": "365"
            },
            {
              "name": "onlyoffice",
              "value": "onlyoffice"
            }
          ]
        },
        {
          "displayName": "Presentation",
          "name": "body_presentation",
          "type": "options",
          "default": "",
          "description": "List of applications.<note><strong>365</strong>: The 365 application.</note><note><strong>onlyoffice</strong>: The onlyoffice application.</note>",
          "options": [
            {
              "name": "365",
              "value": "365"
            },
            {
              "name": "onlyoffice",
              "value": "onlyoffice"
            }
          ]
        },
        {
          "displayName": "Spreadsheet",
          "name": "body_spreadsheet",
          "type": "options",
          "default": "",
          "description": "List of applications.<note><strong>365</strong>: The 365 application.</note><note><strong>onlyoffice</strong>: The onlyoffice application.</note>",
          "options": [
            {
              "name": "365",
              "value": "365"
            },
            {
              "name": "onlyoffice",
              "value": "onlyoffice"
            }
          ]
        },
        {
          "displayName": "Text",
          "name": "body_text",
          "type": "options",
          "default": "",
          "description": "List of applications.<note><strong>365</strong>: The 365 application.</note><note><strong>onlyoffice</strong>: The onlyoffice application.</note>",
          "options": [
            {
              "name": "365",
              "value": "365"
            },
            {
              "name": "onlyoffice",
              "value": "onlyoffice"
            }
          ]
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Settings"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/preferences"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Settings"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/preferences"
          ]
        }
      },
      "options": [
        {
          "displayName": "Color",
          "name": "body_color",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Default Page",
          "name": "body_default_page",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "common",
              "value": "common"
            },
            {
              "name": "dropbox",
              "value": "dropbox"
            },
            {
              "name": "favorite",
              "value": "favorite"
            },
            {
              "name": "last_modified",
              "value": "last_modified"
            },
            {
              "name": "links",
              "value": "links"
            },
            {
              "name": "my_shared",
              "value": "my_shared"
            },
            {
              "name": "private",
              "value": "private"
            },
            {
              "name": "shared_with_me",
              "value": "shared_with_me"
            },
            {
              "name": "statistics",
              "value": "statistics"
            },
            {
              "name": "trash",
              "value": "trash"
            }
          ]
        },
        {
          "displayName": "Hide",
          "name": "body_hide",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Ui",
          "name": "body_ui",
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
            "Drive > Statistics"
          ]
        }
      },
      "options": [
        {
          "name": "Chart : Files Size",
          "value": "GET /2/drive/{drive_id}/statistics/sizes"
        },
        {
          "name": "Export : Files Size",
          "value": "GET /2/drive/{drive_id}/statistics/sizes/export"
        },
        {
          "name": "Activities : Users",
          "value": "GET /2/drive/{drive_id}/statistics/activities/users"
        },
        {
          "name": "Activities : Shared Files",
          "value": "GET /2/drive/{drive_id}/statistics/activities/shared_files"
        },
        {
          "name": "Chart : Activities",
          "value": "GET /2/drive/{drive_id}/statistics/activities"
        },
        {
          "name": "Export : Activities",
          "value": "GET /2/drive/{drive_id}/statistics/activities/export"
        },
        {
          "name": "Activities : Share Links",
          "value": "GET /2/drive/{drive_id}/statistics/activities/links"
        },
        {
          "name": "Export : Share Links Activities",
          "value": "GET /2/drive/{drive_id}/statistics/activities/links/export"
        }
      ],
      "default": "GET /2/drive/{drive_id}/statistics/sizes",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/sizes"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/sizes"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Interval",
      "name": "query_interval",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/sizes"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Metrics",
      "name": "query_metrics",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/sizes"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Until",
      "name": "query_until",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/sizes"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/sizes/export"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/sizes/export"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Interval",
      "name": "query_interval",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/sizes/export"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Metrics",
      "name": "query_metrics",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/sizes/export"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Until",
      "name": "query_until",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/sizes/export"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/activities/users"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/activities/users"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Until",
      "name": "query_until",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/activities/users"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/activities/shared_files"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/activities/shared_files"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Until",
      "name": "query_until",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/activities/shared_files"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/activities"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/activities"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Interval",
      "name": "query_interval",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/activities"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Metric",
      "name": "query_metric",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/activities"
          ]
        }
      },
      "required": true,
      "options": [
        {
          "name": "devices",
          "value": "devices"
        },
        {
          "name": "shared_files",
          "value": "shared_files"
        },
        {
          "name": "users",
          "value": "users"
        }
      ]
    },
    {
      "displayName": "Until",
      "name": "query_until",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/activities"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/activities/export"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/activities/export"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Interval",
      "name": "query_interval",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/activities/export"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Metric",
      "name": "query_metric",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/activities/export"
          ]
        }
      },
      "required": true,
      "options": [
        {
          "name": "devices",
          "value": "devices"
        },
        {
          "name": "shared_files",
          "value": "shared_files"
        },
        {
          "name": "users",
          "value": "users"
        }
      ]
    },
    {
      "displayName": "Until",
      "name": "query_until",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/activities/export"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/activities/links"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/activities/links"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Until",
      "name": "query_until",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/activities/links"
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
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/activities/links"
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
          "displayName": "Max View",
          "name": "query_max_view",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Min View",
          "name": "query_min_view",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Rights",
          "name": "query_rights",
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
          "displayName": "Valid Until",
          "name": "query_valid_until",
          "type": "number",
          "default": 0
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
          "displayName": "Total",
          "name": "query_total",
          "type": "boolean",
          "default": false,
          "description": "If set to true, return the total number of items. Total pages (<strong>pages</strong>) in response is also returned.\n<note>You can also use ?with=total parameter</note>\n"
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
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/activities/links/export"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/activities/links/export"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Until",
      "name": "query_until",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/activities/links/export"
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
            "Drive > Statistics"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/statistics/activities/links/export"
          ]
        }
      },
      "options": [
        {
          "displayName": "Max View",
          "name": "query_max_view",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Min View",
          "name": "query_min_view",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Rights",
          "name": "query_rights",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Valid Until",
          "name": "query_valid_until",
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
            "Drive > Users"
          ]
        }
      },
      "options": [
        {
          "name": "Get Users",
          "value": "GET /2/drive/{drive_id}/users"
        },
        {
          "name": "Create User",
          "value": "POST /2/drive/{drive_id}/users"
        },
        {
          "name": "Get User",
          "value": "GET /2/drive/{drive_id}/users/{user_id}"
        },
        {
          "name": "Update User",
          "value": "PUT /2/drive/{drive_id}/users/{user_id}"
        },
        {
          "name": "Delete User",
          "value": "DELETE /2/drive/{drive_id}/users/{user_id}"
        },
        {
          "name": "Update User Manager Right",
          "value": "PATCH /2/drive/{drive_id}/users/{user_id}/manager"
        },
        {
          "name": "Lock User",
          "value": "POST /2/drive/{drive_id}/users/{user_id}/lock"
        },
        {
          "name": "Unlock User",
          "value": "POST /2/drive/{drive_id}/users/{user_id}/unlock"
        }
      ],
      "default": "GET /2/drive/{drive_id}/users",
      "noDataExpression": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Users"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/users"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Users"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/users"
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
          "displayName": "Search",
          "name": "query_search",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Status",
          "name": "query_status",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Types",
          "name": "query_types",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "User Ids",
          "name": "query_user_ids",
          "type": "json",
          "default": {}
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
          "displayName": "Total",
          "name": "query_total",
          "type": "boolean",
          "default": false,
          "description": "If set to true, return the total number of items. Total pages (<strong>pages</strong>) in response is also returned.\n<note>You can also use ?with=total parameter</note>\n"
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
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Users"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/users"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
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
            "Drive > Users"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/users"
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
      "displayName": "Role",
      "name": "body_role",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Users"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/users"
          ]
        }
      },
      "required": true,
      "description": "Administration level of the user.<note><strong>admin</strong>: Administrator of the drive, can manage the drive (settings, invitations and users) and the files.</note><note><strong>external</strong>: External user can only access the files given by the others roles.</note><note><strong>user</strong>: Internal user can invite user and manage the files of his private directory and other directories with manage file access.</note>",
      "options": [
        {
          "name": "admin",
          "value": "admin"
        },
        {
          "name": "external",
          "value": "external"
        },
        {
          "name": "user",
          "value": "user"
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
            "Drive > Users"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/users"
          ]
        }
      },
      "options": [
        {
          "displayName": "Emails",
          "name": "body_emails",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "File Id",
          "name": "body_file_id",
          "type": "number",
          "default": 0,
          "description": "For adding a file shared along the invitation."
        },
        {
          "displayName": "Lang",
          "name": "body_lang",
          "type": "options",
          "default": "",
          "description": "Invitation language fallback if user's preference is not found",
          "options": [
            {
              "name": "de",
              "value": "de"
            },
            {
              "name": "en",
              "value": "en"
            },
            {
              "name": "es",
              "value": "es"
            },
            {
              "name": "fr",
              "value": "fr"
            },
            {
              "name": "it",
              "value": "it"
            }
          ]
        },
        {
          "displayName": "Message",
          "name": "body_message",
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
          "displayName": "Right",
          "name": "body_right",
          "type": "options",
          "default": "",
          "description": "Access level of {name}.<note><strong>manage</strong>: Can share, write and read the file.</note><note><strong>none</strong>: Can not act on the file.</note><note><strong>read</strong>: Can only read the file.</note><note><strong>write</strong>: Can write and read the file.</note>",
          "options": [
            {
              "name": "manage",
              "value": "manage"
            },
            {
              "name": "none",
              "value": "none"
            },
            {
              "name": "read",
              "value": "read"
            },
            {
              "name": "write",
              "value": "write"
            }
          ]
        },
        {
          "displayName": "Send Email",
          "name": "body_send_email",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Team Ids",
          "name": "body_team_ids",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Type",
          "name": "body_type",
          "type": "options",
          "default": "",
          "description": "Type of the access; this field is no longer used and has been replaced by an additional role property `external`.<note><strong>main</strong>: User has access to the drive.</note><note><strong>shared</strong>: User has access to a shared file / directory only.</note>",
          "options": [
            {
              "name": "main",
              "value": "main"
            },
            {
              "name": "shared",
              "value": "shared"
            }
          ]
        },
        {
          "displayName": "User Ids",
          "name": "body_user_ids",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Users"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/users/{user_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Users"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/users/{user_id}"
          ]
        }
      },
      "required": true,
      "description": "User Identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Users"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/users/{user_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Users"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/users/{user_id}"
          ]
        }
      },
      "required": true,
      "description": "User Identifier"
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
            "Drive > Users"
          ],
          "operation": [
            "PUT /2/drive/{drive_id}/users/{user_id}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "Name of the resource `{name}`"
        },
        {
          "displayName": "Role",
          "name": "body_role",
          "type": "options",
          "default": "",
          "description": "Administration level of the user.<note><strong>admin</strong>: Administrator of the drive, can manage the drive (settings, invitations and users) and the files.</note><note><strong>user</strong>: Internal user can invite user and manage the files of his private directory and other directories with manage file access.</note>",
          "options": [
            {
              "name": "admin",
              "value": "admin"
            },
            {
              "name": "user",
              "value": "user"
            }
          ]
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Users"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/users/{user_id}"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Users"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/users/{user_id}"
          ]
        }
      },
      "required": true,
      "description": "User Identifier"
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
            "Drive > Users"
          ],
          "operation": [
            "DELETE /2/drive/{drive_id}/users/{user_id}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Notify",
          "name": "body_notify",
          "type": "boolean",
          "default": false,
          "description": "Whether the deleted user should be notified by email, false by default."
        }
      ]
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Users"
          ],
          "operation": [
            "PATCH /2/drive/{drive_id}/users/{user_id}/manager"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Users"
          ],
          "operation": [
            "PATCH /2/drive/{drive_id}/users/{user_id}/manager"
          ]
        }
      },
      "required": true,
      "description": "User Identifier"
    },
    {
      "displayName": "Roles",
      "name": "body_roles",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Users"
          ],
          "operation": [
            "PATCH /2/drive/{drive_id}/users/{user_id}/manager"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Users"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/users/{user_id}/lock"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Users"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/users/{user_id}/lock"
          ]
        }
      },
      "required": true,
      "description": "User Identifier"
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Users"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/users/{user_id}/unlock"
          ]
        }
      },
      "required": true,
      "description": "Drive identifier"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Drive > Users"
          ],
          "operation": [
            "POST /2/drive/{drive_id}/users/{user_id}/unlock"
          ]
        }
      },
      "required": true,
      "description": "User Identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Others"
          ]
        }
      },
      "options": [
        {
          "name": "Accessibles Drives",
          "value": "GET /2/drive"
        }
      ],
      "default": "GET /2/drive",
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
            "Others"
          ],
          "operation": [
            "GET /2/drive"
          ]
        }
      },
      "required": true,
      "description": "Account identifier"
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
            "Others"
          ],
          "operation": [
            "GET /2/drive"
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
          "displayName": "In Maintenance",
          "name": "query_in_maintenance",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Maintenance Reasons",
          "name": "query_maintenance_reasons",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Tags",
          "name": "query_tags",
          "type": "json",
          "default": {}
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
          "displayName": "Total",
          "name": "query_total",
          "type": "boolean",
          "default": false,
          "description": "If set to true, return the total number of items. Total pages (<strong>pages</strong>) in response is also returned.\n<note>You can also use ?with=total parameter</note>\n"
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
            "Users"
          ]
        }
      },
      "options": [
        {
          "name": "Get Users",
          "value": "GET /2/drive/users"
        },
        {
          "name": "Get Drives",
          "value": "GET /2/drive/users/{user_id}/drives"
        },
        {
          "name": "Get User's Preference",
          "value": "GET /2/drive/preferences"
        },
        {
          "name": "Set User's Preference",
          "value": "PATCH /2/drive/preferences"
        }
      ],
      "default": "GET /2/drive/users",
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
            "Users"
          ],
          "operation": [
            "GET /2/drive/users"
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
          "displayName": "Search",
          "name": "query_search",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "User Ids",
          "name": "query_user_ids",
          "type": "json",
          "default": {}
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
          "displayName": "Total",
          "name": "query_total",
          "type": "boolean",
          "default": false,
          "description": "If set to true, return the total number of items. Total pages (<strong>pages</strong>) in response is also returned.\n<note>You can also use ?with=total parameter</note>\n"
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
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "GET /2/drive/users/{user_id}/drives"
          ]
        }
      },
      "required": true,
      "description": "User identifier"
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "GET /2/drive/users/{user_id}/drives"
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
            "Users"
          ],
          "operation": [
            "GET /2/drive/users/{user_id}/drives"
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
          "displayName": "Roles",
          "name": "query_roles",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Status",
          "name": "query_status",
          "type": "json",
          "default": {}
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
          "displayName": "Total",
          "name": "query_total",
          "type": "boolean",
          "default": false,
          "description": "If set to true, return the total number of items. Total pages (<strong>pages</strong>) in response is also returned.\n<note>You can also use ?with=total parameter</note>\n"
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
            "Users"
          ],
          "operation": [
            "GET /2/drive/preferences"
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
            "Users"
          ],
          "operation": [
            "PATCH /2/drive/preferences"
          ]
        }
      },
      "options": [
        {
          "displayName": "Date Format",
          "name": "body_date_format",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "d F Y",
              "value": "d F Y"
            },
            {
              "name": "d/m/Y",
              "value": "d/m/Y"
            },
            {
              "name": "m/d/Y",
              "value": "m/d/Y"
            }
          ]
        },
        {
          "displayName": "Default Drive",
          "name": "body_default_drive",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Density",
          "name": "body_density",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "compact",
              "value": "compact"
            },
            {
              "name": "large",
              "value": "large"
            },
            {
              "name": "normal",
              "value": "normal"
            }
          ]
        },
        {
          "displayName": "List",
          "name": "body_list",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Sort Recent File",
          "name": "body_sort_recent_file",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Tutorials",
          "name": "body_tutorials",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Use Shortcut",
          "name": "body_use_shortcut",
          "type": "boolean",
          "default": false
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
            "Drive > Activity",
            "Drive > Activity > Report",
            "Drive > Activity > Report",
            "Drive > Files > External import",
            "Drive > Files > External import",
            "Drive > Files > File/Directory > Comment",
            "Drive > Files > File/Directory > Comment",
            "Drive > Files > File/Directory > Version",
            "Drive > Invitations",
            "Drive > Statistics",
            "Drive > Users",
            "Others",
            "Users",
            "Users"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/activities",
            "GET /2/drive/{drive_id}/activities/reports",
            "GET /2/drive/{drive_id}/activities/reports/{report_id}",
            "GET /2/drive/{drive_id}/imports",
            "GET /2/drive/{drive_id}/imports/{import_id}",
            "GET /2/drive/{drive_id}/files/{file_id}/comments",
            "GET /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}",
            "GET /3/drive/{drive_id}/files/{file_id}/versions",
            "GET /2/drive/{drive_id}/users/invitation",
            "GET /2/drive/{drive_id}/statistics/activities/links",
            "GET /2/drive/{drive_id}/users",
            "GET /2/drive",
            "GET /2/drive/users",
            "GET /2/drive/users/{user_id}/drives"
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
            "Drive > Activity",
            "Drive > Activity > Report",
            "Drive > Activity > Report",
            "Drive > Files > External import",
            "Drive > Files > External import",
            "Drive > Files > File/Directory > Comment",
            "Drive > Files > File/Directory > Comment",
            "Drive > Files > File/Directory > Version",
            "Drive > Invitations",
            "Drive > Statistics",
            "Drive > Users",
            "Others",
            "Users",
            "Users"
          ],
          "operation": [
            "GET /2/drive/{drive_id}/activities",
            "GET /2/drive/{drive_id}/activities/reports",
            "GET /2/drive/{drive_id}/activities/reports/{report_id}",
            "GET /2/drive/{drive_id}/imports",
            "GET /2/drive/{drive_id}/imports/{import_id}",
            "GET /2/drive/{drive_id}/files/{file_id}/comments",
            "GET /2/drive/{drive_id}/files/{file_id}/comments/{comment_id}",
            "GET /3/drive/{drive_id}/files/{file_id}/versions",
            "GET /2/drive/{drive_id}/users/invitation",
            "GET /2/drive/{drive_id}/statistics/activities/links",
            "GET /2/drive/{drive_id}/users",
            "GET /2/drive",
            "GET /2/drive/users",
            "GET /2/drive/users/{user_id}/drives"
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
