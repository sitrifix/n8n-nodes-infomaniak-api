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
  "Mailbox Management": {
    "List Mailboxes": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes",
      "pagination": "limit-skip",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Add A Mailbox": {
      "method": "POST",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "mailbox_name",
          "field": "body_mailbox_name"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Display A Mailbox": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Mailboxes": {
    "Request Password Reset": {
      "method": "POST",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/request_reset_password",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
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
    "Ask Password To Admin.": {
      "method": "POST",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/ask_password",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Mailboxes > Accesses > Devices": {
    "List Device Access": {
      "method": "GET",
      "path": "/1/mail_hostings/{service_mail}/mailboxes/{mailbox_name}/accesses/devices",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "service_mail",
          "field": "path_service_mail"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create Device Access": {
      "method": "POST",
      "path": "/1/mail_hostings/{service_mail}/mailboxes/{mailbox_name}/accesses/devices",
      "pagination": "none",
      "pathParams": [
        {
          "name": "service_mail",
          "field": "path_service_mail"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "protocols",
          "field": "body_protocols"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete Device Accesses For Mailbox": {
      "method": "DELETE",
      "path": "/1/mail_hostings/{service_mail}/mailboxes/{mailbox_name}/accesses/devices",
      "pagination": "none",
      "pathParams": [
        {
          "name": "service_mail",
          "field": "path_service_mail"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Regenerate Password Device Access": {
      "method": "POST",
      "path": "/1/mail_hostings/{service_mail}/mailboxes/{mailbox_name}/accesses/devices/{device_access}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "service_mail",
          "field": "path_service_mail"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        },
        {
          "name": "device_access",
          "field": "path_device_access"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Delete Device Access": {
      "method": "DELETE",
      "path": "/1/mail_hostings/{service_mail}/mailboxes/{mailbox_name}/accesses/devices/{device_access}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "service_mail",
          "field": "path_service_mail"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        },
        {
          "name": "device_access",
          "field": "path_device_access"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "List Device Access For A User": {
      "method": "GET",
      "path": "/1/mail_hostings/{service_mail}/mailboxes/{mailbox_name}/accesses/devices/users/{user_id}",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "service_mail",
          "field": "path_service_mail"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        },
        {
          "name": "user_id",
          "field": "path_user_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Delete Device Access For A User": {
      "method": "DELETE",
      "path": "/1/mail_hostings/{service_mail}/mailboxes/{mailbox_name}/accesses/devices/users/{user_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "service_mail",
          "field": "path_service_mail"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
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
    "List Device By User": {
      "method": "GET",
      "path": "/1/mail_hostings/{service_mail}/accesses/devices/users/{user_id}",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "service_mail",
          "field": "path_service_mail"
        },
        {
          "name": "user_id",
          "field": "path_user_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "List Device": {
      "method": "GET",
      "path": "/1/mail_hostings/accesses/devices",
      "pagination": "page-per-page",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Delete Devices For Current User": {
      "method": "DELETE",
      "path": "/1/mail_hostings/accesses/devices",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update Device": {
      "method": "PATCH",
      "path": "/1/mail_hostings/accesses/devices/{device}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "device",
          "field": "path_device"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "label",
          "field": "body_label"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Delete Device Accesses For Device": {
      "method": "DELETE",
      "path": "/1/mail_hostings/accesses/devices/{device}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "device",
          "field": "path_device"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Mailboxes > Accesses > Invitations": {
    "Create Webmail Access Link": {
      "method": "POST",
      "path": "/1/mail_hostings/{service_mail}/mailboxes/{mailbox_name}/accesses/webmail/invitations",
      "pagination": "none",
      "pathParams": [
        {
          "name": "service_mail",
          "field": "path_service_mail"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Send Webmail Access Link By E Mail": {
      "method": "POST",
      "path": "/1/mail_hostings/{service_mail}/mailboxes/{mailbox_name}/accesses/webmail/invitations/{invitation_webmail}/send",
      "pagination": "none",
      "pathParams": [
        {
          "name": "service_mail",
          "field": "path_service_mail"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        },
        {
          "name": "invitation_webmail",
          "field": "path_invitation_webmail"
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
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Mailboxes > Accesses > Webmail": {
    "List User Access And Invitations": {
      "method": "GET",
      "path": "/1/mail_hostings/{service_mail}/mailboxes/{mailbox_name}/accesses/webmail",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "service_mail",
          "field": "path_service_mail"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create Webmail Access": {
      "method": "POST",
      "path": "/1/mail_hostings/{service_mail}/mailboxes/{mailbox_name}/accesses/webmail",
      "pagination": "none",
      "pathParams": [
        {
          "name": "service_mail",
          "field": "path_service_mail"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "user_id",
          "field": "body_user_id"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Set The Primary Mailbox For The Authenticated User": {
      "method": "POST",
      "path": "/1/mail_hostings/accesses/webmail/mailboxes/{mailbox_id}/set_primary",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mailbox_id",
          "field": "path_mailbox_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "List Users Having Access": {
      "method": "GET",
      "path": "/1/mail_hostings/{service_mail}/mailboxes/{mailbox_name}/accesses/webmail/users",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "service_mail",
          "field": "path_service_mail"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "List Of User Accesses For The Current User": {
      "method": "GET",
      "path": "/1/mail_hostings/accesses/webmail",
      "pagination": "page-per-page",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "List Of User Accesses For A Account And A User": {
      "method": "GET",
      "path": "/1/mail_hostings/accesses/webmail/accounts/{account_id}/users/{user_id}",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "account_id",
          "field": "path_account_id"
        },
        {
          "name": "user_id",
          "field": "path_user_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update Webmail Access": {
      "method": "PATCH",
      "path": "/1/mail_hostings/{service_mail}/mailboxes/{mailbox_name}/accesses/webmail/users/{user_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "service_mail",
          "field": "path_service_mail"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
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
          "name": "permissions",
          "field": "body_permissions"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Delete Webmail Access": {
      "method": "DELETE",
      "path": "/1/mail_hostings/{service_mail}/mailboxes/{mailbox_name}/accesses/webmail/users/{user_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "service_mail",
          "field": "path_service_mail"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
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
    "Delete Access To A Mailbox For The Current User": {
      "method": "DELETE",
      "path": "/1/mail_hostings/accesses/webmail/mailboxes/{mailbox_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mailbox_id",
          "field": "path_mailbox_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Mailboxes > Aliases": {
    "List Aliases": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/aliases",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Add An Alias": {
      "method": "POST",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/aliases",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "alias",
          "field": "body_alias"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update Aliases": {
      "method": "PUT",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/aliases",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "aliases",
          "field": "body_aliases"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Delete An Alias": {
      "method": "DELETE",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/aliases/{alias}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        },
        {
          "name": "alias",
          "field": "path_alias"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Mailboxes > Auto Reply": {
    "List Auto Replies Models": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auto_reply/model",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Add Auto Reply Model": {
      "method": "POST",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auto_reply/model",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "is_recurrent",
          "field": "body_is_recurrent"
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
          "name": "reply_from_id",
          "field": "body_reply_from_id"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Reset An Auto Reply": {
      "method": "PUT",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auto_reply/reset",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Show Auto Reply Model": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auto_reply/model/{model_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        },
        {
          "name": "model_id",
          "field": "path_model_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update Auto Reply Model": {
      "method": "PATCH",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auto_reply/model/{model_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        },
        {
          "name": "model_id",
          "field": "path_model_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "is_active",
          "field": "body_is_active"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Update Auto Reply Model (2)": {
      "method": "DELETE",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auto_reply/model/{model_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        },
        {
          "name": "model_id",
          "field": "path_model_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Mailboxes > Folders": {
    "List Folders": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auth/folders",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update Folders": {
      "method": "PUT",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auth/folders",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "archives_folder",
          "field": "body_archives_folder"
        },
        {
          "name": "draft_folder",
          "field": "body_draft_folder"
        },
        {
          "name": "sent_folder",
          "field": "body_sent_folder"
        },
        {
          "name": "trash_folder",
          "field": "body_trash_folder"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Purge Spam Folder": {
      "method": "DELETE",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auth/folders/spam",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Empty Trash Folder": {
      "method": "DELETE",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auth/folders/trash",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Mailboxes > Forwarding": {
    "List Forwarding": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/forwarding_addresses",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Add A Forwarding": {
      "method": "POST",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/forwarding_addresses",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "redirect_address",
          "field": "body_redirect_address"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update A Forwarding": {
      "method": "PUT",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/forwarding_addresses",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete All Forwardings": {
      "method": "DELETE",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/forwarding_addresses",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Delete A Forwarding": {
      "method": "DELETE",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/forwarding_addresses/{redirect_addresses}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        },
        {
          "name": "redirect_addresses",
          "field": "path_redirect_addresses"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Mailboxes > Sieve Filters": {
    "Enable / Disable Filter": {
      "method": "PUT",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auth/filters/set_activation",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "is_enabled",
          "field": "body_is_enabled"
        },
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Reorder Filters": {
      "method": "PUT",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auth/filters/reorder",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "order",
          "field": "body_order"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "List Filters": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auth/filters",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Add A Filter": {
      "method": "POST",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auth/filters",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "actions",
          "field": "body_actions"
        },
        {
          "name": "conditions",
          "field": "body_conditions"
        },
        {
          "name": "has_all_of",
          "field": "body_has_all_of"
        },
        {
          "name": "is_enabled",
          "field": "body_is_enabled"
        },
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Update A Filter": {
      "method": "PATCH",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auth/filters",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "actions",
          "field": "body_actions"
        },
        {
          "name": "conditions",
          "field": "body_conditions"
        },
        {
          "name": "has_all_of",
          "field": "body_has_all_of"
        },
        {
          "name": "is_enabled",
          "field": "body_is_enabled"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "old_name",
          "field": "body_old_name"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete A Filter": {
      "method": "DELETE",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auth/filters",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
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
    "Add A Script": {
      "method": "POST",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auth/filters/scripts",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
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
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Update A Script": {
      "method": "PATCH",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auth/filters/scripts",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
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
          "name": "is_enabled",
          "field": "body_is_enabled"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "old_name",
          "field": "body_old_name"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Delete A Script": {
      "method": "DELETE",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auth/filters/scripts",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
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
    "Enable / Disable Script": {
      "method": "PUT",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auth/filters/scripts/set_activation",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "is_enabled",
          "field": "body_is_enabled"
        },
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Import .siv File": {
      "method": "PUT",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auth/filters/scripts/import",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "file",
          "field": "body_file"
        },
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Mailboxes > Signatures": {
    "Set Default Signature": {
      "method": "POST",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/signatures/set_defaults",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "List All Signatures": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/signatures",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create Signature": {
      "method": "POST",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/signatures",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
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
    "Upload Image": {
      "method": "POST",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/signatures/upload",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "image",
          "field": "body_image"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "List Templates": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/signatures/templates",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Show One Template": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/signatures/templates/{signature_template}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        },
        {
          "name": "signature_template",
          "field": "path_signature_template"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Show A Signature": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/signatures/{signature}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        },
        {
          "name": "signature",
          "field": "path_signature"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update A Specific Signature": {
      "method": "PATCH",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/signatures/{signature}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        },
        {
          "name": "signature",
          "field": "path_signature"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete A Signature": {
      "method": "DELETE",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/signatures/{signature}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        },
        {
          "name": "signature",
          "field": "path_signature"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Mailboxes > Users": {
    "Add An Invitation": {
      "method": "POST",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auth/invitations",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "permissions",
          "field": "body_permissions"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "List Users": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/users",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "List User Invitations": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/invitations",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Send An Invitation": {
      "method": "PUT",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/auth/invitations/send",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Update User Permission": {
      "method": "PATCH",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/users/{user_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
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
          "name": "permissions",
          "field": "body_permissions"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Remove A User": {
      "method": "DELETE",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/users/{user_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
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
    "Update Invitation Permission": {
      "method": "PATCH",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/invitations/{key}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        },
        {
          "name": "key",
          "field": "path_key"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete An Invitation": {
      "method": "DELETE",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailboxes/{mailbox_name}/invitations/{key}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailbox_name",
          "field": "path_mailbox_name"
        },
        {
          "name": "key",
          "field": "path_key"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Mailing List": {
    "List All The Mailing Lists": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailing_lists",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create A Mailing List": {
      "method": "POST",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailing_lists",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "info",
          "field": "body_info"
        },
        {
          "name": "is_reply_to_forced",
          "field": "body_is_reply_to_forced"
        },
        {
          "name": "max_message_size",
          "field": "body_max_message_size"
        },
        {
          "name": "moderators",
          "field": "body_moderators"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "should_send_notifications",
          "field": "body_should_send_notifications"
        },
        {
          "name": "subject",
          "field": "body_subject"
        },
        {
          "name": "use_reply_to",
          "field": "body_use_reply_to"
        },
        {
          "name": "who_can_send",
          "field": "body_who_can_send"
        },
        {
          "name": "who_can_subscribe",
          "field": "body_who_can_subscribe"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Show One Mailing List": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailing_lists/{mailing_list_name}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailing_list_name",
          "field": "path_mailing_list_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update Mailing List Parameters": {
      "method": "PATCH",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailing_lists/{mailing_list_name}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailing_list_name",
          "field": "path_mailing_list_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "info",
          "field": "body_info"
        },
        {
          "name": "is_reply_to_forced",
          "field": "body_is_reply_to_forced"
        },
        {
          "name": "max_message_size",
          "field": "body_max_message_size"
        },
        {
          "name": "moderators",
          "field": "body_moderators"
        },
        {
          "name": "should_send_notifications",
          "field": "body_should_send_notifications"
        },
        {
          "name": "subject",
          "field": "body_subject"
        },
        {
          "name": "use_reply_to",
          "field": "body_use_reply_to"
        },
        {
          "name": "who_can_send",
          "field": "body_who_can_send"
        },
        {
          "name": "who_can_subscribe",
          "field": "body_who_can_subscribe"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete A Mailing List": {
      "method": "DELETE",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailing_lists/{mailing_list_name}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailing_list_name",
          "field": "path_mailing_list_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Send A Mail Through A Mailing List": {
      "method": "PUT",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailing_lists/{mailing_list_name}/send",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailing_list_name",
          "field": "path_mailing_list_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "from",
          "field": "body_from"
        },
        {
          "name": "message",
          "field": "body_message"
        },
        {
          "name": "subject",
          "field": "body_subject"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Generate A Form For A Mailing List": {
      "method": "PUT",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailing_lists/{mailing_list_name}/form",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailing_list_name",
          "field": "path_mailing_list_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "subscribe_submit",
          "field": "body_subscribe_submit"
        },
        {
          "name": "unsubscribe_submit",
          "field": "body_unsubscribe_submit"
        },
        {
          "name": "url_after_subscription",
          "field": "body_url_after_subscription"
        },
        {
          "name": "url_after_unsubscription",
          "field": "body_url_after_unsubscription"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Mailing List > Subscribers": {
    "All Subscribers": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailing_lists/{mailing_list_name}/subscribers",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailing_list_name",
          "field": "path_mailing_list_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Add A New Subscriber": {
      "method": "POST",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailing_lists/{mailing_list_name}/subscribers",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailing_list_name",
          "field": "path_mailing_list_name"
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
    "Update Subscriber Parameters/details": {
      "method": "PATCH",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailing_lists/{mailing_list_name}/subscribers",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailing_list_name",
          "field": "path_mailing_list_name"
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
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Remove A Subscriber": {
      "method": "DELETE",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailing_lists/{mailing_list_name}/subscribers",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailing_list_name",
          "field": "path_mailing_list_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Import Subscribers": {
      "method": "POST",
      "path": "/1/mail_hostings/{mail_hosting_id}/mailing_lists/{mailing_list_name}/subscribers/import",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "mailing_list_name",
          "field": "path_mailing_list_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "datas",
          "field": "body_datas"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Service Mail > Auto Reply": {
    "List Auto Replies": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/auto_replies",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create Auto Reply": {
      "method": "POST",
      "path": "/1/mail_hostings/{mail_hosting_id}/auto_replies",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "is_recurrent",
          "field": "body_is_recurrent"
        },
        {
          "name": "message",
          "field": "body_message"
        },
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Show A Specific Auto Reply": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/auto_replies/{auto_reply_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "auto_reply_id",
          "field": "path_auto_reply_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update Auto Reply": {
      "method": "PATCH",
      "path": "/1/mail_hostings/{mail_hosting_id}/auto_replies/{auto_reply_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "auto_reply_id",
          "field": "path_auto_reply_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete Auto Reply": {
      "method": "DELETE",
      "path": "/1/mail_hostings/{mail_hosting_id}/auto_replies/{auto_reply_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "auto_reply_id",
          "field": "path_auto_reply_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Service Mail > Bimi": {
    "Create/Update Bimi": {
      "method": "POST",
      "path": "/1/mail_hostings/{mail_hosting_id}/bimi",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Service Mail > Filters Models": {
    "List Filters Model": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/filters",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create A Filter Model": {
      "method": "POST",
      "path": "/1/mail_hostings/{mail_hosting_id}/filters",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "is_visible",
          "field": "body_is_visible"
        },
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Show A Filter Model": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/filters/{filter_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "filter_id",
          "field": "path_filter_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update A Filter Model": {
      "method": "PUT",
      "path": "/1/mail_hostings/{mail_hosting_id}/filters/{filter_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "filter_id",
          "field": "path_filter_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "is_visible",
          "field": "body_is_visible"
        },
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete A Filter Model": {
      "method": "DELETE",
      "path": "/1/mail_hostings/{mail_hosting_id}/filters/{filter_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "filter_id",
          "field": "path_filter_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "mail_hosting_id",
          "field": "body_mail_hosting_id"
        },
        {
          "name": "filter_id",
          "field": "body_filter_id"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Service Mail > Preferences": {
    "List Preferences": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/preferences",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update Preferences": {
      "method": "PATCH",
      "path": "/1/mail_hostings/{mail_hosting_id}/preferences",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Service Mail > Redirections": {
    "List Redirections": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/redirections",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create Redirection": {
      "method": "POST",
      "path": "/1/mail_hostings/{mail_hosting_id}/redirections",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
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
          "name": "targets",
          "field": "body_targets"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Show Details": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/redirections/{redirection_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "redirection_id",
          "field": "path_redirection_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update Redirection": {
      "method": "PUT",
      "path": "/1/mail_hostings/{mail_hosting_id}/redirections/{redirection_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "redirection_id",
          "field": "path_redirection_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "targets",
          "field": "body_targets"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Delete Redirection": {
      "method": "DELETE",
      "path": "/1/mail_hostings/{mail_hosting_id}/redirections/{redirection_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "redirection_id",
          "field": "path_redirection_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Enable Redirection": {
      "method": "PUT",
      "path": "/1/mail_hostings/{mail_hosting_id}/redirections/{redirection_id}/enable",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "redirection_id",
          "field": "path_redirection_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Send Confirmation Request": {
      "method": "PUT",
      "path": "/1/mail_hostings/{mail_hosting_id}/redirections/{redirection_id}/send-confirmation-requests",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "redirection_id",
          "field": "path_redirection_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Service Mail > Redirections > Target": {
    "Get All Targets": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/redirections/{redirection_id}/targets",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "redirection_id",
          "field": "path_redirection_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Add New Target": {
      "method": "POST",
      "path": "/1/mail_hostings/{mail_hosting_id}/redirections/{redirection_id}/targets",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "redirection_id",
          "field": "path_redirection_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "address",
          "field": "body_address"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Remove A Target": {
      "method": "DELETE",
      "path": "/1/mail_hostings/{mail_hosting_id}/redirections/{redirection_id}/targets",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "redirection_id",
          "field": "path_redirection_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Resend Confirmation Email": {
      "method": "PUT",
      "path": "/1/mail_hostings/{mail_hosting_id}/redirections/{redirection_id}/targets/{target_id}/resend-confirmation-request",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "redirection_id",
          "field": "path_redirection_id"
        },
        {
          "name": "target_id",
          "field": "path_target_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Service Mail > Signatures Templates": {
    "List All Templates": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/signatures/templates",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create A Template": {
      "method": "POST",
      "path": "/1/mail_hostings/{mail_hosting_id}/signatures/templates",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
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
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Upload Image": {
      "method": "POST",
      "path": "/1/mail_hostings/{mail_hosting_id}/signatures/templates/upload",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "image",
          "field": "body_image"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create A Signature For All Users": {
      "method": "POST",
      "path": "/1/mail_hostings/{mail_hosting_id}/signatures/templates/{signature_template}/create_signatures",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "signature_template",
          "field": "path_signature_template"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Show Default": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/signatures/templates/default",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Show A Signature Template": {
      "method": "GET",
      "path": "/1/mail_hostings/{mail_hosting_id}/signatures/templates/{signature_template}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "signature_template",
          "field": "path_signature_template"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update": {
      "method": "PUT",
      "path": "/1/mail_hostings/{mail_hosting_id}/signatures/templates/{signature_template}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "signature_template",
          "field": "path_signature_template"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete": {
      "method": "DELETE",
      "path": "/1/mail_hostings/{mail_hosting_id}/signatures/templates/{signature_template}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mail_hosting_id",
          "field": "path_mail_hosting_id"
        },
        {
          "name": "signature_template",
          "field": "path_signature_template"
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

export class InfomaniakMail implements INodeType {
	description: INodeTypeDescription = {
  "displayName": "Infomaniak Mail",
  "name": "infomaniakMail",
  "icon": "file:../../icons/mail.svg",
  "group": [
    "output"
  ],
  "version": 1,
  "description": "Interact with Infomaniak Mail API",
  "defaults": {
    "name": "Infomaniak Mail"
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
          "name": "Mailbox Management",
          "value": "Mailbox Management"
        },
        {
          "name": "Mailboxes",
          "value": "Mailboxes"
        },
        {
          "name": "Mailboxes > Accesses > Devices",
          "value": "Mailboxes > Accesses > Devices"
        },
        {
          "name": "Mailboxes > Accesses > Invitations",
          "value": "Mailboxes > Accesses > Invitations"
        },
        {
          "name": "Mailboxes > Accesses > Webmail",
          "value": "Mailboxes > Accesses > Webmail"
        },
        {
          "name": "Mailboxes > Aliases",
          "value": "Mailboxes > Aliases"
        },
        {
          "name": "Mailboxes > Auto Reply",
          "value": "Mailboxes > Auto Reply"
        },
        {
          "name": "Mailboxes > Folders",
          "value": "Mailboxes > Folders"
        },
        {
          "name": "Mailboxes > Forwarding",
          "value": "Mailboxes > Forwarding"
        },
        {
          "name": "Mailboxes > Sieve Filters",
          "value": "Mailboxes > Sieve Filters"
        },
        {
          "name": "Mailboxes > Signatures",
          "value": "Mailboxes > Signatures"
        },
        {
          "name": "Mailboxes > Users",
          "value": "Mailboxes > Users"
        },
        {
          "name": "Mailing List",
          "value": "Mailing List"
        },
        {
          "name": "Mailing List > Subscribers",
          "value": "Mailing List > Subscribers"
        },
        {
          "name": "Service Mail > Auto Reply",
          "value": "Service Mail > Auto Reply"
        },
        {
          "name": "Service Mail > Bimi",
          "value": "Service Mail > Bimi"
        },
        {
          "name": "Service Mail > Filters Models",
          "value": "Service Mail > Filters Models"
        },
        {
          "name": "Service Mail > Preferences",
          "value": "Service Mail > Preferences"
        },
        {
          "name": "Service Mail > Redirections",
          "value": "Service Mail > Redirections"
        },
        {
          "name": "Service Mail > Redirections > Target",
          "value": "Service Mail > Redirections > Target"
        },
        {
          "name": "Service Mail > Signatures Templates",
          "value": "Service Mail > Signatures Templates"
        }
      ],
      "default": "Mailbox Management",
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
            "Mailbox Management"
          ]
        }
      },
      "options": [
        {
          "name": "List Mailboxes",
          "value": "List Mailboxes"
        },
        {
          "name": "Add A Mailbox",
          "value": "Add A Mailbox"
        },
        {
          "name": "Display A Mailbox",
          "value": "Display A Mailbox"
        }
      ],
      "default": "List Mailboxes",
      "noDataExpression": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailbox Management"
          ],
          "operation": [
            "List Mailboxes"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
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
            "Mailbox Management"
          ],
          "operation": [
            "List Mailboxes"
          ]
        }
      },
      "options": [
        {
          "displayName": "Search",
          "name": "query_search",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Filter By",
          "name": "query_filter_by",
          "type": "string",
          "default": ""
        },
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
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailbox Management"
          ],
          "operation": [
            "Add A Mailbox"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
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
            "Mailbox Management"
          ],
          "operation": [
            "Add A Mailbox"
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
      "displayName": "Mailbox Name",
      "name": "body_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailbox Management"
          ],
          "operation": [
            "Add A Mailbox"
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
            "Mailbox Management"
          ],
          "operation": [
            "Add A Mailbox"
          ]
        }
      },
      "options": [
        {
          "displayName": "Link To Current User",
          "name": "body_link_to_current_user",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Note",
          "name": "body_note",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Password",
          "name": "body_password",
          "type": "string",
          "default": "",
          "description": "This field is not used anymore for selected accounts.<br>This field will be gradually become deprecated over the coming weeks.<br>The method will just ignore this field if your account is selected."
        },
        {
          "displayName": "Random Delivery Host",
          "name": "body_random_delivery_host",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Signature Model Id",
          "name": "body_signature_model_id",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Target",
          "name": "body_target",
          "type": "options",
          "default": "",
          "description": "Specifies who has access to the mailbox during its creation.<note><strong>current_user</strong>: Only the current user has access to the mailbox.</note><note><strong>ksuite_user</strong>: All users who are part of the kSuite product can access the mailbox.</note><note><strong>other_user</strong>: All invited users can have access to the mailbox.</note>",
          "options": [
            {
              "name": "current_user",
              "value": "current_user"
            },
            {
              "name": "ksuite_user",
              "value": "ksuite_user"
            },
            {
              "name": "other_user",
              "value": "other_user"
            }
          ]
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailbox Management"
          ],
          "operation": [
            "Display A Mailbox"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailbox Management"
          ],
          "operation": [
            "Display A Mailbox"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
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
            "Mailbox Management"
          ],
          "operation": [
            "Display A Mailbox"
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
          "displayName": "Unit",
          "name": "query_unit",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "B",
              "value": "B"
            },
            {
              "name": "MB",
              "value": "MB"
            },
            {
              "name": "kB",
              "value": "kB"
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
            "Mailboxes"
          ]
        }
      },
      "options": [
        {
          "name": "Request Password Reset",
          "value": "Request Password Reset"
        },
        {
          "name": "Ask Password To Admin.",
          "value": "Ask Password To Admin."
        }
      ],
      "default": "Request Password Reset",
      "noDataExpression": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes"
          ],
          "operation": [
            "Request Password Reset"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes"
          ],
          "operation": [
            "Request Password Reset"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Type",
      "name": "body_type",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes"
          ],
          "operation": [
            "Request Password Reset"
          ]
        }
      },
      "required": true,
      "description": "Defines the different types of password reset requests.<note><strong>email</strong>: The request will be sent to the specified email address.</note><note><strong>email_reminder</strong>: The request will be sent to the designated backup email address.</note><note><strong>phone</strong>: The request will be sent to the specified phone number.</note><note><strong>phone_reminder</strong>: The request will be sent to the designated backup phone number.</note><note><strong>token</strong>: The request will return a token in the HTTP response.</note>",
      "options": [
        {
          "name": "email",
          "value": "email"
        },
        {
          "name": "email_reminder",
          "value": "email_reminder"
        },
        {
          "name": "phone",
          "value": "phone"
        },
        {
          "name": "phone_reminder",
          "value": "phone_reminder"
        },
        {
          "name": "token",
          "value": "token"
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
            "Mailboxes"
          ],
          "operation": [
            "Request Password Reset"
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
          "displayName": "Phone",
          "name": "body_phone",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "User Id",
          "name": "body_user_id",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes"
          ],
          "operation": [
            "Ask Password To Admin."
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes"
          ],
          "operation": [
            "Ask Password To Admin."
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
            "Mailboxes > Accesses > Devices"
          ]
        }
      },
      "options": [
        {
          "name": "List Device Access",
          "value": "List Device Access"
        },
        {
          "name": "Create Device Access",
          "value": "Create Device Access"
        },
        {
          "name": "Delete Device Accesses For Mailbox",
          "value": "Delete Device Accesses For Mailbox"
        },
        {
          "name": "Regenerate Password Device Access",
          "value": "Regenerate Password Device Access"
        },
        {
          "name": "Delete Device Access",
          "value": "Delete Device Access"
        },
        {
          "name": "List Device Access For A User",
          "value": "List Device Access For A User"
        },
        {
          "name": "Delete Device Access For A User",
          "value": "Delete Device Access For A User"
        },
        {
          "name": "List Device By User",
          "value": "List Device By User"
        },
        {
          "name": "List Device",
          "value": "List Device"
        },
        {
          "name": "Delete Devices For Current User",
          "value": "Delete Devices For Current User"
        },
        {
          "name": "Update Device",
          "value": "Update Device"
        },
        {
          "name": "Delete Device Accesses For Device",
          "value": "Delete Device Accesses For Device"
        }
      ],
      "default": "List Device Access",
      "noDataExpression": true
    },
    {
      "displayName": "Service Mail",
      "name": "path_service_mail",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "List Device Access"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "List Device Access"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
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
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "List Device Access"
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
          "displayName": "No User",
          "name": "query_no_user",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Search",
          "name": "query_search",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Type",
          "name": "query_type",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "computer",
              "value": "computer"
            },
            {
              "name": "legacy",
              "value": "legacy"
            },
            {
              "name": "other",
              "value": "other"
            },
            {
              "name": "phone",
              "value": "phone"
            },
            {
              "name": "tablet",
              "value": "tablet"
            }
          ]
        },
        {
          "displayName": "User Id",
          "name": "query_user_id",
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
      "displayName": "Service Mail",
      "name": "path_service_mail",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "Create Device Access"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "Create Device Access"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Protocols",
      "name": "body_protocols",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "Create Device Access"
          ]
        }
      },
      "required": true,
      "description": "Specifies the protocol of the access. By default, all protocol choices include smtp protocol.<note><strong>imap</strong>: The protocol is imap.</note><note><strong>pop3</strong>: The protocol is pop3.</note><note><strong>pop3-imap</strong>: The protocol is imap and pop3.</note>",
      "options": [
        {
          "name": "imap",
          "value": "imap"
        },
        {
          "name": "pop3",
          "value": "pop3"
        },
        {
          "name": "pop3-imap",
          "value": "pop3-imap"
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
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "Create Device Access"
          ]
        }
      },
      "options": [
        {
          "displayName": "Device Id",
          "name": "body_device_id",
          "type": "number",
          "default": 0,
          "description": "id of the device used by the mailbox"
        },
        {
          "displayName": "Device Uid",
          "name": "body_device_uid",
          "type": "string",
          "default": "",
          "description": "UID of the true device used by an access token"
        },
        {
          "displayName": "Label",
          "name": "body_label",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Type",
          "name": "body_type",
          "type": "options",
          "default": "",
          "description": "Specifies the type of the device.<note><strong>computer</strong>: The device is a computer.</note><note><strong>other</strong>: The device is an other type.</note><note><strong>phone</strong>: The device is a phone.</note><note><strong>tablet</strong>: The device is a tablet.</note>",
          "options": [
            {
              "name": "computer",
              "value": "computer"
            },
            {
              "name": "other",
              "value": "other"
            },
            {
              "name": "phone",
              "value": "phone"
            },
            {
              "name": "tablet",
              "value": "tablet"
            }
          ]
        },
        {
          "displayName": "User Id",
          "name": "body_user_id",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Service Mail",
      "name": "path_service_mail",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "Delete Device Accesses For Mailbox"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "Delete Device Accesses For Mailbox"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Service Mail",
      "name": "path_service_mail",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "Regenerate Password Device Access"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "Regenerate Password Device Access"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Device Access",
      "name": "path_device_access",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "Regenerate Password Device Access"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the device access to request."
    },
    {
      "displayName": "Service Mail",
      "name": "path_service_mail",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "Delete Device Access"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "Delete Device Access"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Device Access",
      "name": "path_device_access",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "Delete Device Access"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the device access to request."
    },
    {
      "displayName": "Service Mail",
      "name": "path_service_mail",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "List Device Access For A User"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "List Device Access For A User"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "List Device Access For A User"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the user to request."
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
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "List Device Access For A User"
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
      "displayName": "Service Mail",
      "name": "path_service_mail",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "Delete Device Access For A User"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "Delete Device Access For A User"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "Delete Device Access For A User"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the user to request."
    },
    {
      "displayName": "Service Mail",
      "name": "path_service_mail",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "List Device By User"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "List Device By User"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the user to request."
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
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "List Device By User"
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
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "List Device"
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
      "displayName": "Device",
      "name": "path_device",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "Update Device"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the device to request."
    },
    {
      "displayName": "Label",
      "name": "body_label",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "Update Device"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Device",
      "name": "path_device",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Devices"
          ],
          "operation": [
            "Delete Device Accesses For Device"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the device to request."
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Invitations"
          ]
        }
      },
      "options": [
        {
          "name": "Create Webmail Access Link",
          "value": "Create Webmail Access Link"
        },
        {
          "name": "Send Webmail Access Link By E Mail",
          "value": "Send Webmail Access Link By E Mail"
        }
      ],
      "default": "Create Webmail Access Link",
      "noDataExpression": true
    },
    {
      "displayName": "Service Mail",
      "name": "path_service_mail",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Invitations"
          ],
          "operation": [
            "Create Webmail Access Link"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Invitations"
          ],
          "operation": [
            "Create Webmail Access Link"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
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
            "Mailboxes > Accesses > Invitations"
          ],
          "operation": [
            "Create Webmail Access Link"
          ]
        }
      },
      "options": [
        {
          "displayName": "Firstname",
          "name": "body_firstname",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Force Email",
          "name": "body_force_email",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Lastname",
          "name": "body_lastname",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Permissions",
          "name": "body_permissions",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Signature Template Id",
          "name": "body_signature_template_id",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Service Mail",
      "name": "path_service_mail",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Invitations"
          ],
          "operation": [
            "Send Webmail Access Link By E Mail"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Invitations"
          ],
          "operation": [
            "Send Webmail Access Link By E Mail"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Invitation Webmail",
      "name": "path_invitation_webmail",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Invitations"
          ],
          "operation": [
            "Send Webmail Access Link By E Mail"
          ]
        }
      },
      "required": true,
      "description": "The identifier of the invitation."
    },
    {
      "displayName": "Email",
      "name": "body_email",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Invitations"
          ],
          "operation": [
            "Send Webmail Access Link By E Mail"
          ]
        }
      },
      "required": true,
      "description": "Email"
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
            "Mailboxes > Accesses > Invitations"
          ],
          "operation": [
            "Send Webmail Access Link By E Mail"
          ]
        }
      },
      "options": [
        {
          "displayName": "Language",
          "name": "body_language",
          "type": "options",
          "default": "",
          "description": "Current language preference code.<note><strong>de</strong>: German language.</note><note><strong>en</strong>: English language.</note><note><strong>es</strong>: Spanish language.</note><note><strong>fr</strong>: French language.</note><note><strong>it</strong>: Italian language.</note>",
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
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Webmail"
          ]
        }
      },
      "options": [
        {
          "name": "List User Access And Invitations",
          "value": "List User Access And Invitations"
        },
        {
          "name": "Create Webmail Access",
          "value": "Create Webmail Access"
        },
        {
          "name": "Set The Primary Mailbox For The Authenticated User",
          "value": "Set The Primary Mailbox For The Authenticated User"
        },
        {
          "name": "List Users Having Access",
          "value": "List Users Having Access"
        },
        {
          "name": "List Of User Accesses For The Current User",
          "value": "List Of User Accesses For The Current User"
        },
        {
          "name": "List Of User Accesses For A Account And A User",
          "value": "List Of User Accesses For A Account And A User"
        },
        {
          "name": "Update Webmail Access",
          "value": "Update Webmail Access"
        },
        {
          "name": "Delete Webmail Access",
          "value": "Delete Webmail Access"
        },
        {
          "name": "Delete Access To A Mailbox For The Current User",
          "value": "Delete Access To A Mailbox For The Current User"
        }
      ],
      "default": "List User Access And Invitations",
      "noDataExpression": true
    },
    {
      "displayName": "Service Mail",
      "name": "path_service_mail",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Webmail"
          ],
          "operation": [
            "List User Access And Invitations"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Webmail"
          ],
          "operation": [
            "List User Access And Invitations"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
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
            "Mailboxes > Accesses > Webmail"
          ],
          "operation": [
            "List User Access And Invitations"
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
      "displayName": "Service Mail",
      "name": "path_service_mail",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Webmail"
          ],
          "operation": [
            "Create Webmail Access"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Webmail"
          ],
          "operation": [
            "Create Webmail Access"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "User Id",
      "name": "body_user_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Webmail"
          ],
          "operation": [
            "Create Webmail Access"
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
            "Mailboxes > Accesses > Webmail"
          ],
          "operation": [
            "Create Webmail Access"
          ]
        }
      },
      "options": [
        {
          "displayName": "Permissions",
          "name": "body_permissions",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Mailbox Id",
      "name": "path_mailbox_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Webmail"
          ],
          "operation": [
            "Set The Primary Mailbox For The Authenticated User"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the email address."
    },
    {
      "displayName": "Service Mail",
      "name": "path_service_mail",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Webmail"
          ],
          "operation": [
            "List Users Having Access"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Webmail"
          ],
          "operation": [
            "List Users Having Access"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
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
            "Mailboxes > Accesses > Webmail"
          ],
          "operation": [
            "List Users Having Access"
          ]
        }
      },
      "options": [
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
            "Mailboxes > Accesses > Webmail"
          ],
          "operation": [
            "List Of User Accesses For The Current User"
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
      "displayName": "Account Id",
      "name": "path_account_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Webmail"
          ],
          "operation": [
            "List Of User Accesses For A Account And A User"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Webmail"
          ],
          "operation": [
            "List Of User Accesses For A Account And A User"
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
            "Mailboxes > Accesses > Webmail"
          ],
          "operation": [
            "List Of User Accesses For A Account And A User"
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
      "displayName": "Service Mail",
      "name": "path_service_mail",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Webmail"
          ],
          "operation": [
            "Update Webmail Access"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Webmail"
          ],
          "operation": [
            "Update Webmail Access"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Webmail"
          ],
          "operation": [
            "Update Webmail Access"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the user to request."
    },
    {
      "displayName": "Permissions",
      "name": "body_permissions",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Webmail"
          ],
          "operation": [
            "Update Webmail Access"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Service Mail",
      "name": "path_service_mail",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Webmail"
          ],
          "operation": [
            "Delete Webmail Access"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Webmail"
          ],
          "operation": [
            "Delete Webmail Access"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Webmail"
          ],
          "operation": [
            "Delete Webmail Access"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the user to request."
    },
    {
      "displayName": "Mailbox Id",
      "name": "path_mailbox_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Accesses > Webmail"
          ],
          "operation": [
            "Delete Access To A Mailbox For The Current User"
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
            "Mailboxes > Aliases"
          ]
        }
      },
      "options": [
        {
          "name": "List Aliases",
          "value": "List Aliases"
        },
        {
          "name": "Add An Alias",
          "value": "Add An Alias"
        },
        {
          "name": "Update Aliases",
          "value": "Update Aliases"
        },
        {
          "name": "Delete An Alias",
          "value": "Delete An Alias"
        }
      ],
      "default": "List Aliases",
      "noDataExpression": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Aliases"
          ],
          "operation": [
            "List Aliases"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Aliases"
          ],
          "operation": [
            "List Aliases"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Aliases"
          ],
          "operation": [
            "Add An Alias"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Aliases"
          ],
          "operation": [
            "Add An Alias"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Alias",
      "name": "body_alias",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Aliases"
          ],
          "operation": [
            "Add An Alias"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Aliases"
          ],
          "operation": [
            "Update Aliases"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Aliases"
          ],
          "operation": [
            "Update Aliases"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Aliases",
      "name": "body_aliases",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Aliases"
          ],
          "operation": [
            "Update Aliases"
          ]
        }
      },
      "required": true,
      "description": "List of aliases"
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Aliases"
          ],
          "operation": [
            "Delete An Alias"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Aliases"
          ],
          "operation": [
            "Delete An Alias"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Alias",
      "name": "path_alias",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Aliases"
          ],
          "operation": [
            "Delete An Alias"
          ]
        }
      },
      "required": true,
      "description": "Alias to remove."
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Auto Reply"
          ]
        }
      },
      "options": [
        {
          "name": "List Auto Replies Models",
          "value": "List Auto Replies Models"
        },
        {
          "name": "Add Auto Reply Model",
          "value": "Add Auto Reply Model"
        },
        {
          "name": "Reset An Auto Reply",
          "value": "Reset An Auto Reply"
        },
        {
          "name": "Show Auto Reply Model",
          "value": "Show Auto Reply Model"
        },
        {
          "name": "Update Auto Reply Model",
          "value": "Update Auto Reply Model"
        },
        {
          "name": "Update Auto Reply Model",
          "value": "Update Auto Reply Model (2)"
        }
      ],
      "default": "List Auto Replies Models",
      "noDataExpression": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Auto Reply"
          ],
          "operation": [
            "List Auto Replies Models"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Auto Reply"
          ],
          "operation": [
            "List Auto Replies Models"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Auto Reply"
          ],
          "operation": [
            "Add Auto Reply Model"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Auto Reply"
          ],
          "operation": [
            "Add Auto Reply Model"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Is Recurrent",
      "name": "body_is_recurrent",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Auto Reply"
          ],
          "operation": [
            "Add Auto Reply Model"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Message",
      "name": "body_message",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Auto Reply"
          ],
          "operation": [
            "Add Auto Reply Model"
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
            "Mailboxes > Auto Reply"
          ],
          "operation": [
            "Add Auto Reply Model"
          ]
        }
      },
      "required": true,
      "description": "Name the auto reply model"
    },
    {
      "displayName": "Reply From Id",
      "name": "body_reply_from_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Auto Reply"
          ],
          "operation": [
            "Add Auto Reply Model"
          ]
        }
      },
      "required": true,
      "description": "Id of the Email that send the auto reply"
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
            "Mailboxes > Auto Reply"
          ],
          "operation": [
            "Add Auto Reply Model"
          ]
        }
      },
      "options": [
        {
          "displayName": "Dont Reply To",
          "name": "body_dont_reply_to",
          "type": "json",
          "default": {},
          "description": " List of mail that aren't concerned by the responder"
        },
        {
          "displayName": "Ended At",
          "name": "body_ended_at",
          "type": "number",
          "default": 0,
          "description": "When the responder is supposed to end"
        },
        {
          "displayName": "Recurrent Days",
          "name": "body_recurrent_days",
          "type": "json",
          "default": {},
          "description": "List of the days when the auto reply is activated"
        },
        {
          "displayName": "Started At",
          "name": "body_started_at",
          "type": "number",
          "default": 0,
          "description": "Dates when the responder has become active"
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Auto Reply"
          ],
          "operation": [
            "Reset An Auto Reply"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Auto Reply"
          ],
          "operation": [
            "Reset An Auto Reply"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Auto Reply"
          ],
          "operation": [
            "Show Auto Reply Model"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Auto Reply"
          ],
          "operation": [
            "Show Auto Reply Model"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Model Id",
      "name": "path_model_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Auto Reply"
          ],
          "operation": [
            "Show Auto Reply Model"
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
            "Mailboxes > Auto Reply"
          ],
          "operation": [
            "Show Auto Reply Model"
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
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Auto Reply"
          ],
          "operation": [
            "Update Auto Reply Model"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Auto Reply"
          ],
          "operation": [
            "Update Auto Reply Model"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Model Id",
      "name": "path_model_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Auto Reply"
          ],
          "operation": [
            "Update Auto Reply Model"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Is Active",
      "name": "body_is_active",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Auto Reply"
          ],
          "operation": [
            "Update Auto Reply Model"
          ]
        }
      },
      "required": true,
      "description": "Indicates if the responder is active"
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
            "Mailboxes > Auto Reply"
          ],
          "operation": [
            "Update Auto Reply Model"
          ]
        }
      },
      "options": [
        {
          "displayName": "Dont Reply To",
          "name": "body_dont_reply_to",
          "type": "json",
          "default": {},
          "description": " List of mail that aren't concerned by the responder"
        },
        {
          "displayName": "Ended At",
          "name": "body_ended_at",
          "type": "number",
          "default": 0,
          "description": "When the responder is supposed to end"
        },
        {
          "displayName": "Is Model",
          "name": "body_is_model",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Is Recurrent",
          "name": "body_is_recurrent",
          "type": "boolean",
          "default": false
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
          "description": "Name the auto reply model"
        },
        {
          "displayName": "Recurrent Days",
          "name": "body_recurrent_days",
          "type": "json",
          "default": {},
          "description": "List of the days when the auto reply is activated"
        },
        {
          "displayName": "Reply From Id",
          "name": "body_reply_from_id",
          "type": "number",
          "default": 0,
          "description": "Id of the Email that send the auto reply"
        },
        {
          "displayName": "Started At",
          "name": "body_started_at",
          "type": "number",
          "default": 0,
          "description": "Dates when the responder has become active"
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Auto Reply"
          ],
          "operation": [
            "Update Auto Reply Model (2)"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Auto Reply"
          ],
          "operation": [
            "Update Auto Reply Model (2)"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Model Id",
      "name": "path_model_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Auto Reply"
          ],
          "operation": [
            "Update Auto Reply Model (2)"
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
            "Mailboxes > Folders"
          ]
        }
      },
      "options": [
        {
          "name": "List Folders",
          "value": "List Folders"
        },
        {
          "name": "Update Folders",
          "value": "Update Folders"
        },
        {
          "name": "Purge Spam Folder",
          "value": "Purge Spam Folder"
        },
        {
          "name": "Empty Trash Folder",
          "value": "Empty Trash Folder"
        }
      ],
      "default": "List Folders",
      "noDataExpression": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Folders"
          ],
          "operation": [
            "List Folders"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Folders"
          ],
          "operation": [
            "List Folders"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Folders"
          ],
          "operation": [
            "Update Folders"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Folders"
          ],
          "operation": [
            "Update Folders"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Archives Folder",
      "name": "body_archives_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Folders"
          ],
          "operation": [
            "Update Folders"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Draft Folder",
      "name": "body_draft_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Folders"
          ],
          "operation": [
            "Update Folders"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Sent Folder",
      "name": "body_sent_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Folders"
          ],
          "operation": [
            "Update Folders"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Trash Folder",
      "name": "body_trash_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Folders"
          ],
          "operation": [
            "Update Folders"
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
            "Mailboxes > Folders"
          ],
          "operation": [
            "Update Folders"
          ]
        }
      },
      "options": [
        {
          "displayName": "Commercials Folder",
          "name": "body_commercials_folder",
          "type": "string",
          "default": "",
          "description": "The location where the referenced commercial mail goes. Required if the option is activated on the mailbox"
        },
        {
          "displayName": "Social Networks Folder",
          "name": "body_social_networks_folder",
          "type": "string",
          "default": "",
          "description": "The location where the referenced social mails are placed. Required if the option is activated on the mailbox"
        },
        {
          "displayName": "Spam Folder",
          "name": "body_spam_folder",
          "type": "string",
          "default": "",
          "description": "The location where all the spam labelled mail are stored.Required if the spam filter is activated on the mailbox."
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Folders"
          ],
          "operation": [
            "Purge Spam Folder"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Folders"
          ],
          "operation": [
            "Purge Spam Folder"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Folders"
          ],
          "operation": [
            "Empty Trash Folder"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Folders"
          ],
          "operation": [
            "Empty Trash Folder"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Forwarding"
          ]
        }
      },
      "options": [
        {
          "name": "List Forwarding",
          "value": "List Forwarding"
        },
        {
          "name": "Add A Forwarding",
          "value": "Add A Forwarding"
        },
        {
          "name": "Update A Forwarding",
          "value": "Update A Forwarding"
        },
        {
          "name": "Delete All Forwardings",
          "value": "Delete All Forwardings"
        },
        {
          "name": "Delete A Forwarding",
          "value": "Delete A Forwarding"
        }
      ],
      "default": "List Forwarding",
      "noDataExpression": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Forwarding"
          ],
          "operation": [
            "List Forwarding"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Forwarding"
          ],
          "operation": [
            "List Forwarding"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Forwarding"
          ],
          "operation": [
            "Add A Forwarding"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Forwarding"
          ],
          "operation": [
            "Add A Forwarding"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Redirect Address",
      "name": "body_redirect_address",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Forwarding"
          ],
          "operation": [
            "Add A Forwarding"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Forwarding"
          ],
          "operation": [
            "Update A Forwarding"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Forwarding"
          ],
          "operation": [
            "Update A Forwarding"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
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
            "Mailboxes > Forwarding"
          ],
          "operation": [
            "Update A Forwarding"
          ]
        }
      },
      "options": [
        {
          "displayName": "Has Dont Deliver",
          "name": "body_has_dont_deliver",
          "type": "boolean",
          "default": false,
          "description": "Indicates if the mailbox should delete emails locally after forwarding them"
        },
        {
          "displayName": "Has Forward Spam",
          "name": "body_has_forward_spam",
          "type": "boolean",
          "default": false,
          "description": "Indicates if the mailbox should forward mail that are considered to be spam"
        },
        {
          "displayName": "Is Enabled",
          "name": "body_is_enabled",
          "type": "boolean",
          "default": false,
          "description": "Indicates if the redirection is enabled on the mailbox.\\n Warning: setting it to false drop all the existing adresses"
        },
        {
          "displayName": "Redirect Addresses",
          "name": "body_redirect_addresses",
          "type": "json",
          "default": {},
          "description": "List of the redirection addresses where the mail are redirected in the mailbox, the maximum is set to 1 if you have a starter pack"
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Forwarding"
          ],
          "operation": [
            "Delete All Forwardings"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Forwarding"
          ],
          "operation": [
            "Delete All Forwardings"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Forwarding"
          ],
          "operation": [
            "Delete A Forwarding"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Forwarding"
          ],
          "operation": [
            "Delete A Forwarding"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Redirect Addresses",
      "name": "path_redirect_addresses",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Forwarding"
          ],
          "operation": [
            "Delete A Forwarding"
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
            "Mailboxes > Sieve Filters"
          ]
        }
      },
      "options": [
        {
          "name": "Enable / Disable Filter",
          "value": "Enable / Disable Filter"
        },
        {
          "name": "Reorder Filters",
          "value": "Reorder Filters"
        },
        {
          "name": "List Filters",
          "value": "List Filters"
        },
        {
          "name": "Add A Filter",
          "value": "Add A Filter"
        },
        {
          "name": "Update A Filter",
          "value": "Update A Filter"
        },
        {
          "name": "Delete A Filter",
          "value": "Delete A Filter"
        },
        {
          "name": "Add A Script",
          "value": "Add A Script"
        },
        {
          "name": "Update A Script",
          "value": "Update A Script"
        },
        {
          "name": "Delete A Script",
          "value": "Delete A Script"
        },
        {
          "name": "Enable / Disable Script",
          "value": "Enable / Disable Script"
        },
        {
          "name": "Import .siv File",
          "value": "Import .siv File"
        }
      ],
      "default": "Enable / Disable Filter",
      "noDataExpression": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Enable / Disable Filter"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Enable / Disable Filter"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Is Enabled",
      "name": "body_is_enabled",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Enable / Disable Filter"
          ]
        }
      },
      "required": true,
      "description": "Specify if the filter is enabled or disabled"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Enable / Disable Filter"
          ]
        }
      },
      "required": true,
      "description": "Name of the filter"
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Reorder Filters"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Reorder Filters"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Order",
      "name": "body_order",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Reorder Filters"
          ]
        }
      },
      "required": true,
      "description": "The new order of the filter referenced by their name"
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "List Filters"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "List Filters"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Add A Filter"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Add A Filter"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Actions",
      "name": "body_actions",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Add A Filter"
          ]
        }
      },
      "required": true,
      "description": "Action to do when the filter is triggered"
    },
    {
      "displayName": "Conditions",
      "name": "body_conditions",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Add A Filter"
          ]
        }
      },
      "required": true,
      "description": "Condition when the filter is triggered"
    },
    {
      "displayName": "Has All Of",
      "name": "body_has_all_of",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Add A Filter"
          ]
        }
      },
      "required": true,
      "description": "Indicates if all the condition are needed or if just one is sufficient"
    },
    {
      "displayName": "Is Enabled",
      "name": "body_is_enabled",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Add A Filter"
          ]
        }
      },
      "required": true,
      "description": "Indicates if the filter is enabled"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Add A Filter"
          ]
        }
      },
      "required": true,
      "description": "Name of the filter"
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
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Add A Filter"
          ]
        }
      },
      "options": [
        {
          "displayName": "Template Id",
          "name": "body_template_id",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Update A Filter"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Update A Filter"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Actions",
      "name": "body_actions",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Update A Filter"
          ]
        }
      },
      "required": true,
      "description": "Action to do when the filter is triggered"
    },
    {
      "displayName": "Conditions",
      "name": "body_conditions",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Update A Filter"
          ]
        }
      },
      "required": true,
      "description": "Condition when the filter is triggered"
    },
    {
      "displayName": "Has All Of",
      "name": "body_has_all_of",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Update A Filter"
          ]
        }
      },
      "required": true,
      "description": "Indicates if all the condition are needed or if just one is sufficient"
    },
    {
      "displayName": "Is Enabled",
      "name": "body_is_enabled",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Update A Filter"
          ]
        }
      },
      "required": true,
      "description": "Indicates if the filter is enabled"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Update A Filter"
          ]
        }
      },
      "required": true,
      "description": "Name of the filter"
    },
    {
      "displayName": "Old Name",
      "name": "body_old_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Update A Filter"
          ]
        }
      },
      "required": true,
      "description": "The actual name of the filter"
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
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Update A Filter"
          ]
        }
      },
      "options": [
        {
          "displayName": "Template Id",
          "name": "body_template_id",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Delete A Filter"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Delete A Filter"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Delete A Filter"
          ]
        }
      },
      "required": true,
      "description": "Name of the filter"
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Add A Script"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Add A Script"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Content",
      "name": "body_content",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Add A Script"
          ]
        }
      },
      "required": true,
      "description": "Filter script content"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Add A Script"
          ]
        }
      },
      "required": true,
      "description": "Filter script name"
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
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Add A Script"
          ]
        }
      },
      "options": [
        {
          "displayName": "Is Enabled",
          "name": "body_is_enabled",
          "type": "boolean",
          "default": false,
          "description": "Specify if the script is enabled or disabled"
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Update A Script"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Update A Script"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Content",
      "name": "body_content",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Update A Script"
          ]
        }
      },
      "required": true,
      "description": "Filter script content"
    },
    {
      "displayName": "Is Enabled",
      "name": "body_is_enabled",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Update A Script"
          ]
        }
      },
      "required": true,
      "description": "Specify if the script is enabled or disabled"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Update A Script"
          ]
        }
      },
      "required": true,
      "description": "Filter script name"
    },
    {
      "displayName": "Old Name",
      "name": "body_old_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Update A Script"
          ]
        }
      },
      "required": true,
      "description": "Filter actual name identifier"
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Delete A Script"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Delete A Script"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Delete A Script"
          ]
        }
      },
      "required": true,
      "description": "Filter name"
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Enable / Disable Script"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Enable / Disable Script"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Is Enabled",
      "name": "body_is_enabled",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Enable / Disable Script"
          ]
        }
      },
      "required": true,
      "description": "Script is active or not"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Enable / Disable Script"
          ]
        }
      },
      "required": true,
      "description": "Script actual name identifier"
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Import .siv File"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Import .siv File"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "File",
      "name": "body_file",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Import .siv File"
          ]
        }
      },
      "required": true,
      "description": "Base64 Filter script content"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Sieve Filters"
          ],
          "operation": [
            "Import .siv File"
          ]
        }
      },
      "required": true,
      "description": "Filter script name"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Signatures"
          ]
        }
      },
      "options": [
        {
          "name": "Set Default Signature",
          "value": "Set Default Signature"
        },
        {
          "name": "List All Signatures",
          "value": "List All Signatures"
        },
        {
          "name": "Create Signature",
          "value": "Create Signature"
        },
        {
          "name": "Upload Image",
          "value": "Upload Image"
        },
        {
          "name": "List Templates",
          "value": "List Templates"
        },
        {
          "name": "Show One Template",
          "value": "Show One Template"
        },
        {
          "name": "Show A Signature",
          "value": "Show A Signature"
        },
        {
          "name": "Update A Specific Signature",
          "value": "Update A Specific Signature"
        },
        {
          "name": "Delete A Signature",
          "value": "Delete A Signature"
        }
      ],
      "default": "Set Default Signature",
      "noDataExpression": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Signatures"
          ],
          "operation": [
            "Set Default Signature"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Signatures"
          ],
          "operation": [
            "Set Default Signature"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
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
            "Mailboxes > Signatures"
          ],
          "operation": [
            "Set Default Signature"
          ]
        }
      },
      "options": [
        {
          "displayName": "Default Reply Signature Id",
          "name": "body_default_reply_signature_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Default Signature Id",
          "name": "body_default_signature_id",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Signatures"
          ],
          "operation": [
            "List All Signatures"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Signatures"
          ],
          "operation": [
            "List All Signatures"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
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
            "Mailboxes > Signatures"
          ],
          "operation": [
            "List All Signatures"
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
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Signatures"
          ],
          "operation": [
            "Create Signature"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Signatures"
          ],
          "operation": [
            "Create Signature"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Signatures"
          ],
          "operation": [
            "Create Signature"
          ]
        }
      },
      "required": true,
      "description": "Name of the resource `{name}`"
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
            "Mailboxes > Signatures"
          ],
          "operation": [
            "Create Signature"
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
          "displayName": "Form Data",
          "name": "body_form_data",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Fullname",
          "name": "body_fullname",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Has Infomaniak Footer",
          "name": "body_has_infomaniak_footer",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Is Available For All",
          "name": "body_is_available_for_all",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Is Default",
          "name": "body_is_default",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Position",
          "name": "body_position",
          "type": "options",
          "default": "",
          "description": "Specifies the position of the signature in an email. The signature can be placed either at the top or at the bottom of the email content.<note><strong>bottom</strong>: The signature is placed at the bottom of the email.</note><note><strong>top</strong>: The signature is placed at the top of the email.</note>",
          "options": [
            {
              "name": "bottom",
              "value": "bottom"
            },
            {
              "name": "top",
              "value": "top"
            }
          ]
        },
        {
          "displayName": "Reply Email",
          "name": "body_reply_email",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Sending Email",
          "name": "body_sending_email",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Template Id",
          "name": "body_template_id",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Attributes",
          "name": "body_attributes",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Signatures"
          ],
          "operation": [
            "Upload Image"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Signatures"
          ],
          "operation": [
            "Upload Image"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Image",
      "name": "body_image",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Signatures"
          ],
          "operation": [
            "Upload Image"
          ]
        }
      },
      "required": true,
      "description": "Base64 image content (png,jpg,jpeg,svg or gif MIME type)"
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Signatures"
          ],
          "operation": [
            "List Templates"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Signatures"
          ],
          "operation": [
            "List Templates"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Signatures"
          ],
          "operation": [
            "Show One Template"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Signatures"
          ],
          "operation": [
            "Show One Template"
          ]
        }
      },
      "required": true,
      "description": "The unique name of the mailbox."
    },
    {
      "displayName": "Signature Template",
      "name": "path_signature_template",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Signatures"
          ],
          "operation": [
            "Show One Template"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier of the signature template."
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Signatures"
          ],
          "operation": [
            "Show A Signature"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Signatures"
          ],
          "operation": [
            "Show A Signature"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Signature",
      "name": "path_signature",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Signatures"
          ],
          "operation": [
            "Show A Signature"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the signature to request."
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Signatures"
          ],
          "operation": [
            "Update A Specific Signature"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Signatures"
          ],
          "operation": [
            "Update A Specific Signature"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Signature",
      "name": "path_signature",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Signatures"
          ],
          "operation": [
            "Update A Specific Signature"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the signature to request."
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
            "Mailboxes > Signatures"
          ],
          "operation": [
            "Update A Specific Signature"
          ]
        }
      },
      "options": [
        {
          "displayName": "Attributes",
          "name": "body_attributes",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Content",
          "name": "body_content",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Form Data",
          "name": "body_form_data",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Fullname",
          "name": "body_fullname",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Has Infomaniak Footer",
          "name": "body_has_infomaniak_footer",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Is Default",
          "name": "body_is_default",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "Name of the resource `{name}`"
        },
        {
          "displayName": "Position",
          "name": "body_position",
          "type": "options",
          "default": "",
          "description": "Specifies the position of the signature in an email. The signature can be placed either at the top or at the bottom of the email content.<note><strong>bottom</strong>: The signature is placed at the bottom of the email.</note><note><strong>top</strong>: The signature is placed at the top of the email.</note>",
          "options": [
            {
              "name": "bottom",
              "value": "bottom"
            },
            {
              "name": "top",
              "value": "top"
            }
          ]
        },
        {
          "displayName": "Reply Email",
          "name": "body_reply_email",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Sending Email",
          "name": "body_sending_email",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Template Id",
          "name": "body_template_id",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Signatures"
          ],
          "operation": [
            "Delete A Signature"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Signatures"
          ],
          "operation": [
            "Delete A Signature"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Signature",
      "name": "path_signature",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Signatures"
          ],
          "operation": [
            "Delete A Signature"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the signature to request."
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Users"
          ]
        }
      },
      "options": [
        {
          "name": "Add An Invitation",
          "value": "Add An Invitation"
        },
        {
          "name": "List Users",
          "value": "List Users"
        },
        {
          "name": "List User Invitations",
          "value": "List User Invitations"
        },
        {
          "name": "Send An Invitation",
          "value": "Send An Invitation"
        },
        {
          "name": "Update User Permission",
          "value": "Update User Permission"
        },
        {
          "name": "Remove A User",
          "value": "Remove A User"
        },
        {
          "name": "Update Invitation Permission",
          "value": "Update Invitation Permission"
        },
        {
          "name": "Delete An Invitation",
          "value": "Delete An Invitation"
        }
      ],
      "default": "Add An Invitation",
      "noDataExpression": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Users"
          ],
          "operation": [
            "Add An Invitation"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Users"
          ],
          "operation": [
            "Add An Invitation"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Permissions",
      "name": "body_permissions",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Users"
          ],
          "operation": [
            "Add An Invitation"
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
            "Mailboxes > Users"
          ],
          "operation": [
            "Add An Invitation"
          ]
        }
      },
      "options": [
        {
          "displayName": "Firstname",
          "name": "body_firstname",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Force Email",
          "name": "body_force_email",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Lastname",
          "name": "body_lastname",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Send Email",
          "name": "body_send_email",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Signature Template Id",
          "name": "body_signature_template_id",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Users"
          ],
          "operation": [
            "List Users"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Users"
          ],
          "operation": [
            "List Users"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
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
            "Mailboxes > Users"
          ],
          "operation": [
            "List Users"
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
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Users"
          ],
          "operation": [
            "List User Invitations"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Users"
          ],
          "operation": [
            "List User Invitations"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Users"
          ],
          "operation": [
            "Send An Invitation"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Users"
          ],
          "operation": [
            "Send An Invitation"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
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
            "Mailboxes > Users"
          ],
          "operation": [
            "Send An Invitation"
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
          "displayName": "Firstname",
          "name": "body_firstname",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Force Email",
          "name": "body_force_email",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Key",
          "name": "body_key",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Language",
          "name": "body_language",
          "type": "options",
          "default": "",
          "description": "Current language preference code.<note><strong>de</strong>: German language.</note><note><strong>en</strong>: English language.</note><note><strong>es</strong>: Spanish language.</note><note><strong>fr</strong>: French language.</note><note><strong>it</strong>: Italian language.</note>",
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
          "displayName": "Lastname",
          "name": "body_lastname",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Permissions",
          "name": "body_permissions",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Phone",
          "name": "body_phone",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Users"
          ],
          "operation": [
            "Update User Permission"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Users"
          ],
          "operation": [
            "Update User Permission"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Users"
          ],
          "operation": [
            "Update User Permission"
          ]
        }
      },
      "required": true,
      "description": "User identifier"
    },
    {
      "displayName": "Permissions",
      "name": "body_permissions",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Users"
          ],
          "operation": [
            "Update User Permission"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Users"
          ],
          "operation": [
            "Remove A User"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Users"
          ],
          "operation": [
            "Remove A User"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Users"
          ],
          "operation": [
            "Remove A User"
          ]
        }
      },
      "required": true,
      "description": "User identifier"
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Users"
          ],
          "operation": [
            "Update Invitation Permission"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Users"
          ],
          "operation": [
            "Update Invitation Permission"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Key",
      "name": "path_key",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Users"
          ],
          "operation": [
            "Update Invitation Permission"
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
            "Mailboxes > Users"
          ],
          "operation": [
            "Update Invitation Permission"
          ]
        }
      },
      "options": [
        {
          "displayName": "Force Email",
          "name": "body_force_email",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Permissions",
          "name": "body_permissions",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Users"
          ],
          "operation": [
            "Delete An Invitation"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the mail hosting to request."
    },
    {
      "displayName": "Mailbox Name",
      "name": "path_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Users"
          ],
          "operation": [
            "Delete An Invitation"
          ]
        }
      },
      "required": true,
      "description": "The username (that is the part before the @) of the email address you want to request."
    },
    {
      "displayName": "Key",
      "name": "path_key",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailboxes > Users"
          ],
          "operation": [
            "Delete An Invitation"
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
            "Mailing List"
          ]
        }
      },
      "options": [
        {
          "name": "List All The Mailing Lists",
          "value": "List All The Mailing Lists"
        },
        {
          "name": "Create A Mailing List",
          "value": "Create A Mailing List"
        },
        {
          "name": "Show One Mailing List",
          "value": "Show One Mailing List"
        },
        {
          "name": "Update Mailing List Parameters",
          "value": "Update Mailing List Parameters"
        },
        {
          "name": "Delete A Mailing List",
          "value": "Delete A Mailing List"
        },
        {
          "name": "Send A Mail Through A Mailing List",
          "value": "Send A Mail Through A Mailing List"
        },
        {
          "name": "Generate A Form For A Mailing List",
          "value": "Generate A Form For A Mailing List"
        }
      ],
      "default": "List All The Mailing Lists",
      "noDataExpression": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "List All The Mailing Lists"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Create A Mailing List"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Info",
      "name": "body_info",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Create A Mailing List"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Is Reply To Forced",
      "name": "body_is_reply_to_forced",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Create A Mailing List"
          ]
        }
      },
      "required": true,
      "description": "Tells if the mail of the sender is replaced by the mailing list mail"
    },
    {
      "displayName": "Max Message Size",
      "name": "body_max_message_size",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Create A Mailing List"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Moderators",
      "name": "body_moderators",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Create A Mailing List"
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
            "Mailing List"
          ],
          "operation": [
            "Create A Mailing List"
          ]
        }
      },
      "required": true,
      "description": "Name that identifies the mailing list"
    },
    {
      "displayName": "Should Send Notifications",
      "name": "body_should_send_notifications",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Create A Mailing List"
          ]
        }
      },
      "required": true,
      "description": "Tells if the mailing list should send or not welcome/goodbye message"
    },
    {
      "displayName": "Subject",
      "name": "body_subject",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Create A Mailing List"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Use Reply To",
      "name": "body_use_reply_to",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Create A Mailing List"
          ]
        }
      },
      "required": true,
      "description": "Tells if the expeditor's mail is substitute by the mailing list email when responding to it"
    },
    {
      "displayName": "Who Can Send",
      "name": "body_who_can_send",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Create A Mailing List"
          ]
        }
      },
      "required": true,
      "description": "Indicates who can send mails in the mailing list.<note><strong>0</strong>: Only moderator and subscriber can send email through the mailing list.</note><note><strong>1</strong>: Only moderator can send email through the mailing list.</note><note><strong>2</strong>: Everyone can send email through the mailing list but requires a moderator validation.</note><note><strong>3</strong>: Only moderator and subscriber can send email through the mailing list but requires a moderator validation.</note><note><strong>4</strong>: Everyone can send a mail through the mailing list but requires a moderator validation for the mail sent by non subscribers.</note><note><strong>5</strong>: Everyone can send a mail through the mailing list.</note>",
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
        },
        {
          "name": "4",
          "value": "4"
        },
        {
          "name": "5",
          "value": "5"
        }
      ]
    },
    {
      "displayName": "Who Can Subscribe",
      "name": "body_who_can_subscribe",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Create A Mailing List"
          ]
        }
      },
      "required": true,
      "description": "The subscription policy setup for the mailing list.<note><strong>0</strong>: Anybody can subscribe.</note><note><strong>1</strong>: Any new subscription should be confirmed by the owner.</note><note><strong>2</strong>: Any new subscription should be confirmed by the owner and the subscriber.</note>",
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
            "Mailing List"
          ],
          "operation": [
            "Create A Mailing List"
          ]
        }
      },
      "options": [
        {
          "displayName": "Goodbye Message",
          "name": "body_goodbye_message",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Lang",
          "name": "body_lang",
          "type": "options",
          "default": "",
          "description": "Current language preference code.<note><strong>de</strong>: German language.</note><note><strong>en</strong>: English language.</note><note><strong>es</strong>: Spanish language.</note><note><strong>fr</strong>: French language.</note><note><strong>it</strong>: Italian language.</note>",
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
          "displayName": "Welcome Message",
          "name": "body_welcome_message",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Show One Mailing List"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mailing List Name",
      "name": "path_mailing_list_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Show One Mailing List"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Update Mailing List Parameters"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mailing List Name",
      "name": "path_mailing_list_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Update Mailing List Parameters"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Info",
      "name": "body_info",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Update Mailing List Parameters"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Is Reply To Forced",
      "name": "body_is_reply_to_forced",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Update Mailing List Parameters"
          ]
        }
      },
      "required": true,
      "description": "Tells if the mail of the sender is replaced by the mailing list mail"
    },
    {
      "displayName": "Max Message Size",
      "name": "body_max_message_size",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Update Mailing List Parameters"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Moderators",
      "name": "body_moderators",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Update Mailing List Parameters"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Should Send Notifications",
      "name": "body_should_send_notifications",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Update Mailing List Parameters"
          ]
        }
      },
      "required": true,
      "description": "Tells if the mailing list should send or not welcome/goodbye message"
    },
    {
      "displayName": "Subject",
      "name": "body_subject",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Update Mailing List Parameters"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Use Reply To",
      "name": "body_use_reply_to",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Update Mailing List Parameters"
          ]
        }
      },
      "required": true,
      "description": "Tells if the expeditor's mail is substitute by the mailing list email when responding to it"
    },
    {
      "displayName": "Who Can Send",
      "name": "body_who_can_send",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Update Mailing List Parameters"
          ]
        }
      },
      "required": true,
      "description": "Indicates who can send mails in the mailing list.<note><strong>0</strong>: Only moderator and subscriber can send email through the mailing list.</note><note><strong>1</strong>: Only moderator can send email through the mailing list.</note><note><strong>2</strong>: Everyone can send email through the mailing list but requires a moderator validation.</note><note><strong>3</strong>: Only moderator and subscriber can send email through the mailing list but requires a moderator validation.</note><note><strong>4</strong>: Everyone can send a mail through the mailing list but requires a moderator validation for the mail sent by non subscribers.</note><note><strong>5</strong>: Everyone can send a mail through the mailing list.</note>",
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
        },
        {
          "name": "4",
          "value": "4"
        },
        {
          "name": "5",
          "value": "5"
        }
      ]
    },
    {
      "displayName": "Who Can Subscribe",
      "name": "body_who_can_subscribe",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Update Mailing List Parameters"
          ]
        }
      },
      "required": true,
      "description": "The subscription policy setup for the mailing list.<note><strong>0</strong>: Anybody can subscribe.</note><note><strong>1</strong>: Any new subscription should be confirmed by the owner.</note><note><strong>2</strong>: Any new subscription should be confirmed by the owner and the subscriber.</note>",
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
            "Mailing List"
          ],
          "operation": [
            "Update Mailing List Parameters"
          ]
        }
      },
      "options": [
        {
          "displayName": "Goodbye Message",
          "name": "body_goodbye_message",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Lang",
          "name": "body_lang",
          "type": "options",
          "default": "",
          "description": "Current language preference code.<note><strong>de</strong>: German language.</note><note><strong>en</strong>: English language.</note><note><strong>es</strong>: Spanish language.</note><note><strong>fr</strong>: French language.</note><note><strong>it</strong>: Italian language.</note>",
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
          "displayName": "Welcome Message",
          "name": "body_welcome_message",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Delete A Mailing List"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mailing List Name",
      "name": "path_mailing_list_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Delete A Mailing List"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Send A Mail Through A Mailing List"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mailing List Name",
      "name": "path_mailing_list_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Send A Mail Through A Mailing List"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "From",
      "name": "body_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Send A Mail Through A Mailing List"
          ]
        }
      },
      "required": true,
      "description": "The email from where the mail is sent to the concerned mailing list"
    },
    {
      "displayName": "Message",
      "name": "body_message",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Send A Mail Through A Mailing List"
          ]
        }
      },
      "required": true,
      "description": "The email message"
    },
    {
      "displayName": "Subject",
      "name": "body_subject",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Send A Mail Through A Mailing List"
          ]
        }
      },
      "required": true,
      "description": "The email subject"
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Generate A Form For A Mailing List"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mailing List Name",
      "name": "path_mailing_list_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Generate A Form For A Mailing List"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Subscribe Submit",
      "name": "body_subscribe_submit",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Generate A Form For A Mailing List"
          ]
        }
      },
      "required": true,
      "description": "Text on the subscription form button"
    },
    {
      "displayName": "Unsubscribe Submit",
      "name": "body_unsubscribe_submit",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Generate A Form For A Mailing List"
          ]
        }
      },
      "required": true,
      "description": "Text on the unsubscription form button"
    },
    {
      "displayName": "Url After Subscription",
      "name": "body_url_after_subscription",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Generate A Form For A Mailing List"
          ]
        }
      },
      "required": true,
      "description": "Redirection link that can be applied after subscription"
    },
    {
      "displayName": "Url After Unsubscription",
      "name": "body_url_after_unsubscription",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List"
          ],
          "operation": [
            "Generate A Form For A Mailing List"
          ]
        }
      },
      "required": true,
      "description": "Redirection link that can be applied after unsubscription"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List > Subscribers"
          ]
        }
      },
      "options": [
        {
          "name": "All Subscribers",
          "value": "All Subscribers"
        },
        {
          "name": "Add A New Subscriber",
          "value": "Add A New Subscriber"
        },
        {
          "name": "Update Subscriber Parameters/details",
          "value": "Update Subscriber Parameters/details"
        },
        {
          "name": "Remove A Subscriber",
          "value": "Remove A Subscriber"
        },
        {
          "name": "Import Subscribers",
          "value": "Import Subscribers"
        }
      ],
      "default": "All Subscribers",
      "noDataExpression": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List > Subscribers"
          ],
          "operation": [
            "All Subscribers"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mailing List Name",
      "name": "path_mailing_list_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List > Subscribers"
          ],
          "operation": [
            "All Subscribers"
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
            "Mailing List > Subscribers"
          ],
          "operation": [
            "All Subscribers"
          ]
        }
      },
      "options": [
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
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List > Subscribers"
          ],
          "operation": [
            "Add A New Subscriber"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mailing List Name",
      "name": "path_mailing_list_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List > Subscribers"
          ],
          "operation": [
            "Add A New Subscriber"
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
            "Mailing List > Subscribers"
          ],
          "operation": [
            "Add A New Subscriber"
          ]
        }
      },
      "required": true,
      "description": "Email"
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List > Subscribers"
          ],
          "operation": [
            "Update Subscriber Parameters/details"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mailing List Name",
      "name": "path_mailing_list_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List > Subscribers"
          ],
          "operation": [
            "Update Subscriber Parameters/details"
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
            "Mailing List > Subscribers"
          ],
          "operation": [
            "Update Subscriber Parameters/details"
          ]
        }
      },
      "required": true,
      "description": "The email that identifies the subscriber."
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
            "Mailing List > Subscribers"
          ],
          "operation": [
            "Update Subscriber Parameters/details"
          ]
        }
      },
      "options": [
        {
          "displayName": "New Email",
          "name": "body_new_email",
          "type": "string",
          "default": "",
          "description": "The new email for the specified subscriber."
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List > Subscribers"
          ],
          "operation": [
            "Remove A Subscriber"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mailing List Name",
      "name": "path_mailing_list_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List > Subscribers"
          ],
          "operation": [
            "Remove A Subscriber"
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
            "Mailing List > Subscribers"
          ],
          "operation": [
            "Remove A Subscriber"
          ]
        }
      },
      "options": [
        {
          "displayName": "Emails",
          "name": "body_emails",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List > Subscribers"
          ],
          "operation": [
            "Import Subscribers"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mailing List Name",
      "name": "path_mailing_list_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List > Subscribers"
          ],
          "operation": [
            "Import Subscribers"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Datas",
      "name": "body_datas",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Mailing List > Subscribers"
          ],
          "operation": [
            "Import Subscribers"
          ]
        }
      },
      "required": true,
      "description": "The list of new subscribers email. The format should be email address, name each subscriber separated by a back to line"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Auto Reply"
          ]
        }
      },
      "options": [
        {
          "name": "List Auto Replies",
          "value": "List Auto Replies"
        },
        {
          "name": "Create Auto Reply",
          "value": "Create Auto Reply"
        },
        {
          "name": "Show A Specific Auto Reply",
          "value": "Show A Specific Auto Reply"
        },
        {
          "name": "Update Auto Reply",
          "value": "Update Auto Reply"
        },
        {
          "name": "Delete Auto Reply",
          "value": "Delete Auto Reply"
        }
      ],
      "default": "List Auto Replies",
      "noDataExpression": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Auto Reply"
          ],
          "operation": [
            "List Auto Replies"
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
            "Service Mail > Auto Reply"
          ],
          "operation": [
            "List Auto Replies"
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
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Auto Reply"
          ],
          "operation": [
            "Create Auto Reply"
          ]
        }
      },
      "required": true,
      "description": "ServiceMail identifier"
    },
    {
      "displayName": "Is Recurrent",
      "name": "body_is_recurrent",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Auto Reply"
          ],
          "operation": [
            "Create Auto Reply"
          ]
        }
      },
      "required": true,
      "description": "Define if the responder should be activate for some days in the week instead of a certain time"
    },
    {
      "displayName": "Message",
      "name": "body_message",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Auto Reply"
          ],
          "operation": [
            "Create Auto Reply"
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
            "Service Mail > Auto Reply"
          ],
          "operation": [
            "Create Auto Reply"
          ]
        }
      },
      "required": true,
      "description": "Name of the resource `{name}`"
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
            "Service Mail > Auto Reply"
          ],
          "operation": [
            "Create Auto Reply"
          ]
        }
      },
      "options": [
        {
          "displayName": "Dont Reply To",
          "name": "body_dont_reply_to",
          "type": "json",
          "default": {},
          "description": "List of emails the auto reply won't respond to"
        },
        {
          "displayName": "Ended At",
          "name": "body_ended_at",
          "type": "number",
          "default": 0,
          "description": "When should end the auto reply activation"
        },
        {
          "displayName": "Is Visible",
          "name": "body_is_visible",
          "type": "boolean",
          "default": false,
          "description": "Define if the attributes is visible for all the users"
        },
        {
          "displayName": "Recurrent Days",
          "name": "body_recurrent_days",
          "type": "json",
          "default": {},
          "description": "List of the days when the auto reply is activated"
        },
        {
          "displayName": "Started At",
          "name": "body_started_at",
          "type": "number",
          "default": 0,
          "description": "When the responder start to be active"
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Auto Reply"
          ],
          "operation": [
            "Show A Specific Auto Reply"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Auto Reply Id",
      "name": "path_auto_reply_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Auto Reply"
          ],
          "operation": [
            "Show A Specific Auto Reply"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Auto Reply"
          ],
          "operation": [
            "Update Auto Reply"
          ]
        }
      },
      "required": true,
      "description": "ServiceMail identifier"
    },
    {
      "displayName": "Auto Reply Id",
      "name": "path_auto_reply_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Auto Reply"
          ],
          "operation": [
            "Update Auto Reply"
          ]
        }
      },
      "required": true,
      "description": "ServiceMailAutoReply identifier"
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
            "Service Mail > Auto Reply"
          ],
          "operation": [
            "Update Auto Reply"
          ]
        }
      },
      "options": [
        {
          "displayName": "Dont Reply To",
          "name": "body_dont_reply_to",
          "type": "json",
          "default": {},
          "description": "List of emails the auto reply won't respond to"
        },
        {
          "displayName": "Ended At",
          "name": "body_ended_at",
          "type": "number",
          "default": 0,
          "description": "When should end the auto reply activation"
        },
        {
          "displayName": "Is Recurrent",
          "name": "body_is_recurrent",
          "type": "boolean",
          "default": false,
          "description": "Define if the responder should be activate for some days in the week instead of a certain time"
        },
        {
          "displayName": "Is Visible",
          "name": "body_is_visible",
          "type": "boolean",
          "default": false,
          "description": "Define if the attributes is visible for all the users"
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
          "displayName": "Recurrent Days",
          "name": "body_recurrent_days",
          "type": "json",
          "default": {},
          "description": "List of the days when the auto reply is activated"
        },
        {
          "displayName": "Started At",
          "name": "body_started_at",
          "type": "number",
          "default": 0,
          "description": "When the responder start to be active"
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Auto Reply"
          ],
          "operation": [
            "Delete Auto Reply"
          ]
        }
      },
      "required": true,
      "description": "ServiceMail identifier"
    },
    {
      "displayName": "Auto Reply Id",
      "name": "path_auto_reply_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Auto Reply"
          ],
          "operation": [
            "Delete Auto Reply"
          ]
        }
      },
      "required": true,
      "description": "Auto reply identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Bimi"
          ]
        }
      },
      "options": [
        {
          "name": "Create/Update Bimi",
          "value": "Create/Update Bimi"
        }
      ],
      "default": "Create/Update Bimi",
      "noDataExpression": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Bimi"
          ],
          "operation": [
            "Create/Update Bimi"
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
            "Service Mail > Bimi"
          ],
          "operation": [
            "Create/Update Bimi"
          ]
        }
      },
      "options": [
        {
          "displayName": "Link Logo",
          "name": "body_link_logo",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Link Vmc",
          "name": "body_link_vmc",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Logo",
          "name": "body_logo",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Vmc",
          "name": "body_vmc",
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
            "Service Mail > Filters Models"
          ]
        }
      },
      "options": [
        {
          "name": "List Filters Model",
          "value": "List Filters Model"
        },
        {
          "name": "Create A Filter Model",
          "value": "Create A Filter Model"
        },
        {
          "name": "Show A Filter Model",
          "value": "Show A Filter Model"
        },
        {
          "name": "Update A Filter Model",
          "value": "Update A Filter Model"
        },
        {
          "name": "Delete A Filter Model",
          "value": "Delete A Filter Model"
        }
      ],
      "default": "List Filters Model",
      "noDataExpression": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Filters Models"
          ],
          "operation": [
            "List Filters Model"
          ]
        }
      },
      "required": true,
      "description": "ServiceMail identifier"
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Filters Models"
          ],
          "operation": [
            "Create A Filter Model"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Is Visible",
      "name": "body_is_visible",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Filters Models"
          ],
          "operation": [
            "Create A Filter Model"
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
            "Service Mail > Filters Models"
          ],
          "operation": [
            "Create A Filter Model"
          ]
        }
      },
      "required": true,
      "description": "Name of the resource `{name}`"
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
            "Service Mail > Filters Models"
          ],
          "operation": [
            "Create A Filter Model"
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
          "displayName": "Conditions",
          "name": "body_conditions",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Has All Conditions",
          "name": "body_has_all_conditions",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Script",
          "name": "body_script",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Filters Models"
          ],
          "operation": [
            "Show A Filter Model"
          ]
        }
      },
      "required": true,
      "description": "The identifier of the concerned mail service"
    },
    {
      "displayName": "Filter Id",
      "name": "path_filter_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Filters Models"
          ],
          "operation": [
            "Show A Filter Model"
          ]
        }
      },
      "required": true,
      "description": "The identifier of the concerned filter"
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Filters Models"
          ],
          "operation": [
            "Update A Filter Model"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Filter Id",
      "name": "path_filter_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Filters Models"
          ],
          "operation": [
            "Update A Filter Model"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Is Visible",
      "name": "body_is_visible",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Filters Models"
          ],
          "operation": [
            "Update A Filter Model"
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
            "Service Mail > Filters Models"
          ],
          "operation": [
            "Update A Filter Model"
          ]
        }
      },
      "required": true,
      "description": "Name of the resource `{name}`"
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
            "Service Mail > Filters Models"
          ],
          "operation": [
            "Update A Filter Model"
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
          "displayName": "Conditions",
          "name": "body_conditions",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Has All Conditions",
          "name": "body_has_all_conditions",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Script",
          "name": "body_script",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Filters Models"
          ],
          "operation": [
            "Delete A Filter Model"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Filter Id",
      "name": "path_filter_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Filters Models"
          ],
          "operation": [
            "Delete A Filter Model"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "body_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Filters Models"
          ],
          "operation": [
            "Delete A Filter Model"
          ]
        }
      },
      "required": true,
      "description": "ServiceMail identifier"
    },
    {
      "displayName": "Filter Id",
      "name": "body_filter_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Filters Models"
          ],
          "operation": [
            "Delete A Filter Model"
          ]
        }
      },
      "required": true,
      "description": "Sieve filter identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Preferences"
          ]
        }
      },
      "options": [
        {
          "name": "List Preferences",
          "value": "List Preferences"
        },
        {
          "name": "Update Preferences",
          "value": "Update Preferences"
        }
      ],
      "default": "List Preferences",
      "noDataExpression": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Preferences"
          ],
          "operation": [
            "List Preferences"
          ]
        }
      },
      "required": true,
      "description": "ServiceMail identifier"
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Preferences"
          ],
          "operation": [
            "Update Preferences"
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
            "Service Mail > Preferences"
          ],
          "operation": [
            "Update Preferences"
          ]
        }
      },
      "options": [
        {
          "displayName": "Authorized Senders",
          "name": "body_authorized_senders",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Blocked Senders",
          "name": "body_blocked_senders",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Default Permission",
          "name": "body_default_permission",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Dkim Enabled",
          "name": "body_dkim_enabled",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "External Mail Flag Enabled",
          "name": "body_external_mail_flag_enabled",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Promotion Filter Enabled",
          "name": "body_promotion_filter_enabled",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Spam Filter Enabled",
          "name": "body_spam_filter_enabled",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Default Permissions",
          "name": "body_default_permissions",
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
            "Service Mail > Redirections"
          ]
        }
      },
      "options": [
        {
          "name": "List Redirections",
          "value": "List Redirections"
        },
        {
          "name": "Create Redirection",
          "value": "Create Redirection"
        },
        {
          "name": "Show Details",
          "value": "Show Details"
        },
        {
          "name": "Update Redirection",
          "value": "Update Redirection"
        },
        {
          "name": "Delete Redirection",
          "value": "Delete Redirection"
        },
        {
          "name": "Enable Redirection",
          "value": "Enable Redirection"
        },
        {
          "name": "Send Confirmation Request",
          "value": "Send Confirmation Request"
        }
      ],
      "default": "List Redirections",
      "noDataExpression": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Redirections"
          ],
          "operation": [
            "List Redirections"
          ]
        }
      },
      "required": true,
      "description": "ServiceMail identifier"
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
            "Service Mail > Redirections"
          ],
          "operation": [
            "List Redirections"
          ]
        }
      },
      "options": [
        {
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "created_at",
              "value": "created_at"
            },
            {
              "name": "id",
              "value": "id"
            },
            {
              "name": "name",
              "value": "name"
            },
            {
              "name": "send_confirmation_requests_enabled",
              "value": "send_confirmation_requests_enabled"
            },
            {
              "name": "send_confirmation_requests_state",
              "value": "send_confirmation_requests_state"
            },
            {
              "name": "state",
              "value": "state"
            },
            {
              "name": "updated_at",
              "value": "updated_at"
            }
          ]
        },
        {
          "displayName": "Order Dir",
          "name": "query_order_dir",
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
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Redirections"
          ],
          "operation": [
            "Create Redirection"
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
            "Service Mail > Redirections"
          ],
          "operation": [
            "Create Redirection"
          ]
        }
      },
      "required": true,
      "description": "The name of the redirection, where the emails should be sent."
    },
    {
      "displayName": "Targets",
      "name": "body_targets",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Redirections"
          ],
          "operation": [
            "Create Redirection"
          ]
        }
      },
      "required": true,
      "description": "Emails that should receive the mail that are redirected"
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Redirections"
          ],
          "operation": [
            "Show Details"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Redirection Id",
      "name": "path_redirection_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Redirections"
          ],
          "operation": [
            "Show Details"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Redirections"
          ],
          "operation": [
            "Update Redirection"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Redirection Id",
      "name": "path_redirection_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Redirections"
          ],
          "operation": [
            "Update Redirection"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Targets",
      "name": "body_targets",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Redirections"
          ],
          "operation": [
            "Update Redirection"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Redirections"
          ],
          "operation": [
            "Delete Redirection"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Redirection Id",
      "name": "path_redirection_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Redirections"
          ],
          "operation": [
            "Delete Redirection"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Redirections"
          ],
          "operation": [
            "Enable Redirection"
          ]
        }
      },
      "required": true,
      "description": "The mail service identifier"
    },
    {
      "displayName": "Redirection Id",
      "name": "path_redirection_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Redirections"
          ],
          "operation": [
            "Enable Redirection"
          ]
        }
      },
      "required": true,
      "description": "The redirection identifier"
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Redirections"
          ],
          "operation": [
            "Send Confirmation Request"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Redirection Id",
      "name": "path_redirection_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Redirections"
          ],
          "operation": [
            "Send Confirmation Request"
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
            "Service Mail > Redirections > Target"
          ]
        }
      },
      "options": [
        {
          "name": "Get All Targets",
          "value": "Get All Targets"
        },
        {
          "name": "Add New Target",
          "value": "Add New Target"
        },
        {
          "name": "Remove A Target",
          "value": "Remove A Target"
        },
        {
          "name": "Resend Confirmation Email",
          "value": "Resend Confirmation Email"
        }
      ],
      "default": "Get All Targets",
      "noDataExpression": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Redirections > Target"
          ],
          "operation": [
            "Get All Targets"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Redirection Id",
      "name": "path_redirection_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Redirections > Target"
          ],
          "operation": [
            "Get All Targets"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Redirections > Target"
          ],
          "operation": [
            "Add New Target"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Redirection Id",
      "name": "path_redirection_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Redirections > Target"
          ],
          "operation": [
            "Add New Target"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Address",
      "name": "body_address",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Redirections > Target"
          ],
          "operation": [
            "Add New Target"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Redirections > Target"
          ],
          "operation": [
            "Remove A Target"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Redirection Id",
      "name": "path_redirection_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Redirections > Target"
          ],
          "operation": [
            "Remove A Target"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Redirections > Target"
          ],
          "operation": [
            "Resend Confirmation Email"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Redirection Id",
      "name": "path_redirection_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Redirections > Target"
          ],
          "operation": [
            "Resend Confirmation Email"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Target Id",
      "name": "path_target_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Redirections > Target"
          ],
          "operation": [
            "Resend Confirmation Email"
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
            "Service Mail > Signatures Templates"
          ]
        }
      },
      "options": [
        {
          "name": "List All Templates",
          "value": "List All Templates"
        },
        {
          "name": "Create A Template",
          "value": "Create A Template"
        },
        {
          "name": "Upload Image",
          "value": "Upload Image"
        },
        {
          "name": "Create A Signature For All Users",
          "value": "Create A Signature For All Users"
        },
        {
          "name": "Show Default",
          "value": "Show Default"
        },
        {
          "name": "Show A Signature Template",
          "value": "Show A Signature Template"
        },
        {
          "name": "Update",
          "value": "Update"
        },
        {
          "name": "Delete",
          "value": "Delete"
        }
      ],
      "default": "List All Templates",
      "noDataExpression": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Signatures Templates"
          ],
          "operation": [
            "List All Templates"
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
            "Service Mail > Signatures Templates"
          ],
          "operation": [
            "List All Templates"
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
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Signatures Templates"
          ],
          "operation": [
            "Create A Template"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Content",
      "name": "body_content",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Signatures Templates"
          ],
          "operation": [
            "Create A Template"
          ]
        }
      },
      "required": true,
      "description": "The HTML content that describes the email signature"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Signatures Templates"
          ],
          "operation": [
            "Create A Template"
          ]
        }
      },
      "required": true,
      "description": "Name of the resource `{name}`"
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
            "Service Mail > Signatures Templates"
          ],
          "operation": [
            "Create A Template"
          ]
        }
      },
      "options": [
        {
          "displayName": "Attributes",
          "name": "body_attributes",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Create Signatures",
          "name": "body_create_signatures",
          "type": "boolean",
          "default": false,
          "description": "Indicates if the signature should be created for all the users of the mail service."
        },
        {
          "displayName": "Created By",
          "name": "body_created_by",
          "type": "number",
          "default": 0,
          "description": " The identifier of the creator of the signature template."
        },
        {
          "displayName": "Form Data",
          "name": "body_form_data",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Name Format",
          "name": "body_name_format",
          "type": "options",
          "default": "",
          "description": "Describes the format in which the name should be displayed.<note><strong>first_last</strong>: First_last.</note><note><strong>first_only</strong>: First_only.</note><note><strong>last_first</strong>: Last_first.</note><note><strong>last_only</strong>: Last_only.</note>",
          "options": [
            {
              "name": "first_last",
              "value": "first_last"
            },
            {
              "name": "first_only",
              "value": "first_only"
            },
            {
              "name": "last_first",
              "value": "last_first"
            },
            {
              "name": "last_only",
              "value": "last_only"
            }
          ]
        },
        {
          "displayName": "Notify",
          "name": "body_notify",
          "type": "boolean",
          "default": false,
          "description": "Indicates if the notification should be sent for all users of the mail service."
        },
        {
          "displayName": "Position",
          "name": "body_position",
          "type": "options",
          "default": "",
          "description": "Specifies the position of the signature in an email. The signature can be placed either at the top or at the bottom of the email content.<note><strong>bottom</strong>: The signature is placed at the bottom of the email.</note><note><strong>top</strong>: The signature is placed at the top of the email.</note>",
          "options": [
            {
              "name": "bottom",
              "value": "bottom"
            },
            {
              "name": "top",
              "value": "top"
            }
          ]
        },
        {
          "displayName": "Status",
          "name": "body_status",
          "type": "options",
          "default": "",
          "description": "Specifies the current status of the signature template. The signature can either be enabled and ready for use, or in draft mode awaiting validation.<note><strong>draft</strong>: The signature is in draft mode and cannot be used until it has been validated.</note><note><strong>enabled</strong>: The signature is enabled and available for use in emails.</note>",
          "options": [
            {
              "name": "draft",
              "value": "draft"
            },
            {
              "name": "enabled",
              "value": "enabled"
            }
          ]
        },
        {
          "displayName": "Substitutions",
          "name": "body_substitutions",
          "type": "json",
          "default": {},
          "description": " These values are used to define an HTML template with placeholder values for fields that require multiple substitutions."
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Signatures Templates"
          ],
          "operation": [
            "Upload Image"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Image",
      "name": "body_image",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Signatures Templates"
          ],
          "operation": [
            "Upload Image"
          ]
        }
      },
      "required": true,
      "description": "Base64 image content (png,jpg,jpeg,svg or gif MIME type)"
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Signatures Templates"
          ],
          "operation": [
            "Create A Signature For All Users"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Signature Template",
      "name": "path_signature_template",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Signatures Templates"
          ],
          "operation": [
            "Create A Signature For All Users"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Signatures Templates"
          ],
          "operation": [
            "Show Default"
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
            "Service Mail > Signatures Templates"
          ],
          "operation": [
            "Show Default"
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
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Signatures Templates"
          ],
          "operation": [
            "Show A Signature Template"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Signature Template",
      "name": "path_signature_template",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Signatures Templates"
          ],
          "operation": [
            "Show A Signature Template"
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
            "Service Mail > Signatures Templates"
          ],
          "operation": [
            "Show A Signature Template"
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
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Signatures Templates"
          ],
          "operation": [
            "Update"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Signature Template",
      "name": "path_signature_template",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Signatures Templates"
          ],
          "operation": [
            "Update"
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
            "Service Mail > Signatures Templates"
          ],
          "operation": [
            "Update"
          ]
        }
      },
      "options": [
        {
          "displayName": "Attributes",
          "name": "body_attributes",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Content",
          "name": "body_content",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Default",
          "name": "body_default",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Form Data",
          "name": "body_form_data",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Is Default",
          "name": "body_is_default",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "Name of the resource `{name}`"
        },
        {
          "displayName": "Name Format",
          "name": "body_name_format",
          "type": "options",
          "default": "",
          "description": "Describes the format in which the name should be displayed.<note><strong>first_last</strong>: First_last.</note><note><strong>first_only</strong>: First_only.</note><note><strong>last_first</strong>: Last_first.</note><note><strong>last_only</strong>: Last_only.</note>",
          "options": [
            {
              "name": "first_last",
              "value": "first_last"
            },
            {
              "name": "first_only",
              "value": "first_only"
            },
            {
              "name": "last_first",
              "value": "last_first"
            },
            {
              "name": "last_only",
              "value": "last_only"
            }
          ]
        },
        {
          "displayName": "Notify",
          "name": "body_notify",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Position",
          "name": "body_position",
          "type": "options",
          "default": "",
          "description": "Specifies the position of the signature in an email. The signature can be placed either at the top or at the bottom of the email content.<note><strong>bottom</strong>: The signature is placed at the bottom of the email.</note><note><strong>top</strong>: The signature is placed at the top of the email.</note>",
          "options": [
            {
              "name": "bottom",
              "value": "bottom"
            },
            {
              "name": "top",
              "value": "top"
            }
          ]
        },
        {
          "displayName": "Status",
          "name": "body_status",
          "type": "options",
          "default": "",
          "description": "Specifies the current status of the signature template. The signature can either be enabled and ready for use, or in draft mode awaiting validation.<note><strong>draft</strong>: The signature is in draft mode and cannot be used until it has been validated.</note><note><strong>enabled</strong>: The signature is enabled and available for use in emails.</note>",
          "options": [
            {
              "name": "draft",
              "value": "draft"
            },
            {
              "name": "enabled",
              "value": "enabled"
            }
          ]
        },
        {
          "displayName": "Substitutions",
          "name": "body_substitutions",
          "type": "json",
          "default": {},
          "description": " These values are used to define an HTML template with placeholder values for fields that require multiple substitutions."
        }
      ]
    },
    {
      "displayName": "Mail Hosting Id",
      "name": "path_mail_hosting_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Signatures Templates"
          ],
          "operation": [
            "Delete"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Signature Template",
      "name": "path_signature_template",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Service Mail > Signatures Templates"
          ],
          "operation": [
            "Delete"
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
            "Mailbox Management",
            "Mailboxes > Accesses > Devices",
            "Mailboxes > Accesses > Devices",
            "Mailboxes > Accesses > Devices",
            "Mailboxes > Accesses > Devices",
            "Mailboxes > Accesses > Webmail",
            "Mailboxes > Accesses > Webmail",
            "Mailboxes > Accesses > Webmail",
            "Mailboxes > Accesses > Webmail",
            "Mailing List > Subscribers",
            "Service Mail > Signatures Templates"
          ],
          "operation": [
            "List Mailboxes",
            "List Device Access",
            "List Device Access For A User",
            "List Device By User",
            "List Device",
            "List User Access And Invitations",
            "List Users Having Access",
            "List Of User Accesses For The Current User",
            "List Of User Accesses For A Account And A User",
            "All Subscribers",
            "List All Templates"
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
            "Mailbox Management",
            "Mailboxes > Accesses > Devices",
            "Mailboxes > Accesses > Devices",
            "Mailboxes > Accesses > Devices",
            "Mailboxes > Accesses > Devices",
            "Mailboxes > Accesses > Webmail",
            "Mailboxes > Accesses > Webmail",
            "Mailboxes > Accesses > Webmail",
            "Mailboxes > Accesses > Webmail",
            "Mailing List > Subscribers",
            "Service Mail > Signatures Templates"
          ],
          "operation": [
            "List Mailboxes",
            "List Device Access",
            "List Device Access For A User",
            "List Device By User",
            "List Device",
            "List User Access And Invitations",
            "List Users Having Access",
            "List Of User Accesses For The Current User",
            "List Of User Accesses For A Account And A User",
            "All Subscribers",
            "List All Templates"
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
