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
  "Actions": {
    "GET /1/actions": {
      "method": "GET",
      "path": "/1/actions",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/actions/{action_id}": {
      "method": "GET",
      "path": "/1/actions/{action_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "action_id",
          "field": "path_action_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "App Information": {
    "GET /1/app-information/applications": {
      "method": "GET",
      "path": "/1/app-information/applications",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/app-information/applications/{application}": {
      "method": "GET",
      "path": "/1/app-information/applications/{application}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "application",
          "field": "path_application"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/app-information/versions": {
      "method": "GET",
      "path": "/1/app-information/versions",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/app-information/versions/{appStore}": {
      "method": "GET",
      "path": "/1/app-information/versions/{appStore}",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/app-information/versions/{appStore}/{appPlatform}/{appName}": {
      "method": "GET",
      "path": "/1/app-information/versions/{appStore}/{appPlatform}/{appName}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "appStore",
          "field": "path_appStore"
        },
        {
          "name": "appPlatform",
          "field": "path_appPlatform"
        },
        {
          "name": "appName",
          "field": "path_appName"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Countries": {
    "GET /1/countries": {
      "method": "GET",
      "path": "/1/countries",
      "pagination": "limit-skip",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/countries/{country_id}": {
      "method": "GET",
      "path": "/1/countries/{country_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "country_id",
          "field": "path_country_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Events": {
    "GET /2/events": {
      "method": "GET",
      "path": "/2/events",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/events/{event_id}": {
      "method": "GET",
      "path": "/2/events/{event_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "event_id",
          "field": "path_event_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Events > Public Cloud Status": {
    "GET /2/events/public-cloud-status": {
      "method": "GET",
      "path": "/2/events/public-cloud-status",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Languages": {
    "GET /1/languages": {
      "method": "GET",
      "path": "/1/languages",
      "pagination": "limit-skip",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/languages/{language_id}": {
      "method": "GET",
      "path": "/1/languages/{language_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "language_id",
          "field": "path_language_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "My kSuite": {
    "GET /1/my_ksuite/{my_k_suite_id}": {
      "method": "GET",
      "path": "/1/my_ksuite/{my_k_suite_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "my_k_suite_id",
          "field": "path_my_k_suite_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/my_ksuite/current": {
      "method": "GET",
      "path": "/1/my_ksuite/current",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "My kSuite > Product management": {
    "POST /1/my_ksuite/{my_k_suite_id}/cancel_unsubscribe": {
      "method": "POST",
      "path": "/1/my_ksuite/{my_k_suite_id}/cancel_unsubscribe",
      "pagination": "none",
      "pathParams": [
        {
          "name": "my_k_suite_id",
          "field": "path_my_k_suite_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Products": {
    "GET /1/products": {
      "method": "GET",
      "path": "/1/products",
      "pagination": "limit-skip",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Profile": {
    "POST /2/profile/avatar": {
      "method": "POST",
      "path": "/2/profile/avatar",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "avatar",
          "field": "body_avatar"
        },
        {
          "name": "encoding",
          "field": "body_encoding"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /2/profile/avatar": {
      "method": "DELETE",
      "path": "/2/profile/avatar",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/profile": {
      "method": "GET",
      "path": "/2/profile",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PATCH /2/profile": {
      "method": "PATCH",
      "path": "/2/profile",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "birth_at",
          "field": "body_birth_at"
        },
        {
          "name": "country_id",
          "field": "body_country_id"
        },
        {
          "name": "current_account_id",
          "field": "body_current_account_id"
        },
        {
          "name": "current_password",
          "field": "body_current_password"
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
          "name": "keep_session_ids",
          "field": "body_keep_session_ids"
        },
        {
          "name": "language_id",
          "field": "body_language_id"
        },
        {
          "name": "lastname",
          "field": "body_lastname"
        },
        {
          "name": "locale",
          "field": "body_locale"
        },
        {
          "name": "password",
          "field": "body_password"
        },
        {
          "name": "reminder_email",
          "field": "body_reminder_email"
        },
        {
          "name": "reminder_phone",
          "field": "body_reminder_phone"
        },
        {
          "name": "successful_connexion_notification",
          "field": "body_successful_connexion_notification"
        },
        {
          "name": "timezone",
          "field": "body_timezone"
        },
        {
          "name": "timezone_id",
          "field": "body_timezone_id"
        },
        {
          "name": "unsuccessful_connexion_limit",
          "field": "body_unsuccessful_connexion_limit"
        },
        {
          "name": "unsuccessful_connexion_notification",
          "field": "body_unsuccessful_connexion_notification"
        },
        {
          "name": "unsuccessful_connexion_rate_limit",
          "field": "body_unsuccessful_connexion_rate_limit"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Profile > Applications Passwords": {
    "GET /2/profile/applications/passwords": {
      "method": "GET",
      "path": "/2/profile/applications/passwords",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/profile/applications/passwords": {
      "method": "POST",
      "path": "/2/profile/applications/passwords",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/profile/applications/passwords/{password_id}": {
      "method": "GET",
      "path": "/2/profile/applications/passwords/{password_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "password_id",
          "field": "path_password_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Profile > Emails": {
    "GET /2/profile/emails": {
      "method": "GET",
      "path": "/2/profile/emails",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/profile/emails/{email_type}/{email_id}": {
      "method": "GET",
      "path": "/2/profile/emails/{email_type}/{email_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "email_type",
          "field": "path_email_type"
        },
        {
          "name": "email_id",
          "field": "path_email_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /2/profile/emails/{email_type}/{email_id}": {
      "method": "DELETE",
      "path": "/2/profile/emails/{email_type}/{email_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "email_type",
          "field": "path_email_type"
        },
        {
          "name": "email_id",
          "field": "path_email_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Profile > Phones": {
    "GET /2/profile/phones": {
      "method": "GET",
      "path": "/2/profile/phones",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/profile/phones/{phone_id}": {
      "method": "GET",
      "path": "/2/profile/phones/{phone_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "phone_id",
          "field": "path_phone_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /2/profile/phones/{phone_id}": {
      "method": "DELETE",
      "path": "/2/profile/phones/{phone_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "phone_id",
          "field": "path_phone_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Tasks": {
    "GET /1/async/tasks": {
      "method": "GET",
      "path": "/1/async/tasks",
      "pagination": "limit-skip",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/async/tasks/{task_uuid}": {
      "method": "GET",
      "path": "/1/async/tasks/{task_uuid}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "task_uuid",
          "field": "path_task_uuid"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Timezones": {
    "GET /1/timezones": {
      "method": "GET",
      "path": "/1/timezones",
      "pagination": "limit-skip",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/timezones/{timezone_id}": {
      "method": "GET",
      "path": "/1/timezones/{timezone_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "timezone_id",
          "field": "path_timezone_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "User Management": {
    "POST /1/accounts/{account}/invitations": {
      "method": "POST",
      "path": "/1/accounts/{account}/invitations",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "email",
          "field": "body_email"
        },
        {
          "name": "first_name",
          "field": "body_first_name"
        },
        {
          "name": "last_name",
          "field": "body_last_name"
        },
        {
          "name": "locale",
          "field": "body_locale"
        },
        {
          "name": "notifications",
          "field": "body_notifications"
        },
        {
          "name": "permissions",
          "field": "body_permissions"
        },
        {
          "name": "role_type",
          "field": "body_role_type"
        },
        {
          "name": "silent",
          "field": "body_silent"
        },
        {
          "name": "strict",
          "field": "body_strict"
        },
        {
          "name": "teams",
          "field": "body_teams"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /1/accounts/{account}/invitations/{invitation}": {
      "method": "DELETE",
      "path": "/1/accounts/{account}/invitations/{invitation}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        },
        {
          "name": "invitation",
          "field": "path_invitation"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "User Management > Accounts": {
    "GET /1/accounts": {
      "method": "GET",
      "path": "/1/accounts",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/accounts/{account_id}": {
      "method": "GET",
      "path": "/1/accounts/{account_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account_id",
          "field": "path_account_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/accounts/{account_id}/tags": {
      "method": "GET",
      "path": "/1/accounts/{account_id}/tags",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account_id",
          "field": "path_account_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/accounts/{account_id}/products": {
      "method": "GET",
      "path": "/1/accounts/{account_id}/products",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account_id",
          "field": "path_account_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/accounts/{account_id}/services": {
      "method": "GET",
      "path": "/1/accounts/{account_id}/services",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account_id",
          "field": "path_account_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/accounts/current/products": {
      "method": "GET",
      "path": "/1/accounts/current/products",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/accounts/{account_id}/basic/teams": {
      "method": "GET",
      "path": "/1/accounts/{account_id}/basic/teams",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account_id",
          "field": "path_account_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/accounts/{account}/users": {
      "method": "GET",
      "path": "/2/accounts/{account}/users",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/accounts/{account}/users/{user}/app_accesses": {
      "method": "GET",
      "path": "/2/accounts/{account}/users/{user}/app_accesses",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        },
        {
          "name": "user",
          "field": "path_user"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "User Management > Accounts > Invitations": {
    "GET /1/accounts/{account}/invitations/{invitation}": {
      "method": "GET",
      "path": "/1/accounts/{account}/invitations/{invitation}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        },
        {
          "name": "invitation",
          "field": "path_invitation"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PATCH /1/accounts/{account}/invitations/{invitation}": {
      "method": "PATCH",
      "path": "/1/accounts/{account}/invitations/{invitation}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        },
        {
          "name": "invitation",
          "field": "path_invitation"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "has_billing",
          "field": "body_has_billing"
        },
        {
          "name": "has_billing_mailing",
          "field": "body_has_billing_mailing"
        },
        {
          "name": "has_mailing",
          "field": "body_has_mailing"
        },
        {
          "name": "language_id",
          "field": "body_language_id"
        },
        {
          "name": "permissions",
          "field": "body_permissions"
        },
        {
          "name": "role_type",
          "field": "body_role_type"
        },
        {
          "name": "team_ids",
          "field": "body_team_ids"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /1/accounts/{account}/invitations/users/{user}": {
      "method": "GET",
      "path": "/1/accounts/{account}/invitations/users/{user}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        },
        {
          "name": "user",
          "field": "path_user"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "User Management > Accounts > Invitations > B2B": {
    "GET /1/accounts/{account}/invitations/{invitation}/b2b": {
      "method": "GET",
      "path": "/1/accounts/{account}/invitations/{invitation}/b2b",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        },
        {
          "name": "invitation",
          "field": "path_invitation"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/accounts/{account}/invitations/{invitation}/b2b": {
      "method": "POST",
      "path": "/1/accounts/{account}/invitations/{invitation}/b2b",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        },
        {
          "name": "invitation",
          "field": "path_invitation"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "partnership_ids",
          "field": "body_partnership_ids"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/accounts/{account}/invitations/{invitation}/b2b/{partnership_id}": {
      "method": "DELETE",
      "path": "/1/accounts/{account}/invitations/{invitation}/b2b/{partnership_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        },
        {
          "name": "invitation",
          "field": "path_invitation"
        },
        {
          "name": "partnership_id",
          "field": "path_partnership_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "User Management > Accounts > Invitations > Drive": {
    "POST /1/accounts/{account}/invitations/{invitation}/drive": {
      "method": "POST",
      "path": "/1/accounts/{account}/invitations/{invitation}/drive",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        },
        {
          "name": "invitation",
          "field": "path_invitation"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "drive_id",
          "field": "body_drive_id"
        },
        {
          "name": "role",
          "field": "body_role"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PATCH /1/accounts/{account}/invitations/{invitation}/drive/{drive_id}": {
      "method": "PATCH",
      "path": "/1/accounts/{account}/invitations/{invitation}/drive/{drive_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        },
        {
          "name": "invitation",
          "field": "path_invitation"
        },
        {
          "name": "drive_id",
          "field": "path_drive_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
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
    "DELETE /1/accounts/{account}/invitations/{invitation}/drive/{drive_id}": {
      "method": "DELETE",
      "path": "/1/accounts/{account}/invitations/{invitation}/drive/{drive_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        },
        {
          "name": "invitation",
          "field": "path_invitation"
        },
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
  "User Management > Accounts > Invitations > KChat": {
    "PATCH /1/accounts/{account}/invitations/{invitation}/kchat": {
      "method": "PATCH",
      "path": "/1/accounts/{account}/invitations/{invitation}/kchat",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        },
        {
          "name": "invitation",
          "field": "path_invitation"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "role",
          "field": "body_role"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "User Management > Accounts > Invitations > Mailbox": {
    "POST /1/accounts/{account}/invitations/{invitation}/mailbox/invite": {
      "method": "POST",
      "path": "/1/accounts/{account}/invitations/{invitation}/mailbox/invite",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        },
        {
          "name": "invitation",
          "field": "path_invitation"
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
          "name": "key",
          "field": "body_key"
        },
        {
          "name": "mail_id",
          "field": "body_mail_id"
        },
        {
          "name": "mailbox_name",
          "field": "body_mailbox_name"
        },
        {
          "name": "password",
          "field": "body_password"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /1/accounts/{account}/invitations/{invitation}/mailbox/{mail_id}": {
      "method": "POST",
      "path": "/1/accounts/{account}/invitations/{invitation}/mailbox/{mail_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        },
        {
          "name": "invitation",
          "field": "path_invitation"
        },
        {
          "name": "mail_id",
          "field": "path_mail_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "mailbox_name",
          "field": "body_mailbox_name"
        },
        {
          "name": "mailbox_permissions",
          "field": "body_mailbox_permissions"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PATCH /1/accounts/{account}/invitations/{invitation}/mailbox/{mail_id}": {
      "method": "PATCH",
      "path": "/1/accounts/{account}/invitations/{invitation}/mailbox/{mail_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        },
        {
          "name": "invitation",
          "field": "path_invitation"
        },
        {
          "name": "mail_id",
          "field": "path_mail_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "mailbox_name",
          "field": "body_mailbox_name"
        },
        {
          "name": "mailbox_permissions",
          "field": "body_mailbox_permissions"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/accounts/{account}/invitations/{invitation}/mailbox/{mail_id}": {
      "method": "DELETE",
      "path": "/1/accounts/{account}/invitations/{invitation}/mailbox/{mail_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        },
        {
          "name": "invitation",
          "field": "path_invitation"
        },
        {
          "name": "mail_id",
          "field": "path_mail_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "mailbox_name",
          "field": "body_mailbox_name"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "User Management > Accounts > Invitations > kSuite": {
    "POST /1/accounts/{account}/invitations/{invitation}/ksuite": {
      "method": "POST",
      "path": "/1/accounts/{account}/invitations/{invitation}/ksuite",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        },
        {
          "name": "invitation",
          "field": "path_invitation"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "ksuite_access",
          "field": "body_ksuite_access"
        },
        {
          "name": "mailbox_name",
          "field": "body_mailbox_name"
        },
        {
          "name": "mailbox_permissions",
          "field": "body_mailbox_permissions"
        },
        {
          "name": "mailbox_signature_model_id",
          "field": "body_mailbox_signature_model_id"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /1/accounts/{account}/invitations/{invitation}/ksuite": {
      "method": "DELETE",
      "path": "/1/accounts/{account}/invitations/{invitation}/ksuite",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        },
        {
          "name": "invitation",
          "field": "path_invitation"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "User Management > Teams": {
    "GET /1/accounts/{account}/teams": {
      "method": "GET",
      "path": "/1/accounts/{account}/teams",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/accounts/{account}/teams": {
      "method": "POST",
      "path": "/1/accounts/{account}/teams",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
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
          "name": "owned_by_id",
          "field": "body_owned_by_id"
        },
        {
          "name": "permissions",
          "field": "body_permissions"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /1/accounts/{account}/teams/{team}": {
      "method": "GET",
      "path": "/1/accounts/{account}/teams/{team}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        },
        {
          "name": "team",
          "field": "path_team"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PATCH /1/accounts/{account}/teams/{team}": {
      "method": "PATCH",
      "path": "/1/accounts/{account}/teams/{team}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        },
        {
          "name": "team",
          "field": "path_team"
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
          "name": "owned_by_id",
          "field": "body_owned_by_id"
        },
        {
          "name": "permissions",
          "field": "body_permissions"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /1/accounts/{account}/teams/{team}": {
      "method": "DELETE",
      "path": "/1/accounts/{account}/teams/{team}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        },
        {
          "name": "team",
          "field": "path_team"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "User Management > Teams > Users": {
    "GET /1/accounts/{account}/teams/{team}/users": {
      "method": "GET",
      "path": "/1/accounts/{account}/teams/{team}/users",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        },
        {
          "name": "team",
          "field": "path_team"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/accounts/{account}/teams/{team}/users": {
      "method": "POST",
      "path": "/1/accounts/{account}/teams/{team}/users",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        },
        {
          "name": "team",
          "field": "path_team"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "user_ids",
          "field": "body_user_ids"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/accounts/{account}/teams/{team}/users": {
      "method": "DELETE",
      "path": "/1/accounts/{account}/teams/{team}/users",
      "pagination": "none",
      "pathParams": [
        {
          "name": "account",
          "field": "path_account"
        },
        {
          "name": "team",
          "field": "path_team"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "user_ids",
          "field": "body_user_ids"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "kSuite > Workspace": {
    "GET /2/profile/ksuites/mailboxes": {
      "method": "GET",
      "path": "/2/profile/ksuites/mailboxes",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/profile/ksuites/mailboxes": {
      "method": "POST",
      "path": "/2/profile/ksuites/mailboxes",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "password",
          "field": "body_password"
        },
        {
          "name": "is_primary",
          "field": "body_is_primary"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "PUT /2/profile/ksuites/mailboxes/{mailbox_id}/set_primary": {
      "method": "PUT",
      "path": "/2/profile/ksuites/mailboxes/{mailbox_id}/set_primary",
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
    "PUT /2/profile/ksuites/mailboxes/{mailbox_id}/update_password": {
      "method": "PUT",
      "path": "/2/profile/ksuites/mailboxes/{mailbox_id}/update_password",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mailbox_id",
          "field": "path_mailbox_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "password",
          "field": "body_password"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /2/profile/ksuites/mailboxes/{mailbox_id}": {
      "method": "DELETE",
      "path": "/2/profile/ksuites/mailboxes/{mailbox_id}",
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
  }
};

export class InfomaniakCoreRessource implements INodeType {
	description: INodeTypeDescription = {
  "displayName": "Infomaniak Core Ressource",
  "name": "infomaniakCoreRessource",
  "icon": "file:../../icons/k.svg",
  "group": [
    "output"
  ],
  "version": 1,
  "description": "Interact with Infomaniak Core Ressource API",
  "defaults": {
    "name": "Infomaniak Core Ressource"
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
          "name": "Actions",
          "value": "Actions"
        },
        {
          "name": "App Information",
          "value": "App Information"
        },
        {
          "name": "Countries",
          "value": "Countries"
        },
        {
          "name": "Events",
          "value": "Events"
        },
        {
          "name": "Events > Public Cloud Status",
          "value": "Events > Public Cloud Status"
        },
        {
          "name": "Languages",
          "value": "Languages"
        },
        {
          "name": "My K Suite",
          "value": "My kSuite"
        },
        {
          "name": "My K Suite > Product Management",
          "value": "My kSuite > Product management"
        },
        {
          "name": "Products",
          "value": "Products"
        },
        {
          "name": "Profile",
          "value": "Profile"
        },
        {
          "name": "Profile > Applications Passwords",
          "value": "Profile > Applications Passwords"
        },
        {
          "name": "Profile > Emails",
          "value": "Profile > Emails"
        },
        {
          "name": "Profile > Phones",
          "value": "Profile > Phones"
        },
        {
          "name": "Tasks",
          "value": "Tasks"
        },
        {
          "name": "Timezones",
          "value": "Timezones"
        },
        {
          "name": "User Management",
          "value": "User Management"
        },
        {
          "name": "User Management > Accounts",
          "value": "User Management > Accounts"
        },
        {
          "name": "User Management > Accounts > Invitations",
          "value": "User Management > Accounts > Invitations"
        },
        {
          "name": "User Management > Accounts > Invitations > B2 B",
          "value": "User Management > Accounts > Invitations > B2B"
        },
        {
          "name": "User Management > Accounts > Invitations > Drive",
          "value": "User Management > Accounts > Invitations > Drive"
        },
        {
          "name": "User Management > Accounts > Invitations > KChat",
          "value": "User Management > Accounts > Invitations > KChat"
        },
        {
          "name": "User Management > Accounts > Invitations > Mailbox",
          "value": "User Management > Accounts > Invitations > Mailbox"
        },
        {
          "name": "User Management > Accounts > Invitations > K Suite",
          "value": "User Management > Accounts > Invitations > kSuite"
        },
        {
          "name": "User Management > Teams",
          "value": "User Management > Teams"
        },
        {
          "name": "User Management > Teams > Users",
          "value": "User Management > Teams > Users"
        },
        {
          "name": "K Suite > Workspace",
          "value": "kSuite > Workspace"
        }
      ],
      "default": "Actions",
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
            "Actions"
          ]
        }
      },
      "options": [
        {
          "name": "List Available Actions",
          "value": "GET /1/actions"
        },
        {
          "name": "List Available Actions",
          "value": "GET /1/actions/{action_id}"
        }
      ],
      "default": "GET /1/actions",
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
            "Actions"
          ],
          "operation": [
            "GET /1/actions"
          ]
        }
      },
      "options": [
        {
          "displayName": "Search",
          "name": "query_search",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Action Id",
      "name": "path_action_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Actions"
          ],
          "operation": [
            "GET /1/actions/{action_id}"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the action to request."
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "App Information"
          ]
        }
      },
      "options": [
        {
          "name": "Get Application List.",
          "value": "GET /1/app-information/applications"
        },
        {
          "name": "Get Application.",
          "value": "GET /1/app-information/applications/{application}"
        },
        {
          "name": "Get Supported Store List.",
          "value": "GET /1/app-information/versions"
        },
        {
          "name": "Get Supported Store List.",
          "value": "GET /1/app-information/versions/{appStore}"
        },
        {
          "name": "Get Application With Associated Versions Details.",
          "value": "GET /1/app-information/versions/{appStore}/{appPlatform}/{appName}"
        }
      ],
      "default": "GET /1/app-information/applications",
      "noDataExpression": true
    },
    {
      "displayName": "Application",
      "name": "path_application",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "App Information"
          ],
          "operation": [
            "GET /1/app-information/applications/{application}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "AppStore",
      "name": "path_appStore",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "App Information"
          ],
          "operation": [
            "GET /1/app-information/versions/{appStore}/{appPlatform}/{appName}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "AppPlatform",
      "name": "path_appPlatform",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "App Information"
          ],
          "operation": [
            "GET /1/app-information/versions/{appStore}/{appPlatform}/{appName}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "AppName",
      "name": "path_appName",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "App Information"
          ],
          "operation": [
            "GET /1/app-information/versions/{appStore}/{appPlatform}/{appName}"
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
            "Countries"
          ]
        }
      },
      "options": [
        {
          "name": "List Countries",
          "value": "GET /1/countries"
        },
        {
          "name": "Display A Country",
          "value": "GET /1/countries/{country_id}"
        }
      ],
      "default": "GET /1/countries",
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
            "Countries"
          ],
          "operation": [
            "GET /1/countries"
          ]
        }
      },
      "options": [
        {
          "displayName": "Only Enabled",
          "name": "query_only_enabled",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Only Enabled Exception",
          "name": "query_only_enabled_exception",
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
      "displayName": "Country Id",
      "name": "path_country_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Countries"
          ],
          "operation": [
            "GET /1/countries/{country_id}"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the country to request."
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Events"
          ]
        }
      },
      "options": [
        {
          "name": "List Events",
          "value": "GET /2/events"
        },
        {
          "name": "Display An Event",
          "value": "GET /2/events/{event_id}"
        }
      ],
      "default": "GET /2/events",
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
            "Events"
          ],
          "operation": [
            "GET /2/events"
          ]
        }
      },
      "options": [
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
          "displayName": "Event Type",
          "name": "query_event_type",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "internal",
              "value": "internal"
            },
            {
              "name": "public",
              "value": "public"
            },
            {
              "name": "server",
              "value": "server"
            },
            {
              "name": "streaming",
              "value": "streaming"
            }
          ]
        },
        {
          "displayName": "Is Cyberattack",
          "name": "query_is_cyberattack",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Locale",
          "name": "query_locale",
          "type": "options",
          "default": "",
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
          "displayName": "Show Auto",
          "name": "query_show_auto",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Status",
          "name": "query_status",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "inprogress",
              "value": "inprogress"
            },
            {
              "name": "planned",
              "value": "planned"
            },
            {
              "name": "reviewed",
              "value": "reviewed"
            },
            {
              "name": "terminated",
              "value": "terminated"
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
          "displayName": "With Trashed",
          "name": "query_with_trashed",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Event Types",
          "name": "query_event_types",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Event Id",
      "name": "path_event_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Events"
          ],
          "operation": [
            "GET /2/events/{event_id}"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the event to request."
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Events > Public Cloud Status"
          ]
        }
      },
      "options": [
        {
          "name": "List Public Cloud Status",
          "value": "GET /2/events/public-cloud-status"
        }
      ],
      "default": "GET /2/events/public-cloud-status",
      "noDataExpression": true
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Languages"
          ]
        }
      },
      "options": [
        {
          "name": "List Languages",
          "value": "GET /1/languages"
        },
        {
          "name": "Display A Language",
          "value": "GET /1/languages/{language_id}"
        }
      ],
      "default": "GET /1/languages",
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
            "Languages"
          ],
          "operation": [
            "GET /1/languages"
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
      "displayName": "Language Id",
      "name": "path_language_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Languages"
          ],
          "operation": [
            "GET /1/languages/{language_id}"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the language to request."
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "My kSuite"
          ]
        }
      },
      "options": [
        {
          "name": "Show My KSuite",
          "value": "GET /1/my_ksuite/{my_k_suite_id}"
        },
        {
          "name": "Current My KSuite",
          "value": "GET /1/my_ksuite/current"
        }
      ],
      "default": "GET /1/my_ksuite/{my_k_suite_id}",
      "noDataExpression": true
    },
    {
      "displayName": "My K Suite Id",
      "name": "path_my_k_suite_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "My kSuite"
          ],
          "operation": [
            "GET /1/my_ksuite/{my_k_suite_id}"
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
            "My kSuite"
          ],
          "operation": [
            "GET /1/my_ksuite/{my_k_suite_id}"
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
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "My kSuite"
          ],
          "operation": [
            "GET /1/my_ksuite/current"
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
            "My kSuite > Product management"
          ]
        }
      },
      "options": [
        {
          "name": "Cancel Unsubscribe",
          "value": "POST /1/my_ksuite/{my_k_suite_id}/cancel_unsubscribe"
        }
      ],
      "default": "POST /1/my_ksuite/{my_k_suite_id}/cancel_unsubscribe",
      "noDataExpression": true
    },
    {
      "displayName": "My K Suite Id",
      "name": "path_my_k_suite_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "My kSuite > Product management"
          ],
          "operation": [
            "POST /1/my_ksuite/{my_k_suite_id}/cancel_unsubscribe"
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
            "Products"
          ]
        }
      },
      "options": [
        {
          "name": "List Products",
          "value": "GET /1/products"
        }
      ],
      "default": "GET /1/products",
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
            "Products"
          ],
          "operation": [
            "GET /1/products"
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
          "displayName": "Account Id",
          "name": "query_account_id",
          "type": "number",
          "default": 0,
          "description": "The account identifier"
        },
        {
          "displayName": "Customer Name",
          "name": "query_customer_name",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Fqdn",
          "name": "query_fqdn",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Internal Name",
          "name": "query_internal_name",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Product Id",
          "name": "query_product_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Service Id",
          "name": "query_service_id",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "1",
              "value": 1
            },
            {
              "name": "2",
              "value": 2
            },
            {
              "name": "3",
              "value": 3
            },
            {
              "name": "4",
              "value": 4
            },
            {
              "name": "6",
              "value": 6
            },
            {
              "name": "7",
              "value": 7
            },
            {
              "name": "10",
              "value": 10
            },
            {
              "name": "14",
              "value": 14
            },
            {
              "name": "15",
              "value": 15
            },
            {
              "name": "18",
              "value": 18
            },
            {
              "name": "23",
              "value": 23
            },
            {
              "name": "25",
              "value": 25
            },
            {
              "name": "26",
              "value": 26
            },
            {
              "name": "29",
              "value": 29
            },
            {
              "name": "30",
              "value": 30
            },
            {
              "name": "31",
              "value": 31
            },
            {
              "name": "34",
              "value": 34
            },
            {
              "name": "35",
              "value": 35
            },
            {
              "name": "37",
              "value": 37
            },
            {
              "name": "40",
              "value": 40
            },
            {
              "name": "43",
              "value": 43
            },
            {
              "name": "48",
              "value": 48
            },
            {
              "name": "50",
              "value": 50
            },
            {
              "name": "52",
              "value": 52
            },
            {
              "name": "58",
              "value": 58
            }
          ]
        },
        {
          "displayName": "Service Name",
          "name": "query_service_name",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "ai_tools",
              "value": "ai_tools"
            },
            {
              "name": "backup",
              "value": "backup"
            },
            {
              "name": "certificate",
              "value": "certificate"
            },
            {
              "name": "cloud",
              "value": "cloud"
            },
            {
              "name": "cloud_hd",
              "value": "cloud_hd"
            },
            {
              "name": "custom_url",
              "value": "custom_url"
            },
            {
              "name": "dedicated_server",
              "value": "dedicated_server"
            },
            {
              "name": "domain",
              "value": "domain"
            },
            {
              "name": "drive",
              "value": "drive"
            },
            {
              "name": "e_ticketing",
              "value": "e_ticketing"
            },
            {
              "name": "email_hosting",
              "value": "email_hosting"
            },
            {
              "name": "hosting",
              "value": "hosting"
            },
            {
              "name": "housing",
              "value": "housing"
            },
            {
              "name": "invitation",
              "value": "invitation"
            },
            {
              "name": "jelastic",
              "value": "jelastic"
            },
            {
              "name": "ksuite",
              "value": "ksuite"
            },
            {
              "name": "mailing",
              "value": "mailing"
            },
            {
              "name": "nas",
              "value": "nas"
            },
            {
              "name": "public_cloud",
              "value": "public_cloud"
            },
            {
              "name": "radio",
              "value": "radio"
            },
            {
              "name": "swiss_backup",
              "value": "swiss_backup"
            },
            {
              "name": "video",
              "value": "video"
            },
            {
              "name": "vod",
              "value": "vod"
            },
            {
              "name": "web_hosting",
              "value": "web_hosting"
            },
            {
              "name": "website_builder",
              "value": "website_builder"
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
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Profile"
          ]
        }
      },
      "options": [
        {
          "name": "Add / Update Profile's Avatar.",
          "value": "POST /2/profile/avatar"
        },
        {
          "name": "Delete Profile's Avatar.",
          "value": "DELETE /2/profile/avatar"
        },
        {
          "name": "List User Information",
          "value": "GET /2/profile"
        },
        {
          "name": "Update Profile Information",
          "value": "PATCH /2/profile"
        }
      ],
      "default": "POST /2/profile/avatar",
      "noDataExpression": true
    },
    {
      "displayName": "Avatar",
      "name": "body_avatar",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Profile"
          ],
          "operation": [
            "POST /2/profile/avatar"
          ]
        }
      },
      "required": true,
      "description": "Avatar"
    },
    {
      "displayName": "Encoding",
      "name": "body_encoding",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Profile"
          ],
          "operation": [
            "POST /2/profile/avatar"
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
            "Profile"
          ],
          "operation": [
            "GET /2/profile"
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
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Profile"
          ],
          "operation": [
            "PATCH /2/profile"
          ]
        }
      },
      "options": [
        {
          "displayName": "Dry Run",
          "name": "query_dry_run",
          "type": "boolean",
          "default": false
        }
      ]
    },
    {
      "displayName": "Email",
      "name": "body_email",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Profile"
          ],
          "operation": [
            "PATCH /2/profile"
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
            "Profile"
          ],
          "operation": [
            "PATCH /2/profile"
          ]
        }
      },
      "options": [
        {
          "displayName": "Birth At",
          "name": "body_birth_at",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Country Id",
          "name": "body_country_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Current Account Id",
          "name": "body_current_account_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Current Password",
          "name": "body_current_password",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Firstname",
          "name": "body_firstname",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Keep Session Ids",
          "name": "body_keep_session_ids",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Language Id",
          "name": "body_language_id",
          "type": "number",
          "default": 0,
          "description": "Unique identifier of the `language` that is related to the resource `{name}`"
        },
        {
          "displayName": "Lastname",
          "name": "body_lastname",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Locale",
          "name": "body_locale",
          "type": "string",
          "default": "",
          "description": "Represents a language identifier and a region identifier"
        },
        {
          "displayName": "Password",
          "name": "body_password",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Reminder Email",
          "name": "body_reminder_email",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Reminder Phone",
          "name": "body_reminder_phone",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Successful Connexion Notification",
          "name": "body_successful_connexion_notification",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Timezone",
          "name": "body_timezone",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Timezone Id",
          "name": "body_timezone_id",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Unsuccessful Connexion Limit",
          "name": "body_unsuccessful_connexion_limit",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Unsuccessful Connexion Notification",
          "name": "body_unsuccessful_connexion_notification",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Unsuccessful Connexion Rate Limit",
          "name": "body_unsuccessful_connexion_rate_limit",
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
            "Profile > Applications Passwords"
          ]
        }
      },
      "options": [
        {
          "name": "List Applications Passwords",
          "value": "GET /2/profile/applications/passwords"
        },
        {
          "name": "Add An Application Password",
          "value": "POST /2/profile/applications/passwords"
        },
        {
          "name": "Display An Application Password",
          "value": "GET /2/profile/applications/passwords/{password_id}"
        }
      ],
      "default": "GET /2/profile/applications/passwords",
      "noDataExpression": true
    },
    {
      "displayName": "Password Id",
      "name": "path_password_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Profile > Applications Passwords"
          ],
          "operation": [
            "GET /2/profile/applications/passwords/{password_id}"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the password to request."
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Profile > Emails"
          ]
        }
      },
      "options": [
        {
          "name": "List Emails",
          "value": "GET /2/profile/emails"
        },
        {
          "name": "Display An Email",
          "value": "GET /2/profile/emails/{email_type}/{email_id}"
        },
        {
          "name": "Delete An Email",
          "value": "DELETE /2/profile/emails/{email_type}/{email_id}"
        }
      ],
      "default": "GET /2/profile/emails",
      "noDataExpression": true
    },
    {
      "displayName": "Email Type",
      "name": "path_email_type",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Profile > Emails"
          ],
          "operation": [
            "GET /2/profile/emails/{email_type}/{email_id}"
          ]
        }
      },
      "required": true,
      "description": "The email type (email|email_request) to request."
    },
    {
      "displayName": "Email Id",
      "name": "path_email_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Profile > Emails"
          ],
          "operation": [
            "GET /2/profile/emails/{email_type}/{email_id}"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the email to request."
    },
    {
      "displayName": "Email Type",
      "name": "path_email_type",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Profile > Emails"
          ],
          "operation": [
            "DELETE /2/profile/emails/{email_type}/{email_id}"
          ]
        }
      },
      "required": true,
      "description": "The email type (email|email_request) to request."
    },
    {
      "displayName": "Email Id",
      "name": "path_email_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Profile > Emails"
          ],
          "operation": [
            "DELETE /2/profile/emails/{email_type}/{email_id}"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the email to request."
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Profile > Phones"
          ]
        }
      },
      "options": [
        {
          "name": "List Phones",
          "value": "GET /2/profile/phones"
        },
        {
          "name": "Display A Phone",
          "value": "GET /2/profile/phones/{phone_id}"
        },
        {
          "name": "Delete A Phone",
          "value": "DELETE /2/profile/phones/{phone_id}"
        }
      ],
      "default": "GET /2/profile/phones",
      "noDataExpression": true
    },
    {
      "displayName": "Phone Id",
      "name": "path_phone_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Profile > Phones"
          ],
          "operation": [
            "GET /2/profile/phones/{phone_id}"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the phone to request."
    },
    {
      "displayName": "Phone Id",
      "name": "path_phone_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Profile > Phones"
          ],
          "operation": [
            "DELETE /2/profile/phones/{phone_id}"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the phone to request."
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Tasks"
          ]
        }
      },
      "options": [
        {
          "name": "List Tasks",
          "value": "GET /1/async/tasks"
        },
        {
          "name": "Display A Task",
          "value": "GET /1/async/tasks/{task_uuid}"
        }
      ],
      "default": "GET /1/async/tasks",
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
            "Tasks"
          ],
          "operation": [
            "GET /1/async/tasks"
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
      "displayName": "Task Uuid",
      "name": "path_task_uuid",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Tasks"
          ],
          "operation": [
            "GET /1/async/tasks/{task_uuid}"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (UUID) of the task to request."
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Timezones"
          ]
        }
      },
      "options": [
        {
          "name": "List Timezones",
          "value": "GET /1/timezones"
        },
        {
          "name": "Display A Timezone",
          "value": "GET /1/timezones/{timezone_id}"
        }
      ],
      "default": "GET /1/timezones",
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
            "Timezones"
          ],
          "operation": [
            "GET /1/timezones"
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
      "displayName": "Timezone Id",
      "name": "path_timezone_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Timezones"
          ],
          "operation": [
            "GET /1/timezones/{timezone_id}"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the timezone to request."
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management"
          ]
        }
      },
      "options": [
        {
          "name": "Invite A User",
          "value": "POST /1/accounts/{account}/invitations"
        },
        {
          "name": "Cancel An Invitation",
          "value": "DELETE /1/accounts/{account}/invitations/{invitation}"
        }
      ],
      "default": "POST /1/accounts/{account}/invitations",
      "noDataExpression": true
    },
    {
      "displayName": "Account",
      "name": "path_account",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Account"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "User Management"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations"
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
      "displayName": "Email",
      "name": "body_email",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations"
          ]
        }
      },
      "required": true,
      "description": "The email address of the user being invited."
    },
    {
      "displayName": "First Name",
      "name": "body_first_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations"
          ]
        }
      },
      "required": true,
      "description": "The first name of the user being invited."
    },
    {
      "displayName": "Last Name",
      "name": "body_last_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations"
          ]
        }
      },
      "required": true,
      "description": "The last name of the user being invited."
    },
    {
      "displayName": "Locale",
      "name": "body_locale",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations"
          ]
        }
      },
      "required": true,
      "description": "The locale code for the language of the invitation the user will receive.",
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
      "displayName": "Role Type",
      "name": "body_role_type",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations"
          ]
        }
      },
      "required": true,
      "description": "The role to assign to the user upon invitation.",
      "options": [
        {
          "name": "admin",
          "value": "admin"
        },
        {
          "name": "normal",
          "value": "normal"
        },
        {
          "name": "owner",
          "value": "owner"
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
            "User Management"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations"
          ]
        }
      },
      "options": [
        {
          "displayName": "Notifications",
          "name": "body_notifications",
          "type": "json",
          "default": {},
          "description": "Notifications configuration for the user."
        },
        {
          "displayName": "Permissions",
          "name": "body_permissions",
          "type": "json",
          "default": {},
          "description": "Permissions configuration for the user."
        },
        {
          "displayName": "Silent",
          "name": "body_silent",
          "type": "boolean",
          "default": false,
          "description": "Whether or not the user will receive the invitation email. (default: `false`)"
        },
        {
          "displayName": "Strict",
          "name": "body_strict",
          "type": "boolean",
          "default": false,
          "description": "Whether or not the user should register with the same email address. (default: `true`)"
        },
        {
          "displayName": "Teams",
          "name": "body_teams",
          "type": "json",
          "default": {},
          "description": "The teams the user should be added to upon invitation."
        }
      ]
    },
    {
      "displayName": "Account",
      "name": "path_account",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management"
          ],
          "operation": [
            "DELETE /1/accounts/{account}/invitations/{invitation}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Account"
    },
    {
      "displayName": "Invitation",
      "name": "path_invitation",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management"
          ],
          "operation": [
            "DELETE /1/accounts/{account}/invitations/{invitation}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the User Invitation"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts"
          ]
        }
      },
      "options": [
        {
          "name": "List Accounts",
          "value": "GET /1/accounts"
        },
        {
          "name": "Display An Account",
          "value": "GET /1/accounts/{account_id}"
        },
        {
          "name": "Display A Listing Of Tags For An Account.",
          "value": "GET /1/accounts/{account_id}/tags"
        },
        {
          "name": "List Account's Products",
          "value": "GET /1/accounts/{account_id}/products"
        },
        {
          "name": "List Services",
          "value": "GET /1/accounts/{account_id}/services"
        },
        {
          "name": "List Current Account's Products",
          "value": "GET /1/accounts/current/products"
        },
        {
          "name": "List Basic Teams Information Of An Account.",
          "value": "GET /1/accounts/{account_id}/basic/teams"
        },
        {
          "name": "List Users",
          "value": "GET /2/accounts/{account}/users"
        },
        {
          "name": "List App Accesses",
          "value": "GET /2/accounts/{account}/users/{user}/app_accesses"
        }
      ],
      "default": "GET /1/accounts",
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
            "User Management > Accounts"
          ],
          "operation": [
            "GET /1/accounts"
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
      "displayName": "Account Id",
      "name": "path_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts"
          ],
          "operation": [
            "GET /1/accounts/{account_id}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Account to request."
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts"
          ],
          "operation": [
            "GET /1/accounts/{account_id}"
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
      "displayName": "Account Id",
      "name": "path_account_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts"
          ],
          "operation": [
            "GET /1/accounts/{account_id}/tags"
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
            "User Management > Accounts"
          ],
          "operation": [
            "GET /1/accounts/{account_id}/tags"
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
      "displayName": "Account Id",
      "name": "path_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts"
          ],
          "operation": [
            "GET /1/accounts/{account_id}/products"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Account to request."
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts"
          ],
          "operation": [
            "GET /1/accounts/{account_id}/products"
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
        }
      ]
    },
    {
      "displayName": "Account Id",
      "name": "path_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts"
          ],
          "operation": [
            "GET /1/accounts/{account_id}/services"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Account to request."
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts"
          ],
          "operation": [
            "GET /1/accounts/current/products"
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
        }
      ]
    },
    {
      "displayName": "Account Id",
      "name": "path_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts"
          ],
          "operation": [
            "GET /1/accounts/{account_id}/basic/teams"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Account to request."
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts"
          ],
          "operation": [
            "GET /1/accounts/{account_id}/basic/teams"
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
      "displayName": "Account",
      "name": "path_account",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts"
          ],
          "operation": [
            "GET /2/accounts/{account}/users"
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
            "User Management > Accounts"
          ],
          "operation": [
            "GET /2/accounts/{account}/users"
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
          "displayName": "Order By",
          "name": "query_order_by",
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
      "displayName": "Account",
      "name": "path_account",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts"
          ],
          "operation": [
            "GET /2/accounts/{account}/users/{user}/app_accesses"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "User",
      "name": "path_user",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts"
          ],
          "operation": [
            "GET /2/accounts/{account}/users/{user}/app_accesses"
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
            "User Management > Accounts > Invitations"
          ]
        }
      },
      "options": [
        {
          "name": "Display An Invitation Of An Account",
          "value": "GET /1/accounts/{account}/invitations/{invitation}"
        },
        {
          "name": "Patch An Invitation",
          "value": "PATCH /1/accounts/{account}/invitations/{invitation}"
        },
        {
          "name": "Get Users Invitations",
          "value": "GET /1/accounts/{account}/invitations/users/{user}"
        }
      ],
      "default": "GET /1/accounts/{account}/invitations/{invitation}",
      "noDataExpression": true
    },
    {
      "displayName": "Account",
      "name": "path_account",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations"
          ],
          "operation": [
            "GET /1/accounts/{account}/invitations/{invitation}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Invitation",
      "name": "path_invitation",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations"
          ],
          "operation": [
            "GET /1/accounts/{account}/invitations/{invitation}"
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
            "User Management > Accounts > Invitations"
          ],
          "operation": [
            "GET /1/accounts/{account}/invitations/{invitation}"
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
      "displayName": "Account",
      "name": "path_account",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations"
          ],
          "operation": [
            "PATCH /1/accounts/{account}/invitations/{invitation}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Invitation",
      "name": "path_invitation",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations"
          ],
          "operation": [
            "PATCH /1/accounts/{account}/invitations/{invitation}"
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
            "User Management > Accounts > Invitations"
          ],
          "operation": [
            "PATCH /1/accounts/{account}/invitations/{invitation}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Has Billing",
          "name": "body_has_billing",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Has Billing Mailing",
          "name": "body_has_billing_mailing",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Has Mailing",
          "name": "body_has_mailing",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Language Id",
          "name": "body_language_id",
          "type": "number",
          "default": 0,
          "description": "Unique identifier of the `language` that is related to the resource `{name}`"
        },
        {
          "displayName": "Permissions",
          "name": "body_permissions",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Role Type",
          "name": "body_role_type",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "admin",
              "value": "admin"
            },
            {
              "name": "normal",
              "value": "normal"
            },
            {
              "name": "owner",
              "value": "owner"
            }
          ]
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
      "displayName": "Account",
      "name": "path_account",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations"
          ],
          "operation": [
            "GET /1/accounts/{account}/invitations/users/{user}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "User",
      "name": "path_user",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations"
          ],
          "operation": [
            "GET /1/accounts/{account}/invitations/users/{user}"
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
            "User Management > Accounts > Invitations"
          ],
          "operation": [
            "GET /1/accounts/{account}/invitations/users/{user}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Type",
          "name": "query_type",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "admin",
              "value": "admin"
            },
            {
              "name": "normal",
              "value": "normal"
            },
            {
              "name": "owner",
              "value": "owner"
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
            "User Management > Accounts > Invitations > B2B"
          ]
        }
      },
      "options": [
        {
          "name": "List Customers",
          "value": "GET /1/accounts/{account}/invitations/{invitation}/b2b"
        },
        {
          "name": "Assign Customers",
          "value": "POST /1/accounts/{account}/invitations/{invitation}/b2b"
        },
        {
          "name": "Unassign Customers",
          "value": "DELETE /1/accounts/{account}/invitations/{invitation}/b2b/{partnership_id}"
        }
      ],
      "default": "GET /1/accounts/{account}/invitations/{invitation}/b2b",
      "noDataExpression": true
    },
    {
      "displayName": "Account",
      "name": "path_account",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > B2B"
          ],
          "operation": [
            "GET /1/accounts/{account}/invitations/{invitation}/b2b"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Invitation",
      "name": "path_invitation",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > B2B"
          ],
          "operation": [
            "GET /1/accounts/{account}/invitations/{invitation}/b2b"
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
            "User Management > Accounts > Invitations > B2B"
          ],
          "operation": [
            "GET /1/accounts/{account}/invitations/{invitation}/b2b"
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
      "displayName": "Account",
      "name": "path_account",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > B2B"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations/{invitation}/b2b"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Invitation",
      "name": "path_invitation",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > B2B"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations/{invitation}/b2b"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Partnership Ids",
      "name": "body_partnership_ids",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > B2B"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations/{invitation}/b2b"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Account",
      "name": "path_account",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > B2B"
          ],
          "operation": [
            "DELETE /1/accounts/{account}/invitations/{invitation}/b2b/{partnership_id}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Invitation",
      "name": "path_invitation",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > B2B"
          ],
          "operation": [
            "DELETE /1/accounts/{account}/invitations/{invitation}/b2b/{partnership_id}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Partnership Id",
      "name": "path_partnership_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > B2B"
          ],
          "operation": [
            "DELETE /1/accounts/{account}/invitations/{invitation}/b2b/{partnership_id}"
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
            "User Management > Accounts > Invitations > Drive"
          ]
        }
      },
      "options": [
        {
          "name": "Add A Drive Access",
          "value": "POST /1/accounts/{account}/invitations/{invitation}/drive"
        },
        {
          "name": "Update Drive Access",
          "value": "PATCH /1/accounts/{account}/invitations/{invitation}/drive/{drive_id}"
        },
        {
          "name": "Revoke A Drive Access",
          "value": "DELETE /1/accounts/{account}/invitations/{invitation}/drive/{drive_id}"
        }
      ],
      "default": "POST /1/accounts/{account}/invitations/{invitation}/drive",
      "noDataExpression": true
    },
    {
      "displayName": "Account",
      "name": "path_account",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Drive"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations/{invitation}/drive"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Invitation",
      "name": "path_invitation",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Drive"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations/{invitation}/drive"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Drive Id",
      "name": "body_drive_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Drive"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations/{invitation}/drive"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Role",
      "name": "body_role",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Drive"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations/{invitation}/drive"
          ]
        }
      },
      "required": true,
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
    },
    {
      "displayName": "Account",
      "name": "path_account",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Drive"
          ],
          "operation": [
            "PATCH /1/accounts/{account}/invitations/{invitation}/drive/{drive_id}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Invitation",
      "name": "path_invitation",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Drive"
          ],
          "operation": [
            "PATCH /1/accounts/{account}/invitations/{invitation}/drive/{drive_id}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Drive"
          ],
          "operation": [
            "PATCH /1/accounts/{account}/invitations/{invitation}/drive/{drive_id}"
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
            "User Management > Accounts > Invitations > Drive"
          ],
          "operation": [
            "PATCH /1/accounts/{account}/invitations/{invitation}/drive/{drive_id}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Right",
          "name": "body_right",
          "type": "options",
          "default": "",
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
      "displayName": "Account",
      "name": "path_account",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Drive"
          ],
          "operation": [
            "DELETE /1/accounts/{account}/invitations/{invitation}/drive/{drive_id}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Invitation",
      "name": "path_invitation",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Drive"
          ],
          "operation": [
            "DELETE /1/accounts/{account}/invitations/{invitation}/drive/{drive_id}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Drive Id",
      "name": "path_drive_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Drive"
          ],
          "operation": [
            "DELETE /1/accounts/{account}/invitations/{invitation}/drive/{drive_id}"
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
            "User Management > Accounts > Invitations > KChat"
          ]
        }
      },
      "options": [
        {
          "name": "Update A K Chat Access",
          "value": "PATCH /1/accounts/{account}/invitations/{invitation}/kchat"
        }
      ],
      "default": "PATCH /1/accounts/{account}/invitations/{invitation}/kchat",
      "noDataExpression": true
    },
    {
      "displayName": "Account",
      "name": "path_account",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > KChat"
          ],
          "operation": [
            "PATCH /1/accounts/{account}/invitations/{invitation}/kchat"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Invitation",
      "name": "path_invitation",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > KChat"
          ],
          "operation": [
            "PATCH /1/accounts/{account}/invitations/{invitation}/kchat"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Role",
      "name": "body_role",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > KChat"
          ],
          "operation": [
            "PATCH /1/accounts/{account}/invitations/{invitation}/kchat"
          ]
        }
      },
      "required": true,
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
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Mailbox"
          ]
        }
      },
      "options": [
        {
          "name": "Create Invite",
          "value": "POST /1/accounts/{account}/invitations/{invitation}/mailbox/invite"
        },
        {
          "name": "Create Mailbox",
          "value": "POST /1/accounts/{account}/invitations/{invitation}/mailbox/{mail_id}"
        },
        {
          "name": "Update A Mailbox Access",
          "value": "PATCH /1/accounts/{account}/invitations/{invitation}/mailbox/{mail_id}"
        },
        {
          "name": "Revoke A Drive Access",
          "value": "DELETE /1/accounts/{account}/invitations/{invitation}/mailbox/{mail_id}"
        }
      ],
      "default": "POST /1/accounts/{account}/invitations/{invitation}/mailbox/invite",
      "noDataExpression": true
    },
    {
      "displayName": "Account",
      "name": "path_account",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Mailbox"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations/{invitation}/mailbox/invite"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Invitation",
      "name": "path_invitation",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Mailbox"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations/{invitation}/mailbox/invite"
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
            "User Management > Accounts > Invitations > Mailbox"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations/{invitation}/mailbox/invite"
          ]
        }
      },
      "required": true,
      "description": "Email"
    },
    {
      "displayName": "Key",
      "name": "body_key",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Mailbox"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations/{invitation}/mailbox/invite"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mail Id",
      "name": "body_mail_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Mailbox"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations/{invitation}/mailbox/invite"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mailbox Name",
      "name": "body_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Mailbox"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations/{invitation}/mailbox/invite"
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
            "User Management > Accounts > Invitations > Mailbox"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations/{invitation}/mailbox/invite"
          ]
        }
      },
      "options": [
        {
          "displayName": "Password",
          "name": "body_password",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Account",
      "name": "path_account",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Mailbox"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations/{invitation}/mailbox/{mail_id}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Invitation",
      "name": "path_invitation",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Mailbox"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations/{invitation}/mailbox/{mail_id}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mail Id",
      "name": "path_mail_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Mailbox"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations/{invitation}/mailbox/{mail_id}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mailbox Name",
      "name": "body_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Mailbox"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations/{invitation}/mailbox/{mail_id}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mailbox Permissions",
      "name": "body_mailbox_permissions",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Mailbox"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations/{invitation}/mailbox/{mail_id}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Account",
      "name": "path_account",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Mailbox"
          ],
          "operation": [
            "PATCH /1/accounts/{account}/invitations/{invitation}/mailbox/{mail_id}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Invitation",
      "name": "path_invitation",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Mailbox"
          ],
          "operation": [
            "PATCH /1/accounts/{account}/invitations/{invitation}/mailbox/{mail_id}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mail Id",
      "name": "path_mail_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Mailbox"
          ],
          "operation": [
            "PATCH /1/accounts/{account}/invitations/{invitation}/mailbox/{mail_id}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mailbox Name",
      "name": "body_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Mailbox"
          ],
          "operation": [
            "PATCH /1/accounts/{account}/invitations/{invitation}/mailbox/{mail_id}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mailbox Permissions",
      "name": "body_mailbox_permissions",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Mailbox"
          ],
          "operation": [
            "PATCH /1/accounts/{account}/invitations/{invitation}/mailbox/{mail_id}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Account",
      "name": "path_account",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Mailbox"
          ],
          "operation": [
            "DELETE /1/accounts/{account}/invitations/{invitation}/mailbox/{mail_id}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Invitation",
      "name": "path_invitation",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Mailbox"
          ],
          "operation": [
            "DELETE /1/accounts/{account}/invitations/{invitation}/mailbox/{mail_id}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mail Id",
      "name": "path_mail_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Mailbox"
          ],
          "operation": [
            "DELETE /1/accounts/{account}/invitations/{invitation}/mailbox/{mail_id}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mailbox Name",
      "name": "body_mailbox_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > Mailbox"
          ],
          "operation": [
            "DELETE /1/accounts/{account}/invitations/{invitation}/mailbox/{mail_id}"
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
            "User Management > Accounts > Invitations > kSuite"
          ]
        }
      },
      "options": [
        {
          "name": "Create A K Suite Access",
          "value": "POST /1/accounts/{account}/invitations/{invitation}/ksuite"
        },
        {
          "name": "Revoke K Suite Access",
          "value": "DELETE /1/accounts/{account}/invitations/{invitation}/ksuite"
        }
      ],
      "default": "POST /1/accounts/{account}/invitations/{invitation}/ksuite",
      "noDataExpression": true
    },
    {
      "displayName": "Account",
      "name": "path_account",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > kSuite"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations/{invitation}/ksuite"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Invitation",
      "name": "path_invitation",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > kSuite"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations/{invitation}/ksuite"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Ksuite Access",
      "name": "body_ksuite_access",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > kSuite"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations/{invitation}/ksuite"
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
            "User Management > Accounts > Invitations > kSuite"
          ],
          "operation": [
            "POST /1/accounts/{account}/invitations/{invitation}/ksuite"
          ]
        }
      },
      "options": [
        {
          "displayName": "Mailbox Name",
          "name": "body_mailbox_name",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Mailbox Permissions",
          "name": "body_mailbox_permissions",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Mailbox Signature Model Id",
          "name": "body_mailbox_signature_model_id",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Account",
      "name": "path_account",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > kSuite"
          ],
          "operation": [
            "DELETE /1/accounts/{account}/invitations/{invitation}/ksuite"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Invitation",
      "name": "path_invitation",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Accounts > Invitations > kSuite"
          ],
          "operation": [
            "DELETE /1/accounts/{account}/invitations/{invitation}/ksuite"
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
            "User Management > Teams"
          ]
        }
      },
      "options": [
        {
          "name": "List Teams",
          "value": "GET /1/accounts/{account}/teams"
        },
        {
          "name": "Create A Team",
          "value": "POST /1/accounts/{account}/teams"
        },
        {
          "name": "Get A Team",
          "value": "GET /1/accounts/{account}/teams/{team}"
        },
        {
          "name": "Update A Team",
          "value": "PATCH /1/accounts/{account}/teams/{team}"
        },
        {
          "name": "Delete A Team",
          "value": "DELETE /1/accounts/{account}/teams/{team}"
        }
      ],
      "default": "GET /1/accounts/{account}/teams",
      "noDataExpression": true
    },
    {
      "displayName": "Account",
      "name": "path_account",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Teams"
          ],
          "operation": [
            "GET /1/accounts/{account}/teams"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Account"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Teams"
          ],
          "operation": [
            "GET /1/accounts/{account}/teams"
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
      "displayName": "Account",
      "name": "path_account",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Teams"
          ],
          "operation": [
            "POST /1/accounts/{account}/teams"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Account"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Teams"
          ],
          "operation": [
            "POST /1/accounts/{account}/teams"
          ]
        }
      },
      "required": true,
      "description": "Name of the resource Team"
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
            "User Management > Teams"
          ],
          "operation": [
            "POST /1/accounts/{account}/teams"
          ]
        }
      },
      "options": [
        {
          "displayName": "Owned By Id",
          "name": "body_owned_by_id",
          "type": "number",
          "default": 0,
          "description": "Unique identifier of the user that owned the resource Team"
        },
        {
          "displayName": "Permissions",
          "name": "body_permissions",
          "type": "json",
          "default": {},
          "description": "Permissions of the resource Team"
        }
      ]
    },
    {
      "displayName": "Account",
      "name": "path_account",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Teams"
          ],
          "operation": [
            "GET /1/accounts/{account}/teams/{team}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Account"
    },
    {
      "displayName": "Team",
      "name": "path_team",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Teams"
          ],
          "operation": [
            "GET /1/accounts/{account}/teams/{team}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Team"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Teams"
          ],
          "operation": [
            "GET /1/accounts/{account}/teams/{team}"
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
      "displayName": "Account",
      "name": "path_account",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Teams"
          ],
          "operation": [
            "PATCH /1/accounts/{account}/teams/{team}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Account"
    },
    {
      "displayName": "Team",
      "name": "path_team",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Teams"
          ],
          "operation": [
            "PATCH /1/accounts/{account}/teams/{team}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Team"
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
            "User Management > Teams"
          ],
          "operation": [
            "PATCH /1/accounts/{account}/teams/{team}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "Name of the resource Team"
        },
        {
          "displayName": "Owned By Id",
          "name": "body_owned_by_id",
          "type": "number",
          "default": 0,
          "description": "Unique identifier of the user that owned the resource Team"
        },
        {
          "displayName": "Permissions",
          "name": "body_permissions",
          "type": "json",
          "default": {},
          "description": "Permissions of the resource Team"
        }
      ]
    },
    {
      "displayName": "Account",
      "name": "path_account",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Teams"
          ],
          "operation": [
            "DELETE /1/accounts/{account}/teams/{team}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Account"
    },
    {
      "displayName": "Team",
      "name": "path_team",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Teams"
          ],
          "operation": [
            "DELETE /1/accounts/{account}/teams/{team}"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Team"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Teams > Users"
          ]
        }
      },
      "options": [
        {
          "name": "List Team Users",
          "value": "GET /1/accounts/{account}/teams/{team}/users"
        },
        {
          "name": "Add Users To Team",
          "value": "POST /1/accounts/{account}/teams/{team}/users"
        },
        {
          "name": "Remove Users From Team",
          "value": "DELETE /1/accounts/{account}/teams/{team}/users"
        }
      ],
      "default": "GET /1/accounts/{account}/teams/{team}/users",
      "noDataExpression": true
    },
    {
      "displayName": "Account",
      "name": "path_account",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Teams > Users"
          ],
          "operation": [
            "GET /1/accounts/{account}/teams/{team}/users"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Account"
    },
    {
      "displayName": "Team",
      "name": "path_team",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Teams > Users"
          ],
          "operation": [
            "GET /1/accounts/{account}/teams/{team}/users"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Team"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Teams > Users"
          ],
          "operation": [
            "GET /1/accounts/{account}/teams/{team}/users"
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
      "displayName": "Account",
      "name": "path_account",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Teams > Users"
          ],
          "operation": [
            "POST /1/accounts/{account}/teams/{team}/users"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Account"
    },
    {
      "displayName": "Team",
      "name": "path_team",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Teams > Users"
          ],
          "operation": [
            "POST /1/accounts/{account}/teams/{team}/users"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Team"
    },
    {
      "displayName": "User Ids",
      "name": "body_user_ids",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Teams > Users"
          ],
          "operation": [
            "POST /1/accounts/{account}/teams/{team}/users"
          ]
        }
      },
      "required": true,
      "description": "The user identifiers to add to the team."
    },
    {
      "displayName": "Account",
      "name": "path_account",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Teams > Users"
          ],
          "operation": [
            "DELETE /1/accounts/{account}/teams/{team}/users"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Account"
    },
    {
      "displayName": "Team",
      "name": "path_team",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Teams > Users"
          ],
          "operation": [
            "DELETE /1/accounts/{account}/teams/{team}/users"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Team"
    },
    {
      "displayName": "User Ids",
      "name": "body_user_ids",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "User Management > Teams > Users"
          ],
          "operation": [
            "DELETE /1/accounts/{account}/teams/{team}/users"
          ]
        }
      },
      "required": true,
      "description": "The user identifiers to add to the team."
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "kSuite > Workspace"
          ]
        }
      },
      "options": [
        {
          "name": "Get Related Workspace Users",
          "value": "GET /2/profile/ksuites/mailboxes"
        },
        {
          "name": "Attach A Mailbox To Current User",
          "value": "POST /2/profile/ksuites/mailboxes"
        },
        {
          "name": "Set Mailbox As Primary",
          "value": "PUT /2/profile/ksuites/mailboxes/{mailbox_id}/set_primary"
        },
        {
          "name": "Update Mailbox Credential Password",
          "value": "PUT /2/profile/ksuites/mailboxes/{mailbox_id}/update_password"
        },
        {
          "name": "Unlink A Mailbox From Current User",
          "value": "DELETE /2/profile/ksuites/mailboxes/{mailbox_id}"
        }
      ],
      "default": "GET /2/profile/ksuites/mailboxes",
      "noDataExpression": true
    },
    {
      "displayName": "Password",
      "name": "body_password",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "kSuite > Workspace"
          ],
          "operation": [
            "POST /2/profile/ksuites/mailboxes"
          ]
        }
      },
      "required": true,
      "description": "Mailbox password"
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
            "kSuite > Workspace"
          ],
          "operation": [
            "POST /2/profile/ksuites/mailboxes"
          ]
        }
      },
      "options": [
        {
          "displayName": "Is Primary",
          "name": "body_is_primary",
          "type": "boolean",
          "default": false,
          "description": "Set mailbox as primary"
        }
      ]
    },
    {
      "displayName": "Mailbox Id",
      "name": "path_mailbox_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "kSuite > Workspace"
          ],
          "operation": [
            "PUT /2/profile/ksuites/mailboxes/{mailbox_id}/set_primary"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mailbox Id",
      "name": "path_mailbox_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "kSuite > Workspace"
          ],
          "operation": [
            "PUT /2/profile/ksuites/mailboxes/{mailbox_id}/update_password"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Password",
      "name": "body_password",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "kSuite > Workspace"
          ],
          "operation": [
            "PUT /2/profile/ksuites/mailboxes/{mailbox_id}/update_password"
          ]
        }
      },
      "required": true,
      "description": "Mailbox password"
    },
    {
      "displayName": "Mailbox Id",
      "name": "path_mailbox_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "kSuite > Workspace"
          ],
          "operation": [
            "DELETE /2/profile/ksuites/mailboxes/{mailbox_id}"
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
            "Countries",
            "Languages",
            "Products",
            "Tasks",
            "Timezones",
            "User Management > Accounts",
            "User Management > Accounts > Invitations > B2B",
            "User Management > Teams",
            "User Management > Teams > Users"
          ],
          "operation": [
            "GET /1/countries",
            "GET /1/languages",
            "GET /1/products",
            "GET /1/async/tasks",
            "GET /1/timezones",
            "GET /2/accounts/{account}/users",
            "GET /1/accounts/{account}/invitations/{invitation}/b2b",
            "GET /1/accounts/{account}/teams",
            "GET /1/accounts/{account}/teams/{team}/users"
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
            "Countries",
            "Languages",
            "Products",
            "Tasks",
            "Timezones",
            "User Management > Accounts",
            "User Management > Accounts > Invitations > B2B",
            "User Management > Teams",
            "User Management > Teams > Users"
          ],
          "operation": [
            "GET /1/countries",
            "GET /1/languages",
            "GET /1/products",
            "GET /1/async/tasks",
            "GET /1/timezones",
            "GET /2/accounts/{account}/users",
            "GET /1/accounts/{account}/invitations/{invitation}/b2b",
            "GET /1/accounts/{account}/teams",
            "GET /1/accounts/{account}/teams/{team}/users"
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
