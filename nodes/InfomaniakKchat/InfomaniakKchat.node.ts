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
  "Bots": {
    "Get Bots": {
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
    "Create A Bot": {
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
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Get A Bot": {
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
    "Patch A Bot": {
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
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Disable A Bot": {
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
    "Enable A Bot": {
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
  "Channels": {
    "Get A List Of All Channels": {
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
    "Create A Channel": {
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
          "name": "type",
          "field": "body_type"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Create A Direct Message Channel": {
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
    "Create A Group Message Channel": {
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
    "Search All Private And Open Type Channels": {
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
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Search Group Channels": {
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
    "Get A List Of Channels By Ids": {
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
    "Get A Channel": {
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
    "Update A Channel": {
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
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete A Channel": {
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
    "Patch A Channel": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Update Channel's Privacy": {
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
    "Restore A Channel": {
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
    "Move A Channel": {
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
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Get Channel Statistics": {
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
    "Get A Channel's Pinned Posts": {
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
    "Get Public Channels": {
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
    "Get Private Channels": {
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
    "Get Deleted Channels": {
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
    "Autocomplete Channels": {
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
    "Autocomplete Channels For Search": {
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
    "Search Channels": {
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
    "Search Archived Channels": {
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
    "Get A Channel By Name": {
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
    "Get A Channel By Name And Team Name": {
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
    "Get Channel Members": {
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
    "Add User(s) To Channel": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Get Channel Members By Ids": {
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
    "Get Channel Member": {
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
    "Remove User From Channel": {
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
    "Update Channel Roles": {
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
    "Update The Scheme Derived Roles Of A Channel Member.": {
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
    "Update Channel Notifications": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "View Channel": {
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
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Get Channel Memberships And Roles For A User": {
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
    "Get Channels For User": {
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
    "Get All Channels": {
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
    "Get Unread Messages": {
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
    "Set A Channel's Scheme": {
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
    "Get Information About Channel's Moderation.": {
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
    "Update A Channel's Moderation Settings.": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Get User's Sidebar Categories": {
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
    "Create User's Sidebar Category": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Update User's Sidebar Categories": {
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
    "Get User's Sidebar Category Order": {
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
    "Update User's Sidebar Category Order": {
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
    "Get Sidebar Category": {
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
    "Update Sidebar Category": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete Sidebar Category": {
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
  "Commands": {
    "List Commands For A Team": {
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
    "Create A Command": {
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
    "List Autocomplete Commands": {
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
    "List Commands' Autocomplete Data": {
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
    "Get A Command": {
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
    "Update A Command": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete A Command": {
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
    "Generate A New Token": {
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
    "Execute A Command": {
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
  "Emoji": {
    "Get A List Of Custom Emoji": {
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
    "Create A Custom Emoji": {
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
    "Get A Custom Emoji": {
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
    "Delete A Custom Emoji": {
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
    "Get A Custom Emoji By Name": {
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
    "Get Custom Emoji Image": {
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
    "Search Custom Emoji": {
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
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Autocomplete Custom Emoji": {
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
  "Files": {
    "Upload A File": {
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
    "Get A File": {
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
    "Get A File's Thumbnail": {
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
    "Get A File's Preview": {
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
    "Get Metadata For A File": {
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
  "Groups": {
    "Get Groups": {
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
    "Get Channel Groups": {
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
    "Get Team Groups": {
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
    "Get Team Groups By Channels": {
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
    "Get Groups For A User ID": {
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
  "Insights": {
    "Get A List Of The Top Reactions For A Team.": {
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
    "Get A List Of The Top Reactions For A User.": {
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
    "Get A List Of The Top Channels For A Team.": {
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
    "Get A List Of The Top Channels For A User.": {
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
    "Get A List Of New Team Members.": {
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
    "Get A List Of The Top Threads For A Team.": {
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
    "Get A List Of The Top Threads For A User.": {
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
    "Get A List Of The Top Dms For A User.": {
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
  "Posts": {
    "Create A Post": {
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
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Create A Ephemeral Post": {
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
    "Get A Post": {
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
    "Delete A Post": {
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
    "Mark As Unread From A Post.": {
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
    "Patch A Post": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Get A Thread": {
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
    "Get A List Of Flagged Posts": {
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
    "Get File Info For Post": {
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
    "Get Posts For A Channel": {
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
    "Get Posts Around Oldest Unread": {
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
    "Search For Team Posts": {
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
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Pin A Post To The Channel": {
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
    "Unpin A Post To The Channel": {
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
    "Perform A Post Action": {
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
    "Get Posts By A List Of Ids": {
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
    "Set A Post Reminder": {
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
  "Preferences": {
    "Get The User's Preferences": {
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
    "Save The User's Preferences": {
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
    "Delete User's Preferences": {
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
    "List A User's Preferences By Category": {
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
    "Get A Specific User Preference": {
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
  "Reactions": {
    "Create A Reaction": {
      "method": "POST",
      "path": "/api/v4/reactions",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Get A List Of Reactions To A Post": {
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
    "Remove A Reaction From A Post": {
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
  "Roles": {
    "Get A List Of All The Roles": {
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
    "Get A Role": {
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
    "Get A Role By Name": {
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
    "Get A List Of Roles By Name": {
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
  "Status": {
    "Get User Status": {
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
    "Update User Status": {
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
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Get User Statuses By ID": {
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
    "Update User Custom Status": {
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
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Unsets User Custom Status": {
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
    "Delete User's Recent Custom Status": {
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
  "System": {
    "Get Client Configuration": {
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
  "Teams": {
    "Get Teams": {
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
    "Get A Team": {
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
    "Get A Team By Name": {
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
    "Get A User's Teams": {
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
    "Get Team Members": {
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
    "Get Team Members For A User": {
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
    "Get A Team Member": {
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
    "Get Team Members By Ids": {
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
    "Get A Team Stats": {
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
    "Update A Team Member Roles": {
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
    "Get Team Unreads For A User": {
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
    "Get Unreads For A Team": {
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
    "Invite Guests To The Team By Email": {
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
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Search Files In A Team": {
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
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Threads": {
    "Get All Threads That User Is Following": {
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
    "Mark All Threads That User Is Following As Read": {
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
    "Mark A Thread That User Is Following Read State To The Timestamp": {
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
    "Mark A Thread That User Is Following As Unread Based On A Post ID": {
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
    "Start Following A Thread": {
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
    "Stop Following A Thread": {
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
    "Get A Thread Followed By The User": {
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
  "Users": {
    "Get Users": {
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
    "Get Users By Ids": {
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
    "Get Users By Group Channels Ids": {
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
    "Get Users By Usernames": {
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
    "Search Users": {
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
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Autocomplete Users": {
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
    "Get A User": {
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
    "Patch A User": {
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
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Update A User's Roles": {
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
    "Get User's Profile Image": {
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
    "Return User's Default (generated) Profile Image": {
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
    "Get A User By Username": {
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
    "Get A User By Email": {
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
    "Publish A User Typing Websocket Event.": {
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
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Get All Channel Members For A User": {
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
  "Webhooks": {
    "List Incoming Webhooks": {
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
    "Create An Incoming Webhook": {
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
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Get An Incoming Webhook": {
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
    "Update An Incoming Webhook": {
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
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete An Incoming Webhook": {
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
    "List Outgoing Webhooks": {
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
    "Create An Outgoing Webhook": {
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
          "name": "display_name",
          "field": "body_display_name"
        },
        {
          "name": "trigger_words",
          "field": "body_trigger_words"
        },
        {
          "name": "callback_urls",
          "field": "body_callback_urls"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Get An Outgoing Webhook": {
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
    "Update An Outgoing Webhook": {
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
    "Delete An Outgoing Webhook": {
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
    "Regenerate The Token For The Outgoing Webhook.": {
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
          "value": "Bots"
        },
        {
          "name": "Channels",
          "value": "Channels"
        },
        {
          "name": "Commands",
          "value": "Commands"
        },
        {
          "name": "Emoji",
          "value": "Emoji"
        },
        {
          "name": "Files",
          "value": "Files"
        },
        {
          "name": "Groups",
          "value": "Groups"
        },
        {
          "name": "Insights",
          "value": "Insights"
        },
        {
          "name": "Posts",
          "value": "Posts"
        },
        {
          "name": "Preferences",
          "value": "Preferences"
        },
        {
          "name": "Reactions",
          "value": "Reactions"
        },
        {
          "name": "Roles",
          "value": "Roles"
        },
        {
          "name": "Status",
          "value": "Status"
        },
        {
          "name": "System",
          "value": "System"
        },
        {
          "name": "Teams",
          "value": "Teams"
        },
        {
          "name": "Threads",
          "value": "Threads"
        },
        {
          "name": "Users",
          "value": "Users"
        },
        {
          "name": "Webhooks",
          "value": "Webhooks"
        }
      ],
      "default": "Bots",
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
            "Bots"
          ]
        }
      },
      "options": [
        {
          "name": "Get Bots",
          "value": "Get Bots"
        },
        {
          "name": "Create A Bot",
          "value": "Create A Bot"
        },
        {
          "name": "Get A Bot",
          "value": "Get A Bot"
        },
        {
          "name": "Patch A Bot",
          "value": "Patch A Bot"
        },
        {
          "name": "Disable A Bot",
          "value": "Disable A Bot"
        },
        {
          "name": "Enable A Bot",
          "value": "Enable A Bot"
        }
      ],
      "default": "Get Bots",
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
            "Bots"
          ],
          "operation": [
            "Get Bots"
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
            "Bots"
          ],
          "operation": [
            "Create A Bot"
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
            "Bots"
          ],
          "operation": [
            "Create A Bot"
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
            "Bots"
          ],
          "operation": [
            "Get A Bot"
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
            "Bots"
          ],
          "operation": [
            "Get A Bot"
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
            "Bots"
          ],
          "operation": [
            "Patch A Bot"
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
            "Bots"
          ],
          "operation": [
            "Patch A Bot"
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
            "Bots"
          ],
          "operation": [
            "Patch A Bot"
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
            "Bots"
          ],
          "operation": [
            "Disable A Bot"
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
            "Bots"
          ],
          "operation": [
            "Enable A Bot"
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
            "Channels"
          ]
        }
      },
      "options": [
        {
          "name": "Get A List Of All Channels",
          "value": "Get A List Of All Channels"
        },
        {
          "name": "Create A Channel",
          "value": "Create A Channel"
        },
        {
          "name": "Create A Direct Message Channel",
          "value": "Create A Direct Message Channel"
        },
        {
          "name": "Create A Group Message Channel",
          "value": "Create A Group Message Channel"
        },
        {
          "name": "Search All Private And Open Type Channels",
          "value": "Search All Private And Open Type Channels"
        },
        {
          "name": "Search Group Channels",
          "value": "Search Group Channels"
        },
        {
          "name": "Get A List Of Channels By Ids",
          "value": "Get A List Of Channels By Ids"
        },
        {
          "name": "Get A Channel",
          "value": "Get A Channel"
        },
        {
          "name": "Update A Channel",
          "value": "Update A Channel"
        },
        {
          "name": "Delete A Channel",
          "value": "Delete A Channel"
        },
        {
          "name": "Patch A Channel",
          "value": "Patch A Channel"
        },
        {
          "name": "Update Channel's Privacy",
          "value": "Update Channel's Privacy"
        },
        {
          "name": "Restore A Channel",
          "value": "Restore A Channel"
        },
        {
          "name": "Move A Channel",
          "value": "Move A Channel"
        },
        {
          "name": "Get Channel Statistics",
          "value": "Get Channel Statistics"
        },
        {
          "name": "Get A Channel's Pinned Posts",
          "value": "Get A Channel's Pinned Posts"
        },
        {
          "name": "Get Public Channels",
          "value": "Get Public Channels"
        },
        {
          "name": "Get Private Channels",
          "value": "Get Private Channels"
        },
        {
          "name": "Get Deleted Channels",
          "value": "Get Deleted Channels"
        },
        {
          "name": "Autocomplete Channels",
          "value": "Autocomplete Channels"
        },
        {
          "name": "Autocomplete Channels For Search",
          "value": "Autocomplete Channels For Search"
        },
        {
          "name": "Search Channels",
          "value": "Search Channels"
        },
        {
          "name": "Search Archived Channels",
          "value": "Search Archived Channels"
        },
        {
          "name": "Get A Channel By Name",
          "value": "Get A Channel By Name"
        },
        {
          "name": "Get A Channel By Name And Team Name",
          "value": "Get A Channel By Name And Team Name"
        },
        {
          "name": "Get Channel Members",
          "value": "Get Channel Members"
        },
        {
          "name": "Add User(s) To Channel",
          "value": "Add User(s) To Channel"
        },
        {
          "name": "Get Channel Members By Ids",
          "value": "Get Channel Members By Ids"
        },
        {
          "name": "Get Channel Member",
          "value": "Get Channel Member"
        },
        {
          "name": "Remove User From Channel",
          "value": "Remove User From Channel"
        },
        {
          "name": "Update Channel Roles",
          "value": "Update Channel Roles"
        },
        {
          "name": "Update The Scheme Derived Roles Of A Channel Member.",
          "value": "Update The Scheme Derived Roles Of A Channel Member."
        },
        {
          "name": "Update Channel Notifications",
          "value": "Update Channel Notifications"
        },
        {
          "name": "View Channel",
          "value": "View Channel"
        },
        {
          "name": "Get Channel Memberships And Roles For A User",
          "value": "Get Channel Memberships And Roles For A User"
        },
        {
          "name": "Get Channels For User",
          "value": "Get Channels For User"
        },
        {
          "name": "Get All Channels",
          "value": "Get All Channels"
        },
        {
          "name": "Get Unread Messages",
          "value": "Get Unread Messages"
        },
        {
          "name": "Set A Channel's Scheme",
          "value": "Set A Channel's Scheme"
        },
        {
          "name": "Get Information About Channel's Moderation.",
          "value": "Get Information About Channel's Moderation."
        },
        {
          "name": "Update A Channel's Moderation Settings.",
          "value": "Update A Channel's Moderation Settings."
        },
        {
          "name": "Get User's Sidebar Categories",
          "value": "Get User's Sidebar Categories"
        },
        {
          "name": "Create User's Sidebar Category",
          "value": "Create User's Sidebar Category"
        },
        {
          "name": "Update User's Sidebar Categories",
          "value": "Update User's Sidebar Categories"
        },
        {
          "name": "Get User's Sidebar Category Order",
          "value": "Get User's Sidebar Category Order"
        },
        {
          "name": "Update User's Sidebar Category Order",
          "value": "Update User's Sidebar Category Order"
        },
        {
          "name": "Get Sidebar Category",
          "value": "Get Sidebar Category"
        },
        {
          "name": "Update Sidebar Category",
          "value": "Update Sidebar Category"
        },
        {
          "name": "Delete Sidebar Category",
          "value": "Delete Sidebar Category"
        }
      ],
      "default": "Get A List Of All Channels",
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
            "Channels"
          ],
          "operation": [
            "Get A List Of All Channels"
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
            "Channels"
          ],
          "operation": [
            "Create A Channel"
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
            "Channels"
          ],
          "operation": [
            "Create A Channel"
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
            "Channels"
          ],
          "operation": [
            "Create A Channel"
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
            "Channels"
          ],
          "operation": [
            "Create A Channel"
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
            "Channels"
          ],
          "operation": [
            "Create A Channel"
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
            "Channels"
          ],
          "operation": [
            "Create A Direct Message Channel"
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
            "Channels"
          ],
          "operation": [
            "Create A Group Message Channel"
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
            "Channels"
          ],
          "operation": [
            "Search All Private And Open Type Channels"
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
            "Channels"
          ],
          "operation": [
            "Search All Private And Open Type Channels"
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
            "Channels"
          ],
          "operation": [
            "Search All Private And Open Type Channels"
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
            "Channels"
          ],
          "operation": [
            "Search Group Channels"
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
            "Channels"
          ],
          "operation": [
            "Get A List Of Channels By Ids"
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
            "Channels"
          ],
          "operation": [
            "Get A List Of Channels By Ids"
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
            "Channels"
          ],
          "operation": [
            "Get A Channel"
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
            "Channels"
          ],
          "operation": [
            "Update A Channel"
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
            "Channels"
          ],
          "operation": [
            "Update A Channel"
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
            "Channels"
          ],
          "operation": [
            "Update A Channel"
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
            "Channels"
          ],
          "operation": [
            "Delete A Channel"
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
            "Channels"
          ],
          "operation": [
            "Patch A Channel"
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
            "Channels"
          ],
          "operation": [
            "Patch A Channel"
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
            "Channels"
          ],
          "operation": [
            "Update Channel's Privacy"
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
            "Channels"
          ],
          "operation": [
            "Update Channel's Privacy"
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
            "Channels"
          ],
          "operation": [
            "Restore A Channel"
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
            "Channels"
          ],
          "operation": [
            "Move A Channel"
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
            "Channels"
          ],
          "operation": [
            "Move A Channel"
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
            "Channels"
          ],
          "operation": [
            "Move A Channel"
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
            "Channels"
          ],
          "operation": [
            "Get Channel Statistics"
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
            "Channels"
          ],
          "operation": [
            "Get A Channel's Pinned Posts"
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
            "Channels"
          ],
          "operation": [
            "Get Public Channels"
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
            "Channels"
          ],
          "operation": [
            "Get Public Channels"
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
            "Channels"
          ],
          "operation": [
            "Get Private Channels"
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
            "Channels"
          ],
          "operation": [
            "Get Private Channels"
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
            "Channels"
          ],
          "operation": [
            "Get Deleted Channels"
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
            "Channels"
          ],
          "operation": [
            "Get Deleted Channels"
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
            "Channels"
          ],
          "operation": [
            "Autocomplete Channels"
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
            "Channels"
          ],
          "operation": [
            "Autocomplete Channels"
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
            "Channels"
          ],
          "operation": [
            "Autocomplete Channels For Search"
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
            "Channels"
          ],
          "operation": [
            "Autocomplete Channels For Search"
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
            "Channels"
          ],
          "operation": [
            "Search Channels"
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
            "Channels"
          ],
          "operation": [
            "Search Channels"
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
            "Channels"
          ],
          "operation": [
            "Search Archived Channels"
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
            "Channels"
          ],
          "operation": [
            "Search Archived Channels"
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
            "Channels"
          ],
          "operation": [
            "Get A Channel By Name"
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
            "Channels"
          ],
          "operation": [
            "Get A Channel By Name"
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
            "Channels"
          ],
          "operation": [
            "Get A Channel By Name"
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
            "Channels"
          ],
          "operation": [
            "Get A Channel By Name And Team Name"
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
            "Channels"
          ],
          "operation": [
            "Get A Channel By Name And Team Name"
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
            "Channels"
          ],
          "operation": [
            "Get A Channel By Name And Team Name"
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
            "Channels"
          ],
          "operation": [
            "Get Channel Members"
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
            "Channels"
          ],
          "operation": [
            "Get Channel Members"
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
            "Channels"
          ],
          "operation": [
            "Add User(s) To Channel"
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
            "Channels"
          ],
          "operation": [
            "Add User(s) To Channel"
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
            "Channels"
          ],
          "operation": [
            "Get Channel Members By Ids"
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
            "Channels"
          ],
          "operation": [
            "Get Channel Members By Ids"
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
            "Channels"
          ],
          "operation": [
            "Get Channel Member"
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
            "Channels"
          ],
          "operation": [
            "Get Channel Member"
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
            "Channels"
          ],
          "operation": [
            "Remove User From Channel"
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
            "Channels"
          ],
          "operation": [
            "Remove User From Channel"
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
            "Channels"
          ],
          "operation": [
            "Update Channel Roles"
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
            "Channels"
          ],
          "operation": [
            "Update Channel Roles"
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
            "Channels"
          ],
          "operation": [
            "Update Channel Roles"
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
            "Channels"
          ],
          "operation": [
            "Update The Scheme Derived Roles Of A Channel Member."
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
            "Channels"
          ],
          "operation": [
            "Update The Scheme Derived Roles Of A Channel Member."
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
            "Channels"
          ],
          "operation": [
            "Update The Scheme Derived Roles Of A Channel Member."
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
            "Channels"
          ],
          "operation": [
            "Update The Scheme Derived Roles Of A Channel Member."
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
            "Channels"
          ],
          "operation": [
            "Update Channel Notifications"
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
            "Channels"
          ],
          "operation": [
            "Update Channel Notifications"
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
            "Channels"
          ],
          "operation": [
            "Update Channel Notifications"
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
            "Channels"
          ],
          "operation": [
            "View Channel"
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
            "Channels"
          ],
          "operation": [
            "View Channel"
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
            "Channels"
          ],
          "operation": [
            "View Channel"
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
            "Channels"
          ],
          "operation": [
            "Get Channel Memberships And Roles For A User"
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
            "Channels"
          ],
          "operation": [
            "Get Channel Memberships And Roles For A User"
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
            "Channels"
          ],
          "operation": [
            "Get Channels For User"
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
            "Channels"
          ],
          "operation": [
            "Get Channels For User"
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
            "Channels"
          ],
          "operation": [
            "Get Channels For User"
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
            "Channels"
          ],
          "operation": [
            "Get All Channels"
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
            "Channels"
          ],
          "operation": [
            "Get All Channels"
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
            "Channels"
          ],
          "operation": [
            "Get Unread Messages"
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
            "Channels"
          ],
          "operation": [
            "Get Unread Messages"
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
            "Channels"
          ],
          "operation": [
            "Set A Channel's Scheme"
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
            "Channels"
          ],
          "operation": [
            "Set A Channel's Scheme"
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
            "Channels"
          ],
          "operation": [
            "Get Information About Channel's Moderation."
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
            "Channels"
          ],
          "operation": [
            "Update A Channel's Moderation Settings."
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
            "Channels"
          ],
          "operation": [
            "Update A Channel's Moderation Settings."
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
            "Channels"
          ],
          "operation": [
            "Get User's Sidebar Categories"
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
            "Channels"
          ],
          "operation": [
            "Get User's Sidebar Categories"
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
            "Channels"
          ],
          "operation": [
            "Create User's Sidebar Category"
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
            "Channels"
          ],
          "operation": [
            "Create User's Sidebar Category"
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
            "Channels"
          ],
          "operation": [
            "Create User's Sidebar Category"
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
            "Channels"
          ],
          "operation": [
            "Update User's Sidebar Categories"
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
            "Channels"
          ],
          "operation": [
            "Update User's Sidebar Categories"
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
            "Channels"
          ],
          "operation": [
            "Update User's Sidebar Categories"
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
            "Channels"
          ],
          "operation": [
            "Get User's Sidebar Category Order"
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
            "Channels"
          ],
          "operation": [
            "Get User's Sidebar Category Order"
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
            "Channels"
          ],
          "operation": [
            "Update User's Sidebar Category Order"
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
            "Channels"
          ],
          "operation": [
            "Update User's Sidebar Category Order"
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
            "Channels"
          ],
          "operation": [
            "Update User's Sidebar Category Order"
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
            "Channels"
          ],
          "operation": [
            "Get Sidebar Category"
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
            "Channels"
          ],
          "operation": [
            "Get Sidebar Category"
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
            "Channels"
          ],
          "operation": [
            "Get Sidebar Category"
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
            "Channels"
          ],
          "operation": [
            "Update Sidebar Category"
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
            "Channels"
          ],
          "operation": [
            "Update Sidebar Category"
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
            "Channels"
          ],
          "operation": [
            "Update Sidebar Category"
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
            "Channels"
          ],
          "operation": [
            "Update Sidebar Category"
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
            "Channels"
          ],
          "operation": [
            "Delete Sidebar Category"
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
            "Channels"
          ],
          "operation": [
            "Delete Sidebar Category"
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
            "Channels"
          ],
          "operation": [
            "Delete Sidebar Category"
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
            "Commands"
          ]
        }
      },
      "options": [
        {
          "name": "List Commands For A Team",
          "value": "List Commands For A Team"
        },
        {
          "name": "Create A Command",
          "value": "Create A Command"
        },
        {
          "name": "List Autocomplete Commands",
          "value": "List Autocomplete Commands"
        },
        {
          "name": "List Commands' Autocomplete Data",
          "value": "List Commands' Autocomplete Data"
        },
        {
          "name": "Get A Command",
          "value": "Get A Command"
        },
        {
          "name": "Update A Command",
          "value": "Update A Command"
        },
        {
          "name": "Delete A Command",
          "value": "Delete A Command"
        },
        {
          "name": "Generate A New Token",
          "value": "Generate A New Token"
        },
        {
          "name": "Execute A Command",
          "value": "Execute A Command"
        }
      ],
      "default": "List Commands For A Team",
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
            "Commands"
          ],
          "operation": [
            "List Commands For A Team"
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
            "Commands"
          ],
          "operation": [
            "Create A Command"
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
            "Commands"
          ],
          "operation": [
            "Create A Command"
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
            "Commands"
          ],
          "operation": [
            "Create A Command"
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
            "Commands"
          ],
          "operation": [
            "Create A Command"
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
            "Commands"
          ],
          "operation": [
            "List Autocomplete Commands"
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
            "Commands"
          ],
          "operation": [
            "List Commands' Autocomplete Data"
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
            "Commands"
          ],
          "operation": [
            "List Commands' Autocomplete Data"
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
            "Commands"
          ],
          "operation": [
            "Get A Command"
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
            "Commands"
          ],
          "operation": [
            "Update A Command"
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
            "Commands"
          ],
          "operation": [
            "Update A Command"
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
            "Commands"
          ],
          "operation": [
            "Delete A Command"
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
            "Commands"
          ],
          "operation": [
            "Generate A New Token"
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
            "Commands"
          ],
          "operation": [
            "Execute A Command"
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
            "Commands"
          ],
          "operation": [
            "Execute A Command"
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
            "Emoji"
          ]
        }
      },
      "options": [
        {
          "name": "Get A List Of Custom Emoji",
          "value": "Get A List Of Custom Emoji"
        },
        {
          "name": "Create A Custom Emoji",
          "value": "Create A Custom Emoji"
        },
        {
          "name": "Get A Custom Emoji",
          "value": "Get A Custom Emoji"
        },
        {
          "name": "Delete A Custom Emoji",
          "value": "Delete A Custom Emoji"
        },
        {
          "name": "Get A Custom Emoji By Name",
          "value": "Get A Custom Emoji By Name"
        },
        {
          "name": "Get Custom Emoji Image",
          "value": "Get Custom Emoji Image"
        },
        {
          "name": "Search Custom Emoji",
          "value": "Search Custom Emoji"
        },
        {
          "name": "Autocomplete Custom Emoji",
          "value": "Autocomplete Custom Emoji"
        }
      ],
      "default": "Get A List Of Custom Emoji",
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
            "Emoji"
          ],
          "operation": [
            "Get A List Of Custom Emoji"
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
            "Emoji"
          ],
          "operation": [
            "Create A Custom Emoji"
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
            "Emoji"
          ],
          "operation": [
            "Create A Custom Emoji"
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
            "Emoji"
          ],
          "operation": [
            "Get A Custom Emoji"
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
            "Emoji"
          ],
          "operation": [
            "Delete A Custom Emoji"
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
            "Emoji"
          ],
          "operation": [
            "Get A Custom Emoji By Name"
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
            "Emoji"
          ],
          "operation": [
            "Get Custom Emoji Image"
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
            "Emoji"
          ],
          "operation": [
            "Search Custom Emoji"
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
            "Emoji"
          ],
          "operation": [
            "Search Custom Emoji"
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
            "Emoji"
          ],
          "operation": [
            "Autocomplete Custom Emoji"
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
            "Files"
          ]
        }
      },
      "options": [
        {
          "name": "Upload A File",
          "value": "Upload A File"
        },
        {
          "name": "Get A File",
          "value": "Get A File"
        },
        {
          "name": "Get A File's Thumbnail",
          "value": "Get A File's Thumbnail"
        },
        {
          "name": "Get A File's Preview",
          "value": "Get A File's Preview"
        },
        {
          "name": "Get Metadata For A File",
          "value": "Get Metadata For A File"
        }
      ],
      "default": "Upload A File",
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
            "Files"
          ],
          "operation": [
            "Upload A File"
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
            "Files"
          ],
          "operation": [
            "Upload A File"
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
            "Files"
          ],
          "operation": [
            "Get A File"
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
            "Files"
          ],
          "operation": [
            "Get A File's Thumbnail"
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
            "Files"
          ],
          "operation": [
            "Get A File's Preview"
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
            "Files"
          ],
          "operation": [
            "Get Metadata For A File"
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
            "Groups"
          ]
        }
      },
      "options": [
        {
          "name": "Get Groups",
          "value": "Get Groups"
        },
        {
          "name": "Get Channel Groups",
          "value": "Get Channel Groups"
        },
        {
          "name": "Get Team Groups",
          "value": "Get Team Groups"
        },
        {
          "name": "Get Team Groups By Channels",
          "value": "Get Team Groups By Channels"
        },
        {
          "name": "Get Groups For A User ID",
          "value": "Get Groups For A User ID"
        }
      ],
      "default": "Get Groups",
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
            "Groups"
          ],
          "operation": [
            "Get Groups"
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
            "Groups"
          ],
          "operation": [
            "Get Groups"
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
            "Groups"
          ],
          "operation": [
            "Get Groups"
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
            "Groups"
          ],
          "operation": [
            "Get Channel Groups"
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
            "Groups"
          ],
          "operation": [
            "Get Channel Groups"
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
            "Groups"
          ],
          "operation": [
            "Get Team Groups"
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
            "Groups"
          ],
          "operation": [
            "Get Team Groups"
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
            "Groups"
          ],
          "operation": [
            "Get Team Groups By Channels"
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
            "Groups"
          ],
          "operation": [
            "Get Team Groups By Channels"
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
            "Groups"
          ],
          "operation": [
            "Get Groups For A User ID"
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
            "Insights"
          ]
        }
      },
      "options": [
        {
          "name": "Get A List Of The Top Reactions For A Team.",
          "value": "Get A List Of The Top Reactions For A Team."
        },
        {
          "name": "Get A List Of The Top Reactions For A User.",
          "value": "Get A List Of The Top Reactions For A User."
        },
        {
          "name": "Get A List Of The Top Channels For A Team.",
          "value": "Get A List Of The Top Channels For A Team."
        },
        {
          "name": "Get A List Of The Top Channels For A User.",
          "value": "Get A List Of The Top Channels For A User."
        },
        {
          "name": "Get A List Of New Team Members.",
          "value": "Get A List Of New Team Members."
        },
        {
          "name": "Get A List Of The Top Threads For A Team.",
          "value": "Get A List Of The Top Threads For A Team."
        },
        {
          "name": "Get A List Of The Top Threads For A User.",
          "value": "Get A List Of The Top Threads For A User."
        },
        {
          "name": "Get A List Of The Top Dms For A User.",
          "value": "Get A List Of The Top Dms For A User."
        }
      ],
      "default": "Get A List Of The Top Reactions For A Team.",
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
            "Insights"
          ],
          "operation": [
            "Get A List Of The Top Reactions For A Team."
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
            "Insights"
          ],
          "operation": [
            "Get A List Of The Top Reactions For A Team."
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
            "Insights"
          ],
          "operation": [
            "Get A List Of The Top Reactions For A Team."
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
            "Insights"
          ],
          "operation": [
            "Get A List Of The Top Reactions For A User."
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
            "Insights"
          ],
          "operation": [
            "Get A List Of The Top Reactions For A User."
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
            "Insights"
          ],
          "operation": [
            "Get A List Of The Top Channels For A Team."
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
            "Insights"
          ],
          "operation": [
            "Get A List Of The Top Channels For A Team."
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
            "Insights"
          ],
          "operation": [
            "Get A List Of The Top Channels For A Team."
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
            "Insights"
          ],
          "operation": [
            "Get A List Of The Top Channels For A User."
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
            "Insights"
          ],
          "operation": [
            "Get A List Of The Top Channels For A User."
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
            "Insights"
          ],
          "operation": [
            "Get A List Of New Team Members."
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
            "Insights"
          ],
          "operation": [
            "Get A List Of New Team Members."
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
            "Insights"
          ],
          "operation": [
            "Get A List Of New Team Members."
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
            "Insights"
          ],
          "operation": [
            "Get A List Of The Top Threads For A Team."
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
            "Insights"
          ],
          "operation": [
            "Get A List Of The Top Threads For A Team."
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
            "Insights"
          ],
          "operation": [
            "Get A List Of The Top Threads For A Team."
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
            "Insights"
          ],
          "operation": [
            "Get A List Of The Top Threads For A User."
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
            "Insights"
          ],
          "operation": [
            "Get A List Of The Top Threads For A User."
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
            "Insights"
          ],
          "operation": [
            "Get A List Of The Top Dms For A User."
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
            "Insights"
          ],
          "operation": [
            "Get A List Of The Top Dms For A User."
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
            "Posts"
          ]
        }
      },
      "options": [
        {
          "name": "Create A Post",
          "value": "Create A Post"
        },
        {
          "name": "Create A Ephemeral Post",
          "value": "Create A Ephemeral Post"
        },
        {
          "name": "Get A Post",
          "value": "Get A Post"
        },
        {
          "name": "Delete A Post",
          "value": "Delete A Post"
        },
        {
          "name": "Mark As Unread From A Post.",
          "value": "Mark As Unread From A Post."
        },
        {
          "name": "Patch A Post",
          "value": "Patch A Post"
        },
        {
          "name": "Get A Thread",
          "value": "Get A Thread"
        },
        {
          "name": "Get A List Of Flagged Posts",
          "value": "Get A List Of Flagged Posts"
        },
        {
          "name": "Get File Info For Post",
          "value": "Get File Info For Post"
        },
        {
          "name": "Get Posts For A Channel",
          "value": "Get Posts For A Channel"
        },
        {
          "name": "Get Posts Around Oldest Unread",
          "value": "Get Posts Around Oldest Unread"
        },
        {
          "name": "Search For Team Posts",
          "value": "Search For Team Posts"
        },
        {
          "name": "Pin A Post To The Channel",
          "value": "Pin A Post To The Channel"
        },
        {
          "name": "Unpin A Post To The Channel",
          "value": "Unpin A Post To The Channel"
        },
        {
          "name": "Perform A Post Action",
          "value": "Perform A Post Action"
        },
        {
          "name": "Get Posts By A List Of Ids",
          "value": "Get Posts By A List Of Ids"
        },
        {
          "name": "Set A Post Reminder",
          "value": "Set A Post Reminder"
        }
      ],
      "default": "Create A Post",
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
            "Posts"
          ],
          "operation": [
            "Create A Post"
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
            "Posts"
          ],
          "operation": [
            "Create A Post"
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
            "Posts"
          ],
          "operation": [
            "Create A Post"
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
            "Posts"
          ],
          "operation": [
            "Create A Post"
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
            "Posts"
          ],
          "operation": [
            "Create A Ephemeral Post"
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
            "Posts"
          ],
          "operation": [
            "Create A Ephemeral Post"
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
            "Posts"
          ],
          "operation": [
            "Get A Post"
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
            "Posts"
          ],
          "operation": [
            "Get A Post"
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
            "Posts"
          ],
          "operation": [
            "Delete A Post"
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
            "Posts"
          ],
          "operation": [
            "Mark As Unread From A Post."
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
            "Posts"
          ],
          "operation": [
            "Mark As Unread From A Post."
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
            "Posts"
          ],
          "operation": [
            "Patch A Post"
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
            "Posts"
          ],
          "operation": [
            "Patch A Post"
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
            "Posts"
          ],
          "operation": [
            "Get A Thread"
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
            "Posts"
          ],
          "operation": [
            "Get A Thread"
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
            "Posts"
          ],
          "operation": [
            "Get A List Of Flagged Posts"
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
            "Posts"
          ],
          "operation": [
            "Get A List Of Flagged Posts"
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
            "Posts"
          ],
          "operation": [
            "Get File Info For Post"
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
            "Posts"
          ],
          "operation": [
            "Get File Info For Post"
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
            "Posts"
          ],
          "operation": [
            "Get Posts For A Channel"
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
            "Posts"
          ],
          "operation": [
            "Get Posts For A Channel"
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
            "Posts"
          ],
          "operation": [
            "Get Posts Around Oldest Unread"
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
            "Posts"
          ],
          "operation": [
            "Get Posts Around Oldest Unread"
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
            "Posts"
          ],
          "operation": [
            "Get Posts Around Oldest Unread"
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
            "Posts"
          ],
          "operation": [
            "Search For Team Posts"
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
            "Posts"
          ],
          "operation": [
            "Search For Team Posts"
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
            "Posts"
          ],
          "operation": [
            "Search For Team Posts"
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
            "Posts"
          ],
          "operation": [
            "Search For Team Posts"
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
            "Posts"
          ],
          "operation": [
            "Pin A Post To The Channel"
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
            "Posts"
          ],
          "operation": [
            "Unpin A Post To The Channel"
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
            "Posts"
          ],
          "operation": [
            "Perform A Post Action"
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
            "Posts"
          ],
          "operation": [
            "Perform A Post Action"
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
            "Posts"
          ],
          "operation": [
            "Get Posts By A List Of Ids"
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
            "Posts"
          ],
          "operation": [
            "Set A Post Reminder"
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
            "Posts"
          ],
          "operation": [
            "Set A Post Reminder"
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
            "Posts"
          ],
          "operation": [
            "Set A Post Reminder"
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
            "Preferences"
          ]
        }
      },
      "options": [
        {
          "name": "Get The User's Preferences",
          "value": "Get The User's Preferences"
        },
        {
          "name": "Save The User's Preferences",
          "value": "Save The User's Preferences"
        },
        {
          "name": "Delete User's Preferences",
          "value": "Delete User's Preferences"
        },
        {
          "name": "List A User's Preferences By Category",
          "value": "List A User's Preferences By Category"
        },
        {
          "name": "Get A Specific User Preference",
          "value": "Get A Specific User Preference"
        }
      ],
      "default": "Get The User's Preferences",
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
            "Preferences"
          ],
          "operation": [
            "Get The User's Preferences"
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
            "Preferences"
          ],
          "operation": [
            "Save The User's Preferences"
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
            "Preferences"
          ],
          "operation": [
            "Save The User's Preferences"
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
            "Preferences"
          ],
          "operation": [
            "Delete User's Preferences"
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
            "Preferences"
          ],
          "operation": [
            "Delete User's Preferences"
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
            "Preferences"
          ],
          "operation": [
            "List A User's Preferences By Category"
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
            "Preferences"
          ],
          "operation": [
            "List A User's Preferences By Category"
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
            "Preferences"
          ],
          "operation": [
            "Get A Specific User Preference"
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
            "Preferences"
          ],
          "operation": [
            "Get A Specific User Preference"
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
            "Preferences"
          ],
          "operation": [
            "Get A Specific User Preference"
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
            "Reactions"
          ]
        }
      },
      "options": [
        {
          "name": "Create A Reaction",
          "value": "Create A Reaction"
        },
        {
          "name": "Get A List Of Reactions To A Post",
          "value": "Get A List Of Reactions To A Post"
        },
        {
          "name": "Remove A Reaction From A Post",
          "value": "Remove A Reaction From A Post"
        }
      ],
      "default": "Create A Reaction",
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
            "Reactions"
          ],
          "operation": [
            "Create A Reaction"
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
            "Reactions"
          ],
          "operation": [
            "Get A List Of Reactions To A Post"
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
            "Reactions"
          ],
          "operation": [
            "Remove A Reaction From A Post"
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
            "Reactions"
          ],
          "operation": [
            "Remove A Reaction From A Post"
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
            "Reactions"
          ],
          "operation": [
            "Remove A Reaction From A Post"
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
            "Roles"
          ]
        }
      },
      "options": [
        {
          "name": "Get A List Of All The Roles",
          "value": "Get A List Of All The Roles"
        },
        {
          "name": "Get A Role",
          "value": "Get A Role"
        },
        {
          "name": "Get A Role By Name",
          "value": "Get A Role By Name"
        },
        {
          "name": "Get A List Of Roles By Name",
          "value": "Get A List Of Roles By Name"
        }
      ],
      "default": "Get A List Of All The Roles",
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
            "Roles"
          ],
          "operation": [
            "Get A Role"
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
            "Roles"
          ],
          "operation": [
            "Get A Role By Name"
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
            "Roles"
          ],
          "operation": [
            "Get A List Of Roles By Name"
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
            "Status"
          ]
        }
      },
      "options": [
        {
          "name": "Get User Status",
          "value": "Get User Status"
        },
        {
          "name": "Update User Status",
          "value": "Update User Status"
        },
        {
          "name": "Get User Statuses By ID",
          "value": "Get User Statuses By ID"
        },
        {
          "name": "Update User Custom Status",
          "value": "Update User Custom Status"
        },
        {
          "name": "Unsets User Custom Status",
          "value": "Unsets User Custom Status"
        },
        {
          "name": "Delete User's Recent Custom Status",
          "value": "Delete User's Recent Custom Status"
        }
      ],
      "default": "Get User Status",
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
            "Status"
          ],
          "operation": [
            "Get User Status"
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
            "Status"
          ],
          "operation": [
            "Update User Status"
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
            "Status"
          ],
          "operation": [
            "Update User Status"
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
            "Status"
          ],
          "operation": [
            "Update User Status"
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
            "Status"
          ],
          "operation": [
            "Update User Status"
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
            "Status"
          ],
          "operation": [
            "Get User Statuses By ID"
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
            "Status"
          ],
          "operation": [
            "Update User Custom Status"
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
            "Status"
          ],
          "operation": [
            "Update User Custom Status"
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
            "Status"
          ],
          "operation": [
            "Update User Custom Status"
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
            "Status"
          ],
          "operation": [
            "Update User Custom Status"
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
            "Status"
          ],
          "operation": [
            "Unsets User Custom Status"
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
            "Status"
          ],
          "operation": [
            "Delete User's Recent Custom Status"
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
            "Status"
          ],
          "operation": [
            "Delete User's Recent Custom Status"
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
            "Status"
          ],
          "operation": [
            "Delete User's Recent Custom Status"
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
            "Status"
          ],
          "operation": [
            "Delete User's Recent Custom Status"
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
            "Status"
          ],
          "operation": [
            "Delete User's Recent Custom Status"
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
            "System"
          ]
        }
      },
      "options": [
        {
          "name": "Get Client Configuration",
          "value": "Get Client Configuration"
        }
      ],
      "default": "Get Client Configuration",
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
            "System"
          ],
          "operation": [
            "Get Client Configuration"
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
            "Teams"
          ]
        }
      },
      "options": [
        {
          "name": "Get Teams",
          "value": "Get Teams"
        },
        {
          "name": "Get A Team",
          "value": "Get A Team"
        },
        {
          "name": "Get A Team By Name",
          "value": "Get A Team By Name"
        },
        {
          "name": "Get A User's Teams",
          "value": "Get A User's Teams"
        },
        {
          "name": "Get Team Members",
          "value": "Get Team Members"
        },
        {
          "name": "Get Team Members For A User",
          "value": "Get Team Members For A User"
        },
        {
          "name": "Get A Team Member",
          "value": "Get A Team Member"
        },
        {
          "name": "Get Team Members By Ids",
          "value": "Get Team Members By Ids"
        },
        {
          "name": "Get A Team Stats",
          "value": "Get A Team Stats"
        },
        {
          "name": "Update A Team Member Roles",
          "value": "Update A Team Member Roles"
        },
        {
          "name": "Get Team Unreads For A User",
          "value": "Get Team Unreads For A User"
        },
        {
          "name": "Get Unreads For A Team",
          "value": "Get Unreads For A Team"
        },
        {
          "name": "Invite Guests To The Team By Email",
          "value": "Invite Guests To The Team By Email"
        },
        {
          "name": "Search Files In A Team",
          "value": "Search Files In A Team"
        }
      ],
      "default": "Get Teams",
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
            "Teams"
          ],
          "operation": [
            "Get Teams"
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
            "Teams"
          ],
          "operation": [
            "Get A Team"
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
            "Teams"
          ],
          "operation": [
            "Get A Team By Name"
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
            "Teams"
          ],
          "operation": [
            "Get A User's Teams"
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
            "Teams"
          ],
          "operation": [
            "Get Team Members"
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
            "Teams"
          ],
          "operation": [
            "Get Team Members"
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
            "Teams"
          ],
          "operation": [
            "Get Team Members For A User"
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
            "Teams"
          ],
          "operation": [
            "Get A Team Member"
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
            "Teams"
          ],
          "operation": [
            "Get A Team Member"
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
            "Teams"
          ],
          "operation": [
            "Get Team Members By Ids"
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
            "Teams"
          ],
          "operation": [
            "Get Team Members By Ids"
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
            "Teams"
          ],
          "operation": [
            "Get A Team Stats"
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
            "Teams"
          ],
          "operation": [
            "Update A Team Member Roles"
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
            "Teams"
          ],
          "operation": [
            "Update A Team Member Roles"
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
            "Teams"
          ],
          "operation": [
            "Update A Team Member Roles"
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
            "Teams"
          ],
          "operation": [
            "Get Team Unreads For A User"
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
            "Teams"
          ],
          "operation": [
            "Get Team Unreads For A User"
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
            "Teams"
          ],
          "operation": [
            "Get Team Unreads For A User"
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
            "Teams"
          ],
          "operation": [
            "Get Unreads For A Team"
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
            "Teams"
          ],
          "operation": [
            "Get Unreads For A Team"
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
            "Teams"
          ],
          "operation": [
            "Invite Guests To The Team By Email"
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
            "Teams"
          ],
          "operation": [
            "Invite Guests To The Team By Email"
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
            "Teams"
          ],
          "operation": [
            "Invite Guests To The Team By Email"
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
            "Teams"
          ],
          "operation": [
            "Invite Guests To The Team By Email"
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
            "Teams"
          ],
          "operation": [
            "Search Files In A Team"
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
            "Teams"
          ],
          "operation": [
            "Search Files In A Team"
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
            "Teams"
          ],
          "operation": [
            "Search Files In A Team"
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
            "Teams"
          ],
          "operation": [
            "Search Files In A Team"
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
            "Threads"
          ]
        }
      },
      "options": [
        {
          "name": "Get All Threads That User Is Following",
          "value": "Get All Threads That User Is Following"
        },
        {
          "name": "Mark All Threads That User Is Following As Read",
          "value": "Mark All Threads That User Is Following As Read"
        },
        {
          "name": "Mark A Thread That User Is Following Read State To The Timestamp",
          "value": "Mark A Thread That User Is Following Read State To The Timestamp"
        },
        {
          "name": "Mark A Thread That User Is Following As Unread Based On A Post ID",
          "value": "Mark A Thread That User Is Following As Unread Based On A Post ID"
        },
        {
          "name": "Start Following A Thread",
          "value": "Start Following A Thread"
        },
        {
          "name": "Stop Following A Thread",
          "value": "Stop Following A Thread"
        },
        {
          "name": "Get A Thread Followed By The User",
          "value": "Get A Thread Followed By The User"
        }
      ],
      "default": "Get All Threads That User Is Following",
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
            "Threads"
          ],
          "operation": [
            "Get All Threads That User Is Following"
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
            "Threads"
          ],
          "operation": [
            "Get All Threads That User Is Following"
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
            "Threads"
          ],
          "operation": [
            "Get All Threads That User Is Following"
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
            "Threads"
          ],
          "operation": [
            "Mark All Threads That User Is Following As Read"
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
            "Threads"
          ],
          "operation": [
            "Mark All Threads That User Is Following As Read"
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
            "Threads"
          ],
          "operation": [
            "Mark A Thread That User Is Following Read State To The Timestamp"
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
            "Threads"
          ],
          "operation": [
            "Mark A Thread That User Is Following Read State To The Timestamp"
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
            "Threads"
          ],
          "operation": [
            "Mark A Thread That User Is Following Read State To The Timestamp"
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
            "Threads"
          ],
          "operation": [
            "Mark A Thread That User Is Following Read State To The Timestamp"
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
            "Threads"
          ],
          "operation": [
            "Mark A Thread That User Is Following As Unread Based On A Post ID"
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
            "Threads"
          ],
          "operation": [
            "Mark A Thread That User Is Following As Unread Based On A Post ID"
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
            "Threads"
          ],
          "operation": [
            "Mark A Thread That User Is Following As Unread Based On A Post ID"
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
            "Threads"
          ],
          "operation": [
            "Mark A Thread That User Is Following As Unread Based On A Post ID"
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
            "Threads"
          ],
          "operation": [
            "Start Following A Thread"
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
            "Threads"
          ],
          "operation": [
            "Start Following A Thread"
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
            "Threads"
          ],
          "operation": [
            "Start Following A Thread"
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
            "Threads"
          ],
          "operation": [
            "Stop Following A Thread"
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
            "Threads"
          ],
          "operation": [
            "Stop Following A Thread"
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
            "Threads"
          ],
          "operation": [
            "Stop Following A Thread"
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
            "Threads"
          ],
          "operation": [
            "Get A Thread Followed By The User"
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
            "Threads"
          ],
          "operation": [
            "Get A Thread Followed By The User"
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
            "Threads"
          ],
          "operation": [
            "Get A Thread Followed By The User"
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
          "name": "Get Users By Ids",
          "value": "Get Users By Ids"
        },
        {
          "name": "Get Users By Group Channels Ids",
          "value": "Get Users By Group Channels Ids"
        },
        {
          "name": "Get Users By Usernames",
          "value": "Get Users By Usernames"
        },
        {
          "name": "Search Users",
          "value": "Search Users"
        },
        {
          "name": "Autocomplete Users",
          "value": "Autocomplete Users"
        },
        {
          "name": "Get A User",
          "value": "Get A User"
        },
        {
          "name": "Patch A User",
          "value": "Patch A User"
        },
        {
          "name": "Update A User's Roles",
          "value": "Update A User's Roles"
        },
        {
          "name": "Get User's Profile Image",
          "value": "Get User's Profile Image"
        },
        {
          "name": "Return User's Default (generated) Profile Image",
          "value": "Return User's Default (generated) Profile Image"
        },
        {
          "name": "Get A User By Username",
          "value": "Get A User By Username"
        },
        {
          "name": "Get A User By Email",
          "value": "Get A User By Email"
        },
        {
          "name": "Publish A User Typing Websocket Event.",
          "value": "Publish A User Typing Websocket Event."
        },
        {
          "name": "Get All Channel Members For A User",
          "value": "Get All Channel Members For A User"
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
            "Users"
          ],
          "operation": [
            "Get Users By Ids"
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
            "Users"
          ],
          "operation": [
            "Get Users By Ids"
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
            "Users"
          ],
          "operation": [
            "Get Users By Group Channels Ids"
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
            "Users"
          ],
          "operation": [
            "Get Users By Usernames"
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
            "Users"
          ],
          "operation": [
            "Search Users"
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
            "Users"
          ],
          "operation": [
            "Search Users"
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
            "Users"
          ],
          "operation": [
            "Autocomplete Users"
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
            "Users"
          ],
          "operation": [
            "Autocomplete Users"
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
            "Users"
          ],
          "operation": [
            "Get A User"
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
            "Users"
          ],
          "operation": [
            "Patch A User"
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
            "Users"
          ],
          "operation": [
            "Patch A User"
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
            "Users"
          ],
          "operation": [
            "Update A User's Roles"
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
            "Users"
          ],
          "operation": [
            "Update A User's Roles"
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
            "Users"
          ],
          "operation": [
            "Get User's Profile Image"
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
            "Users"
          ],
          "operation": [
            "Get User's Profile Image"
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
            "Users"
          ],
          "operation": [
            "Return User's Default (generated) Profile Image"
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
            "Users"
          ],
          "operation": [
            "Get A User By Username"
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
            "Users"
          ],
          "operation": [
            "Get A User By Email"
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
            "Users"
          ],
          "operation": [
            "Publish A User Typing Websocket Event."
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
            "Users"
          ],
          "operation": [
            "Publish A User Typing Websocket Event."
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
            "Users"
          ],
          "operation": [
            "Publish A User Typing Websocket Event."
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
            "Users"
          ],
          "operation": [
            "Get All Channel Members For A User"
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
            "Users"
          ],
          "operation": [
            "Get All Channel Members For A User"
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
            "Webhooks"
          ]
        }
      },
      "options": [
        {
          "name": "List Incoming Webhooks",
          "value": "List Incoming Webhooks"
        },
        {
          "name": "Create An Incoming Webhook",
          "value": "Create An Incoming Webhook"
        },
        {
          "name": "Get An Incoming Webhook",
          "value": "Get An Incoming Webhook"
        },
        {
          "name": "Update An Incoming Webhook",
          "value": "Update An Incoming Webhook"
        },
        {
          "name": "Delete An Incoming Webhook",
          "value": "Delete An Incoming Webhook"
        },
        {
          "name": "List Outgoing Webhooks",
          "value": "List Outgoing Webhooks"
        },
        {
          "name": "Create An Outgoing Webhook",
          "value": "Create An Outgoing Webhook"
        },
        {
          "name": "Get An Outgoing Webhook",
          "value": "Get An Outgoing Webhook"
        },
        {
          "name": "Update An Outgoing Webhook",
          "value": "Update An Outgoing Webhook"
        },
        {
          "name": "Delete An Outgoing Webhook",
          "value": "Delete An Outgoing Webhook"
        },
        {
          "name": "Regenerate The Token For The Outgoing Webhook.",
          "value": "Regenerate The Token For The Outgoing Webhook."
        }
      ],
      "default": "List Incoming Webhooks",
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
            "Webhooks"
          ],
          "operation": [
            "List Incoming Webhooks"
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
            "Webhooks"
          ],
          "operation": [
            "Create An Incoming Webhook"
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
            "Webhooks"
          ],
          "operation": [
            "Create An Incoming Webhook"
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
            "Webhooks"
          ],
          "operation": [
            "Get An Incoming Webhook"
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
            "Webhooks"
          ],
          "operation": [
            "Update An Incoming Webhook"
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
            "Webhooks"
          ],
          "operation": [
            "Update An Incoming Webhook"
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
            "Webhooks"
          ],
          "operation": [
            "Update An Incoming Webhook"
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
            "Webhooks"
          ],
          "operation": [
            "Update An Incoming Webhook"
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
            "Webhooks"
          ],
          "operation": [
            "Update An Incoming Webhook"
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
            "Webhooks"
          ],
          "operation": [
            "Update An Incoming Webhook"
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
            "Webhooks"
          ],
          "operation": [
            "Delete An Incoming Webhook"
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
            "Webhooks"
          ],
          "operation": [
            "List Outgoing Webhooks"
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
            "Webhooks"
          ],
          "operation": [
            "Create An Outgoing Webhook"
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
            "Webhooks"
          ],
          "operation": [
            "Create An Outgoing Webhook"
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
            "Webhooks"
          ],
          "operation": [
            "Create An Outgoing Webhook"
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
            "Webhooks"
          ],
          "operation": [
            "Create An Outgoing Webhook"
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
            "Webhooks"
          ],
          "operation": [
            "Create An Outgoing Webhook"
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
            "Webhooks"
          ],
          "operation": [
            "Get An Outgoing Webhook"
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
            "Webhooks"
          ],
          "operation": [
            "Update An Outgoing Webhook"
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
            "Webhooks"
          ],
          "operation": [
            "Update An Outgoing Webhook"
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
            "Webhooks"
          ],
          "operation": [
            "Update An Outgoing Webhook"
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
            "Webhooks"
          ],
          "operation": [
            "Update An Outgoing Webhook"
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
            "Webhooks"
          ],
          "operation": [
            "Update An Outgoing Webhook"
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
            "Webhooks"
          ],
          "operation": [
            "Delete An Outgoing Webhook"
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
            "Webhooks"
          ],
          "operation": [
            "Regenerate The Token For The Outgoing Webhook."
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
            "Bots",
            "Channels",
            "Channels",
            "Channels",
            "Channels",
            "Channels",
            "Emoji",
            "Groups",
            "Groups",
            "Groups",
            "Groups",
            "Insights",
            "Insights",
            "Insights",
            "Insights",
            "Insights",
            "Insights",
            "Insights",
            "Insights",
            "Posts",
            "Posts",
            "Teams",
            "Teams",
            "Users",
            "Webhooks",
            "Webhooks"
          ],
          "operation": [
            "Get Bots",
            "Get A List Of All Channels",
            "Get Public Channels",
            "Get Private Channels",
            "Get Deleted Channels",
            "Get Channel Members",
            "Get A List Of Custom Emoji",
            "Get Groups",
            "Get Channel Groups",
            "Get Team Groups",
            "Get Team Groups By Channels",
            "Get A List Of The Top Reactions For A Team.",
            "Get A List Of The Top Reactions For A User.",
            "Get A List Of The Top Channels For A Team.",
            "Get A List Of The Top Channels For A User.",
            "Get A List Of New Team Members.",
            "Get A List Of The Top Threads For A Team.",
            "Get A List Of The Top Threads For A User.",
            "Get A List Of The Top Dms For A User.",
            "Get A List Of Flagged Posts",
            "Get Posts For A Channel",
            "Get Teams",
            "Get Team Members",
            "Get Users",
            "List Incoming Webhooks",
            "List Outgoing Webhooks"
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
            "Bots",
            "Channels",
            "Channels",
            "Channels",
            "Channels",
            "Channels",
            "Emoji",
            "Groups",
            "Groups",
            "Groups",
            "Groups",
            "Insights",
            "Insights",
            "Insights",
            "Insights",
            "Insights",
            "Insights",
            "Insights",
            "Insights",
            "Posts",
            "Posts",
            "Teams",
            "Teams",
            "Users",
            "Webhooks",
            "Webhooks"
          ],
          "operation": [
            "Get Bots",
            "Get A List Of All Channels",
            "Get Public Channels",
            "Get Private Channels",
            "Get Deleted Channels",
            "Get Channel Members",
            "Get A List Of Custom Emoji",
            "Get Groups",
            "Get Channel Groups",
            "Get Team Groups",
            "Get Team Groups By Channels",
            "Get A List Of The Top Reactions For A Team.",
            "Get A List Of The Top Reactions For A User.",
            "Get A List Of The Top Channels For A Team.",
            "Get A List Of The Top Channels For A User.",
            "Get A List Of New Team Members.",
            "Get A List Of The Top Threads For A Team.",
            "Get A List Of The Top Threads For A User.",
            "Get A List Of The Top Dms For A User.",
            "Get A List Of Flagged Posts",
            "Get Posts For A Channel",
            "Get Teams",
            "Get Team Members",
            "Get Users",
            "List Incoming Webhooks",
            "List Outgoing Webhooks"
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
