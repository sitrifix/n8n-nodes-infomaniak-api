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
  "bots": {
    "GET /api/v4/bots": {
      "method": "GET",
      "path": "/api/v4/bots",
      "pagination": "page-per-page",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /api/v4/bots": {
      "method": "POST",
      "path": "/api/v4/bots",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "username",
          "field": "body_username"
        },
        {
          "name": "display_name",
          "field": "body_display_name"
        },
        {
          "name": "description",
          "field": "body_description"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /api/v4/bots/{bot_user_id}": {
      "method": "GET",
      "path": "/api/v4/bots/{bot_user_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "bot_user_id",
          "field": "path_bot_user_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /api/v4/bots/{bot_user_id}": {
      "method": "PUT",
      "path": "/api/v4/bots/{bot_user_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "bot_user_id",
          "field": "path_bot_user_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "username",
          "field": "body_username"
        },
        {
          "name": "display_name",
          "field": "body_display_name"
        },
        {
          "name": "description",
          "field": "body_description"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /api/v4/bots/{bot_user_id}/disable": {
      "method": "POST",
      "path": "/api/v4/bots/{bot_user_id}/disable",
      "pagination": "none",
      "pathParams": [
        {
          "name": "bot_user_id",
          "field": "path_bot_user_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /api/v4/bots/{bot_user_id}/enable": {
      "method": "POST",
      "path": "/api/v4/bots/{bot_user_id}/enable",
      "pagination": "none",
      "pathParams": [
        {
          "name": "bot_user_id",
          "field": "path_bot_user_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "channels": {
    "GET /api/v4/channels": {
      "method": "GET",
      "path": "/api/v4/channels",
      "pagination": "page-per-page",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /api/v4/channels": {
      "method": "POST",
      "path": "/api/v4/channels",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "team_id",
          "field": "body_team_id"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "display_name",
          "field": "body_display_name"
        },
        {
          "name": "purpose",
          "field": "body_purpose"
        },
        {
          "name": "header",
          "field": "body_header"
        },
        {
          "name": "type",
          "field": "body_type"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /api/v4/channels/direct": {
      "method": "POST",
      "path": "/api/v4/channels/direct",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": "body"
    },
    "POST /api/v4/channels/group": {
      "method": "POST",
      "path": "/api/v4/channels/group",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": "body"
    },
    "POST /api/v4/channels/search": {
      "method": "POST",
      "path": "/api/v4/channels/search",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "term",
          "field": "body_term"
        },
        {
          "name": "not_associated_to_group",
          "field": "body_not_associated_to_group"
        },
        {
          "name": "exclude_default_channels",
          "field": "body_exclude_default_channels"
        },
        {
          "name": "team_ids",
          "field": "body_team_ids"
        },
        {
          "name": "group_constrained",
          "field": "body_group_constrained"
        },
        {
          "name": "exclude_group_constrained",
          "field": "body_exclude_group_constrained"
        },
        {
          "name": "public",
          "field": "body_public"
        },
        {
          "name": "private",
          "field": "body_private"
        },
        {
          "name": "deleted",
          "field": "body_deleted"
        },
        {
          "name": "page",
          "field": "body_page"
        },
        {
          "name": "per_page",
          "field": "body_per_page"
        },
        {
          "name": "exclude_policy_constrained",
          "field": "body_exclude_policy_constrained"
        },
        {
          "name": "include_search_by_id",
          "field": "body_include_search_by_id"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /api/v4/channels/group/search": {
      "method": "POST",
      "path": "/api/v4/channels/group/search",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "term",
          "field": "body_term"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /api/v4/teams/{team_id}/channels/ids": {
      "method": "POST",
      "path": "/api/v4/teams/{team_id}/channels/ids",
      "pagination": "none",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": "body"
    },
    "GET /api/v4/channels/{channel_id}": {
      "method": "GET",
      "path": "/api/v4/channels/{channel_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel_id",
          "field": "path_channel_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /api/v4/channels/{channel_id}": {
      "method": "PUT",
      "path": "/api/v4/channels/{channel_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel_id",
          "field": "path_channel_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "id",
          "field": "body_id"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "display_name",
          "field": "body_display_name"
        },
        {
          "name": "purpose",
          "field": "body_purpose"
        },
        {
          "name": "header",
          "field": "body_header"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /api/v4/channels/{channel_id}": {
      "method": "DELETE",
      "path": "/api/v4/channels/{channel_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel_id",
          "field": "path_channel_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /api/v4/channels/{channel_id}/patch": {
      "method": "PUT",
      "path": "/api/v4/channels/{channel_id}/patch",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel_id",
          "field": "path_channel_id"
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
          "name": "display_name",
          "field": "body_display_name"
        },
        {
          "name": "purpose",
          "field": "body_purpose"
        },
        {
          "name": "header",
          "field": "body_header"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "PUT /api/v4/channels/{channel_id}/privacy": {
      "method": "PUT",
      "path": "/api/v4/channels/{channel_id}/privacy",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel_id",
          "field": "path_channel_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "privacy",
          "field": "body_privacy"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /api/v4/channels/{channel_id}/restore": {
      "method": "POST",
      "path": "/api/v4/channels/{channel_id}/restore",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel_id",
          "field": "path_channel_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /api/v4/channels/{channel_id}/move": {
      "method": "POST",
      "path": "/api/v4/channels/{channel_id}/move",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel_id",
          "field": "path_channel_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "team_id",
          "field": "body_team_id"
        },
        {
          "name": "force",
          "field": "body_force"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /api/v4/channels/{channel_id}/stats": {
      "method": "GET",
      "path": "/api/v4/channels/{channel_id}/stats",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel_id",
          "field": "path_channel_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/channels/{channel_id}/pinned": {
      "method": "GET",
      "path": "/api/v4/channels/{channel_id}/pinned",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel_id",
          "field": "path_channel_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/teams/{team_id}/channels": {
      "method": "GET",
      "path": "/api/v4/teams/{team_id}/channels",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/teams/{team_id}/channels/private": {
      "method": "GET",
      "path": "/api/v4/teams/{team_id}/channels/private",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/teams/{team_id}/channels/deleted": {
      "method": "GET",
      "path": "/api/v4/teams/{team_id}/channels/deleted",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/teams/{team_id}/channels/autocomplete": {
      "method": "GET",
      "path": "/api/v4/teams/{team_id}/channels/autocomplete",
      "pagination": "none",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
        }
      ],
      "queryParams": [
        {
          "name": "name",
          "field": "query_name"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/teams/{team_id}/channels/search_autocomplete": {
      "method": "GET",
      "path": "/api/v4/teams/{team_id}/channels/search_autocomplete",
      "pagination": "none",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
        }
      ],
      "queryParams": [
        {
          "name": "name",
          "field": "query_name"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /api/v4/teams/{team_id}/channels/search": {
      "method": "POST",
      "path": "/api/v4/teams/{team_id}/channels/search",
      "pagination": "none",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "term",
          "field": "body_term"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /api/v4/teams/{team_id}/channels/search_archived": {
      "method": "POST",
      "path": "/api/v4/teams/{team_id}/channels/search_archived",
      "pagination": "none",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "term",
          "field": "body_term"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/teams/{team_id}/channels/name/{channel_name}": {
      "method": "GET",
      "path": "/api/v4/teams/{team_id}/channels/name/{channel_name}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
        },
        {
          "name": "channel_name",
          "field": "path_channel_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/teams/name/{team_name}/channels/name/{channel_name}": {
      "method": "GET",
      "path": "/api/v4/teams/name/{team_name}/channels/name/{channel_name}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "team_name",
          "field": "path_team_name"
        },
        {
          "name": "channel_name",
          "field": "path_channel_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/channels/{channel_id}/members": {
      "method": "GET",
      "path": "/api/v4/channels/{channel_id}/members",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "channel_id",
          "field": "path_channel_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /api/v4/channels/{channel_id}/members": {
      "method": "POST",
      "path": "/api/v4/channels/{channel_id}/members",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel_id",
          "field": "path_channel_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "user_id",
          "field": "body_user_id"
        },
        {
          "name": "user_ids",
          "field": "body_user_ids"
        },
        {
          "name": "post_root_id",
          "field": "body_post_root_id"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /api/v4/channels/{channel_id}/members/ids": {
      "method": "POST",
      "path": "/api/v4/channels/{channel_id}/members/ids",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel_id",
          "field": "path_channel_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": "body"
    },
    "GET /api/v4/channels/{channel_id}/members/{user_id}": {
      "method": "GET",
      "path": "/api/v4/channels/{channel_id}/members/{user_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel_id",
          "field": "path_channel_id"
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
    "DELETE /api/v4/channels/{channel_id}/members/{user_id}": {
      "method": "DELETE",
      "path": "/api/v4/channels/{channel_id}/members/{user_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel_id",
          "field": "path_channel_id"
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
    "PUT /api/v4/channels/{channel_id}/members/{user_id}/roles": {
      "method": "PUT",
      "path": "/api/v4/channels/{channel_id}/members/{user_id}/roles",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel_id",
          "field": "path_channel_id"
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
    "PUT /api/v4/channels/{channel_id}/members/{user_id}/schemeRoles": {
      "method": "PUT",
      "path": "/api/v4/channels/{channel_id}/members/{user_id}/schemeRoles",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel_id",
          "field": "path_channel_id"
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
          "name": "scheme_admin",
          "field": "body_scheme_admin"
        },
        {
          "name": "scheme_user",
          "field": "body_scheme_user"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /api/v4/channels/{channel_id}/members/{user_id}/notify_props": {
      "method": "PUT",
      "path": "/api/v4/channels/{channel_id}/members/{user_id}/notify_props",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel_id",
          "field": "path_channel_id"
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
          "name": "email",
          "field": "body_email"
        },
        {
          "name": "push",
          "field": "body_push"
        },
        {
          "name": "desktop",
          "field": "body_desktop"
        },
        {
          "name": "mark_unread",
          "field": "body_mark_unread"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /api/v4/channels/members/{user_id}/view": {
      "method": "POST",
      "path": "/api/v4/channels/members/{user_id}/view",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "channel_id",
          "field": "body_channel_id"
        },
        {
          "name": "prev_channel_id",
          "field": "body_prev_channel_id"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /api/v4/users/{user_id}/teams/{team_id}/channels/members": {
      "method": "GET",
      "path": "/api/v4/users/{user_id}/teams/{team_id}/channels/members",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
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
    },
    "GET /api/v4/users/{user_id}/teams/{team_id}/channels": {
      "method": "GET",
      "path": "/api/v4/users/{user_id}/teams/{team_id}/channels",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
        },
        {
          "name": "team_id",
          "field": "path_team_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/users/{user_id}/channels": {
      "method": "GET",
      "path": "/api/v4/users/{user_id}/channels",
      "pagination": "none",
      "pathParams": [
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
    "GET /api/v4/users/{user_id}/channels/{channel_id}/unread": {
      "method": "GET",
      "path": "/api/v4/users/{user_id}/channels/{channel_id}/unread",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
        },
        {
          "name": "channel_id",
          "field": "path_channel_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /api/v4/channels/{channel_id}/scheme": {
      "method": "PUT",
      "path": "/api/v4/channels/{channel_id}/scheme",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel_id",
          "field": "path_channel_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "scheme_id",
          "field": "body_scheme_id"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/channels/{channel_id}/moderations": {
      "method": "GET",
      "path": "/api/v4/channels/{channel_id}/moderations",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel_id",
          "field": "path_channel_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /api/v4/channels/{channel_id}/moderations/patch": {
      "method": "PUT",
      "path": "/api/v4/channels/{channel_id}/moderations/patch",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel_id",
          "field": "path_channel_id"
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
          "name": "roles",
          "field": "body_roles"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /api/v4/users/{user_id}/teams/{team_id}/channels/categories": {
      "method": "GET",
      "path": "/api/v4/users/{user_id}/teams/{team_id}/channels/categories",
      "pagination": "none",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
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
    "POST /api/v4/users/{user_id}/teams/{team_id}/channels/categories": {
      "method": "POST",
      "path": "/api/v4/users/{user_id}/teams/{team_id}/channels/categories",
      "pagination": "none",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
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
          "name": "id",
          "field": "body_id"
        },
        {
          "name": "user_id",
          "field": "body_user_id"
        },
        {
          "name": "team_id",
          "field": "body_team_id"
        },
        {
          "name": "display_name",
          "field": "body_display_name"
        },
        {
          "name": "type",
          "field": "body_type"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "PUT /api/v4/users/{user_id}/teams/{team_id}/channels/categories": {
      "method": "PUT",
      "path": "/api/v4/users/{user_id}/teams/{team_id}/channels/categories",
      "pagination": "none",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
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
      "bodyFieldName": "body"
    },
    "GET /api/v4/users/{user_id}/teams/{team_id}/channels/categories/order": {
      "method": "GET",
      "path": "/api/v4/users/{user_id}/teams/{team_id}/channels/categories/order",
      "pagination": "none",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
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
    "PUT /api/v4/users/{user_id}/teams/{team_id}/channels/categories/order": {
      "method": "PUT",
      "path": "/api/v4/users/{user_id}/teams/{team_id}/channels/categories/order",
      "pagination": "none",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
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
      "bodyFieldName": "body"
    },
    "GET /api/v4/users/{user_id}/teams/{team_id}/channels/categories/{category_id}": {
      "method": "GET",
      "path": "/api/v4/users/{user_id}/teams/{team_id}/channels/categories/{category_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
        },
        {
          "name": "user_id",
          "field": "path_user_id"
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
    "PUT /api/v4/users/{user_id}/teams/{team_id}/channels/categories/{category_id}": {
      "method": "PUT",
      "path": "/api/v4/users/{user_id}/teams/{team_id}/channels/categories/{category_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
        },
        {
          "name": "user_id",
          "field": "path_user_id"
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
          "name": "id",
          "field": "body_id"
        },
        {
          "name": "user_id",
          "field": "body_user_id"
        },
        {
          "name": "team_id",
          "field": "body_team_id"
        },
        {
          "name": "display_name",
          "field": "body_display_name"
        },
        {
          "name": "type",
          "field": "body_type"
        },
        {
          "name": "channel_ids",
          "field": "body_channel_ids"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /api/v4/users/{user_id}/teams/{team_id}/channels/categories/{category_id}": {
      "method": "DELETE",
      "path": "/api/v4/users/{user_id}/teams/{team_id}/channels/categories/{category_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
        },
        {
          "name": "user_id",
          "field": "path_user_id"
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
    }
  },
  "commands": {
    "GET /api/v4/commands": {
      "method": "GET",
      "path": "/api/v4/commands",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /api/v4/commands": {
      "method": "POST",
      "path": "/api/v4/commands",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "team_id",
          "field": "body_team_id"
        },
        {
          "name": "method",
          "field": "body_method"
        },
        {
          "name": "trigger",
          "field": "body_trigger"
        },
        {
          "name": "url",
          "field": "body_url"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/teams/{team_id}/commands/autocomplete": {
      "method": "GET",
      "path": "/api/v4/teams/{team_id}/commands/autocomplete",
      "pagination": "none",
      "pathParams": [
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
    },
    "GET /api/v4/teams/{team_id}/commands/autocomplete_suggestions": {
      "method": "GET",
      "path": "/api/v4/teams/{team_id}/commands/autocomplete_suggestions",
      "pagination": "none",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
        }
      ],
      "queryParams": [
        {
          "name": "user_input",
          "field": "query_user_input"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/commands/{command_id}": {
      "method": "GET",
      "path": "/api/v4/commands/{command_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "command_id",
          "field": "path_command_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /api/v4/commands/{command_id}": {
      "method": "PUT",
      "path": "/api/v4/commands/{command_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "command_id",
          "field": "path_command_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "id",
          "field": "body_id"
        },
        {
          "name": "token",
          "field": "body_token"
        },
        {
          "name": "create_at",
          "field": "body_create_at"
        },
        {
          "name": "update_at",
          "field": "body_update_at"
        },
        {
          "name": "delete_at",
          "field": "body_delete_at"
        },
        {
          "name": "creator_id",
          "field": "body_creator_id"
        },
        {
          "name": "team_id",
          "field": "body_team_id"
        },
        {
          "name": "trigger",
          "field": "body_trigger"
        },
        {
          "name": "method",
          "field": "body_method"
        },
        {
          "name": "username",
          "field": "body_username"
        },
        {
          "name": "icon_url",
          "field": "body_icon_url"
        },
        {
          "name": "auto_complete",
          "field": "body_auto_complete"
        },
        {
          "name": "auto_complete_desc",
          "field": "body_auto_complete_desc"
        },
        {
          "name": "auto_complete_hint",
          "field": "body_auto_complete_hint"
        },
        {
          "name": "display_name",
          "field": "body_display_name"
        },
        {
          "name": "description",
          "field": "body_description"
        },
        {
          "name": "url",
          "field": "body_url"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /api/v4/commands/{command_id}": {
      "method": "DELETE",
      "path": "/api/v4/commands/{command_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "command_id",
          "field": "path_command_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /api/v4/commands/{command_id}/regen_token": {
      "method": "PUT",
      "path": "/api/v4/commands/{command_id}/regen_token",
      "pagination": "none",
      "pathParams": [
        {
          "name": "command_id",
          "field": "path_command_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /api/v4/commands/execute": {
      "method": "POST",
      "path": "/api/v4/commands/execute",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "channel_id",
          "field": "body_channel_id"
        },
        {
          "name": "command",
          "field": "body_command"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "emoji": {
    "GET /api/v4/emoji": {
      "method": "GET",
      "path": "/api/v4/emoji",
      "pagination": "page-per-page",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /api/v4/emoji": {
      "method": "POST",
      "path": "/api/v4/emoji",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "image",
          "field": "body_image"
        },
        {
          "name": "emoji",
          "field": "body_emoji"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/emoji/{emoji_id}": {
      "method": "GET",
      "path": "/api/v4/emoji/{emoji_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "emoji_id",
          "field": "path_emoji_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /api/v4/emoji/{emoji_id}": {
      "method": "DELETE",
      "path": "/api/v4/emoji/{emoji_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "emoji_id",
          "field": "path_emoji_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/emoji/name/{emoji_name}": {
      "method": "GET",
      "path": "/api/v4/emoji/name/{emoji_name}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "emoji_name",
          "field": "path_emoji_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/emoji/{emoji_id}/image": {
      "method": "GET",
      "path": "/api/v4/emoji/{emoji_id}/image",
      "pagination": "none",
      "pathParams": [
        {
          "name": "emoji_id",
          "field": "path_emoji_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /api/v4/emoji/search": {
      "method": "POST",
      "path": "/api/v4/emoji/search",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "term",
          "field": "body_term"
        },
        {
          "name": "prefix_only",
          "field": "body_prefix_only"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /api/v4/emoji/autocomplete": {
      "method": "GET",
      "path": "/api/v4/emoji/autocomplete",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [
        {
          "name": "name",
          "field": "query_name"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "files": {
    "POST /api/v4/files": {
      "method": "POST",
      "path": "/api/v4/files",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "files",
          "field": "body_files"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/files/{file_id}": {
      "method": "GET",
      "path": "/api/v4/files/{file_id}",
      "pagination": "none",
      "pathParams": [
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
    "GET /api/v4/files/{file_id}/thumbnail": {
      "method": "GET",
      "path": "/api/v4/files/{file_id}/thumbnail",
      "pagination": "none",
      "pathParams": [
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
    "GET /api/v4/files/{file_id}/preview": {
      "method": "GET",
      "path": "/api/v4/files/{file_id}/preview",
      "pagination": "none",
      "pathParams": [
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
    "GET /api/v4/files/{file_id}/info": {
      "method": "GET",
      "path": "/api/v4/files/{file_id}/info",
      "pagination": "none",
      "pathParams": [
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
  "groups": {
    "GET /api/v4/groups": {
      "method": "GET",
      "path": "/api/v4/groups",
      "pagination": "page-per-page",
      "pathParams": [],
      "queryParams": [
        {
          "name": "not_associated_to_team",
          "field": "query_not_associated_to_team"
        },
        {
          "name": "not_associated_to_channel",
          "field": "query_not_associated_to_channel"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/channels/{channel_id}/groups": {
      "method": "GET",
      "path": "/api/v4/channels/{channel_id}/groups",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "channel_id",
          "field": "path_channel_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/teams/{team_id}/groups": {
      "method": "GET",
      "path": "/api/v4/teams/{team_id}/groups",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/teams/{team_id}/groups_by_channels": {
      "method": "GET",
      "path": "/api/v4/teams/{team_id}/groups_by_channels",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/users/{user_id}/groups": {
      "method": "GET",
      "path": "/api/v4/users/{user_id}/groups",
      "pagination": "none",
      "pathParams": [
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
  "insights": {
    "GET /api/v4/teams/{team_id}/top/reactions": {
      "method": "GET",
      "path": "/api/v4/teams/{team_id}/top/reactions",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
        }
      ],
      "queryParams": [
        {
          "name": "time_range",
          "field": "query_time_range"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/users/me/top/reactions": {
      "method": "GET",
      "path": "/api/v4/users/me/top/reactions",
      "pagination": "page-per-page",
      "pathParams": [],
      "queryParams": [
        {
          "name": "time_range",
          "field": "query_time_range"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/teams/{team_id}/top/channels": {
      "method": "GET",
      "path": "/api/v4/teams/{team_id}/top/channels",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
        }
      ],
      "queryParams": [
        {
          "name": "time_range",
          "field": "query_time_range"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/users/me/top/channels": {
      "method": "GET",
      "path": "/api/v4/users/me/top/channels",
      "pagination": "page-per-page",
      "pathParams": [],
      "queryParams": [
        {
          "name": "time_range",
          "field": "query_time_range"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/teams/{team_id}/top/team_members": {
      "method": "GET",
      "path": "/api/v4/teams/{team_id}/top/team_members",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
        }
      ],
      "queryParams": [
        {
          "name": "time_range",
          "field": "query_time_range"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/teams/{team_id}/top/threads": {
      "method": "GET",
      "path": "/api/v4/teams/{team_id}/top/threads",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
        }
      ],
      "queryParams": [
        {
          "name": "time_range",
          "field": "query_time_range"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/users/me/top/threads": {
      "method": "GET",
      "path": "/api/v4/users/me/top/threads",
      "pagination": "page-per-page",
      "pathParams": [],
      "queryParams": [
        {
          "name": "time_range",
          "field": "query_time_range"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/users/me/top/dms": {
      "method": "GET",
      "path": "/api/v4/users/me/top/dms",
      "pagination": "page-per-page",
      "pathParams": [],
      "queryParams": [
        {
          "name": "time_range",
          "field": "query_time_range"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "posts": {
    "POST /api/v4/posts": {
      "method": "POST",
      "path": "/api/v4/posts",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "channel_id",
          "field": "body_channel_id"
        },
        {
          "name": "message",
          "field": "body_message"
        },
        {
          "name": "root_id",
          "field": "body_root_id"
        },
        {
          "name": "file_ids",
          "field": "body_file_ids"
        },
        {
          "name": "props",
          "field": "body_props"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /api/v4/posts/ephemeral": {
      "method": "POST",
      "path": "/api/v4/posts/ephemeral",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "user_id",
          "field": "body_user_id"
        },
        {
          "name": "post",
          "field": "body_post"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/posts/{post_id}": {
      "method": "GET",
      "path": "/api/v4/posts/{post_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "post_id",
          "field": "path_post_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /api/v4/posts/{post_id}": {
      "method": "DELETE",
      "path": "/api/v4/posts/{post_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "post_id",
          "field": "path_post_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /api/v4/users/{user_id}/posts/{post_id}/set_unread": {
      "method": "POST",
      "path": "/api/v4/users/{user_id}/posts/{post_id}/set_unread",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
        },
        {
          "name": "post_id",
          "field": "path_post_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /api/v4/posts/{post_id}/patch": {
      "method": "PUT",
      "path": "/api/v4/posts/{post_id}/patch",
      "pagination": "none",
      "pathParams": [
        {
          "name": "post_id",
          "field": "path_post_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "is_pinned",
          "field": "body_is_pinned"
        },
        {
          "name": "message",
          "field": "body_message"
        },
        {
          "name": "file_ids",
          "field": "body_file_ids"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /api/v4/posts/{post_id}/thread": {
      "method": "GET",
      "path": "/api/v4/posts/{post_id}/thread",
      "pagination": "none",
      "pathParams": [
        {
          "name": "post_id",
          "field": "path_post_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/users/{user_id}/posts/flagged": {
      "method": "GET",
      "path": "/api/v4/users/{user_id}/posts/flagged",
      "pagination": "page-per-page",
      "pathParams": [
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
    "GET /api/v4/posts/{post_id}/files/info": {
      "method": "GET",
      "path": "/api/v4/posts/{post_id}/files/info",
      "pagination": "none",
      "pathParams": [
        {
          "name": "post_id",
          "field": "path_post_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/channels/{channel_id}/posts": {
      "method": "GET",
      "path": "/api/v4/channels/{channel_id}/posts",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "channel_id",
          "field": "path_channel_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/users/{user_id}/channels/{channel_id}/posts/unread": {
      "method": "GET",
      "path": "/api/v4/users/{user_id}/channels/{channel_id}/posts/unread",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
        },
        {
          "name": "channel_id",
          "field": "path_channel_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /api/v4/teams/{team_id}/posts/search": {
      "method": "POST",
      "path": "/api/v4/teams/{team_id}/posts/search",
      "pagination": "none",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "terms",
          "field": "body_terms"
        },
        {
          "name": "is_or_search",
          "field": "body_is_or_search"
        },
        {
          "name": "time_zone_offset",
          "field": "body_time_zone_offset"
        },
        {
          "name": "include_deleted_channels",
          "field": "body_include_deleted_channels"
        },
        {
          "name": "page",
          "field": "body_page"
        },
        {
          "name": "per_page",
          "field": "body_per_page"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /api/v4/posts/{post_id}/pin": {
      "method": "POST",
      "path": "/api/v4/posts/{post_id}/pin",
      "pagination": "none",
      "pathParams": [
        {
          "name": "post_id",
          "field": "path_post_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /api/v4/posts/{post_id}/unpin": {
      "method": "POST",
      "path": "/api/v4/posts/{post_id}/unpin",
      "pagination": "none",
      "pathParams": [
        {
          "name": "post_id",
          "field": "path_post_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /api/v4/posts/{post_id}/actions/{action_id}": {
      "method": "POST",
      "path": "/api/v4/posts/{post_id}/actions/{action_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "post_id",
          "field": "path_post_id"
        },
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
    },
    "POST /api/v4/posts/ids": {
      "method": "POST",
      "path": "/api/v4/posts/ids",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": "body"
    },
    "POST /api/v4/users/{user_id}/posts/{post_id}/reminder": {
      "method": "POST",
      "path": "/api/v4/users/{user_id}/posts/{post_id}/reminder",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
        },
        {
          "name": "post_id",
          "field": "path_post_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "target_time",
          "field": "body_target_time"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "preferences": {
    "GET /api/v4/users/{user_id}/preferences": {
      "method": "GET",
      "path": "/api/v4/users/{user_id}/preferences",
      "pagination": "none",
      "pathParams": [
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
    "PUT /api/v4/users/{user_id}/preferences": {
      "method": "PUT",
      "path": "/api/v4/users/{user_id}/preferences",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": "body"
    },
    "POST /api/v4/users/{user_id}/preferences/delete": {
      "method": "POST",
      "path": "/api/v4/users/{user_id}/preferences/delete",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": "body"
    },
    "GET /api/v4/users/{user_id}/preferences/{category}": {
      "method": "GET",
      "path": "/api/v4/users/{user_id}/preferences/{category}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
        },
        {
          "name": "category",
          "field": "path_category"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/users/{user_id}/preferences/{category}/name/{preference_name}": {
      "method": "GET",
      "path": "/api/v4/users/{user_id}/preferences/{category}/name/{preference_name}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
        },
        {
          "name": "category",
          "field": "path_category"
        },
        {
          "name": "preference_name",
          "field": "path_preference_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "reactions": {
    "POST /api/v4/reactions": {
      "method": "POST",
      "path": "/api/v4/reactions",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "user_id",
          "field": "body_user_id"
        },
        {
          "name": "post_id",
          "field": "body_post_id"
        },
        {
          "name": "emoji_name",
          "field": "body_emoji_name"
        },
        {
          "name": "create_at",
          "field": "body_create_at"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /api/v4/posts/{post_id}/reactions": {
      "method": "GET",
      "path": "/api/v4/posts/{post_id}/reactions",
      "pagination": "none",
      "pathParams": [
        {
          "name": "post_id",
          "field": "path_post_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /api/v4/users/{user_id}/posts/{post_id}/reactions/{emoji_name}": {
      "method": "DELETE",
      "path": "/api/v4/users/{user_id}/posts/{post_id}/reactions/{emoji_name}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
        },
        {
          "name": "post_id",
          "field": "path_post_id"
        },
        {
          "name": "emoji_name",
          "field": "path_emoji_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "roles": {
    "GET /api/v4/roles": {
      "method": "GET",
      "path": "/api/v4/roles",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/roles/{role_id}": {
      "method": "GET",
      "path": "/api/v4/roles/{role_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "role_id",
          "field": "path_role_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/roles/name/{role_name}": {
      "method": "GET",
      "path": "/api/v4/roles/name/{role_name}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "role_name",
          "field": "path_role_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /api/v4/roles/names": {
      "method": "POST",
      "path": "/api/v4/roles/names",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": "body"
    }
  },
  "status": {
    "GET /api/v4/users/{user_id}/status": {
      "method": "GET",
      "path": "/api/v4/users/{user_id}/status",
      "pagination": "none",
      "pathParams": [
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
    "PUT /api/v4/users/{user_id}/status": {
      "method": "PUT",
      "path": "/api/v4/users/{user_id}/status",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "user_id",
          "field": "body_user_id"
        },
        {
          "name": "status",
          "field": "body_status"
        },
        {
          "name": "dnd_end_time",
          "field": "body_dnd_end_time"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /api/v4/users/status/ids": {
      "method": "POST",
      "path": "/api/v4/users/status/ids",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": "body"
    },
    "PUT /api/v4/users/{user_id}/status/custom": {
      "method": "PUT",
      "path": "/api/v4/users/{user_id}/status/custom",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "emoji",
          "field": "body_emoji"
        },
        {
          "name": "text",
          "field": "body_text"
        },
        {
          "name": "duration",
          "field": "body_duration"
        },
        {
          "name": "expires_at",
          "field": "body_expires_at"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /api/v4/users/{user_id}/status/custom": {
      "method": "DELETE",
      "path": "/api/v4/users/{user_id}/status/custom",
      "pagination": "none",
      "pathParams": [
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
    "POST /api/v4/users/{user_id}/status/custom/recent/delete": {
      "method": "POST",
      "path": "/api/v4/users/{user_id}/status/custom/recent/delete",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "emoji",
          "field": "body_emoji"
        },
        {
          "name": "text",
          "field": "body_text"
        },
        {
          "name": "duration",
          "field": "body_duration"
        },
        {
          "name": "expires_at",
          "field": "body_expires_at"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "system": {
    "GET /api/v4/config/client": {
      "method": "GET",
      "path": "/api/v4/config/client",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [
        {
          "name": "format",
          "field": "query_format"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "teams": {
    "GET /api/v4/teams": {
      "method": "GET",
      "path": "/api/v4/teams",
      "pagination": "page-per-page",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/teams/{team_id}": {
      "method": "GET",
      "path": "/api/v4/teams/{team_id}",
      "pagination": "none",
      "pathParams": [
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
    },
    "GET /api/v4/teams/name/{name}": {
      "method": "GET",
      "path": "/api/v4/teams/name/{name}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "name",
          "field": "path_name"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/users/{user_id}/teams": {
      "method": "GET",
      "path": "/api/v4/users/{user_id}/teams",
      "pagination": "none",
      "pathParams": [
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
    "GET /api/v4/teams/{team_id}/members": {
      "method": "GET",
      "path": "/api/v4/teams/{team_id}/members",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/users/{user_id}/teams/members": {
      "method": "GET",
      "path": "/api/v4/users/{user_id}/teams/members",
      "pagination": "none",
      "pathParams": [
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
    "GET /api/v4/teams/{team_id}/members/{user_id}": {
      "method": "GET",
      "path": "/api/v4/teams/{team_id}/members/{user_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
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
    "POST /api/v4/teams/{team_id}/members/ids": {
      "method": "POST",
      "path": "/api/v4/teams/{team_id}/members/ids",
      "pagination": "none",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": "body"
    },
    "GET /api/v4/teams/{team_id}/stats": {
      "method": "GET",
      "path": "/api/v4/teams/{team_id}/stats",
      "pagination": "none",
      "pathParams": [
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
    },
    "PUT /api/v4/teams/{team_id}/members/{user_id}/roles": {
      "method": "PUT",
      "path": "/api/v4/teams/{team_id}/members/{user_id}/roles",
      "pagination": "none",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
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
    "GET /api/v4/users/{user_id}/teams/unread": {
      "method": "GET",
      "path": "/api/v4/users/{user_id}/teams/unread",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
        }
      ],
      "queryParams": [
        {
          "name": "exclude_team",
          "field": "query_exclude_team"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/users/{user_id}/teams/{team_id}/unread": {
      "method": "GET",
      "path": "/api/v4/users/{user_id}/teams/{team_id}/unread",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
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
    },
    "POST /api/v4/teams/{team_id}/invite-guests/email": {
      "method": "POST",
      "path": "/api/v4/teams/{team_id}/invite-guests/email",
      "pagination": "none",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
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
          "name": "channels",
          "field": "body_channels"
        },
        {
          "name": "message",
          "field": "body_message"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /api/v4/teams/{team_id}/files/search": {
      "method": "POST",
      "path": "/api/v4/teams/{team_id}/files/search",
      "pagination": "none",
      "pathParams": [
        {
          "name": "team_id",
          "field": "path_team_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "terms",
          "field": "body_terms"
        },
        {
          "name": "is_or_search",
          "field": "body_is_or_search"
        },
        {
          "name": "time_zone_offset",
          "field": "body_time_zone_offset"
        },
        {
          "name": "include_deleted_channels",
          "field": "body_include_deleted_channels"
        },
        {
          "name": "page",
          "field": "body_page"
        },
        {
          "name": "per_page",
          "field": "body_per_page"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "threads": {
    "GET /api/v4/users/{user_id}/teams/{team_id}/threads": {
      "method": "GET",
      "path": "/api/v4/users/{user_id}/teams/{team_id}/threads",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
        },
        {
          "name": "team_id",
          "field": "path_team_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /api/v4/users/{user_id}/teams/{team_id}/threads/read": {
      "method": "PUT",
      "path": "/api/v4/users/{user_id}/teams/{team_id}/threads/read",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
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
    },
    "PUT /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/read/{timestamp}": {
      "method": "PUT",
      "path": "/api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/read/{timestamp}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
        },
        {
          "name": "team_id",
          "field": "path_team_id"
        },
        {
          "name": "thread_id",
          "field": "path_thread_id"
        },
        {
          "name": "timestamp",
          "field": "path_timestamp"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/set_unread/{post_id}": {
      "method": "PUT",
      "path": "/api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/set_unread/{post_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
        },
        {
          "name": "team_id",
          "field": "path_team_id"
        },
        {
          "name": "thread_id",
          "field": "path_thread_id"
        },
        {
          "name": "post_id",
          "field": "path_post_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/following": {
      "method": "PUT",
      "path": "/api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/following",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
        },
        {
          "name": "team_id",
          "field": "path_team_id"
        },
        {
          "name": "thread_id",
          "field": "path_thread_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/following": {
      "method": "DELETE",
      "path": "/api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/following",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
        },
        {
          "name": "team_id",
          "field": "path_team_id"
        },
        {
          "name": "thread_id",
          "field": "path_thread_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}": {
      "method": "GET",
      "path": "/api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
        },
        {
          "name": "team_id",
          "field": "path_team_id"
        },
        {
          "name": "thread_id",
          "field": "path_thread_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "users": {
    "GET /api/v4/users": {
      "method": "GET",
      "path": "/api/v4/users",
      "pagination": "page-per-page",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /api/v4/users/ids": {
      "method": "POST",
      "path": "/api/v4/users/ids",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": "body"
    },
    "POST /api/v4/users/group_channels": {
      "method": "POST",
      "path": "/api/v4/users/group_channels",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": "body"
    },
    "POST /api/v4/users/usernames": {
      "method": "POST",
      "path": "/api/v4/users/usernames",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": "body"
    },
    "POST /api/v4/users/search": {
      "method": "POST",
      "path": "/api/v4/users/search",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "term",
          "field": "body_term"
        },
        {
          "name": "team_id",
          "field": "body_team_id"
        },
        {
          "name": "not_in_team_id",
          "field": "body_not_in_team_id"
        },
        {
          "name": "in_channel_id",
          "field": "body_in_channel_id"
        },
        {
          "name": "not_in_channel_id",
          "field": "body_not_in_channel_id"
        },
        {
          "name": "in_group_id",
          "field": "body_in_group_id"
        },
        {
          "name": "group_constrained",
          "field": "body_group_constrained"
        },
        {
          "name": "allow_inactive",
          "field": "body_allow_inactive"
        },
        {
          "name": "without_team",
          "field": "body_without_team"
        },
        {
          "name": "limit",
          "field": "body_limit"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /api/v4/users/autocomplete": {
      "method": "GET",
      "path": "/api/v4/users/autocomplete",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [
        {
          "name": "name",
          "field": "query_name"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/users/{user_id}": {
      "method": "GET",
      "path": "/api/v4/users/{user_id}",
      "pagination": "none",
      "pathParams": [
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
    "PUT /api/v4/users/{user_id}/patch": {
      "method": "PUT",
      "path": "/api/v4/users/{user_id}/patch",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
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
          "name": "username",
          "field": "body_username"
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
          "name": "nickname",
          "field": "body_nickname"
        },
        {
          "name": "locale",
          "field": "body_locale"
        },
        {
          "name": "position",
          "field": "body_position"
        },
        {
          "name": "props",
          "field": "body_props"
        },
        {
          "name": "notify_props",
          "field": "body_notify_props"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "PUT /api/v4/users/{user_id}/roles": {
      "method": "PUT",
      "path": "/api/v4/users/{user_id}/roles",
      "pagination": "none",
      "pathParams": [
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
    "GET /api/v4/users/{user_id}/image": {
      "method": "GET",
      "path": "/api/v4/users/{user_id}/image",
      "pagination": "none",
      "pathParams": [
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
    "GET /api/v4/users/{user_id}/image/default": {
      "method": "GET",
      "path": "/api/v4/users/{user_id}/image/default",
      "pagination": "none",
      "pathParams": [
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
    "GET /api/v4/users/username/{username}": {
      "method": "GET",
      "path": "/api/v4/users/username/{username}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "username",
          "field": "path_username"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/users/email/{email}": {
      "method": "GET",
      "path": "/api/v4/users/email/{email}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "email",
          "field": "path_email"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /api/v4/users/{user_id}/typing": {
      "method": "POST",
      "path": "/api/v4/users/{user_id}/typing",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user_id",
          "field": "path_user_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "channel_id",
          "field": "body_channel_id"
        },
        {
          "name": "parent_id",
          "field": "body_parent_id"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /api/v4/users/{user_id}/channel_members": {
      "method": "GET",
      "path": "/api/v4/users/{user_id}/channel_members",
      "pagination": "none",
      "pathParams": [
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
    }
  },
  "webhooks": {
    "GET /api/v4/hooks/incoming": {
      "method": "GET",
      "path": "/api/v4/hooks/incoming",
      "pagination": "page-per-page",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /api/v4/hooks/incoming": {
      "method": "POST",
      "path": "/api/v4/hooks/incoming",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "channel_id",
          "field": "body_channel_id"
        },
        {
          "name": "user_id",
          "field": "body_user_id"
        },
        {
          "name": "display_name",
          "field": "body_display_name"
        },
        {
          "name": "description",
          "field": "body_description"
        },
        {
          "name": "username",
          "field": "body_username"
        },
        {
          "name": "icon_url",
          "field": "body_icon_url"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /api/v4/hooks/incoming/{hook_id}": {
      "method": "GET",
      "path": "/api/v4/hooks/incoming/{hook_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "hook_id",
          "field": "path_hook_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /api/v4/hooks/incoming/{hook_id}": {
      "method": "PUT",
      "path": "/api/v4/hooks/incoming/{hook_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "hook_id",
          "field": "path_hook_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "id",
          "field": "body_id"
        },
        {
          "name": "channel_id",
          "field": "body_channel_id"
        },
        {
          "name": "display_name",
          "field": "body_display_name"
        },
        {
          "name": "description",
          "field": "body_description"
        },
        {
          "name": "username",
          "field": "body_username"
        },
        {
          "name": "icon_url",
          "field": "body_icon_url"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /api/v4/hooks/incoming/{hook_id}": {
      "method": "DELETE",
      "path": "/api/v4/hooks/incoming/{hook_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "hook_id",
          "field": "path_hook_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /api/v4/hooks/outgoing": {
      "method": "GET",
      "path": "/api/v4/hooks/outgoing",
      "pagination": "page-per-page",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /api/v4/hooks/outgoing": {
      "method": "POST",
      "path": "/api/v4/hooks/outgoing",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "team_id",
          "field": "body_team_id"
        },
        {
          "name": "channel_id",
          "field": "body_channel_id"
        },
        {
          "name": "creator_id",
          "field": "body_creator_id"
        },
        {
          "name": "description",
          "field": "body_description"
        },
        {
          "name": "display_name",
          "field": "body_display_name"
        },
        {
          "name": "trigger_words",
          "field": "body_trigger_words"
        },
        {
          "name": "trigger_when",
          "field": "body_trigger_when"
        },
        {
          "name": "callback_urls",
          "field": "body_callback_urls"
        },
        {
          "name": "content_type",
          "field": "body_content_type"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /api/v4/hooks/outgoing/{hook_id}": {
      "method": "GET",
      "path": "/api/v4/hooks/outgoing/{hook_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "hook_id",
          "field": "path_hook_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /api/v4/hooks/outgoing/{hook_id}": {
      "method": "PUT",
      "path": "/api/v4/hooks/outgoing/{hook_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "hook_id",
          "field": "path_hook_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "id",
          "field": "body_id"
        },
        {
          "name": "channel_id",
          "field": "body_channel_id"
        },
        {
          "name": "display_name",
          "field": "body_display_name"
        },
        {
          "name": "description",
          "field": "body_description"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /api/v4/hooks/outgoing/{hook_id}": {
      "method": "DELETE",
      "path": "/api/v4/hooks/outgoing/{hook_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "hook_id",
          "field": "path_hook_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /api/v4/hooks/outgoing/{hook_id}/regen_token": {
      "method": "POST",
      "path": "/api/v4/hooks/outgoing/{hook_id}/regen_token",
      "pagination": "none",
      "pathParams": [
        {
          "name": "hook_id",
          "field": "path_hook_id"
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

export class InfomaniakKchat implements INodeType {
	description: INodeTypeDescription = {
  "displayName": "Infomaniak Kchat",
  "name": "infomaniakKchat",
  "icon": "file:../../icons/kChat.svg",
  "group": [
    "output"
  ],
  "version": 1,
  "description": "Interact with Infomaniak Kchat API",
  "defaults": {
    "name": "Infomaniak Kchat"
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
          "name": "Bots",
          "value": "bots"
        },
        {
          "name": "Channels",
          "value": "channels"
        },
        {
          "name": "Commands",
          "value": "commands"
        },
        {
          "name": "Emoji",
          "value": "emoji"
        },
        {
          "name": "Files",
          "value": "files"
        },
        {
          "name": "Groups",
          "value": "groups"
        },
        {
          "name": "Insights",
          "value": "insights"
        },
        {
          "name": "Posts",
          "value": "posts"
        },
        {
          "name": "Preferences",
          "value": "preferences"
        },
        {
          "name": "Reactions",
          "value": "reactions"
        },
        {
          "name": "Roles",
          "value": "roles"
        },
        {
          "name": "Status",
          "value": "status"
        },
        {
          "name": "System",
          "value": "system"
        },
        {
          "name": "Teams",
          "value": "teams"
        },
        {
          "name": "Threads",
          "value": "threads"
        },
        {
          "name": "Users",
          "value": "users"
        },
        {
          "name": "Webhooks",
          "value": "webhooks"
        }
      ],
      "default": "bots",
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
            "bots"
          ]
        }
      },
      "options": [
        {
          "name": "Get Bots",
          "value": "GET /api/v4/bots"
        },
        {
          "name": "Create A Bot",
          "value": "POST /api/v4/bots"
        },
        {
          "name": "Get A Bot",
          "value": "GET /api/v4/bots/{bot_user_id}"
        },
        {
          "name": "Patch A Bot",
          "value": "PUT /api/v4/bots/{bot_user_id}"
        },
        {
          "name": "Disable A Bot",
          "value": "POST /api/v4/bots/{bot_user_id}/disable"
        },
        {
          "name": "Enable A Bot",
          "value": "POST /api/v4/bots/{bot_user_id}/enable"
        }
      ],
      "default": "GET /api/v4/bots",
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
            "bots"
          ],
          "operation": [
            "GET /api/v4/bots"
          ]
        }
      },
      "options": [
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select."
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of users per page. There is a maximum limit of 200 users per page."
        },
        {
          "displayName": "Include Deleted",
          "name": "query_include_deleted",
          "type": "boolean",
          "default": false,
          "description": "If deleted bots should be returned."
        },
        {
          "displayName": "Only Orphaned",
          "name": "query_only_orphaned",
          "type": "boolean",
          "default": false,
          "description": "When true, only orphaned bots will be returned. A bot is consitered orphaned if it's owner has been deactivated."
        }
      ]
    },
    {
      "displayName": "Username",
      "name": "body_username",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "bots"
          ],
          "operation": [
            "POST /api/v4/bots"
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
            "bots"
          ],
          "operation": [
            "POST /api/v4/bots"
          ]
        }
      },
      "options": [
        {
          "displayName": "Display Name",
          "name": "body_display_name",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Bot User Id",
      "name": "path_bot_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "bots"
          ],
          "operation": [
            "GET /api/v4/bots/{bot_user_id}"
          ]
        }
      },
      "required": true,
      "description": "Bot user ID"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "bots"
          ],
          "operation": [
            "GET /api/v4/bots/{bot_user_id}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Include Deleted",
          "name": "query_include_deleted",
          "type": "boolean",
          "default": false,
          "description": "If deleted bots should be returned."
        }
      ]
    },
    {
      "displayName": "Bot User Id",
      "name": "path_bot_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "bots"
          ],
          "operation": [
            "PUT /api/v4/bots/{bot_user_id}"
          ]
        }
      },
      "required": true,
      "description": "Bot user ID"
    },
    {
      "displayName": "Username",
      "name": "body_username",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "bots"
          ],
          "operation": [
            "PUT /api/v4/bots/{bot_user_id}"
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
            "bots"
          ],
          "operation": [
            "PUT /api/v4/bots/{bot_user_id}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Display Name",
          "name": "body_display_name",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Bot User Id",
      "name": "path_bot_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "bots"
          ],
          "operation": [
            "POST /api/v4/bots/{bot_user_id}/disable"
          ]
        }
      },
      "required": true,
      "description": "Bot user ID"
    },
    {
      "displayName": "Bot User Id",
      "name": "path_bot_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "bots"
          ],
          "operation": [
            "POST /api/v4/bots/{bot_user_id}/enable"
          ]
        }
      },
      "required": true,
      "description": "Bot user ID"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ]
        }
      },
      "options": [
        {
          "name": "Get A List Of All Channels",
          "value": "GET /api/v4/channels"
        },
        {
          "name": "Create A Channel",
          "value": "POST /api/v4/channels"
        },
        {
          "name": "Create A Direct Message Channel",
          "value": "POST /api/v4/channels/direct"
        },
        {
          "name": "Create A Group Message Channel",
          "value": "POST /api/v4/channels/group"
        },
        {
          "name": "Search All Private And Open Type Channels",
          "value": "POST /api/v4/channels/search"
        },
        {
          "name": "Search Group Channels",
          "value": "POST /api/v4/channels/group/search"
        },
        {
          "name": "Get A List Of Channels By Ids",
          "value": "POST /api/v4/teams/{team_id}/channels/ids"
        },
        {
          "name": "Get A Channel",
          "value": "GET /api/v4/channels/{channel_id}"
        },
        {
          "name": "Update A Channel",
          "value": "PUT /api/v4/channels/{channel_id}"
        },
        {
          "name": "Delete A Channel",
          "value": "DELETE /api/v4/channels/{channel_id}"
        },
        {
          "name": "Patch A Channel",
          "value": "PUT /api/v4/channels/{channel_id}/patch"
        },
        {
          "name": "Update Channel's Privacy",
          "value": "PUT /api/v4/channels/{channel_id}/privacy"
        },
        {
          "name": "Restore A Channel",
          "value": "POST /api/v4/channels/{channel_id}/restore"
        },
        {
          "name": "Move A Channel",
          "value": "POST /api/v4/channels/{channel_id}/move"
        },
        {
          "name": "Get Channel Statistics",
          "value": "GET /api/v4/channels/{channel_id}/stats"
        },
        {
          "name": "Get A Channel's Pinned Posts",
          "value": "GET /api/v4/channels/{channel_id}/pinned"
        },
        {
          "name": "Get Public Channels",
          "value": "GET /api/v4/teams/{team_id}/channels"
        },
        {
          "name": "Get Private Channels",
          "value": "GET /api/v4/teams/{team_id}/channels/private"
        },
        {
          "name": "Get Deleted Channels",
          "value": "GET /api/v4/teams/{team_id}/channels/deleted"
        },
        {
          "name": "Autocomplete Channels",
          "value": "GET /api/v4/teams/{team_id}/channels/autocomplete"
        },
        {
          "name": "Autocomplete Channels For Search",
          "value": "GET /api/v4/teams/{team_id}/channels/search_autocomplete"
        },
        {
          "name": "Search Channels",
          "value": "POST /api/v4/teams/{team_id}/channels/search"
        },
        {
          "name": "Search Archived Channels",
          "value": "POST /api/v4/teams/{team_id}/channels/search_archived"
        },
        {
          "name": "Get A Channel By Name",
          "value": "GET /api/v4/teams/{team_id}/channels/name/{channel_name}"
        },
        {
          "name": "Get A Channel By Name And Team Name",
          "value": "GET /api/v4/teams/name/{team_name}/channels/name/{channel_name}"
        },
        {
          "name": "Get Channel Members",
          "value": "GET /api/v4/channels/{channel_id}/members"
        },
        {
          "name": "Add User(s) To Channel",
          "value": "POST /api/v4/channels/{channel_id}/members"
        },
        {
          "name": "Get Channel Members By Ids",
          "value": "POST /api/v4/channels/{channel_id}/members/ids"
        },
        {
          "name": "Get Channel Member",
          "value": "GET /api/v4/channels/{channel_id}/members/{user_id}"
        },
        {
          "name": "Remove User From Channel",
          "value": "DELETE /api/v4/channels/{channel_id}/members/{user_id}"
        },
        {
          "name": "Update Channel Roles",
          "value": "PUT /api/v4/channels/{channel_id}/members/{user_id}/roles"
        },
        {
          "name": "Update The Scheme Derived Roles Of A Channel Member.",
          "value": "PUT /api/v4/channels/{channel_id}/members/{user_id}/schemeRoles"
        },
        {
          "name": "Update Channel Notifications",
          "value": "PUT /api/v4/channels/{channel_id}/members/{user_id}/notify_props"
        },
        {
          "name": "View Channel",
          "value": "POST /api/v4/channels/members/{user_id}/view"
        },
        {
          "name": "Get Channel Memberships And Roles For A User",
          "value": "GET /api/v4/users/{user_id}/teams/{team_id}/channels/members"
        },
        {
          "name": "Get Channels For User",
          "value": "GET /api/v4/users/{user_id}/teams/{team_id}/channels"
        },
        {
          "name": "Get All Channels",
          "value": "GET /api/v4/users/{user_id}/channels"
        },
        {
          "name": "Get Unread Messages",
          "value": "GET /api/v4/users/{user_id}/channels/{channel_id}/unread"
        },
        {
          "name": "Set A Channel's Scheme",
          "value": "PUT /api/v4/channels/{channel_id}/scheme"
        },
        {
          "name": "Get Information About Channel's Moderation.",
          "value": "GET /api/v4/channels/{channel_id}/moderations"
        },
        {
          "name": "Update A Channel's Moderation Settings.",
          "value": "PUT /api/v4/channels/{channel_id}/moderations/patch"
        },
        {
          "name": "Get User's Sidebar Categories",
          "value": "GET /api/v4/users/{user_id}/teams/{team_id}/channels/categories"
        },
        {
          "name": "Create User's Sidebar Category",
          "value": "POST /api/v4/users/{user_id}/teams/{team_id}/channels/categories"
        },
        {
          "name": "Update User's Sidebar Categories",
          "value": "PUT /api/v4/users/{user_id}/teams/{team_id}/channels/categories"
        },
        {
          "name": "Get User's Sidebar Category Order",
          "value": "GET /api/v4/users/{user_id}/teams/{team_id}/channels/categories/order"
        },
        {
          "name": "Update User's Sidebar Category Order",
          "value": "PUT /api/v4/users/{user_id}/teams/{team_id}/channels/categories/order"
        },
        {
          "name": "Get Sidebar Category",
          "value": "GET /api/v4/users/{user_id}/teams/{team_id}/channels/categories/{category_id}"
        },
        {
          "name": "Update Sidebar Category",
          "value": "PUT /api/v4/users/{user_id}/teams/{team_id}/channels/categories/{category_id}"
        },
        {
          "name": "Delete Sidebar Category",
          "value": "DELETE /api/v4/users/{user_id}/teams/{team_id}/channels/categories/{category_id}"
        }
      ],
      "default": "GET /api/v4/channels",
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
            "channels"
          ],
          "operation": [
            "GET /api/v4/channels"
          ]
        }
      },
      "options": [
        {
          "displayName": "Not Associated To Group",
          "name": "query_not_associated_to_group",
          "type": "string",
          "default": "",
          "description": "A group id to exclude channels that are associated with that group via GroupChannel records. This can also be left blank with `not_associated_to_group=`."
        },
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select."
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of channels per page."
        },
        {
          "displayName": "Exclude Default Channels",
          "name": "query_exclude_default_channels",
          "type": "boolean",
          "default": false,
          "description": "Whether to exclude default channels (ex Town Square, Off-Topic) from the results."
        },
        {
          "displayName": "Include Deleted",
          "name": "query_include_deleted",
          "type": "boolean",
          "default": false,
          "description": "Include channels that have been archived. This correlates to the `DeleteAt` flag being set in the database."
        },
        {
          "displayName": "Include Total Count",
          "name": "query_include_total_count",
          "type": "boolean",
          "default": false,
          "description": "Appends a total count of returned channels inside the response object - ex: `{ \"channels\": [], \"total_count\" : 0 }`.      "
        },
        {
          "displayName": "Exclude Policy Constrained",
          "name": "query_exclude_policy_constrained",
          "type": "boolean",
          "default": false,
          "description": "If set to true, channels which are part of a data retention policy will be excluded. The `sysconsole_read_compliance` permission is required to use this parameter.\n"
        }
      ]
    },
    {
      "displayName": "Team Id",
      "name": "body_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "POST /api/v4/channels"
          ]
        }
      },
      "required": true,
      "description": "The team ID of the team to create the channel on"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "POST /api/v4/channels"
          ]
        }
      },
      "required": true,
      "description": "The unique handle for the channel, will be present in the channel URL"
    },
    {
      "displayName": "Display Name",
      "name": "body_display_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "POST /api/v4/channels"
          ]
        }
      },
      "required": true,
      "description": "The non-unique UI name for the channel"
    },
    {
      "displayName": "Type",
      "name": "body_type",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "POST /api/v4/channels"
          ]
        }
      },
      "required": true,
      "description": "'O' for a public channel, 'P' for a private channel"
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
            "channels"
          ],
          "operation": [
            "POST /api/v4/channels"
          ]
        }
      },
      "options": [
        {
          "displayName": "Purpose",
          "name": "body_purpose",
          "type": "string",
          "default": "",
          "description": "A short description of the purpose of the channel"
        },
        {
          "displayName": "Header",
          "name": "body_header",
          "type": "string",
          "default": "",
          "description": "Markdown-formatted text to display in the header of the channel"
        }
      ]
    },
    {
      "displayName": "Body",
      "name": "body",
      "type": "json",
      "default": {},
      "required": true,
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "POST /api/v4/channels/direct"
          ]
        }
      }
    },
    {
      "displayName": "Body",
      "name": "body",
      "type": "json",
      "default": {},
      "required": true,
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "POST /api/v4/channels/group"
          ]
        }
      }
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "POST /api/v4/channels/search"
          ]
        }
      },
      "options": [
        {
          "displayName": "System Console",
          "name": "query_system_console",
          "type": "boolean",
          "default": false,
          "description": "Is the request from system_console. If this is set to true, it filters channels by the logged in user.\n"
        }
      ]
    },
    {
      "displayName": "Term",
      "name": "body_term",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "POST /api/v4/channels/search"
          ]
        }
      },
      "required": true,
      "description": "The string to search in the channel name, display name, and purpose."
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
            "channels"
          ],
          "operation": [
            "POST /api/v4/channels/search"
          ]
        }
      },
      "options": [
        {
          "displayName": "Not Associated To Group",
          "name": "body_not_associated_to_group",
          "type": "string",
          "default": "",
          "description": "A group id to exclude channels that are associated to that group via GroupChannel records."
        },
        {
          "displayName": "Exclude Default Channels",
          "name": "body_exclude_default_channels",
          "type": "boolean",
          "default": false,
          "description": "Exclude default channels from the results by setting this parameter to true."
        },
        {
          "displayName": "Team Ids",
          "name": "body_team_ids",
          "type": "json",
          "default": {},
          "description": "Filters results to channels belonging to the given team ids\n\n"
        },
        {
          "displayName": "Group Constrained",
          "name": "body_group_constrained",
          "type": "boolean",
          "default": false,
          "description": "Filters results to only return channels constrained to a group\n\n"
        },
        {
          "displayName": "Exclude Group Constrained",
          "name": "body_exclude_group_constrained",
          "type": "boolean",
          "default": false,
          "description": "Filters results to exclude channels constrained to a group\n\n"
        },
        {
          "displayName": "Public",
          "name": "body_public",
          "type": "boolean",
          "default": false,
          "description": "Filters results to only return Public / Open channels, can be used in conjunction with `private` to return both `public` and `private` channels\n\n"
        },
        {
          "displayName": "Private",
          "name": "body_private",
          "type": "boolean",
          "default": false,
          "description": "Filters results to only return Private channels, can be used in conjunction with `public` to return both `private` and `public` channels\n\n"
        },
        {
          "displayName": "Deleted",
          "name": "body_deleted",
          "type": "boolean",
          "default": false,
          "description": "Filters results to only return deleted / archived channels\n\n"
        },
        {
          "displayName": "Page",
          "name": "body_page",
          "type": "number",
          "default": 0,
          "description": "The page number to return, if paginated. If this parameter is not present with the `per_page` parameter then the results will be returned un-paged."
        },
        {
          "displayName": "Per Page",
          "name": "body_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of entries to return per page, if paginated. If this parameter is not present with the `page` parameter then the results will be returned un-paged."
        },
        {
          "displayName": "Exclude Policy Constrained",
          "name": "body_exclude_policy_constrained",
          "type": "boolean",
          "default": false,
          "description": "If set to true, only channels which do not have a granular retention policy assigned to them will be returned. The `sysconsole_read_compliance_data_retention` permission is required to use this parameter.\n\n"
        },
        {
          "displayName": "Include Search By Id",
          "name": "body_include_search_by_id",
          "type": "boolean",
          "default": false,
          "description": "If set to true, returns channels where given search 'term' matches channel ID.\n\n"
        }
      ]
    },
    {
      "displayName": "Term",
      "name": "body_term",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "POST /api/v4/channels/group/search"
          ]
        }
      },
      "required": true,
      "description": "The search term to match against the members' usernames of the group channels"
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "POST /api/v4/teams/{team_id}/channels/ids"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "Body",
      "name": "body",
      "type": "json",
      "default": {},
      "required": true,
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "POST /api/v4/teams/{team_id}/channels/ids"
          ]
        }
      }
    },
    {
      "displayName": "Channel Id",
      "name": "path_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/channels/{channel_id}"
          ]
        }
      },
      "required": true,
      "description": "Channel GUID"
    },
    {
      "displayName": "Channel Id",
      "name": "path_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/channels/{channel_id}"
          ]
        }
      },
      "required": true,
      "description": "Channel GUID"
    },
    {
      "displayName": "Id",
      "name": "body_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/channels/{channel_id}"
          ]
        }
      },
      "required": true,
      "description": "The channel's id, not updatable"
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
            "channels"
          ],
          "operation": [
            "PUT /api/v4/channels/{channel_id}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "The unique handle for the channel, will be present in the channel URL"
        },
        {
          "displayName": "Display Name",
          "name": "body_display_name",
          "type": "string",
          "default": "",
          "description": "The non-unique UI name for the channel"
        },
        {
          "displayName": "Purpose",
          "name": "body_purpose",
          "type": "string",
          "default": "",
          "description": "A short description of the purpose of the channel"
        },
        {
          "displayName": "Header",
          "name": "body_header",
          "type": "string",
          "default": "",
          "description": "Markdown-formatted text to display in the header of the channel"
        }
      ]
    },
    {
      "displayName": "Channel Id",
      "name": "path_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "DELETE /api/v4/channels/{channel_id}"
          ]
        }
      },
      "required": true,
      "description": "Channel GUID"
    },
    {
      "displayName": "Channel Id",
      "name": "path_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/channels/{channel_id}/patch"
          ]
        }
      },
      "required": true,
      "description": "Channel GUID"
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
            "channels"
          ],
          "operation": [
            "PUT /api/v4/channels/{channel_id}/patch"
          ]
        }
      },
      "options": [
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "The unique handle for the channel, will be present in the channel URL"
        },
        {
          "displayName": "Display Name",
          "name": "body_display_name",
          "type": "string",
          "default": "",
          "description": "The non-unique UI name for the channel"
        },
        {
          "displayName": "Purpose",
          "name": "body_purpose",
          "type": "string",
          "default": "",
          "description": "A short description of the purpose of the channel"
        },
        {
          "displayName": "Header",
          "name": "body_header",
          "type": "string",
          "default": "",
          "description": "Markdown-formatted text to display in the header of the channel"
        }
      ]
    },
    {
      "displayName": "Channel Id",
      "name": "path_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/channels/{channel_id}/privacy"
          ]
        }
      },
      "required": true,
      "description": "Channel GUID"
    },
    {
      "displayName": "Privacy",
      "name": "body_privacy",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/channels/{channel_id}/privacy"
          ]
        }
      },
      "required": true,
      "description": "Channel privacy setting: 'O' for a public channel, 'P' for a private channel"
    },
    {
      "displayName": "Channel Id",
      "name": "path_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "POST /api/v4/channels/{channel_id}/restore"
          ]
        }
      },
      "required": true,
      "description": "Channel GUID"
    },
    {
      "displayName": "Channel Id",
      "name": "path_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "POST /api/v4/channels/{channel_id}/move"
          ]
        }
      },
      "required": true,
      "description": "Channel GUID"
    },
    {
      "displayName": "Team Id",
      "name": "body_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "POST /api/v4/channels/{channel_id}/move"
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
            "channels"
          ],
          "operation": [
            "POST /api/v4/channels/{channel_id}/move"
          ]
        }
      },
      "options": [
        {
          "displayName": "Force",
          "name": "body_force",
          "type": "boolean",
          "default": false,
          "description": "Remove members those are not member of target team before moving the channel."
        }
      ]
    },
    {
      "displayName": "Channel Id",
      "name": "path_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/channels/{channel_id}/stats"
          ]
        }
      },
      "required": true,
      "description": "Channel GUID"
    },
    {
      "displayName": "Channel Id",
      "name": "path_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/channels/{channel_id}/pinned"
          ]
        }
      },
      "required": true,
      "description": "Channel GUID"
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/channels"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/channels"
          ]
        }
      },
      "options": [
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select."
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of public channels per page."
        }
      ]
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/channels/private"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/channels/private"
          ]
        }
      },
      "options": [
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select."
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of private channels per page."
        }
      ]
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/channels/deleted"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/channels/deleted"
          ]
        }
      },
      "options": [
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select."
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of public channels per page."
        }
      ]
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/channels/autocomplete"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "Name",
      "name": "query_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/channels/autocomplete"
          ]
        }
      },
      "required": true,
      "description": "Name or display name"
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/channels/search_autocomplete"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "Name",
      "name": "query_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/channels/search_autocomplete"
          ]
        }
      },
      "required": true,
      "description": "Name or display name"
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "POST /api/v4/teams/{team_id}/channels/search"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "Term",
      "name": "body_term",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "POST /api/v4/teams/{team_id}/channels/search"
          ]
        }
      },
      "required": true,
      "description": "The search term to match against the name or display name of channels"
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "POST /api/v4/teams/{team_id}/channels/search_archived"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "Term",
      "name": "body_term",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "POST /api/v4/teams/{team_id}/channels/search_archived"
          ]
        }
      },
      "required": true,
      "description": "The search term to match against the name or display name of archived channels"
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/channels/name/{channel_name}"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "Channel Name",
      "name": "path_channel_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/channels/name/{channel_name}"
          ]
        }
      },
      "required": true,
      "description": "Channel Name"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/channels/name/{channel_name}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Include Deleted",
          "name": "query_include_deleted",
          "type": "boolean",
          "default": false,
          "description": "Defines if deleted channels should be returned or not"
        }
      ]
    },
    {
      "displayName": "Team Name",
      "name": "path_team_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/teams/name/{team_name}/channels/name/{channel_name}"
          ]
        }
      },
      "required": true,
      "description": "Team Name"
    },
    {
      "displayName": "Channel Name",
      "name": "path_channel_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/teams/name/{team_name}/channels/name/{channel_name}"
          ]
        }
      },
      "required": true,
      "description": "Channel Name"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/teams/name/{team_name}/channels/name/{channel_name}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Include Deleted",
          "name": "query_include_deleted",
          "type": "boolean",
          "default": false,
          "description": "Defines if deleted channels should be returned or not"
        }
      ]
    },
    {
      "displayName": "Channel Id",
      "name": "path_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/channels/{channel_id}/members"
          ]
        }
      },
      "required": true,
      "description": "Channel GUID"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/channels/{channel_id}/members"
          ]
        }
      },
      "options": [
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select."
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of members per page. There is a maximum limit of 200 members."
        }
      ]
    },
    {
      "displayName": "Channel Id",
      "name": "path_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "POST /api/v4/channels/{channel_id}/members"
          ]
        }
      },
      "required": true,
      "description": "The channel ID"
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
            "channels"
          ],
          "operation": [
            "POST /api/v4/channels/{channel_id}/members"
          ]
        }
      },
      "options": [
        {
          "displayName": "User Id",
          "name": "body_user_id",
          "type": "string",
          "default": "",
          "description": "The ID of user to add into the channel, for backwards compatibility."
        },
        {
          "displayName": "User Ids",
          "name": "body_user_ids",
          "type": "json",
          "default": {},
          "description": "The IDs of users to add into the channel, required if 'user_id' doess not exist."
        },
        {
          "displayName": "Post Root Id",
          "name": "body_post_root_id",
          "type": "string",
          "default": "",
          "description": "The ID of root post where link to add channel member originates"
        }
      ]
    },
    {
      "displayName": "Channel Id",
      "name": "path_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "POST /api/v4/channels/{channel_id}/members/ids"
          ]
        }
      },
      "required": true,
      "description": "Channel GUID"
    },
    {
      "displayName": "Body",
      "name": "body",
      "type": "json",
      "default": {},
      "required": true,
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "POST /api/v4/channels/{channel_id}/members/ids"
          ]
        }
      }
    },
    {
      "displayName": "Channel Id",
      "name": "path_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/channels/{channel_id}/members/{user_id}"
          ]
        }
      },
      "required": true,
      "description": "Channel GUID"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/channels/{channel_id}/members/{user_id}"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Channel Id",
      "name": "path_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "DELETE /api/v4/channels/{channel_id}/members/{user_id}"
          ]
        }
      },
      "required": true,
      "description": "Channel GUID"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "DELETE /api/v4/channels/{channel_id}/members/{user_id}"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Channel Id",
      "name": "path_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/channels/{channel_id}/members/{user_id}/roles"
          ]
        }
      },
      "required": true,
      "description": "Channel GUID"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/channels/{channel_id}/members/{user_id}/roles"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Roles",
      "name": "body_roles",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/channels/{channel_id}/members/{user_id}/roles"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel Id",
      "name": "path_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/channels/{channel_id}/members/{user_id}/schemeRoles"
          ]
        }
      },
      "required": true,
      "description": "Channel GUID"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/channels/{channel_id}/members/{user_id}/schemeRoles"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Scheme Admin",
      "name": "body_scheme_admin",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/channels/{channel_id}/members/{user_id}/schemeRoles"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Scheme User",
      "name": "body_scheme_user",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/channels/{channel_id}/members/{user_id}/schemeRoles"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel Id",
      "name": "path_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/channels/{channel_id}/members/{user_id}/notify_props"
          ]
        }
      },
      "required": true,
      "description": "Channel GUID"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/channels/{channel_id}/members/{user_id}/notify_props"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
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
            "channels"
          ],
          "operation": [
            "PUT /api/v4/channels/{channel_id}/members/{user_id}/notify_props"
          ]
        }
      },
      "options": [
        {
          "displayName": "Email",
          "name": "body_email",
          "type": "string",
          "default": "",
          "description": "Set to \"true\" to enable email notifications, \"false\" to disable, or \"default\" to use the global user notification setting."
        },
        {
          "displayName": "Push",
          "name": "body_push",
          "type": "string",
          "default": "",
          "description": "Set to \"all\" to receive push notifications for all activity, \"mention\" for mentions and direct messages only, \"none\" to disable, or \"default\" to use the global user notification setting."
        },
        {
          "displayName": "Desktop",
          "name": "body_desktop",
          "type": "string",
          "default": "",
          "description": "Set to \"all\" to receive desktop notifications for all activity, \"mention\" for mentions and direct messages only, \"none\" to disable, or \"default\" to use the global user notification setting."
        },
        {
          "displayName": "Mark Unread",
          "name": "body_mark_unread",
          "type": "string",
          "default": "",
          "description": "Set to \"all\" to mark the channel unread for any new message, \"mention\" to mark unread for new mentions only. Defaults to \"all\"."
        }
      ]
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "POST /api/v4/channels/members/{user_id}/view"
          ]
        }
      },
      "required": true,
      "description": "User ID to perform the view action for"
    },
    {
      "displayName": "Channel Id",
      "name": "body_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "POST /api/v4/channels/members/{user_id}/view"
          ]
        }
      },
      "required": true,
      "description": "The channel ID that is being viewed. Use a blank string to indicate that all channels have lost focus."
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
            "channels"
          ],
          "operation": [
            "POST /api/v4/channels/members/{user_id}/view"
          ]
        }
      },
      "options": [
        {
          "displayName": "Prev Channel Id",
          "name": "body_prev_channel_id",
          "type": "string",
          "default": "",
          "description": "The channel ID of the previous channel, used when switching channels. Providing this ID will cause push notifications to clear on the channel being switched to."
        }
      ]
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/teams/{team_id}/channels/members"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/teams/{team_id}/channels/members"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/teams/{team_id}/channels"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/teams/{team_id}/channels"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/teams/{team_id}/channels"
          ]
        }
      },
      "options": [
        {
          "displayName": "Include Deleted",
          "name": "query_include_deleted",
          "type": "boolean",
          "default": false,
          "description": "Defines if deleted channels should be returned or not"
        },
        {
          "displayName": "Last Delete At",
          "name": "query_last_delete_at",
          "type": "number",
          "default": 0,
          "description": "Filters the deleted channels by this time in epoch format. Does not have any effect if include_deleted is set to false."
        }
      ]
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/channels"
          ]
        }
      },
      "required": true,
      "description": "The ID of the user. This can also be \"me\" which will point to the current user."
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/channels"
          ]
        }
      },
      "options": [
        {
          "displayName": "Last Delete At",
          "name": "query_last_delete_at",
          "type": "number",
          "default": 0,
          "description": "Filters the deleted channels by this time in epoch format. Does not have any effect if include_deleted is set to false."
        },
        {
          "displayName": "Include Deleted",
          "name": "query_include_deleted",
          "type": "boolean",
          "default": false,
          "description": "Defines if deleted channels should be returned or not"
        }
      ]
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/channels/{channel_id}/unread"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Channel Id",
      "name": "path_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/channels/{channel_id}/unread"
          ]
        }
      },
      "required": true,
      "description": "Channel GUID"
    },
    {
      "displayName": "Channel Id",
      "name": "path_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/channels/{channel_id}/scheme"
          ]
        }
      },
      "required": true,
      "description": "Channel GUID"
    },
    {
      "displayName": "Scheme Id",
      "name": "body_scheme_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/channels/{channel_id}/scheme"
          ]
        }
      },
      "required": true,
      "description": "The ID of the scheme."
    },
    {
      "displayName": "Channel Id",
      "name": "path_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/channels/{channel_id}/moderations"
          ]
        }
      },
      "required": true,
      "description": "Channel GUID"
    },
    {
      "displayName": "Channel Id",
      "name": "path_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/channels/{channel_id}/moderations/patch"
          ]
        }
      },
      "required": true,
      "description": "Channel GUID"
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
            "channels"
          ],
          "operation": [
            "PUT /api/v4/channels/{channel_id}/moderations/patch"
          ]
        }
      },
      "options": [
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Roles",
          "name": "body_roles",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/teams/{team_id}/channels/categories"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/teams/{team_id}/channels/categories"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "POST /api/v4/users/{user_id}/teams/{team_id}/channels/categories"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "POST /api/v4/users/{user_id}/teams/{team_id}/channels/categories"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
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
            "channels"
          ],
          "operation": [
            "POST /api/v4/users/{user_id}/teams/{team_id}/channels/categories"
          ]
        }
      },
      "options": [
        {
          "displayName": "Id",
          "name": "body_id",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "User Id",
          "name": "body_user_id",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Team Id",
          "name": "body_team_id",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Display Name",
          "name": "body_display_name",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Type",
          "name": "body_type",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "channels",
              "value": "channels"
            },
            {
              "name": "custom",
              "value": "custom"
            },
            {
              "name": "direct_messages",
              "value": "direct_messages"
            },
            {
              "name": "favorites",
              "value": "favorites"
            }
          ]
        }
      ]
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/teams/{team_id}/channels/categories"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/teams/{team_id}/channels/categories"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Body",
      "name": "body",
      "type": "json",
      "default": {},
      "required": true,
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/teams/{team_id}/channels/categories"
          ]
        }
      }
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/teams/{team_id}/channels/categories/order"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/teams/{team_id}/channels/categories/order"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/teams/{team_id}/channels/categories/order"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/teams/{team_id}/channels/categories/order"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Body",
      "name": "body",
      "type": "json",
      "default": {},
      "required": true,
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/teams/{team_id}/channels/categories/order"
          ]
        }
      }
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/teams/{team_id}/channels/categories/{category_id}"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/teams/{team_id}/channels/categories/{category_id}"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Category Id",
      "name": "path_category_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/teams/{team_id}/channels/categories/{category_id}"
          ]
        }
      },
      "required": true,
      "description": "Category GUID"
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/teams/{team_id}/channels/categories/{category_id}"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/teams/{team_id}/channels/categories/{category_id}"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Category Id",
      "name": "path_category_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/teams/{team_id}/channels/categories/{category_id}"
          ]
        }
      },
      "required": true,
      "description": "Category GUID"
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
            "channels"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/teams/{team_id}/channels/categories/{category_id}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Id",
          "name": "body_id",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "User Id",
          "name": "body_user_id",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Team Id",
          "name": "body_team_id",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Display Name",
          "name": "body_display_name",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Type",
          "name": "body_type",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "channels",
              "value": "channels"
            },
            {
              "name": "custom",
              "value": "custom"
            },
            {
              "name": "direct_messages",
              "value": "direct_messages"
            },
            {
              "name": "favorites",
              "value": "favorites"
            }
          ]
        },
        {
          "displayName": "Channel Ids",
          "name": "body_channel_ids",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "DELETE /api/v4/users/{user_id}/teams/{team_id}/channels/categories/{category_id}"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "DELETE /api/v4/users/{user_id}/teams/{team_id}/channels/categories/{category_id}"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Category Id",
      "name": "path_category_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "channels"
          ],
          "operation": [
            "DELETE /api/v4/users/{user_id}/teams/{team_id}/channels/categories/{category_id}"
          ]
        }
      },
      "required": true,
      "description": "Category GUID"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "commands"
          ]
        }
      },
      "options": [
        {
          "name": "List Commands For A Team",
          "value": "GET /api/v4/commands"
        },
        {
          "name": "Create A Command",
          "value": "POST /api/v4/commands"
        },
        {
          "name": "List Autocomplete Commands",
          "value": "GET /api/v4/teams/{team_id}/commands/autocomplete"
        },
        {
          "name": "List Commands' Autocomplete Data",
          "value": "GET /api/v4/teams/{team_id}/commands/autocomplete_suggestions"
        },
        {
          "name": "Get A Command",
          "value": "GET /api/v4/commands/{command_id}"
        },
        {
          "name": "Update A Command",
          "value": "PUT /api/v4/commands/{command_id}"
        },
        {
          "name": "Delete A Command",
          "value": "DELETE /api/v4/commands/{command_id}"
        },
        {
          "name": "Generate A New Token",
          "value": "PUT /api/v4/commands/{command_id}/regen_token"
        },
        {
          "name": "Execute A Command",
          "value": "POST /api/v4/commands/execute"
        }
      ],
      "default": "GET /api/v4/commands",
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
            "commands"
          ],
          "operation": [
            "GET /api/v4/commands"
          ]
        }
      },
      "options": [
        {
          "displayName": "Team Id",
          "name": "query_team_id",
          "type": "string",
          "default": "",
          "description": "The team id."
        },
        {
          "displayName": "Custom Only",
          "name": "query_custom_only",
          "type": "boolean",
          "default": false,
          "description": "To get only the custom commands. If set to false will get the custom\nif the user have access plus the system commands, otherwise just the system commands.\n"
        }
      ]
    },
    {
      "displayName": "Team Id",
      "name": "body_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "commands"
          ],
          "operation": [
            "POST /api/v4/commands"
          ]
        }
      },
      "required": true,
      "description": "Team ID to where the command should be created"
    },
    {
      "displayName": "Method",
      "name": "body_method",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "commands"
          ],
          "operation": [
            "POST /api/v4/commands"
          ]
        }
      },
      "required": true,
      "description": "`'P'` for post request, `'G'` for get request"
    },
    {
      "displayName": "Trigger",
      "name": "body_trigger",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "commands"
          ],
          "operation": [
            "POST /api/v4/commands"
          ]
        }
      },
      "required": true,
      "description": "Activation word to trigger the command"
    },
    {
      "displayName": "Url",
      "name": "body_url",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "commands"
          ],
          "operation": [
            "POST /api/v4/commands"
          ]
        }
      },
      "required": true,
      "description": "The URL that the command will make the request"
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "commands"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/commands/autocomplete"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "commands"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/commands/autocomplete_suggestions"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "User Input",
      "name": "query_user_input",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "commands"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/commands/autocomplete_suggestions"
          ]
        }
      },
      "required": true,
      "description": "String inputted by the user."
    },
    {
      "displayName": "Command Id",
      "name": "path_command_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "commands"
          ],
          "operation": [
            "GET /api/v4/commands/{command_id}"
          ]
        }
      },
      "required": true,
      "description": "ID of the command to get"
    },
    {
      "displayName": "Command Id",
      "name": "path_command_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "commands"
          ],
          "operation": [
            "PUT /api/v4/commands/{command_id}"
          ]
        }
      },
      "required": true,
      "description": "ID of the command to update"
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
            "commands"
          ],
          "operation": [
            "PUT /api/v4/commands/{command_id}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Id",
          "name": "body_id",
          "type": "string",
          "default": "",
          "description": "The ID of the slash command"
        },
        {
          "displayName": "Token",
          "name": "body_token",
          "type": "string",
          "default": "",
          "description": "The token which is used to verify the source of the payload"
        },
        {
          "displayName": "Create At",
          "name": "body_create_at",
          "type": "number",
          "default": 0,
          "description": "The time in milliseconds the command was created"
        },
        {
          "displayName": "Update At",
          "name": "body_update_at",
          "type": "number",
          "default": 0,
          "description": "The time in milliseconds the command was last updated"
        },
        {
          "displayName": "Delete At",
          "name": "body_delete_at",
          "type": "number",
          "default": 0,
          "description": "The time in milliseconds the command was deleted, 0 if never deleted"
        },
        {
          "displayName": "Creator Id",
          "name": "body_creator_id",
          "type": "string",
          "default": "",
          "description": "The user id for the commands creator"
        },
        {
          "displayName": "Team Id",
          "name": "body_team_id",
          "type": "string",
          "default": "",
          "description": "The team id for which this command is configured"
        },
        {
          "displayName": "Trigger",
          "name": "body_trigger",
          "type": "string",
          "default": "",
          "description": "The string that triggers this command"
        },
        {
          "displayName": "Method",
          "name": "body_method",
          "type": "string",
          "default": "",
          "description": "Is the trigger done with HTTP Get ('G') or HTTP Post ('P')"
        },
        {
          "displayName": "Username",
          "name": "body_username",
          "type": "string",
          "default": "",
          "description": "What is the username for the response post"
        },
        {
          "displayName": "Icon Url",
          "name": "body_icon_url",
          "type": "string",
          "default": "",
          "description": "The url to find the icon for this users avatar"
        },
        {
          "displayName": "Auto Complete",
          "name": "body_auto_complete",
          "type": "boolean",
          "default": false,
          "description": "Use auto complete for this command"
        },
        {
          "displayName": "Auto Complete Desc",
          "name": "body_auto_complete_desc",
          "type": "string",
          "default": "",
          "description": "The description for this command shown when selecting the command"
        },
        {
          "displayName": "Auto Complete Hint",
          "name": "body_auto_complete_hint",
          "type": "string",
          "default": "",
          "description": "The hint for this command"
        },
        {
          "displayName": "Display Name",
          "name": "body_display_name",
          "type": "string",
          "default": "",
          "description": "Display name for the command"
        },
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": "",
          "description": "Description for this command"
        },
        {
          "displayName": "Url",
          "name": "body_url",
          "type": "string",
          "default": "",
          "description": "The URL that is triggered"
        }
      ]
    },
    {
      "displayName": "Command Id",
      "name": "path_command_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "commands"
          ],
          "operation": [
            "DELETE /api/v4/commands/{command_id}"
          ]
        }
      },
      "required": true,
      "description": "ID of the command to delete"
    },
    {
      "displayName": "Command Id",
      "name": "path_command_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "commands"
          ],
          "operation": [
            "PUT /api/v4/commands/{command_id}/regen_token"
          ]
        }
      },
      "required": true,
      "description": "ID of the command to generate the new token"
    },
    {
      "displayName": "Channel Id",
      "name": "body_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "commands"
          ],
          "operation": [
            "POST /api/v4/commands/execute"
          ]
        }
      },
      "required": true,
      "description": "Channel Id where the command will execute"
    },
    {
      "displayName": "Command",
      "name": "body_command",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "commands"
          ],
          "operation": [
            "POST /api/v4/commands/execute"
          ]
        }
      },
      "required": true,
      "description": "The slash command to execute, including parameters. Eg, `'/echo bounces around the room'`"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "emoji"
          ]
        }
      },
      "options": [
        {
          "name": "Get A List Of Custom Emoji",
          "value": "GET /api/v4/emoji"
        },
        {
          "name": "Create A Custom Emoji",
          "value": "POST /api/v4/emoji"
        },
        {
          "name": "Get A Custom Emoji",
          "value": "GET /api/v4/emoji/{emoji_id}"
        },
        {
          "name": "Delete A Custom Emoji",
          "value": "DELETE /api/v4/emoji/{emoji_id}"
        },
        {
          "name": "Get A Custom Emoji By Name",
          "value": "GET /api/v4/emoji/name/{emoji_name}"
        },
        {
          "name": "Get Custom Emoji Image",
          "value": "GET /api/v4/emoji/{emoji_id}/image"
        },
        {
          "name": "Search Custom Emoji",
          "value": "POST /api/v4/emoji/search"
        },
        {
          "name": "Autocomplete Custom Emoji",
          "value": "GET /api/v4/emoji/autocomplete"
        }
      ],
      "default": "GET /api/v4/emoji",
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
            "emoji"
          ],
          "operation": [
            "GET /api/v4/emoji"
          ]
        }
      },
      "options": [
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select."
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of emojis per page."
        },
        {
          "displayName": "Sort",
          "name": "query_sort",
          "type": "string",
          "default": "",
          "description": "Either blank for no sorting or \"name\" to sort by emoji names."
        }
      ]
    },
    {
      "displayName": "Image",
      "name": "body_image",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "emoji"
          ],
          "operation": [
            "POST /api/v4/emoji"
          ]
        }
      },
      "required": true,
      "description": "A file to be uploaded"
    },
    {
      "displayName": "Emoji",
      "name": "body_emoji",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "emoji"
          ],
          "operation": [
            "POST /api/v4/emoji"
          ]
        }
      },
      "required": true,
      "description": "A JSON object containing a `name` field with the name of the emoji and a `creator_id` field with the id of the authenticated user."
    },
    {
      "displayName": "Emoji Id",
      "name": "path_emoji_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "emoji"
          ],
          "operation": [
            "GET /api/v4/emoji/{emoji_id}"
          ]
        }
      },
      "required": true,
      "description": "Emoji GUID"
    },
    {
      "displayName": "Emoji Id",
      "name": "path_emoji_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "emoji"
          ],
          "operation": [
            "DELETE /api/v4/emoji/{emoji_id}"
          ]
        }
      },
      "required": true,
      "description": "Emoji GUID"
    },
    {
      "displayName": "Emoji Name",
      "name": "path_emoji_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "emoji"
          ],
          "operation": [
            "GET /api/v4/emoji/name/{emoji_name}"
          ]
        }
      },
      "required": true,
      "description": "Emoji name"
    },
    {
      "displayName": "Emoji Id",
      "name": "path_emoji_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "emoji"
          ],
          "operation": [
            "GET /api/v4/emoji/{emoji_id}/image"
          ]
        }
      },
      "required": true,
      "description": "Emoji GUID"
    },
    {
      "displayName": "Term",
      "name": "body_term",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "emoji"
          ],
          "operation": [
            "POST /api/v4/emoji/search"
          ]
        }
      },
      "required": true,
      "description": "The term to match against the emoji name."
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
            "emoji"
          ],
          "operation": [
            "POST /api/v4/emoji/search"
          ]
        }
      },
      "options": [
        {
          "displayName": "Prefix Only",
          "name": "body_prefix_only",
          "type": "string",
          "default": "",
          "description": "Set to only search for names starting with the search term."
        }
      ]
    },
    {
      "displayName": "Name",
      "name": "query_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "emoji"
          ],
          "operation": [
            "GET /api/v4/emoji/autocomplete"
          ]
        }
      },
      "required": true,
      "description": "The emoji name to search."
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "files"
          ]
        }
      },
      "options": [
        {
          "name": "Upload A File",
          "value": "POST /api/v4/files"
        },
        {
          "name": "Get A File",
          "value": "GET /api/v4/files/{file_id}"
        },
        {
          "name": "Get A File's Thumbnail",
          "value": "GET /api/v4/files/{file_id}/thumbnail"
        },
        {
          "name": "Get A File's Preview",
          "value": "GET /api/v4/files/{file_id}/preview"
        },
        {
          "name": "Get Metadata For A File",
          "value": "GET /api/v4/files/{file_id}/info"
        }
      ],
      "default": "POST /api/v4/files",
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
            "files"
          ],
          "operation": [
            "POST /api/v4/files"
          ]
        }
      },
      "options": [
        {
          "displayName": "Channel Id",
          "name": "query_channel_id",
          "type": "string",
          "default": "",
          "description": "The ID of the channel that this file will be uploaded to"
        },
        {
          "displayName": "Filename",
          "name": "query_filename",
          "type": "string",
          "default": "",
          "description": "The name of the file to be uploaded"
        }
      ]
    },
    {
      "displayName": "Files",
      "name": "body_files",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "files"
          ],
          "operation": [
            "POST /api/v4/files"
          ]
        }
      },
      "required": true,
      "description": "The file to upload"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "files"
          ],
          "operation": [
            "GET /api/v4/files/{file_id}"
          ]
        }
      },
      "required": true,
      "description": "The ID of the file to get"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "files"
          ],
          "operation": [
            "GET /api/v4/files/{file_id}/thumbnail"
          ]
        }
      },
      "required": true,
      "description": "The ID of the file to get"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "files"
          ],
          "operation": [
            "GET /api/v4/files/{file_id}/preview"
          ]
        }
      },
      "required": true,
      "description": "The ID of the file to get"
    },
    {
      "displayName": "File Id",
      "name": "path_file_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "files"
          ],
          "operation": [
            "GET /api/v4/files/{file_id}/info"
          ]
        }
      },
      "required": true,
      "description": "The ID of the file info to get"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "groups"
          ]
        }
      },
      "options": [
        {
          "name": "Get Groups",
          "value": "GET /api/v4/groups"
        },
        {
          "name": "Get Channel Groups",
          "value": "GET /api/v4/channels/{channel_id}/groups"
        },
        {
          "name": "Get Team Groups",
          "value": "GET /api/v4/teams/{team_id}/groups"
        },
        {
          "name": "Get Team Groups By Channels",
          "value": "GET /api/v4/teams/{team_id}/groups_by_channels"
        },
        {
          "name": "Get Groups For A User ID",
          "value": "GET /api/v4/users/{user_id}/groups"
        }
      ],
      "default": "GET /api/v4/groups",
      "noDataExpression": true
    },
    {
      "displayName": "Not Associated To Team",
      "name": "query_not_associated_to_team",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "groups"
          ],
          "operation": [
            "GET /api/v4/groups"
          ]
        }
      },
      "required": true,
      "description": "Team GUID which is used to return all the groups not associated to this team"
    },
    {
      "displayName": "Not Associated To Channel",
      "name": "query_not_associated_to_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "groups"
          ],
          "operation": [
            "GET /api/v4/groups"
          ]
        }
      },
      "required": true,
      "description": "Group GUID which is used to return all the groups not associated to this channel"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "groups"
          ],
          "operation": [
            "GET /api/v4/groups"
          ]
        }
      },
      "options": [
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select."
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of groups per page."
        },
        {
          "displayName": "Q",
          "name": "query_q",
          "type": "string",
          "default": "",
          "description": "String to pattern match the `name` and `display_name` field. Will return all groups whose `name` and `display_name` field match any of the text."
        },
        {
          "displayName": "Include Member Count",
          "name": "query_include_member_count",
          "type": "boolean",
          "default": false,
          "description": "Boolean which adds the `member_count` attribute to each group JSON object"
        },
        {
          "displayName": "Since",
          "name": "query_since",
          "type": "number",
          "default": 0,
          "description": "Only return groups that have been modified since the given Unix timestamp (in milliseconds). All modified groups, including deleted and created groups, will be returned.\nn"
        },
        {
          "displayName": "Filter Allow Reference",
          "name": "query_filter_allow_reference",
          "type": "boolean",
          "default": false,
          "description": "Boolean which filters the group entries with the `allow_reference` attribute set."
        }
      ]
    },
    {
      "displayName": "Channel Id",
      "name": "path_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "groups"
          ],
          "operation": [
            "GET /api/v4/channels/{channel_id}/groups"
          ]
        }
      },
      "required": true,
      "description": "Channel GUID"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "groups"
          ],
          "operation": [
            "GET /api/v4/channels/{channel_id}/groups"
          ]
        }
      },
      "options": [
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select."
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of groups per page."
        },
        {
          "displayName": "Filter Allow Reference",
          "name": "query_filter_allow_reference",
          "type": "boolean",
          "default": false,
          "description": "Boolean which filters the group entries with the `allow_reference` attribute set."
        }
      ]
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "groups"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/groups"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "groups"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/groups"
          ]
        }
      },
      "options": [
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select."
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of groups per page."
        },
        {
          "displayName": "Filter Allow Reference",
          "name": "query_filter_allow_reference",
          "type": "boolean",
          "default": false,
          "description": "Boolean which filters in the group entries with the `allow_reference` attribute set."
        }
      ]
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "groups"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/groups_by_channels"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "groups"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/groups_by_channels"
          ]
        }
      },
      "options": [
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select."
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of groups per page."
        },
        {
          "displayName": "Filter Allow Reference",
          "name": "query_filter_allow_reference",
          "type": "boolean",
          "default": false,
          "description": "Boolean which filters in the group entries with the `allow_reference` attribute set."
        },
        {
          "displayName": "Paginate",
          "name": "query_paginate",
          "type": "boolean",
          "default": false,
          "description": "Boolean to determine whether the pagination should be applied or not"
        }
      ]
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "groups"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/groups"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "insights"
          ]
        }
      },
      "options": [
        {
          "name": "Get A List Of The Top Reactions For A Team.",
          "value": "GET /api/v4/teams/{team_id}/top/reactions"
        },
        {
          "name": "Get A List Of The Top Reactions For A User.",
          "value": "GET /api/v4/users/me/top/reactions"
        },
        {
          "name": "Get A List Of The Top Channels For A Team.",
          "value": "GET /api/v4/teams/{team_id}/top/channels"
        },
        {
          "name": "Get A List Of The Top Channels For A User.",
          "value": "GET /api/v4/users/me/top/channels"
        },
        {
          "name": "Get A List Of New Team Members.",
          "value": "GET /api/v4/teams/{team_id}/top/team_members"
        },
        {
          "name": "Get A List Of The Top Threads For A Team.",
          "value": "GET /api/v4/teams/{team_id}/top/threads"
        },
        {
          "name": "Get A List Of The Top Threads For A User.",
          "value": "GET /api/v4/users/me/top/threads"
        },
        {
          "name": "Get A List Of The Top Dms For A User.",
          "value": "GET /api/v4/users/me/top/dms"
        }
      ],
      "default": "GET /api/v4/teams/{team_id}/top/reactions",
      "noDataExpression": true
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "insights"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/top/reactions"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "Time Range",
      "name": "query_time_range",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "insights"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/top/reactions"
          ]
        }
      },
      "required": true,
      "description": "Time range can be \"today\", \"7_day\", or \"28_day\".\n- `today`: reactions posted on the current day.\n- `7_day`: reactions posted in the last 7 days.\n- `28_day`: reactions posted in the last 28 days.\n"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "insights"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/top/reactions"
          ]
        }
      },
      "options": [
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select."
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of items per page, up to a maximum of 200."
        }
      ]
    },
    {
      "displayName": "Time Range",
      "name": "query_time_range",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "insights"
          ],
          "operation": [
            "GET /api/v4/users/me/top/reactions"
          ]
        }
      },
      "required": true,
      "description": "Time range can be \"today\", \"7_day\", or \"28_day\".\n- `today`: reactions posted on the current day.\n- `7_day`: reactions posted in the last 7 days.\n- `28_day`: reactions posted in the last 28 days.\n"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "insights"
          ],
          "operation": [
            "GET /api/v4/users/me/top/reactions"
          ]
        }
      },
      "options": [
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select."
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of items per page, up to a maximum of 200."
        },
        {
          "displayName": "Team Id",
          "name": "query_team_id",
          "type": "string",
          "default": "",
          "description": "Team ID will scope the response to a given team and exclude direct and group messages.\n##### Permissions\nMust have `view_team` permission for the team.\n"
        }
      ]
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "insights"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/top/channels"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "Time Range",
      "name": "query_time_range",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "insights"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/top/channels"
          ]
        }
      },
      "required": true,
      "description": "Time range can be \"today\", \"7_day\", or \"28_day\".\n- `today`: channels with posts on the current day.\n- `7_day`: channels with posts in the last 7 days.\n- `28_day`: channels with posts in the last 28 days.\n"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "insights"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/top/channels"
          ]
        }
      },
      "options": [
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select."
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of items per page, up to a maximum of 200."
        }
      ]
    },
    {
      "displayName": "Time Range",
      "name": "query_time_range",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "insights"
          ],
          "operation": [
            "GET /api/v4/users/me/top/channels"
          ]
        }
      },
      "required": true,
      "description": "Time range can be \"today\", \"7_day\", or \"28_day\".\n- `today`: channels with posts on the current day.\n- `7_day`: channels with posts in the last 7 days.\n- `28_day`: channels with posts in the last 28 days.\n"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "insights"
          ],
          "operation": [
            "GET /api/v4/users/me/top/channels"
          ]
        }
      },
      "options": [
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select."
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of items per page, up to a maximum of 200."
        },
        {
          "displayName": "Team Id",
          "name": "query_team_id",
          "type": "string",
          "default": "",
          "description": "Team ID will scope the response to a given team.\n##### Permissions\nMust have `view_team` permission for the team.\n"
        }
      ]
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "insights"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/top/team_members"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "Time Range",
      "name": "query_time_range",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "insights"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/top/team_members"
          ]
        }
      },
      "required": true,
      "description": "Time range can be \"today\", \"7_day\", or \"28_day\".\n- `today`: team members who joined during the current day.\n- `7_day`: team members who joined in the last 7 days.\n- `28_day`: team members who joined in the last 28 days.\n"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "insights"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/top/team_members"
          ]
        }
      },
      "options": [
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select."
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of items per page."
        }
      ]
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "insights"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/top/threads"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "Time Range",
      "name": "query_time_range",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "insights"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/top/threads"
          ]
        }
      },
      "required": true,
      "description": "Time range can be \"today\", \"7_day\", or \"28_day\".\n- `today`: threads with activity on the current day.\n- `7_day`: threads with activity in the last 7 days.\n- `28_day`: threads with activity in the last 28 days.\n"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "insights"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/top/threads"
          ]
        }
      },
      "options": [
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select."
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of items per page, up to a maximum of 200."
        }
      ]
    },
    {
      "displayName": "Time Range",
      "name": "query_time_range",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "insights"
          ],
          "operation": [
            "GET /api/v4/users/me/top/threads"
          ]
        }
      },
      "required": true,
      "description": "Time range can be \"today\", \"7_day\", or \"28_day\".\n- `today`: threads with activity on the current day.\n- `7_day`: threads with activity in the last 7 days.\n- `28_day`: threads with activity in the last 28 days.\n"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "insights"
          ],
          "operation": [
            "GET /api/v4/users/me/top/threads"
          ]
        }
      },
      "options": [
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select."
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of items per page, up to a maximum of 200."
        },
        {
          "displayName": "Team Id",
          "name": "query_team_id",
          "type": "string",
          "default": "",
          "description": "Team ID will scope the response to a given team.\n##### Permissions\nMust have `view_team` permission for the team.\n"
        }
      ]
    },
    {
      "displayName": "Time Range",
      "name": "query_time_range",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "insights"
          ],
          "operation": [
            "GET /api/v4/users/me/top/dms"
          ]
        }
      },
      "required": true,
      "description": "Time range can be \"today\", \"7_day\", or \"28_day\".\n- `today`: threads with activity on the current day.\n- `7_day`: threads with activity in the last 7 days.\n- `28_day`: threads with activity in the last 28 days.\n"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "insights"
          ],
          "operation": [
            "GET /api/v4/users/me/top/dms"
          ]
        }
      },
      "options": [
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select."
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of items per page, up to a maximum of 200."
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
            "posts"
          ]
        }
      },
      "options": [
        {
          "name": "Create A Post",
          "value": "POST /api/v4/posts"
        },
        {
          "name": "Create A Ephemeral Post",
          "value": "POST /api/v4/posts/ephemeral"
        },
        {
          "name": "Get A Post",
          "value": "GET /api/v4/posts/{post_id}"
        },
        {
          "name": "Delete A Post",
          "value": "DELETE /api/v4/posts/{post_id}"
        },
        {
          "name": "Mark As Unread From A Post.",
          "value": "POST /api/v4/users/{user_id}/posts/{post_id}/set_unread"
        },
        {
          "name": "Patch A Post",
          "value": "PUT /api/v4/posts/{post_id}/patch"
        },
        {
          "name": "Get A Thread",
          "value": "GET /api/v4/posts/{post_id}/thread"
        },
        {
          "name": "Get A List Of Flagged Posts",
          "value": "GET /api/v4/users/{user_id}/posts/flagged"
        },
        {
          "name": "Get File Info For Post",
          "value": "GET /api/v4/posts/{post_id}/files/info"
        },
        {
          "name": "Get Posts For A Channel",
          "value": "GET /api/v4/channels/{channel_id}/posts"
        },
        {
          "name": "Get Posts Around Oldest Unread",
          "value": "GET /api/v4/users/{user_id}/channels/{channel_id}/posts/unread"
        },
        {
          "name": "Search For Team Posts",
          "value": "POST /api/v4/teams/{team_id}/posts/search"
        },
        {
          "name": "Pin A Post To The Channel",
          "value": "POST /api/v4/posts/{post_id}/pin"
        },
        {
          "name": "Unpin A Post To The Channel",
          "value": "POST /api/v4/posts/{post_id}/unpin"
        },
        {
          "name": "Perform A Post Action",
          "value": "POST /api/v4/posts/{post_id}/actions/{action_id}"
        },
        {
          "name": "Get Posts By A List Of Ids",
          "value": "POST /api/v4/posts/ids"
        },
        {
          "name": "Set A Post Reminder",
          "value": "POST /api/v4/users/{user_id}/posts/{post_id}/reminder"
        }
      ],
      "default": "POST /api/v4/posts",
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
            "posts"
          ],
          "operation": [
            "POST /api/v4/posts"
          ]
        }
      },
      "options": [
        {
          "displayName": "Set Online",
          "name": "query_set_online",
          "type": "boolean",
          "default": false,
          "description": "Whether to set the user status as online or not."
        }
      ]
    },
    {
      "displayName": "Channel Id",
      "name": "body_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "POST /api/v4/posts"
          ]
        }
      },
      "required": true,
      "description": "The channel ID to post in"
    },
    {
      "displayName": "Message",
      "name": "body_message",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "POST /api/v4/posts"
          ]
        }
      },
      "required": true,
      "description": "The message contents, can be formatted with Markdown"
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
            "posts"
          ],
          "operation": [
            "POST /api/v4/posts"
          ]
        }
      },
      "options": [
        {
          "displayName": "Root Id",
          "name": "body_root_id",
          "type": "string",
          "default": "",
          "description": "The post ID to comment on"
        },
        {
          "displayName": "File Ids",
          "name": "body_file_ids",
          "type": "json",
          "default": {},
          "description": "A list of file IDs to associate with the post. Note that posts are limited to 5 files maximum. Please use additional posts for more files."
        },
        {
          "displayName": "Props",
          "name": "body_props",
          "type": "json",
          "default": {},
          "description": "A general JSON property bag to attach to the post"
        }
      ]
    },
    {
      "displayName": "User Id",
      "name": "body_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "POST /api/v4/posts/ephemeral"
          ]
        }
      },
      "required": true,
      "description": "The target user id for the ephemeral post"
    },
    {
      "displayName": "Post",
      "name": "body_post",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "POST /api/v4/posts/ephemeral"
          ]
        }
      },
      "required": true,
      "description": "Post object to create"
    },
    {
      "displayName": "Post Id",
      "name": "path_post_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "GET /api/v4/posts/{post_id}"
          ]
        }
      },
      "required": true,
      "description": "ID of the post to get"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "GET /api/v4/posts/{post_id}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Include Deleted",
          "name": "query_include_deleted",
          "type": "boolean",
          "default": false,
          "description": "Defines if result should include deleted posts, must have 'manage_system' (admin) permission."
        }
      ]
    },
    {
      "displayName": "Post Id",
      "name": "path_post_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "DELETE /api/v4/posts/{post_id}"
          ]
        }
      },
      "required": true,
      "description": "ID of the post to delete"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "POST /api/v4/users/{user_id}/posts/{post_id}/set_unread"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Post Id",
      "name": "path_post_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "POST /api/v4/users/{user_id}/posts/{post_id}/set_unread"
          ]
        }
      },
      "required": true,
      "description": "Post GUID"
    },
    {
      "displayName": "Post Id",
      "name": "path_post_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "PUT /api/v4/posts/{post_id}/patch"
          ]
        }
      },
      "required": true,
      "description": "Post GUID"
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
            "posts"
          ],
          "operation": [
            "PUT /api/v4/posts/{post_id}/patch"
          ]
        }
      },
      "options": [
        {
          "displayName": "Is Pinned",
          "name": "body_is_pinned",
          "type": "boolean",
          "default": false,
          "description": "Set to `true` to pin the post to the channel it is in"
        },
        {
          "displayName": "Message",
          "name": "body_message",
          "type": "string",
          "default": "",
          "description": "The message text of the post"
        },
        {
          "displayName": "File Ids",
          "name": "body_file_ids",
          "type": "json",
          "default": {},
          "description": "The list of files attached to this post"
        }
      ]
    },
    {
      "displayName": "Post Id",
      "name": "path_post_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "GET /api/v4/posts/{post_id}/thread"
          ]
        }
      },
      "required": true,
      "description": "ID of a post in the thread"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "GET /api/v4/posts/{post_id}/thread"
          ]
        }
      },
      "options": [
        {
          "displayName": "PerPage",
          "name": "query_perPage",
          "type": "number",
          "default": 0,
          "description": "The number of posts per page"
        },
        {
          "displayName": "FromPost",
          "name": "query_fromPost",
          "type": "string",
          "default": "",
          "description": "The post_id to return the next page of posts from"
        },
        {
          "displayName": "FromCreateAt",
          "name": "query_fromCreateAt",
          "type": "number",
          "default": 0,
          "description": "The create_at timestamp to return the next page of posts from"
        },
        {
          "displayName": "Direction",
          "name": "query_direction",
          "type": "string",
          "default": "",
          "description": "The direction to return the posts. Either up or down."
        },
        {
          "displayName": "SkipFetchThreads",
          "name": "query_skipFetchThreads",
          "type": "boolean",
          "default": false,
          "description": "Whether to skip fetching threads or not"
        },
        {
          "displayName": "CollapsedThreads",
          "name": "query_collapsedThreads",
          "type": "boolean",
          "default": false,
          "description": "Whether the client uses CRT or not"
        },
        {
          "displayName": "CollapsedThreadsExtended",
          "name": "query_collapsedThreadsExtended",
          "type": "boolean",
          "default": false,
          "description": "Whether to return the associated users as part of the response or not"
        }
      ]
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/posts/flagged"
          ]
        }
      },
      "required": true,
      "description": "ID of the user"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/posts/flagged"
          ]
        }
      },
      "options": [
        {
          "displayName": "Team Id",
          "name": "query_team_id",
          "type": "string",
          "default": "",
          "description": "Team ID"
        },
        {
          "displayName": "Channel Id",
          "name": "query_channel_id",
          "type": "string",
          "default": "",
          "description": "Channel ID"
        },
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select"
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of posts per page"
        }
      ]
    },
    {
      "displayName": "Post Id",
      "name": "path_post_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "GET /api/v4/posts/{post_id}/files/info"
          ]
        }
      },
      "required": true,
      "description": "ID of the post"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "GET /api/v4/posts/{post_id}/files/info"
          ]
        }
      },
      "options": [
        {
          "displayName": "Include Deleted",
          "name": "query_include_deleted",
          "type": "boolean",
          "default": false,
          "description": "Defines if result should include deleted posts, must have 'manage_system' (admin) permission."
        }
      ]
    },
    {
      "displayName": "Channel Id",
      "name": "path_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "GET /api/v4/channels/{channel_id}/posts"
          ]
        }
      },
      "required": true,
      "description": "The channel ID to get the posts for"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "GET /api/v4/channels/{channel_id}/posts"
          ]
        }
      },
      "options": [
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select"
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of posts per page"
        },
        {
          "displayName": "Since",
          "name": "query_since",
          "type": "number",
          "default": 0,
          "description": "Provide a non-zero value in Unix time milliseconds to select posts modified after that time"
        },
        {
          "displayName": "Before",
          "name": "query_before",
          "type": "string",
          "default": "",
          "description": "A post id to select the posts that came before this one"
        },
        {
          "displayName": "After",
          "name": "query_after",
          "type": "string",
          "default": "",
          "description": "A post id to select the posts that came after this one"
        },
        {
          "displayName": "Include Deleted",
          "name": "query_include_deleted",
          "type": "boolean",
          "default": false,
          "description": "Whether to include deleted posts or not. Must have system admin permissions."
        }
      ]
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/channels/{channel_id}/posts/unread"
          ]
        }
      },
      "required": true,
      "description": "ID of the user"
    },
    {
      "displayName": "Channel Id",
      "name": "path_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/channels/{channel_id}/posts/unread"
          ]
        }
      },
      "required": true,
      "description": "The channel ID to get the posts for"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/channels/{channel_id}/posts/unread"
          ]
        }
      },
      "options": [
        {
          "displayName": "Limit Before",
          "name": "query_limit_before",
          "type": "number",
          "default": 0,
          "description": "Number of posts before the oldest unread posts. Maximum is 200 posts if limit is set greater than that."
        },
        {
          "displayName": "Limit After",
          "name": "query_limit_after",
          "type": "number",
          "default": 0,
          "description": "Number of posts after and including the oldest unread post. Maximum is 200 posts if limit is set greater than that."
        },
        {
          "displayName": "SkipFetchThreads",
          "name": "query_skipFetchThreads",
          "type": "boolean",
          "default": false,
          "description": "Whether to skip fetching threads or not"
        },
        {
          "displayName": "CollapsedThreads",
          "name": "query_collapsedThreads",
          "type": "boolean",
          "default": false,
          "description": "Whether the client uses CRT or not"
        },
        {
          "displayName": "CollapsedThreadsExtended",
          "name": "query_collapsedThreadsExtended",
          "type": "boolean",
          "default": false,
          "description": "Whether to return the associated users as part of the response or not"
        }
      ]
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "POST /api/v4/teams/{team_id}/posts/search"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "Terms",
      "name": "body_terms",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "POST /api/v4/teams/{team_id}/posts/search"
          ]
        }
      },
      "required": true,
      "description": "The search terms as inputed by the user. To search for posts from a user include `from:someusername`, using a user's username. To search in a specific channel include `in:somechannel`, using the channel name (not the display name)."
    },
    {
      "displayName": "Is Or Search",
      "name": "body_is_or_search",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "POST /api/v4/teams/{team_id}/posts/search"
          ]
        }
      },
      "required": true,
      "description": "Set to true if an Or search should be performed vs an And search."
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
            "posts"
          ],
          "operation": [
            "POST /api/v4/teams/{team_id}/posts/search"
          ]
        }
      },
      "options": [
        {
          "displayName": "Time Zone Offset",
          "name": "body_time_zone_offset",
          "type": "number",
          "default": 0,
          "description": "Offset from UTC of user timezone for date searches."
        },
        {
          "displayName": "Include Deleted Channels",
          "name": "body_include_deleted_channels",
          "type": "boolean",
          "default": false,
          "description": "Set to true if deleted channels should be included in the search. (archived channels)"
        },
        {
          "displayName": "Page",
          "name": "body_page",
          "type": "number",
          "default": 0,
          "description": "The page to select. (Only works with Elasticsearch)"
        },
        {
          "displayName": "Per Page",
          "name": "body_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of posts per page. (Only works with Elasticsearch)"
        }
      ]
    },
    {
      "displayName": "Post Id",
      "name": "path_post_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "POST /api/v4/posts/{post_id}/pin"
          ]
        }
      },
      "required": true,
      "description": "Post GUID"
    },
    {
      "displayName": "Post Id",
      "name": "path_post_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "POST /api/v4/posts/{post_id}/unpin"
          ]
        }
      },
      "required": true,
      "description": "Post GUID"
    },
    {
      "displayName": "Post Id",
      "name": "path_post_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "POST /api/v4/posts/{post_id}/actions/{action_id}"
          ]
        }
      },
      "required": true,
      "description": "Post GUID"
    },
    {
      "displayName": "Action Id",
      "name": "path_action_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "POST /api/v4/posts/{post_id}/actions/{action_id}"
          ]
        }
      },
      "required": true,
      "description": "Action GUID"
    },
    {
      "displayName": "Body",
      "name": "body",
      "type": "json",
      "default": {},
      "required": true,
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "POST /api/v4/posts/ids"
          ]
        }
      }
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "POST /api/v4/users/{user_id}/posts/{post_id}/reminder"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Post Id",
      "name": "path_post_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "POST /api/v4/users/{user_id}/posts/{post_id}/reminder"
          ]
        }
      },
      "required": true,
      "description": "Post GUID"
    },
    {
      "displayName": "Target Time",
      "name": "body_target_time",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "posts"
          ],
          "operation": [
            "POST /api/v4/users/{user_id}/posts/{post_id}/reminder"
          ]
        }
      },
      "required": true,
      "description": "Target time for the reminder"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "preferences"
          ]
        }
      },
      "options": [
        {
          "name": "Get The User's Preferences",
          "value": "GET /api/v4/users/{user_id}/preferences"
        },
        {
          "name": "Save The User's Preferences",
          "value": "PUT /api/v4/users/{user_id}/preferences"
        },
        {
          "name": "Delete User's Preferences",
          "value": "POST /api/v4/users/{user_id}/preferences/delete"
        },
        {
          "name": "List A User's Preferences By Category",
          "value": "GET /api/v4/users/{user_id}/preferences/{category}"
        },
        {
          "name": "Get A Specific User Preference",
          "value": "GET /api/v4/users/{user_id}/preferences/{category}/name/{preference_name}"
        }
      ],
      "default": "GET /api/v4/users/{user_id}/preferences",
      "noDataExpression": true
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "preferences"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/preferences"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "preferences"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/preferences"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Body",
      "name": "body",
      "type": "json",
      "default": {},
      "required": true,
      "displayOptions": {
        "show": {
          "resource": [
            "preferences"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/preferences"
          ]
        }
      }
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "preferences"
          ],
          "operation": [
            "POST /api/v4/users/{user_id}/preferences/delete"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Body",
      "name": "body",
      "type": "json",
      "default": {},
      "required": true,
      "displayOptions": {
        "show": {
          "resource": [
            "preferences"
          ],
          "operation": [
            "POST /api/v4/users/{user_id}/preferences/delete"
          ]
        }
      }
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "preferences"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/preferences/{category}"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Category",
      "name": "path_category",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "preferences"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/preferences/{category}"
          ]
        }
      },
      "required": true,
      "description": "The category of a group of preferences"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "preferences"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/preferences/{category}/name/{preference_name}"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Category",
      "name": "path_category",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "preferences"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/preferences/{category}/name/{preference_name}"
          ]
        }
      },
      "required": true,
      "description": "The category of a group of preferences"
    },
    {
      "displayName": "Preference Name",
      "name": "path_preference_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "preferences"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/preferences/{category}/name/{preference_name}"
          ]
        }
      },
      "required": true,
      "description": "The name of the preference"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "reactions"
          ]
        }
      },
      "options": [
        {
          "name": "Create A Reaction",
          "value": "POST /api/v4/reactions"
        },
        {
          "name": "Get A List Of Reactions To A Post",
          "value": "GET /api/v4/posts/{post_id}/reactions"
        },
        {
          "name": "Remove A Reaction From A Post",
          "value": "DELETE /api/v4/users/{user_id}/posts/{post_id}/reactions/{emoji_name}"
        }
      ],
      "default": "POST /api/v4/reactions",
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
            "reactions"
          ],
          "operation": [
            "POST /api/v4/reactions"
          ]
        }
      },
      "options": [
        {
          "displayName": "User Id",
          "name": "body_user_id",
          "type": "string",
          "default": "",
          "description": "The ID of the user that made this reaction"
        },
        {
          "displayName": "Post Id",
          "name": "body_post_id",
          "type": "string",
          "default": "",
          "description": "The ID of the post to which this reaction was made"
        },
        {
          "displayName": "Emoji Name",
          "name": "body_emoji_name",
          "type": "string",
          "default": "",
          "description": "The name of the emoji that was used for this reaction"
        },
        {
          "displayName": "Create At",
          "name": "body_create_at",
          "type": "number",
          "default": 0,
          "description": "The time in milliseconds this reaction was made"
        }
      ]
    },
    {
      "displayName": "Post Id",
      "name": "path_post_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "reactions"
          ],
          "operation": [
            "GET /api/v4/posts/{post_id}/reactions"
          ]
        }
      },
      "required": true,
      "description": "ID of a post"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "reactions"
          ],
          "operation": [
            "DELETE /api/v4/users/{user_id}/posts/{post_id}/reactions/{emoji_name}"
          ]
        }
      },
      "required": true,
      "description": "ID of the user"
    },
    {
      "displayName": "Post Id",
      "name": "path_post_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "reactions"
          ],
          "operation": [
            "DELETE /api/v4/users/{user_id}/posts/{post_id}/reactions/{emoji_name}"
          ]
        }
      },
      "required": true,
      "description": "ID of the post"
    },
    {
      "displayName": "Emoji Name",
      "name": "path_emoji_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "reactions"
          ],
          "operation": [
            "DELETE /api/v4/users/{user_id}/posts/{post_id}/reactions/{emoji_name}"
          ]
        }
      },
      "required": true,
      "description": "emoji name"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "roles"
          ]
        }
      },
      "options": [
        {
          "name": "Get A List Of All The Roles",
          "value": "GET /api/v4/roles"
        },
        {
          "name": "Get A Role",
          "value": "GET /api/v4/roles/{role_id}"
        },
        {
          "name": "Get A Role By Name",
          "value": "GET /api/v4/roles/name/{role_name}"
        },
        {
          "name": "Get A List Of Roles By Name",
          "value": "POST /api/v4/roles/names"
        }
      ],
      "default": "GET /api/v4/roles",
      "noDataExpression": true
    },
    {
      "displayName": "Role Id",
      "name": "path_role_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "roles"
          ],
          "operation": [
            "GET /api/v4/roles/{role_id}"
          ]
        }
      },
      "required": true,
      "description": "Role GUID"
    },
    {
      "displayName": "Role Name",
      "name": "path_role_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "roles"
          ],
          "operation": [
            "GET /api/v4/roles/name/{role_name}"
          ]
        }
      },
      "required": true,
      "description": "Role Name"
    },
    {
      "displayName": "Body",
      "name": "body",
      "type": "json",
      "default": {},
      "required": true,
      "displayOptions": {
        "show": {
          "resource": [
            "roles"
          ],
          "operation": [
            "POST /api/v4/roles/names"
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
            "status"
          ]
        }
      },
      "options": [
        {
          "name": "Get User Status",
          "value": "GET /api/v4/users/{user_id}/status"
        },
        {
          "name": "Update User Status",
          "value": "PUT /api/v4/users/{user_id}/status"
        },
        {
          "name": "Get User Statuses By ID",
          "value": "POST /api/v4/users/status/ids"
        },
        {
          "name": "Update User Custom Status",
          "value": "PUT /api/v4/users/{user_id}/status/custom"
        },
        {
          "name": "Unsets User Custom Status",
          "value": "DELETE /api/v4/users/{user_id}/status/custom"
        },
        {
          "name": "Delete User's Recent Custom Status",
          "value": "POST /api/v4/users/{user_id}/status/custom/recent/delete"
        }
      ],
      "default": "GET /api/v4/users/{user_id}/status",
      "noDataExpression": true
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "status"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/status"
          ]
        }
      },
      "required": true,
      "description": "User ID"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "status"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/status"
          ]
        }
      },
      "required": true,
      "description": "User ID"
    },
    {
      "displayName": "User Id",
      "name": "body_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "status"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/status"
          ]
        }
      },
      "required": true,
      "description": "User ID"
    },
    {
      "displayName": "Status",
      "name": "body_status",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "status"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/status"
          ]
        }
      },
      "required": true,
      "description": "User status, can be `online`, `away`, `offline` and `dnd`"
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
            "status"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/status"
          ]
        }
      },
      "options": [
        {
          "displayName": "Dnd End Time",
          "name": "body_dnd_end_time",
          "type": "number",
          "default": 0,
          "description": "Time in epoch seconds at which a dnd status would be unset."
        }
      ]
    },
    {
      "displayName": "Body",
      "name": "body",
      "type": "json",
      "default": {},
      "required": true,
      "displayOptions": {
        "show": {
          "resource": [
            "status"
          ],
          "operation": [
            "POST /api/v4/users/status/ids"
          ]
        }
      }
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "status"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/status/custom"
          ]
        }
      },
      "required": true,
      "description": "User ID"
    },
    {
      "displayName": "Emoji",
      "name": "body_emoji",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "status"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/status/custom"
          ]
        }
      },
      "required": true,
      "description": "Any emoji"
    },
    {
      "displayName": "Text",
      "name": "body_text",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "status"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/status/custom"
          ]
        }
      },
      "required": true,
      "description": "Any custom status text"
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
            "status"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/status/custom"
          ]
        }
      },
      "options": [
        {
          "displayName": "Duration",
          "name": "body_duration",
          "type": "string",
          "default": "",
          "description": "Duration of custom status, can be `thirty_minutes`, `one_hour`, `four_hours`, `today`, `this_week` or `date_and_time`"
        },
        {
          "displayName": "Expires At",
          "name": "body_expires_at",
          "type": "string",
          "default": "",
          "description": "The time at which custom status should be expired. It should be in ISO format."
        }
      ]
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "status"
          ],
          "operation": [
            "DELETE /api/v4/users/{user_id}/status/custom"
          ]
        }
      },
      "required": true,
      "description": "User ID"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "status"
          ],
          "operation": [
            "POST /api/v4/users/{user_id}/status/custom/recent/delete"
          ]
        }
      },
      "required": true,
      "description": "User ID"
    },
    {
      "displayName": "Emoji",
      "name": "body_emoji",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "status"
          ],
          "operation": [
            "POST /api/v4/users/{user_id}/status/custom/recent/delete"
          ]
        }
      },
      "required": true,
      "description": "Any emoji"
    },
    {
      "displayName": "Text",
      "name": "body_text",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "status"
          ],
          "operation": [
            "POST /api/v4/users/{user_id}/status/custom/recent/delete"
          ]
        }
      },
      "required": true,
      "description": "Any custom status text"
    },
    {
      "displayName": "Duration",
      "name": "body_duration",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "status"
          ],
          "operation": [
            "POST /api/v4/users/{user_id}/status/custom/recent/delete"
          ]
        }
      },
      "required": true,
      "description": "Duration of custom status, can be `thirty_minutes`, `one_hour`, `four_hours`, `today`, `this_week` or `date_and_time`"
    },
    {
      "displayName": "Expires At",
      "name": "body_expires_at",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "status"
          ],
          "operation": [
            "POST /api/v4/users/{user_id}/status/custom/recent/delete"
          ]
        }
      },
      "required": true,
      "description": "The time at which custom status should be expired. It should be in ISO format."
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "system"
          ]
        }
      },
      "options": [
        {
          "name": "Get Client Configuration",
          "value": "GET /api/v4/config/client"
        }
      ],
      "default": "GET /api/v4/config/client",
      "noDataExpression": true
    },
    {
      "displayName": "Format",
      "name": "query_format",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "system"
          ],
          "operation": [
            "GET /api/v4/config/client"
          ]
        }
      },
      "required": true,
      "description": "Must be `old`, other formats not implemented yet"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ]
        }
      },
      "options": [
        {
          "name": "Get Teams",
          "value": "GET /api/v4/teams"
        },
        {
          "name": "Get A Team",
          "value": "GET /api/v4/teams/{team_id}"
        },
        {
          "name": "Get A Team By Name",
          "value": "GET /api/v4/teams/name/{name}"
        },
        {
          "name": "Get A User's Teams",
          "value": "GET /api/v4/users/{user_id}/teams"
        },
        {
          "name": "Get Team Members",
          "value": "GET /api/v4/teams/{team_id}/members"
        },
        {
          "name": "Get Team Members For A User",
          "value": "GET /api/v4/users/{user_id}/teams/members"
        },
        {
          "name": "Get A Team Member",
          "value": "GET /api/v4/teams/{team_id}/members/{user_id}"
        },
        {
          "name": "Get Team Members By Ids",
          "value": "POST /api/v4/teams/{team_id}/members/ids"
        },
        {
          "name": "Get A Team Stats",
          "value": "GET /api/v4/teams/{team_id}/stats"
        },
        {
          "name": "Update A Team Member Roles",
          "value": "PUT /api/v4/teams/{team_id}/members/{user_id}/roles"
        },
        {
          "name": "Get Team Unreads For A User",
          "value": "GET /api/v4/users/{user_id}/teams/unread"
        },
        {
          "name": "Get Unreads For A Team",
          "value": "GET /api/v4/users/{user_id}/teams/{team_id}/unread"
        },
        {
          "name": "Invite Guests To The Team By Email",
          "value": "POST /api/v4/teams/{team_id}/invite-guests/email"
        },
        {
          "name": "Search Files In A Team",
          "value": "POST /api/v4/teams/{team_id}/files/search"
        }
      ],
      "default": "GET /api/v4/teams",
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
            "teams"
          ],
          "operation": [
            "GET /api/v4/teams"
          ]
        }
      },
      "options": [
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select."
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of teams per page."
        },
        {
          "displayName": "Include Total Count",
          "name": "query_include_total_count",
          "type": "boolean",
          "default": false,
          "description": "Appends a total count of returned teams inside the response object - ex: `{ \"teams\": [], \"total_count\" : 0 }`.      "
        },
        {
          "displayName": "Exclude Policy Constrained",
          "name": "query_exclude_policy_constrained",
          "type": "boolean",
          "default": false,
          "description": "If set to true, teams which are part of a data retention policy will be excluded. The `sysconsole_read_compliance` permission is required to use this parameter.\n"
        }
      ]
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "Name",
      "name": "path_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ],
          "operation": [
            "GET /api/v4/teams/name/{name}"
          ]
        }
      },
      "required": true,
      "description": "Team Name"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/teams"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/members"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/members"
          ]
        }
      },
      "options": [
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select."
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of users per page."
        }
      ]
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/teams/members"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/members/{user_id}"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/members/{user_id}"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ],
          "operation": [
            "POST /api/v4/teams/{team_id}/members/ids"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "Body",
      "name": "body",
      "type": "json",
      "default": {},
      "required": true,
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ],
          "operation": [
            "POST /api/v4/teams/{team_id}/members/ids"
          ]
        }
      }
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ],
          "operation": [
            "GET /api/v4/teams/{team_id}/stats"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ],
          "operation": [
            "PUT /api/v4/teams/{team_id}/members/{user_id}/roles"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ],
          "operation": [
            "PUT /api/v4/teams/{team_id}/members/{user_id}/roles"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Roles",
      "name": "body_roles",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ],
          "operation": [
            "PUT /api/v4/teams/{team_id}/members/{user_id}/roles"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/teams/unread"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Exclude Team",
      "name": "query_exclude_team",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/teams/unread"
          ]
        }
      },
      "required": true,
      "description": "Optional team id to be excluded from the results"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/teams/unread"
          ]
        }
      },
      "options": [
        {
          "displayName": "Include Collapsed Threads",
          "name": "query_include_collapsed_threads",
          "type": "boolean",
          "default": false,
          "description": "Boolean to determine whether the collapsed threads should be included or not"
        }
      ]
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/teams/{team_id}/unread"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/teams/{team_id}/unread"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ],
          "operation": [
            "POST /api/v4/teams/{team_id}/invite-guests/email"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "Emails",
      "name": "body_emails",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ],
          "operation": [
            "POST /api/v4/teams/{team_id}/invite-guests/email"
          ]
        }
      },
      "required": true,
      "description": "List of emails"
    },
    {
      "displayName": "Channels",
      "name": "body_channels",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ],
          "operation": [
            "POST /api/v4/teams/{team_id}/invite-guests/email"
          ]
        }
      },
      "required": true,
      "description": "List of channel ids"
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
            "teams"
          ],
          "operation": [
            "POST /api/v4/teams/{team_id}/invite-guests/email"
          ]
        }
      },
      "options": [
        {
          "displayName": "Message",
          "name": "body_message",
          "type": "string",
          "default": "",
          "description": "Message to include in the invite"
        }
      ]
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ],
          "operation": [
            "POST /api/v4/teams/{team_id}/files/search"
          ]
        }
      },
      "required": true,
      "description": "Team GUID"
    },
    {
      "displayName": "Terms",
      "name": "body_terms",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ],
          "operation": [
            "POST /api/v4/teams/{team_id}/files/search"
          ]
        }
      },
      "required": true,
      "description": "The search terms as inputed by the user. To search for files from a user include `from:someusername`, using a user's username. To search in a specific channel include `in:somechannel`, using the channel name (not the display name). To search for specific extensions included `ext:extension`."
    },
    {
      "displayName": "Is Or Search",
      "name": "body_is_or_search",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "teams"
          ],
          "operation": [
            "POST /api/v4/teams/{team_id}/files/search"
          ]
        }
      },
      "required": true,
      "description": "Set to true if an Or search should be performed vs an And search."
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
            "teams"
          ],
          "operation": [
            "POST /api/v4/teams/{team_id}/files/search"
          ]
        }
      },
      "options": [
        {
          "displayName": "Time Zone Offset",
          "name": "body_time_zone_offset",
          "type": "number",
          "default": 0,
          "description": "Offset from UTC of user timezone for date searches."
        },
        {
          "displayName": "Include Deleted Channels",
          "name": "body_include_deleted_channels",
          "type": "boolean",
          "default": false,
          "description": "Set to true if deleted channels should be included in the search. (archived channels)"
        },
        {
          "displayName": "Page",
          "name": "body_page",
          "type": "number",
          "default": 0,
          "description": "The page to select. (Only works with Elasticsearch)"
        },
        {
          "displayName": "Per Page",
          "name": "body_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of posts per page. (Only works with Elasticsearch)"
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
            "threads"
          ]
        }
      },
      "options": [
        {
          "name": "Get All Threads That User Is Following",
          "value": "GET /api/v4/users/{user_id}/teams/{team_id}/threads"
        },
        {
          "name": "Mark All Threads That User Is Following As Read",
          "value": "PUT /api/v4/users/{user_id}/teams/{team_id}/threads/read"
        },
        {
          "name": "Mark A Thread That User Is Following Read State To The Timestamp",
          "value": "PUT /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/read/{timestamp}"
        },
        {
          "name": "Mark A Thread That User Is Following As Unread Based On A Post ID",
          "value": "PUT /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/set_unread/{post_id}"
        },
        {
          "name": "Start Following A Thread",
          "value": "PUT /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/following"
        },
        {
          "name": "Stop Following A Thread",
          "value": "DELETE /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/following"
        },
        {
          "name": "Get A Thread Followed By The User",
          "value": "GET /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}"
        }
      ],
      "default": "GET /api/v4/users/{user_id}/teams/{team_id}/threads",
      "noDataExpression": true
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "threads"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/teams/{team_id}/threads"
          ]
        }
      },
      "required": true,
      "description": "The ID of the user. This can also be \"me\" which will point to the current user."
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "threads"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/teams/{team_id}/threads"
          ]
        }
      },
      "required": true,
      "description": "The ID of the team in which the thread is."
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "threads"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/teams/{team_id}/threads"
          ]
        }
      },
      "options": [
        {
          "displayName": "Since",
          "name": "query_since",
          "type": "number",
          "default": 0,
          "description": "Since filters the threads based on their LastUpdateAt timestamp."
        },
        {
          "displayName": "Deleted",
          "name": "query_deleted",
          "type": "boolean",
          "default": false,
          "description": "Deleted will specify that even deleted threads should be returned (For mobile sync)."
        },
        {
          "displayName": "Extended",
          "name": "query_extended",
          "type": "boolean",
          "default": false,
          "description": "Extended will enrich the response with participant details."
        },
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "Page specifies which part of the results to return, by PageSize."
        },
        {
          "displayName": "PageSize",
          "name": "query_pageSize",
          "type": "number",
          "default": 0,
          "description": "PageSize specifies the size of the returned chunk of results."
        },
        {
          "displayName": "TotalsOnly",
          "name": "query_totalsOnly",
          "type": "boolean",
          "default": false,
          "description": "Setting this to true will only return the total counts."
        },
        {
          "displayName": "ThreadsOnly",
          "name": "query_threadsOnly",
          "type": "boolean",
          "default": false,
          "description": "Setting this to true will only return threads."
        }
      ]
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "threads"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/teams/{team_id}/threads/read"
          ]
        }
      },
      "required": true,
      "description": "The ID of the user. This can also be \"me\" which will point to the current user."
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "threads"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/teams/{team_id}/threads/read"
          ]
        }
      },
      "required": true,
      "description": "The ID of the team in which the thread is."
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "threads"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/read/{timestamp}"
          ]
        }
      },
      "required": true,
      "description": "The ID of the user. This can also be \"me\" which will point to the current user."
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "threads"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/read/{timestamp}"
          ]
        }
      },
      "required": true,
      "description": "The ID of the team in which the thread is."
    },
    {
      "displayName": "Thread Id",
      "name": "path_thread_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "threads"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/read/{timestamp}"
          ]
        }
      },
      "required": true,
      "description": "The ID of the thread to update"
    },
    {
      "displayName": "Timestamp",
      "name": "path_timestamp",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "threads"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/read/{timestamp}"
          ]
        }
      },
      "required": true,
      "description": "The timestamp to which the thread's \"last read\" state will be reset."
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "threads"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/set_unread/{post_id}"
          ]
        }
      },
      "required": true,
      "description": "The ID of the user. This can also be \"me\" which will point to the current user."
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "threads"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/set_unread/{post_id}"
          ]
        }
      },
      "required": true,
      "description": "The ID of the team in which the thread is."
    },
    {
      "displayName": "Thread Id",
      "name": "path_thread_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "threads"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/set_unread/{post_id}"
          ]
        }
      },
      "required": true,
      "description": "The ID of the thread to update"
    },
    {
      "displayName": "Post Id",
      "name": "path_post_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "threads"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/set_unread/{post_id}"
          ]
        }
      },
      "required": true,
      "description": "The ID of a post belonging to the thread to mark as unread."
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "threads"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/following"
          ]
        }
      },
      "required": true,
      "description": "The ID of the user. This can also be \"me\" which will point to the current user."
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "threads"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/following"
          ]
        }
      },
      "required": true,
      "description": "The ID of the team in which the thread is."
    },
    {
      "displayName": "Thread Id",
      "name": "path_thread_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "threads"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/following"
          ]
        }
      },
      "required": true,
      "description": "The ID of the thread to follow"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "threads"
          ],
          "operation": [
            "DELETE /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/following"
          ]
        }
      },
      "required": true,
      "description": "The ID of the user. This can also be \"me\" which will point to the current user."
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "threads"
          ],
          "operation": [
            "DELETE /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/following"
          ]
        }
      },
      "required": true,
      "description": "The ID of the team in which the thread is."
    },
    {
      "displayName": "Thread Id",
      "name": "path_thread_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "threads"
          ],
          "operation": [
            "DELETE /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/following"
          ]
        }
      },
      "required": true,
      "description": "The ID of the thread to update"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "threads"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}"
          ]
        }
      },
      "required": true,
      "description": "The ID of the user. This can also be \"me\" which will point to the current user."
    },
    {
      "displayName": "Team Id",
      "name": "path_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "threads"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}"
          ]
        }
      },
      "required": true,
      "description": "The ID of the team in which the thread is."
    },
    {
      "displayName": "Thread Id",
      "name": "path_thread_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "threads"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}"
          ]
        }
      },
      "required": true,
      "description": "The ID of the thread to follow"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "users"
          ]
        }
      },
      "options": [
        {
          "name": "Get Users",
          "value": "GET /api/v4/users"
        },
        {
          "name": "Get Users By Ids",
          "value": "POST /api/v4/users/ids"
        },
        {
          "name": "Get Users By Group Channels Ids",
          "value": "POST /api/v4/users/group_channels"
        },
        {
          "name": "Get Users By Usernames",
          "value": "POST /api/v4/users/usernames"
        },
        {
          "name": "Search Users",
          "value": "POST /api/v4/users/search"
        },
        {
          "name": "Autocomplete Users",
          "value": "GET /api/v4/users/autocomplete"
        },
        {
          "name": "Get A User",
          "value": "GET /api/v4/users/{user_id}"
        },
        {
          "name": "Patch A User",
          "value": "PUT /api/v4/users/{user_id}/patch"
        },
        {
          "name": "Update A User's Roles",
          "value": "PUT /api/v4/users/{user_id}/roles"
        },
        {
          "name": "Get User's Profile Image",
          "value": "GET /api/v4/users/{user_id}/image"
        },
        {
          "name": "Return User's Default (generated) Profile Image",
          "value": "GET /api/v4/users/{user_id}/image/default"
        },
        {
          "name": "Get A User By Username",
          "value": "GET /api/v4/users/username/{username}"
        },
        {
          "name": "Get A User By Email",
          "value": "GET /api/v4/users/email/{email}"
        },
        {
          "name": "Publish A User Typing Websocket Event.",
          "value": "POST /api/v4/users/{user_id}/typing"
        },
        {
          "name": "Get All Channel Members For A User",
          "value": "GET /api/v4/users/{user_id}/channel_members"
        }
      ],
      "default": "GET /api/v4/users",
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
            "users"
          ],
          "operation": [
            "GET /api/v4/users"
          ]
        }
      },
      "options": [
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select."
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of users per page. There is a maximum limit of 200 users per page."
        },
        {
          "displayName": "In Team",
          "name": "query_in_team",
          "type": "string",
          "default": "",
          "description": "The ID of the team to get users for."
        },
        {
          "displayName": "Not In Team",
          "name": "query_not_in_team",
          "type": "string",
          "default": "",
          "description": "The ID of the team to exclude users for. Must not be used with \"in_team\" query parameter."
        },
        {
          "displayName": "In Channel",
          "name": "query_in_channel",
          "type": "string",
          "default": "",
          "description": "The ID of the channel to get users for."
        },
        {
          "displayName": "Not In Channel",
          "name": "query_not_in_channel",
          "type": "string",
          "default": "",
          "description": "The ID of the channel to exclude users for. Must be used with \"in_channel\" query parameter."
        },
        {
          "displayName": "In Group",
          "name": "query_in_group",
          "type": "string",
          "default": "",
          "description": "The ID of the group to get users for. Must have `manage_system` permission."
        },
        {
          "displayName": "Group Constrained",
          "name": "query_group_constrained",
          "type": "boolean",
          "default": false,
          "description": "When used with `not_in_channel` or `not_in_team`, returns only the users that are allowed to join the channel or team based on its group constrains."
        },
        {
          "displayName": "Without Team",
          "name": "query_without_team",
          "type": "boolean",
          "default": false,
          "description": "Whether or not to list users that are not on any team. This option takes precendence over `in_team`, `in_channel`, and `not_in_channel`."
        },
        {
          "displayName": "Active",
          "name": "query_active",
          "type": "boolean",
          "default": false,
          "description": "Whether or not to list only users that are active. This option cannot be used along with the `inactive` option."
        },
        {
          "displayName": "Inactive",
          "name": "query_inactive",
          "type": "boolean",
          "default": false,
          "description": "Whether or not to list only users that are deactivated. This option cannot be used along with the `active` option."
        },
        {
          "displayName": "Role",
          "name": "query_role",
          "type": "string",
          "default": "",
          "description": "Returns users that have this role."
        },
        {
          "displayName": "Sort",
          "name": "query_sort",
          "type": "string",
          "default": "",
          "description": "Sort is only available in conjunction with certain options below. The paging parameter is also always available.\n\n##### `in_team`\nCan be \"\", \"last_activity_at\" or \"create_at\".\nWhen left blank, sorting is done by username.\n##### `in_channel`\nCan be \"\", \"status\".\nWhen left blank, sorting is done by username. `status` will sort by User's current status (Online, Away, DND, Offline), then by Username.\n"
        },
        {
          "displayName": "Roles",
          "name": "query_roles",
          "type": "string",
          "default": "",
          "description": "Comma separated string used to filter users based on any of the specified system roles\n\nExample: `?roles=system_admin,system_user` will return users that are either system admins or system users\n\n"
        },
        {
          "displayName": "Channel Roles",
          "name": "query_channel_roles",
          "type": "string",
          "default": "",
          "description": "Comma separated string used to filter users based on any of the specified channel roles, can only be used in conjunction with `in_channel`\n\nExample: `?in_channel=4eb6axxw7fg3je5iyasnfudc5y&channel_roles=channel_user` will return users that are only channel users and not admins or guests\n\n"
        },
        {
          "displayName": "Team Roles",
          "name": "query_team_roles",
          "type": "string",
          "default": "",
          "description": "Comma separated string used to filter users based on any of the specified team roles, can only be used in conjunction with `in_team`\n\nExample: `?in_team=4eb6axxw7fg3je5iyasnfudc5y&team_roles=team_user` will return users that are only team users and not admins or guests\n\n"
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
            "users"
          ],
          "operation": [
            "POST /api/v4/users/ids"
          ]
        }
      },
      "options": [
        {
          "displayName": "Since",
          "name": "query_since",
          "type": "number",
          "default": 0,
          "description": "Only return users that have been modified since the given Unix timestamp (in milliseconds).\n\n"
        }
      ]
    },
    {
      "displayName": "Body",
      "name": "body",
      "type": "json",
      "default": {},
      "required": true,
      "displayOptions": {
        "show": {
          "resource": [
            "users"
          ],
          "operation": [
            "POST /api/v4/users/ids"
          ]
        }
      }
    },
    {
      "displayName": "Body",
      "name": "body",
      "type": "json",
      "default": {},
      "required": true,
      "displayOptions": {
        "show": {
          "resource": [
            "users"
          ],
          "operation": [
            "POST /api/v4/users/group_channels"
          ]
        }
      }
    },
    {
      "displayName": "Body",
      "name": "body",
      "type": "json",
      "default": {},
      "required": true,
      "displayOptions": {
        "show": {
          "resource": [
            "users"
          ],
          "operation": [
            "POST /api/v4/users/usernames"
          ]
        }
      }
    },
    {
      "displayName": "Term",
      "name": "body_term",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "users"
          ],
          "operation": [
            "POST /api/v4/users/search"
          ]
        }
      },
      "required": true,
      "description": "The term to match against username, full name, nickname and email"
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
            "users"
          ],
          "operation": [
            "POST /api/v4/users/search"
          ]
        }
      },
      "options": [
        {
          "displayName": "Team Id",
          "name": "body_team_id",
          "type": "string",
          "default": "",
          "description": "If provided, only search users on this team"
        },
        {
          "displayName": "Not In Team Id",
          "name": "body_not_in_team_id",
          "type": "string",
          "default": "",
          "description": "If provided, only search users not on this team"
        },
        {
          "displayName": "In Channel Id",
          "name": "body_in_channel_id",
          "type": "string",
          "default": "",
          "description": "If provided, only search users in this channel"
        },
        {
          "displayName": "Not In Channel Id",
          "name": "body_not_in_channel_id",
          "type": "string",
          "default": "",
          "description": "If provided, only search users not in this channel. Must specifiy `team_id` when using this option"
        },
        {
          "displayName": "In Group Id",
          "name": "body_in_group_id",
          "type": "string",
          "default": "",
          "description": "If provided, only search users in this group. Must have `manage_system` permission."
        },
        {
          "displayName": "Group Constrained",
          "name": "body_group_constrained",
          "type": "boolean",
          "default": false,
          "description": "When used with `not_in_channel_id` or `not_in_team_id`, returns only the users that are allowed to join the channel or team based on its group constrains."
        },
        {
          "displayName": "Allow Inactive",
          "name": "body_allow_inactive",
          "type": "boolean",
          "default": false,
          "description": "When `true`, include deactivated users in the results"
        },
        {
          "displayName": "Without Team",
          "name": "body_without_team",
          "type": "boolean",
          "default": false,
          "description": "Set this to `true` if you would like to search for users that are not on a team. This option takes precendence over `team_id`, `in_channel_id`, and `not_in_channel_id`."
        },
        {
          "displayName": "Limit",
          "name": "body_limit",
          "type": "number",
          "default": 0,
          "description": "The maximum number of users to return in the results\n\n__Defaults to `100` if not provided.__\n"
        }
      ]
    },
    {
      "displayName": "Name",
      "name": "query_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "users"
          ],
          "operation": [
            "GET /api/v4/users/autocomplete"
          ]
        }
      },
      "required": true,
      "description": "Username, nickname first name or last name"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "users"
          ],
          "operation": [
            "GET /api/v4/users/autocomplete"
          ]
        }
      },
      "options": [
        {
          "displayName": "Team Id",
          "name": "query_team_id",
          "type": "string",
          "default": "",
          "description": "Team ID"
        },
        {
          "displayName": "Channel Id",
          "name": "query_channel_id",
          "type": "string",
          "default": "",
          "description": "Channel ID"
        },
        {
          "displayName": "Limit",
          "name": "query_limit",
          "type": "number",
          "default": 0,
          "description": "The maximum number of users to return in each subresult\n\n__Defaults to `100` if not provided.__\n"
        }
      ]
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "users"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}"
          ]
        }
      },
      "required": true,
      "description": "User GUID. This can also be \"me\" which will point to the current user."
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "users"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/patch"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
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
            "users"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/patch"
          ]
        }
      },
      "options": [
        {
          "displayName": "Email",
          "name": "body_email",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Username",
          "name": "body_username",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "First Name",
          "name": "body_first_name",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Last Name",
          "name": "body_last_name",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Nickname",
          "name": "body_nickname",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Locale",
          "name": "body_locale",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Position",
          "name": "body_position",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Props",
          "name": "body_props",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Notify Props",
          "name": "body_notify_props",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "users"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/roles"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Roles",
      "name": "body_roles",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "users"
          ],
          "operation": [
            "PUT /api/v4/users/{user_id}/roles"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "users"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/image"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "users"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/image"
          ]
        }
      },
      "options": [
        {
          "displayName": " ",
          "name": "query__",
          "type": "number",
          "default": 0,
          "description": "Not used by the server. Clients can pass in the last picture update time of the user to potentially take advantage of caching"
        }
      ]
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "users"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/image/default"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Username",
      "name": "path_username",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "users"
          ],
          "operation": [
            "GET /api/v4/users/username/{username}"
          ]
        }
      },
      "required": true,
      "description": "Username"
    },
    {
      "displayName": "Email",
      "name": "path_email",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "users"
          ],
          "operation": [
            "GET /api/v4/users/email/{email}"
          ]
        }
      },
      "required": true,
      "description": "User Email"
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "users"
          ],
          "operation": [
            "POST /api/v4/users/{user_id}/typing"
          ]
        }
      },
      "required": true,
      "description": "User GUID"
    },
    {
      "displayName": "Channel Id",
      "name": "body_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "users"
          ],
          "operation": [
            "POST /api/v4/users/{user_id}/typing"
          ]
        }
      },
      "required": true,
      "description": "The id of the channel to which to direct the typing event."
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
            "users"
          ],
          "operation": [
            "POST /api/v4/users/{user_id}/typing"
          ]
        }
      },
      "options": [
        {
          "displayName": "Parent Id",
          "name": "body_parent_id",
          "type": "string",
          "default": "",
          "description": "The optional id of the root post of the thread to which the user is replying. If unset, the typing event is directed at the entire channel."
        }
      ]
    },
    {
      "displayName": "User Id",
      "name": "path_user_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "users"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/channel_members"
          ]
        }
      },
      "required": true,
      "description": "The ID of the user. This can also be \"me\" which will point to the current user."
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "users"
          ],
          "operation": [
            "GET /api/v4/users/{user_id}/channel_members"
          ]
        }
      },
      "options": [
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "Page specifies which part of the results to return, by PageSize."
        },
        {
          "displayName": "PageSize",
          "name": "query_pageSize",
          "type": "number",
          "default": 0,
          "description": "PageSize specifies the size of the returned chunk of results."
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
            "webhooks"
          ]
        }
      },
      "options": [
        {
          "name": "List Incoming Webhooks",
          "value": "GET /api/v4/hooks/incoming"
        },
        {
          "name": "Create An Incoming Webhook",
          "value": "POST /api/v4/hooks/incoming"
        },
        {
          "name": "Get An Incoming Webhook",
          "value": "GET /api/v4/hooks/incoming/{hook_id}"
        },
        {
          "name": "Update An Incoming Webhook",
          "value": "PUT /api/v4/hooks/incoming/{hook_id}"
        },
        {
          "name": "Delete An Incoming Webhook",
          "value": "DELETE /api/v4/hooks/incoming/{hook_id}"
        },
        {
          "name": "List Outgoing Webhooks",
          "value": "GET /api/v4/hooks/outgoing"
        },
        {
          "name": "Create An Outgoing Webhook",
          "value": "POST /api/v4/hooks/outgoing"
        },
        {
          "name": "Get An Outgoing Webhook",
          "value": "GET /api/v4/hooks/outgoing/{hook_id}"
        },
        {
          "name": "Update An Outgoing Webhook",
          "value": "PUT /api/v4/hooks/outgoing/{hook_id}"
        },
        {
          "name": "Delete An Outgoing Webhook",
          "value": "DELETE /api/v4/hooks/outgoing/{hook_id}"
        },
        {
          "name": "Regenerate The Token For The Outgoing Webhook.",
          "value": "POST /api/v4/hooks/outgoing/{hook_id}/regen_token"
        }
      ],
      "default": "GET /api/v4/hooks/incoming",
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
            "webhooks"
          ],
          "operation": [
            "GET /api/v4/hooks/incoming"
          ]
        }
      },
      "options": [
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select."
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of hooks per page."
        },
        {
          "displayName": "Team Id",
          "name": "query_team_id",
          "type": "string",
          "default": "",
          "description": "The ID of the team to get hooks for."
        }
      ]
    },
    {
      "displayName": "Channel Id",
      "name": "body_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "webhooks"
          ],
          "operation": [
            "POST /api/v4/hooks/incoming"
          ]
        }
      },
      "required": true,
      "description": "The ID of a public channel or private group that receives the webhook payloads."
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
            "webhooks"
          ],
          "operation": [
            "POST /api/v4/hooks/incoming"
          ]
        }
      },
      "options": [
        {
          "displayName": "User Id",
          "name": "body_user_id",
          "type": "string",
          "default": "",
          "description": "The ID of the owner of the webhook if different than the requester."
        },
        {
          "displayName": "Display Name",
          "name": "body_display_name",
          "type": "string",
          "default": "",
          "description": "The display name for this incoming webhook"
        },
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": "",
          "description": "The description for this incoming webhook"
        },
        {
          "displayName": "Username",
          "name": "body_username",
          "type": "string",
          "default": "",
          "description": "The username this incoming webhook will post as."
        },
        {
          "displayName": "Icon Url",
          "name": "body_icon_url",
          "type": "string",
          "default": "",
          "description": "The profile picture this incoming webhook will use when posting."
        }
      ]
    },
    {
      "displayName": "Hook Id",
      "name": "path_hook_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "webhooks"
          ],
          "operation": [
            "GET /api/v4/hooks/incoming/{hook_id}"
          ]
        }
      },
      "required": true,
      "description": "Incoming Webhook GUID"
    },
    {
      "displayName": "Hook Id",
      "name": "path_hook_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "webhooks"
          ],
          "operation": [
            "PUT /api/v4/hooks/incoming/{hook_id}"
          ]
        }
      },
      "required": true,
      "description": "Incoming Webhook GUID"
    },
    {
      "displayName": "Id",
      "name": "body_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "webhooks"
          ],
          "operation": [
            "PUT /api/v4/hooks/incoming/{hook_id}"
          ]
        }
      },
      "required": true,
      "description": "Incoming webhook GUID"
    },
    {
      "displayName": "Channel Id",
      "name": "body_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "webhooks"
          ],
          "operation": [
            "PUT /api/v4/hooks/incoming/{hook_id}"
          ]
        }
      },
      "required": true,
      "description": "The ID of a public channel or private group that receives the webhook payloads."
    },
    {
      "displayName": "Display Name",
      "name": "body_display_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "webhooks"
          ],
          "operation": [
            "PUT /api/v4/hooks/incoming/{hook_id}"
          ]
        }
      },
      "required": true,
      "description": "The display name for this incoming webhook"
    },
    {
      "displayName": "Description",
      "name": "body_description",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "webhooks"
          ],
          "operation": [
            "PUT /api/v4/hooks/incoming/{hook_id}"
          ]
        }
      },
      "required": true,
      "description": "The description for this incoming webhook"
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
            "webhooks"
          ],
          "operation": [
            "PUT /api/v4/hooks/incoming/{hook_id}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Username",
          "name": "body_username",
          "type": "string",
          "default": "",
          "description": "The username this incoming webhook will post as."
        },
        {
          "displayName": "Icon Url",
          "name": "body_icon_url",
          "type": "string",
          "default": "",
          "description": "The profile picture this incoming webhook will use when posting."
        }
      ]
    },
    {
      "displayName": "Hook Id",
      "name": "path_hook_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "webhooks"
          ],
          "operation": [
            "DELETE /api/v4/hooks/incoming/{hook_id}"
          ]
        }
      },
      "required": true,
      "description": "Incoming webhook GUID"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "webhooks"
          ],
          "operation": [
            "GET /api/v4/hooks/outgoing"
          ]
        }
      },
      "options": [
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0,
          "description": "The page to select."
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0,
          "description": "The number of hooks per page."
        },
        {
          "displayName": "Team Id",
          "name": "query_team_id",
          "type": "string",
          "default": "",
          "description": "The ID of the team to get hooks for."
        },
        {
          "displayName": "Channel Id",
          "name": "query_channel_id",
          "type": "string",
          "default": "",
          "description": "The ID of the channel to get hooks for."
        }
      ]
    },
    {
      "displayName": "Team Id",
      "name": "body_team_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "webhooks"
          ],
          "operation": [
            "POST /api/v4/hooks/outgoing"
          ]
        }
      },
      "required": true,
      "description": "The ID of the team that the webhook watchs"
    },
    {
      "displayName": "Display Name",
      "name": "body_display_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "webhooks"
          ],
          "operation": [
            "POST /api/v4/hooks/outgoing"
          ]
        }
      },
      "required": true,
      "description": "The display name for this outgoing webhook"
    },
    {
      "displayName": "Trigger Words",
      "name": "body_trigger_words",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "webhooks"
          ],
          "operation": [
            "POST /api/v4/hooks/outgoing"
          ]
        }
      },
      "required": true,
      "description": "List of words for the webhook to trigger on"
    },
    {
      "displayName": "Callback Urls",
      "name": "body_callback_urls",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "webhooks"
          ],
          "operation": [
            "POST /api/v4/hooks/outgoing"
          ]
        }
      },
      "required": true,
      "description": "The URLs to POST the payloads to when the webhook is triggered"
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
            "webhooks"
          ],
          "operation": [
            "POST /api/v4/hooks/outgoing"
          ]
        }
      },
      "options": [
        {
          "displayName": "Channel Id",
          "name": "body_channel_id",
          "type": "string",
          "default": "",
          "description": "The ID of a public channel that the webhook watchs"
        },
        {
          "displayName": "Creator Id",
          "name": "body_creator_id",
          "type": "string",
          "default": "",
          "description": "The ID of the owner of the webhook if different than the requester."
        },
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": "",
          "description": "The description for this outgoing webhook"
        },
        {
          "displayName": "Trigger When",
          "name": "body_trigger_when",
          "type": "number",
          "default": 0,
          "description": "When to trigger the webhook, `0` when a trigger word is present at all and `1` if the message starts with a trigger word"
        },
        {
          "displayName": "Content Type",
          "name": "body_content_type",
          "type": "string",
          "default": "",
          "description": "The format to POST the data in, either `application/json` or `application/x-www-form-urlencoded`"
        }
      ]
    },
    {
      "displayName": "Hook Id",
      "name": "path_hook_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "webhooks"
          ],
          "operation": [
            "GET /api/v4/hooks/outgoing/{hook_id}"
          ]
        }
      },
      "required": true,
      "description": "Outgoing webhook GUID"
    },
    {
      "displayName": "Hook Id",
      "name": "path_hook_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "webhooks"
          ],
          "operation": [
            "PUT /api/v4/hooks/outgoing/{hook_id}"
          ]
        }
      },
      "required": true,
      "description": "outgoing Webhook GUID"
    },
    {
      "displayName": "Id",
      "name": "body_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "webhooks"
          ],
          "operation": [
            "PUT /api/v4/hooks/outgoing/{hook_id}"
          ]
        }
      },
      "required": true,
      "description": "Outgoing webhook GUID"
    },
    {
      "displayName": "Channel Id",
      "name": "body_channel_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "webhooks"
          ],
          "operation": [
            "PUT /api/v4/hooks/outgoing/{hook_id}"
          ]
        }
      },
      "required": true,
      "description": "The ID of a public channel or private group that receives the webhook payloads."
    },
    {
      "displayName": "Display Name",
      "name": "body_display_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "webhooks"
          ],
          "operation": [
            "PUT /api/v4/hooks/outgoing/{hook_id}"
          ]
        }
      },
      "required": true,
      "description": "The display name for this incoming webhook"
    },
    {
      "displayName": "Description",
      "name": "body_description",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "webhooks"
          ],
          "operation": [
            "PUT /api/v4/hooks/outgoing/{hook_id}"
          ]
        }
      },
      "required": true,
      "description": "The description for this incoming webhook"
    },
    {
      "displayName": "Hook Id",
      "name": "path_hook_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "webhooks"
          ],
          "operation": [
            "DELETE /api/v4/hooks/outgoing/{hook_id}"
          ]
        }
      },
      "required": true,
      "description": "Outgoing webhook GUID"
    },
    {
      "displayName": "Hook Id",
      "name": "path_hook_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "webhooks"
          ],
          "operation": [
            "POST /api/v4/hooks/outgoing/{hook_id}/regen_token"
          ]
        }
      },
      "required": true,
      "description": "Outgoing webhook GUID"
    },
    {
      "displayName": "Return All",
      "name": "returnAll",
      "type": "boolean",
      "default": true,
      "displayOptions": {
        "show": {
          "resource": [
            "bots",
            "channels",
            "channels",
            "channels",
            "channels",
            "channels",
            "emoji",
            "groups",
            "groups",
            "groups",
            "groups",
            "insights",
            "insights",
            "insights",
            "insights",
            "insights",
            "insights",
            "insights",
            "insights",
            "posts",
            "posts",
            "teams",
            "teams",
            "users",
            "webhooks",
            "webhooks"
          ],
          "operation": [
            "GET /api/v4/bots",
            "GET /api/v4/channels",
            "GET /api/v4/teams/{team_id}/channels",
            "GET /api/v4/teams/{team_id}/channels/private",
            "GET /api/v4/teams/{team_id}/channels/deleted",
            "GET /api/v4/channels/{channel_id}/members",
            "GET /api/v4/emoji",
            "GET /api/v4/groups",
            "GET /api/v4/channels/{channel_id}/groups",
            "GET /api/v4/teams/{team_id}/groups",
            "GET /api/v4/teams/{team_id}/groups_by_channels",
            "GET /api/v4/teams/{team_id}/top/reactions",
            "GET /api/v4/users/me/top/reactions",
            "GET /api/v4/teams/{team_id}/top/channels",
            "GET /api/v4/users/me/top/channels",
            "GET /api/v4/teams/{team_id}/top/team_members",
            "GET /api/v4/teams/{team_id}/top/threads",
            "GET /api/v4/users/me/top/threads",
            "GET /api/v4/users/me/top/dms",
            "GET /api/v4/users/{user_id}/posts/flagged",
            "GET /api/v4/channels/{channel_id}/posts",
            "GET /api/v4/teams",
            "GET /api/v4/teams/{team_id}/members",
            "GET /api/v4/users",
            "GET /api/v4/hooks/incoming",
            "GET /api/v4/hooks/outgoing"
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
            "bots",
            "channels",
            "channels",
            "channels",
            "channels",
            "channels",
            "emoji",
            "groups",
            "groups",
            "groups",
            "groups",
            "insights",
            "insights",
            "insights",
            "insights",
            "insights",
            "insights",
            "insights",
            "insights",
            "posts",
            "posts",
            "teams",
            "teams",
            "users",
            "webhooks",
            "webhooks"
          ],
          "operation": [
            "GET /api/v4/bots",
            "GET /api/v4/channels",
            "GET /api/v4/teams/{team_id}/channels",
            "GET /api/v4/teams/{team_id}/channels/private",
            "GET /api/v4/teams/{team_id}/channels/deleted",
            "GET /api/v4/channels/{channel_id}/members",
            "GET /api/v4/emoji",
            "GET /api/v4/groups",
            "GET /api/v4/channels/{channel_id}/groups",
            "GET /api/v4/teams/{team_id}/groups",
            "GET /api/v4/teams/{team_id}/groups_by_channels",
            "GET /api/v4/teams/{team_id}/top/reactions",
            "GET /api/v4/users/me/top/reactions",
            "GET /api/v4/teams/{team_id}/top/channels",
            "GET /api/v4/users/me/top/channels",
            "GET /api/v4/teams/{team_id}/top/team_members",
            "GET /api/v4/teams/{team_id}/top/threads",
            "GET /api/v4/users/me/top/threads",
            "GET /api/v4/users/me/top/dms",
            "GET /api/v4/users/{user_id}/posts/flagged",
            "GET /api/v4/channels/{channel_id}/posts",
            "GET /api/v4/teams",
            "GET /api/v4/teams/{team_id}/members",
            "GET /api/v4/users",
            "GET /api/v4/hooks/incoming",
            "GET /api/v4/hooks/outgoing"
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
