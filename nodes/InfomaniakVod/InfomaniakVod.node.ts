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
  "General": {
    "GET /1/vod/channel": {
      "method": "GET",
      "path": "/1/vod/channel",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/disk-usage": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/disk-usage",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/media/{media}/thumbnail": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/media/{media}/thumbnail",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/media/{media}/thumbnail": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/media/{media}/thumbnail",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [
        {
          "name": "file",
          "field": "query_file"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "file",
          "field": "body_file"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/browse": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/browse",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/browse": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/browse",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
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
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/browse/copy": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/browse/copy",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "destination",
          "field": "body_destination"
        },
        {
          "name": "targets",
          "field": "body_targets"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/browse/move": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/browse/move",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "destination",
          "field": "body_destination"
        },
        {
          "name": "targets",
          "field": "body_targets"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/browse/trash": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/browse/trash",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/browse/trash": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/browse/trash",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/browse/trash/{file}": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/browse/trash/{file}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "file",
          "field": "path_file"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/browse/trash/{file}/restore": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/browse/trash/{file}/restore",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "file",
          "field": "path_file"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/browse/tree": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/browse/tree",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/browse/breadcrumb": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/browse/breadcrumb",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/browse/{file}/breadcrumb": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/browse/{file}/breadcrumb",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /1/vod/channel/{channel}/browse/update": {
      "method": "PUT",
      "path": "/1/vod/channel/{channel}/browse/update",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
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
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/browse/{file}": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/browse/{file}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "file",
          "field": "path_file"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /1/vod/channel/{channel}/browse/{file}": {
      "method": "PUT",
      "path": "/1/vod/channel/{channel}/browse/{file}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "file",
          "field": "path_file"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "type",
          "field": "body_type"
        },
        {
          "name": "$ref",
          "field": "body__ref"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/browse/{file}": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/browse/{file}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "file",
          "field": "path_file"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/browse/{file}/tree": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/browse/{file}/tree",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/browse/{file}/copy": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/browse/{file}/copy",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "file",
          "field": "path_file"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "destination",
          "field": "body_destination"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/browse/{file}/move": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/browse/{file}/move",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "file",
          "field": "path_file"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "destination",
          "field": "body_destination"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/callback/log": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/callback/log",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/callback/log": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/callback/log",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/callback/log/{callbackLog}": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/callback/log/{callbackLog}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "callbackLog",
          "field": "path_callbackLog"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/callback/log/{callbackLog}": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/callback/log/{callbackLog}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "callbackLog",
          "field": "path_callbackLog"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/callback": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/callback",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/callback": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/callback",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /1/vod/channel/{channel}/callback": {
      "method": "PUT",
      "path": "/1/vod/channel/{channel}/callback",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/callback": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/callback",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/callback/{callback}": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/callback/{callback}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "callback",
          "field": "path_callback"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /1/vod/channel/{channel}/callback/{callback}": {
      "method": "PUT",
      "path": "/1/vod/channel/{channel}/callback/{callback}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "callback",
          "field": "path_callback"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/callback/{callback}": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/callback/{callback}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "callback",
          "field": "path_callback"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/journal": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/journal",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/encoding": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/encoding",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/encoding": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/encoding",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/encoding": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/encoding",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/encoding/{encoding}": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/encoding/{encoding}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "encoding",
          "field": "path_encoding"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /1/vod/channel/{channel}/encoding/{encoding}": {
      "method": "PUT",
      "path": "/1/vod/channel/{channel}/encoding/{encoding}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "encoding",
          "field": "path_encoding"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/encoding/{encoding}": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/encoding/{encoding}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "encoding",
          "field": "path_encoding"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/logo": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/logo",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/logo": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/logo",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/logo": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/logo",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/logo/detach": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/logo/detach",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/logo/{logo}": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/logo/{logo}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "logo",
          "field": "path_logo"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /1/vod/channel/{channel}/logo/{logo}": {
      "method": "PUT",
      "path": "/1/vod/channel/{channel}/logo/{logo}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "logo",
          "field": "path_logo"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/logo/{logo}": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/logo/{logo}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "logo",
          "field": "path_logo"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/logo/{logo}/attach": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/logo/{logo}/attach",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "logo",
          "field": "path_logo"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/folder": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/folder",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/folder": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/folder",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/folder/{folder}/encoding": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/folder/{folder}/encoding",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/folder/{folder}/encoding": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/folder/{folder}/encoding",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/folder/{folder}/encoding/{encoding}": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/folder/{folder}/encoding/{encoding}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "folder",
          "field": "path_folder"
        },
        {
          "name": "encoding",
          "field": "path_encoding"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/folder/{folder}/encoding/{encoding}": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/folder/{folder}/encoding/{encoding}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "folder",
          "field": "path_folder"
        },
        {
          "name": "encoding",
          "field": "path_encoding"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/folder/{folder}/logo/{logo}": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/folder/{folder}/logo/{logo}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "folder",
          "field": "path_folder"
        },
        {
          "name": "logo",
          "field": "path_logo"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/folder/{folder}/logo": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/folder/{folder}/logo",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/folder/root": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/folder/root",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/folder/{folder}": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/folder/{folder}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [
        {
          "name": "$folder, new OptionsHttp($request",
          "field": "query__folder__new_OptionsHttp__request"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/folder/{folder}": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/folder/{folder}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "folder",
          "field": "path_folder"
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
          "name": "description",
          "field": "body_description"
        },
        {
          "name": "validated",
          "field": "body_validated"
        },
        {
          "name": "published",
          "field": "body_published"
        },
        {
          "name": "auto_validate",
          "field": "body_auto_validate"
        },
        {
          "name": "auto_publish",
          "field": "body_auto_publish"
        },
        {
          "name": "restricted",
          "field": "body_restricted"
        },
        {
          "name": "key",
          "field": "body_key"
        },
        {
          "name": "allowed_ip",
          "field": "body_allowed_ip"
        },
        {
          "name": "disallowed_ip",
          "field": "body_disallowed_ip"
        },
        {
          "name": "allowed_country",
          "field": "body_allowed_country"
        },
        {
          "name": "disallowed_country",
          "field": "body_disallowed_country"
        },
        {
          "name": "discarded",
          "field": "body_discarded"
        },
        {
          "name": "created_at",
          "field": "body_created_at"
        },
        {
          "name": "updated_at",
          "field": "body_updated_at"
        },
        {
          "name": "discarded_at",
          "field": "body_discarded_at"
        },
        {
          "name": "deleted_at",
          "field": "body_deleted_at"
        },
        {
          "name": "image",
          "field": "body_image"
        },
        {
          "name": "media_count",
          "field": "body_media_count"
        },
        {
          "name": "media_duration",
          "field": "body_media_duration"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "PUT /1/vod/channel/{channel}/folder/{folder}": {
      "method": "PUT",
      "path": "/1/vod/channel/{channel}/folder/{folder}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "folder",
          "field": "path_folder"
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
          "name": "description",
          "field": "body_description"
        },
        {
          "name": "validated",
          "field": "body_validated"
        },
        {
          "name": "published",
          "field": "body_published"
        },
        {
          "name": "auto_validate",
          "field": "body_auto_validate"
        },
        {
          "name": "auto_publish",
          "field": "body_auto_publish"
        },
        {
          "name": "restricted",
          "field": "body_restricted"
        },
        {
          "name": "key",
          "field": "body_key"
        },
        {
          "name": "allowed_ip",
          "field": "body_allowed_ip"
        },
        {
          "name": "disallowed_ip",
          "field": "body_disallowed_ip"
        },
        {
          "name": "allowed_country",
          "field": "body_allowed_country"
        },
        {
          "name": "disallowed_country",
          "field": "body_disallowed_country"
        },
        {
          "name": "discarded",
          "field": "body_discarded"
        },
        {
          "name": "created_at",
          "field": "body_created_at"
        },
        {
          "name": "updated_at",
          "field": "body_updated_at"
        },
        {
          "name": "discarded_at",
          "field": "body_discarded_at"
        },
        {
          "name": "deleted_at",
          "field": "body_deleted_at"
        },
        {
          "name": "image",
          "field": "body_image"
        },
        {
          "name": "media_count",
          "field": "body_media_count"
        },
        {
          "name": "media_duration",
          "field": "body_media_duration"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/folder/{folder}": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/folder/{folder}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/folder/{folder}/playlist": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/folder/{folder}/playlist",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/ftp/user": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/ftp/user",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/ftp/user": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/ftp/user",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/ftp/user/{ftpUser}": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/ftp/user/{ftpUser}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "ftpUser",
          "field": "path_ftpUser"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /1/vod/channel/{channel}/ftp/user/{ftpUser}": {
      "method": "PUT",
      "path": "/1/vod/channel/{channel}/ftp/user/{ftpUser}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "ftpUser",
          "field": "path_ftpUser"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/ftp/user/{ftpUser}": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/ftp/user/{ftpUser}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "ftpUser",
          "field": "path_ftpUser"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/media": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/media",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /1/vod/channel/{channel}/media": {
      "method": "PUT",
      "path": "/1/vod/channel/{channel}/media",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/media/{media}": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/media/{media}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [
        {
          "name": "$media, new OptionsHttp($request",
          "field": "query__media__new_OptionsHttp__request"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /1/vod/channel/{channel}/media/{media}": {
      "method": "PUT",
      "path": "/1/vod/channel/{channel}/media/{media}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
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
          "name": "description",
          "field": "body_description"
        },
        {
          "name": "validated",
          "field": "body_validated"
        },
        {
          "name": "published",
          "field": "body_published"
        },
        {
          "name": "streams",
          "field": "body_streams"
        },
        {
          "name": "shot_boundaries",
          "field": "body_shot_boundaries"
        },
        {
          "name": "key_restricted",
          "field": "body_key_restricted"
        },
        {
          "name": "ip_restricted",
          "field": "body_ip_restricted"
        },
        {
          "name": "country_restricted",
          "field": "body_country_restricted"
        },
        {
          "name": "state",
          "field": "body_state"
        },
        {
          "name": "created_at",
          "field": "body_created_at"
        },
        {
          "name": "updated_at",
          "field": "body_updated_at"
        },
        {
          "name": "folder",
          "field": "body_folder"
        },
        {
          "name": "upload",
          "field": "body_upload"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/media/{media}": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/media/{media}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/media/{media}/chapter": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/media/{media}/chapter",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/media/{media}/chapter": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/media/{media}/chapter",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
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
          "name": "timestamp",
          "field": "body_timestamp"
        },
        {
          "name": "description",
          "field": "body_description"
        },
        {
          "name": "published",
          "field": "body_published"
        },
        {
          "name": "created_at",
          "field": "body_created_at"
        },
        {
          "name": "updated_at",
          "field": "body_updated_at"
        },
        {
          "name": "deleted_at",
          "field": "body_deleted_at"
        },
        {
          "name": "index",
          "field": "body_index"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "PUT /1/vod/channel/{channel}/media/{media}/chapter": {
      "method": "PUT",
      "path": "/1/vod/channel/{channel}/media/{media}/chapter",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/media/{media}/chapter": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/media/{media}/chapter",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/media/{media}/chapter/{chapter}": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/media/{media}/chapter/{chapter}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        },
        {
          "name": "chapter",
          "field": "path_chapter"
        }
      ],
      "queryParams": [
        {
          "name": "$media, $chapter, new OptionsHttp($request",
          "field": "query__media___chapter__new_OptionsHttp__request"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /1/vod/channel/{channel}/media/{media}/chapter/{chapter}": {
      "method": "PUT",
      "path": "/1/vod/channel/{channel}/media/{media}/chapter/{chapter}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        },
        {
          "name": "chapter",
          "field": "path_chapter"
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
          "name": "timestamp",
          "field": "body_timestamp"
        },
        {
          "name": "description",
          "field": "body_description"
        },
        {
          "name": "published",
          "field": "body_published"
        },
        {
          "name": "created_at",
          "field": "body_created_at"
        },
        {
          "name": "updated_at",
          "field": "body_updated_at"
        },
        {
          "name": "deleted_at",
          "field": "body_deleted_at"
        },
        {
          "name": "index",
          "field": "body_index"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/media/{media}/chapter/{chapter}": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/media/{media}/chapter/{chapter}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        },
        {
          "name": "chapter",
          "field": "path_chapter"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/media/{media}/cut": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/media/{media}/cut",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/media/{media}/cut": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/media/{media}/cut",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "$ref",
          "field": "body__ref"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/media/{media}/waveform": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/media/{media}/waveform",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/media/{media}/thumbstrip": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/media/{media}/thumbstrip",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/player": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/player",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/player": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/player",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/player": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/player",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/player/{player}": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/player/{player}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "player",
          "field": "path_player"
        }
      ],
      "queryParams": [
        {
          "name": "$player, new OptionsHttp($request",
          "field": "query__player__new_OptionsHttp__request"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /1/vod/channel/{channel}/player/{player}": {
      "method": "PUT",
      "path": "/1/vod/channel/{channel}/player/{player}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "player",
          "field": "path_player"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "type",
          "field": "body_type"
        },
        {
          "name": "$ref",
          "field": "body__ref"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/player/{player}": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/player/{player}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "player",
          "field": "path_player"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/player/{player}/copy": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/player/{player}/copy",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "player",
          "field": "path_player"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/player/{player}/ad": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/player/{player}/ad",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "player",
          "field": "path_player"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/player/{player}/ad": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/player/{player}/ad",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "player",
          "field": "path_player"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/player/{player}/ad": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/player/{player}/ad",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "player",
          "field": "path_player"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/player/{player}/ad/{ad}": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/player/{player}/ad/{ad}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "player",
          "field": "path_player"
        },
        {
          "name": "ad",
          "field": "path_ad"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /1/vod/channel/{channel}/player/{player}/ad/{ad}": {
      "method": "PUT",
      "path": "/1/vod/channel/{channel}/player/{player}/ad/{ad}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "player",
          "field": "path_player"
        },
        {
          "name": "ad",
          "field": "path_ad"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/player/{player}/ad/{ad}": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/player/{player}/ad/{ad}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "player",
          "field": "path_player"
        },
        {
          "name": "ad",
          "field": "path_ad"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/playlist": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/playlist",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/playlist": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/playlist",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/playlist": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/playlist",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/playlist/{playlist}": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/playlist/{playlist}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "playlist",
          "field": "path_playlist"
        }
      ],
      "queryParams": [
        {
          "name": "$playlist, new OptionsHttp($request",
          "field": "query__playlist__new_OptionsHttp__request"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /1/vod/channel/{channel}/playlist/{playlist}": {
      "method": "PUT",
      "path": "/1/vod/channel/{channel}/playlist/{playlist}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "playlist",
          "field": "path_playlist"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PATCH /1/vod/channel/{channel}/playlist/{playlist}": {
      "method": "PATCH",
      "path": "/1/vod/channel/{channel}/playlist/{playlist}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "playlist",
          "field": "path_playlist"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/playlist/{playlist}": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/playlist/{playlist}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "playlist",
          "field": "path_playlist"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/playlist/{playlist}/browse/{folder?}": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/playlist/{playlist}/browse/{folder?}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "playlist",
          "field": "path_playlist"
        },
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/share": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/share",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/share": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/share",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "target",
          "field": "body_target"
        },
        {
          "name": "player",
          "field": "body_player"
        },
        {
          "name": "encoding",
          "field": "body_encoding"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/share/{share}": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/share/{share}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "share",
          "field": "path_share"
        }
      ],
      "queryParams": [
        {
          "name": "$share, new OptionsHttp($request",
          "field": "query__share__new_OptionsHttp__request"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /1/vod/channel/{channel}/share/{share}": {
      "method": "PUT",
      "path": "/1/vod/channel/{channel}/share/{share}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "share",
          "field": "path_share"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/share/{share}": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/share/{share}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "share",
          "field": "path_share"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/share/{share}/token": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/share/{share}/token",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "share",
          "field": "path_share"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "$ref",
          "field": "body__ref"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/avg_time": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/avg_time",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/consumption": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/consumption",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/consumption/encodings/histogram": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/consumption/encodings/histogram",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/media": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/media",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/media/{media}/consumption": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/media/{media}/consumption",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/media/{media}/consumption/encodings/histogram": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/media/{media}/consumption/encodings/histogram",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/media/{media}/geolocation/clusters": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/media/{media}/geolocation/clusters",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/media/{media}/geolocation/countries": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/media/{media}/geolocation/countries",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/media/{media}/technologies/browsers/shares": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/media/{media}/technologies/browsers/shares",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/media/{media}/technologies/os/shares": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/media/{media}/technologies/os/shares",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/media/{media}/technologies/playback/shares": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/media/{media}/technologies/playback/shares",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/media/{media}/technologies/players/shares": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/media/{media}/technologies/players/shares",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/media/{media}/viewers": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/media/{media}/viewers",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [
        {
          "name": "medias",
          "field": "query_medias"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/media/{media}/viewers/encodings/histogram": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/media/{media}/viewers/encodings/histogram",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/media/{media}/viewers/encodings/shares": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/media/{media}/viewers/encodings/shares",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/media/{media}/viewers/uniques": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/media/{media}/viewers/uniques",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [
        {
          "name": "medias",
          "field": "query_medias"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/media/{media}/viewing": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/media/{media}/viewing",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/media/{media}/viewing/encodings/histogram": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/media/{media}/viewing/encodings/histogram",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/technologies/browsers/shares": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/technologies/browsers/shares",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/technologies/os/shares": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/technologies/os/shares",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/technologies/playback/shares": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/technologies/playback/shares",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/technologies/players/shares": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/technologies/players/shares",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/time_ip": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/time_ip",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/viewers": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/viewers",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/viewers/encodings/histogram": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/viewers/encodings/histogram",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/viewers/encodings/shares": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/viewers/encodings/shares",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/viewers/histogram": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/viewers/histogram",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/viewers/medias": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/viewers/medias",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "medias",
          "field": "query_medias"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/viewers/uniques": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/viewers/uniques",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/viewers/uniques/medias": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/viewers/uniques/medias",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "medias",
          "field": "query_medias"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/viewing": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/viewing",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/statistics/viewing/encodings/histogram": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/statistics/viewing/encodings/histogram",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/upload": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/upload",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/upload": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/upload",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "folder",
          "field": "body_folder"
        },
        {
          "name": "url",
          "field": "body_url"
        },
        {
          "name": "file",
          "field": "body_file"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "size",
          "field": "body_size"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/media/{media}/subtitle/{language}": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/media/{media}/subtitle/{language}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        },
        {
          "name": "language",
          "field": "path_language"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/media/{media}/subtitle/{language}/import": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/media/{media}/subtitle/{language}/import",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        },
        {
          "name": "language",
          "field": "path_language"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}/default": {
      "method": "PUT",
      "path": "/1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}/default",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        },
        {
          "name": "subtitle",
          "field": "path_subtitle"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        },
        {
          "name": "subtitle",
          "field": "path_subtitle"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}": {
      "method": "PUT",
      "path": "/1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        },
        {
          "name": "subtitle",
          "field": "path_subtitle"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        },
        {
          "name": "subtitle",
          "field": "path_subtitle"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/media/{media}/logo/{logo}": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/media/{media}/logo/{logo}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        },
        {
          "name": "logo",
          "field": "path_logo"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/media/{media}/logo": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/media/{media}/logo",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/encoding/constraint": {
      "method": "GET",
      "path": "/1/vod/encoding/constraint",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/encoding/profile": {
      "method": "GET",
      "path": "/1/vod/encoding/profile",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/country": {
      "method": "GET",
      "path": "/1/vod/country",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/category": {
      "method": "GET",
      "path": "/1/vod/category",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/language": {
      "method": "GET",
      "path": "/1/vod/language",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/search": {
      "method": "GET",
      "path": "/1/vod/search",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/media/{media}/playlist": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/media/{media}/playlist",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/playlist/attach": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/playlist/attach",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/playlist/detach": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/playlist/detach",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/media/{media}/subtitle": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/media/{media}/subtitle",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /1/vod/channel/{channel}/media/{media}/subtitle": {
      "method": "PUT",
      "path": "/1/vod/channel/{channel}/media/{media}/subtitle",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/media/{media}/subtitle": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/media/{media}/subtitle",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V2 > Browse": {
    "POST /1/vod/channel/{channel}/browse/export": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/browse/export",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/browse/trash/restore": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/browse/trash/restore",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/browse/{file}/export": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/browse/{file}/export",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "file",
          "field": "path_file"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V2 > Channel": {
    "GET /1/vod/channel/{channel}": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /1/vod/channel/{channel}": {
      "method": "PUT",
      "path": "/1/vod/channel/{channel}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V2 > Playlist": {
    "GET /1/res/playlist/{playlist}.{ext}": {
      "method": "GET",
      "path": "/1/res/playlist/{playlist}.{ext}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "playlist",
          "field": "path_playlist"
        },
        {
          "name": "ext",
          "field": "path_ext"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/playlist/{playlist}/attach": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/playlist/{playlist}/attach",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "playlist",
          "field": "path_playlist"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/playlist/{playlist}/detach": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/playlist/{playlist}/detach",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "playlist",
          "field": "path_playlist"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/playlist/{playlist}/copy": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/playlist/{playlist}/copy",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "playlist",
          "field": "path_playlist"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/playlist/{playlist}/image": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/playlist/{playlist}/image",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "playlist",
          "field": "path_playlist"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /1/vod/channel/{channel}/playlist/{playlist}/image": {
      "method": "DELETE",
      "path": "/1/vod/channel/{channel}/playlist/{playlist}/image",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "playlist",
          "field": "path_playlist"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/playlist/{playlist}/media": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/playlist/{playlist}/media",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "playlist",
          "field": "path_playlist"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/playlist/{playlist}/media/move/up": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/playlist/{playlist}/media/move/up",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "playlist",
          "field": "path_playlist"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/playlist/{playlist}/media/move/down": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/playlist/{playlist}/media/move/down",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "playlist",
          "field": "path_playlist"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/playlist/{playlist}/media/move/after": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/playlist/{playlist}/media/move/after",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "playlist",
          "field": "path_playlist"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/playlist/{playlist}/media/move/before": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/playlist/{playlist}/media/move/before",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "playlist",
          "field": "path_playlist"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V2 > Subtitles": {
    "POST /1/vod/channel/{channel}/media/{media}/subtitle": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/media/{media}/subtitle",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/media/{media}/subtitle/summarize": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/media/{media}/subtitle/summarize",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}/summarize": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}/summarize",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        },
        {
          "name": "subtitle",
          "field": "path_subtitle"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}/summarize": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}/summarize",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        },
        {
          "name": "subtitle",
          "field": "path_subtitle"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}/translate": {
      "method": "POST",
      "path": "/1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}/translate",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        },
        {
          "name": "subtitle",
          "field": "path_subtitle"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "languages",
          "field": "body_languages"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V2 > UserActivity": {
    "GET /1/vod/channel/{channel}/user-activity-log": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/user-activity-log",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /1/vod/channel/{channel}/user-activity-log": {
      "method": "PUT",
      "path": "/1/vod/channel/{channel}/user-activity-log",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/folder/{folder}/user-activity-log": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/folder/{folder}/user-activity-log",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /1/vod/channel/{channel}/media/{media}/user-activity-log": {
      "method": "GET",
      "path": "/1/vod/channel/{channel}/media/{media}/user-activity-log",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > Ad": {
    "GET /2/vod/players/{player}/ads": {
      "method": "GET",
      "path": "/2/vod/players/{player}/ads",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "player",
          "field": "path_player"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/vod/players/{player}/ads": {
      "method": "POST",
      "path": "/2/vod/players/{player}/ads",
      "pagination": "none",
      "pathParams": [
        {
          "name": "player",
          "field": "path_player"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "category",
          "field": "body_category"
        },
        {
          "name": "href",
          "field": "body_href"
        },
        {
          "name": "offset",
          "field": "body_offset"
        },
        {
          "name": "skip_after",
          "field": "body_skip_after"
        },
        {
          "name": "tracking_url",
          "field": "body_tracking_url"
        },
        {
          "name": "type",
          "field": "body_type"
        },
        {
          "name": "url",
          "field": "body_url"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/vod/players/{player}/ads": {
      "method": "DELETE",
      "path": "/2/vod/players/{player}/ads",
      "pagination": "none",
      "pathParams": [
        {
          "name": "player",
          "field": "path_player"
        }
      ],
      "queryParams": [
        {
          "name": "ads",
          "field": "query_ads"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/ads/{ad}": {
      "method": "GET",
      "path": "/2/vod/ads/{ad}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "ad",
          "field": "path_ad"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/vod/ads/{ad}": {
      "method": "PUT",
      "path": "/2/vod/ads/{ad}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "ad",
          "field": "path_ad"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "category",
          "field": "body_category"
        },
        {
          "name": "href",
          "field": "body_href"
        },
        {
          "name": "offset",
          "field": "body_offset"
        },
        {
          "name": "skip_after",
          "field": "body_skip_after"
        },
        {
          "name": "tracking_url",
          "field": "body_tracking_url"
        },
        {
          "name": "type",
          "field": "body_type"
        },
        {
          "name": "url",
          "field": "body_url"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/vod/ads/{ad}": {
      "method": "DELETE",
      "path": "/2/vod/ads/{ad}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "ad",
          "field": "path_ad"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > Alert": {
    "GET /2/vod/channels/{channel}/alerts": {
      "method": "GET",
      "path": "/2/vod/channels/{channel}/alerts",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/alerts/{alert}": {
      "method": "GET",
      "path": "/2/vod/alerts/{alert}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "alert",
          "field": "path_alert"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > Callback": {
    "GET /2/vod/channels/{channel}/callbacks": {
      "method": "GET",
      "path": "/2/vod/channels/{channel}/callbacks",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/vod/channels/{channel}/callbacks": {
      "method": "POST",
      "path": "/2/vod/channels/{channel}/callbacks",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "active",
          "field": "body_active"
        },
        {
          "name": "auth",
          "field": "body_auth"
        },
        {
          "name": "basic_password",
          "field": "body_basic_password"
        },
        {
          "name": "basic_username",
          "field": "body_basic_username"
        },
        {
          "name": "bearer_token",
          "field": "body_bearer_token"
        },
        {
          "name": "event_list",
          "field": "body_event_list"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "response",
          "field": "body_response"
        },
        {
          "name": "url",
          "field": "body_url"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /2/vod/callbacks/{callback}": {
      "method": "GET",
      "path": "/2/vod/callbacks/{callback}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "callback",
          "field": "path_callback"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/vod/callbacks/{callback}": {
      "method": "PUT",
      "path": "/2/vod/callbacks/{callback}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "callback",
          "field": "path_callback"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "active",
          "field": "body_active"
        },
        {
          "name": "auth",
          "field": "body_auth"
        },
        {
          "name": "basic_password",
          "field": "body_basic_password"
        },
        {
          "name": "basic_username",
          "field": "body_basic_username"
        },
        {
          "name": "bearer_token",
          "field": "body_bearer_token"
        },
        {
          "name": "event_list",
          "field": "body_event_list"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "response",
          "field": "body_response"
        },
        {
          "name": "url",
          "field": "body_url"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/vod/callbacks/{callback}": {
      "method": "DELETE",
      "path": "/2/vod/callbacks/{callback}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "callback",
          "field": "path_callback"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > Category": {
    "GET /2/vod/categories": {
      "method": "GET",
      "path": "/2/vod/categories",
      "pagination": "page-per-page",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > Channel": {
    "GET /2/vod/accounts/{account}/channels": {
      "method": "GET",
      "path": "/2/vod/accounts/{account}/channels",
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
    "GET /2/vod/channels/{channel}": {
      "method": "GET",
      "path": "/2/vod/channels/{channel}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/channels/{channel}/disk-usage": {
      "method": "GET",
      "path": "/2/vod/channels/{channel}/disk-usage",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/channels/{channel}/disk-usage/trash": {
      "method": "GET",
      "path": "/2/vod/channels/{channel}/disk-usage/trash",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/disk-usage/{folder}": {
      "method": "GET",
      "path": "/2/vod/disk-usage/{folder}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > Chapter": {
    "GET /2/vod/media/{media}/chapters": {
      "method": "GET",
      "path": "/2/vod/media/{media}/chapters",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/chapters/{chapter}": {
      "method": "GET",
      "path": "/2/vod/chapters/{chapter}",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "chapter",
          "field": "path_chapter"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > Country": {
    "GET /2/vod/countries": {
      "method": "GET",
      "path": "/2/vod/countries",
      "pagination": "page-per-page",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > Encoding": {
    "GET /2/vod/channels/{channel}/encodings": {
      "method": "GET",
      "path": "/2/vod/channels/{channel}/encodings",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/vod/channels/{channel}/encodings": {
      "method": "POST",
      "path": "/2/vod/channels/{channel}/encodings",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "audio_channel",
          "field": "body_audio_channel"
        },
        {
          "name": "audio_codec",
          "field": "body_audio_codec"
        },
        {
          "name": "container",
          "field": "body_container"
        },
        {
          "name": "copy",
          "field": "body_copy"
        },
        {
          "name": "folder",
          "field": "body_folder"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "streams",
          "field": "body_streams"
        },
        {
          "name": "video_aspect",
          "field": "body_video_aspect"
        },
        {
          "name": "video_codec",
          "field": "body_video_codec"
        },
        {
          "name": "video_fps",
          "field": "body_video_fps"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/vod/channels/{channel}/encodings": {
      "method": "DELETE",
      "path": "/2/vod/channels/{channel}/encodings",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "encodings",
          "field": "query_encodings"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/encodings/{encoding}": {
      "method": "GET",
      "path": "/2/vod/encodings/{encoding}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "encoding",
          "field": "path_encoding"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/vod/encodings/{encoding}": {
      "method": "PUT",
      "path": "/2/vod/encodings/{encoding}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "encoding",
          "field": "path_encoding"
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
    "DELETE /2/vod/encodings/{encoding}": {
      "method": "DELETE",
      "path": "/2/vod/encodings/{encoding}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "encoding",
          "field": "path_encoding"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/encodings/constraints": {
      "method": "GET",
      "path": "/2/vod/encodings/constraints",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/encodings/profiles": {
      "method": "GET",
      "path": "/2/vod/encodings/profiles",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > Filesystem": {
    "GET /2/vod/channels/{channel}/browse": {
      "method": "GET",
      "path": "/2/vod/channels/{channel}/browse",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /2/vod/channels/{channel}/browse": {
      "method": "DELETE",
      "path": "/2/vod/channels/{channel}/browse",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "files",
          "field": "query_files"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/channels/{channel}/browse/tree": {
      "method": "GET",
      "path": "/2/vod/channels/{channel}/browse/tree",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/channels/{channel}/browse/breadcrumb": {
      "method": "GET",
      "path": "/2/vod/channels/{channel}/browse/breadcrumb",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/channels/{channel}/browse/trash": {
      "method": "GET",
      "path": "/2/vod/channels/{channel}/browse/trash",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /2/vod/channels/{channel}/browse/trash": {
      "method": "DELETE",
      "path": "/2/vod/channels/{channel}/browse/trash",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/browse/{folder}": {
      "method": "GET",
      "path": "/2/vod/browse/{folder}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/browse/{folder}/breadcrumb": {
      "method": "GET",
      "path": "/2/vod/browse/{folder}/breadcrumb",
      "pagination": "none",
      "pathParams": [
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/browse/{folder}/tree": {
      "method": "GET",
      "path": "/2/vod/browse/{folder}/tree",
      "pagination": "none",
      "pathParams": [
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/vod/channels/{channel}/browse/restore": {
      "method": "POST",
      "path": "/2/vod/channels/{channel}/browse/restore",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "files",
          "field": "body_files"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/vod/channels/{channel}/browse/move": {
      "method": "POST",
      "path": "/2/vod/channels/{channel}/browse/move",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "destination",
          "field": "body_destination"
        },
        {
          "name": "files",
          "field": "body_files"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "V3 > Folder": {
    "GET /2/vod/channels/{channel}/folders/root": {
      "method": "GET",
      "path": "/2/vod/channels/{channel}/folders/root",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/channels/{channel}/folders": {
      "method": "GET",
      "path": "/2/vod/channels/{channel}/folders",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/vod/channels/{channel}/folders": {
      "method": "POST",
      "path": "/2/vod/channels/{channel}/folders",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "allowed_country",
          "field": "body_allowed_country"
        },
        {
          "name": "allowed_domains",
          "field": "body_allowed_domains"
        },
        {
          "name": "allowed_ip",
          "field": "body_allowed_ip"
        },
        {
          "name": "auto_generate_description",
          "field": "body_auto_generate_description"
        },
        {
          "name": "auto_generate_subtitle",
          "field": "body_auto_generate_subtitle"
        },
        {
          "name": "auto_generate_title",
          "field": "body_auto_generate_title"
        },
        {
          "name": "auto_publish",
          "field": "body_auto_publish"
        },
        {
          "name": "auto_translate_languages",
          "field": "body_auto_translate_languages"
        },
        {
          "name": "auto_validate",
          "field": "body_auto_validate"
        },
        {
          "name": "configuration",
          "field": "body_configuration"
        },
        {
          "name": "description",
          "field": "body_description"
        },
        {
          "name": "disallowed_country",
          "field": "body_disallowed_country"
        },
        {
          "name": "disallowed_domains",
          "field": "body_disallowed_domains"
        },
        {
          "name": "disallowed_ip",
          "field": "body_disallowed_ip"
        },
        {
          "name": "encodings",
          "field": "body_encodings"
        },
        {
          "name": "inherits_encodings",
          "field": "body_inherits_encodings"
        },
        {
          "name": "inherits_labels",
          "field": "body_inherits_labels"
        },
        {
          "name": "inherits_media_processing",
          "field": "body_inherits_media_processing"
        },
        {
          "name": "inherits_restrictions",
          "field": "body_inherits_restrictions"
        },
        {
          "name": "key_restricted",
          "field": "body_key_restricted"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "parent",
          "field": "body_parent"
        },
        {
          "name": "password",
          "field": "body_password"
        },
        {
          "name": "player",
          "field": "body_player"
        },
        {
          "name": "replace_on_upload",
          "field": "body_replace_on_upload"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /2/vod/folders/{folder}": {
      "method": "GET",
      "path": "/2/vod/folders/{folder}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/vod/folders/{folder}": {
      "method": "PUT",
      "path": "/2/vod/folders/{folder}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "allowed_country",
          "field": "body_allowed_country"
        },
        {
          "name": "allowed_domains",
          "field": "body_allowed_domains"
        },
        {
          "name": "allowed_ip",
          "field": "body_allowed_ip"
        },
        {
          "name": "auto_generate_description",
          "field": "body_auto_generate_description"
        },
        {
          "name": "auto_generate_subtitle",
          "field": "body_auto_generate_subtitle"
        },
        {
          "name": "auto_generate_title",
          "field": "body_auto_generate_title"
        },
        {
          "name": "auto_publish",
          "field": "body_auto_publish"
        },
        {
          "name": "auto_translate_languages",
          "field": "body_auto_translate_languages"
        },
        {
          "name": "auto_validate",
          "field": "body_auto_validate"
        },
        {
          "name": "configuration",
          "field": "body_configuration"
        },
        {
          "name": "description",
          "field": "body_description"
        },
        {
          "name": "disallowed_country",
          "field": "body_disallowed_country"
        },
        {
          "name": "disallowed_domains",
          "field": "body_disallowed_domains"
        },
        {
          "name": "disallowed_ip",
          "field": "body_disallowed_ip"
        },
        {
          "name": "encodings",
          "field": "body_encodings"
        },
        {
          "name": "inherits_encodings",
          "field": "body_inherits_encodings"
        },
        {
          "name": "inherits_labels",
          "field": "body_inherits_labels"
        },
        {
          "name": "inherits_media_processing",
          "field": "body_inherits_media_processing"
        },
        {
          "name": "inherits_restrictions",
          "field": "body_inherits_restrictions"
        },
        {
          "name": "key_restricted",
          "field": "body_key_restricted"
        },
        {
          "name": "password",
          "field": "body_password"
        },
        {
          "name": "player",
          "field": "body_player"
        },
        {
          "name": "replace_on_upload",
          "field": "body_replace_on_upload"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/vod/folders/{folder}": {
      "method": "DELETE",
      "path": "/2/vod/folders/{folder}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/vod/folders/{folder}/encodings": {
      "method": "POST",
      "path": "/2/vod/folders/{folder}/encodings",
      "pagination": "none",
      "pathParams": [
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "encodings",
          "field": "body_encodings"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "PUT /2/vod/folders/{folder}/encodings": {
      "method": "PUT",
      "path": "/2/vod/folders/{folder}/encodings",
      "pagination": "none",
      "pathParams": [
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "encodings",
          "field": "body_encodings"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/vod/folders/{folder}/encodings": {
      "method": "DELETE",
      "path": "/2/vod/folders/{folder}/encodings",
      "pagination": "none",
      "pathParams": [
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/vod/folders/{folder}/logo": {
      "method": "PUT",
      "path": "/2/vod/folders/{folder}/logo",
      "pagination": "none",
      "pathParams": [
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "logo",
          "field": "body_logo"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /2/vod/folders/{folder}/logo": {
      "method": "DELETE",
      "path": "/2/vod/folders/{folder}/logo",
      "pagination": "none",
      "pathParams": [
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/vod/folders/{folder}/labels": {
      "method": "PUT",
      "path": "/2/vod/folders/{folder}/labels",
      "pagination": "none",
      "pathParams": [
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "labels",
          "field": "body_labels"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /2/vod/folders/{folder}/labels": {
      "method": "DELETE",
      "path": "/2/vod/folders/{folder}/labels",
      "pagination": "none",
      "pathParams": [
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [
        {
          "name": "labels",
          "field": "query_labels"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/vod/folders/{folder}/lock": {
      "method": "PUT",
      "path": "/2/vod/folders/{folder}/lock",
      "pagination": "none",
      "pathParams": [
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/vod/folders/{folder}/unlock": {
      "method": "PUT",
      "path": "/2/vod/folders/{folder}/unlock",
      "pagination": "none",
      "pathParams": [
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > Ftp": {
    "GET /2/vod/channels/{channel}/ftpusers": {
      "method": "GET",
      "path": "/2/vod/channels/{channel}/ftpusers",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/vod/channels/{channel}/ftpusers": {
      "method": "POST",
      "path": "/2/vod/channels/{channel}/ftpusers",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "active",
          "field": "body_active"
        },
        {
          "name": "description",
          "field": "body_description"
        },
        {
          "name": "home_folder",
          "field": "body_home_folder"
        },
        {
          "name": "msg_login",
          "field": "body_msg_login"
        },
        {
          "name": "msg_quit",
          "field": "body_msg_quit"
        },
        {
          "name": "password",
          "field": "body_password"
        },
        {
          "name": "prefix",
          "field": "body_prefix"
        },
        {
          "name": "username",
          "field": "body_username"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /2/vod/ftpusers/{user}": {
      "method": "GET",
      "path": "/2/vod/ftpusers/{user}",
      "pagination": "none",
      "pathParams": [
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
    },
    "PUT /2/vod/ftpusers/{user}": {
      "method": "PUT",
      "path": "/2/vod/ftpusers/{user}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "user",
          "field": "path_user"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "active",
          "field": "body_active"
        },
        {
          "name": "description",
          "field": "body_description"
        },
        {
          "name": "home_folder",
          "field": "body_home_folder"
        },
        {
          "name": "msg_login",
          "field": "body_msg_login"
        },
        {
          "name": "msg_quit",
          "field": "body_msg_quit"
        },
        {
          "name": "password",
          "field": "body_password"
        },
        {
          "name": "prefix",
          "field": "body_prefix"
        },
        {
          "name": "username",
          "field": "body_username"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/vod/ftpusers/{user}": {
      "method": "DELETE",
      "path": "/2/vod/ftpusers/{user}",
      "pagination": "none",
      "pathParams": [
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
    },
    "POST /2/vod/ftp/login": {
      "method": "POST",
      "path": "/2/vod/ftp/login",
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
          "name": "username",
          "field": "body_username"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/vod/ftp/on/connect": {
      "method": "POST",
      "path": "/2/vod/ftp/on/connect",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/vod/ftp/on/disconnect": {
      "method": "POST",
      "path": "/2/vod/ftp/on/disconnect",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/vod/ftp/on/login": {
      "method": "POST",
      "path": "/2/vod/ftp/on/login",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/vod/ftp/on/login-failed": {
      "method": "POST",
      "path": "/2/vod/ftp/on/login-failed",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/vod/ftp/on/logout": {
      "method": "POST",
      "path": "/2/vod/ftp/on/logout",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > Journal": {
    "GET /2/vod/media/{media}/journal": {
      "method": "GET",
      "path": "/2/vod/media/{media}/journal",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/channels/{channel}/journal": {
      "method": "GET",
      "path": "/2/vod/channels/{channel}/journal",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > Label": {
    "GET /2/vod/channels/{channel}/labels": {
      "method": "GET",
      "path": "/2/vod/channels/{channel}/labels",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/vod/channels/{channel}/labels": {
      "method": "POST",
      "path": "/2/vod/channels/{channel}/labels",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "folders",
          "field": "body_folders"
        },
        {
          "name": "labels",
          "field": "body_labels"
        },
        {
          "name": "media",
          "field": "body_media"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/vod/channels/{channel}/labels": {
      "method": "DELETE",
      "path": "/2/vod/channels/{channel}/labels",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "labels",
          "field": "query_labels"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/labels/{genericLabel}": {
      "method": "GET",
      "path": "/2/vod/labels/{genericLabel}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "genericLabel",
          "field": "path_genericLabel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/vod/labels/{genericLabel}": {
      "method": "PUT",
      "path": "/2/vod/labels/{genericLabel}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "genericLabel",
          "field": "path_genericLabel"
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
          "name": "options",
          "field": "body_options"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/vod/labels/{genericLabel}": {
      "method": "DELETE",
      "path": "/2/vod/labels/{genericLabel}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "genericLabel",
          "field": "path_genericLabel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > Language": {
    "GET /2/vod/lang": {
      "method": "GET",
      "path": "/2/vod/lang",
      "pagination": "page-per-page",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/lang/{lang}": {
      "method": "GET",
      "path": "/2/vod/lang/{lang}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "lang",
          "field": "path_lang"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > LinkedSvc": {
    "POST /2/vod/channels/{channel}/services": {
      "method": "POST",
      "path": "/2/vod/channels/{channel}/services",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "linked_services",
          "field": "body_linked_services"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "V3 > Logo": {
    "GET /2/vod/channels/{channel}/logos": {
      "method": "GET",
      "path": "/2/vod/channels/{channel}/logos",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/vod/channels/{channel}/logos": {
      "method": "POST",
      "path": "/2/vod/channels/{channel}/logos",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
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
          "name": "height",
          "field": "body_height"
        },
        {
          "name": "margin_x",
          "field": "body_margin_x"
        },
        {
          "name": "margin_y",
          "field": "body_margin_y"
        },
        {
          "name": "mode",
          "field": "body_mode"
        },
        {
          "name": "position",
          "field": "body_position"
        },
        {
          "name": "size",
          "field": "body_size"
        },
        {
          "name": "width",
          "field": "body_width"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/vod/channels/{channel}/logos": {
      "method": "DELETE",
      "path": "/2/vod/channels/{channel}/logos",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/logos/{logo}": {
      "method": "GET",
      "path": "/2/vod/logos/{logo}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "logo",
          "field": "path_logo"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/vod/logos/{logo}": {
      "method": "PUT",
      "path": "/2/vod/logos/{logo}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "logo",
          "field": "path_logo"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "height",
          "field": "body_height"
        },
        {
          "name": "margin_x",
          "field": "body_margin_x"
        },
        {
          "name": "margin_y",
          "field": "body_margin_y"
        },
        {
          "name": "mode",
          "field": "body_mode"
        },
        {
          "name": "position",
          "field": "body_position"
        },
        {
          "name": "size",
          "field": "body_size"
        },
        {
          "name": "width",
          "field": "body_width"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/vod/logos/{logo}": {
      "method": "DELETE",
      "path": "/2/vod/logos/{logo}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "logo",
          "field": "path_logo"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > Media": {
    "GET /2/vod/channels/{channel}/media": {
      "method": "GET",
      "path": "/2/vod/channels/{channel}/media",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/channels/{channel}/media/status": {
      "method": "GET",
      "path": "/2/vod/channels/{channel}/media/status",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/media/{media}": {
      "method": "GET",
      "path": "/2/vod/media/{media}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/vod/media/{media}": {
      "method": "PUT",
      "path": "/2/vod/media/{media}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "configuration",
          "field": "body_configuration"
        },
        {
          "name": "description",
          "field": "body_description"
        },
        {
          "name": "destination",
          "field": "body_destination"
        },
        {
          "name": "language",
          "field": "body_language"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "password",
          "field": "body_password"
        },
        {
          "name": "published",
          "field": "body_published"
        },
        {
          "name": "validated",
          "field": "body_validated"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /2/vod/media/{media}/metadata": {
      "method": "GET",
      "path": "/2/vod/media/{media}/metadata",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/vod/media/{media}/metadata": {
      "method": "PUT",
      "path": "/2/vod/media/{media}/metadata",
      "pagination": "none",
      "pathParams": [
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "album",
          "field": "body_album"
        },
        {
          "name": "artist",
          "field": "body_artist"
        },
        {
          "name": "genre",
          "field": "body_genre"
        },
        {
          "name": "title",
          "field": "body_title"
        },
        {
          "name": "year",
          "field": "body_year"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/vod/media/{media}/metadata": {
      "method": "DELETE",
      "path": "/2/vod/media/{media}/metadata",
      "pagination": "none",
      "pathParams": [
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [
        {
          "name": "labels",
          "field": "query_labels"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/vod/media/{media}/shares": {
      "method": "POST",
      "path": "/2/vod/media/{media}/shares",
      "pagination": "none",
      "pathParams": [
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "comment",
          "field": "body_comment"
        },
        {
          "name": "encoding",
          "field": "body_encoding"
        },
        {
          "name": "player",
          "field": "body_player"
        },
        {
          "name": "player_settings",
          "field": "body_player_settings"
        },
        {
          "name": "timestamp",
          "field": "body_timestamp"
        },
        {
          "name": "validity",
          "field": "body_validity"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/vod/media/{media}/shares": {
      "method": "DELETE",
      "path": "/2/vod/media/{media}/shares",
      "pagination": "none",
      "pathParams": [
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/vod/media/{media}/suggest": {
      "method": "POST",
      "path": "/2/vod/media/{media}/suggest",
      "pagination": "none",
      "pathParams": [
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "media",
          "field": "body_media"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "PUT /2/vod/media/{media}/labels": {
      "method": "PUT",
      "path": "/2/vod/media/{media}/labels",
      "pagination": "none",
      "pathParams": [
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "labels",
          "field": "body_labels"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /2/vod/media/{media}/labels": {
      "method": "DELETE",
      "path": "/2/vod/media/{media}/labels",
      "pagination": "none",
      "pathParams": [
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [
        {
          "name": "labels",
          "field": "query_labels"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > Metadata": {
    "GET /2/vod/channels/{channel}/metadata": {
      "method": "GET",
      "path": "/2/vod/channels/{channel}/metadata",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/vod/channels/{channel}/metadata": {
      "method": "POST",
      "path": "/2/vod/channels/{channel}/metadata",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "folders",
          "field": "body_folders"
        },
        {
          "name": "media",
          "field": "body_media"
        },
        {
          "name": "metadata",
          "field": "body_metadata"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/vod/channels/{channel}/metadata": {
      "method": "DELETE",
      "path": "/2/vod/channels/{channel}/metadata",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "metadata",
          "field": "query_metadata"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/vod/metadata/{metadata}": {
      "method": "PUT",
      "path": "/2/vod/metadata/{metadata}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "metadata",
          "field": "path_metadata"
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
          "name": "options",
          "field": "body_options"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/vod/metadata/{metadata}": {
      "method": "DELETE",
      "path": "/2/vod/metadata/{metadata}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "metadata",
          "field": "path_metadata"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > Mixtape": {
    "GET /2/vod/channels/{channel}/mixtapes": {
      "method": "GET",
      "path": "/2/vod/channels/{channel}/mixtapes",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/vod/channels/{channel}/mixtapes": {
      "method": "POST",
      "path": "/2/vod/channels/{channel}/mixtapes",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
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
          "name": "criteria",
          "field": "body_criteria"
        },
        {
          "name": "description",
          "field": "body_description"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "order",
          "field": "body_order"
        },
        {
          "name": "validity",
          "field": "body_validity"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/vod/channels/{channel}/mixtapes": {
      "method": "DELETE",
      "path": "/2/vod/channels/{channel}/mixtapes",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "mixtapes",
          "field": "query_mixtapes"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/mixtapes/{mixtape}": {
      "method": "GET",
      "path": "/2/vod/mixtapes/{mixtape}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mixtape",
          "field": "path_mixtape"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/vod/mixtapes/{mixtape}": {
      "method": "PUT",
      "path": "/2/vod/mixtapes/{mixtape}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mixtape",
          "field": "path_mixtape"
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
          "name": "criteria",
          "field": "body_criteria"
        },
        {
          "name": "description",
          "field": "body_description"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "order",
          "field": "body_order"
        },
        {
          "name": "validity",
          "field": "body_validity"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/vod/mixtapes/{mixtape}": {
      "method": "DELETE",
      "path": "/2/vod/mixtapes/{mixtape}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mixtape",
          "field": "path_mixtape"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/mixtapes/{mixtape}/media": {
      "method": "GET",
      "path": "/2/vod/mixtapes/{mixtape}/media",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "mixtape",
          "field": "path_mixtape"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/vod/mixtapes/{mixtape}/media": {
      "method": "PUT",
      "path": "/2/vod/mixtapes/{mixtape}/media",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mixtape",
          "field": "path_mixtape"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "deep",
          "field": "body_deep"
        },
        {
          "name": "folders",
          "field": "body_folders"
        },
        {
          "name": "media",
          "field": "body_media"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/vod/mixtapes/{mixtape}/media": {
      "method": "DELETE",
      "path": "/2/vod/mixtapes/{mixtape}/media",
      "pagination": "none",
      "pathParams": [
        {
          "name": "mixtape",
          "field": "path_mixtape"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/vod/mixtapes/{mixtape}/media/{media}/move": {
      "method": "POST",
      "path": "/2/vod/mixtapes/{mixtape}/media/{media}/move",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "mixtape",
          "field": "path_mixtape"
        },
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "position",
          "field": "body_position"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > Player": {
    "GET /2/vod/channels/{channel}/players": {
      "method": "GET",
      "path": "/2/vod/channels/{channel}/players",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/vod/channels/{channel}/players": {
      "method": "POST",
      "path": "/2/vod/channels/{channel}/players",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "ads_category",
          "field": "body_ads_category"
        },
        {
          "name": "airplay",
          "field": "body_airplay"
        },
        {
          "name": "audio_volume",
          "field": "body_audio_volume"
        },
        {
          "name": "auto_hide_controls",
          "field": "body_auto_hide_controls"
        },
        {
          "name": "auto_start",
          "field": "body_auto_start"
        },
        {
          "name": "chromecast",
          "field": "body_chromecast"
        },
        {
          "name": "control_active_color",
          "field": "body_control_active_color"
        },
        {
          "name": "control_color",
          "field": "body_control_color"
        },
        {
          "name": "controlbar_color",
          "field": "body_controlbar_color"
        },
        {
          "name": "default",
          "field": "body_default"
        },
        {
          "name": "default_speed",
          "field": "body_default_speed"
        },
        {
          "name": "description",
          "field": "body_description"
        },
        {
          "name": "enable_embed_code",
          "field": "body_enable_embed_code"
        },
        {
          "name": "enable_facebook",
          "field": "body_enable_facebook"
        },
        {
          "name": "enable_linkedin",
          "field": "body_enable_linkedin"
        },
        {
          "name": "enable_twitter",
          "field": "body_enable_twitter"
        },
        {
          "name": "enable_whatsapp",
          "field": "body_enable_whatsapp"
        },
        {
          "name": "encoding_change_enabled",
          "field": "body_encoding_change_enabled"
        },
        {
          "name": "encoding_limit",
          "field": "body_encoding_limit"
        },
        {
          "name": "facebook_back_link",
          "field": "body_facebook_back_link"
        },
        {
          "name": "force_media_ratio",
          "field": "body_force_media_ratio"
        },
        {
          "name": "force_subtitles_activated",
          "field": "body_force_subtitles_activated"
        },
        {
          "name": "force_subtitles_type",
          "field": "body_force_subtitles_type"
        },
        {
          "name": "geoip_image",
          "field": "body_geoip_image"
        },
        {
          "name": "has_logo",
          "field": "body_has_logo"
        },
        {
          "name": "height",
          "field": "body_height"
        },
        {
          "name": "interrupt_image",
          "field": "body_interrupt_image"
        },
        {
          "name": "is360",
          "field": "body_is360"
        },
        {
          "name": "is_default",
          "field": "body_is_default"
        },
        {
          "name": "logo_anchor",
          "field": "body_logo_anchor"
        },
        {
          "name": "logo_image",
          "field": "body_logo_image"
        },
        {
          "name": "logo_margin_horizontal",
          "field": "body_logo_margin_horizontal"
        },
        {
          "name": "logo_margin_vertical",
          "field": "body_logo_margin_vertical"
        },
        {
          "name": "logo_percentage",
          "field": "body_logo_percentage"
        },
        {
          "name": "media_thumbnail_anchor",
          "field": "body_media_thumbnail_anchor"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "player_end_screen_type",
          "field": "body_player_end_screen_type"
        },
        {
          "name": "preferred_playback_strategy",
          "field": "body_preferred_playback_strategy"
        },
        {
          "name": "preferred_playback_strategy_activated",
          "field": "body_preferred_playback_strategy_activated"
        },
        {
          "name": "preload_image",
          "field": "body_preload_image"
        },
        {
          "name": "restrict_image",
          "field": "body_restrict_image"
        },
        {
          "name": "show_audio",
          "field": "body_show_audio"
        },
        {
          "name": "show_controls",
          "field": "body_show_controls"
        },
        {
          "name": "show_default_logo",
          "field": "body_show_default_logo"
        },
        {
          "name": "show_download",
          "field": "body_show_download"
        },
        {
          "name": "show_duration",
          "field": "body_show_duration"
        },
        {
          "name": "show_fullscreen",
          "field": "body_show_fullscreen"
        },
        {
          "name": "show_loop",
          "field": "body_show_loop"
        },
        {
          "name": "show_media_info",
          "field": "body_show_media_info"
        },
        {
          "name": "show_media_thumbnail",
          "field": "body_show_media_thumbnail"
        },
        {
          "name": "show_progression",
          "field": "body_show_progression"
        },
        {
          "name": "show_related",
          "field": "body_show_related"
        },
        {
          "name": "show_replay",
          "field": "body_show_replay"
        },
        {
          "name": "show_speed",
          "field": "body_show_speed"
        },
        {
          "name": "show_suggestions",
          "field": "body_show_suggestions"
        },
        {
          "name": "show_viewers",
          "field": "body_show_viewers"
        },
        {
          "name": "show_viewers_after",
          "field": "body_show_viewers_after"
        },
        {
          "name": "show_viewers_only_after",
          "field": "body_show_viewers_only_after"
        },
        {
          "name": "skip_intro_activated",
          "field": "body_skip_intro_activated"
        },
        {
          "name": "skip_intro_to",
          "field": "body_skip_intro_to"
        },
        {
          "name": "suggestions",
          "field": "body_suggestions"
        },
        {
          "name": "theme",
          "field": "body_theme"
        },
        {
          "name": "theme_activated",
          "field": "body_theme_activated"
        },
        {
          "name": "time_before_hide_cb",
          "field": "body_time_before_hide_cb"
        },
        {
          "name": "time_skip_mode",
          "field": "body_time_skip_mode"
        },
        {
          "name": "twitter_back_link",
          "field": "body_twitter_back_link"
        },
        {
          "name": "twitter_related",
          "field": "body_twitter_related"
        },
        {
          "name": "twitter_via",
          "field": "body_twitter_via"
        },
        {
          "name": "width",
          "field": "body_width"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/vod/channels/{channel}/players": {
      "method": "DELETE",
      "path": "/2/vod/channels/{channel}/players",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "players",
          "field": "query_players"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/players/{player}": {
      "method": "GET",
      "path": "/2/vod/players/{player}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "player",
          "field": "path_player"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/vod/players/{player}": {
      "method": "PUT",
      "path": "/2/vod/players/{player}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "player",
          "field": "path_player"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "ads_category",
          "field": "body_ads_category"
        },
        {
          "name": "airplay",
          "field": "body_airplay"
        },
        {
          "name": "audio_volume",
          "field": "body_audio_volume"
        },
        {
          "name": "auto_hide_controls",
          "field": "body_auto_hide_controls"
        },
        {
          "name": "auto_start",
          "field": "body_auto_start"
        },
        {
          "name": "chromecast",
          "field": "body_chromecast"
        },
        {
          "name": "control_active_color",
          "field": "body_control_active_color"
        },
        {
          "name": "control_color",
          "field": "body_control_color"
        },
        {
          "name": "controlbar_color",
          "field": "body_controlbar_color"
        },
        {
          "name": "default",
          "field": "body_default"
        },
        {
          "name": "default_speed",
          "field": "body_default_speed"
        },
        {
          "name": "description",
          "field": "body_description"
        },
        {
          "name": "enable_embed_code",
          "field": "body_enable_embed_code"
        },
        {
          "name": "enable_facebook",
          "field": "body_enable_facebook"
        },
        {
          "name": "enable_linkedin",
          "field": "body_enable_linkedin"
        },
        {
          "name": "enable_twitter",
          "field": "body_enable_twitter"
        },
        {
          "name": "enable_whatsapp",
          "field": "body_enable_whatsapp"
        },
        {
          "name": "encoding_change_enabled",
          "field": "body_encoding_change_enabled"
        },
        {
          "name": "encoding_limit",
          "field": "body_encoding_limit"
        },
        {
          "name": "facebook_back_link",
          "field": "body_facebook_back_link"
        },
        {
          "name": "force_media_ratio",
          "field": "body_force_media_ratio"
        },
        {
          "name": "force_subtitles_activated",
          "field": "body_force_subtitles_activated"
        },
        {
          "name": "force_subtitles_type",
          "field": "body_force_subtitles_type"
        },
        {
          "name": "geoip_image",
          "field": "body_geoip_image"
        },
        {
          "name": "has_logo",
          "field": "body_has_logo"
        },
        {
          "name": "height",
          "field": "body_height"
        },
        {
          "name": "interrupt_image",
          "field": "body_interrupt_image"
        },
        {
          "name": "is360",
          "field": "body_is360"
        },
        {
          "name": "is_default",
          "field": "body_is_default"
        },
        {
          "name": "logo_anchor",
          "field": "body_logo_anchor"
        },
        {
          "name": "logo_image",
          "field": "body_logo_image"
        },
        {
          "name": "logo_margin_horizontal",
          "field": "body_logo_margin_horizontal"
        },
        {
          "name": "logo_margin_vertical",
          "field": "body_logo_margin_vertical"
        },
        {
          "name": "logo_percentage",
          "field": "body_logo_percentage"
        },
        {
          "name": "media_thumbnail_anchor",
          "field": "body_media_thumbnail_anchor"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "player_end_screen_type",
          "field": "body_player_end_screen_type"
        },
        {
          "name": "preferred_playback_strategy",
          "field": "body_preferred_playback_strategy"
        },
        {
          "name": "preferred_playback_strategy_activated",
          "field": "body_preferred_playback_strategy_activated"
        },
        {
          "name": "preload_image",
          "field": "body_preload_image"
        },
        {
          "name": "restrict_image",
          "field": "body_restrict_image"
        },
        {
          "name": "show_audio",
          "field": "body_show_audio"
        },
        {
          "name": "show_controls",
          "field": "body_show_controls"
        },
        {
          "name": "show_default_logo",
          "field": "body_show_default_logo"
        },
        {
          "name": "show_download",
          "field": "body_show_download"
        },
        {
          "name": "show_duration",
          "field": "body_show_duration"
        },
        {
          "name": "show_fullscreen",
          "field": "body_show_fullscreen"
        },
        {
          "name": "show_loop",
          "field": "body_show_loop"
        },
        {
          "name": "show_media_info",
          "field": "body_show_media_info"
        },
        {
          "name": "show_media_thumbnail",
          "field": "body_show_media_thumbnail"
        },
        {
          "name": "show_progression",
          "field": "body_show_progression"
        },
        {
          "name": "show_related",
          "field": "body_show_related"
        },
        {
          "name": "show_replay",
          "field": "body_show_replay"
        },
        {
          "name": "show_speed",
          "field": "body_show_speed"
        },
        {
          "name": "show_suggestions",
          "field": "body_show_suggestions"
        },
        {
          "name": "show_viewers",
          "field": "body_show_viewers"
        },
        {
          "name": "show_viewers_after",
          "field": "body_show_viewers_after"
        },
        {
          "name": "show_viewers_only_after",
          "field": "body_show_viewers_only_after"
        },
        {
          "name": "skip_intro_activated",
          "field": "body_skip_intro_activated"
        },
        {
          "name": "skip_intro_to",
          "field": "body_skip_intro_to"
        },
        {
          "name": "suggestions",
          "field": "body_suggestions"
        },
        {
          "name": "theme",
          "field": "body_theme"
        },
        {
          "name": "theme_activated",
          "field": "body_theme_activated"
        },
        {
          "name": "time_before_hide_cb",
          "field": "body_time_before_hide_cb"
        },
        {
          "name": "time_skip_mode",
          "field": "body_time_skip_mode"
        },
        {
          "name": "twitter_back_link",
          "field": "body_twitter_back_link"
        },
        {
          "name": "twitter_related",
          "field": "body_twitter_related"
        },
        {
          "name": "twitter_via",
          "field": "body_twitter_via"
        },
        {
          "name": "width",
          "field": "body_width"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/vod/players/{player}": {
      "method": "DELETE",
      "path": "/2/vod/players/{player}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "player",
          "field": "path_player"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > Playlist": {
    "GET /2/vod/channels/{channel}/playlists": {
      "method": "GET",
      "path": "/2/vod/channels/{channel}/playlists",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/playlists/{playlist}/media": {
      "method": "GET",
      "path": "/2/vod/playlists/{playlist}/media",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "playlist",
          "field": "path_playlist"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/playlists/{playlist}": {
      "method": "GET",
      "path": "/2/vod/playlists/{playlist}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "playlist",
          "field": "path_playlist"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > Reflect": {
    "GET /2/vod/reflect/endpoints/v{version}/{endpoint?}": {
      "method": "GET",
      "path": "/2/vod/reflect/endpoints/v{version}/{endpoint?}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "version",
          "field": "path_version"
        },
        {
          "name": "endpoint",
          "field": "path_endpoint"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/vod/reflect/endpoints/v{version}/{endpoint}": {
      "method": "POST",
      "path": "/2/vod/reflect/endpoints/v{version}/{endpoint}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "version",
          "field": "path_version"
        },
        {
          "name": "endpoint",
          "field": "path_endpoint"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > Resources": {
    "GET /2/vod/res/media/{media}": {
      "method": "GET",
      "path": "/2/vod/res/media/{media}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/res/thumbnails/{thumbnail}.{format}": {
      "method": "GET",
      "path": "/2/vod/res/thumbnails/{thumbnail}.{format}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "thumbnail",
          "field": "path_thumbnail"
        },
        {
          "name": "format",
          "field": "path_format"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/res/playlists/{playlist}.{format}": {
      "method": "GET",
      "path": "/2/vod/res/playlists/{playlist}.{format}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "playlist",
          "field": "path_playlist"
        },
        {
          "name": "format",
          "field": "path_format"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/res/shares/{share}.{image}.{format}": {
      "method": "GET",
      "path": "/2/vod/res/shares/{share}.{image}.{format}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "share",
          "field": "path_share"
        },
        {
          "name": "image",
          "field": "path_image"
        },
        {
          "name": "format",
          "field": "path_format"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/res/shares/{share}.{format?}": {
      "method": "GET",
      "path": "/2/vod/res/shares/{share}.{format?}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "share",
          "field": "path_share"
        },
        {
          "name": "format",
          "field": "path_format"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/res/players/{player}.{image}.{format}": {
      "method": "GET",
      "path": "/2/vod/res/players/{player}.{image}.{format}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "player",
          "field": "path_player"
        },
        {
          "name": "image",
          "field": "path_image"
        },
        {
          "name": "format",
          "field": "path_format"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/res/logos/{logo}.{format}": {
      "method": "GET",
      "path": "/2/vod/res/logos/{logo}.{format}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "logo",
          "field": "path_logo"
        },
        {
          "name": "format",
          "field": "path_format"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/res/media/{media}/chapters.{format}": {
      "method": "GET",
      "path": "/2/vod/res/media/{media}/chapters.{format}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "media",
          "field": "path_media"
        },
        {
          "name": "format",
          "field": "path_format"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/res/chapters/{chapter}.{format}": {
      "method": "GET",
      "path": "/2/vod/res/chapters/{chapter}.{format}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "chapter",
          "field": "path_chapter"
        },
        {
          "name": "format",
          "field": "path_format"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/res/subtitles/{subtitle}.{format}": {
      "method": "GET",
      "path": "/2/vod/res/subtitles/{subtitle}.{format}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "subtitle",
          "field": "path_subtitle"
        },
        {
          "name": "format",
          "field": "path_format"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/res/suggestions/{target}": {
      "method": "GET",
      "path": "/2/vod/res/suggestions/{target}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "target",
          "field": "path_target"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > Share": {
    "GET /2/vod/channels/{channel}/shares": {
      "method": "GET",
      "path": "/2/vod/channels/{channel}/shares",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "DELETE /2/vod/channels/{channel}/shares": {
      "method": "DELETE",
      "path": "/2/vod/channels/{channel}/shares",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/media/{media}/shares": {
      "method": "GET",
      "path": "/2/vod/media/{media}/shares",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/shares/{share}": {
      "method": "GET",
      "path": "/2/vod/shares/{share}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "share",
          "field": "path_share"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/vod/shares/{share}": {
      "method": "PUT",
      "path": "/2/vod/shares/{share}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "share",
          "field": "path_share"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "comment",
          "field": "body_comment"
        },
        {
          "name": "encoding",
          "field": "body_encoding"
        },
        {
          "name": "player",
          "field": "body_player"
        },
        {
          "name": "player_settings",
          "field": "body_player_settings"
        },
        {
          "name": "timestamp",
          "field": "body_timestamp"
        },
        {
          "name": "validity",
          "field": "body_validity"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/vod/shares/{share}": {
      "method": "DELETE",
      "path": "/2/vod/shares/{share}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "share",
          "field": "path_share"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > Statistics": {
    "GET /2/vod/statistics/{channel}/media/top": {
      "method": "GET",
      "path": "/2/vod/statistics/{channel}/media/top",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/statistics/{channel}/media/unique_viewers": {
      "method": "GET",
      "path": "/2/vod/statistics/{channel}/media/unique_viewers",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "media",
          "field": "query_media"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/statistics/{channel}/media/viewers": {
      "method": "GET",
      "path": "/2/vod/statistics/{channel}/media/viewers",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "media",
          "field": "query_media"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/statistics/{subject}/consumption": {
      "method": "GET",
      "path": "/2/vod/statistics/{subject}/consumption",
      "pagination": "none",
      "pathParams": [
        {
          "name": "subject",
          "field": "path_subject"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/statistics/{subject}/view_time": {
      "method": "GET",
      "path": "/2/vod/statistics/{subject}/view_time",
      "pagination": "none",
      "pathParams": [
        {
          "name": "subject",
          "field": "path_subject"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/statistics/{subject}/viewers": {
      "method": "GET",
      "path": "/2/vod/statistics/{subject}/viewers",
      "pagination": "none",
      "pathParams": [
        {
          "name": "subject",
          "field": "path_subject"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/statistics/{subject}/unique_viewers": {
      "method": "GET",
      "path": "/2/vod/statistics/{subject}/unique_viewers",
      "pagination": "none",
      "pathParams": [
        {
          "name": "subject",
          "field": "path_subject"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/statistics/{subject}/average_view_time": {
      "method": "GET",
      "path": "/2/vod/statistics/{subject}/average_view_time",
      "pagination": "none",
      "pathParams": [
        {
          "name": "subject",
          "field": "path_subject"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/statistics/{subject}/histogram/encodings": {
      "method": "GET",
      "path": "/2/vod/statistics/{subject}/histogram/encodings",
      "pagination": "none",
      "pathParams": [
        {
          "name": "subject",
          "field": "path_subject"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/statistics/{subject}/histogram/viewers": {
      "method": "GET",
      "path": "/2/vod/statistics/{subject}/histogram/viewers",
      "pagination": "none",
      "pathParams": [
        {
          "name": "subject",
          "field": "path_subject"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/statistics/{subject}/browsers": {
      "method": "GET",
      "path": "/2/vod/statistics/{subject}/browsers",
      "pagination": "none",
      "pathParams": [
        {
          "name": "subject",
          "field": "path_subject"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/statistics/{subject}/cities": {
      "method": "GET",
      "path": "/2/vod/statistics/{subject}/cities",
      "pagination": "none",
      "pathParams": [
        {
          "name": "subject",
          "field": "path_subject"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/statistics/{subject}/countries": {
      "method": "GET",
      "path": "/2/vod/statistics/{subject}/countries",
      "pagination": "none",
      "pathParams": [
        {
          "name": "subject",
          "field": "path_subject"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/statistics/{subject}/operating_systems": {
      "method": "GET",
      "path": "/2/vod/statistics/{subject}/operating_systems",
      "pagination": "none",
      "pathParams": [
        {
          "name": "subject",
          "field": "path_subject"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/statistics/{subject}/playbacks": {
      "method": "GET",
      "path": "/2/vod/statistics/{subject}/playbacks",
      "pagination": "none",
      "pathParams": [
        {
          "name": "subject",
          "field": "path_subject"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/statistics/{subject}/players": {
      "method": "GET",
      "path": "/2/vod/statistics/{subject}/players",
      "pagination": "none",
      "pathParams": [
        {
          "name": "subject",
          "field": "path_subject"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/statistics/{subject}/clusters": {
      "method": "GET",
      "path": "/2/vod/statistics/{subject}/clusters",
      "pagination": "none",
      "pathParams": [
        {
          "name": "subject",
          "field": "path_subject"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/statistics/{subject}/viewers_per_encoding": {
      "method": "GET",
      "path": "/2/vod/statistics/{subject}/viewers_per_encoding",
      "pagination": "none",
      "pathParams": [
        {
          "name": "subject",
          "field": "path_subject"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/statistics/{subject}/consumed_time_per_ip": {
      "method": "GET",
      "path": "/2/vod/statistics/{subject}/consumed_time_per_ip",
      "pagination": "none",
      "pathParams": [
        {
          "name": "subject",
          "field": "path_subject"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/statistics/{subject}/consumed_time_per_encoding": {
      "method": "GET",
      "path": "/2/vod/statistics/{subject}/consumed_time_per_encoding",
      "pagination": "none",
      "pathParams": [
        {
          "name": "subject",
          "field": "path_subject"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > Subtitle": {
    "GET /2/vod/media/{media}/subtitles": {
      "method": "GET",
      "path": "/2/vod/media/{media}/subtitles",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/vod/media/{media}/subtitles": {
      "method": "POST",
      "path": "/2/vod/media/{media}/subtitles",
      "pagination": "none",
      "pathParams": [
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "default",
          "field": "body_default"
        },
        {
          "name": "file",
          "field": "body_file"
        },
        {
          "name": "language",
          "field": "body_language"
        },
        {
          "name": "lines",
          "field": "body_lines"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "published",
          "field": "body_published"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/vod/media/{media}/subtitles": {
      "method": "DELETE",
      "path": "/2/vod/media/{media}/subtitles",
      "pagination": "none",
      "pathParams": [
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [
        {
          "name": "subtitles",
          "field": "query_subtitles"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/subtitles/{subtitle}": {
      "method": "GET",
      "path": "/2/vod/subtitles/{subtitle}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "subtitle",
          "field": "path_subtitle"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "PUT /2/vod/subtitles/{subtitle}": {
      "method": "PUT",
      "path": "/2/vod/subtitles/{subtitle}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "subtitle",
          "field": "path_subtitle"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "default",
          "field": "body_default"
        },
        {
          "name": "lines",
          "field": "body_lines"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "published",
          "field": "body_published"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /2/vod/subtitles/{subtitle}": {
      "method": "DELETE",
      "path": "/2/vod/subtitles/{subtitle}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "subtitle",
          "field": "path_subtitle"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > Thumbnail": {
    "GET /2/vod/media/{media}/thumbnails": {
      "method": "GET",
      "path": "/2/vod/media/{media}/thumbnails",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "media",
          "field": "path_media"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "GET /2/vod/thumbnails/{thumbnail}": {
      "method": "GET",
      "path": "/2/vod/thumbnails/{thumbnail}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "thumbnail",
          "field": "path_thumbnail"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "V3 > Upload": {
    "GET /2/vod/folders/{folder}/upload/endpoint": {
      "method": "GET",
      "path": "/2/vod/folders/{folder}/upload/endpoint",
      "pagination": "none",
      "pathParams": [
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "POST /2/vod/folders/{folder}/upload": {
      "method": "POST",
      "path": "/2/vod/folders/{folder}/upload",
      "pagination": "none",
      "pathParams": [
        {
          "name": "folder",
          "field": "path_folder"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "description",
          "field": "body_description"
        },
        {
          "name": "duration",
          "field": "body_duration"
        },
        {
          "name": "file",
          "field": "body_file"
        },
        {
          "name": "from",
          "field": "body_from"
        },
        {
          "name": "media",
          "field": "body_media"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "url",
          "field": "body_url"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  }
};

export class InfomaniakVod implements INodeType {
	description: INodeTypeDescription = {
  "displayName": "Infomaniak Vod",
  "name": "infomaniakVod",
  "icon": "file:../../icons/vod.svg",
  "group": [
    "output"
  ],
  "version": 1,
  "description": "Interact with Infomaniak Vod API",
  "defaults": {
    "name": "Infomaniak Vod"
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
          "name": "General",
          "value": "General"
        },
        {
          "name": "V2 > Browse",
          "value": "V2 > Browse"
        },
        {
          "name": "V2 > Channel",
          "value": "V2 > Channel"
        },
        {
          "name": "V2 > Playlist",
          "value": "V2 > Playlist"
        },
        {
          "name": "V2 > Subtitles",
          "value": "V2 > Subtitles"
        },
        {
          "name": "V2 > User Activity",
          "value": "V2 > UserActivity"
        },
        {
          "name": "V3 > Ad",
          "value": "V3 > Ad"
        },
        {
          "name": "V3 > Alert",
          "value": "V3 > Alert"
        },
        {
          "name": "V3 > Callback",
          "value": "V3 > Callback"
        },
        {
          "name": "V3 > Category",
          "value": "V3 > Category"
        },
        {
          "name": "V3 > Channel",
          "value": "V3 > Channel"
        },
        {
          "name": "V3 > Chapter",
          "value": "V3 > Chapter"
        },
        {
          "name": "V3 > Country",
          "value": "V3 > Country"
        },
        {
          "name": "V3 > Encoding",
          "value": "V3 > Encoding"
        },
        {
          "name": "V3 > Filesystem",
          "value": "V3 > Filesystem"
        },
        {
          "name": "V3 > Folder",
          "value": "V3 > Folder"
        },
        {
          "name": "V3 > Ftp",
          "value": "V3 > Ftp"
        },
        {
          "name": "V3 > Journal",
          "value": "V3 > Journal"
        },
        {
          "name": "V3 > Label",
          "value": "V3 > Label"
        },
        {
          "name": "V3 > Language",
          "value": "V3 > Language"
        },
        {
          "name": "V3 > Linked Svc",
          "value": "V3 > LinkedSvc"
        },
        {
          "name": "V3 > Logo",
          "value": "V3 > Logo"
        },
        {
          "name": "V3 > Media",
          "value": "V3 > Media"
        },
        {
          "name": "V3 > Metadata",
          "value": "V3 > Metadata"
        },
        {
          "name": "V3 > Mixtape",
          "value": "V3 > Mixtape"
        },
        {
          "name": "V3 > Player",
          "value": "V3 > Player"
        },
        {
          "name": "V3 > Playlist",
          "value": "V3 > Playlist"
        },
        {
          "name": "V3 > Reflect",
          "value": "V3 > Reflect"
        },
        {
          "name": "V3 > Resources",
          "value": "V3 > Resources"
        },
        {
          "name": "V3 > Share",
          "value": "V3 > Share"
        },
        {
          "name": "V3 > Statistics",
          "value": "V3 > Statistics"
        },
        {
          "name": "V3 > Subtitle",
          "value": "V3 > Subtitle"
        },
        {
          "name": "V3 > Thumbnail",
          "value": "V3 > Thumbnail"
        },
        {
          "name": "V3 > Upload",
          "value": "V3 > Upload"
        }
      ],
      "default": "General",
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
            "General"
          ]
        }
      },
      "options": [
        {
          "name": "List Channels",
          "value": "GET /1/vod/channel"
        },
        {
          "name": "Returns The Disk Usage (in Bytes) For The Given Channel.",
          "value": "GET /1/vod/channel/{channel}/disk-usage"
        },
        {
          "name": "Returns The Media Poster.",
          "value": "GET /1/vod/channel/{channel}/media/{media}/thumbnail"
        },
        {
          "name": "Replaces The Thumbnail & Poster For A Given Media",
          "value": "POST /1/vod/channel/{channel}/media/{media}/thumbnail"
        },
        {
          "name": "Lists All Children Of The Channel's Root Folder.",
          "value": "GET /1/vod/channel/{channel}/browse"
        },
        {
          "name": "Moves One Or Many Medias/folders To Trash.",
          "value": "DELETE /1/vod/channel/{channel}/browse"
        },
        {
          "name": "Duplicates One Or Many Medias/folders To A Given Folder.",
          "value": "POST /1/vod/channel/{channel}/browse/copy"
        },
        {
          "name": "Moves One Or Many Medias/folders To A Given Folder.",
          "value": "POST /1/vod/channel/{channel}/browse/move"
        },
        {
          "name": "Lists All Medias/folders In Trash.",
          "value": "GET /1/vod/channel/{channel}/browse/trash"
        },
        {
          "name": "Deletes One Or Many Medias/folders From Trash, Permanently.",
          "value": "DELETE /1/vod/channel/{channel}/browse/trash"
        },
        {
          "name": "Deletes A Media/folder From Trash, Permanently.",
          "value": "DELETE /1/vod/channel/{channel}/browse/trash/{file}"
        },
        {
          "name": "Restores A Media/folder From Trash To Its Original Location.",
          "value": "POST /1/vod/channel/{channel}/browse/trash/{file}/restore"
        },
        {
          "name": "Returns The Tree Of The Folder With All Its Children, Recursively.",
          "value": "GET /1/vod/channel/{channel}/browse/tree"
        },
        {
          "name": "Returns The Breadcrumb Of The Media/folder Up To Root Ancestor.",
          "value": "GET /1/vod/channel/{channel}/browse/breadcrumb"
        },
        {
          "name": "Returns The Breadcrumb Of The Media/folder Up To Root Ancestor.",
          "value": "GET /1/vod/channel/{channel}/browse/{file}/breadcrumb"
        },
        {
          "name": "Updates One Or Many Medias/folders.",
          "value": "PUT /1/vod/channel/{channel}/browse/update"
        },
        {
          "name": "Lists All Children Of A Given Folder.",
          "value": "GET /1/vod/channel/{channel}/browse/{file}"
        },
        {
          "name": "Updates A Media/folder.",
          "value": "PUT /1/vod/channel/{channel}/browse/{file}"
        },
        {
          "name": "Moves A Media/folder To Trash.",
          "value": "DELETE /1/vod/channel/{channel}/browse/{file}"
        },
        {
          "name": "Returns The Tree Of The Folder With All Its Children, Recursively.",
          "value": "GET /1/vod/channel/{channel}/browse/{file}/tree"
        },
        {
          "name": "Duplicates A Media/folder To A Given Folder.",
          "value": "POST /1/vod/channel/{channel}/browse/{file}/copy"
        },
        {
          "name": "Moves A Media/folder To A Given Folder.",
          "value": "POST /1/vod/channel/{channel}/browse/{file}/move"
        },
        {
          "name": "Lists All Callback Logs.",
          "value": "GET /1/vod/channel/{channel}/callback/log"
        },
        {
          "name": "Deletes One Or Many Callback Logs.",
          "value": "DELETE /1/vod/channel/{channel}/callback/log"
        },
        {
          "name": "Returns A Callback Log.",
          "value": "GET /1/vod/channel/{channel}/callback/log/{callbackLog}"
        },
        {
          "name": "Deletes A Callback Log.",
          "value": "DELETE /1/vod/channel/{channel}/callback/log/{callbackLog}"
        },
        {
          "name": "Lists All Callbacks.",
          "value": "GET /1/vod/channel/{channel}/callback"
        },
        {
          "name": "Creates A New Callback.",
          "value": "POST /1/vod/channel/{channel}/callback"
        },
        {
          "name": "Updates One Or Many Callbacks.",
          "value": "PUT /1/vod/channel/{channel}/callback"
        },
        {
          "name": "Deletes One Or Many Callbacks.",
          "value": "DELETE /1/vod/channel/{channel}/callback"
        },
        {
          "name": "Returns A Callback.",
          "value": "GET /1/vod/channel/{channel}/callback/{callback}"
        },
        {
          "name": "Updates A Callback.",
          "value": "PUT /1/vod/channel/{channel}/callback/{callback}"
        },
        {
          "name": "Deletes A Callback.",
          "value": "DELETE /1/vod/channel/{channel}/callback/{callback}"
        },
        {
          "name": "Lists All Event.",
          "value": "GET /1/vod/channel/{channel}/journal"
        },
        {
          "name": "Lists All Encodings.",
          "value": "GET /1/vod/channel/{channel}/encoding"
        },
        {
          "name": "Creates A New Encoding.",
          "value": "POST /1/vod/channel/{channel}/encoding"
        },
        {
          "name": "Deletes One Or Many Players.",
          "value": "DELETE /1/vod/channel/{channel}/encoding"
        },
        {
          "name": "Returns An Encoding.",
          "value": "GET /1/vod/channel/{channel}/encoding/{encoding}"
        },
        {
          "name": "Updates An Encoding.",
          "value": "PUT /1/vod/channel/{channel}/encoding/{encoding}"
        },
        {
          "name": "Deletes An Encoding.",
          "value": "DELETE /1/vod/channel/{channel}/encoding/{encoding}"
        },
        {
          "name": "List Logos",
          "value": "GET /1/vod/channel/{channel}/logo"
        },
        {
          "name": "Create A Logo",
          "value": "POST /1/vod/channel/{channel}/logo"
        },
        {
          "name": "Deletes Logos",
          "value": "DELETE /1/vod/channel/{channel}/logo"
        },
        {
          "name": "Detach Logo",
          "value": "POST /1/vod/channel/{channel}/logo/detach"
        },
        {
          "name": "Display Logo",
          "value": "GET /1/vod/channel/{channel}/logo/{logo}"
        },
        {
          "name": "Updates Logo",
          "value": "PUT /1/vod/channel/{channel}/logo/{logo}"
        },
        {
          "name": "Delete Logo",
          "value": "DELETE /1/vod/channel/{channel}/logo/{logo}"
        },
        {
          "name": "Sets A Logo Either For Media Or Folders",
          "value": "POST /1/vod/channel/{channel}/logo/{logo}/attach"
        },
        {
          "name": "List All Folders.",
          "value": "GET /1/vod/channel/{channel}/folder"
        },
        {
          "name": "Creates A New Folder In The Channel's Root Folder.",
          "value": "POST /1/vod/channel/{channel}/folder"
        },
        {
          "name": "Adds One Or Many Given Encodings To A Folder.",
          "value": "POST /1/vod/channel/{channel}/folder/{folder}/encoding"
        },
        {
          "name": "Remove Encodings From Folder",
          "value": "DELETE /1/vod/channel/{channel}/folder/{folder}/encoding"
        },
        {
          "name": "Appends An Encoding To A Folder.",
          "value": "POST /1/vod/channel/{channel}/folder/{folder}/encoding/{encoding}"
        },
        {
          "name": "Removes An Encoding From A Folder.",
          "value": "DELETE /1/vod/channel/{channel}/folder/{folder}/encoding/{encoding}"
        },
        {
          "name": "Add Logo To A Folder",
          "value": "POST /1/vod/channel/{channel}/folder/{folder}/logo/{logo}"
        },
        {
          "name": "Delete Logo",
          "value": "DELETE /1/vod/channel/{channel}/folder/{folder}/logo"
        },
        {
          "name": "Returns The Channel's Root Folder.",
          "value": "GET /1/vod/channel/{channel}/folder/root"
        },
        {
          "name": "Returns A Folder.",
          "value": "GET /1/vod/channel/{channel}/folder/{folder}"
        },
        {
          "name": "Creates A New Folder In The Parent Folder.",
          "value": "POST /1/vod/channel/{channel}/folder/{folder}"
        },
        {
          "name": "Updates A Folder.",
          "value": "PUT /1/vod/channel/{channel}/folder/{folder}"
        },
        {
          "name": "Deletes A Folder With All Its Children, Recursively.",
          "value": "DELETE /1/vod/channel/{channel}/folder/{folder}"
        },
        {
          "name": "Lists All Playlists Having A Given Folder Attached.",
          "value": "GET /1/vod/channel/{channel}/folder/{folder}/playlist"
        },
        {
          "name": "Lists All FTP Users.",
          "value": "GET /1/vod/channel/{channel}/ftp/user"
        },
        {
          "name": "Creates A New FTP User.",
          "value": "POST /1/vod/channel/{channel}/ftp/user"
        },
        {
          "name": "Returns A FTP User.",
          "value": "GET /1/vod/channel/{channel}/ftp/user/{ftpUser}"
        },
        {
          "name": "Updates A FTP User.",
          "value": "PUT /1/vod/channel/{channel}/ftp/user/{ftpUser}"
        },
        {
          "name": "Deletes A FTP User.",
          "value": "DELETE /1/vod/channel/{channel}/ftp/user/{ftpUser}"
        },
        {
          "name": "Lists All Medias.",
          "value": "GET /1/vod/channel/{channel}/media"
        },
        {
          "name": "Updates One Or Many Medias.",
          "value": "PUT /1/vod/channel/{channel}/media"
        },
        {
          "name": "Returns A Media.",
          "value": "GET /1/vod/channel/{channel}/media/{media}"
        },
        {
          "name": "Updates A Media.",
          "value": "PUT /1/vod/channel/{channel}/media/{media}"
        },
        {
          "name": "Deletes A Media.",
          "value": "DELETE /1/vod/channel/{channel}/media/{media}"
        },
        {
          "name": "Lists All Chapters Of A Given Media.",
          "value": "GET /1/vod/channel/{channel}/media/{media}/chapter"
        },
        {
          "name": "Creates A New Chapter To A Given Media.",
          "value": "POST /1/vod/channel/{channel}/media/{media}/chapter"
        },
        {
          "name": "Updates One Or Many Chapters.",
          "value": "PUT /1/vod/channel/{channel}/media/{media}/chapter"
        },
        {
          "name": "Deletes One Or Many Chapters.",
          "value": "DELETE /1/vod/channel/{channel}/media/{media}/chapter"
        },
        {
          "name": "Returns A Chapter.",
          "value": "GET /1/vod/channel/{channel}/media/{media}/chapter/{chapter}"
        },
        {
          "name": "Updates A Chapter.",
          "value": "PUT /1/vod/channel/{channel}/media/{media}/chapter/{chapter}"
        },
        {
          "name": "Deletes A Chapter.",
          "value": "DELETE /1/vod/channel/{channel}/media/{media}/chapter/{chapter}"
        },
        {
          "name": "List Media Cuts",
          "value": "GET /1/vod/channel/{channel}/media/{media}/cut"
        },
        {
          "name": "Cut A Media",
          "value": "POST /1/vod/channel/{channel}/media/{media}/cut"
        },
        {
          "name": "Get New More Precise Waveform ( For Medias Older Than 2024, Async Job )",
          "value": "POST /1/vod/channel/{channel}/media/{media}/waveform"
        },
        {
          "name": "Get New Thumbstrip Thumbnail ( For Medias Older Than 2024, Async Job )",
          "value": "POST /1/vod/channel/{channel}/media/{media}/thumbstrip"
        },
        {
          "name": "Lists All Players.",
          "value": "GET /1/vod/channel/{channel}/player"
        },
        {
          "name": "Creates A New Player.",
          "value": "POST /1/vod/channel/{channel}/player"
        },
        {
          "name": "Deletes One Or Many Players.",
          "value": "DELETE /1/vod/channel/{channel}/player"
        },
        {
          "name": "Returns A Player.",
          "value": "GET /1/vod/channel/{channel}/player/{player}"
        },
        {
          "name": "Updates A Player.",
          "value": "PUT /1/vod/channel/{channel}/player/{player}"
        },
        {
          "name": "Deletes A Player.",
          "value": "DELETE /1/vod/channel/{channel}/player/{player}"
        },
        {
          "name": "Duplicates A Player.",
          "value": "POST /1/vod/channel/{channel}/player/{player}/copy"
        },
        {
          "name": "Lists All Ads.",
          "value": "GET /1/vod/channel/{channel}/player/{player}/ad"
        },
        {
          "name": "Creates A New Ad.",
          "value": "POST /1/vod/channel/{channel}/player/{player}/ad"
        },
        {
          "name": "Deletes One Or Many Ads.",
          "value": "DELETE /1/vod/channel/{channel}/player/{player}/ad"
        },
        {
          "name": "Returns A Ad.",
          "value": "GET /1/vod/channel/{channel}/player/{player}/ad/{ad}"
        },
        {
          "name": "Updates A Ad.",
          "value": "PUT /1/vod/channel/{channel}/player/{player}/ad/{ad}"
        },
        {
          "name": "Deletes A Ad.",
          "value": "DELETE /1/vod/channel/{channel}/player/{player}/ad/{ad}"
        },
        {
          "name": "Lists All Playlists.",
          "value": "GET /1/vod/channel/{channel}/playlist"
        },
        {
          "name": "Creates A New Playlist.",
          "value": "POST /1/vod/channel/{channel}/playlist"
        },
        {
          "name": "Deletes One Or Many Playlists.",
          "value": "DELETE /1/vod/channel/{channel}/playlist"
        },
        {
          "name": "Returns A Playlist.",
          "value": "GET /1/vod/channel/{channel}/playlist/{playlist}"
        },
        {
          "name": "Updates A Playlist.",
          "value": "PUT /1/vod/channel/{channel}/playlist/{playlist}"
        },
        {
          "name": "Updates A Playlist.",
          "value": "PATCH /1/vod/channel/{channel}/playlist/{playlist}"
        },
        {
          "name": "Deletes A Playlist.",
          "value": "DELETE /1/vod/channel/{channel}/playlist/{playlist}"
        },
        {
          "name": "Lists All Children Of A Given Folder, With Attached To Playlist Flag.",
          "value": "GET /1/vod/channel/{channel}/playlist/{playlist}/browse/{folder?}"
        },
        {
          "name": "Lists All Shares.",
          "value": "GET /1/vod/channel/{channel}/share"
        },
        {
          "name": "Creates A New Share To A Given Target",
          "value": "POST /1/vod/channel/{channel}/share"
        },
        {
          "name": "Returns A Share.",
          "value": "GET /1/vod/channel/{channel}/share/{share}"
        },
        {
          "name": "Updates A Share.",
          "value": "PUT /1/vod/channel/{channel}/share/{share}"
        },
        {
          "name": "Deletes A Share.",
          "value": "DELETE /1/vod/channel/{channel}/share/{share}"
        },
        {
          "name": "Create A Token From A Share",
          "value": "POST /1/vod/channel/{channel}/share/{share}/token"
        },
        {
          "name": "Get Average Time",
          "value": "GET /1/vod/channel/{channel}/statistics/avg_time"
        },
        {
          "name": "Get Channel Consumption",
          "value": "GET /1/vod/channel/{channel}/statistics/consumption"
        },
        {
          "name": "Get Channel Consumption Per Encoding",
          "value": "GET /1/vod/channel/{channel}/statistics/consumption/encodings/histogram"
        },
        {
          "name": "Get Channel Top Medias",
          "value": "GET /1/vod/channel/{channel}/statistics/media"
        },
        {
          "name": "Get Media Consumption",
          "value": "GET /1/vod/channel/{channel}/statistics/media/{media}/consumption"
        },
        {
          "name": "Get Media Consumption Per Encoding",
          "value": "GET /1/vod/channel/{channel}/statistics/media/{media}/consumption/encodings/histogram"
        },
        {
          "name": "Get Media Top Clusters",
          "value": "GET /1/vod/channel/{channel}/statistics/media/{media}/geolocation/clusters"
        },
        {
          "name": "Get Media Top Countries",
          "value": "GET /1/vod/channel/{channel}/statistics/media/{media}/geolocation/countries"
        },
        {
          "name": "Get Browser Shares Per Media",
          "value": "GET /1/vod/channel/{channel}/statistics/media/{media}/technologies/browsers/shares"
        },
        {
          "name": "Get Os Shares Per Media",
          "value": "GET /1/vod/channel/{channel}/statistics/media/{media}/technologies/os/shares"
        },
        {
          "name": "Get Playbacks Shares Per Media",
          "value": "GET /1/vod/channel/{channel}/statistics/media/{media}/technologies/playback/shares"
        },
        {
          "name": "Get Players Shares Per Media",
          "value": "GET /1/vod/channel/{channel}/statistics/media/{media}/technologies/players/shares"
        },
        {
          "name": "Get Media Viewers",
          "value": "GET /1/vod/channel/{channel}/statistics/media/{media}/viewers"
        },
        {
          "name": "Get Media Viewers Per Encoding Histogram",
          "value": "GET /1/vod/channel/{channel}/statistics/media/{media}/viewers/encodings/histogram"
        },
        {
          "name": "Get Media Viewers Per Encoding Share",
          "value": "GET /1/vod/channel/{channel}/statistics/media/{media}/viewers/encodings/shares"
        },
        {
          "name": "Get Media Unique Viewers",
          "value": "GET /1/vod/channel/{channel}/statistics/media/{media}/viewers/uniques"
        },
        {
          "name": "Get Media Viewing Time",
          "value": "GET /1/vod/channel/{channel}/statistics/media/{media}/viewing"
        },
        {
          "name": "Get Viewing Time Per Encoding And Media",
          "value": "GET /1/vod/channel/{channel}/statistics/media/{media}/viewing/encodings/histogram"
        },
        {
          "name": "Get Channel Browser Shares",
          "value": "GET /1/vod/channel/{channel}/statistics/technologies/browsers/shares"
        },
        {
          "name": "Get Channel Os Shares",
          "value": "GET /1/vod/channel/{channel}/statistics/technologies/os/shares"
        },
        {
          "name": "Get Channel Playbacks Shares",
          "value": "GET /1/vod/channel/{channel}/statistics/technologies/playback/shares"
        },
        {
          "name": "Get Channel Players Shares",
          "value": "GET /1/vod/channel/{channel}/statistics/technologies/players/shares"
        },
        {
          "name": "Get Consumed Time Per IP",
          "value": "GET /1/vod/channel/{channel}/statistics/time_ip"
        },
        {
          "name": "Get Channel Viewers",
          "value": "GET /1/vod/channel/{channel}/statistics/viewers"
        },
        {
          "name": "Get Channel Viewers Per Encoding Histogram",
          "value": "GET /1/vod/channel/{channel}/statistics/viewers/encodings/histogram"
        },
        {
          "name": "Get Channel Viewers Per Encoding Share",
          "value": "GET /1/vod/channel/{channel}/statistics/viewers/encodings/shares"
        },
        {
          "name": "Get Channel Viewers Histogram",
          "value": "GET /1/vod/channel/{channel}/statistics/viewers/histogram"
        },
        {
          "name": "Get Media Viewers",
          "value": "GET /1/vod/channel/{channel}/statistics/viewers/medias"
        },
        {
          "name": "Get Channel Unique Viewers",
          "value": "GET /1/vod/channel/{channel}/statistics/viewers/uniques"
        },
        {
          "name": "Get Media Unique Viewers",
          "value": "GET /1/vod/channel/{channel}/statistics/viewers/uniques/medias"
        },
        {
          "name": "Get Channel Viewing Time",
          "value": "GET /1/vod/channel/{channel}/statistics/viewing"
        },
        {
          "name": "Get Channel Viewing Time Per Encoding",
          "value": "GET /1/vod/channel/{channel}/statistics/viewing/encodings/histogram"
        },
        {
          "name": "List Uploads",
          "value": "GET /1/vod/channel/{channel}/upload"
        },
        {
          "name": "Create New Media",
          "value": "POST /1/vod/channel/{channel}/upload"
        },
        {
          "name": "Creates A New Subtitle To A Given Media.",
          "value": "POST /1/vod/channel/{channel}/media/{media}/subtitle/{language}"
        },
        {
          "name": "Creates A New Subtitle To A Given Media, From A Provided File.",
          "value": "POST /1/vod/channel/{channel}/media/{media}/subtitle/{language}/import"
        },
        {
          "name": "Set A Default Subtitle.",
          "value": "PUT /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}/default"
        },
        {
          "name": "Returns A Subtitle.",
          "value": "GET /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}"
        },
        {
          "name": "Updates A Subtitle.",
          "value": "PUT /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}"
        },
        {
          "name": "Deletes A Subtitle.",
          "value": "DELETE /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}"
        },
        {
          "name": "Attach Logo",
          "value": "POST /1/vod/channel/{channel}/media/{media}/logo/{logo}"
        },
        {
          "name": "Attach Logo",
          "value": "DELETE /1/vod/channel/{channel}/media/{media}/logo"
        },
        {
          "name": "List Major Encoding Constraints That Should Be Respected",
          "value": "GET /1/vod/encoding/constraint"
        },
        {
          "name": "List Encoding Profiles.",
          "value": "GET /1/vod/encoding/profile"
        },
        {
          "name": "Lists All Available Countries.",
          "value": "GET /1/vod/country"
        },
        {
          "name": "Lists All Available Categories.",
          "value": "GET /1/vod/category"
        },
        {
          "name": "Lists All Available Languages.",
          "value": "GET /1/vod/language"
        },
        {
          "name": "Finds And Returns Anything Matching A Given Query.",
          "value": "GET /1/vod/search"
        },
        {
          "name": "Lists All Playlists Having A Given Media Attached.",
          "value": "GET /1/vod/channel/{channel}/media/{media}/playlist"
        },
        {
          "name": "Adds One Or Many Given Medias/folders To One Or Many Playlists.",
          "value": "POST /1/vod/channel/{channel}/playlist/attach"
        },
        {
          "name": "Removes One Or Many Given Medias/folders From One Or Many Playlists.",
          "value": "DELETE /1/vod/channel/{channel}/playlist/detach"
        },
        {
          "name": "Lists All Subtitles Of A Given Media.",
          "value": "GET /1/vod/channel/{channel}/media/{media}/subtitle"
        },
        {
          "name": "Updates One Or Many Subtitle.",
          "value": "PUT /1/vod/channel/{channel}/media/{media}/subtitle"
        },
        {
          "name": "Deletes Many Subtitles.",
          "value": "DELETE /1/vod/channel/{channel}/media/{media}/subtitle"
        }
      ],
      "default": "GET /1/vod/channel",
      "noDataExpression": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/disk-usage"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/thumbnail"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/thumbnail"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/thumbnail"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/thumbnail"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "File",
      "name": "query_file",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/thumbnail"
          ]
        }
      },
      "required": true,
      "description": "The thumbnail file"
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
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/thumbnail"
          ]
        }
      },
      "options": [
        {
          "displayName": "File",
          "name": "body_file",
          "type": "string",
          "default": "",
          "description": "The thumbnail file"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/browse"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/browse"
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
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/browse"
          ]
        }
      },
      "options": [
        {
          "displayName": "Targets",
          "name": "body_targets",
          "type": "json",
          "default": {},
          "description": "uuid of medias/folders to move to trash"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/browse/copy"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Destination",
      "name": "body_destination",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/browse/copy"
          ]
        }
      },
      "required": true,
      "description": "uuid of destination folder"
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
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/browse/copy"
          ]
        }
      },
      "options": [
        {
          "displayName": "Targets",
          "name": "body_targets",
          "type": "json",
          "default": {},
          "description": "uuid of medias/folders to move to trash"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/browse/move"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Destination",
      "name": "body_destination",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/browse/move"
          ]
        }
      },
      "required": true,
      "description": "uuid of destination folder"
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
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/browse/move"
          ]
        }
      },
      "options": [
        {
          "displayName": "Targets",
          "name": "body_targets",
          "type": "json",
          "default": {},
          "description": "uuid of medias/folders to move to trash"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/browse/trash"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/browse/trash"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/browse/trash/{file}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "File",
      "name": "path_file",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/browse/trash/{file}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/browse/trash/{file}/restore"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "File",
      "name": "path_file",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/browse/trash/{file}/restore"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/browse/tree"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/browse/breadcrumb"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/browse/{file}/breadcrumb"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/browse/update"
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
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/browse/update"
          ]
        }
      },
      "options": [
        {
          "displayName": "Targets",
          "name": "body_targets",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/browse/{file}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "File",
      "name": "path_file",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/browse/{file}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/browse/{file}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "File",
      "name": "path_file",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/browse/{file}"
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
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/browse/{file}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Type",
          "name": "body_type",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "$ref",
          "name": "body__ref",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/browse/{file}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "File",
      "name": "path_file",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/browse/{file}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/browse/{file}/tree"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/browse/{file}/copy"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "File",
      "name": "path_file",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/browse/{file}/copy"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Destination",
      "name": "body_destination",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/browse/{file}/copy"
          ]
        }
      },
      "required": true,
      "description": "uuid of destination folder"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/browse/{file}/move"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "File",
      "name": "path_file",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/browse/{file}/move"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Destination",
      "name": "body_destination",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/browse/{file}/move"
          ]
        }
      },
      "required": true,
      "description": "uuid of destination folder"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/callback/log"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/callback/log"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/callback/log/{callbackLog}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "CallbackLog",
      "name": "path_callbackLog",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/callback/log/{callbackLog}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/callback/log/{callbackLog}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "CallbackLog",
      "name": "path_callbackLog",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/callback/log/{callbackLog}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/callback"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/callback"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/callback"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/callback"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/callback/{callback}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Callback",
      "name": "path_callback",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/callback/{callback}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/callback/{callback}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Callback",
      "name": "path_callback",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/callback/{callback}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/callback/{callback}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Callback",
      "name": "path_callback",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/callback/{callback}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/journal"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/encoding"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/encoding"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/encoding"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/encoding/{encoding}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Encoding",
      "name": "path_encoding",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/encoding/{encoding}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/encoding/{encoding}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Encoding",
      "name": "path_encoding",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/encoding/{encoding}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/encoding/{encoding}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Encoding",
      "name": "path_encoding",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/encoding/{encoding}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/logo"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/logo"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/logo"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/logo/detach"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/logo/{logo}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Logo",
      "name": "path_logo",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/logo/{logo}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/logo/{logo}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Logo",
      "name": "path_logo",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/logo/{logo}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/logo/{logo}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Logo",
      "name": "path_logo",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/logo/{logo}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/logo/{logo}/attach"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Logo",
      "name": "path_logo",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/logo/{logo}/attach"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/folder"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/folder"
          ]
        }
      },
      "options": [
        {
          "displayName": "With",
          "name": "query_with",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/folder"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/folder/{folder}/encoding"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/folder/{folder}/encoding"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/folder/{folder}/encoding"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/folder/{folder}/encoding"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/folder/{folder}/encoding/{encoding}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/folder/{folder}/encoding/{encoding}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Encoding",
      "name": "path_encoding",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/folder/{folder}/encoding/{encoding}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/folder/{folder}/encoding/{encoding}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/folder/{folder}/encoding/{encoding}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Encoding",
      "name": "path_encoding",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/folder/{folder}/encoding/{encoding}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/folder/{folder}/logo/{logo}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/folder/{folder}/logo/{logo}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Logo",
      "name": "path_logo",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/folder/{folder}/logo/{logo}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/folder/{folder}/logo"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/folder/{folder}/logo"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/folder/root"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/folder/root"
          ]
        }
      },
      "options": [
        {
          "displayName": "With",
          "name": "query_with",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/folder/{folder}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/folder/{folder}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "$folder, New OptionsHttp($request",
      "name": "query__folder__new_OptionsHttp__request",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/folder/{folder}"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/folder/{folder}"
          ]
        }
      },
      "options": [
        {
          "displayName": "With",
          "name": "query_with",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/folder/{folder}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/folder/{folder}"
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
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/folder/{folder}"
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
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Validated",
          "name": "body_validated",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Published",
          "name": "body_published",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Auto Validate",
          "name": "body_auto_validate",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Auto Publish",
          "name": "body_auto_publish",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Restricted",
          "name": "body_restricted",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Key",
          "name": "body_key",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Allowed Ip",
          "name": "body_allowed_ip",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Disallowed Ip",
          "name": "body_disallowed_ip",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Allowed Country",
          "name": "body_allowed_country",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Disallowed Country",
          "name": "body_disallowed_country",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Discarded",
          "name": "body_discarded",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Created At",
          "name": "body_created_at",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Updated At",
          "name": "body_updated_at",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Discarded At",
          "name": "body_discarded_at",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Deleted At",
          "name": "body_deleted_at",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Image",
          "name": "body_image",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Media Count",
          "name": "body_media_count",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Media Duration",
          "name": "body_media_duration",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/folder/{folder}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/folder/{folder}"
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
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/folder/{folder}"
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
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Validated",
          "name": "body_validated",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Published",
          "name": "body_published",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Auto Validate",
          "name": "body_auto_validate",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Auto Publish",
          "name": "body_auto_publish",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Restricted",
          "name": "body_restricted",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Key",
          "name": "body_key",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Allowed Ip",
          "name": "body_allowed_ip",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Disallowed Ip",
          "name": "body_disallowed_ip",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Allowed Country",
          "name": "body_allowed_country",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Disallowed Country",
          "name": "body_disallowed_country",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Discarded",
          "name": "body_discarded",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Created At",
          "name": "body_created_at",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Updated At",
          "name": "body_updated_at",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Discarded At",
          "name": "body_discarded_at",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Deleted At",
          "name": "body_deleted_at",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Image",
          "name": "body_image",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Media Count",
          "name": "body_media_count",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Media Duration",
          "name": "body_media_duration",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/folder/{folder}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/folder/{folder}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/folder/{folder}/playlist"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/folder/{folder}/playlist"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/folder/{folder}/playlist"
          ]
        }
      },
      "options": [
        {
          "displayName": "With",
          "name": "query_with",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/ftp/user"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/ftp/user"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/ftp/user/{ftpUser}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "FtpUser",
      "name": "path_ftpUser",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/ftp/user/{ftpUser}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/ftp/user/{ftpUser}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "FtpUser",
      "name": "path_ftpUser",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/ftp/user/{ftpUser}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/ftp/user/{ftpUser}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "FtpUser",
      "name": "path_ftpUser",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/ftp/user/{ftpUser}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media"
          ]
        }
      },
      "options": [
        {
          "displayName": "With",
          "name": "query_with",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/media"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "$media, New OptionsHttp($request",
      "name": "query__media__new_OptionsHttp__request",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}"
          ]
        }
      },
      "options": [
        {
          "displayName": "With",
          "name": "query_with",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/media/{media}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/media/{media}"
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
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/media/{media}"
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
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Validated",
          "name": "body_validated",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Published",
          "name": "body_published",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Streams",
          "name": "body_streams",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Shot Boundaries",
          "name": "body_shot_boundaries",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Key Restricted",
          "name": "body_key_restricted",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Ip Restricted",
          "name": "body_ip_restricted",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Country Restricted",
          "name": "body_country_restricted",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "State",
          "name": "body_state",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Created At",
          "name": "body_created_at",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Updated At",
          "name": "body_updated_at",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Folder",
          "name": "body_folder",
          "type": "json",
          "default": {},
          "description": "folder"
        },
        {
          "displayName": "Upload",
          "name": "body_upload",
          "type": "json",
          "default": {},
          "description": "upload"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/media/{media}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/media/{media}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/chapter"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/chapter"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/chapter"
          ]
        }
      },
      "options": [
        {
          "displayName": "With",
          "name": "query_with",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/chapter"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/chapter"
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
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/chapter"
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
          "displayName": "Timestamp",
          "name": "body_timestamp",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Published",
          "name": "body_published",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Created At",
          "name": "body_created_at",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Updated At",
          "name": "body_updated_at",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Deleted At",
          "name": "body_deleted_at",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Index",
          "name": "body_index",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/media/{media}/chapter"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/media/{media}/chapter"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/media/{media}/chapter"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/media/{media}/chapter"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/chapter/{chapter}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/chapter/{chapter}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Chapter",
      "name": "path_chapter",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/chapter/{chapter}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "$media, $chapter, New OptionsHttp($request",
      "name": "query__media___chapter__new_OptionsHttp__request",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/chapter/{chapter}"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/chapter/{chapter}"
          ]
        }
      },
      "options": [
        {
          "displayName": "With",
          "name": "query_with",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/media/{media}/chapter/{chapter}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/media/{media}/chapter/{chapter}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Chapter",
      "name": "path_chapter",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/media/{media}/chapter/{chapter}"
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
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/media/{media}/chapter/{chapter}"
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
          "displayName": "Timestamp",
          "name": "body_timestamp",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Published",
          "name": "body_published",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Created At",
          "name": "body_created_at",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Updated At",
          "name": "body_updated_at",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Deleted At",
          "name": "body_deleted_at",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Index",
          "name": "body_index",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/media/{media}/chapter/{chapter}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/media/{media}/chapter/{chapter}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Chapter",
      "name": "path_chapter",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/media/{media}/chapter/{chapter}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/cut"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/cut"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/cut"
          ]
        }
      },
      "required": true,
      "description": "channel id"
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/cut"
          ]
        }
      },
      "required": true,
      "description": "media uuid"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/cut"
          ]
        }
      },
      "options": [
        {
          "displayName": "New",
          "name": "query_new",
          "type": "string",
          "default": "",
          "description": "creates a new trimmed media if set to 1"
        },
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "time in seconds where the trim starts, in multiples of 2"
        },
        {
          "displayName": "Duration",
          "name": "query_duration",
          "type": "string",
          "default": "",
          "description": "duration of the trim in seconds, in multiples of 2, is (endTime-startTrimTime)"
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
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/cut"
          ]
        }
      },
      "options": [
        {
          "displayName": "$ref",
          "name": "body__ref",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/waveform"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/waveform"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/thumbstrip"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/thumbstrip"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/player"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/player"
          ]
        }
      },
      "options": [
        {
          "displayName": "With",
          "name": "query_with",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/player/{player}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/player/{player}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "$player, New OptionsHttp($request",
      "name": "query__player__new_OptionsHttp__request",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/player/{player}"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/player/{player}"
          ]
        }
      },
      "options": [
        {
          "displayName": "With",
          "name": "query_with",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/player/{player}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/player/{player}"
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
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/player/{player}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Type",
          "name": "body_type",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "$ref",
          "name": "body__ref",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/player/{player}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/player/{player}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/player/{player}/copy"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/player/{player}/copy"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/player/{player}/ad"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/player/{player}/ad"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/player/{player}/ad"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/player/{player}/ad"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/player/{player}/ad"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/player/{player}/ad"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/player/{player}/ad/{ad}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/player/{player}/ad/{ad}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Ad",
      "name": "path_ad",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/player/{player}/ad/{ad}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/player/{player}/ad/{ad}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/player/{player}/ad/{ad}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Ad",
      "name": "path_ad",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/player/{player}/ad/{ad}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/player/{player}/ad/{ad}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/player/{player}/ad/{ad}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Ad",
      "name": "path_ad",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/player/{player}/ad/{ad}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/playlist"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/playlist"
          ]
        }
      },
      "options": [
        {
          "displayName": "With",
          "name": "query_with",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/playlist"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/playlist"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/playlist/{playlist}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Playlist",
      "name": "path_playlist",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/playlist/{playlist}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "$playlist, New OptionsHttp($request",
      "name": "query__playlist__new_OptionsHttp__request",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/playlist/{playlist}"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/playlist/{playlist}"
          ]
        }
      },
      "options": [
        {
          "displayName": "With",
          "name": "query_with",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/playlist/{playlist}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Playlist",
      "name": "path_playlist",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/playlist/{playlist}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PATCH /1/vod/channel/{channel}/playlist/{playlist}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Playlist",
      "name": "path_playlist",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PATCH /1/vod/channel/{channel}/playlist/{playlist}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/playlist/{playlist}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Playlist",
      "name": "path_playlist",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/playlist/{playlist}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/playlist/{playlist}/browse/{folder?}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Playlist",
      "name": "path_playlist",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/playlist/{playlist}/browse/{folder?}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/playlist/{playlist}/browse/{folder?}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/share"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/share"
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
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/share"
          ]
        }
      },
      "options": [
        {
          "displayName": "Target",
          "name": "body_target",
          "type": "string",
          "default": "",
          "description": "uuid of media or playlist"
        },
        {
          "displayName": "Player",
          "name": "body_player",
          "type": "string",
          "default": "",
          "description": "uuid of player"
        },
        {
          "displayName": "Encoding",
          "name": "body_encoding",
          "type": "string",
          "default": "",
          "description": "uuid of encoding"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/share/{share}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Share",
      "name": "path_share",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/share/{share}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "$share, New OptionsHttp($request",
      "name": "query__share__new_OptionsHttp__request",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/share/{share}"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/share/{share}"
          ]
        }
      },
      "options": [
        {
          "displayName": "With",
          "name": "query_with",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/share/{share}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Share",
      "name": "path_share",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/share/{share}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/share/{share}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Share",
      "name": "path_share",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/share/{share}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/share/{share}/token"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Share",
      "name": "path_share",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/share/{share}/token"
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
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/share/{share}/token"
          ]
        }
      },
      "options": [
        {
          "displayName": "$ref",
          "name": "body__ref",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/avg_time"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/avg_time"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/consumption"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/consumption"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/consumption/encodings/histogram"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/consumption/encodings/histogram"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        },
        {
          "displayName": "Per",
          "name": "query_per",
          "type": "string",
          "default": "",
          "description": "Histogram grouped by 1d,1h,1m .."
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/consumption"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/consumption"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/consumption"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/consumption/encodings/histogram"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/consumption/encodings/histogram"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/consumption/encodings/histogram"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        },
        {
          "displayName": "Per",
          "name": "query_per",
          "type": "string",
          "default": "",
          "description": "Histogram grouped by 1d,1h,1m .."
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/geolocation/clusters"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/geolocation/clusters"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/geolocation/countries"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/geolocation/countries"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/technologies/browsers/shares"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/technologies/browsers/shares"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/technologies/browsers/shares"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/technologies/os/shares"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/technologies/os/shares"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/technologies/os/shares"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/technologies/playback/shares"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/technologies/playback/shares"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/technologies/playback/shares"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/technologies/players/shares"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/technologies/players/shares"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/technologies/players/shares"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/viewers"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/viewers"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Medias",
      "name": "query_medias",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/viewers"
          ]
        }
      },
      "required": true,
      "description": "Valid Media identifiers separated with comma ,"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/viewers"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/viewers/encodings/histogram"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/viewers/encodings/histogram"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/viewers/encodings/histogram"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/viewers/encodings/shares"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/viewers/encodings/shares"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/viewers/encodings/shares"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/viewers/uniques"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/viewers/uniques"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Medias",
      "name": "query_medias",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/viewers/uniques"
          ]
        }
      },
      "required": true,
      "description": "Valid Media identifiers separated with comma ,"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/viewers/uniques"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/viewing"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/viewing"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/viewing"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/viewing/encodings/histogram"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/viewing/encodings/histogram"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/media/{media}/viewing/encodings/histogram"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        },
        {
          "displayName": "Per",
          "name": "query_per",
          "type": "string",
          "default": "",
          "description": "Histogram grouped by 1d,1h,1m .."
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/technologies/browsers/shares"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/technologies/browsers/shares"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/technologies/os/shares"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/technologies/os/shares"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/technologies/playback/shares"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/technologies/playback/shares"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/technologies/players/shares"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/technologies/players/shares"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/time_ip"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/time_ip"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/viewers"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/viewers"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/viewers/encodings/histogram"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/viewers/encodings/histogram"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/viewers/encodings/shares"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/viewers/encodings/shares"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/viewers/histogram"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/viewers/histogram"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        },
        {
          "displayName": "Per",
          "name": "query_per",
          "type": "string",
          "default": "",
          "description": "Histogram grouped by 1d,1h,1m .."
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/viewers/medias"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Medias",
      "name": "query_medias",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/viewers/medias"
          ]
        }
      },
      "required": true,
      "description": "Valid Media identifiers separated with comma ,"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/viewers/medias"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/viewers/uniques"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/viewers/uniques"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/viewers/uniques/medias"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Medias",
      "name": "query_medias",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/viewers/uniques/medias"
          ]
        }
      },
      "required": true,
      "description": "Valid Media identifiers separated with comma ,"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/viewers/uniques/medias"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/viewing"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/viewing"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/viewing/encodings/histogram"
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
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/statistics/viewing/encodings/histogram"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": "",
          "description": "begin date timestamp"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/upload"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/upload"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Folder",
      "name": "body_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/upload"
          ]
        }
      },
      "required": true,
      "description": "A valid UUID for Folder"
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
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/upload"
          ]
        }
      },
      "options": [
        {
          "displayName": "Url",
          "name": "body_url",
          "type": "string",
          "default": "",
          "description": "Provide either url to import video from or file below"
        },
        {
          "displayName": "File",
          "name": "body_file",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Size",
          "name": "body_size",
          "type": "string",
          "default": "",
          "description": "expected video size"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/subtitle/{language}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/subtitle/{language}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Language",
      "name": "path_language",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/subtitle/{language}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/subtitle/{language}/import"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/subtitle/{language}/import"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Language",
      "name": "path_language",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/subtitle/{language}/import"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}/default"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}/default"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Subtitle",
      "name": "path_subtitle",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}/default"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Subtitle",
      "name": "path_subtitle",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Subtitle",
      "name": "path_subtitle",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Subtitle",
      "name": "path_subtitle",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/logo/{logo}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/logo/{logo}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Logo",
      "name": "path_logo",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/logo/{logo}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/media/{media}/logo"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/media/{media}/logo"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/playlist"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/playlist"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/playlist/attach"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/playlist/detach"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/subtitle"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/subtitle"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/media/{media}/subtitle"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/media/{media}/subtitle"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/media/{media}/subtitle"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "General"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/media/{media}/subtitle"
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
            "V2 > Browse"
          ]
        }
      },
      "options": [
        {
          "name": "Exports One Or Many Medias To An External Platform.",
          "value": "POST /1/vod/channel/{channel}/browse/export"
        },
        {
          "name": "Restores One Or Many Medias/folders From Trash To Their Original Location.",
          "value": "DELETE /1/vod/channel/{channel}/browse/trash/restore"
        },
        {
          "name": "Exports A Media To An External Platform.",
          "value": "POST /1/vod/channel/{channel}/browse/{file}/export"
        }
      ],
      "default": "POST /1/vod/channel/{channel}/browse/export",
      "noDataExpression": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Browse"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/browse/export"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Browse"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/browse/trash/restore"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Browse"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/browse/{file}/export"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "File",
      "name": "path_file",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Browse"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/browse/{file}/export"
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
            "V2 > Channel"
          ]
        }
      },
      "options": [
        {
          "name": "Returns A Channel.",
          "value": "GET /1/vod/channel/{channel}"
        },
        {
          "name": "Updates A Channel.",
          "value": "PUT /1/vod/channel/{channel}"
        }
      ],
      "default": "GET /1/vod/channel/{channel}",
      "noDataExpression": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Channel"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Channel"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}"
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
            "V2 > Playlist"
          ]
        }
      },
      "options": [
        {
          "name": "Returns A Playlist In Its Given Extension",
          "value": "GET /1/res/playlist/{playlist}.{ext}"
        },
        {
          "name": "Adds One Or Many Given Medias/folders To A Playlist.",
          "value": "POST /1/vod/channel/{channel}/playlist/{playlist}/attach"
        },
        {
          "name": "Removes One Or Many Given Medias/folders From A Playlist.",
          "value": "DELETE /1/vod/channel/{channel}/playlist/{playlist}/detach"
        },
        {
          "name": "Duplicates A Playlist.",
          "value": "POST /1/vod/channel/{channel}/playlist/{playlist}/copy"
        },
        {
          "name": "Returns A Playlist Image.",
          "value": "GET /1/vod/channel/{channel}/playlist/{playlist}/image"
        },
        {
          "name": "Deletes A Playlist Image",
          "value": "DELETE /1/vod/channel/{channel}/playlist/{playlist}/image"
        },
        {
          "name": "Lists All Medias Of A Playlist.",
          "value": "GET /1/vod/channel/{channel}/playlist/{playlist}/media"
        },
        {
          "name": "Moves One Or Many Given Medias One Position Up.",
          "value": "POST /1/vod/channel/{channel}/playlist/{playlist}/media/move/up"
        },
        {
          "name": "Moves One Or Many Given Medias One Position Down.",
          "value": "POST /1/vod/channel/{channel}/playlist/{playlist}/media/move/down"
        },
        {
          "name": "Moves One Or Many Given Medias After A Given Media.",
          "value": "POST /1/vod/channel/{channel}/playlist/{playlist}/media/move/after"
        },
        {
          "name": "Moves One Or Many Given Medias Before A Given Media.",
          "value": "POST /1/vod/channel/{channel}/playlist/{playlist}/media/move/before"
        }
      ],
      "default": "GET /1/res/playlist/{playlist}.{ext}",
      "noDataExpression": true
    },
    {
      "displayName": "Playlist",
      "name": "path_playlist",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Playlist"
          ],
          "operation": [
            "GET /1/res/playlist/{playlist}.{ext}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Ext",
      "name": "path_ext",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Playlist"
          ],
          "operation": [
            "GET /1/res/playlist/{playlist}.{ext}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Playlist"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/playlist/{playlist}/attach"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Playlist",
      "name": "path_playlist",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Playlist"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/playlist/{playlist}/attach"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Playlist"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/playlist/{playlist}/detach"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Playlist",
      "name": "path_playlist",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Playlist"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/playlist/{playlist}/detach"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Playlist"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/playlist/{playlist}/copy"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Playlist",
      "name": "path_playlist",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Playlist"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/playlist/{playlist}/copy"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Playlist"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/playlist/{playlist}/image"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Playlist",
      "name": "path_playlist",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Playlist"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/playlist/{playlist}/image"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Playlist"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/playlist/{playlist}/image"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Playlist",
      "name": "path_playlist",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Playlist"
          ],
          "operation": [
            "DELETE /1/vod/channel/{channel}/playlist/{playlist}/image"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Playlist"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/playlist/{playlist}/media"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Playlist",
      "name": "path_playlist",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Playlist"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/playlist/{playlist}/media"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Playlist"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/playlist/{playlist}/media/move/up"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Playlist",
      "name": "path_playlist",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Playlist"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/playlist/{playlist}/media/move/up"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Playlist"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/playlist/{playlist}/media/move/down"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Playlist",
      "name": "path_playlist",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Playlist"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/playlist/{playlist}/media/move/down"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Playlist"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/playlist/{playlist}/media/move/after"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Playlist",
      "name": "path_playlist",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Playlist"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/playlist/{playlist}/media/move/after"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Playlist"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/playlist/{playlist}/media/move/before"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Playlist",
      "name": "path_playlist",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Playlist"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/playlist/{playlist}/media/move/before"
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
            "V2 > Subtitles"
          ]
        }
      },
      "options": [
        {
          "name": "Generate Subtitle From Media",
          "value": "POST /1/vod/channel/{channel}/media/{media}/subtitle"
        },
        {
          "name": "Get Summary From Media As Description",
          "value": "GET /1/vod/channel/{channel}/media/{media}/subtitle/summarize"
        },
        {
          "name": "Get Summary From Subtitle",
          "value": "GET /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}/summarize"
        },
        {
          "name": "Get Custom Summary From Media",
          "value": "POST /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}/summarize"
        },
        {
          "name": "Translate Subtitle",
          "value": "POST /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}/translate"
        }
      ],
      "default": "POST /1/vod/channel/{channel}/media/{media}/subtitle",
      "noDataExpression": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Subtitles"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/subtitle"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Subtitles"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/subtitle"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Subtitles"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/subtitle/summarize"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Subtitles"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/subtitle/summarize"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Subtitles"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}/summarize"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Subtitles"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}/summarize"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Subtitle",
      "name": "path_subtitle",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Subtitles"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}/summarize"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Subtitles"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}/summarize"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Subtitles"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}/summarize"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Subtitle",
      "name": "path_subtitle",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Subtitles"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}/summarize"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Subtitles"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}/translate"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Subtitles"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}/translate"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Subtitle",
      "name": "path_subtitle",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Subtitles"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}/translate"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Languages",
      "name": "body_languages",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > Subtitles"
          ],
          "operation": [
            "POST /1/vod/channel/{channel}/media/{media}/subtitle/{subtitle}/translate"
          ]
        }
      },
      "required": true,
      "description": "languages you want to translate the subtitle into: <note>-<strong>en</strong></note><note>-<strong>fr</strong></note><note>-<strong>it</strong></note><note>-<strong>de</strong></note>"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > UserActivity"
          ]
        }
      },
      "options": [
        {
          "name": "Get Channel User Activity Log",
          "value": "GET /1/vod/channel/{channel}/user-activity-log"
        },
        {
          "name": "Put User Activity Log",
          "value": "PUT /1/vod/channel/{channel}/user-activity-log"
        },
        {
          "name": "Get Folder User Activity Log",
          "value": "GET /1/vod/channel/{channel}/folder/{folder}/user-activity-log"
        },
        {
          "name": "Get Media User Activity Log",
          "value": "GET /1/vod/channel/{channel}/media/{media}/user-activity-log"
        }
      ],
      "default": "GET /1/vod/channel/{channel}/user-activity-log",
      "noDataExpression": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > UserActivity"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/user-activity-log"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > UserActivity"
          ],
          "operation": [
            "PUT /1/vod/channel/{channel}/user-activity-log"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > UserActivity"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/folder/{folder}/user-activity-log"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > UserActivity"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/folder/{folder}/user-activity-log"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > UserActivity"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/user-activity-log"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V2 > UserActivity"
          ],
          "operation": [
            "GET /1/vod/channel/{channel}/media/{media}/user-activity-log"
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
            "V3 > Ad"
          ]
        }
      },
      "options": [
        {
          "name": "List Advertisements.",
          "value": "GET /2/vod/players/{player}/ads"
        },
        {
          "name": "Create An Advertisement.",
          "value": "POST /2/vod/players/{player}/ads"
        },
        {
          "name": "Bulk Delete Advertisements.",
          "value": "DELETE /2/vod/players/{player}/ads"
        },
        {
          "name": "Show Ad Details.",
          "value": "GET /2/vod/ads/{ad}"
        },
        {
          "name": "Update Advertisement.",
          "value": "PUT /2/vod/ads/{ad}"
        },
        {
          "name": "Delete Advertisement.",
          "value": "DELETE /2/vod/ads/{ad}"
        }
      ],
      "default": "GET /2/vod/players/{player}/ads",
      "noDataExpression": true
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Ad"
          ],
          "operation": [
            "GET /2/vod/players/{player}/ads"
          ]
        }
      },
      "required": true,
      "description": "The Player unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Ad"
          ],
          "operation": [
            "GET /2/vod/players/{player}/ads"
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
      "displayName": "Player",
      "name": "path_player",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Ad"
          ],
          "operation": [
            "POST /2/vod/players/{player}/ads"
          ]
        }
      },
      "required": true,
      "description": "The Player unique identifier"
    },
    {
      "displayName": "Category",
      "name": "body_category",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Ad"
          ],
          "operation": [
            "POST /2/vod/players/{player}/ads"
          ]
        }
      },
      "required": true,
      "description": "The category of {name}<note><strong>vast</strong>: The advertisement is from a vast</note><note><strong>video</strong>: The advertisement is from a video</note><note><strong>none</strong>: There is no advertisement</note>"
    },
    {
      "displayName": "Type",
      "name": "body_type",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Ad"
          ],
          "operation": [
            "POST /2/vod/players/{player}/ads"
          ]
        }
      },
      "required": true,
      "description": "The type of {name}<note><strong>pre_roll</strong>: Advertisement displayed before the main content</note><note><strong>mid_roll</strong>: Advertisement displayed during the main content</note><note><strong>pst_roll</strong>: Advertisement displayed after the main content</note>"
    },
    {
      "displayName": "Url",
      "name": "body_url",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Ad"
          ],
          "operation": [
            "POST /2/vod/players/{player}/ads"
          ]
        }
      },
      "required": true,
      "description": "A public resolvable url"
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
            "V3 > Ad"
          ],
          "operation": [
            "POST /2/vod/players/{player}/ads"
          ]
        }
      },
      "options": [
        {
          "displayName": "Href",
          "name": "body_href",
          "type": "string",
          "default": "",
          "description": "A public resolvable url"
        },
        {
          "displayName": "Offset",
          "name": "body_offset",
          "type": "number",
          "default": 0,
          "description": "The offset after which the Ad gets loaded"
        },
        {
          "displayName": "Skip After",
          "name": "body_skip_after",
          "type": "number",
          "default": 0,
          "description": "The time in seconds after which the Ad can be skipped"
        },
        {
          "displayName": "Tracking Url",
          "name": "body_tracking_url",
          "type": "string",
          "default": "",
          "description": "a simple string"
        }
      ]
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Ad"
          ],
          "operation": [
            "DELETE /2/vod/players/{player}/ads"
          ]
        }
      },
      "required": true,
      "description": "The Player unique identifier"
    },
    {
      "displayName": "Ads",
      "name": "query_ads",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Ad"
          ],
          "operation": [
            "DELETE /2/vod/players/{player}/ads"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Ad",
      "name": "path_ad",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Ad"
          ],
          "operation": [
            "GET /2/vod/ads/{ad}"
          ]
        }
      },
      "required": true,
      "description": "The Ad unique identifier"
    },
    {
      "displayName": "Ad",
      "name": "path_ad",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Ad"
          ],
          "operation": [
            "PUT /2/vod/ads/{ad}"
          ]
        }
      },
      "required": true,
      "description": "The Ad unique identifier"
    },
    {
      "displayName": "Category",
      "name": "body_category",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Ad"
          ],
          "operation": [
            "PUT /2/vod/ads/{ad}"
          ]
        }
      },
      "required": true,
      "description": "The category of {name}<note><strong>vast</strong>: The advertisement is from a vast</note><note><strong>video</strong>: The advertisement is from a video</note><note><strong>none</strong>: There is no advertisement</note>"
    },
    {
      "displayName": "Type",
      "name": "body_type",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Ad"
          ],
          "operation": [
            "PUT /2/vod/ads/{ad}"
          ]
        }
      },
      "required": true,
      "description": "The type of {name}<note><strong>pre_roll</strong>: Advertisement displayed before the main content</note><note><strong>mid_roll</strong>: Advertisement displayed during the main content</note><note><strong>pst_roll</strong>: Advertisement displayed after the main content</note>"
    },
    {
      "displayName": "Url",
      "name": "body_url",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Ad"
          ],
          "operation": [
            "PUT /2/vod/ads/{ad}"
          ]
        }
      },
      "required": true,
      "description": "A public resolvable url"
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
            "V3 > Ad"
          ],
          "operation": [
            "PUT /2/vod/ads/{ad}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Href",
          "name": "body_href",
          "type": "string",
          "default": "",
          "description": "A public resolvable url"
        },
        {
          "displayName": "Offset",
          "name": "body_offset",
          "type": "number",
          "default": 0,
          "description": "The offset after which the Ad gets loaded"
        },
        {
          "displayName": "Skip After",
          "name": "body_skip_after",
          "type": "number",
          "default": 0,
          "description": "The time in seconds after which the Ad can be skipped"
        },
        {
          "displayName": "Tracking Url",
          "name": "body_tracking_url",
          "type": "string",
          "default": "",
          "description": "a simple string"
        }
      ]
    },
    {
      "displayName": "Ad",
      "name": "path_ad",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Ad"
          ],
          "operation": [
            "DELETE /2/vod/ads/{ad}"
          ]
        }
      },
      "required": true,
      "description": "The Ad unique identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Alert"
          ]
        }
      },
      "options": [
        {
          "name": "List Alerts.",
          "value": "GET /2/vod/channels/{channel}/alerts"
        },
        {
          "name": "Get Alert.",
          "value": "GET /2/vod/alerts/{alert}"
        }
      ],
      "default": "GET /2/vod/channels/{channel}/alerts",
      "noDataExpression": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Alert"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/alerts"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Alert"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/alerts"
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
      "displayName": "Alert",
      "name": "path_alert",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Alert"
          ],
          "operation": [
            "GET /2/vod/alerts/{alert}"
          ]
        }
      },
      "required": true,
      "description": "The Alert unique identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Callback"
          ]
        }
      },
      "options": [
        {
          "name": "List Callbacks.",
          "value": "GET /2/vod/channels/{channel}/callbacks"
        },
        {
          "name": "Create Callback.",
          "value": "POST /2/vod/channels/{channel}/callbacks"
        },
        {
          "name": "Show Callback Details.",
          "value": "GET /2/vod/callbacks/{callback}"
        },
        {
          "name": "Update Callback Details.",
          "value": "PUT /2/vod/callbacks/{callback}"
        },
        {
          "name": "Delete Callback.",
          "value": "DELETE /2/vod/callbacks/{callback}"
        }
      ],
      "default": "GET /2/vod/channels/{channel}/callbacks",
      "noDataExpression": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Callback"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/callbacks"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Callback"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/callbacks"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
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
            "V3 > Callback"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/callbacks"
          ]
        }
      },
      "options": [
        {
          "displayName": "Active",
          "name": "body_active",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether the Callback is active"
        },
        {
          "displayName": "Auth",
          "name": "body_auth",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Basic Password",
          "name": "body_basic_password",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Basic Username",
          "name": "body_basic_username",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Bearer Token",
          "name": "body_bearer_token",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Event List",
          "name": "body_event_list",
          "type": "json",
          "default": {},
          "description": "The list of supported events for Callback"
        },
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Response",
          "name": "body_response",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Url",
          "name": "body_url",
          "type": "string",
          "default": "",
          "description": "A public resolvable url"
        }
      ]
    },
    {
      "displayName": "Callback",
      "name": "path_callback",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Callback"
          ],
          "operation": [
            "GET /2/vod/callbacks/{callback}"
          ]
        }
      },
      "required": true,
      "description": "The Callback unique identifier"
    },
    {
      "displayName": "Callback",
      "name": "path_callback",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Callback"
          ],
          "operation": [
            "PUT /2/vod/callbacks/{callback}"
          ]
        }
      },
      "required": true,
      "description": "The Callback unique identifier"
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
            "V3 > Callback"
          ],
          "operation": [
            "PUT /2/vod/callbacks/{callback}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Active",
          "name": "body_active",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether the Callback is active"
        },
        {
          "displayName": "Auth",
          "name": "body_auth",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Basic Password",
          "name": "body_basic_password",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Basic Username",
          "name": "body_basic_username",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Bearer Token",
          "name": "body_bearer_token",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Event List",
          "name": "body_event_list",
          "type": "json",
          "default": {},
          "description": "The list of supported events for Callback"
        },
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Response",
          "name": "body_response",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Url",
          "name": "body_url",
          "type": "string",
          "default": "",
          "description": "A public resolvable url"
        }
      ]
    },
    {
      "displayName": "Callback",
      "name": "path_callback",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Callback"
          ],
          "operation": [
            "DELETE /2/vod/callbacks/{callback}"
          ]
        }
      },
      "required": true,
      "description": "The Callback unique identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Category"
          ]
        }
      },
      "options": [
        {
          "name": "List Categories.",
          "value": "GET /2/vod/categories"
        }
      ],
      "default": "GET /2/vod/categories",
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
            "V3 > Category"
          ],
          "operation": [
            "GET /2/vod/categories"
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
            "V3 > Channel"
          ]
        }
      },
      "options": [
        {
          "name": "List Channels.",
          "value": "GET /2/vod/accounts/{account}/channels"
        },
        {
          "name": "Show Channel Details.",
          "value": "GET /2/vod/channels/{channel}"
        },
        {
          "name": "Get Channel Used Disk Space.",
          "value": "GET /2/vod/channels/{channel}/disk-usage"
        },
        {
          "name": "Get Trash Disk Usage.",
          "value": "GET /2/vod/channels/{channel}/disk-usage/trash"
        },
        {
          "name": "Get Folder Disk Usage.",
          "value": "GET /2/vod/disk-usage/{folder}"
        }
      ],
      "default": "GET /2/vod/accounts/{account}/channels",
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
            "V3 > Channel"
          ],
          "operation": [
            "GET /2/vod/accounts/{account}/channels"
          ]
        }
      },
      "required": true,
      "description": "The Account unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Channel"
          ],
          "operation": [
            "GET /2/vod/accounts/{account}/channels"
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
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Channel"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Channel"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/disk-usage"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Channel"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/disk-usage"
          ]
        }
      },
      "options": [
        {
          "displayName": "Format",
          "name": "query_format",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Channel"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/disk-usage/trash"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Channel"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/disk-usage/trash"
          ]
        }
      },
      "options": [
        {
          "displayName": "Format",
          "name": "query_format",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Channel"
          ],
          "operation": [
            "GET /2/vod/disk-usage/{folder}"
          ]
        }
      },
      "required": true,
      "description": "The Folder unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Channel"
          ],
          "operation": [
            "GET /2/vod/disk-usage/{folder}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Format",
          "name": "query_format",
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
            "V3 > Chapter"
          ]
        }
      },
      "options": [
        {
          "name": "List Chapters.",
          "value": "GET /2/vod/media/{media}/chapters"
        },
        {
          "name": "Show Chapter Details.",
          "value": "GET /2/vod/chapters/{chapter}"
        }
      ],
      "default": "GET /2/vod/media/{media}/chapters",
      "noDataExpression": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Chapter"
          ],
          "operation": [
            "GET /2/vod/media/{media}/chapters"
          ]
        }
      },
      "required": true,
      "description": "The Media unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Chapter"
          ],
          "operation": [
            "GET /2/vod/media/{media}/chapters"
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
      "displayName": "Chapter",
      "name": "path_chapter",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Chapter"
          ],
          "operation": [
            "GET /2/vod/chapters/{chapter}"
          ]
        }
      },
      "required": true,
      "description": "The Chapter unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Chapter"
          ],
          "operation": [
            "GET /2/vod/chapters/{chapter}"
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
            "V3 > Country"
          ]
        }
      },
      "options": [
        {
          "name": "List Countries.",
          "value": "GET /2/vod/countries"
        }
      ],
      "default": "GET /2/vod/countries",
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
            "V3 > Country"
          ],
          "operation": [
            "GET /2/vod/countries"
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
            "V3 > Encoding"
          ]
        }
      },
      "options": [
        {
          "name": "List Encodings.",
          "value": "GET /2/vod/channels/{channel}/encodings"
        },
        {
          "name": "Create Encoding.",
          "value": "POST /2/vod/channels/{channel}/encodings"
        },
        {
          "name": "Bulk Delete Encodings.",
          "value": "DELETE /2/vod/channels/{channel}/encodings"
        },
        {
          "name": "Show Encoding Details.",
          "value": "GET /2/vod/encodings/{encoding}"
        },
        {
          "name": "Update Encoding.",
          "value": "PUT /2/vod/encodings/{encoding}"
        },
        {
          "name": "Delete Encoding.",
          "value": "DELETE /2/vod/encodings/{encoding}"
        },
        {
          "name": "List Encoding Constraints.",
          "value": "GET /2/vod/encodings/constraints"
        },
        {
          "name": "List Encoding Profiles.",
          "value": "GET /2/vod/encodings/profiles"
        }
      ],
      "default": "GET /2/vod/channels/{channel}/encodings",
      "noDataExpression": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Encoding"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/encodings"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Encoding"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/encodings"
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
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Encoding"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/encodings"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
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
            "V3 > Encoding"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/encodings"
          ]
        }
      },
      "options": [
        {
          "displayName": "Audio Channel",
          "name": "body_audio_channel",
          "type": "string",
          "default": "",
          "description": "<note><strong>mono_1_0</strong>: Single-channel audio</note><note><strong>stereo_2_0</strong>: Two-channel audio</note><note><strong>stereo_2_1</strong>: Two-channel audio with subwoofer</note><note><strong>surround_4_1</strong>: Four-channel audio with subwoofer</note><note><strong>surround_5_1</strong>: Six-channel audio (5 speakers + subwoofer)</note><note><strong>surround_6_1</strong>: Seven-channel audio (6 speakers + subwoofer)</note><note><strong>surround_7_1</strong>: Eight-channel audio (7 speakers + subwoofer)</note>"
        },
        {
          "displayName": "Audio Codec",
          "name": "body_audio_codec",
          "type": "string",
          "default": "",
          "description": "<note><strong>aac</strong>: Advanced Audio Coding</note><note><strong>he_aac</strong>: High-Efficiency Advanced Audio Coding</note><note><strong>flac</strong>: Free Lossless Audio Codec</note><note><strong>mp3</strong>: MPEG-1 Audio Layer III</note><note><strong>vorbis</strong>: Open-source audio compression format</note><note><strong>copy</strong>: Uncompressed, lossless audio codec</note><note><strong>opus</strong>: Versatile audio codec</note>"
        },
        {
          "displayName": "Container",
          "name": "body_container",
          "type": "string",
          "default": "",
          "description": "<note><strong>flv</strong>: Adobe Flash Video container format</note><note><strong>m4a</strong>: MPEG-4 Audio container format</note><note><strong>mkv</strong>: Matroska Multimedia container format</note><note><strong>mp4</strong>: MPEG-4 Multimedia container format</note><note><strong>webm</strong>: WebM Multimedia container format</note><note><strong>mp3</strong>: MPEG-1 or MPEG-2 Audio Layer III audio container</note><note><strong>copy</strong>: Uncompressed, lossless container format</note><note><strong>aac</strong>: Advanced Audio Coding container format</note>"
        },
        {
          "displayName": "Copy",
          "name": "body_copy",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether the Encoding is a pure copy"
        },
        {
          "displayName": "Folder",
          "name": "body_folder",
          "type": "string",
          "default": "",
          "description": "Identifier of an existing Folder"
        },
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Streams",
          "name": "body_streams",
          "type": "string",
          "default": "",
          "description": "The streams associated with Encoding"
        },
        {
          "displayName": "Video Aspect",
          "name": "body_video_aspect",
          "type": "string",
          "default": "",
          "description": "<note><strong>letterbox</strong>: Preserves aspect ratio with black bars</note><note><strong>stretch</strong>: Stretches content to fill screen</note><note><strong>fill</strong>: Expands content to fit screen</note><note><strong>keep_ratio</strong>: Maintains original aspect ratio</note><note><strong>copy</strong>: Matches aspect ratio of the source</note>"
        },
        {
          "displayName": "Video Codec",
          "name": "body_video_codec",
          "type": "string",
          "default": "",
          "description": "<note><strong>h264</strong>: Efficient video compression standard</note><note><strong>hevc</strong>: High-efficiency video coding technology</note><note><strong>theora</strong>: Open-source video compression format</note><note><strong>vp8</strong>: Google's video compression standard</note><note><strong>vp9</strong>: High-quality video compression codec</note><note><strong>copy</strong>: Uncompressed, lossless video codec</note><note><strong>h263</strong>: Video compression standard for low bitrates</note>"
        },
        {
          "displayName": "Video Fps",
          "name": "body_video_fps",
          "type": "number",
          "default": 0,
          "description": "The video frames per second of the Encoding"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Encoding"
          ],
          "operation": [
            "DELETE /2/vod/channels/{channel}/encodings"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Encodings",
      "name": "query_encodings",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Encoding"
          ],
          "operation": [
            "DELETE /2/vod/channels/{channel}/encodings"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Encoding",
      "name": "path_encoding",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Encoding"
          ],
          "operation": [
            "GET /2/vod/encodings/{encoding}"
          ]
        }
      },
      "required": true,
      "description": "The Encoding unique identifier"
    },
    {
      "displayName": "Encoding",
      "name": "path_encoding",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Encoding"
          ],
          "operation": [
            "PUT /2/vod/encodings/{encoding}"
          ]
        }
      },
      "required": true,
      "description": "The Encoding unique identifier"
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
            "V3 > Encoding"
          ],
          "operation": [
            "PUT /2/vod/encodings/{encoding}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "a simple string"
        }
      ]
    },
    {
      "displayName": "Encoding",
      "name": "path_encoding",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Encoding"
          ],
          "operation": [
            "DELETE /2/vod/encodings/{encoding}"
          ]
        }
      },
      "required": true,
      "description": "The Encoding unique identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Filesystem"
          ]
        }
      },
      "options": [
        {
          "name": "Browse Channel Root.",
          "value": "GET /2/vod/channels/{channel}/browse"
        },
        {
          "name": "Discard File(s).",
          "value": "DELETE /2/vod/channels/{channel}/browse"
        },
        {
          "name": "Get Root Tree.",
          "value": "GET /2/vod/channels/{channel}/browse/tree"
        },
        {
          "name": "Get Root Breadcrumb.",
          "value": "GET /2/vod/channels/{channel}/browse/breadcrumb"
        },
        {
          "name": "Browse Trash.",
          "value": "GET /2/vod/channels/{channel}/browse/trash"
        },
        {
          "name": "Empty Trash.",
          "value": "DELETE /2/vod/channels/{channel}/browse/trash"
        },
        {
          "name": "Browse Folder.",
          "value": "GET /2/vod/browse/{folder}"
        },
        {
          "name": "Get Folder Breadcrumb.",
          "value": "GET /2/vod/browse/{folder}/breadcrumb"
        },
        {
          "name": "Get Folder Tree.",
          "value": "GET /2/vod/browse/{folder}/tree"
        },
        {
          "name": "Restore File(s).",
          "value": "POST /2/vod/channels/{channel}/browse/restore"
        },
        {
          "name": "Move File(s).",
          "value": "POST /2/vod/channels/{channel}/browse/move"
        }
      ],
      "default": "GET /2/vod/channels/{channel}/browse",
      "noDataExpression": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Filesystem"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/browse"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Filesystem"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/browse"
          ]
        }
      },
      "options": [
        {
          "displayName": "Deep",
          "name": "query_deep",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Files",
          "name": "query_files",
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
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Filesystem"
          ],
          "operation": [
            "DELETE /2/vod/channels/{channel}/browse"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Files",
      "name": "query_files",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Filesystem"
          ],
          "operation": [
            "DELETE /2/vod/channels/{channel}/browse"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Filesystem"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/browse/tree"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Filesystem"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/browse/breadcrumb"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Filesystem"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/browse/trash"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Filesystem"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/browse/trash"
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
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Filesystem"
          ],
          "operation": [
            "DELETE /2/vod/channels/{channel}/browse/trash"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Filesystem"
          ],
          "operation": [
            "DELETE /2/vod/channels/{channel}/browse/trash"
          ]
        }
      },
      "options": [
        {
          "displayName": "Files",
          "name": "query_files",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Filesystem"
          ],
          "operation": [
            "GET /2/vod/browse/{folder}"
          ]
        }
      },
      "required": true,
      "description": "The Folder unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Filesystem"
          ],
          "operation": [
            "GET /2/vod/browse/{folder}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Deep",
          "name": "query_deep",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Files",
          "name": "query_files",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Filesystem"
          ],
          "operation": [
            "GET /2/vod/browse/{folder}/breadcrumb"
          ]
        }
      },
      "required": true,
      "description": "The Folder unique identifier"
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Filesystem"
          ],
          "operation": [
            "GET /2/vod/browse/{folder}/tree"
          ]
        }
      },
      "required": true,
      "description": "The Folder unique identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Filesystem"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/browse/restore"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Files",
      "name": "body_files",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Filesystem"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/browse/restore"
          ]
        }
      },
      "required": true,
      "description": "A list of items, (either comma separated or as an array) (no duplicates) with the following rules: <note><bold>1</bold>: Identifier of an existing Bvf</note>"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Filesystem"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/browse/move"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Destination",
      "name": "body_destination",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Filesystem"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/browse/move"
          ]
        }
      },
      "required": true,
      "description": "Identifier of an existing Folder"
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
            "V3 > Filesystem"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/browse/move"
          ]
        }
      },
      "options": [
        {
          "displayName": "Files",
          "name": "body_files",
          "type": "string",
          "default": "",
          "description": "A list of items, (either comma separated or as an array) (no duplicates) with the following rules: <note><bold>1</bold>: Identifier of an existing Bvf</note>"
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
            "V3 > Folder"
          ]
        }
      },
      "options": [
        {
          "name": "Show Root Folder.",
          "value": "GET /2/vod/channels/{channel}/folders/root"
        },
        {
          "name": "List Folders.",
          "value": "GET /2/vod/channels/{channel}/folders"
        },
        {
          "name": "Create Folder.",
          "value": "POST /2/vod/channels/{channel}/folders"
        },
        {
          "name": "Show Folder Details.",
          "value": "GET /2/vod/folders/{folder}"
        },
        {
          "name": "Update Folder Details.",
          "value": "PUT /2/vod/folders/{folder}"
        },
        {
          "name": "Delete A Folder.",
          "value": "DELETE /2/vod/folders/{folder}"
        },
        {
          "name": "Synchronize Encodings For A Folder.",
          "value": "POST /2/vod/folders/{folder}/encodings"
        },
        {
          "name": "Attach Encodings To A Folder.",
          "value": "PUT /2/vod/folders/{folder}/encodings"
        },
        {
          "name": "Detach Encodings From A Folder.",
          "value": "DELETE /2/vod/folders/{folder}/encodings"
        },
        {
          "name": "Attach A Logo To A Folder.",
          "value": "PUT /2/vod/folders/{folder}/logo"
        },
        {
          "name": "Detach A Logo From A Folder.",
          "value": "DELETE /2/vod/folders/{folder}/logo"
        },
        {
          "name": "Attach Labels To A Folder.",
          "value": "PUT /2/vod/folders/{folder}/labels"
        },
        {
          "name": "Detach Labels From A Folder.",
          "value": "DELETE /2/vod/folders/{folder}/labels"
        },
        {
          "name": "Locks The Provided Folder.",
          "value": "PUT /2/vod/folders/{folder}/lock"
        },
        {
          "name": "Unlocks The Provided Folder.",
          "value": "PUT /2/vod/folders/{folder}/unlock"
        }
      ],
      "default": "GET /2/vod/channels/{channel}/folders/root",
      "noDataExpression": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Folder"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/folders/root"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Folder"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/folders"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Folder"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/folders"
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
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Folder"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/folders"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Folder"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/folders"
          ]
        }
      },
      "required": true,
      "description": "A valid filename without any file system reserved or control characters"
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
            "V3 > Folder"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/folders"
          ]
        }
      },
      "options": [
        {
          "displayName": "Allowed Country",
          "name": "body_allowed_country",
          "type": "json",
          "default": {},
          "description": "List of allowed countries by country code for the Folder"
        },
        {
          "displayName": "Allowed Domains",
          "name": "body_allowed_domains",
          "type": "json",
          "default": {},
          "description": "List of allowed domains for the Folder"
        },
        {
          "displayName": "Allowed Ip",
          "name": "body_allowed_ip",
          "type": "json",
          "default": {},
          "description": "List of allowed IP addresses for thest"
        },
        {
          "displayName": "Auto Generate Description",
          "name": "body_auto_generate_description",
          "type": "boolean",
          "default": false,
          "description": "Automatically generates a description with AI api for media uploaded in this Folder"
        },
        {
          "displayName": "Auto Generate Subtitle",
          "name": "body_auto_generate_subtitle",
          "type": "boolean",
          "default": false,
          "description": "Automatically generates subtitles with AI api for media uploaded in this Folder"
        },
        {
          "displayName": "Auto Generate Title",
          "name": "body_auto_generate_title",
          "type": "boolean",
          "default": false,
          "description": "Automatically generates a title with AI api for media uploaded in this Folder"
        },
        {
          "displayName": "Auto Publish",
          "name": "body_auto_publish",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether media in the Folder is automatically published"
        },
        {
          "displayName": "Auto Translate Languages",
          "name": "body_auto_translate_languages",
          "type": "json",
          "default": {},
          "description": "Automatically generate a list of subtitles with AI api in the given language(s) for media uploaded in this Folder"
        },
        {
          "displayName": "Auto Validate",
          "name": "body_auto_validate",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether media uploaded to this folder should be marked as validated automatically"
        },
        {
          "displayName": "Configuration",
          "name": "body_configuration",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Disallowed Country",
          "name": "body_disallowed_country",
          "type": "json",
          "default": {},
          "description": "List of disallowed countries by country code for the Folder"
        },
        {
          "displayName": "Disallowed Domains",
          "name": "body_disallowed_domains",
          "type": "json",
          "default": {},
          "description": "List of disallowed domains for the Folder"
        },
        {
          "displayName": "Disallowed Ip",
          "name": "body_disallowed_ip",
          "type": "json",
          "default": {},
          "description": "List of disallowed IP addresses for the Folder"
        },
        {
          "displayName": "Encodings",
          "name": "body_encodings",
          "type": "string",
          "default": "",
          "description": "A list of items, (either comma separated or as an array) (no duplicates) with the following rules: <note><bold>1</bold>: Identifier of an existing Encoding</note>"
        },
        {
          "displayName": "Inherits Encodings",
          "name": "body_inherits_encodings",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether the Folder inherits encodings from its parent"
        },
        {
          "displayName": "Inherits Labels",
          "name": "body_inherits_labels",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Inherits Media Processing",
          "name": "body_inherits_media_processing",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether the Folder inherits media processing settings from its parent"
        },
        {
          "displayName": "Inherits Restrictions",
          "name": "body_inherits_restrictions",
          "type": "boolean",
          "default": false,
          "description": "Defines whether or not the resource inherits restrictions settings"
        },
        {
          "displayName": "Key Restricted",
          "name": "body_key_restricted",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether the Folder is restricted with a key"
        },
        {
          "displayName": "Parent",
          "name": "body_parent",
          "type": "string",
          "default": "",
          "description": "Identifier of an existing Folder"
        },
        {
          "displayName": "Password",
          "name": "body_password",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Player",
          "name": "body_player",
          "type": "string",
          "default": "",
          "description": "Identifier of an existing Player"
        },
        {
          "displayName": "Replace On Upload",
          "name": "body_replace_on_upload",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether existing media is replaced upon upload"
        }
      ]
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Folder"
          ],
          "operation": [
            "GET /2/vod/folders/{folder}"
          ]
        }
      },
      "required": true,
      "description": "The Folder unique identifier"
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Folder"
          ],
          "operation": [
            "PUT /2/vod/folders/{folder}"
          ]
        }
      },
      "required": true,
      "description": "The Folder unique identifier"
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
            "V3 > Folder"
          ],
          "operation": [
            "PUT /2/vod/folders/{folder}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Allowed Country",
          "name": "body_allowed_country",
          "type": "json",
          "default": {},
          "description": "List of allowed countries by country code for the Folder"
        },
        {
          "displayName": "Allowed Domains",
          "name": "body_allowed_domains",
          "type": "json",
          "default": {},
          "description": "List of allowed domains for the Folder"
        },
        {
          "displayName": "Allowed Ip",
          "name": "body_allowed_ip",
          "type": "json",
          "default": {},
          "description": "List of allowed IP addresses for thest"
        },
        {
          "displayName": "Auto Generate Description",
          "name": "body_auto_generate_description",
          "type": "boolean",
          "default": false,
          "description": "Automatically generates a description with AI api for media uploaded in this Folder"
        },
        {
          "displayName": "Auto Generate Subtitle",
          "name": "body_auto_generate_subtitle",
          "type": "boolean",
          "default": false,
          "description": "Automatically generates subtitles with AI api for media uploaded in this Folder"
        },
        {
          "displayName": "Auto Generate Title",
          "name": "body_auto_generate_title",
          "type": "boolean",
          "default": false,
          "description": "Automatically generates a title with AI api for media uploaded in this Folder"
        },
        {
          "displayName": "Auto Publish",
          "name": "body_auto_publish",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether media in the Folder is automatically published"
        },
        {
          "displayName": "Auto Translate Languages",
          "name": "body_auto_translate_languages",
          "type": "json",
          "default": {},
          "description": "Automatically generate a list of subtitles with AI api in the given language(s) for media uploaded in this Folder"
        },
        {
          "displayName": "Auto Validate",
          "name": "body_auto_validate",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether media uploaded to this folder should be marked as validated automatically"
        },
        {
          "displayName": "Configuration",
          "name": "body_configuration",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Disallowed Country",
          "name": "body_disallowed_country",
          "type": "json",
          "default": {},
          "description": "List of disallowed countries by country code for the Folder"
        },
        {
          "displayName": "Disallowed Domains",
          "name": "body_disallowed_domains",
          "type": "json",
          "default": {},
          "description": "List of disallowed domains for the Folder"
        },
        {
          "displayName": "Disallowed Ip",
          "name": "body_disallowed_ip",
          "type": "json",
          "default": {},
          "description": "List of disallowed IP addresses for the Folder"
        },
        {
          "displayName": "Encodings",
          "name": "body_encodings",
          "type": "string",
          "default": "",
          "description": "A list of items, (either comma separated or as an array) (no duplicates) with the following rules: <note><bold>1</bold>: Identifier of an existing Encoding</note>"
        },
        {
          "displayName": "Inherits Encodings",
          "name": "body_inherits_encodings",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether the Folder inherits encodings from its parent"
        },
        {
          "displayName": "Inherits Labels",
          "name": "body_inherits_labels",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Inherits Media Processing",
          "name": "body_inherits_media_processing",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether the Folder inherits media processing settings from its parent"
        },
        {
          "displayName": "Inherits Restrictions",
          "name": "body_inherits_restrictions",
          "type": "boolean",
          "default": false,
          "description": "Defines whether or not the resource inherits restrictions settings"
        },
        {
          "displayName": "Key Restricted",
          "name": "body_key_restricted",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether the Folder is restricted with a key"
        },
        {
          "displayName": "Password",
          "name": "body_password",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Player",
          "name": "body_player",
          "type": "string",
          "default": "",
          "description": "Identifier of an existing Player"
        },
        {
          "displayName": "Replace On Upload",
          "name": "body_replace_on_upload",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether existing media is replaced upon upload"
        }
      ]
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Folder"
          ],
          "operation": [
            "DELETE /2/vod/folders/{folder}"
          ]
        }
      },
      "required": true,
      "description": "The Folder unique identifier"
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Folder"
          ],
          "operation": [
            "POST /2/vod/folders/{folder}/encodings"
          ]
        }
      },
      "required": true,
      "description": "The Folder unique identifier"
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
            "V3 > Folder"
          ],
          "operation": [
            "POST /2/vod/folders/{folder}/encodings"
          ]
        }
      },
      "options": [
        {
          "displayName": "Encodings",
          "name": "body_encodings",
          "type": "json",
          "default": {},
          "description": "The encodings associated with the Folder"
        }
      ]
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Folder"
          ],
          "operation": [
            "PUT /2/vod/folders/{folder}/encodings"
          ]
        }
      },
      "required": true,
      "description": "The Folder unique identifier"
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
            "V3 > Folder"
          ],
          "operation": [
            "PUT /2/vod/folders/{folder}/encodings"
          ]
        }
      },
      "options": [
        {
          "displayName": "Encodings",
          "name": "body_encodings",
          "type": "json",
          "default": {},
          "description": "The encodings associated with the Folder"
        }
      ]
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Folder"
          ],
          "operation": [
            "DELETE /2/vod/folders/{folder}/encodings"
          ]
        }
      },
      "required": true,
      "description": "The Folder unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Folder"
          ],
          "operation": [
            "DELETE /2/vod/folders/{folder}/encodings"
          ]
        }
      },
      "options": [
        {
          "displayName": "Encodings",
          "name": "query_encodings",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Folder"
          ],
          "operation": [
            "PUT /2/vod/folders/{folder}/logo"
          ]
        }
      },
      "required": true,
      "description": "The Folder unique identifier"
    },
    {
      "displayName": "Logo",
      "name": "body_logo",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Folder"
          ],
          "operation": [
            "PUT /2/vod/folders/{folder}/logo"
          ]
        }
      },
      "required": true,
      "description": "Identifier of an existing Logo"
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Folder"
          ],
          "operation": [
            "DELETE /2/vod/folders/{folder}/logo"
          ]
        }
      },
      "required": true,
      "description": "The Folder unique identifier"
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Folder"
          ],
          "operation": [
            "PUT /2/vod/folders/{folder}/labels"
          ]
        }
      },
      "required": true,
      "description": "The Folder unique identifier"
    },
    {
      "displayName": "Labels",
      "name": "body_labels",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Folder"
          ],
          "operation": [
            "PUT /2/vod/folders/{folder}/labels"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Folder"
          ],
          "operation": [
            "DELETE /2/vod/folders/{folder}/labels"
          ]
        }
      },
      "required": true,
      "description": "The Folder unique identifier"
    },
    {
      "displayName": "Labels",
      "name": "query_labels",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Folder"
          ],
          "operation": [
            "DELETE /2/vod/folders/{folder}/labels"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Folder"
          ],
          "operation": [
            "PUT /2/vod/folders/{folder}/lock"
          ]
        }
      },
      "required": true,
      "description": "The Folder unique identifier"
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Folder"
          ],
          "operation": [
            "PUT /2/vod/folders/{folder}/unlock"
          ]
        }
      },
      "required": true,
      "description": "The Folder unique identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Ftp"
          ]
        }
      },
      "options": [
        {
          "name": "List FTP Users.",
          "value": "GET /2/vod/channels/{channel}/ftpusers"
        },
        {
          "name": "Create FTP User.",
          "value": "POST /2/vod/channels/{channel}/ftpusers"
        },
        {
          "name": "Show FTP User Details.",
          "value": "GET /2/vod/ftpusers/{user}"
        },
        {
          "name": "Update FTP User Details.",
          "value": "PUT /2/vod/ftpusers/{user}"
        },
        {
          "name": "Delete FTP User.",
          "value": "DELETE /2/vod/ftpusers/{user}"
        },
        {
          "name": "Login.",
          "value": "POST /2/vod/ftp/login"
        },
        {
          "name": "On Connect Callback.",
          "value": "POST /2/vod/ftp/on/connect"
        },
        {
          "name": "On Disconnect Callback.",
          "value": "POST /2/vod/ftp/on/disconnect"
        },
        {
          "name": "On Login Callback.",
          "value": "POST /2/vod/ftp/on/login"
        },
        {
          "name": "On Login Failed Callback.",
          "value": "POST /2/vod/ftp/on/login-failed"
        },
        {
          "name": "On Logout Callback.",
          "value": "POST /2/vod/ftp/on/logout"
        }
      ],
      "default": "GET /2/vod/channels/{channel}/ftpusers",
      "noDataExpression": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Ftp"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/ftpusers"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Ftp"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/ftpusers"
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
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Ftp"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/ftpusers"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Password",
      "name": "body_password",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Ftp"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/ftpusers"
          ]
        }
      },
      "required": true,
      "description": "The {name} password"
    },
    {
      "displayName": "Username",
      "name": "body_username",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Ftp"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/ftpusers"
          ]
        }
      },
      "required": true,
      "description": "The {name} username used for connection"
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
            "V3 > Ftp"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/ftpusers"
          ]
        }
      },
      "options": [
        {
          "displayName": "Active",
          "name": "body_active",
          "type": "boolean",
          "default": false,
          "description": "Determine whether the {name} should be active."
        },
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": "",
          "description": "The {name} description (internal usage)"
        },
        {
          "displayName": "Home Folder",
          "name": "body_home_folder",
          "type": "string",
          "default": "",
          "description": "Identifier of an existing Folder"
        },
        {
          "displayName": "Msg Login",
          "name": "body_msg_login",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Msg Quit",
          "name": "body_msg_quit",
          "type": "string",
          "default": "",
          "description": "The message displayed when the users logs out of the ftp client."
        },
        {
          "displayName": "Prefix",
          "name": "body_prefix",
          "type": "string",
          "default": "",
          "description": "The prefix of the FtpUser"
        }
      ]
    },
    {
      "displayName": "User",
      "name": "path_user",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Ftp"
          ],
          "operation": [
            "GET /2/vod/ftpusers/{user}"
          ]
        }
      },
      "required": true,
      "description": "The FtpUser unique identifier"
    },
    {
      "displayName": "User",
      "name": "path_user",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Ftp"
          ],
          "operation": [
            "PUT /2/vod/ftpusers/{user}"
          ]
        }
      },
      "required": true,
      "description": "The FtpUser unique identifier"
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
            "V3 > Ftp"
          ],
          "operation": [
            "PUT /2/vod/ftpusers/{user}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Active",
          "name": "body_active",
          "type": "boolean",
          "default": false,
          "description": "Determine whether the {name} should be active."
        },
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": "",
          "description": "The {name} description (internal usage)"
        },
        {
          "displayName": "Home Folder",
          "name": "body_home_folder",
          "type": "string",
          "default": "",
          "description": "Identifier of an existing Folder"
        },
        {
          "displayName": "Msg Login",
          "name": "body_msg_login",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Msg Quit",
          "name": "body_msg_quit",
          "type": "string",
          "default": "",
          "description": "The message displayed when the users logs out of the ftp client."
        },
        {
          "displayName": "Password",
          "name": "body_password",
          "type": "string",
          "default": "",
          "description": "The {name} password"
        },
        {
          "displayName": "Prefix",
          "name": "body_prefix",
          "type": "string",
          "default": "",
          "description": "The prefix of the FtpUser"
        },
        {
          "displayName": "Username",
          "name": "body_username",
          "type": "string",
          "default": "",
          "description": "The {name} username used for connection"
        }
      ]
    },
    {
      "displayName": "User",
      "name": "path_user",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Ftp"
          ],
          "operation": [
            "DELETE /2/vod/ftpusers/{user}"
          ]
        }
      },
      "required": true,
      "description": "The FtpUser unique identifier"
    },
    {
      "displayName": "Password",
      "name": "body_password",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Ftp"
          ],
          "operation": [
            "POST /2/vod/ftp/login"
          ]
        }
      },
      "required": true,
      "description": "The login's password."
    },
    {
      "displayName": "Username",
      "name": "body_username",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Ftp"
          ],
          "operation": [
            "POST /2/vod/ftp/login"
          ]
        }
      },
      "required": true,
      "description": "The username of the Login"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Journal"
          ]
        }
      },
      "options": [
        {
          "name": "Get Media Journal.",
          "value": "GET /2/vod/media/{media}/journal"
        },
        {
          "name": "Get Journal.",
          "value": "GET /2/vod/channels/{channel}/journal"
        }
      ],
      "default": "GET /2/vod/media/{media}/journal",
      "noDataExpression": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Journal"
          ],
          "operation": [
            "GET /2/vod/media/{media}/journal"
          ]
        }
      },
      "required": true,
      "description": "The Media unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Journal"
          ],
          "operation": [
            "GET /2/vod/media/{media}/journal"
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
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Journal"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/journal"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Journal"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/journal"
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
            "V3 > Label"
          ]
        }
      },
      "options": [
        {
          "name": "List Labels.",
          "value": "GET /2/vod/channels/{channel}/labels"
        },
        {
          "name": "Bulk Attach Labels.",
          "value": "POST /2/vod/channels/{channel}/labels"
        },
        {
          "name": "Bulk Delete Labels.",
          "value": "DELETE /2/vod/channels/{channel}/labels"
        },
        {
          "name": "Show Label Details.",
          "value": "GET /2/vod/labels/{genericLabel}"
        },
        {
          "name": "Update Label.",
          "value": "PUT /2/vod/labels/{genericLabel}"
        },
        {
          "name": "Delete Label.",
          "value": "DELETE /2/vod/labels/{genericLabel}"
        }
      ],
      "default": "GET /2/vod/channels/{channel}/labels",
      "noDataExpression": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Label"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/labels"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Label"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/labels"
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
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Label"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/labels"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
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
            "V3 > Label"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/labels"
          ]
        }
      },
      "options": [
        {
          "displayName": "Folders",
          "name": "body_folders",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Labels",
          "name": "body_labels",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Media",
          "name": "body_media",
          "type": "json",
          "default": {},
          "description": "The media unique identifier"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Label"
          ],
          "operation": [
            "DELETE /2/vod/channels/{channel}/labels"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Labels",
      "name": "query_labels",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Label"
          ],
          "operation": [
            "DELETE /2/vod/channels/{channel}/labels"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "GenericLabel",
      "name": "path_genericLabel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Label"
          ],
          "operation": [
            "GET /2/vod/labels/{genericLabel}"
          ]
        }
      },
      "required": true,
      "description": "The GenericLabel unique identifier"
    },
    {
      "displayName": "GenericLabel",
      "name": "path_genericLabel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Label"
          ],
          "operation": [
            "PUT /2/vod/labels/{genericLabel}"
          ]
        }
      },
      "required": true,
      "description": "The GenericLabel unique identifier"
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
            "V3 > Label"
          ],
          "operation": [
            "PUT /2/vod/labels/{genericLabel}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Options",
          "name": "body_options",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "GenericLabel",
      "name": "path_genericLabel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Label"
          ],
          "operation": [
            "DELETE /2/vod/labels/{genericLabel}"
          ]
        }
      },
      "required": true,
      "description": "The GenericLabel unique identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Language"
          ]
        }
      },
      "options": [
        {
          "name": "List Languages.",
          "value": "GET /2/vod/lang"
        },
        {
          "name": "Show Language Details.",
          "value": "GET /2/vod/lang/{lang}"
        }
      ],
      "default": "GET /2/vod/lang",
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
            "V3 > Language"
          ],
          "operation": [
            "GET /2/vod/lang"
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
      "displayName": "Lang",
      "name": "path_lang",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Language"
          ],
          "operation": [
            "GET /2/vod/lang/{lang}"
          ]
        }
      },
      "required": true,
      "description": "The Language unique identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > LinkedSvc"
          ]
        }
      },
      "options": [
        {
          "name": "Sync Linked Services.",
          "value": "POST /2/vod/channels/{channel}/services"
        }
      ],
      "default": "POST /2/vod/channels/{channel}/services",
      "noDataExpression": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > LinkedSvc"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/services"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
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
            "V3 > LinkedSvc"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/services"
          ]
        }
      },
      "options": [
        {
          "displayName": "Linked Services",
          "name": "body_linked_services",
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
            "V3 > Logo"
          ]
        }
      },
      "options": [
        {
          "name": "List Logos.",
          "value": "GET /2/vod/channels/{channel}/logos"
        },
        {
          "name": "Create A New Logo.",
          "value": "POST /2/vod/channels/{channel}/logos"
        },
        {
          "name": "Bulk Delete Logos.",
          "value": "DELETE /2/vod/channels/{channel}/logos"
        },
        {
          "name": "Show Logo Details.",
          "value": "GET /2/vod/logos/{logo}"
        },
        {
          "name": "Update Logo Details.",
          "value": "PUT /2/vod/logos/{logo}"
        },
        {
          "name": "Delete A Logo.",
          "value": "DELETE /2/vod/logos/{logo}"
        }
      ],
      "default": "GET /2/vod/channels/{channel}/logos",
      "noDataExpression": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Logo"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/logos"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Logo"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/logos"
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
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Logo"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/logos"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "File",
      "name": "body_file",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Logo"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/logos"
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
            "V3 > Logo"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/logos"
          ]
        }
      },
      "options": [
        {
          "displayName": "Height",
          "name": "body_height",
          "type": "number",
          "default": 0,
          "description": "The height of Logo"
        },
        {
          "displayName": "Margin X",
          "name": "body_margin_x",
          "type": "number",
          "default": 0,
          "description": "The margin on the x-axis of the Logo"
        },
        {
          "displayName": "Margin Y",
          "name": "body_margin_y",
          "type": "number",
          "default": 0,
          "description": "The margin on the y-axis of the Logo"
        },
        {
          "displayName": "Mode",
          "name": "body_mode",
          "type": "string",
          "default": "",
          "description": "The {name} mode<note><strong>overlay</strong>: The logo is added on top of the video by a player configuration</note><note><strong>embed</strong>: The logo is directly encoded in the video</note>"
        },
        {
          "displayName": "Position",
          "name": "body_position",
          "type": "string",
          "default": "",
          "description": "The anchor of the {name}<note><strong>top_left</strong>: Positioned at the top left corner</note><note><strong>top_middle</strong>: Positioned at the top middle</note><note><strong>top_right</strong>: Positioned at the top right corner</note><note><strong>center_left</strong>: Positioned at the center left</note><note><strong>center_middle</strong>: Positioned at the center middle</note><note><strong>center_right</strong>: Positioned at the center right</note><note><strong>bottom_left</strong>: Positioned at the bottom left corner</note><note><strong>bottom_middle</strong>: Positioned at the bottom middle</note><note><strong>bottom_right</strong>: Positioned at the bottom right corner</note>"
        },
        {
          "displayName": "Size",
          "name": "body_size",
          "type": "number",
          "default": 0,
          "description": "The size of the {name} in percentage"
        },
        {
          "displayName": "Width",
          "name": "body_width",
          "type": "number",
          "default": 0,
          "description": "The width of Logo"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Logo"
          ],
          "operation": [
            "DELETE /2/vod/channels/{channel}/logos"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Logo"
          ],
          "operation": [
            "DELETE /2/vod/channels/{channel}/logos"
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
          "displayName": "Margin X",
          "name": "query_margin_x",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Margin Y",
          "name": "query_margin_y",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Mode",
          "name": "query_mode",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Position",
          "name": "query_position",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Size",
          "name": "query_size",
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
      "displayName": "Logo",
      "name": "path_logo",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Logo"
          ],
          "operation": [
            "GET /2/vod/logos/{logo}"
          ]
        }
      },
      "required": true,
      "description": "The Logo unique identifier"
    },
    {
      "displayName": "Logo",
      "name": "path_logo",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Logo"
          ],
          "operation": [
            "PUT /2/vod/logos/{logo}"
          ]
        }
      },
      "required": true,
      "description": "The Logo unique identifier"
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
            "V3 > Logo"
          ],
          "operation": [
            "PUT /2/vod/logos/{logo}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Height",
          "name": "body_height",
          "type": "number",
          "default": 0,
          "description": "The height of Logo"
        },
        {
          "displayName": "Margin X",
          "name": "body_margin_x",
          "type": "number",
          "default": 0,
          "description": "The margin on the x-axis of the Logo"
        },
        {
          "displayName": "Margin Y",
          "name": "body_margin_y",
          "type": "number",
          "default": 0,
          "description": "The margin on the y-axis of the Logo"
        },
        {
          "displayName": "Mode",
          "name": "body_mode",
          "type": "string",
          "default": "",
          "description": "The {name} mode<note><strong>overlay</strong>: The logo is added on top of the video by a player configuration</note><note><strong>embed</strong>: The logo is directly encoded in the video</note>"
        },
        {
          "displayName": "Position",
          "name": "body_position",
          "type": "string",
          "default": "",
          "description": "The anchor of the {name}<note><strong>top_left</strong>: Positioned at the top left corner</note><note><strong>top_middle</strong>: Positioned at the top middle</note><note><strong>top_right</strong>: Positioned at the top right corner</note><note><strong>center_left</strong>: Positioned at the center left</note><note><strong>center_middle</strong>: Positioned at the center middle</note><note><strong>center_right</strong>: Positioned at the center right</note><note><strong>bottom_left</strong>: Positioned at the bottom left corner</note><note><strong>bottom_middle</strong>: Positioned at the bottom middle</note><note><strong>bottom_right</strong>: Positioned at the bottom right corner</note>"
        },
        {
          "displayName": "Size",
          "name": "body_size",
          "type": "number",
          "default": 0,
          "description": "The size of the {name} in percentage"
        },
        {
          "displayName": "Width",
          "name": "body_width",
          "type": "number",
          "default": 0,
          "description": "The width of Logo"
        }
      ]
    },
    {
      "displayName": "Logo",
      "name": "path_logo",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Logo"
          ],
          "operation": [
            "DELETE /2/vod/logos/{logo}"
          ]
        }
      },
      "required": true,
      "description": "The Logo unique identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Media"
          ]
        }
      },
      "options": [
        {
          "name": "List Media.",
          "value": "GET /2/vod/channels/{channel}/media"
        },
        {
          "name": "Get Media Statuses Counters.",
          "value": "GET /2/vod/channels/{channel}/media/status"
        },
        {
          "name": "Show Media Details.",
          "value": "GET /2/vod/media/{media}"
        },
        {
          "name": "Update Media Details.",
          "value": "PUT /2/vod/media/{media}"
        },
        {
          "name": "Get Metadata From A Media.",
          "value": "GET /2/vod/media/{media}/metadata"
        },
        {
          "name": "Update Metadata From A Media.",
          "value": "PUT /2/vod/media/{media}/metadata"
        },
        {
          "name": "Deletes Metadata From A Media.",
          "value": "DELETE /2/vod/media/{media}/metadata"
        },
        {
          "name": "Share Media.",
          "value": "POST /2/vod/media/{media}/shares"
        },
        {
          "name": "Bulk Delete Media Shares.",
          "value": "DELETE /2/vod/media/{media}/shares"
        },
        {
          "name": "Attach Suggested Media.",
          "value": "POST /2/vod/media/{media}/suggest"
        },
        {
          "name": "Attach Labels To A Media.",
          "value": "PUT /2/vod/media/{media}/labels"
        },
        {
          "name": "Detach Labels From A Media.",
          "value": "DELETE /2/vod/media/{media}/labels"
        }
      ],
      "default": "GET /2/vod/channels/{channel}/media",
      "noDataExpression": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Media"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/media"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Media"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/media"
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
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Media"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/media/status"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Media"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/media/status"
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
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Media"
          ],
          "operation": [
            "GET /2/vod/media/{media}"
          ]
        }
      },
      "required": true,
      "description": "The Media unique identifier"
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Media"
          ],
          "operation": [
            "PUT /2/vod/media/{media}"
          ]
        }
      },
      "required": true,
      "description": "The Media unique identifier"
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
            "V3 > Media"
          ],
          "operation": [
            "PUT /2/vod/media/{media}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Configuration",
          "name": "body_configuration",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": "",
          "description": "A brief {name} description (only for internal use)"
        },
        {
          "displayName": "Destination",
          "name": "body_destination",
          "type": "string",
          "default": "",
          "description": "Identifier of an existing Folder"
        },
        {
          "displayName": "Language",
          "name": "body_language",
          "type": "string",
          "default": "",
          "description": "Identifier of an existing Language"
        },
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "The {name} name"
        },
        {
          "displayName": "Password",
          "name": "body_password",
          "type": "string",
          "default": "",
          "description": "password restricting the media access in the player"
        },
        {
          "displayName": "Published",
          "name": "body_published",
          "type": "boolean",
          "default": false,
          "description": "Defines whether the {name} has been published.<br/><note>If the media is not published, it cannot be shared.</note>"
        },
        {
          "displayName": "Validated",
          "name": "body_validated",
          "type": "boolean",
          "default": false,
          "description": "A custom flag to help the user to manager its videos.<br/><note>Only for management purposes.</note>"
        }
      ]
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Media"
          ],
          "operation": [
            "GET /2/vod/media/{media}/metadata"
          ]
        }
      },
      "required": true,
      "description": "The Media unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Media"
          ],
          "operation": [
            "GET /2/vod/media/{media}/metadata"
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
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Media"
          ],
          "operation": [
            "PUT /2/vod/media/{media}/metadata"
          ]
        }
      },
      "required": true,
      "description": "The Media unique identifier"
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
            "V3 > Media"
          ],
          "operation": [
            "PUT /2/vod/media/{media}/metadata"
          ]
        }
      },
      "options": [
        {
          "displayName": "Album",
          "name": "body_album",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Artist",
          "name": "body_artist",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Genre",
          "name": "body_genre",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Title",
          "name": "body_title",
          "type": "json",
          "default": {},
          "description": "a simple string"
        },
        {
          "displayName": "Year",
          "name": "body_year",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Media"
          ],
          "operation": [
            "DELETE /2/vod/media/{media}/metadata"
          ]
        }
      },
      "required": true,
      "description": "The Media unique identifier"
    },
    {
      "displayName": "Labels",
      "name": "query_labels",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Media"
          ],
          "operation": [
            "DELETE /2/vod/media/{media}/metadata"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Media"
          ],
          "operation": [
            "POST /2/vod/media/{media}/shares"
          ]
        }
      },
      "required": true,
      "description": "The Media unique identifier"
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
            "V3 > Media"
          ],
          "operation": [
            "POST /2/vod/media/{media}/shares"
          ]
        }
      },
      "options": [
        {
          "displayName": "Comment",
          "name": "body_comment",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Encoding",
          "name": "body_encoding",
          "type": "string",
          "default": "",
          "description": "Identifier of an existing Encoding"
        },
        {
          "displayName": "Player",
          "name": "body_player",
          "type": "string",
          "default": "",
          "description": "Identifier of an existing Player"
        },
        {
          "displayName": "Player Settings",
          "name": "body_player_settings",
          "type": "json",
          "default": {},
          "description": "Allowed array or object keys"
        },
        {
          "displayName": "Timestamp",
          "name": "body_timestamp",
          "type": "number",
          "default": 0,
          "description": "The timestamp of the starting frame to share the media from."
        },
        {
          "displayName": "Validity",
          "name": "body_validity",
          "type": "number",
          "default": 0,
          "description": "The {name} validity duration (in seconds)"
        }
      ]
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Media"
          ],
          "operation": [
            "DELETE /2/vod/media/{media}/shares"
          ]
        }
      },
      "required": true,
      "description": "The Media unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Media"
          ],
          "operation": [
            "DELETE /2/vod/media/{media}/shares"
          ]
        }
      },
      "options": [
        {
          "displayName": "Shares",
          "name": "query_shares",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Media"
          ],
          "operation": [
            "POST /2/vod/media/{media}/suggest"
          ]
        }
      },
      "required": true,
      "description": "The Media unique identifier"
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
            "V3 > Media"
          ],
          "operation": [
            "POST /2/vod/media/{media}/suggest"
          ]
        }
      },
      "options": [
        {
          "displayName": "Media",
          "name": "body_media",
          "type": "string",
          "default": "",
          "description": "A list of items, (either comma separated or as an array) (no duplicates) with the following rules: <note><bold>1</bold>: Identifier of an existing Media</note>"
        }
      ]
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Media"
          ],
          "operation": [
            "PUT /2/vod/media/{media}/labels"
          ]
        }
      },
      "required": true,
      "description": "The Media unique identifier"
    },
    {
      "displayName": "Labels",
      "name": "body_labels",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Media"
          ],
          "operation": [
            "PUT /2/vod/media/{media}/labels"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Media"
          ],
          "operation": [
            "DELETE /2/vod/media/{media}/labels"
          ]
        }
      },
      "required": true,
      "description": "The Media unique identifier"
    },
    {
      "displayName": "Labels",
      "name": "query_labels",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Media"
          ],
          "operation": [
            "DELETE /2/vod/media/{media}/labels"
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
            "V3 > Metadata"
          ]
        }
      },
      "options": [
        {
          "name": "List Metadata.",
          "value": "GET /2/vod/channels/{channel}/metadata"
        },
        {
          "name": "Bulk Attach Metadata.",
          "value": "POST /2/vod/channels/{channel}/metadata"
        },
        {
          "name": "Bulk Delete Metadata.",
          "value": "DELETE /2/vod/channels/{channel}/metadata"
        },
        {
          "name": "Update Metadata.",
          "value": "PUT /2/vod/metadata/{metadata}"
        },
        {
          "name": "Delete Metadata.",
          "value": "DELETE /2/vod/metadata/{metadata}"
        }
      ],
      "default": "GET /2/vod/channels/{channel}/metadata",
      "noDataExpression": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Metadata"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/metadata"
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
            "V3 > Metadata"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/metadata"
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
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Metadata"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/metadata"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
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
            "V3 > Metadata"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/metadata"
          ]
        }
      },
      "options": [
        {
          "displayName": "Folders",
          "name": "body_folders",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Media",
          "name": "body_media",
          "type": "json",
          "default": {},
          "description": "The media unique identifier"
        },
        {
          "displayName": "Metadata",
          "name": "body_metadata",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Metadata"
          ],
          "operation": [
            "DELETE /2/vod/channels/{channel}/metadata"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Metadata",
      "name": "query_metadata",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Metadata"
          ],
          "operation": [
            "DELETE /2/vod/channels/{channel}/metadata"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Metadata",
      "name": "path_metadata",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Metadata"
          ],
          "operation": [
            "PUT /2/vod/metadata/{metadata}"
          ]
        }
      },
      "required": true,
      "description": "The MetadataLabel unique identifier"
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
            "V3 > Metadata"
          ],
          "operation": [
            "PUT /2/vod/metadata/{metadata}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Options",
          "name": "body_options",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Metadata",
      "name": "path_metadata",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Metadata"
          ],
          "operation": [
            "DELETE /2/vod/metadata/{metadata}"
          ]
        }
      },
      "required": true,
      "description": "The MetadataLabel unique identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Mixtape"
          ]
        }
      },
      "options": [
        {
          "name": "List Mixtapes.",
          "value": "GET /2/vod/channels/{channel}/mixtapes"
        },
        {
          "name": "Create A Mixtape.",
          "value": "POST /2/vod/channels/{channel}/mixtapes"
        },
        {
          "name": "Bulk Delete Mixtapes.",
          "value": "DELETE /2/vod/channels/{channel}/mixtapes"
        },
        {
          "name": "Show Mixtape Details.",
          "value": "GET /2/vod/mixtapes/{mixtape}"
        },
        {
          "name": "Update A Mixtape.",
          "value": "PUT /2/vod/mixtapes/{mixtape}"
        },
        {
          "name": "Delete A Mixtape.",
          "value": "DELETE /2/vod/mixtapes/{mixtape}"
        },
        {
          "name": "List Media In Mixtape.",
          "value": "GET /2/vod/mixtapes/{mixtape}/media"
        },
        {
          "name": "Attach Direct Media.",
          "value": "PUT /2/vod/mixtapes/{mixtape}/media"
        },
        {
          "name": "Detach Direct Media.",
          "value": "DELETE /2/vod/mixtapes/{mixtape}/media"
        },
        {
          "name": "Move A Manually Attached Media In Mixtape.",
          "value": "POST /2/vod/mixtapes/{mixtape}/media/{media}/move"
        }
      ],
      "default": "GET /2/vod/channels/{channel}/mixtapes",
      "noDataExpression": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Mixtape"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/mixtapes"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Mixtape"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/mixtapes"
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
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Mixtape"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/mixtapes"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Mixtape"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/mixtapes"
          ]
        }
      },
      "required": true,
      "description": "The name of the Mixtape"
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
            "V3 > Mixtape"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/mixtapes"
          ]
        }
      },
      "options": [
        {
          "displayName": "Color",
          "name": "body_color",
          "type": "string",
          "default": "",
          "description": "Mixtape color"
        },
        {
          "displayName": "Criteria",
          "name": "body_criteria",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Order",
          "name": "body_order",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Validity",
          "name": "body_validity",
          "type": "number",
          "default": 0,
          "description": "The {name} validity duration (in seconds)"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Mixtape"
          ],
          "operation": [
            "DELETE /2/vod/channels/{channel}/mixtapes"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Mixtapes",
      "name": "query_mixtapes",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Mixtape"
          ],
          "operation": [
            "DELETE /2/vod/channels/{channel}/mixtapes"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Mixtape",
      "name": "path_mixtape",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Mixtape"
          ],
          "operation": [
            "GET /2/vod/mixtapes/{mixtape}"
          ]
        }
      },
      "required": true,
      "description": "The Mixtape unique identifier"
    },
    {
      "displayName": "Mixtape",
      "name": "path_mixtape",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Mixtape"
          ],
          "operation": [
            "PUT /2/vod/mixtapes/{mixtape}"
          ]
        }
      },
      "required": true,
      "description": "The Mixtape unique identifier"
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
            "V3 > Mixtape"
          ],
          "operation": [
            "PUT /2/vod/mixtapes/{mixtape}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Color",
          "name": "body_color",
          "type": "string",
          "default": "",
          "description": "Mixtape color"
        },
        {
          "displayName": "Criteria",
          "name": "body_criteria",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "The name of the Mixtape"
        },
        {
          "displayName": "Order",
          "name": "body_order",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Validity",
          "name": "body_validity",
          "type": "number",
          "default": 0,
          "description": "The {name} validity duration (in seconds)"
        }
      ]
    },
    {
      "displayName": "Mixtape",
      "name": "path_mixtape",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Mixtape"
          ],
          "operation": [
            "DELETE /2/vod/mixtapes/{mixtape}"
          ]
        }
      },
      "required": true,
      "description": "The Mixtape unique identifier"
    },
    {
      "displayName": "Mixtape",
      "name": "path_mixtape",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Mixtape"
          ],
          "operation": [
            "GET /2/vod/mixtapes/{mixtape}/media"
          ]
        }
      },
      "required": true,
      "description": "The Mixtape unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Mixtape"
          ],
          "operation": [
            "GET /2/vod/mixtapes/{mixtape}/media"
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
      "displayName": "Mixtape",
      "name": "path_mixtape",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Mixtape"
          ],
          "operation": [
            "PUT /2/vod/mixtapes/{mixtape}/media"
          ]
        }
      },
      "required": true,
      "description": "The Mixtape unique identifier"
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
            "V3 > Mixtape"
          ],
          "operation": [
            "PUT /2/vod/mixtapes/{mixtape}/media"
          ]
        }
      },
      "options": [
        {
          "displayName": "Deep",
          "name": "body_deep",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Folders",
          "name": "body_folders",
          "type": "json",
          "default": {},
          "description": " Attach all media in these folders"
        },
        {
          "displayName": "Media",
          "name": "body_media",
          "type": "json",
          "default": {},
          "description": "The media unique identifier"
        }
      ]
    },
    {
      "displayName": "Mixtape",
      "name": "path_mixtape",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Mixtape"
          ],
          "operation": [
            "DELETE /2/vod/mixtapes/{mixtape}/media"
          ]
        }
      },
      "required": true,
      "description": "The Mixtape unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Mixtape"
          ],
          "operation": [
            "DELETE /2/vod/mixtapes/{mixtape}/media"
          ]
        }
      },
      "options": [
        {
          "displayName": "Media",
          "name": "query_media",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Mixtape",
      "name": "path_mixtape",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Mixtape"
          ],
          "operation": [
            "POST /2/vod/mixtapes/{mixtape}/media/{media}/move"
          ]
        }
      },
      "required": true,
      "description": "The Mixtape unique identifier"
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Mixtape"
          ],
          "operation": [
            "POST /2/vod/mixtapes/{mixtape}/media/{media}/move"
          ]
        }
      },
      "required": true,
      "description": "The Media unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Mixtape"
          ],
          "operation": [
            "POST /2/vod/mixtapes/{mixtape}/media/{media}/move"
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
      "displayName": "Position",
      "name": "body_position",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Mixtape"
          ],
          "operation": [
            "POST /2/vod/mixtapes/{mixtape}/media/{media}/move"
          ]
        }
      },
      "required": true,
      "description": " the position you want to place the media at"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Player"
          ]
        }
      },
      "options": [
        {
          "name": "List Players.",
          "value": "GET /2/vod/channels/{channel}/players"
        },
        {
          "name": "Create Player.",
          "value": "POST /2/vod/channels/{channel}/players"
        },
        {
          "name": "Bulk Delete Players.",
          "value": "DELETE /2/vod/channels/{channel}/players"
        },
        {
          "name": "Show Player Details.",
          "value": "GET /2/vod/players/{player}"
        },
        {
          "name": "Update Player Details.",
          "value": "PUT /2/vod/players/{player}"
        },
        {
          "name": "Delete Player.",
          "value": "DELETE /2/vod/players/{player}"
        }
      ],
      "default": "GET /2/vod/channels/{channel}/players",
      "noDataExpression": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Player"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/players"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Player"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/players"
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
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Player"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/players"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Player"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/players"
          ]
        }
      },
      "required": true,
      "description": "a simple string"
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
            "V3 > Player"
          ],
          "operation": [
            "POST /2/vod/channels/{channel}/players"
          ]
        }
      },
      "options": [
        {
          "displayName": "Ads Category",
          "name": "body_ads_category",
          "type": "string",
          "default": "",
          "description": "<note><strong>vast</strong>: The advertisement is from a vast</note><note><strong>video</strong>: The advertisement is from a video</note><note><strong>none</strong>: There is no advertisement</note>"
        },
        {
          "displayName": "Airplay",
          "name": "body_airplay",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Audio Volume",
          "name": "body_audio_volume",
          "type": "number",
          "default": 0,
          "description": "The volume of the audio for the Player"
        },
        {
          "displayName": "Auto Hide Controls",
          "name": "body_auto_hide_controls",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether controls should automatically hide for the Player"
        },
        {
          "displayName": "Auto Start",
          "name": "body_auto_start",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether media should start automatically for the Player"
        },
        {
          "displayName": "Chromecast",
          "name": "body_chromecast",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether Chromecast is enabled for the Player"
        },
        {
          "displayName": "Control Active Color",
          "name": "body_control_active_color",
          "type": "string",
          "default": "",
          "description": "Controlbar color"
        },
        {
          "displayName": "Control Color",
          "name": "body_control_color",
          "type": "string",
          "default": "",
          "description": "Control color"
        },
        {
          "displayName": "Controlbar Color",
          "name": "body_controlbar_color",
          "type": "string",
          "default": "",
          "description": "Active control color"
        },
        {
          "displayName": "Default",
          "name": "body_default",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether the Player is set as default"
        },
        {
          "displayName": "Default Speed",
          "name": "body_default_speed",
          "type": "number",
          "default": 0,
          "description": "The default speed of playback for the Player"
        },
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Enable Embed Code",
          "name": "body_enable_embed_code",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether embed code is enabled for the Player"
        },
        {
          "displayName": "Enable Facebook",
          "name": "body_enable_facebook",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether Facebook sharing is enabled for the Player"
        },
        {
          "displayName": "Enable Linkedin",
          "name": "body_enable_linkedin",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Enable Twitter",
          "name": "body_enable_twitter",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether Twitter sharing is enabled for the Player"
        },
        {
          "displayName": "Enable Whatsapp",
          "name": "body_enable_whatsapp",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Encoding Change Enabled",
          "name": "body_encoding_change_enabled",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether encoding change is enabled for the Player"
        },
        {
          "displayName": "Encoding Limit",
          "name": "body_encoding_limit",
          "type": "boolean",
          "default": false,
          "description": "The encoding limit for the Player"
        },
        {
          "displayName": "Facebook Back Link",
          "name": "body_facebook_back_link",
          "type": "string",
          "default": "",
          "description": "A public resolvable url"
        },
        {
          "displayName": "Force Media Ratio",
          "name": "body_force_media_ratio",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether media ratio is enforced for the Player"
        },
        {
          "displayName": "Force Subtitles Activated",
          "name": "body_force_subtitles_activated",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Force Subtitles Type",
          "name": "body_force_subtitles_type",
          "type": "string",
          "default": "",
          "description": "<note><strong>lang_navigator</strong>: The subtitles will try to match the browser lang</note><note><strong>lang_manager</strong>: Force the subtitles will try to match the manager lang</note>"
        },
        {
          "displayName": "Geoip Image",
          "name": "body_geoip_image",
          "type": "string",
          "default": "",
          "description": "The GeoIP image associated with the Player"
        },
        {
          "displayName": "Has Logo",
          "name": "body_has_logo",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Height",
          "name": "body_height",
          "type": "number",
          "default": 0,
          "description": "The height of Player"
        },
        {
          "displayName": "Interrupt Image",
          "name": "body_interrupt_image",
          "type": "string",
          "default": "",
          "description": "The interrupt image associated with the Player"
        },
        {
          "displayName": "Is360",
          "name": "body_is360",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether the Player supports 360-degree videos"
        },
        {
          "displayName": "Is Default",
          "name": "body_is_default",
          "type": "boolean",
          "default": false,
          "description": "Indicates if the Player is the default one when sharing"
        },
        {
          "displayName": "Logo Anchor",
          "name": "body_logo_anchor",
          "type": "string",
          "default": "",
          "description": "The anchor of the overlay logo<note><strong>top_left</strong>: Positioned at the top-left corner</note><note><strong>top_right</strong>: Positioned at the top-right corner</note><note><strong>bottom_left</strong>: Positioned at the bottom-left corner</note><note><strong>bottom_right</strong>: Positioned at the bottom-right corner</note><note><strong>center</strong>: Positioned at the center of the container or screen</note><note><strong>none</strong>: Not positioned on the container or screen</note>"
        },
        {
          "displayName": "Logo Image",
          "name": "body_logo_image",
          "type": "string",
          "default": "",
          "description": "The logo image associated with the Player"
        },
        {
          "displayName": "Logo Margin Horizontal",
          "name": "body_logo_margin_horizontal",
          "type": "number",
          "default": 0,
          "description": "The horizontal margin of the Player logo"
        },
        {
          "displayName": "Logo Margin Vertical",
          "name": "body_logo_margin_vertical",
          "type": "number",
          "default": 0,
          "description": "The vertical margin of the Player logo"
        },
        {
          "displayName": "Logo Percentage",
          "name": "body_logo_percentage",
          "type": "number",
          "default": 0,
          "description": "The size percentage of the Player logo"
        },
        {
          "displayName": "Media Thumbnail Anchor",
          "name": "body_media_thumbnail_anchor",
          "type": "options",
          "default": "",
          "description": "The media thumbnail anchor<note><strong>top</strong>: Positioned on top</note><note><strong>left</strong>: Positioned on the left side</note>",
          "options": [
            {
              "name": "left",
              "value": "left"
            },
            {
              "name": "top",
              "value": "top"
            }
          ]
        },
        {
          "displayName": "Player End Screen Type",
          "name": "body_player_end_screen_type",
          "type": "string",
          "default": "",
          "description": "<note><strong>pause_and_replay</strong>: We will show pause and replay buttons</note><note><strong>auto_loop</strong>: The video will automatically loop</note><note><strong>suggest_more_media</strong>: Will suggest many video as ending screen</note><note><strong>suggest_next_media</strong>: Will suggest one video as ending screen</note>"
        },
        {
          "displayName": "Preferred Playback Strategy",
          "name": "body_preferred_playback_strategy",
          "type": "string",
          "default": "",
          "description": "The preferred playback strategy (may not be enforced)<note><strong>hls</strong>: Apple HTTP Live Streaming</note><note><strong>dash</strong>: Dynamic Adaptive Streaming over HTTP</note><note><strong>single</strong>: Single bitrate</note><note><strong>best</strong>: Playback strategy selecting the best available quality dynamically</note>"
        },
        {
          "displayName": "Preferred Playback Strategy Activated",
          "name": "body_preferred_playback_strategy_activated",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Preload Image",
          "name": "body_preload_image",
          "type": "string",
          "default": "",
          "description": "The preload image associated with the Player"
        },
        {
          "displayName": "Restrict Image",
          "name": "body_restrict_image",
          "type": "string",
          "default": "",
          "description": "The restrict image associated with the Player"
        },
        {
          "displayName": "Show Audio",
          "name": "body_show_audio",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether audio controls should be shown for the Player"
        },
        {
          "displayName": "Show Controls",
          "name": "body_show_controls",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether controls should be shown for the Player"
        },
        {
          "displayName": "Show Default Logo",
          "name": "body_show_default_logo",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether the default logo should be shown for the Player"
        },
        {
          "displayName": "Show Download",
          "name": "body_show_download",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Show Duration",
          "name": "body_show_duration",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether the duration should be shown for the Player"
        },
        {
          "displayName": "Show Fullscreen",
          "name": "body_show_fullscreen",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether fullscreen controls should be shown for the Player"
        },
        {
          "displayName": "Show Loop",
          "name": "body_show_loop",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether loop controls should be shown for the Player"
        },
        {
          "displayName": "Show Media Info",
          "name": "body_show_media_info",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether media information should be shown for the Player"
        },
        {
          "displayName": "Show Media Thumbnail",
          "name": "body_show_media_thumbnail",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether media thumbnail should be shown for the Player"
        },
        {
          "displayName": "Show Progression",
          "name": "body_show_progression",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether progression controls should be shown for the Player"
        },
        {
          "displayName": "Show Related",
          "name": "body_show_related",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether related media should be shown for the Player"
        },
        {
          "displayName": "Show Replay",
          "name": "body_show_replay",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether replay controls should be shown for the Player"
        },
        {
          "displayName": "Show Speed",
          "name": "body_show_speed",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether speed controls should be shown for the Player"
        },
        {
          "displayName": "Show Suggestions",
          "name": "body_show_suggestions",
          "type": "boolean",
          "default": false,
          "description": "Should suggestions be displayed or not"
        },
        {
          "displayName": "Show Viewers",
          "name": "body_show_viewers",
          "type": "string",
          "default": "",
          "description": "Indicates whether viewers count should be shown for the Player"
        },
        {
          "displayName": "Show Viewers After",
          "name": "body_show_viewers_after",
          "type": "string",
          "default": "",
          "description": "The time after which viewers count should be shown for the Player"
        },
        {
          "displayName": "Show Viewers Only After",
          "name": "body_show_viewers_only_after",
          "type": "string",
          "default": "",
          "description": "The time only after which viewers count should be shown for the Player"
        },
        {
          "displayName": "Skip Intro Activated",
          "name": "body_skip_intro_activated",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Skip Intro To",
          "name": "body_skip_intro_to",
          "type": "number",
          "default": 0,
          "description": "Number of seconds to reach once the \"skip intro\" button is pressed, nothing will appear if value is 0"
        },
        {
          "displayName": "Suggestions",
          "name": "body_suggestions",
          "type": "json",
          "default": {},
          "description": "a list media sources to play at the end of current media"
        },
        {
          "displayName": "Theme",
          "name": "body_theme",
          "type": "options",
          "default": "",
          "description": "The theme for the Player",
          "options": [
            {
              "name": "chrome",
              "value": "chrome"
            },
            {
              "name": "jwlike",
              "value": "jwlike"
            },
            {
              "name": "nuevo",
              "value": "nuevo"
            },
            {
              "name": "party",
              "value": "party"
            },
            {
              "name": "pinko",
              "value": "pinko"
            },
            {
              "name": "roundal",
              "value": "roundal"
            },
            {
              "name": "shaka",
              "value": "shaka"
            },
            {
              "name": "slategrey",
              "value": "slategrey"
            },
            {
              "name": "treso",
              "value": "treso"
            }
          ]
        },
        {
          "displayName": "Theme Activated",
          "name": "body_theme_activated",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Time Before Hide Cb",
          "name": "body_time_before_hide_cb",
          "type": "number",
          "default": 0,
          "description": "The time before controls should be hidden for the Player"
        },
        {
          "displayName": "Time Skip Mode",
          "name": "body_time_skip_mode",
          "type": "string",
          "default": "",
          "description": "<note><strong>none</strong>: No rewind mode selected</note><note><strong>forward_only</strong>: Forward only mode selected</note><note><strong>rewind_only</strong>: Rewind only mode selected</note><note><strong>rewind_forward</strong>: Rewind and forward mode selected</note>"
        },
        {
          "displayName": "Twitter Back Link",
          "name": "body_twitter_back_link",
          "type": "string",
          "default": "",
          "description": "A public resolvable url"
        },
        {
          "displayName": "Twitter Related",
          "name": "body_twitter_related",
          "type": "json",
          "default": {},
          "description": "The related Twitter account associated with the Player"
        },
        {
          "displayName": "Twitter Via",
          "name": "body_twitter_via",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Width",
          "name": "body_width",
          "type": "number",
          "default": 0,
          "description": "The width of Player"
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Player"
          ],
          "operation": [
            "DELETE /2/vod/channels/{channel}/players"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Players",
      "name": "query_players",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Player"
          ],
          "operation": [
            "DELETE /2/vod/channels/{channel}/players"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Player"
          ],
          "operation": [
            "GET /2/vod/players/{player}"
          ]
        }
      },
      "required": true,
      "description": "The Player unique identifier"
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Player"
          ],
          "operation": [
            "PUT /2/vod/players/{player}"
          ]
        }
      },
      "required": true,
      "description": "The Player unique identifier"
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
            "V3 > Player"
          ],
          "operation": [
            "PUT /2/vod/players/{player}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Ads Category",
          "name": "body_ads_category",
          "type": "string",
          "default": "",
          "description": "<note><strong>vast</strong>: The advertisement is from a vast</note><note><strong>video</strong>: The advertisement is from a video</note><note><strong>none</strong>: There is no advertisement</note>"
        },
        {
          "displayName": "Airplay",
          "name": "body_airplay",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Audio Volume",
          "name": "body_audio_volume",
          "type": "number",
          "default": 0,
          "description": "The volume of the audio for the Player"
        },
        {
          "displayName": "Auto Hide Controls",
          "name": "body_auto_hide_controls",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether controls should automatically hide for the Player"
        },
        {
          "displayName": "Auto Start",
          "name": "body_auto_start",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether media should start automatically for the Player"
        },
        {
          "displayName": "Chromecast",
          "name": "body_chromecast",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether Chromecast is enabled for the Player"
        },
        {
          "displayName": "Control Active Color",
          "name": "body_control_active_color",
          "type": "string",
          "default": "",
          "description": "Controlbar color"
        },
        {
          "displayName": "Control Color",
          "name": "body_control_color",
          "type": "string",
          "default": "",
          "description": "Control color"
        },
        {
          "displayName": "Controlbar Color",
          "name": "body_controlbar_color",
          "type": "string",
          "default": "",
          "description": "Active control color"
        },
        {
          "displayName": "Default",
          "name": "body_default",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether the Player is set as default"
        },
        {
          "displayName": "Default Speed",
          "name": "body_default_speed",
          "type": "number",
          "default": 0,
          "description": "The default speed of playback for the Player"
        },
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Enable Embed Code",
          "name": "body_enable_embed_code",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether embed code is enabled for the Player"
        },
        {
          "displayName": "Enable Facebook",
          "name": "body_enable_facebook",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether Facebook sharing is enabled for the Player"
        },
        {
          "displayName": "Enable Linkedin",
          "name": "body_enable_linkedin",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Enable Twitter",
          "name": "body_enable_twitter",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether Twitter sharing is enabled for the Player"
        },
        {
          "displayName": "Enable Whatsapp",
          "name": "body_enable_whatsapp",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Encoding Change Enabled",
          "name": "body_encoding_change_enabled",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether encoding change is enabled for the Player"
        },
        {
          "displayName": "Encoding Limit",
          "name": "body_encoding_limit",
          "type": "boolean",
          "default": false,
          "description": "The encoding limit for the Player"
        },
        {
          "displayName": "Facebook Back Link",
          "name": "body_facebook_back_link",
          "type": "string",
          "default": "",
          "description": "A public resolvable url"
        },
        {
          "displayName": "Force Media Ratio",
          "name": "body_force_media_ratio",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether media ratio is enforced for the Player"
        },
        {
          "displayName": "Force Subtitles Activated",
          "name": "body_force_subtitles_activated",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Force Subtitles Type",
          "name": "body_force_subtitles_type",
          "type": "string",
          "default": "",
          "description": "<note><strong>lang_navigator</strong>: The subtitles will try to match the browser lang</note><note><strong>lang_manager</strong>: Force the subtitles will try to match the manager lang</note>"
        },
        {
          "displayName": "Geoip Image",
          "name": "body_geoip_image",
          "type": "string",
          "default": "",
          "description": "The GeoIP image associated with the Player"
        },
        {
          "displayName": "Has Logo",
          "name": "body_has_logo",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Height",
          "name": "body_height",
          "type": "number",
          "default": 0,
          "description": "The height of Player"
        },
        {
          "displayName": "Interrupt Image",
          "name": "body_interrupt_image",
          "type": "string",
          "default": "",
          "description": "The interrupt image associated with the Player"
        },
        {
          "displayName": "Is360",
          "name": "body_is360",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether the Player supports 360-degree videos"
        },
        {
          "displayName": "Is Default",
          "name": "body_is_default",
          "type": "boolean",
          "default": false,
          "description": "Indicates if the Player is the default one when sharing"
        },
        {
          "displayName": "Logo Anchor",
          "name": "body_logo_anchor",
          "type": "string",
          "default": "",
          "description": "The anchor of the overlay logo<note><strong>top_left</strong>: Positioned at the top-left corner</note><note><strong>top_right</strong>: Positioned at the top-right corner</note><note><strong>bottom_left</strong>: Positioned at the bottom-left corner</note><note><strong>bottom_right</strong>: Positioned at the bottom-right corner</note><note><strong>center</strong>: Positioned at the center of the container or screen</note><note><strong>none</strong>: Not positioned on the container or screen</note>"
        },
        {
          "displayName": "Logo Image",
          "name": "body_logo_image",
          "type": "string",
          "default": "",
          "description": "The logo image associated with the Player"
        },
        {
          "displayName": "Logo Margin Horizontal",
          "name": "body_logo_margin_horizontal",
          "type": "number",
          "default": 0,
          "description": "The horizontal margin of the Player logo"
        },
        {
          "displayName": "Logo Margin Vertical",
          "name": "body_logo_margin_vertical",
          "type": "number",
          "default": 0,
          "description": "The vertical margin of the Player logo"
        },
        {
          "displayName": "Logo Percentage",
          "name": "body_logo_percentage",
          "type": "number",
          "default": 0,
          "description": "The size percentage of the Player logo"
        },
        {
          "displayName": "Media Thumbnail Anchor",
          "name": "body_media_thumbnail_anchor",
          "type": "options",
          "default": "",
          "description": "The media thumbnail anchor<note><strong>top</strong>: Positioned on top</note><note><strong>left</strong>: Positioned on the left side</note>",
          "options": [
            {
              "name": "left",
              "value": "left"
            },
            {
              "name": "top",
              "value": "top"
            }
          ]
        },
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Player End Screen Type",
          "name": "body_player_end_screen_type",
          "type": "string",
          "default": "",
          "description": "<note><strong>pause_and_replay</strong>: We will show pause and replay buttons</note><note><strong>auto_loop</strong>: The video will automatically loop</note><note><strong>suggest_more_media</strong>: Will suggest many video as ending screen</note><note><strong>suggest_next_media</strong>: Will suggest one video as ending screen</note>"
        },
        {
          "displayName": "Preferred Playback Strategy",
          "name": "body_preferred_playback_strategy",
          "type": "string",
          "default": "",
          "description": "The preferred playback strategy (may not be enforced)<note><strong>hls</strong>: Apple HTTP Live Streaming</note><note><strong>dash</strong>: Dynamic Adaptive Streaming over HTTP</note><note><strong>single</strong>: Single bitrate</note><note><strong>best</strong>: Playback strategy selecting the best available quality dynamically</note>"
        },
        {
          "displayName": "Preferred Playback Strategy Activated",
          "name": "body_preferred_playback_strategy_activated",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Preload Image",
          "name": "body_preload_image",
          "type": "string",
          "default": "",
          "description": "The preload image associated with the Player"
        },
        {
          "displayName": "Restrict Image",
          "name": "body_restrict_image",
          "type": "string",
          "default": "",
          "description": "The restrict image associated with the Player"
        },
        {
          "displayName": "Show Audio",
          "name": "body_show_audio",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether audio controls should be shown for the Player"
        },
        {
          "displayName": "Show Controls",
          "name": "body_show_controls",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether controls should be shown for the Player"
        },
        {
          "displayName": "Show Default Logo",
          "name": "body_show_default_logo",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether the default logo should be shown for the Player"
        },
        {
          "displayName": "Show Download",
          "name": "body_show_download",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Show Duration",
          "name": "body_show_duration",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether the duration should be shown for the Player"
        },
        {
          "displayName": "Show Fullscreen",
          "name": "body_show_fullscreen",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether fullscreen controls should be shown for the Player"
        },
        {
          "displayName": "Show Loop",
          "name": "body_show_loop",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether loop controls should be shown for the Player"
        },
        {
          "displayName": "Show Media Info",
          "name": "body_show_media_info",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether media information should be shown for the Player"
        },
        {
          "displayName": "Show Media Thumbnail",
          "name": "body_show_media_thumbnail",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether media thumbnail should be shown for the Player"
        },
        {
          "displayName": "Show Progression",
          "name": "body_show_progression",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether progression controls should be shown for the Player"
        },
        {
          "displayName": "Show Related",
          "name": "body_show_related",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether related media should be shown for the Player"
        },
        {
          "displayName": "Show Replay",
          "name": "body_show_replay",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether replay controls should be shown for the Player"
        },
        {
          "displayName": "Show Speed",
          "name": "body_show_speed",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether speed controls should be shown for the Player"
        },
        {
          "displayName": "Show Suggestions",
          "name": "body_show_suggestions",
          "type": "boolean",
          "default": false,
          "description": "Should suggestions be displayed or not"
        },
        {
          "displayName": "Show Viewers",
          "name": "body_show_viewers",
          "type": "string",
          "default": "",
          "description": "Indicates whether viewers count should be shown for the Player"
        },
        {
          "displayName": "Show Viewers After",
          "name": "body_show_viewers_after",
          "type": "string",
          "default": "",
          "description": "The time after which viewers count should be shown for the Player"
        },
        {
          "displayName": "Show Viewers Only After",
          "name": "body_show_viewers_only_after",
          "type": "string",
          "default": "",
          "description": "The time only after which viewers count should be shown for the Player"
        },
        {
          "displayName": "Skip Intro Activated",
          "name": "body_skip_intro_activated",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Skip Intro To",
          "name": "body_skip_intro_to",
          "type": "number",
          "default": 0,
          "description": "Number of seconds to reach once the \"skip intro\" button is pressed, nothing will appear if value is 0"
        },
        {
          "displayName": "Suggestions",
          "name": "body_suggestions",
          "type": "json",
          "default": {},
          "description": "a list media sources to play at the end of current media"
        },
        {
          "displayName": "Theme",
          "name": "body_theme",
          "type": "options",
          "default": "",
          "description": "The theme for the Player",
          "options": [
            {
              "name": "chrome",
              "value": "chrome"
            },
            {
              "name": "jwlike",
              "value": "jwlike"
            },
            {
              "name": "nuevo",
              "value": "nuevo"
            },
            {
              "name": "party",
              "value": "party"
            },
            {
              "name": "pinko",
              "value": "pinko"
            },
            {
              "name": "roundal",
              "value": "roundal"
            },
            {
              "name": "shaka",
              "value": "shaka"
            },
            {
              "name": "slategrey",
              "value": "slategrey"
            },
            {
              "name": "treso",
              "value": "treso"
            }
          ]
        },
        {
          "displayName": "Theme Activated",
          "name": "body_theme_activated",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Time Before Hide Cb",
          "name": "body_time_before_hide_cb",
          "type": "number",
          "default": 0,
          "description": "The time before controls should be hidden for the Player"
        },
        {
          "displayName": "Time Skip Mode",
          "name": "body_time_skip_mode",
          "type": "string",
          "default": "",
          "description": "<note><strong>none</strong>: No rewind mode selected</note><note><strong>forward_only</strong>: Forward only mode selected</note><note><strong>rewind_only</strong>: Rewind only mode selected</note><note><strong>rewind_forward</strong>: Rewind and forward mode selected</note>"
        },
        {
          "displayName": "Twitter Back Link",
          "name": "body_twitter_back_link",
          "type": "string",
          "default": "",
          "description": "A public resolvable url"
        },
        {
          "displayName": "Twitter Related",
          "name": "body_twitter_related",
          "type": "json",
          "default": {},
          "description": "The related Twitter account associated with the Player"
        },
        {
          "displayName": "Twitter Via",
          "name": "body_twitter_via",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Width",
          "name": "body_width",
          "type": "number",
          "default": 0,
          "description": "The width of Player"
        }
      ]
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Player"
          ],
          "operation": [
            "DELETE /2/vod/players/{player}"
          ]
        }
      },
      "required": true,
      "description": "The Player unique identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Playlist"
          ]
        }
      },
      "options": [
        {
          "name": "List Playlists.",
          "value": "GET /2/vod/channels/{channel}/playlists"
        },
        {
          "name": "List Media In Playlist.",
          "value": "GET /2/vod/playlists/{playlist}/media"
        },
        {
          "name": "Show Playlist Details.",
          "value": "GET /2/vod/playlists/{playlist}"
        }
      ],
      "default": "GET /2/vod/channels/{channel}/playlists",
      "noDataExpression": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Playlist"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/playlists"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Playlist"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/playlists"
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
      "displayName": "Playlist",
      "name": "path_playlist",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Playlist"
          ],
          "operation": [
            "GET /2/vod/playlists/{playlist}/media"
          ]
        }
      },
      "required": true,
      "description": "The Playlist unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Playlist"
          ],
          "operation": [
            "GET /2/vod/playlists/{playlist}/media"
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
      "displayName": "Playlist",
      "name": "path_playlist",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Playlist"
          ],
          "operation": [
            "GET /2/vod/playlists/{playlist}"
          ]
        }
      },
      "required": true,
      "description": "The Playlist unique identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Reflect"
          ]
        }
      },
      "options": [
        {
          "name": "Get Vversion",
          "value": "GET /2/vod/reflect/endpoints/v{version}/{endpoint?}"
        },
        {
          "name": "Create Vversion",
          "value": "POST /2/vod/reflect/endpoints/v{version}/{endpoint}"
        }
      ],
      "default": "GET /2/vod/reflect/endpoints/v{version}/{endpoint?}",
      "noDataExpression": true
    },
    {
      "displayName": "Version",
      "name": "path_version",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Reflect"
          ],
          "operation": [
            "GET /2/vod/reflect/endpoints/v{version}/{endpoint?}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Endpoint",
      "name": "path_endpoint",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Reflect"
          ],
          "operation": [
            "GET /2/vod/reflect/endpoints/v{version}/{endpoint?}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Version",
      "name": "path_version",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Reflect"
          ],
          "operation": [
            "POST /2/vod/reflect/endpoints/v{version}/{endpoint}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Endpoint",
      "name": "path_endpoint",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Reflect"
          ],
          "operation": [
            "POST /2/vod/reflect/endpoints/v{version}/{endpoint}"
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
            "V3 > Resources"
          ]
        }
      },
      "options": [
        {
          "name": "Download Media Source.",
          "value": "GET /2/vod/res/media/{media}"
        },
        {
          "name": "Display Thumbnail.",
          "value": "GET /2/vod/res/thumbnails/{thumbnail}.{format}"
        },
        {
          "name": "Display Playlist Image.",
          "value": "GET /2/vod/res/playlists/{playlist}.{format}"
        },
        {
          "name": "Display Share Image.",
          "value": "GET /2/vod/res/shares/{share}.{image}.{format}"
        },
        {
          "name": "Render Share Link.",
          "value": "GET /2/vod/res/shares/{share}.{format?}"
        },
        {
          "name": "Display Player Image.",
          "value": "GET /2/vod/res/players/{player}.{image}.{format}"
        },
        {
          "name": "Display A Logo Image.",
          "value": "GET /2/vod/res/logos/{logo}.{format}"
        },
        {
          "name": "Render Chapter.",
          "value": "GET /2/vod/res/media/{media}/chapters.{format}"
        },
        {
          "name": "Display Chapter Image.",
          "value": "GET /2/vod/res/chapters/{chapter}.{format}"
        },
        {
          "name": "Render Subtitle.",
          "value": "GET /2/vod/res/subtitles/{subtitle}.{format}"
        },
        {
          "name": "List Suggested Media.",
          "value": "GET /2/vod/res/suggestions/{target}"
        }
      ],
      "default": "GET /2/vod/res/media/{media}",
      "noDataExpression": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Resources"
          ],
          "operation": [
            "GET /2/vod/res/media/{media}"
          ]
        }
      },
      "required": true,
      "description": "The Media unique identifier"
    },
    {
      "displayName": "Thumbnail",
      "name": "path_thumbnail",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Resources"
          ],
          "operation": [
            "GET /2/vod/res/thumbnails/{thumbnail}.{format}"
          ]
        }
      },
      "required": true,
      "description": "The Thumbnail unique identifier"
    },
    {
      "displayName": "Format",
      "name": "path_format",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Resources"
          ],
          "operation": [
            "GET /2/vod/res/thumbnails/{thumbnail}.{format}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Playlist",
      "name": "path_playlist",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Resources"
          ],
          "operation": [
            "GET /2/vod/res/playlists/{playlist}.{format}"
          ]
        }
      },
      "required": true,
      "description": "The Playlist unique identifier"
    },
    {
      "displayName": "Format",
      "name": "path_format",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Resources"
          ],
          "operation": [
            "GET /2/vod/res/playlists/{playlist}.{format}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Share",
      "name": "path_share",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Resources"
          ],
          "operation": [
            "GET /2/vod/res/shares/{share}.{image}.{format}"
          ]
        }
      },
      "required": true,
      "description": "The Share unique identifier"
    },
    {
      "displayName": "Image",
      "name": "path_image",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Resources"
          ],
          "operation": [
            "GET /2/vod/res/shares/{share}.{image}.{format}"
          ]
        }
      },
      "required": true,
      "description": "Use one of the following values<note><strong>logo</strong>: Image used as a logo or branding element</note><note><strong>preload</strong>: Image intended for preloading or prefetching</note><note><strong>interrupt</strong>: Image displayed during interruptions or loading delays</note><note><strong>geoip</strong>: Image customized based on geographical location</note><note><strong>restrict</strong>: Image with restrictions or access control settings</note>"
    },
    {
      "displayName": "Format",
      "name": "path_format",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Resources"
          ],
          "operation": [
            "GET /2/vod/res/shares/{share}.{image}.{format}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Share",
      "name": "path_share",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Resources"
          ],
          "operation": [
            "GET /2/vod/res/shares/{share}.{format?}"
          ]
        }
      },
      "required": true,
      "description": "The Share unique identifier"
    },
    {
      "displayName": "Format",
      "name": "path_format",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Resources"
          ],
          "operation": [
            "GET /2/vod/res/shares/{share}.{format?}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Resources"
          ],
          "operation": [
            "GET /2/vod/res/players/{player}.{image}.{format}"
          ]
        }
      },
      "required": true,
      "description": "The Player unique identifier"
    },
    {
      "displayName": "Image",
      "name": "path_image",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Resources"
          ],
          "operation": [
            "GET /2/vod/res/players/{player}.{image}.{format}"
          ]
        }
      },
      "required": true,
      "description": "Use one of the following values<note><strong>logo</strong>: Image used as a logo or branding element</note><note><strong>preload</strong>: Image intended for preloading or prefetching</note><note><strong>interrupt</strong>: Image displayed during interruptions or loading delays</note><note><strong>geoip</strong>: Image customized based on geographical location</note><note><strong>restrict</strong>: Image with restrictions or access control settings</note>"
    },
    {
      "displayName": "Format",
      "name": "path_format",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Resources"
          ],
          "operation": [
            "GET /2/vod/res/players/{player}.{image}.{format}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Logo",
      "name": "path_logo",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Resources"
          ],
          "operation": [
            "GET /2/vod/res/logos/{logo}.{format}"
          ]
        }
      },
      "required": true,
      "description": "The Logo unique identifier"
    },
    {
      "displayName": "Format",
      "name": "path_format",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Resources"
          ],
          "operation": [
            "GET /2/vod/res/logos/{logo}.{format}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Resources"
          ],
          "operation": [
            "GET /2/vod/res/media/{media}/chapters.{format}"
          ]
        }
      },
      "required": true,
      "description": "The Media unique identifier"
    },
    {
      "displayName": "Format",
      "name": "path_format",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Resources"
          ],
          "operation": [
            "GET /2/vod/res/media/{media}/chapters.{format}"
          ]
        }
      },
      "required": true,
      "description": "Use one of the following values<note><strong>json</strong>: JavaScript Object Notation data format</note><note><strong>xml</strong>: EXtensible Markup Language data format</note><note><strong>yaml</strong>: YAML Ain't Markup Language data format</note><note><strong>vtt</strong>: WebVTT (Web Video Text Tracks) subtitle format</note>"
    },
    {
      "displayName": "Chapter",
      "name": "path_chapter",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Resources"
          ],
          "operation": [
            "GET /2/vod/res/chapters/{chapter}.{format}"
          ]
        }
      },
      "required": true,
      "description": "The Chapter unique identifier"
    },
    {
      "displayName": "Format",
      "name": "path_format",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Resources"
          ],
          "operation": [
            "GET /2/vod/res/chapters/{chapter}.{format}"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Subtitle",
      "name": "path_subtitle",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Resources"
          ],
          "operation": [
            "GET /2/vod/res/subtitles/{subtitle}.{format}"
          ]
        }
      },
      "required": true,
      "description": "The Subtitle unique identifier"
    },
    {
      "displayName": "Format",
      "name": "path_format",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Resources"
          ],
          "operation": [
            "GET /2/vod/res/subtitles/{subtitle}.{format}"
          ]
        }
      },
      "required": true,
      "description": "Use one of the following values<note><strong>srt</strong>: Simple subtitle format</note><note><strong>vtt</strong>: WebVTT subtitle format</note><note><strong>sub</strong>: Generic subtitle format</note><note><strong>stl</strong>: EBU STL subtitle format</note><note><strong>sbv</strong>: YouTube subtitle format</note><note><strong>json</strong>: Raw json format</note><note><strong>txt</strong>: Plain text format</note><note><strong>dxfp</strong>: Standard for XML captions and subtitles based on the TTML (Timed Text Markup Language) format</note><note><strong>ttml</strong>: Standard for XML captions developed by the World Wide Web Consortium (W3C)</note>"
    },
    {
      "displayName": "Target",
      "name": "path_target",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Resources"
          ],
          "operation": [
            "GET /2/vod/res/suggestions/{target}"
          ]
        }
      },
      "required": true,
      "description": "The Sequence unique identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Share"
          ]
        }
      },
      "options": [
        {
          "name": "List Channel Shares.",
          "value": "GET /2/vod/channels/{channel}/shares"
        },
        {
          "name": "Bulk Delete Shares.",
          "value": "DELETE /2/vod/channels/{channel}/shares"
        },
        {
          "name": "List Media Shares.",
          "value": "GET /2/vod/media/{media}/shares"
        },
        {
          "name": "Show Share Details.",
          "value": "GET /2/vod/shares/{share}"
        },
        {
          "name": "Update Share Details.",
          "value": "PUT /2/vod/shares/{share}"
        },
        {
          "name": "Delete Share.",
          "value": "DELETE /2/vod/shares/{share}"
        }
      ],
      "default": "GET /2/vod/channels/{channel}/shares",
      "noDataExpression": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Share"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/shares"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Share"
          ],
          "operation": [
            "GET /2/vod/channels/{channel}/shares"
          ]
        }
      },
      "options": [
        {
          "displayName": "Expired Since",
          "name": "query_expired_since",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Expires In",
          "name": "query_expires_in",
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
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Share"
          ],
          "operation": [
            "DELETE /2/vod/channels/{channel}/shares"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Share"
          ],
          "operation": [
            "DELETE /2/vod/channels/{channel}/shares"
          ]
        }
      },
      "options": [
        {
          "displayName": "Shares",
          "name": "query_shares",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Share"
          ],
          "operation": [
            "GET /2/vod/media/{media}/shares"
          ]
        }
      },
      "required": true,
      "description": "The Media unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Share"
          ],
          "operation": [
            "GET /2/vod/media/{media}/shares"
          ]
        }
      },
      "options": [
        {
          "displayName": "Expired Since",
          "name": "query_expired_since",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Expires In",
          "name": "query_expires_in",
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
      "displayName": "Share",
      "name": "path_share",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Share"
          ],
          "operation": [
            "GET /2/vod/shares/{share}"
          ]
        }
      },
      "required": true,
      "description": "The Share unique identifier"
    },
    {
      "displayName": "Share",
      "name": "path_share",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Share"
          ],
          "operation": [
            "PUT /2/vod/shares/{share}"
          ]
        }
      },
      "required": true,
      "description": "The Share unique identifier"
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
            "V3 > Share"
          ],
          "operation": [
            "PUT /2/vod/shares/{share}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Comment",
          "name": "body_comment",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Encoding",
          "name": "body_encoding",
          "type": "string",
          "default": "",
          "description": "Identifier of an existing Encoding"
        },
        {
          "displayName": "Player",
          "name": "body_player",
          "type": "string",
          "default": "",
          "description": "Identifier of an existing Player"
        },
        {
          "displayName": "Player Settings",
          "name": "body_player_settings",
          "type": "json",
          "default": {},
          "description": "Allowed array or object keys"
        },
        {
          "displayName": "Timestamp",
          "name": "body_timestamp",
          "type": "number",
          "default": 0,
          "description": "The timestamp of the starting frame to share the media from."
        },
        {
          "displayName": "Validity",
          "name": "body_validity",
          "type": "number",
          "default": 0,
          "description": "The {name} validity duration (in seconds)"
        }
      ]
    },
    {
      "displayName": "Share",
      "name": "path_share",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Share"
          ],
          "operation": [
            "DELETE /2/vod/shares/{share}"
          ]
        }
      },
      "required": true,
      "description": "The Share unique identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ]
        }
      },
      "options": [
        {
          "name": "Get Top Media Statistics.",
          "value": "GET /2/vod/statistics/{channel}/media/top"
        },
        {
          "name": "Get Media Unique Viewers' Statistics.",
          "value": "GET /2/vod/statistics/{channel}/media/unique_viewers"
        },
        {
          "name": "Get Media Viewers' Statistics.",
          "value": "GET /2/vod/statistics/{channel}/media/viewers"
        },
        {
          "name": "Get The Consumption.",
          "value": "GET /2/vod/statistics/{subject}/consumption"
        },
        {
          "name": "Get The View Time.",
          "value": "GET /2/vod/statistics/{subject}/view_time"
        },
        {
          "name": "Get The Viewers.",
          "value": "GET /2/vod/statistics/{subject}/viewers"
        },
        {
          "name": "Get The Unique Viewers.",
          "value": "GET /2/vod/statistics/{subject}/unique_viewers"
        },
        {
          "name": "Get The Average View Time.",
          "value": "GET /2/vod/statistics/{subject}/average_view_time"
        },
        {
          "name": "Get Encoding Statistics.",
          "value": "GET /2/vod/statistics/{subject}/histogram/encodings"
        },
        {
          "name": "Get Browsers Statistics.",
          "value": "GET /2/vod/statistics/{subject}/histogram/viewers"
        },
        {
          "name": "Get Browsers Statistics.",
          "value": "GET /2/vod/statistics/{subject}/browsers"
        },
        {
          "name": "Get Cities Statistics.",
          "value": "GET /2/vod/statistics/{subject}/cities"
        },
        {
          "name": "Get Countries Statistics.",
          "value": "GET /2/vod/statistics/{subject}/countries"
        },
        {
          "name": "Get Operating System Statistics.",
          "value": "GET /2/vod/statistics/{subject}/operating_systems"
        },
        {
          "name": "Get Playbacks Statistics.",
          "value": "GET /2/vod/statistics/{subject}/playbacks"
        },
        {
          "name": "Get Players Statistics.",
          "value": "GET /2/vod/statistics/{subject}/players"
        },
        {
          "name": "Get Cluster Statistics.",
          "value": "GET /2/vod/statistics/{subject}/clusters"
        },
        {
          "name": "Get Viewers Per Encoding Statistics.",
          "value": "GET /2/vod/statistics/{subject}/viewers_per_encoding"
        },
        {
          "name": "Get Consumed Time Per IP Statistics.",
          "value": "GET /2/vod/statistics/{subject}/consumed_time_per_ip"
        },
        {
          "name": "Get Consumed Time Per Encoding Statistics.",
          "value": "GET /2/vod/statistics/{subject}/consumed_time_per_encoding"
        }
      ],
      "default": "GET /2/vod/statistics/{channel}/media/top",
      "noDataExpression": true
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{channel}/media/top"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{channel}/media/top"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": ""
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
          "displayName": "Order By",
          "name": "query_order_by",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "consumption",
              "value": "consumption"
            },
            {
              "name": "unique_sessions",
              "value": "unique_sessions"
            },
            {
              "name": "viewers",
              "value": "viewers"
            },
            {
              "name": "viewing_time",
              "value": "viewing_time"
            }
          ]
        },
        {
          "displayName": "To",
          "name": "query_to",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{channel}/media/unique_viewers"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Media",
      "name": "query_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{channel}/media/unique_viewers"
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
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{channel}/media/unique_viewers"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "To",
          "name": "query_to",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Top",
          "name": "query_top",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{channel}/media/viewers"
          ]
        }
      },
      "required": true,
      "description": "The Channel unique identifier"
    },
    {
      "displayName": "Media",
      "name": "query_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{channel}/media/viewers"
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
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{channel}/media/viewers"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "To",
          "name": "query_to",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Top",
          "name": "query_top",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Subject",
      "name": "path_subject",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/consumption"
          ]
        }
      },
      "required": true,
      "description": "The Sequence unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/consumption"
          ]
        }
      },
      "options": [
        {
          "displayName": "Format",
          "name": "query_format",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "To",
          "name": "query_to",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Top",
          "name": "query_top",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Subject",
      "name": "path_subject",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/view_time"
          ]
        }
      },
      "required": true,
      "description": "The Sequence unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/view_time"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "To",
          "name": "query_to",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Top",
          "name": "query_top",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Subject",
      "name": "path_subject",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/viewers"
          ]
        }
      },
      "required": true,
      "description": "The Sequence unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/viewers"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "To",
          "name": "query_to",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Top",
          "name": "query_top",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Subject",
      "name": "path_subject",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/unique_viewers"
          ]
        }
      },
      "required": true,
      "description": "The Sequence unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/unique_viewers"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "To",
          "name": "query_to",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Top",
          "name": "query_top",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Subject",
      "name": "path_subject",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/average_view_time"
          ]
        }
      },
      "required": true,
      "description": "The Sequence unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/average_view_time"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "To",
          "name": "query_to",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Top",
          "name": "query_top",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Subject",
      "name": "path_subject",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/histogram/encodings"
          ]
        }
      },
      "required": true,
      "description": "The Sequence unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/histogram/encodings"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Per",
          "name": "query_per",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "To",
          "name": "query_to",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Top",
          "name": "query_top",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Subject",
      "name": "path_subject",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/histogram/viewers"
          ]
        }
      },
      "required": true,
      "description": "The Sequence unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/histogram/viewers"
          ]
        }
      },
      "options": [
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Per",
          "name": "query_per",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "To",
          "name": "query_to",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Top",
          "name": "query_top",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Subject",
      "name": "path_subject",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/browsers"
          ]
        }
      },
      "required": true,
      "description": "The Sequence unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/browsers"
          ]
        }
      },
      "options": [
        {
          "displayName": "By",
          "name": "query_by",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "country",
              "value": "country"
            }
          ]
        },
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Per",
          "name": "query_per",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "To",
          "name": "query_to",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Top",
          "name": "query_top",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Subject",
      "name": "path_subject",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/cities"
          ]
        }
      },
      "required": true,
      "description": "The Sequence unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/cities"
          ]
        }
      },
      "options": [
        {
          "displayName": "By",
          "name": "query_by",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "country",
              "value": "country"
            }
          ]
        },
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Per",
          "name": "query_per",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "To",
          "name": "query_to",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Top",
          "name": "query_top",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Subject",
      "name": "path_subject",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/countries"
          ]
        }
      },
      "required": true,
      "description": "The Sequence unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/countries"
          ]
        }
      },
      "options": [
        {
          "displayName": "By",
          "name": "query_by",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "country",
              "value": "country"
            }
          ]
        },
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Per",
          "name": "query_per",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "To",
          "name": "query_to",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Top",
          "name": "query_top",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Subject",
      "name": "path_subject",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/operating_systems"
          ]
        }
      },
      "required": true,
      "description": "The Sequence unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/operating_systems"
          ]
        }
      },
      "options": [
        {
          "displayName": "By",
          "name": "query_by",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "country",
              "value": "country"
            }
          ]
        },
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Per",
          "name": "query_per",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "To",
          "name": "query_to",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Top",
          "name": "query_top",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Subject",
      "name": "path_subject",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/playbacks"
          ]
        }
      },
      "required": true,
      "description": "The Sequence unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/playbacks"
          ]
        }
      },
      "options": [
        {
          "displayName": "By",
          "name": "query_by",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "country",
              "value": "country"
            }
          ]
        },
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Per",
          "name": "query_per",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "To",
          "name": "query_to",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Top",
          "name": "query_top",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Subject",
      "name": "path_subject",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/players"
          ]
        }
      },
      "required": true,
      "description": "The Sequence unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/players"
          ]
        }
      },
      "options": [
        {
          "displayName": "By",
          "name": "query_by",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "country",
              "value": "country"
            }
          ]
        },
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Per",
          "name": "query_per",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "To",
          "name": "query_to",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Top",
          "name": "query_top",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Subject",
      "name": "path_subject",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/clusters"
          ]
        }
      },
      "required": true,
      "description": "The Sequence unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/clusters"
          ]
        }
      },
      "options": [
        {
          "displayName": "By",
          "name": "query_by",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "country",
              "value": "country"
            }
          ]
        },
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Precision",
          "name": "query_precision",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "To",
          "name": "query_to",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Top",
          "name": "query_top",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Subject",
      "name": "path_subject",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/viewers_per_encoding"
          ]
        }
      },
      "required": true,
      "description": "The Sequence unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/viewers_per_encoding"
          ]
        }
      },
      "options": [
        {
          "displayName": "By",
          "name": "query_by",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "country",
              "value": "country"
            }
          ]
        },
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Per",
          "name": "query_per",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "To",
          "name": "query_to",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Top",
          "name": "query_top",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Subject",
      "name": "path_subject",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/consumed_time_per_ip"
          ]
        }
      },
      "required": true,
      "description": "The Sequence unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/consumed_time_per_ip"
          ]
        }
      },
      "options": [
        {
          "displayName": "By",
          "name": "query_by",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "country",
              "value": "country"
            }
          ]
        },
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Per",
          "name": "query_per",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "To",
          "name": "query_to",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Top",
          "name": "query_top",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Subject",
      "name": "path_subject",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/consumed_time_per_encoding"
          ]
        }
      },
      "required": true,
      "description": "The Sequence unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Statistics"
          ],
          "operation": [
            "GET /2/vod/statistics/{subject}/consumed_time_per_encoding"
          ]
        }
      },
      "options": [
        {
          "displayName": "By",
          "name": "query_by",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "country",
              "value": "country"
            }
          ]
        },
        {
          "displayName": "From",
          "name": "query_from",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Per",
          "name": "query_per",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "To",
          "name": "query_to",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Top",
          "name": "query_top",
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
            "V3 > Subtitle"
          ]
        }
      },
      "options": [
        {
          "name": "List Subtitles.",
          "value": "GET /2/vod/media/{media}/subtitles"
        },
        {
          "name": "Create Subtitle.",
          "value": "POST /2/vod/media/{media}/subtitles"
        },
        {
          "name": "Bulk Delete Subtitles.",
          "value": "DELETE /2/vod/media/{media}/subtitles"
        },
        {
          "name": "Show Subtitle Details.",
          "value": "GET /2/vod/subtitles/{subtitle}"
        },
        {
          "name": "Update Subtitle Details.",
          "value": "PUT /2/vod/subtitles/{subtitle}"
        },
        {
          "name": "Delete A Subtitle.",
          "value": "DELETE /2/vod/subtitles/{subtitle}"
        }
      ],
      "default": "GET /2/vod/media/{media}/subtitles",
      "noDataExpression": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Subtitle"
          ],
          "operation": [
            "GET /2/vod/media/{media}/subtitles"
          ]
        }
      },
      "required": true,
      "description": "The Media unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Subtitle"
          ],
          "operation": [
            "GET /2/vod/media/{media}/subtitles"
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
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Subtitle"
          ],
          "operation": [
            "POST /2/vod/media/{media}/subtitles"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Language",
      "name": "body_language",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Subtitle"
          ],
          "operation": [
            "POST /2/vod/media/{media}/subtitles"
          ]
        }
      },
      "required": true,
      "description": "Identifier of an existing Language"
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
            "V3 > Subtitle"
          ],
          "operation": [
            "POST /2/vod/media/{media}/subtitles"
          ]
        }
      },
      "options": [
        {
          "displayName": "Default",
          "name": "body_default",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether the Subtitle is set as default"
        },
        {
          "displayName": "File",
          "name": "body_file",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Lines",
          "name": "body_lines",
          "type": "string",
          "default": "",
          "description": "An array of subtitle lines, each containing valid start/end/lines keys"
        },
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "A valid filename that does not include slashes, dots or non printable characters"
        },
        {
          "displayName": "Published",
          "name": "body_published",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether the Subtitle is publicly accessible"
        }
      ]
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Subtitle"
          ],
          "operation": [
            "DELETE /2/vod/media/{media}/subtitles"
          ]
        }
      },
      "required": true,
      "description": "The Media unique identifier"
    },
    {
      "displayName": "Subtitles",
      "name": "query_subtitles",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Subtitle"
          ],
          "operation": [
            "DELETE /2/vod/media/{media}/subtitles"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Subtitle",
      "name": "path_subtitle",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Subtitle"
          ],
          "operation": [
            "GET /2/vod/subtitles/{subtitle}"
          ]
        }
      },
      "required": true,
      "description": "The Subtitle unique identifier"
    },
    {
      "displayName": "Subtitle",
      "name": "path_subtitle",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Subtitle"
          ],
          "operation": [
            "PUT /2/vod/subtitles/{subtitle}"
          ]
        }
      },
      "required": true,
      "description": "The Subtitle unique identifier"
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
            "V3 > Subtitle"
          ],
          "operation": [
            "PUT /2/vod/subtitles/{subtitle}"
          ]
        }
      },
      "options": [
        {
          "displayName": "Default",
          "name": "body_default",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether the Subtitle is set as default"
        },
        {
          "displayName": "Lines",
          "name": "body_lines",
          "type": "string",
          "default": "",
          "description": "An array of subtitle lines, each containing valid start/end/lines keys"
        },
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "A valid filename that does not include slashes, dots or non printable characters"
        },
        {
          "displayName": "Published",
          "name": "body_published",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether the Subtitle is publicly accessible"
        }
      ]
    },
    {
      "displayName": "Subtitle",
      "name": "path_subtitle",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Subtitle"
          ],
          "operation": [
            "DELETE /2/vod/subtitles/{subtitle}"
          ]
        }
      },
      "required": true,
      "description": "The Subtitle unique identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Thumbnail"
          ]
        }
      },
      "options": [
        {
          "name": "List Thumbnails.",
          "value": "GET /2/vod/media/{media}/thumbnails"
        },
        {
          "name": "Show Thumbnail Details.",
          "value": "GET /2/vod/thumbnails/{thumbnail}"
        }
      ],
      "default": "GET /2/vod/media/{media}/thumbnails",
      "noDataExpression": true
    },
    {
      "displayName": "Media",
      "name": "path_media",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Thumbnail"
          ],
          "operation": [
            "GET /2/vod/media/{media}/thumbnails"
          ]
        }
      },
      "required": true,
      "description": "The Media unique identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Thumbnail"
          ],
          "operation": [
            "GET /2/vod/media/{media}/thumbnails"
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
      "displayName": "Thumbnail",
      "name": "path_thumbnail",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Thumbnail"
          ],
          "operation": [
            "GET /2/vod/thumbnails/{thumbnail}"
          ]
        }
      },
      "required": true,
      "description": "The Thumbnail unique identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Upload"
          ]
        }
      },
      "options": [
        {
          "name": "Get An Upload Endpooint.",
          "value": "GET /2/vod/folders/{folder}/upload/endpoint"
        },
        {
          "name": "Create Upload",
          "value": "POST /2/vod/folders/{folder}/upload"
        }
      ],
      "default": "GET /2/vod/folders/{folder}/upload/endpoint",
      "noDataExpression": true
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Upload"
          ],
          "operation": [
            "GET /2/vod/folders/{folder}/upload/endpoint"
          ]
        }
      },
      "required": true,
      "description": "The Folder unique identifier"
    },
    {
      "displayName": "Folder",
      "name": "path_folder",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "V3 > Upload"
          ],
          "operation": [
            "POST /2/vod/folders/{folder}/upload"
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
            "V3 > Upload"
          ],
          "operation": [
            "POST /2/vod/folders/{folder}/upload"
          ]
        }
      },
      "options": [
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Duration",
          "name": "body_duration",
          "type": "number",
          "default": 0,
          "description": "The duration of the Upload"
        },
        {
          "displayName": "File",
          "name": "body_file",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "From",
          "name": "body_from",
          "type": "number",
          "default": 0,
          "description": "The start time for the Upload"
        },
        {
          "displayName": "Media",
          "name": "body_media",
          "type": "string",
          "default": "",
          "description": "Identifier of an existing Media"
        },
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "a simple string"
        },
        {
          "displayName": "Url",
          "name": "body_url",
          "type": "string",
          "default": "",
          "description": "A public resolvable url"
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
            "V3 > Ad",
            "V3 > Alert",
            "V3 > Category",
            "V3 > Channel",
            "V3 > Chapter",
            "V3 > Chapter",
            "V3 > Country",
            "V3 > Encoding",
            "V3 > Filesystem",
            "V3 > Filesystem",
            "V3 > Folder",
            "V3 > Ftp",
            "V3 > Journal",
            "V3 > Journal",
            "V3 > Label",
            "V3 > Language",
            "V3 > Logo",
            "V3 > Media",
            "V3 > Media",
            "V3 > Media",
            "V3 > Metadata",
            "V3 > Mixtape",
            "V3 > Mixtape",
            "V3 > Player",
            "V3 > Playlist",
            "V3 > Playlist",
            "V3 > Share",
            "V3 > Share",
            "V3 > Subtitle",
            "V3 > Thumbnail"
          ],
          "operation": [
            "GET /2/vod/players/{player}/ads",
            "GET /2/vod/channels/{channel}/alerts",
            "GET /2/vod/categories",
            "GET /2/vod/accounts/{account}/channels",
            "GET /2/vod/media/{media}/chapters",
            "GET /2/vod/chapters/{chapter}",
            "GET /2/vod/countries",
            "GET /2/vod/channels/{channel}/encodings",
            "GET /2/vod/channels/{channel}/browse",
            "GET /2/vod/channels/{channel}/browse/trash",
            "GET /2/vod/channels/{channel}/folders",
            "GET /2/vod/channels/{channel}/ftpusers",
            "GET /2/vod/media/{media}/journal",
            "GET /2/vod/channels/{channel}/journal",
            "GET /2/vod/channels/{channel}/labels",
            "GET /2/vod/lang",
            "GET /2/vod/channels/{channel}/logos",
            "GET /2/vod/channels/{channel}/media",
            "GET /2/vod/channels/{channel}/media/status",
            "GET /2/vod/media/{media}/metadata",
            "GET /2/vod/channels/{channel}/metadata",
            "GET /2/vod/channels/{channel}/mixtapes",
            "GET /2/vod/mixtapes/{mixtape}/media",
            "GET /2/vod/channels/{channel}/players",
            "GET /2/vod/channels/{channel}/playlists",
            "GET /2/vod/playlists/{playlist}/media",
            "GET /2/vod/channels/{channel}/shares",
            "GET /2/vod/media/{media}/shares",
            "GET /2/vod/media/{media}/subtitles",
            "GET /2/vod/media/{media}/thumbnails"
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
            "V3 > Ad",
            "V3 > Alert",
            "V3 > Category",
            "V3 > Channel",
            "V3 > Chapter",
            "V3 > Chapter",
            "V3 > Country",
            "V3 > Encoding",
            "V3 > Filesystem",
            "V3 > Filesystem",
            "V3 > Folder",
            "V3 > Ftp",
            "V3 > Journal",
            "V3 > Journal",
            "V3 > Label",
            "V3 > Language",
            "V3 > Logo",
            "V3 > Media",
            "V3 > Media",
            "V3 > Media",
            "V3 > Metadata",
            "V3 > Mixtape",
            "V3 > Mixtape",
            "V3 > Player",
            "V3 > Playlist",
            "V3 > Playlist",
            "V3 > Share",
            "V3 > Share",
            "V3 > Subtitle",
            "V3 > Thumbnail"
          ],
          "operation": [
            "GET /2/vod/players/{player}/ads",
            "GET /2/vod/channels/{channel}/alerts",
            "GET /2/vod/categories",
            "GET /2/vod/accounts/{account}/channels",
            "GET /2/vod/media/{media}/chapters",
            "GET /2/vod/chapters/{chapter}",
            "GET /2/vod/countries",
            "GET /2/vod/channels/{channel}/encodings",
            "GET /2/vod/channels/{channel}/browse",
            "GET /2/vod/channels/{channel}/browse/trash",
            "GET /2/vod/channels/{channel}/folders",
            "GET /2/vod/channels/{channel}/ftpusers",
            "GET /2/vod/media/{media}/journal",
            "GET /2/vod/channels/{channel}/journal",
            "GET /2/vod/channels/{channel}/labels",
            "GET /2/vod/lang",
            "GET /2/vod/channels/{channel}/logos",
            "GET /2/vod/channels/{channel}/media",
            "GET /2/vod/channels/{channel}/media/status",
            "GET /2/vod/media/{media}/metadata",
            "GET /2/vod/channels/{channel}/metadata",
            "GET /2/vod/channels/{channel}/mixtapes",
            "GET /2/vod/mixtapes/{mixtape}/media",
            "GET /2/vod/channels/{channel}/players",
            "GET /2/vod/channels/{channel}/playlists",
            "GET /2/vod/playlists/{playlist}/media",
            "GET /2/vod/channels/{channel}/shares",
            "GET /2/vod/media/{media}/shares",
            "GET /2/vod/media/{media}/subtitles",
            "GET /2/vod/media/{media}/thumbnails"
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
