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
    "Update Drive": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Get Users": {
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
    "Wake A Sleeping Drive Up": {
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
    "Get Drive Activities Of All The Users.": {
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
    "Get Drive Activities Of All The Users. (2)": {
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
    "Get Total Count Drive Activities Of All The Users.": {
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
    "Get File Activities": {
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
    "Get Root Activities": {
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
    "List Reports": {
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
    "Create Report": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Get Report": {
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
    "Delete Report": {
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
    "Export Report": {
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
    "Check File' Existence": {
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
    "Get Largest Files": {
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
    "Get Last Modified Files": {
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
    "Get Most Versioned Files": {
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
    "Get My Shared Files": {
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
    "Get Shared Files": {
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
    "Create Team Directory": {
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
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "List The Most Recent Files Or Directories Used By The User.": {
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
    "Undo Action": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Drive > Files > Archive": {
    "Download Archive": {
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
    "Build Archive": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Drive > Files > Category": {
    "Get All Categories": {
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
    "Create Category": {
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
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Edit Category": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete Category": {
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
    "Add Category On Files": {
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
    "Remove Category On Files": {
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
    "Add Category On File": {
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
    "Remove Category On File": {
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
    "Remove Categories On File": {
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
    "Validates An AI Generated Category": {
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
    "Get": {
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
    "Update/Create": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Drive > Files > Dropbox": {
    "Get Dropbox": {
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
    "Convert A Folder Into A Dropbox": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Update Dropbox": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete Dropbox": {
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
    "Dropbox Invite": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Get Drop Boxes": {
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
    "Create A New Dropbox": {
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
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Drive > Files > External Import": {
    "List Imports": {
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
    "Clean Imports History": {
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
    "Import K Drive Sharelink": {
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
    "Import K Drive": {
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
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Import Web DAV App": {
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
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Import OAuth2 App": {
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
          "name": "application",
          "field": "body_application"
        },
        {
          "name": "directory_id",
          "field": "body_directory_id"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "List Eligible Drives": {
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
    "List Errored Import Files": {
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
    "Delete Import": {
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
    "Cancel Import": {
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
    "Favorite File": {
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
    "Unfavorite File": {
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
    "Get Favorite Files List": {
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
    "Trash": {
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
    "Thumbnail": {
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
    "Preview": {
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
    "Download": {
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
    "Rename": {
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
    "Get Size": {
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
    "Hash": {
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
    "Copy To Drive": {
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
    "Get A File Temporary URL": {
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
    "Get File/Directory": {
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
    "Get Files In Directory": {
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
    "Count Element In Directory": {
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
    "Create Directory": {
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
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Create Default File": {
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
    "Copy To Directory": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Duplicate": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Convert File": {
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
    "Move": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Unlock": {
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
    "Allow External Applications": {
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
          "name": "type",
          "field": "body_type"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Get Multi Access": {
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
    "Add Multi Access": {
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
          "name": "right",
          "field": "body_right"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Synchronize With Parent Rights": {
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
    "Check Access Change": {
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
          "name": "right",
          "field": "body_right"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Drive > Files > File/Directory > Access > Invitation": {
    "Invitation > Get Access": {
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
    "Add Access": {
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
          "name": "right",
          "field": "body_right"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Check Access": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Drive > Files > File/Directory > Access > Request": {
    "Get Requested File Access From Its ID": {
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
    "Decline A File Access Request": {
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
    "Get Requested File Access From A File ID": {
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
    "Create A New File Access Request": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Drive > Files > File/Directory > Access > Teams": {
    "Get Access": {
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
    "Add Access": {
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
          "name": "right",
          "field": "body_right"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Update Access": {
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
    "Remove Access": {
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
    "Get Access": {
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
    "Add Access": {
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
    "Update Access": {
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
    "Remove Access": {
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
    "Force Write Access": {
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
    "Get File Comments": {
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
    "Add Comment": {
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
    "Get Comment Reply": {
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
    "Add Comment Reply": {
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
    "Modify Comment": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete Comment": {
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
    "Like Comment": {
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
    "Unlike Comment": {
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
    "Cancel By Path": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Upload": {
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
    "Cancel Session": {
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
    "Batch : Cancel Sessions": {
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
    "Start Session": {
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
    "Batch : Start Sessions": {
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
    "Append Chunk To Session": {
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
    "Close Session": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Batch : Close Sessions": {
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
    "List": {
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
    "Delete All": {
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
    "Update Current": {
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
    "Get": {
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
    "Update": {
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
    "Delete": {
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
    "Download": {
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
    "Restore": {
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
    "Restore To Directory": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "List (2)": {
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
    "Restore (2)": {
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
    "Restore To Directory (2)": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Drive > Files > Search": {
    "Search File/directory": {
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
    "Search Dropbox": {
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
    "Search Favorite": {
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
    "Search Sharelink": {
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
    "Search Shared": {
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
    "Search My Shared": {
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
    "Search Trash": {
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
  "Drive > Files > Share Link > Archive": {
    "Build Archive": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Download Sharelink Archive": {
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
  "Drive > Files > Share Link > Manage": {
    "Get Share Link": {
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
    "Create Share Link": {
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
          "name": "right",
          "field": "body_right"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Update Share Link": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Remove Share Link": {
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
    "Share Link Invite": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Get Share Link Files": {
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
    "Empty Trash": {
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
    "Count Directory/File In Trash": {
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
    "Remove File": {
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
    "Restore File": {
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
    "Get Thumbnail": {
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
    "Count Directory/File In Trashed Directory": {
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
    "Get Files Of Trash": {
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
    "Get Trashed File": {
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
    "Get Files Of Trashed Directory": {
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
    "Count Directories/files In Trash": {
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
    "Get User Invitation": {
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
    "Get Invitation Information": {
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
    "Update An Invitation": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete Invitation": {
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
    "Send Invitation": {
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
    "Get Drive's Settings": {
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
    "Update IA Settings": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Update Share Link Settings": {
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
          "name": "txtColor",
          "field": "body_txtColor"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Update Trash Settings": {
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
    "Update Office Settings": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Update Preferences": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Drive > Statistics": {
    "Chart : Files Size": {
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
    "Export : Files Size": {
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
    "Activities : Users": {
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
    "Activities : Shared Files": {
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
    "Chart : Activities": {
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
    "Export : Activities": {
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
    "Activities : Share Links": {
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
    "Export : Share Links Activities": {
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
    "Get Users": {
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
    "Create User": {
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
          "name": "role",
          "field": "body_role"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Get User": {
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
    "Update User": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete User": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Update User Manager Right": {
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
    "Lock User": {
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
    "Unlock User": {
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
    "Accessibles Drives": {
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
    "Get Users": {
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
    "Get Drives": {
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
    "Get User's Preference": {
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
    "Set User's Preference": {
      "method": "PATCH",
      "path": "/2/drive/preferences",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
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
          "value": "Drive > Files > External Import"
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
          "value": "Drive > Files > Share Link > Archive"
        },
        {
          "name": "Drive > Files > Share Link > Manage",
          "value": "Drive > Files > Share Link > Manage"
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
          "value": "Update Drive"
        },
        {
          "name": "Get Users",
          "value": "Get Users"
        },
        {
          "name": "Wake A Sleeping Drive Up",
          "value": "Wake A Sleeping Drive Up"
        }
      ],
      "default": "Update Drive",
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
            "Update Drive"
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
            "Update Drive"
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
            "Get Users"
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
            "Get Users"
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
            "Wake A Sleeping Drive Up"
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
          "value": "Get Drive Activities Of All The Users."
        },
        {
          "name": "Get Drive Activities Of All The Users.",
          "value": "Get Drive Activities Of All The Users. (2)"
        },
        {
          "name": "Get Total Count Drive Activities Of All The Users.",
          "value": "Get Total Count Drive Activities Of All The Users."
        },
        {
          "name": "Get File Activities",
          "value": "Get File Activities"
        },
        {
          "name": "Get Root Activities",
          "value": "Get Root Activities"
        }
      ],
      "default": "Get Drive Activities Of All The Users.",
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
            "Get Drive Activities Of All The Users."
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
            "Get Drive Activities Of All The Users."
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
            "Get Drive Activities Of All The Users. (2)"
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
            "Get Drive Activities Of All The Users. (2)"
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
            "Get Total Count Drive Activities Of All The Users."
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
            "Get Total Count Drive Activities Of All The Users."
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
            "Get File Activities"
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
            "Get File Activities"
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
            "Get File Activities"
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
            "Get Root Activities"
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
            "Get Root Activities"
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
          "value": "List Reports"
        },
        {
          "name": "Create Report",
          "value": "Create Report"
        },
        {
          "name": "Get Report",
          "value": "Get Report"
        },
        {
          "name": "Delete Report",
          "value": "Delete Report"
        },
        {
          "name": "Export Report",
          "value": "Export Report"
        }
      ],
      "default": "List Reports",
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
            "List Reports"
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
            "List Reports"
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
            "Create Report"
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
            "Create Report"
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
            "Create Report"
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
            "Get Report"
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
            "Get Report"
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
            "Get Report"
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
            "Delete Report"
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
            "Delete Report"
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
            "Export Report"
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
            "Export Report"
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
          "value": "Check File' Existence"
        },
        {
          "name": "Get Largest Files",
          "value": "Get Largest Files"
        },
        {
          "name": "Get Last Modified Files",
          "value": "Get Last Modified Files"
        },
        {
          "name": "Get Most Versioned Files",
          "value": "Get Most Versioned Files"
        },
        {
          "name": "Get My Shared Files",
          "value": "Get My Shared Files"
        },
        {
          "name": "Get Shared Files",
          "value": "Get Shared Files"
        },
        {
          "name": "Create Team Directory",
          "value": "Create Team Directory"
        },
        {
          "name": "List The Most Recent Files Or Directories Used By The User.",
          "value": "List The Most Recent Files Or Directories Used By The User."
        }
      ],
      "default": "Check File' Existence",
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
            "Check File' Existence"
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
            "Check File' Existence"
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
            "Get Largest Files"
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
            "Get Largest Files"
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
            "Get Last Modified Files"
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
            "Get Last Modified Files"
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
            "Get Most Versioned Files"
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
            "Get Most Versioned Files"
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
            "Get My Shared Files"
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
            "Get My Shared Files"
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
            "Get Shared Files"
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
            "Get Shared Files"
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
            "Create Team Directory"
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
            "Create Team Directory"
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
            "Create Team Directory"
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
            "Create Team Directory"
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
            "List The Most Recent Files Or Directories Used By The User."
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
            "List The Most Recent Files Or Directories Used By The User."
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
          "value": "Undo Action"
        }
      ],
      "default": "Undo Action",
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
            "Undo Action"
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
            "Undo Action"
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
          "value": "Download Archive"
        },
        {
          "name": "Build Archive",
          "value": "Build Archive"
        }
      ],
      "default": "Download Archive",
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
            "Download Archive"
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
            "Download Archive"
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
            "Build Archive"
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
            "Build Archive"
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
          "value": "Get All Categories"
        },
        {
          "name": "Create Category",
          "value": "Create Category"
        },
        {
          "name": "Edit Category",
          "value": "Edit Category"
        },
        {
          "name": "Delete Category",
          "value": "Delete Category"
        },
        {
          "name": "Add Category On Files",
          "value": "Add Category On Files"
        },
        {
          "name": "Remove Category On Files",
          "value": "Remove Category On Files"
        },
        {
          "name": "Add Category On File",
          "value": "Add Category On File"
        },
        {
          "name": "Remove Category On File",
          "value": "Remove Category On File"
        },
        {
          "name": "Remove Categories On File",
          "value": "Remove Categories On File"
        },
        {
          "name": "Validates An AI Generated Category",
          "value": "Validates An AI Generated Category"
        }
      ],
      "default": "Get All Categories",
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
            "Get All Categories"
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
            "Create Category"
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
            "Create Category"
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
            "Create Category"
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
            "Edit Category"
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
            "Edit Category"
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
            "Edit Category"
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
            "Delete Category"
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
            "Delete Category"
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
            "Add Category On Files"
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
            "Add Category On Files"
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
            "Add Category On Files"
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
            "Remove Category On Files"
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
            "Remove Category On Files"
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
            "Remove Category On Files"
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
            "Add Category On File"
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
            "Add Category On File"
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
            "Add Category On File"
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
            "Remove Category On File"
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
            "Remove Category On File"
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
            "Remove Category On File"
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
            "Remove Categories On File"
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
            "Remove Categories On File"
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
            "Validates An AI Generated Category"
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
            "Validates An AI Generated Category"
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
            "Validates An AI Generated Category"
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
            "Validates An AI Generated Category"
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
          "value": "Get"
        },
        {
          "name": "Update/Create",
          "value": "Update/Create"
        }
      ],
      "default": "Get",
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
            "Get"
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
            "Update/Create"
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
            "Update/Create"
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
          "value": "Get Dropbox"
        },
        {
          "name": "Convert A Folder Into A Dropbox",
          "value": "Convert A Folder Into A Dropbox"
        },
        {
          "name": "Update Dropbox",
          "value": "Update Dropbox"
        },
        {
          "name": "Delete Dropbox",
          "value": "Delete Dropbox"
        },
        {
          "name": "Dropbox Invite",
          "value": "Dropbox Invite"
        },
        {
          "name": "Get Drop Boxes",
          "value": "Get Drop Boxes"
        },
        {
          "name": "Create A New Dropbox",
          "value": "Create A New Dropbox"
        }
      ],
      "default": "Get Dropbox",
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
            "Get Dropbox"
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
            "Get Dropbox"
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
            "Get Dropbox"
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
            "Convert A Folder Into A Dropbox"
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
            "Convert A Folder Into A Dropbox"
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
            "Convert A Folder Into A Dropbox"
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
            "Update Dropbox"
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
            "Update Dropbox"
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
            "Update Dropbox"
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
            "Delete Dropbox"
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
            "Delete Dropbox"
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
            "Dropbox Invite"
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
            "Dropbox Invite"
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
            "Dropbox Invite"
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
            "Get Drop Boxes"
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
            "Get Drop Boxes"
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
            "Create A New Dropbox"
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
            "Create A New Dropbox"
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
            "Create A New Dropbox"
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
            "Drive > Files > External Import"
          ]
        }
      },
      "options": [
        {
          "name": "List Imports",
          "value": "List Imports"
        },
        {
          "name": "Clean Imports History",
          "value": "Clean Imports History"
        },
        {
          "name": "Import K Drive Sharelink",
          "value": "Import K Drive Sharelink"
        },
        {
          "name": "Import K Drive",
          "value": "Import K Drive"
        },
        {
          "name": "Import Web DAV App",
          "value": "Import Web DAV App"
        },
        {
          "name": "Import OAuth2 App",
          "value": "Import OAuth2 App"
        },
        {
          "name": "List Eligible Drives",
          "value": "List Eligible Drives"
        },
        {
          "name": "List Errored Import Files",
          "value": "List Errored Import Files"
        },
        {
          "name": "Delete Import",
          "value": "Delete Import"
        },
        {
          "name": "Cancel Import",
          "value": "Cancel Import"
        }
      ],
      "default": "List Imports",
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "List Imports"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "List Imports"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "Clean Imports History"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "Import K Drive Sharelink"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "Import K Drive Sharelink"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "Import K Drive Sharelink"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "Import K Drive Sharelink"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "Import K Drive Sharelink"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "Import K Drive"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "Import K Drive"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "Import K Drive"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "Import K Drive"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "Import Web DAV App"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "Import Web DAV App"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "Import Web DAV App"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "Import Web DAV App"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "Import Web DAV App"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "Import Web DAV App"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "Import Web DAV App"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "Import OAuth2 App"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "Import OAuth2 App"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "Import OAuth2 App"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "Import OAuth2 App"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "List Eligible Drives"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "List Eligible Drives"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "List Eligible Drives"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "List Errored Import Files"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "List Errored Import Files"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "List Errored Import Files"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "Delete Import"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "Delete Import"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "Cancel Import"
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
            "Drive > Files > External Import"
          ],
          "operation": [
            "Cancel Import"
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
          "value": "Favorite File"
        },
        {
          "name": "Unfavorite File",
          "value": "Unfavorite File"
        },
        {
          "name": "Get Favorite Files List",
          "value": "Get Favorite Files List"
        }
      ],
      "default": "Favorite File",
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
            "Favorite File"
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
            "Favorite File"
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
            "Unfavorite File"
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
            "Unfavorite File"
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
            "Get Favorite Files List"
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
            "Get Favorite Files List"
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
          "value": "Trash"
        },
        {
          "name": "Thumbnail",
          "value": "Thumbnail"
        },
        {
          "name": "Preview",
          "value": "Preview"
        },
        {
          "name": "Download",
          "value": "Download"
        },
        {
          "name": "Rename",
          "value": "Rename"
        },
        {
          "name": "Get Size",
          "value": "Get Size"
        },
        {
          "name": "Hash",
          "value": "Hash"
        },
        {
          "name": "Copy To Drive",
          "value": "Copy To Drive"
        },
        {
          "name": "Get A File Temporary URL",
          "value": "Get A File Temporary URL"
        },
        {
          "name": "Get File/Directory",
          "value": "Get File/Directory"
        },
        {
          "name": "Get Files In Directory",
          "value": "Get Files In Directory"
        },
        {
          "name": "Count Element In Directory",
          "value": "Count Element In Directory"
        },
        {
          "name": "Create Directory",
          "value": "Create Directory"
        },
        {
          "name": "Create Default File",
          "value": "Create Default File"
        },
        {
          "name": "Copy To Directory",
          "value": "Copy To Directory"
        },
        {
          "name": "Duplicate",
          "value": "Duplicate"
        },
        {
          "name": "Convert File",
          "value": "Convert File"
        },
        {
          "name": "Move",
          "value": "Move"
        },
        {
          "name": "Unlock",
          "value": "Unlock"
        }
      ],
      "default": "Trash",
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
            "Trash"
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
            "Trash"
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
            "Thumbnail"
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
            "Thumbnail"
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
            "Thumbnail"
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
            "Preview"
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
            "Preview"
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
            "Preview"
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
            "Download"
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
            "Download"
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
            "Download"
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
            "Rename"
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
            "Rename"
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
            "Rename"
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
            "Get Size"
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
            "Get Size"
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
            "Get Size"
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
            "Hash"
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
            "Hash"
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
            "Copy To Drive"
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
            "Copy To Drive"
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
            "Copy To Drive"
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
            "Copy To Drive"
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
            "Get A File Temporary URL"
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
            "Get A File Temporary URL"
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
            "Get A File Temporary URL"
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
            "Get File/Directory"
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
            "Get File/Directory"
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
            "Get File/Directory"
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
            "Get Files In Directory"
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
            "Get Files In Directory"
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
            "Get Files In Directory"
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
            "Count Element In Directory"
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
            "Count Element In Directory"
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
            "Count Element In Directory"
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
            "Create Directory"
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
            "Create Directory"
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
            "Create Directory"
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
            "Create Directory"
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
            "Create Directory"
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
            "Create Default File"
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
            "Create Default File"
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
            "Create Default File"
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
            "Create Default File"
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
            "Create Default File"
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
            "Copy To Directory"
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
            "Copy To Directory"
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
            "Copy To Directory"
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
            "Copy To Directory"
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
            "Copy To Directory"
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
            "Duplicate"
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
            "Duplicate"
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
            "Duplicate"
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
            "Duplicate"
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
            "Convert File"
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
            "Convert File"
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
            "Convert File"
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
            "Move"
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
            "Move"
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
            "Move"
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
            "Move"
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
            "Unlock"
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
            "Unlock"
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
            "Unlock"
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
            "Unlock"
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
          "value": "Allow External Applications"
        },
        {
          "name": "Get Multi Access",
          "value": "Get Multi Access"
        },
        {
          "name": "Add Multi Access",
          "value": "Add Multi Access"
        },
        {
          "name": "Synchronize With Parent Rights",
          "value": "Synchronize With Parent Rights"
        },
        {
          "name": "Check Access Change",
          "value": "Check Access Change"
        }
      ],
      "default": "Allow External Applications",
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
            "Allow External Applications"
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
            "Allow External Applications"
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
            "Allow External Applications"
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
            "Allow External Applications"
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
            "Get Multi Access"
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
            "Get Multi Access"
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
            "Get Multi Access"
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
            "Add Multi Access"
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
            "Add Multi Access"
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
            "Add Multi Access"
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
            "Add Multi Access"
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
            "Add Multi Access"
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
            "Synchronize With Parent Rights"
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
            "Synchronize With Parent Rights"
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
            "Check Access Change"
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
            "Check Access Change"
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
            "Check Access Change"
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
            "Check Access Change"
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
          "value": "Invitation > Get Access"
        },
        {
          "name": "Add Access",
          "value": "Add Access"
        },
        {
          "name": "Check Access",
          "value": "Check Access"
        }
      ],
      "default": "Invitation > Get Access",
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
            "Invitation > Get Access"
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
            "Invitation > Get Access"
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
            "Add Access"
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
            "Add Access"
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
            "Add Access"
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
            "Add Access"
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
            "Add Access"
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
            "Add Access"
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
            "Check Access"
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
            "Check Access"
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
            "Check Access"
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
          "value": "Get Requested File Access From Its ID"
        },
        {
          "name": "Decline A File Access Request",
          "value": "Decline A File Access Request"
        },
        {
          "name": "Get Requested File Access From A File ID",
          "value": "Get Requested File Access From A File ID"
        },
        {
          "name": "Create A New File Access Request",
          "value": "Create A New File Access Request"
        }
      ],
      "default": "Get Requested File Access From Its ID",
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
            "Get Requested File Access From Its ID"
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
            "Get Requested File Access From Its ID"
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
            "Get Requested File Access From Its ID"
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
            "Decline A File Access Request"
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
            "Decline A File Access Request"
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
            "Get Requested File Access From A File ID"
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
            "Get Requested File Access From A File ID"
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
            "Get Requested File Access From A File ID"
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
            "Create A New File Access Request"
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
            "Create A New File Access Request"
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
            "Create A New File Access Request"
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
            "Create A New File Access Request"
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
          "value": "Get Access"
        },
        {
          "name": "Add Access",
          "value": "Add Access"
        },
        {
          "name": "Update Access",
          "value": "Update Access"
        },
        {
          "name": "Remove Access",
          "value": "Remove Access"
        }
      ],
      "default": "Get Access",
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
            "Get Access"
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
            "Get Access"
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
            "Add Access"
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
            "Add Access"
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
            "Add Access"
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
            "Add Access"
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
            "Add Access"
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
            "Update Access"
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
            "Update Access"
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
            "Update Access"
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
            "Update Access"
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
            "Remove Access"
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
            "Remove Access"
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
            "Remove Access"
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
          "value": "Get Access"
        },
        {
          "name": "Add Access",
          "value": "Add Access"
        },
        {
          "name": "Update Access",
          "value": "Update Access"
        },
        {
          "name": "Remove Access",
          "value": "Remove Access"
        },
        {
          "name": "Force Write Access",
          "value": "Force Write Access"
        }
      ],
      "default": "Get Access",
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
            "Get Access"
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
            "Get Access"
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
            "Add Access"
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
            "Add Access"
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
            "Add Access"
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
            "Add Access"
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
            "Add Access"
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
            "Add Access"
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
            "Update Access"
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
            "Update Access"
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
            "Update Access"
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
            "Update Access"
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
            "Remove Access"
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
            "Remove Access"
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
            "Remove Access"
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
            "Force Write Access"
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
            "Force Write Access"
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
          "value": "Get File Comments"
        },
        {
          "name": "Add Comment",
          "value": "Add Comment"
        },
        {
          "name": "Get Comment Reply",
          "value": "Get Comment Reply"
        },
        {
          "name": "Add Comment Reply",
          "value": "Add Comment Reply"
        },
        {
          "name": "Modify Comment",
          "value": "Modify Comment"
        },
        {
          "name": "Delete Comment",
          "value": "Delete Comment"
        },
        {
          "name": "Like Comment",
          "value": "Like Comment"
        },
        {
          "name": "Unlike Comment",
          "value": "Unlike Comment"
        }
      ],
      "default": "Get File Comments",
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
            "Get File Comments"
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
            "Get File Comments"
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
            "Get File Comments"
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
            "Add Comment"
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
            "Add Comment"
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
            "Add Comment"
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
            "Add Comment"
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
            "Get Comment Reply"
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
            "Get Comment Reply"
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
            "Get Comment Reply"
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
            "Get Comment Reply"
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
            "Add Comment Reply"
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
            "Add Comment Reply"
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
            "Add Comment Reply"
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
            "Add Comment Reply"
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
            "Add Comment Reply"
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
            "Modify Comment"
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
            "Modify Comment"
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
            "Modify Comment"
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
            "Modify Comment"
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
            "Modify Comment"
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
            "Delete Comment"
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
            "Delete Comment"
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
            "Delete Comment"
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
            "Like Comment"
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
            "Like Comment"
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
            "Like Comment"
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
            "Unlike Comment"
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
            "Unlike Comment"
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
            "Unlike Comment"
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
          "value": "Cancel By Path"
        },
        {
          "name": "Upload",
          "value": "Upload"
        }
      ],
      "default": "Cancel By Path",
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
            "Cancel By Path"
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
            "Cancel By Path"
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
            "Upload"
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
            "Upload"
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
            "Upload"
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
            "Upload"
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
          "value": "Cancel Session"
        },
        {
          "name": "Batch : Cancel Sessions",
          "value": "Batch : Cancel Sessions"
        },
        {
          "name": "Start Session",
          "value": "Start Session"
        },
        {
          "name": "Batch : Start Sessions",
          "value": "Batch : Start Sessions"
        },
        {
          "name": "Append Chunk To Session",
          "value": "Append Chunk To Session"
        },
        {
          "name": "Close Session",
          "value": "Close Session"
        },
        {
          "name": "Batch : Close Sessions",
          "value": "Batch : Close Sessions"
        }
      ],
      "default": "Cancel Session",
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
            "Cancel Session"
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
            "Cancel Session"
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
            "Batch : Cancel Sessions"
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
            "Batch : Cancel Sessions"
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
            "Start Session"
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
            "Start Session"
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
            "Start Session"
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
            "Start Session"
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
            "Start Session"
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
            "Batch : Start Sessions"
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
            "Batch : Start Sessions"
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
            "Batch : Start Sessions"
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
            "Append Chunk To Session"
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
            "Append Chunk To Session"
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
            "Append Chunk To Session"
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
            "Append Chunk To Session"
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
            "Append Chunk To Session"
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
            "Append Chunk To Session"
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
            "Close Session"
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
            "Close Session"
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
            "Close Session"
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
            "Close Session"
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
            "Batch : Close Sessions"
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
            "Batch : Close Sessions"
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
            "Batch : Close Sessions"
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
          "value": "List"
        },
        {
          "name": "Delete All",
          "value": "Delete All"
        },
        {
          "name": "Update Current",
          "value": "Update Current"
        },
        {
          "name": "Get",
          "value": "Get"
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
          "name": "Download",
          "value": "Download"
        },
        {
          "name": "Restore",
          "value": "Restore"
        },
        {
          "name": "Restore To Directory",
          "value": "Restore To Directory"
        },
        {
          "name": "List",
          "value": "List (2)"
        },
        {
          "name": "Restore",
          "value": "Restore (2)"
        },
        {
          "name": "Restore To Directory",
          "value": "Restore To Directory (2)"
        }
      ],
      "default": "List",
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
            "List"
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
            "List"
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
            "List"
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
            "Delete All"
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
            "Delete All"
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
            "Update Current"
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
            "Update Current"
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
            "Update Current"
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
            "Get"
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
            "Get"
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
            "Get"
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
            "Update"
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
            "Update"
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
            "Update"
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
            "Update"
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
            "Delete"
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
            "Delete"
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
            "Delete"
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
            "Download"
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
            "Download"
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
            "Download"
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
            "Restore"
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
            "Restore"
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
            "Restore"
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
            "Restore"
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
            "Restore To Directory"
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
            "Restore To Directory"
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
            "Restore To Directory"
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
            "Restore To Directory"
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
            "Restore To Directory"
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
            "Restore To Directory"
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
            "List (2)"
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
            "List (2)"
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
            "List (2)"
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
            "Restore (2)"
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
            "Restore (2)"
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
            "Restore (2)"
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
            "Restore (2)"
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
            "Restore To Directory (2)"
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
            "Restore To Directory (2)"
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
            "Restore To Directory (2)"
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
            "Restore To Directory (2)"
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
            "Restore To Directory (2)"
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
            "Restore To Directory (2)"
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
          "value": "Search File/directory"
        },
        {
          "name": "Search Dropbox",
          "value": "Search Dropbox"
        },
        {
          "name": "Search Favorite",
          "value": "Search Favorite"
        },
        {
          "name": "Search Sharelink",
          "value": "Search Sharelink"
        },
        {
          "name": "Search Shared",
          "value": "Search Shared"
        },
        {
          "name": "Search My Shared",
          "value": "Search My Shared"
        },
        {
          "name": "Search Trash",
          "value": "Search Trash"
        }
      ],
      "default": "Search File/directory",
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
            "Search File/directory"
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
            "Search File/directory"
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
            "Search Dropbox"
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
            "Search Dropbox"
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
            "Search Favorite"
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
            "Search Favorite"
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
            "Search Sharelink"
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
            "Search Sharelink"
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
            "Search Shared"
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
            "Search Shared"
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
            "Search My Shared"
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
            "Search My Shared"
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
            "Search Trash"
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
            "Search Trash"
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
            "Drive > Files > Share Link > Archive"
          ]
        }
      },
      "options": [
        {
          "name": "Build Archive",
          "value": "Build Archive"
        },
        {
          "name": "Download Sharelink Archive",
          "value": "Download Sharelink Archive"
        }
      ],
      "default": "Build Archive",
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
            "Drive > Files > Share Link > Archive"
          ],
          "operation": [
            "Build Archive"
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
            "Drive > Files > Share Link > Archive"
          ],
          "operation": [
            "Build Archive"
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
            "Drive > Files > Share Link > Archive"
          ],
          "operation": [
            "Build Archive"
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
            "Drive > Files > Share Link > Archive"
          ],
          "operation": [
            "Download Sharelink Archive"
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
            "Drive > Files > Share Link > Archive"
          ],
          "operation": [
            "Download Sharelink Archive"
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
            "Drive > Files > Share Link > Archive"
          ],
          "operation": [
            "Download Sharelink Archive"
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
            "Drive > Files > Share Link > Manage"
          ]
        }
      },
      "options": [
        {
          "name": "Get Share Link",
          "value": "Get Share Link"
        },
        {
          "name": "Create Share Link",
          "value": "Create Share Link"
        },
        {
          "name": "Update Share Link",
          "value": "Update Share Link"
        },
        {
          "name": "Remove Share Link",
          "value": "Remove Share Link"
        },
        {
          "name": "Share Link Invite",
          "value": "Share Link Invite"
        },
        {
          "name": "Get Share Link Files",
          "value": "Get Share Link Files"
        }
      ],
      "default": "Get Share Link",
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
            "Drive > Files > Share Link > Manage"
          ],
          "operation": [
            "Get Share Link"
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
            "Drive > Files > Share Link > Manage"
          ],
          "operation": [
            "Get Share Link"
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
            "Drive > Files > Share Link > Manage"
          ],
          "operation": [
            "Get Share Link"
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
            "Drive > Files > Share Link > Manage"
          ],
          "operation": [
            "Create Share Link"
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
            "Drive > Files > Share Link > Manage"
          ],
          "operation": [
            "Create Share Link"
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
            "Drive > Files > Share Link > Manage"
          ],
          "operation": [
            "Create Share Link"
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
            "Drive > Files > Share Link > Manage"
          ],
          "operation": [
            "Create Share Link"
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
            "Drive > Files > Share Link > Manage"
          ],
          "operation": [
            "Create Share Link"
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
            "Drive > Files > Share Link > Manage"
          ],
          "operation": [
            "Update Share Link"
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
            "Drive > Files > Share Link > Manage"
          ],
          "operation": [
            "Update Share Link"
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
            "Drive > Files > Share Link > Manage"
          ],
          "operation": [
            "Update Share Link"
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
            "Drive > Files > Share Link > Manage"
          ],
          "operation": [
            "Remove Share Link"
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
            "Drive > Files > Share Link > Manage"
          ],
          "operation": [
            "Remove Share Link"
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
            "Drive > Files > Share Link > Manage"
          ],
          "operation": [
            "Share Link Invite"
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
            "Drive > Files > Share Link > Manage"
          ],
          "operation": [
            "Share Link Invite"
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
            "Drive > Files > Share Link > Manage"
          ],
          "operation": [
            "Share Link Invite"
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
            "Drive > Files > Share Link > Manage"
          ],
          "operation": [
            "Get Share Link Files"
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
            "Drive > Files > Share Link > Manage"
          ],
          "operation": [
            "Get Share Link Files"
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
          "value": "Empty Trash"
        },
        {
          "name": "Count Directory/File In Trash",
          "value": "Count Directory/File In Trash"
        },
        {
          "name": "Remove File",
          "value": "Remove File"
        },
        {
          "name": "Restore File",
          "value": "Restore File"
        },
        {
          "name": "Get Thumbnail",
          "value": "Get Thumbnail"
        },
        {
          "name": "Count Directory/File In Trashed Directory",
          "value": "Count Directory/File In Trashed Directory"
        },
        {
          "name": "Get Files Of Trash",
          "value": "Get Files Of Trash"
        },
        {
          "name": "Get Trashed File",
          "value": "Get Trashed File"
        },
        {
          "name": "Get Files Of Trashed Directory",
          "value": "Get Files Of Trashed Directory"
        },
        {
          "name": "Count Directories/files In Trash",
          "value": "Count Directories/files In Trash"
        }
      ],
      "default": "Empty Trash",
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
            "Empty Trash"
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
            "Count Directory/File In Trash"
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
            "Remove File"
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
            "Remove File"
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
            "Restore File"
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
            "Restore File"
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
            "Restore File"
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
            "Get Thumbnail"
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
            "Get Thumbnail"
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
            "Get Thumbnail"
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
            "Count Directory/File In Trashed Directory"
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
            "Count Directory/File In Trashed Directory"
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
            "Get Files Of Trash"
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
            "Get Files Of Trash"
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
            "Get Trashed File"
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
            "Get Trashed File"
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
            "Get Trashed File"
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
            "Get Files Of Trashed Directory"
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
            "Get Files Of Trashed Directory"
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
            "Get Files Of Trashed Directory"
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
            "Count Directories/files In Trash"
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
            "Count Directories/files In Trash"
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
            "Count Directories/files In Trash"
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
          "value": "Get User Invitation"
        },
        {
          "name": "Get Invitation Information",
          "value": "Get Invitation Information"
        },
        {
          "name": "Update An Invitation",
          "value": "Update An Invitation"
        },
        {
          "name": "Delete Invitation",
          "value": "Delete Invitation"
        },
        {
          "name": "Send Invitation",
          "value": "Send Invitation"
        }
      ],
      "default": "Get User Invitation",
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
            "Get User Invitation"
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
            "Get User Invitation"
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
            "Get Invitation Information"
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
            "Get Invitation Information"
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
            "Update An Invitation"
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
            "Update An Invitation"
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
            "Update An Invitation"
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
            "Delete Invitation"
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
            "Delete Invitation"
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
            "Delete Invitation"
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
            "Send Invitation"
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
            "Send Invitation"
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
          "value": "Get Drive's Settings"
        },
        {
          "name": "Update IA Settings",
          "value": "Update IA Settings"
        },
        {
          "name": "Update Share Link Settings",
          "value": "Update Share Link Settings"
        },
        {
          "name": "Update Trash Settings",
          "value": "Update Trash Settings"
        },
        {
          "name": "Update Office Settings",
          "value": "Update Office Settings"
        },
        {
          "name": "Update Preferences",
          "value": "Update Preferences"
        }
      ],
      "default": "Get Drive's Settings",
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
            "Get Drive's Settings"
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
            "Update IA Settings"
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
            "Update IA Settings"
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
            "Update Share Link Settings"
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
            "Update Share Link Settings"
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
            "Update Share Link Settings"
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
            "Update Share Link Settings"
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
            "Update Share Link Settings"
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
            "Update Trash Settings"
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
            "Update Trash Settings"
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
            "Update Office Settings"
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
            "Update Office Settings"
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
            "Update Preferences"
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
            "Update Preferences"
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
          "value": "Chart : Files Size"
        },
        {
          "name": "Export : Files Size",
          "value": "Export : Files Size"
        },
        {
          "name": "Activities : Users",
          "value": "Activities : Users"
        },
        {
          "name": "Activities : Shared Files",
          "value": "Activities : Shared Files"
        },
        {
          "name": "Chart : Activities",
          "value": "Chart : Activities"
        },
        {
          "name": "Export : Activities",
          "value": "Export : Activities"
        },
        {
          "name": "Activities : Share Links",
          "value": "Activities : Share Links"
        },
        {
          "name": "Export : Share Links Activities",
          "value": "Export : Share Links Activities"
        }
      ],
      "default": "Chart : Files Size",
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
            "Chart : Files Size"
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
            "Chart : Files Size"
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
            "Chart : Files Size"
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
            "Chart : Files Size"
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
            "Chart : Files Size"
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
            "Export : Files Size"
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
            "Export : Files Size"
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
            "Export : Files Size"
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
            "Export : Files Size"
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
            "Export : Files Size"
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
            "Activities : Users"
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
            "Activities : Users"
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
            "Activities : Users"
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
            "Activities : Shared Files"
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
            "Activities : Shared Files"
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
            "Activities : Shared Files"
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
            "Chart : Activities"
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
            "Chart : Activities"
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
            "Chart : Activities"
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
            "Chart : Activities"
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
            "Chart : Activities"
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
            "Export : Activities"
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
            "Export : Activities"
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
            "Export : Activities"
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
            "Export : Activities"
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
            "Export : Activities"
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
            "Activities : Share Links"
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
            "Activities : Share Links"
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
            "Activities : Share Links"
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
            "Activities : Share Links"
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
            "Export : Share Links Activities"
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
            "Export : Share Links Activities"
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
            "Export : Share Links Activities"
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
            "Export : Share Links Activities"
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
          "value": "Get Users"
        },
        {
          "name": "Create User",
          "value": "Create User"
        },
        {
          "name": "Get User",
          "value": "Get User"
        },
        {
          "name": "Update User",
          "value": "Update User"
        },
        {
          "name": "Delete User",
          "value": "Delete User"
        },
        {
          "name": "Update User Manager Right",
          "value": "Update User Manager Right"
        },
        {
          "name": "Lock User",
          "value": "Lock User"
        },
        {
          "name": "Unlock User",
          "value": "Unlock User"
        }
      ],
      "default": "Get Users",
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
            "Get Users"
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
            "Get Users"
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
            "Create User"
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
            "Create User"
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
            "Create User"
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
            "Create User"
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
            "Get User"
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
            "Get User"
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
            "Update User"
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
            "Update User"
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
            "Update User"
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
            "Delete User"
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
            "Delete User"
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
            "Delete User"
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
            "Update User Manager Right"
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
            "Update User Manager Right"
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
            "Update User Manager Right"
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
            "Lock User"
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
            "Lock User"
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
            "Unlock User"
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
            "Unlock User"
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
          "value": "Accessibles Drives"
        }
      ],
      "default": "Accessibles Drives",
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
            "Accessibles Drives"
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
            "Accessibles Drives"
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
          "value": "Get Users"
        },
        {
          "name": "Get Drives",
          "value": "Get Drives"
        },
        {
          "name": "Get User's Preference",
          "value": "Get User's Preference"
        },
        {
          "name": "Set User's Preference",
          "value": "Set User's Preference"
        }
      ],
      "default": "Get Users",
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
            "Get Users"
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
            "Get Drives"
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
            "Get Drives"
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
            "Get Drives"
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
            "Get User's Preference"
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
            "Set User's Preference"
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
            "Drive > Files > External Import",
            "Drive > Files > External Import",
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
            "Get Drive Activities Of All The Users.",
            "List Reports",
            "Get Report",
            "List Imports",
            "List Errored Import Files",
            "Get File Comments",
            "Get Comment Reply",
            "List (2)",
            "Get User Invitation",
            "Activities : Share Links",
            "Get Users",
            "Accessibles Drives",
            "Get Users",
            "Get Drives"
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
            "Drive > Files > External Import",
            "Drive > Files > External Import",
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
            "Get Drive Activities Of All The Users.",
            "List Reports",
            "Get Report",
            "List Imports",
            "List Errored Import Files",
            "Get File Comments",
            "Get Comment Reply",
            "List (2)",
            "Get User Invitation",
            "Activities : Share Links",
            "Get Users",
            "Accessibles Drives",
            "Get Users",
            "Get Drives"
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
