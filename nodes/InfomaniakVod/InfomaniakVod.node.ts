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
    "List Channels": {
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
    "Returns The Disk Usage (in Bytes) For The Given Channel.": {
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
    "Returns The Media Poster.": {
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
    "Replaces The Thumbnail & Poster For A Given Media": {
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
    "Lists All Children Of The Channel's Root Folder.": {
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
    "Moves One Or Many Medias/folders To Trash.": {
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
    "Duplicates One Or Many Medias/folders To A Given Folder.": {
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
    "Moves One Or Many Medias/folders To A Given Folder.": {
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
    "Lists All Medias/folders In Trash.": {
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
    "Deletes One Or Many Medias/folders From Trash, Permanently.": {
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
    "Deletes A Media/folder From Trash, Permanently.": {
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
    "Restores A Media/folder From Trash To Its Original Location.": {
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
    "Returns The Tree Of The Folder With All Its Children, Recursively.": {
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
    "Returns The Breadcrumb Of The Media/folder Up To Root Ancestor.": {
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
    "Returns The Breadcrumb Of The Media/folder Up To Root Ancestor. (2)": {
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
    "Updates One Or Many Medias/folders.": {
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
    "Lists All Children Of A Given Folder.": {
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
    "Updates A Media/folder.": {
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
    "Moves A Media/folder To Trash.": {
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
    "Returns The Tree Of The Folder With All Its Children, Recursively. (2)": {
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
    "Duplicates A Media/folder To A Given Folder.": {
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
    "Moves A Media/folder To A Given Folder.": {
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
    "Lists All Callback Logs.": {
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
    "Deletes One Or Many Callback Logs.": {
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
    "Returns A Callback Log.": {
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
    "Deletes A Callback Log.": {
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
    "Lists All Callbacks.": {
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
    "Creates A New Callback.": {
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
    "Updates One Or Many Callbacks.": {
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
    "Deletes One Or Many Callbacks.": {
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
    "Returns A Callback.": {
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
    "Updates A Callback.": {
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
    "Deletes A Callback.": {
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
    "Lists All Event.": {
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
    "Lists All Encodings.": {
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
    "Creates A New Encoding.": {
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
    "Deletes One Or Many Players.": {
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
    "Returns An Encoding.": {
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
    "Updates An Encoding.": {
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
    "Deletes An Encoding.": {
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
    "List Logos": {
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
    "Create A Logo": {
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
    "Deletes Logos": {
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
    "Detach Logo": {
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
    "Display Logo": {
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
    "Updates Logo": {
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
    "Delete Logo": {
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
    "Sets A Logo Either For Media Or Folders": {
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
    "List All Folders.": {
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
    "Creates A New Folder In The Channel's Root Folder.": {
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
    "Adds One Or Many Given Encodings To A Folder.": {
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
    "Remove Encodings From Folder": {
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
    "Appends An Encoding To A Folder.": {
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
    "Removes An Encoding From A Folder.": {
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
    "Add Logo To A Folder": {
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
    "Delete Logo (2)": {
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
    "Returns The Channel's Root Folder.": {
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
    "Returns A Folder.": {
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
    "Creates A New Folder In The Parent Folder.": {
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
    "Updates A Folder.": {
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
    "Deletes A Folder With All Its Children, Recursively.": {
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
    "Lists All Playlists Having A Given Folder Attached.": {
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
    "Lists All FTP Users.": {
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
    "Creates A New FTP User.": {
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
    "Returns A FTP User.": {
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
    "Updates A FTP User.": {
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
    "Deletes A FTP User.": {
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
    "Lists All Medias.": {
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
    "Updates One Or Many Medias.": {
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
    "Returns A Media.": {
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
    "Updates A Media.": {
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
    "Deletes A Media.": {
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
    "Lists All Chapters Of A Given Media.": {
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
    "Creates A New Chapter To A Given Media.": {
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
    "Updates One Or Many Chapters.": {
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
    "Deletes One Or Many Chapters.": {
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
    "Returns A Chapter.": {
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
    "Updates A Chapter.": {
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
    "Deletes A Chapter.": {
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
    "List Media Cuts": {
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
    "Cut A Media": {
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
    "Get New More Precise Waveform ( For Medias Older Than 2024, Async Job )": {
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
    "Get New Thumbstrip Thumbnail ( For Medias Older Than 2024, Async Job )": {
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
    "Lists All Players.": {
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
    "Creates A New Player.": {
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
    "Deletes One Or Many Players. (2)": {
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
    "Returns A Player.": {
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
    "Updates A Player.": {
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
    "Deletes A Player.": {
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
    "Duplicates A Player.": {
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
    "Lists All Ads.": {
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
    "Creates A New Ad.": {
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
    "Deletes One Or Many Ads.": {
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
    "Returns A Ad.": {
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
    "Updates A Ad.": {
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
    "Deletes A Ad.": {
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
    "Lists All Playlists.": {
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
    "Creates A New Playlist.": {
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
    "Deletes One Or Many Playlists.": {
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
    "Returns A Playlist.": {
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
    "Updates A Playlist.": {
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
    "Updates A Playlist. (2)": {
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
    "Deletes A Playlist.": {
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
    "Lists All Children Of A Given Folder, With Attached To Playlist Flag.": {
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
    "Lists All Shares.": {
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
    "Creates A New Share To A Given Target": {
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
    "Returns A Share.": {
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
    "Updates A Share.": {
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
    "Deletes A Share.": {
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
    "Create A Token From A Share": {
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
    "Get Average Time": {
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
    "Get Channel Consumption": {
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
    "Get Channel Consumption Per Encoding": {
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
    "Get Channel Top Medias": {
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
    "Get Media Consumption": {
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
    "Get Media Consumption Per Encoding": {
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
    "Get Media Top Clusters": {
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
    "Get Media Top Countries": {
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
    "Get Browser Shares Per Media": {
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
    "Get Os Shares Per Media": {
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
    "Get Playbacks Shares Per Media": {
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
    "Get Players Shares Per Media": {
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
    "Get Media Viewers": {
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
    "Get Media Viewers Per Encoding Histogram": {
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
    "Get Media Viewers Per Encoding Share": {
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
    "Get Media Unique Viewers": {
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
    "Get Media Viewing Time": {
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
    "Get Viewing Time Per Encoding And Media": {
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
    "Get Channel Browser Shares": {
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
    "Get Channel Os Shares": {
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
    "Get Channel Playbacks Shares": {
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
    "Get Channel Players Shares": {
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
    "Get Consumed Time Per IP": {
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
    "Get Channel Viewers": {
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
    "Get Channel Viewers Per Encoding Histogram": {
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
    "Get Channel Viewers Per Encoding Share": {
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
    "Get Channel Viewers Histogram": {
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
    "Get Media Viewers (2)": {
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
    "Get Channel Unique Viewers": {
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
    "Get Media Unique Viewers (2)": {
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
    "Get Channel Viewing Time": {
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
    "Get Channel Viewing Time Per Encoding": {
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
    "List Uploads": {
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
    "Create New Media": {
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
    "Creates A New Subtitle To A Given Media.": {
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
    "Creates A New Subtitle To A Given Media, From A Provided File.": {
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
    "Set A Default Subtitle.": {
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
    "Returns A Subtitle.": {
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
    "Updates A Subtitle.": {
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
    "Deletes A Subtitle.": {
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
    "Attach Logo": {
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
    "Attach Logo (2)": {
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
    "List Major Encoding Constraints That Should Be Respected": {
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
    "List Encoding Profiles.": {
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
    "Lists All Available Countries.": {
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
    "Lists All Available Categories.": {
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
    "Lists All Available Languages.": {
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
    "Finds And Returns Anything Matching A Given Query.": {
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
    "Lists All Playlists Having A Given Media Attached.": {
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
    "Adds One Or Many Given Medias/folders To One Or Many Playlists.": {
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
    "Removes One Or Many Given Medias/folders From One Or Many Playlists.": {
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
    "Lists All Subtitles Of A Given Media.": {
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
    "Updates One Or Many Subtitle.": {
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
    "Deletes Many Subtitles.": {
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
    "Exports One Or Many Medias To An External Platform.": {
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
    "Restores One Or Many Medias/folders From Trash To Their Original Location.": {
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
    "Exports A Media To An External Platform.": {
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
    "Returns A Channel.": {
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
    "Updates A Channel.": {
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
    "Returns A Playlist In Its Given Extension": {
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
    "Adds One Or Many Given Medias/folders To A Playlist.": {
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
    "Removes One Or Many Given Medias/folders From A Playlist.": {
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
    "Duplicates A Playlist.": {
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
    "Returns A Playlist Image.": {
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
    "Deletes A Playlist Image": {
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
    "Lists All Medias Of A Playlist.": {
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
    "Moves One Or Many Given Medias One Position Up.": {
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
    "Moves One Or Many Given Medias One Position Down.": {
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
    "Moves One Or Many Given Medias After A Given Media.": {
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
    "Moves One Or Many Given Medias Before A Given Media.": {
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
    "Generate Subtitle From Media": {
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
    "Get Summary From Media As Description": {
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
    "Get Summary From Subtitle": {
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
    "Get Custom Summary From Media": {
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
    "Translate Subtitle": {
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
  "V2 > User Activity": {
    "Get Channel User Activity Log": {
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
    "Put User Activity Log": {
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
    "Get Folder User Activity Log": {
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
    "Get Media User Activity Log": {
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
    "List Advertisements.": {
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
    "Create An Advertisement.": {
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
    "Bulk Delete Advertisements.": {
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
    "Show Ad Details.": {
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
    "Update Advertisement.": {
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
    "Delete Advertisement.": {
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
    "List Alerts.": {
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
    "Get Alert.": {
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
    "List Callbacks.": {
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
    "Create Callback.": {
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
    "Show Callback Details.": {
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
    "Update Callback Details.": {
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
    "Delete Callback.": {
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
    "List Categories.": {
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
    "List Channels.": {
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
    "Show Channel Details.": {
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
    "Get Channel Used Disk Space.": {
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
    "Get Trash Disk Usage.": {
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
    "Get Folder Disk Usage.": {
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
    "List Chapters.": {
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
    "Show Chapter Details.": {
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
    "List Countries.": {
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
    "List Encodings.": {
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
    "Create Encoding.": {
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
    "Bulk Delete Encodings.": {
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
    "Show Encoding Details.": {
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
    "Update Encoding.": {
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
    "Delete Encoding.": {
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
    "List Encoding Constraints.": {
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
    "List Encoding Profiles.": {
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
    "Browse Channel Root.": {
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
    "Discard File(s).": {
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
    "Get Root Tree.": {
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
    "Get Root Breadcrumb.": {
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
    "Browse Trash.": {
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
    "Empty Trash.": {
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
    "Browse Folder.": {
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
    "Get Folder Breadcrumb.": {
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
    "Get Folder Tree.": {
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
    "Restore File(s).": {
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
    "Move File(s).": {
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
    "Show Root Folder.": {
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
    "List Folders.": {
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
    "Create Folder.": {
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
    "Show Folder Details.": {
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
    "Update Folder Details.": {
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
    "Delete A Folder.": {
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
    "Synchronize Encodings For A Folder.": {
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
    "Attach Encodings To A Folder.": {
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
    "Detach Encodings From A Folder.": {
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
    "Attach A Logo To A Folder.": {
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
    "Detach A Logo From A Folder.": {
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
    "Attach Labels To A Folder.": {
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
    "Detach Labels From A Folder.": {
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
    "Locks The Provided Folder.": {
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
    "Unlocks The Provided Folder.": {
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
    "List FTP Users.": {
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
    "Create FTP User.": {
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
    "Show FTP User Details.": {
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
    "Update FTP User Details.": {
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
    "Delete FTP User.": {
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
    "Login.": {
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
    "On Connect Callback.": {
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
    "On Disconnect Callback.": {
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
    "On Login Callback.": {
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
    "On Login Failed Callback.": {
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
    "On Logout Callback.": {
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
    "Get Media Journal.": {
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
    "Get Journal.": {
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
    "List Labels.": {
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
    "Bulk Attach Labels.": {
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
    "Bulk Delete Labels.": {
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
    "Show Label Details.": {
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
    "Update Label.": {
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
    "Delete Label.": {
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
    "List Languages.": {
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
    "Show Language Details.": {
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
  "V3 > Linked Svc": {
    "Sync Linked Services.": {
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
    "List Logos.": {
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
    "Create A New Logo.": {
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
    "Bulk Delete Logos.": {
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
    "Show Logo Details.": {
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
    "Update Logo Details.": {
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
    "Delete A Logo.": {
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
    "List Media.": {
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
    "Get Media Statuses Counters.": {
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
    "Show Media Details.": {
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
    "Update Media Details.": {
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
    "Get Metadata From A Media.": {
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
    "Update Metadata From A Media.": {
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
    "Deletes Metadata From A Media.": {
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
    "Share Media.": {
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
    "Bulk Delete Media Shares.": {
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
    "Attach Suggested Media.": {
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
    "Attach Labels To A Media.": {
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
    "Detach Labels From A Media.": {
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
    "List Metadata.": {
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
    "Bulk Attach Metadata.": {
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
    "Bulk Delete Metadata.": {
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
    "Update Metadata.": {
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
    "Delete Metadata.": {
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
    "List Mixtapes.": {
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
    "Create A Mixtape.": {
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
    "Bulk Delete Mixtapes.": {
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
    "Show Mixtape Details.": {
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
    "Update A Mixtape.": {
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
    "Delete A Mixtape.": {
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
    "List Media In Mixtape.": {
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
    "Attach Direct Media.": {
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
    "Detach Direct Media.": {
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
    "Move A Manually Attached Media In Mixtape.": {
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
    "List Players.": {
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
    "Create Player.": {
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
    "Bulk Delete Players.": {
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
    "Show Player Details.": {
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
    "Update Player Details.": {
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
    "Delete Player.": {
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
    "List Playlists.": {
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
    "List Media In Playlist.": {
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
    "Show Playlist Details.": {
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
    "Get Vversion": {
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
    "Create Vversion": {
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
    "Download Media Source.": {
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
    "Display Thumbnail.": {
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
    "Display Playlist Image.": {
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
    "Display Share Image.": {
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
    "Render Share Link.": {
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
    "Display Player Image.": {
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
    "Display A Logo Image.": {
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
    "Render Chapter.": {
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
    "Display Chapter Image.": {
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
    "Render Subtitle.": {
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
    "List Suggested Media.": {
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
    "List Channel Shares.": {
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
    "Bulk Delete Shares.": {
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
    "List Media Shares.": {
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
    "Show Share Details.": {
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
    "Update Share Details.": {
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
    "Delete Share.": {
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
    "Get Top Media Statistics.": {
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
    "Get Media Unique Viewers' Statistics.": {
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
    "Get Media Viewers' Statistics.": {
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
    "Get The Consumption.": {
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
    "Get The View Time.": {
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
    "Get The Viewers.": {
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
    "Get The Unique Viewers.": {
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
    "Get The Average View Time.": {
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
    "Get Encoding Statistics.": {
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
    "Get Browsers Statistics.": {
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
    "Get Browsers Statistics. (2)": {
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
    "Get Cities Statistics.": {
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
    "Get Countries Statistics.": {
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
    "Get Operating System Statistics.": {
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
    "Get Playbacks Statistics.": {
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
    "Get Players Statistics.": {
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
    "Get Cluster Statistics.": {
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
    "Get Viewers Per Encoding Statistics.": {
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
    "Get Consumed Time Per IP Statistics.": {
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
    "Get Consumed Time Per Encoding Statistics.": {
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
    "List Subtitles.": {
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
    "Create Subtitle.": {
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
    "Bulk Delete Subtitles.": {
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
    "Show Subtitle Details.": {
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
    "Update Subtitle Details.": {
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
    "Delete A Subtitle.": {
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
    "List Thumbnails.": {
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
    "Show Thumbnail Details.": {
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
    "Get An Upload Endpooint.": {
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
    "Create Upload": {
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
          "value": "V2 > User Activity"
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
          "value": "V3 > Linked Svc"
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
          "value": "List Channels"
        },
        {
          "name": "Returns The Disk Usage (in Bytes) For The Given Channel.",
          "value": "Returns The Disk Usage (in Bytes) For The Given Channel."
        },
        {
          "name": "Returns The Media Poster.",
          "value": "Returns The Media Poster."
        },
        {
          "name": "Replaces The Thumbnail & Poster For A Given Media",
          "value": "Replaces The Thumbnail & Poster For A Given Media"
        },
        {
          "name": "Lists All Children Of The Channel's Root Folder.",
          "value": "Lists All Children Of The Channel's Root Folder."
        },
        {
          "name": "Moves One Or Many Medias/folders To Trash.",
          "value": "Moves One Or Many Medias/folders To Trash."
        },
        {
          "name": "Duplicates One Or Many Medias/folders To A Given Folder.",
          "value": "Duplicates One Or Many Medias/folders To A Given Folder."
        },
        {
          "name": "Moves One Or Many Medias/folders To A Given Folder.",
          "value": "Moves One Or Many Medias/folders To A Given Folder."
        },
        {
          "name": "Lists All Medias/folders In Trash.",
          "value": "Lists All Medias/folders In Trash."
        },
        {
          "name": "Deletes One Or Many Medias/folders From Trash, Permanently.",
          "value": "Deletes One Or Many Medias/folders From Trash, Permanently."
        },
        {
          "name": "Deletes A Media/folder From Trash, Permanently.",
          "value": "Deletes A Media/folder From Trash, Permanently."
        },
        {
          "name": "Restores A Media/folder From Trash To Its Original Location.",
          "value": "Restores A Media/folder From Trash To Its Original Location."
        },
        {
          "name": "Returns The Tree Of The Folder With All Its Children, Recursively.",
          "value": "Returns The Tree Of The Folder With All Its Children, Recursively."
        },
        {
          "name": "Returns The Breadcrumb Of The Media/folder Up To Root Ancestor.",
          "value": "Returns The Breadcrumb Of The Media/folder Up To Root Ancestor."
        },
        {
          "name": "Returns The Breadcrumb Of The Media/folder Up To Root Ancestor.",
          "value": "Returns The Breadcrumb Of The Media/folder Up To Root Ancestor. (2)"
        },
        {
          "name": "Updates One Or Many Medias/folders.",
          "value": "Updates One Or Many Medias/folders."
        },
        {
          "name": "Lists All Children Of A Given Folder.",
          "value": "Lists All Children Of A Given Folder."
        },
        {
          "name": "Updates A Media/folder.",
          "value": "Updates A Media/folder."
        },
        {
          "name": "Moves A Media/folder To Trash.",
          "value": "Moves A Media/folder To Trash."
        },
        {
          "name": "Returns The Tree Of The Folder With All Its Children, Recursively.",
          "value": "Returns The Tree Of The Folder With All Its Children, Recursively. (2)"
        },
        {
          "name": "Duplicates A Media/folder To A Given Folder.",
          "value": "Duplicates A Media/folder To A Given Folder."
        },
        {
          "name": "Moves A Media/folder To A Given Folder.",
          "value": "Moves A Media/folder To A Given Folder."
        },
        {
          "name": "Lists All Callback Logs.",
          "value": "Lists All Callback Logs."
        },
        {
          "name": "Deletes One Or Many Callback Logs.",
          "value": "Deletes One Or Many Callback Logs."
        },
        {
          "name": "Returns A Callback Log.",
          "value": "Returns A Callback Log."
        },
        {
          "name": "Deletes A Callback Log.",
          "value": "Deletes A Callback Log."
        },
        {
          "name": "Lists All Callbacks.",
          "value": "Lists All Callbacks."
        },
        {
          "name": "Creates A New Callback.",
          "value": "Creates A New Callback."
        },
        {
          "name": "Updates One Or Many Callbacks.",
          "value": "Updates One Or Many Callbacks."
        },
        {
          "name": "Deletes One Or Many Callbacks.",
          "value": "Deletes One Or Many Callbacks."
        },
        {
          "name": "Returns A Callback.",
          "value": "Returns A Callback."
        },
        {
          "name": "Updates A Callback.",
          "value": "Updates A Callback."
        },
        {
          "name": "Deletes A Callback.",
          "value": "Deletes A Callback."
        },
        {
          "name": "Lists All Event.",
          "value": "Lists All Event."
        },
        {
          "name": "Lists All Encodings.",
          "value": "Lists All Encodings."
        },
        {
          "name": "Creates A New Encoding.",
          "value": "Creates A New Encoding."
        },
        {
          "name": "Deletes One Or Many Players.",
          "value": "Deletes One Or Many Players."
        },
        {
          "name": "Returns An Encoding.",
          "value": "Returns An Encoding."
        },
        {
          "name": "Updates An Encoding.",
          "value": "Updates An Encoding."
        },
        {
          "name": "Deletes An Encoding.",
          "value": "Deletes An Encoding."
        },
        {
          "name": "List Logos",
          "value": "List Logos"
        },
        {
          "name": "Create A Logo",
          "value": "Create A Logo"
        },
        {
          "name": "Deletes Logos",
          "value": "Deletes Logos"
        },
        {
          "name": "Detach Logo",
          "value": "Detach Logo"
        },
        {
          "name": "Display Logo",
          "value": "Display Logo"
        },
        {
          "name": "Updates Logo",
          "value": "Updates Logo"
        },
        {
          "name": "Delete Logo",
          "value": "Delete Logo"
        },
        {
          "name": "Sets A Logo Either For Media Or Folders",
          "value": "Sets A Logo Either For Media Or Folders"
        },
        {
          "name": "List All Folders.",
          "value": "List All Folders."
        },
        {
          "name": "Creates A New Folder In The Channel's Root Folder.",
          "value": "Creates A New Folder In The Channel's Root Folder."
        },
        {
          "name": "Adds One Or Many Given Encodings To A Folder.",
          "value": "Adds One Or Many Given Encodings To A Folder."
        },
        {
          "name": "Remove Encodings From Folder",
          "value": "Remove Encodings From Folder"
        },
        {
          "name": "Appends An Encoding To A Folder.",
          "value": "Appends An Encoding To A Folder."
        },
        {
          "name": "Removes An Encoding From A Folder.",
          "value": "Removes An Encoding From A Folder."
        },
        {
          "name": "Add Logo To A Folder",
          "value": "Add Logo To A Folder"
        },
        {
          "name": "Delete Logo",
          "value": "Delete Logo (2)"
        },
        {
          "name": "Returns The Channel's Root Folder.",
          "value": "Returns The Channel's Root Folder."
        },
        {
          "name": "Returns A Folder.",
          "value": "Returns A Folder."
        },
        {
          "name": "Creates A New Folder In The Parent Folder.",
          "value": "Creates A New Folder In The Parent Folder."
        },
        {
          "name": "Updates A Folder.",
          "value": "Updates A Folder."
        },
        {
          "name": "Deletes A Folder With All Its Children, Recursively.",
          "value": "Deletes A Folder With All Its Children, Recursively."
        },
        {
          "name": "Lists All Playlists Having A Given Folder Attached.",
          "value": "Lists All Playlists Having A Given Folder Attached."
        },
        {
          "name": "Lists All FTP Users.",
          "value": "Lists All FTP Users."
        },
        {
          "name": "Creates A New FTP User.",
          "value": "Creates A New FTP User."
        },
        {
          "name": "Returns A FTP User.",
          "value": "Returns A FTP User."
        },
        {
          "name": "Updates A FTP User.",
          "value": "Updates A FTP User."
        },
        {
          "name": "Deletes A FTP User.",
          "value": "Deletes A FTP User."
        },
        {
          "name": "Lists All Medias.",
          "value": "Lists All Medias."
        },
        {
          "name": "Updates One Or Many Medias.",
          "value": "Updates One Or Many Medias."
        },
        {
          "name": "Returns A Media.",
          "value": "Returns A Media."
        },
        {
          "name": "Updates A Media.",
          "value": "Updates A Media."
        },
        {
          "name": "Deletes A Media.",
          "value": "Deletes A Media."
        },
        {
          "name": "Lists All Chapters Of A Given Media.",
          "value": "Lists All Chapters Of A Given Media."
        },
        {
          "name": "Creates A New Chapter To A Given Media.",
          "value": "Creates A New Chapter To A Given Media."
        },
        {
          "name": "Updates One Or Many Chapters.",
          "value": "Updates One Or Many Chapters."
        },
        {
          "name": "Deletes One Or Many Chapters.",
          "value": "Deletes One Or Many Chapters."
        },
        {
          "name": "Returns A Chapter.",
          "value": "Returns A Chapter."
        },
        {
          "name": "Updates A Chapter.",
          "value": "Updates A Chapter."
        },
        {
          "name": "Deletes A Chapter.",
          "value": "Deletes A Chapter."
        },
        {
          "name": "List Media Cuts",
          "value": "List Media Cuts"
        },
        {
          "name": "Cut A Media",
          "value": "Cut A Media"
        },
        {
          "name": "Get New More Precise Waveform ( For Medias Older Than 2024, Async Job )",
          "value": "Get New More Precise Waveform ( For Medias Older Than 2024, Async Job )"
        },
        {
          "name": "Get New Thumbstrip Thumbnail ( For Medias Older Than 2024, Async Job )",
          "value": "Get New Thumbstrip Thumbnail ( For Medias Older Than 2024, Async Job )"
        },
        {
          "name": "Lists All Players.",
          "value": "Lists All Players."
        },
        {
          "name": "Creates A New Player.",
          "value": "Creates A New Player."
        },
        {
          "name": "Deletes One Or Many Players.",
          "value": "Deletes One Or Many Players. (2)"
        },
        {
          "name": "Returns A Player.",
          "value": "Returns A Player."
        },
        {
          "name": "Updates A Player.",
          "value": "Updates A Player."
        },
        {
          "name": "Deletes A Player.",
          "value": "Deletes A Player."
        },
        {
          "name": "Duplicates A Player.",
          "value": "Duplicates A Player."
        },
        {
          "name": "Lists All Ads.",
          "value": "Lists All Ads."
        },
        {
          "name": "Creates A New Ad.",
          "value": "Creates A New Ad."
        },
        {
          "name": "Deletes One Or Many Ads.",
          "value": "Deletes One Or Many Ads."
        },
        {
          "name": "Returns A Ad.",
          "value": "Returns A Ad."
        },
        {
          "name": "Updates A Ad.",
          "value": "Updates A Ad."
        },
        {
          "name": "Deletes A Ad.",
          "value": "Deletes A Ad."
        },
        {
          "name": "Lists All Playlists.",
          "value": "Lists All Playlists."
        },
        {
          "name": "Creates A New Playlist.",
          "value": "Creates A New Playlist."
        },
        {
          "name": "Deletes One Or Many Playlists.",
          "value": "Deletes One Or Many Playlists."
        },
        {
          "name": "Returns A Playlist.",
          "value": "Returns A Playlist."
        },
        {
          "name": "Updates A Playlist.",
          "value": "Updates A Playlist."
        },
        {
          "name": "Updates A Playlist.",
          "value": "Updates A Playlist. (2)"
        },
        {
          "name": "Deletes A Playlist.",
          "value": "Deletes A Playlist."
        },
        {
          "name": "Lists All Children Of A Given Folder, With Attached To Playlist Flag.",
          "value": "Lists All Children Of A Given Folder, With Attached To Playlist Flag."
        },
        {
          "name": "Lists All Shares.",
          "value": "Lists All Shares."
        },
        {
          "name": "Creates A New Share To A Given Target",
          "value": "Creates A New Share To A Given Target"
        },
        {
          "name": "Returns A Share.",
          "value": "Returns A Share."
        },
        {
          "name": "Updates A Share.",
          "value": "Updates A Share."
        },
        {
          "name": "Deletes A Share.",
          "value": "Deletes A Share."
        },
        {
          "name": "Create A Token From A Share",
          "value": "Create A Token From A Share"
        },
        {
          "name": "Get Average Time",
          "value": "Get Average Time"
        },
        {
          "name": "Get Channel Consumption",
          "value": "Get Channel Consumption"
        },
        {
          "name": "Get Channel Consumption Per Encoding",
          "value": "Get Channel Consumption Per Encoding"
        },
        {
          "name": "Get Channel Top Medias",
          "value": "Get Channel Top Medias"
        },
        {
          "name": "Get Media Consumption",
          "value": "Get Media Consumption"
        },
        {
          "name": "Get Media Consumption Per Encoding",
          "value": "Get Media Consumption Per Encoding"
        },
        {
          "name": "Get Media Top Clusters",
          "value": "Get Media Top Clusters"
        },
        {
          "name": "Get Media Top Countries",
          "value": "Get Media Top Countries"
        },
        {
          "name": "Get Browser Shares Per Media",
          "value": "Get Browser Shares Per Media"
        },
        {
          "name": "Get Os Shares Per Media",
          "value": "Get Os Shares Per Media"
        },
        {
          "name": "Get Playbacks Shares Per Media",
          "value": "Get Playbacks Shares Per Media"
        },
        {
          "name": "Get Players Shares Per Media",
          "value": "Get Players Shares Per Media"
        },
        {
          "name": "Get Media Viewers",
          "value": "Get Media Viewers"
        },
        {
          "name": "Get Media Viewers Per Encoding Histogram",
          "value": "Get Media Viewers Per Encoding Histogram"
        },
        {
          "name": "Get Media Viewers Per Encoding Share",
          "value": "Get Media Viewers Per Encoding Share"
        },
        {
          "name": "Get Media Unique Viewers",
          "value": "Get Media Unique Viewers"
        },
        {
          "name": "Get Media Viewing Time",
          "value": "Get Media Viewing Time"
        },
        {
          "name": "Get Viewing Time Per Encoding And Media",
          "value": "Get Viewing Time Per Encoding And Media"
        },
        {
          "name": "Get Channel Browser Shares",
          "value": "Get Channel Browser Shares"
        },
        {
          "name": "Get Channel Os Shares",
          "value": "Get Channel Os Shares"
        },
        {
          "name": "Get Channel Playbacks Shares",
          "value": "Get Channel Playbacks Shares"
        },
        {
          "name": "Get Channel Players Shares",
          "value": "Get Channel Players Shares"
        },
        {
          "name": "Get Consumed Time Per IP",
          "value": "Get Consumed Time Per IP"
        },
        {
          "name": "Get Channel Viewers",
          "value": "Get Channel Viewers"
        },
        {
          "name": "Get Channel Viewers Per Encoding Histogram",
          "value": "Get Channel Viewers Per Encoding Histogram"
        },
        {
          "name": "Get Channel Viewers Per Encoding Share",
          "value": "Get Channel Viewers Per Encoding Share"
        },
        {
          "name": "Get Channel Viewers Histogram",
          "value": "Get Channel Viewers Histogram"
        },
        {
          "name": "Get Media Viewers",
          "value": "Get Media Viewers (2)"
        },
        {
          "name": "Get Channel Unique Viewers",
          "value": "Get Channel Unique Viewers"
        },
        {
          "name": "Get Media Unique Viewers",
          "value": "Get Media Unique Viewers (2)"
        },
        {
          "name": "Get Channel Viewing Time",
          "value": "Get Channel Viewing Time"
        },
        {
          "name": "Get Channel Viewing Time Per Encoding",
          "value": "Get Channel Viewing Time Per Encoding"
        },
        {
          "name": "List Uploads",
          "value": "List Uploads"
        },
        {
          "name": "Create New Media",
          "value": "Create New Media"
        },
        {
          "name": "Creates A New Subtitle To A Given Media.",
          "value": "Creates A New Subtitle To A Given Media."
        },
        {
          "name": "Creates A New Subtitle To A Given Media, From A Provided File.",
          "value": "Creates A New Subtitle To A Given Media, From A Provided File."
        },
        {
          "name": "Set A Default Subtitle.",
          "value": "Set A Default Subtitle."
        },
        {
          "name": "Returns A Subtitle.",
          "value": "Returns A Subtitle."
        },
        {
          "name": "Updates A Subtitle.",
          "value": "Updates A Subtitle."
        },
        {
          "name": "Deletes A Subtitle.",
          "value": "Deletes A Subtitle."
        },
        {
          "name": "Attach Logo",
          "value": "Attach Logo"
        },
        {
          "name": "Attach Logo",
          "value": "Attach Logo (2)"
        },
        {
          "name": "List Major Encoding Constraints That Should Be Respected",
          "value": "List Major Encoding Constraints That Should Be Respected"
        },
        {
          "name": "List Encoding Profiles.",
          "value": "List Encoding Profiles."
        },
        {
          "name": "Lists All Available Countries.",
          "value": "Lists All Available Countries."
        },
        {
          "name": "Lists All Available Categories.",
          "value": "Lists All Available Categories."
        },
        {
          "name": "Lists All Available Languages.",
          "value": "Lists All Available Languages."
        },
        {
          "name": "Finds And Returns Anything Matching A Given Query.",
          "value": "Finds And Returns Anything Matching A Given Query."
        },
        {
          "name": "Lists All Playlists Having A Given Media Attached.",
          "value": "Lists All Playlists Having A Given Media Attached."
        },
        {
          "name": "Adds One Or Many Given Medias/folders To One Or Many Playlists.",
          "value": "Adds One Or Many Given Medias/folders To One Or Many Playlists."
        },
        {
          "name": "Removes One Or Many Given Medias/folders From One Or Many Playlists.",
          "value": "Removes One Or Many Given Medias/folders From One Or Many Playlists."
        },
        {
          "name": "Lists All Subtitles Of A Given Media.",
          "value": "Lists All Subtitles Of A Given Media."
        },
        {
          "name": "Updates One Or Many Subtitle.",
          "value": "Updates One Or Many Subtitle."
        },
        {
          "name": "Deletes Many Subtitles.",
          "value": "Deletes Many Subtitles."
        }
      ],
      "default": "List Channels",
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
            "List Channels"
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
            "Returns The Disk Usage (in Bytes) For The Given Channel."
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
            "Returns The Media Poster."
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
            "Returns The Media Poster."
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
            "Replaces The Thumbnail & Poster For A Given Media"
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
            "Replaces The Thumbnail & Poster For A Given Media"
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
            "Replaces The Thumbnail & Poster For A Given Media"
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
            "Replaces The Thumbnail & Poster For A Given Media"
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
            "Lists All Children Of The Channel's Root Folder."
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
            "Moves One Or Many Medias/folders To Trash."
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
            "Moves One Or Many Medias/folders To Trash."
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
            "Duplicates One Or Many Medias/folders To A Given Folder."
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
            "Duplicates One Or Many Medias/folders To A Given Folder."
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
            "Duplicates One Or Many Medias/folders To A Given Folder."
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
            "Moves One Or Many Medias/folders To A Given Folder."
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
            "Moves One Or Many Medias/folders To A Given Folder."
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
            "Moves One Or Many Medias/folders To A Given Folder."
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
            "Lists All Medias/folders In Trash."
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
            "Deletes One Or Many Medias/folders From Trash, Permanently."
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
            "Deletes A Media/folder From Trash, Permanently."
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
            "Deletes A Media/folder From Trash, Permanently."
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
            "Restores A Media/folder From Trash To Its Original Location."
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
            "Restores A Media/folder From Trash To Its Original Location."
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
            "Returns The Tree Of The Folder With All Its Children, Recursively."
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
            "Returns The Breadcrumb Of The Media/folder Up To Root Ancestor."
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
            "Returns The Breadcrumb Of The Media/folder Up To Root Ancestor. (2)"
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
            "Updates One Or Many Medias/folders."
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
            "Updates One Or Many Medias/folders."
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
            "Lists All Children Of A Given Folder."
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
            "Lists All Children Of A Given Folder."
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
            "Updates A Media/folder."
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
            "Updates A Media/folder."
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
            "Updates A Media/folder."
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
            "Moves A Media/folder To Trash."
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
            "Moves A Media/folder To Trash."
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
            "Returns The Tree Of The Folder With All Its Children, Recursively. (2)"
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
            "Duplicates A Media/folder To A Given Folder."
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
            "Duplicates A Media/folder To A Given Folder."
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
            "Duplicates A Media/folder To A Given Folder."
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
            "Moves A Media/folder To A Given Folder."
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
            "Moves A Media/folder To A Given Folder."
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
            "Moves A Media/folder To A Given Folder."
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
            "Lists All Callback Logs."
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
            "Deletes One Or Many Callback Logs."
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
            "Returns A Callback Log."
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
            "Returns A Callback Log."
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
            "Deletes A Callback Log."
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
            "Deletes A Callback Log."
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
            "Lists All Callbacks."
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
            "Creates A New Callback."
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
            "Updates One Or Many Callbacks."
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
            "Deletes One Or Many Callbacks."
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
            "Returns A Callback."
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
            "Returns A Callback."
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
            "Updates A Callback."
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
            "Updates A Callback."
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
            "Deletes A Callback."
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
            "Deletes A Callback."
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
            "Lists All Event."
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
            "Lists All Encodings."
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
            "Creates A New Encoding."
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
            "Deletes One Or Many Players."
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
            "Returns An Encoding."
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
            "Returns An Encoding."
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
            "Updates An Encoding."
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
            "Updates An Encoding."
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
            "Deletes An Encoding."
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
            "Deletes An Encoding."
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
            "List Logos"
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
            "Create A Logo"
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
            "Deletes Logos"
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
            "Detach Logo"
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
            "Display Logo"
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
            "Display Logo"
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
            "Updates Logo"
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
            "Updates Logo"
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
            "Delete Logo"
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
            "Delete Logo"
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
            "Sets A Logo Either For Media Or Folders"
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
            "Sets A Logo Either For Media Or Folders"
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
            "List All Folders."
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
            "List All Folders."
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
            "Creates A New Folder In The Channel's Root Folder."
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
            "Adds One Or Many Given Encodings To A Folder."
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
            "Adds One Or Many Given Encodings To A Folder."
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
            "Remove Encodings From Folder"
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
            "Remove Encodings From Folder"
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
            "Appends An Encoding To A Folder."
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
            "Appends An Encoding To A Folder."
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
            "Appends An Encoding To A Folder."
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
            "Removes An Encoding From A Folder."
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
            "Removes An Encoding From A Folder."
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
            "Removes An Encoding From A Folder."
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
            "Add Logo To A Folder"
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
            "Add Logo To A Folder"
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
            "Add Logo To A Folder"
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
            "Delete Logo (2)"
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
            "Delete Logo (2)"
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
            "Returns The Channel's Root Folder."
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
            "Returns The Channel's Root Folder."
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
            "Returns A Folder."
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
            "Returns A Folder."
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
            "Returns A Folder."
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
            "Returns A Folder."
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
            "Creates A New Folder In The Parent Folder."
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
            "Creates A New Folder In The Parent Folder."
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
            "Creates A New Folder In The Parent Folder."
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
            "Updates A Folder."
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
            "Updates A Folder."
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
            "Updates A Folder."
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
            "Deletes A Folder With All Its Children, Recursively."
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
            "Deletes A Folder With All Its Children, Recursively."
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
            "Lists All Playlists Having A Given Folder Attached."
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
            "Lists All Playlists Having A Given Folder Attached."
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
            "Lists All Playlists Having A Given Folder Attached."
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
            "Lists All FTP Users."
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
            "Creates A New FTP User."
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
            "Returns A FTP User."
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
            "Returns A FTP User."
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
            "Updates A FTP User."
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
            "Updates A FTP User."
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
            "Deletes A FTP User."
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
            "Deletes A FTP User."
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
            "Lists All Medias."
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
            "Lists All Medias."
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
            "Updates One Or Many Medias."
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
            "Returns A Media."
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
            "Returns A Media."
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
            "Returns A Media."
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
            "Returns A Media."
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
            "Updates A Media."
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
            "Updates A Media."
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
            "Updates A Media."
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
            "Deletes A Media."
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
            "Deletes A Media."
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
            "Lists All Chapters Of A Given Media."
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
            "Lists All Chapters Of A Given Media."
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
            "Lists All Chapters Of A Given Media."
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
            "Creates A New Chapter To A Given Media."
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
            "Creates A New Chapter To A Given Media."
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
            "Creates A New Chapter To A Given Media."
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
            "Updates One Or Many Chapters."
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
            "Updates One Or Many Chapters."
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
            "Deletes One Or Many Chapters."
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
            "Deletes One Or Many Chapters."
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
            "Returns A Chapter."
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
            "Returns A Chapter."
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
            "Returns A Chapter."
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
            "Returns A Chapter."
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
            "Returns A Chapter."
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
            "Updates A Chapter."
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
            "Updates A Chapter."
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
            "Updates A Chapter."
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
            "Updates A Chapter."
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
            "Deletes A Chapter."
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
            "Deletes A Chapter."
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
            "Deletes A Chapter."
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
            "List Media Cuts"
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
            "List Media Cuts"
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
            "Cut A Media"
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
            "Cut A Media"
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
            "Cut A Media"
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
            "Cut A Media"
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
            "Get New More Precise Waveform ( For Medias Older Than 2024, Async Job )"
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
            "Get New More Precise Waveform ( For Medias Older Than 2024, Async Job )"
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
            "Get New Thumbstrip Thumbnail ( For Medias Older Than 2024, Async Job )"
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
            "Get New Thumbstrip Thumbnail ( For Medias Older Than 2024, Async Job )"
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
            "Lists All Players."
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
            "Lists All Players."
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
            "Creates A New Player."
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
            "Deletes One Or Many Players. (2)"
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
            "Returns A Player."
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
            "Returns A Player."
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
            "Returns A Player."
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
            "Returns A Player."
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
            "Updates A Player."
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
            "Updates A Player."
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
            "Updates A Player."
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
            "Deletes A Player."
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
            "Deletes A Player."
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
            "Duplicates A Player."
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
            "Duplicates A Player."
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
            "Lists All Ads."
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
            "Lists All Ads."
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
            "Creates A New Ad."
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
            "Creates A New Ad."
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
            "Deletes One Or Many Ads."
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
            "Deletes One Or Many Ads."
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
            "Returns A Ad."
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
            "Returns A Ad."
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
            "Returns A Ad."
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
            "Updates A Ad."
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
            "Updates A Ad."
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
            "Updates A Ad."
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
            "Deletes A Ad."
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
            "Deletes A Ad."
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
            "Deletes A Ad."
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
            "Lists All Playlists."
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
            "Lists All Playlists."
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
            "Creates A New Playlist."
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
            "Deletes One Or Many Playlists."
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
            "Returns A Playlist."
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
            "Returns A Playlist."
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
            "Returns A Playlist."
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
            "Returns A Playlist."
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
            "Updates A Playlist."
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
            "Updates A Playlist."
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
            "Updates A Playlist. (2)"
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
            "Updates A Playlist. (2)"
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
            "Deletes A Playlist."
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
            "Deletes A Playlist."
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
            "Lists All Children Of A Given Folder, With Attached To Playlist Flag."
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
            "Lists All Children Of A Given Folder, With Attached To Playlist Flag."
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
            "Lists All Children Of A Given Folder, With Attached To Playlist Flag."
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
            "Lists All Shares."
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
            "Creates A New Share To A Given Target"
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
            "Creates A New Share To A Given Target"
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
            "Returns A Share."
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
            "Returns A Share."
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
            "Returns A Share."
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
            "Returns A Share."
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
            "Updates A Share."
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
            "Updates A Share."
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
            "Deletes A Share."
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
            "Deletes A Share."
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
            "Create A Token From A Share"
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
            "Create A Token From A Share"
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
            "Create A Token From A Share"
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
            "Get Average Time"
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
            "Get Average Time"
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
            "Get Channel Consumption"
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
            "Get Channel Consumption"
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
            "Get Channel Consumption Per Encoding"
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
            "Get Channel Consumption Per Encoding"
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
            "Get Channel Top Medias"
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
            "Get Channel Top Medias"
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
            "Get Media Consumption"
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
            "Get Media Consumption"
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
            "Get Media Consumption"
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
            "Get Media Consumption Per Encoding"
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
            "Get Media Consumption Per Encoding"
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
            "Get Media Consumption Per Encoding"
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
            "Get Media Top Clusters"
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
            "Get Media Top Clusters"
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
            "Get Media Top Countries"
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
            "Get Media Top Countries"
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
            "Get Browser Shares Per Media"
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
            "Get Browser Shares Per Media"
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
            "Get Browser Shares Per Media"
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
            "Get Os Shares Per Media"
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
            "Get Os Shares Per Media"
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
            "Get Os Shares Per Media"
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
            "Get Playbacks Shares Per Media"
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
            "Get Playbacks Shares Per Media"
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
            "Get Playbacks Shares Per Media"
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
            "Get Players Shares Per Media"
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
            "Get Players Shares Per Media"
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
            "Get Players Shares Per Media"
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
            "Get Media Viewers"
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
            "Get Media Viewers"
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
            "Get Media Viewers"
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
            "Get Media Viewers"
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
            "Get Media Viewers Per Encoding Histogram"
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
            "Get Media Viewers Per Encoding Histogram"
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
            "Get Media Viewers Per Encoding Histogram"
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
            "Get Media Viewers Per Encoding Share"
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
            "Get Media Viewers Per Encoding Share"
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
            "Get Media Viewers Per Encoding Share"
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
            "Get Media Unique Viewers"
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
            "Get Media Unique Viewers"
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
            "Get Media Unique Viewers"
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
            "Get Media Unique Viewers"
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
            "Get Media Viewing Time"
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
            "Get Media Viewing Time"
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
            "Get Media Viewing Time"
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
            "Get Viewing Time Per Encoding And Media"
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
            "Get Viewing Time Per Encoding And Media"
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
            "Get Viewing Time Per Encoding And Media"
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
            "Get Channel Browser Shares"
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
            "Get Channel Browser Shares"
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
            "Get Channel Os Shares"
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
            "Get Channel Os Shares"
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
            "Get Channel Playbacks Shares"
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
            "Get Channel Playbacks Shares"
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
            "Get Channel Players Shares"
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
            "Get Channel Players Shares"
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
            "Get Consumed Time Per IP"
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
            "Get Consumed Time Per IP"
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
            "Get Channel Viewers"
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
            "Get Channel Viewers"
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
            "Get Channel Viewers Per Encoding Histogram"
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
            "Get Channel Viewers Per Encoding Histogram"
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
            "Get Channel Viewers Per Encoding Share"
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
            "Get Channel Viewers Per Encoding Share"
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
            "Get Channel Viewers Histogram"
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
            "Get Channel Viewers Histogram"
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
            "Get Media Viewers (2)"
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
            "Get Media Viewers (2)"
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
            "Get Media Viewers (2)"
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
            "Get Channel Unique Viewers"
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
            "Get Channel Unique Viewers"
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
            "Get Media Unique Viewers (2)"
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
            "Get Media Unique Viewers (2)"
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
            "Get Media Unique Viewers (2)"
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
            "Get Channel Viewing Time"
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
            "Get Channel Viewing Time"
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
            "Get Channel Viewing Time Per Encoding"
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
            "Get Channel Viewing Time Per Encoding"
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
            "List Uploads"
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
            "Create New Media"
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
            "Create New Media"
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
            "Create New Media"
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
            "Creates A New Subtitle To A Given Media."
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
            "Creates A New Subtitle To A Given Media."
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
            "Creates A New Subtitle To A Given Media."
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
            "Creates A New Subtitle To A Given Media, From A Provided File."
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
            "Creates A New Subtitle To A Given Media, From A Provided File."
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
            "Creates A New Subtitle To A Given Media, From A Provided File."
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
            "Set A Default Subtitle."
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
            "Set A Default Subtitle."
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
            "Set A Default Subtitle."
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
            "Returns A Subtitle."
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
            "Returns A Subtitle."
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
            "Returns A Subtitle."
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
            "Updates A Subtitle."
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
            "Updates A Subtitle."
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
            "Updates A Subtitle."
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
            "Deletes A Subtitle."
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
            "Deletes A Subtitle."
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
            "Deletes A Subtitle."
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
            "Attach Logo"
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
            "Attach Logo"
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
            "Attach Logo"
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
            "Attach Logo (2)"
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
            "Attach Logo (2)"
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
            "Lists All Playlists Having A Given Media Attached."
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
            "Lists All Playlists Having A Given Media Attached."
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
            "Adds One Or Many Given Medias/folders To One Or Many Playlists."
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
            "Removes One Or Many Given Medias/folders From One Or Many Playlists."
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
            "Lists All Subtitles Of A Given Media."
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
            "Lists All Subtitles Of A Given Media."
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
            "Updates One Or Many Subtitle."
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
            "Updates One Or Many Subtitle."
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
            "Deletes Many Subtitles."
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
            "Deletes Many Subtitles."
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
          "value": "Exports One Or Many Medias To An External Platform."
        },
        {
          "name": "Restores One Or Many Medias/folders From Trash To Their Original Location.",
          "value": "Restores One Or Many Medias/folders From Trash To Their Original Location."
        },
        {
          "name": "Exports A Media To An External Platform.",
          "value": "Exports A Media To An External Platform."
        }
      ],
      "default": "Exports One Or Many Medias To An External Platform.",
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
            "Exports One Or Many Medias To An External Platform."
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
            "Restores One Or Many Medias/folders From Trash To Their Original Location."
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
            "Exports A Media To An External Platform."
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
            "Exports A Media To An External Platform."
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
          "value": "Returns A Channel."
        },
        {
          "name": "Updates A Channel.",
          "value": "Updates A Channel."
        }
      ],
      "default": "Returns A Channel.",
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
            "Returns A Channel."
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
            "Updates A Channel."
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
          "value": "Returns A Playlist In Its Given Extension"
        },
        {
          "name": "Adds One Or Many Given Medias/folders To A Playlist.",
          "value": "Adds One Or Many Given Medias/folders To A Playlist."
        },
        {
          "name": "Removes One Or Many Given Medias/folders From A Playlist.",
          "value": "Removes One Or Many Given Medias/folders From A Playlist."
        },
        {
          "name": "Duplicates A Playlist.",
          "value": "Duplicates A Playlist."
        },
        {
          "name": "Returns A Playlist Image.",
          "value": "Returns A Playlist Image."
        },
        {
          "name": "Deletes A Playlist Image",
          "value": "Deletes A Playlist Image"
        },
        {
          "name": "Lists All Medias Of A Playlist.",
          "value": "Lists All Medias Of A Playlist."
        },
        {
          "name": "Moves One Or Many Given Medias One Position Up.",
          "value": "Moves One Or Many Given Medias One Position Up."
        },
        {
          "name": "Moves One Or Many Given Medias One Position Down.",
          "value": "Moves One Or Many Given Medias One Position Down."
        },
        {
          "name": "Moves One Or Many Given Medias After A Given Media.",
          "value": "Moves One Or Many Given Medias After A Given Media."
        },
        {
          "name": "Moves One Or Many Given Medias Before A Given Media.",
          "value": "Moves One Or Many Given Medias Before A Given Media."
        }
      ],
      "default": "Returns A Playlist In Its Given Extension",
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
            "Returns A Playlist In Its Given Extension"
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
            "Returns A Playlist In Its Given Extension"
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
            "Adds One Or Many Given Medias/folders To A Playlist."
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
            "Adds One Or Many Given Medias/folders To A Playlist."
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
            "Removes One Or Many Given Medias/folders From A Playlist."
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
            "Removes One Or Many Given Medias/folders From A Playlist."
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
            "Duplicates A Playlist."
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
            "Duplicates A Playlist."
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
            "Returns A Playlist Image."
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
            "Returns A Playlist Image."
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
            "Deletes A Playlist Image"
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
            "Deletes A Playlist Image"
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
            "Lists All Medias Of A Playlist."
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
            "Lists All Medias Of A Playlist."
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
            "Moves One Or Many Given Medias One Position Up."
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
            "Moves One Or Many Given Medias One Position Up."
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
            "Moves One Or Many Given Medias One Position Down."
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
            "Moves One Or Many Given Medias One Position Down."
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
            "Moves One Or Many Given Medias After A Given Media."
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
            "Moves One Or Many Given Medias After A Given Media."
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
            "Moves One Or Many Given Medias Before A Given Media."
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
            "Moves One Or Many Given Medias Before A Given Media."
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
          "value": "Generate Subtitle From Media"
        },
        {
          "name": "Get Summary From Media As Description",
          "value": "Get Summary From Media As Description"
        },
        {
          "name": "Get Summary From Subtitle",
          "value": "Get Summary From Subtitle"
        },
        {
          "name": "Get Custom Summary From Media",
          "value": "Get Custom Summary From Media"
        },
        {
          "name": "Translate Subtitle",
          "value": "Translate Subtitle"
        }
      ],
      "default": "Generate Subtitle From Media",
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
            "Generate Subtitle From Media"
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
            "Generate Subtitle From Media"
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
            "Get Summary From Media As Description"
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
            "Get Summary From Media As Description"
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
            "Get Summary From Subtitle"
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
            "Get Summary From Subtitle"
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
            "Get Summary From Subtitle"
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
            "Get Custom Summary From Media"
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
            "Get Custom Summary From Media"
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
            "Get Custom Summary From Media"
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
            "Translate Subtitle"
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
            "Translate Subtitle"
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
            "Translate Subtitle"
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
            "Translate Subtitle"
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
            "V2 > User Activity"
          ]
        }
      },
      "options": [
        {
          "name": "Get Channel User Activity Log",
          "value": "Get Channel User Activity Log"
        },
        {
          "name": "Put User Activity Log",
          "value": "Put User Activity Log"
        },
        {
          "name": "Get Folder User Activity Log",
          "value": "Get Folder User Activity Log"
        },
        {
          "name": "Get Media User Activity Log",
          "value": "Get Media User Activity Log"
        }
      ],
      "default": "Get Channel User Activity Log",
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
            "V2 > User Activity"
          ],
          "operation": [
            "Get Channel User Activity Log"
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
            "V2 > User Activity"
          ],
          "operation": [
            "Put User Activity Log"
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
            "V2 > User Activity"
          ],
          "operation": [
            "Get Folder User Activity Log"
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
            "V2 > User Activity"
          ],
          "operation": [
            "Get Folder User Activity Log"
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
            "V2 > User Activity"
          ],
          "operation": [
            "Get Media User Activity Log"
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
            "V2 > User Activity"
          ],
          "operation": [
            "Get Media User Activity Log"
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
          "value": "List Advertisements."
        },
        {
          "name": "Create An Advertisement.",
          "value": "Create An Advertisement."
        },
        {
          "name": "Bulk Delete Advertisements.",
          "value": "Bulk Delete Advertisements."
        },
        {
          "name": "Show Ad Details.",
          "value": "Show Ad Details."
        },
        {
          "name": "Update Advertisement.",
          "value": "Update Advertisement."
        },
        {
          "name": "Delete Advertisement.",
          "value": "Delete Advertisement."
        }
      ],
      "default": "List Advertisements.",
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
            "List Advertisements."
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
            "List Advertisements."
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
            "Create An Advertisement."
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
            "Create An Advertisement."
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
            "Create An Advertisement."
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
            "Create An Advertisement."
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
            "Create An Advertisement."
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
            "Bulk Delete Advertisements."
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
            "Bulk Delete Advertisements."
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
            "Show Ad Details."
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
            "Update Advertisement."
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
            "Update Advertisement."
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
            "Update Advertisement."
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
            "Update Advertisement."
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
            "Update Advertisement."
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
            "Delete Advertisement."
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
          "value": "List Alerts."
        },
        {
          "name": "Get Alert.",
          "value": "Get Alert."
        }
      ],
      "default": "List Alerts.",
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
            "List Alerts."
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
            "List Alerts."
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
            "Get Alert."
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
          "value": "List Callbacks."
        },
        {
          "name": "Create Callback.",
          "value": "Create Callback."
        },
        {
          "name": "Show Callback Details.",
          "value": "Show Callback Details."
        },
        {
          "name": "Update Callback Details.",
          "value": "Update Callback Details."
        },
        {
          "name": "Delete Callback.",
          "value": "Delete Callback."
        }
      ],
      "default": "List Callbacks.",
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
            "List Callbacks."
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
            "Create Callback."
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
            "Create Callback."
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
            "Show Callback Details."
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
            "Update Callback Details."
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
            "Update Callback Details."
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
            "Delete Callback."
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
          "value": "List Categories."
        }
      ],
      "default": "List Categories.",
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
            "List Categories."
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
          "value": "List Channels."
        },
        {
          "name": "Show Channel Details.",
          "value": "Show Channel Details."
        },
        {
          "name": "Get Channel Used Disk Space.",
          "value": "Get Channel Used Disk Space."
        },
        {
          "name": "Get Trash Disk Usage.",
          "value": "Get Trash Disk Usage."
        },
        {
          "name": "Get Folder Disk Usage.",
          "value": "Get Folder Disk Usage."
        }
      ],
      "default": "List Channels.",
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
            "List Channels."
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
            "List Channels."
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
            "Show Channel Details."
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
            "Get Channel Used Disk Space."
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
            "Get Channel Used Disk Space."
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
            "Get Trash Disk Usage."
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
            "Get Trash Disk Usage."
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
            "Get Folder Disk Usage."
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
            "Get Folder Disk Usage."
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
          "value": "List Chapters."
        },
        {
          "name": "Show Chapter Details.",
          "value": "Show Chapter Details."
        }
      ],
      "default": "List Chapters.",
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
            "List Chapters."
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
            "List Chapters."
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
            "Show Chapter Details."
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
            "Show Chapter Details."
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
          "value": "List Countries."
        }
      ],
      "default": "List Countries.",
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
            "List Countries."
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
          "value": "List Encodings."
        },
        {
          "name": "Create Encoding.",
          "value": "Create Encoding."
        },
        {
          "name": "Bulk Delete Encodings.",
          "value": "Bulk Delete Encodings."
        },
        {
          "name": "Show Encoding Details.",
          "value": "Show Encoding Details."
        },
        {
          "name": "Update Encoding.",
          "value": "Update Encoding."
        },
        {
          "name": "Delete Encoding.",
          "value": "Delete Encoding."
        },
        {
          "name": "List Encoding Constraints.",
          "value": "List Encoding Constraints."
        },
        {
          "name": "List Encoding Profiles.",
          "value": "List Encoding Profiles."
        }
      ],
      "default": "List Encodings.",
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
            "List Encodings."
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
            "List Encodings."
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
            "Create Encoding."
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
            "Create Encoding."
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
            "Bulk Delete Encodings."
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
            "Bulk Delete Encodings."
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
            "Show Encoding Details."
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
            "Update Encoding."
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
            "Update Encoding."
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
            "Delete Encoding."
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
          "value": "Browse Channel Root."
        },
        {
          "name": "Discard File(s).",
          "value": "Discard File(s)."
        },
        {
          "name": "Get Root Tree.",
          "value": "Get Root Tree."
        },
        {
          "name": "Get Root Breadcrumb.",
          "value": "Get Root Breadcrumb."
        },
        {
          "name": "Browse Trash.",
          "value": "Browse Trash."
        },
        {
          "name": "Empty Trash.",
          "value": "Empty Trash."
        },
        {
          "name": "Browse Folder.",
          "value": "Browse Folder."
        },
        {
          "name": "Get Folder Breadcrumb.",
          "value": "Get Folder Breadcrumb."
        },
        {
          "name": "Get Folder Tree.",
          "value": "Get Folder Tree."
        },
        {
          "name": "Restore File(s).",
          "value": "Restore File(s)."
        },
        {
          "name": "Move File(s).",
          "value": "Move File(s)."
        }
      ],
      "default": "Browse Channel Root.",
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
            "Browse Channel Root."
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
            "Browse Channel Root."
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
            "Discard File(s)."
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
            "Discard File(s)."
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
            "Get Root Tree."
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
            "Get Root Breadcrumb."
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
            "Browse Trash."
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
            "Browse Trash."
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
            "Empty Trash."
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
            "Empty Trash."
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
            "Browse Folder."
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
            "Browse Folder."
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
            "Get Folder Breadcrumb."
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
            "Get Folder Tree."
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
            "Restore File(s)."
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
            "Restore File(s)."
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
            "Move File(s)."
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
            "Move File(s)."
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
            "Move File(s)."
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
          "value": "Show Root Folder."
        },
        {
          "name": "List Folders.",
          "value": "List Folders."
        },
        {
          "name": "Create Folder.",
          "value": "Create Folder."
        },
        {
          "name": "Show Folder Details.",
          "value": "Show Folder Details."
        },
        {
          "name": "Update Folder Details.",
          "value": "Update Folder Details."
        },
        {
          "name": "Delete A Folder.",
          "value": "Delete A Folder."
        },
        {
          "name": "Synchronize Encodings For A Folder.",
          "value": "Synchronize Encodings For A Folder."
        },
        {
          "name": "Attach Encodings To A Folder.",
          "value": "Attach Encodings To A Folder."
        },
        {
          "name": "Detach Encodings From A Folder.",
          "value": "Detach Encodings From A Folder."
        },
        {
          "name": "Attach A Logo To A Folder.",
          "value": "Attach A Logo To A Folder."
        },
        {
          "name": "Detach A Logo From A Folder.",
          "value": "Detach A Logo From A Folder."
        },
        {
          "name": "Attach Labels To A Folder.",
          "value": "Attach Labels To A Folder."
        },
        {
          "name": "Detach Labels From A Folder.",
          "value": "Detach Labels From A Folder."
        },
        {
          "name": "Locks The Provided Folder.",
          "value": "Locks The Provided Folder."
        },
        {
          "name": "Unlocks The Provided Folder.",
          "value": "Unlocks The Provided Folder."
        }
      ],
      "default": "Show Root Folder.",
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
            "Show Root Folder."
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
            "List Folders."
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
            "List Folders."
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
            "Create Folder."
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
            "Create Folder."
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
            "Create Folder."
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
            "Show Folder Details."
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
            "Update Folder Details."
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
            "Update Folder Details."
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
            "Delete A Folder."
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
            "Synchronize Encodings For A Folder."
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
            "Synchronize Encodings For A Folder."
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
            "Attach Encodings To A Folder."
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
            "Attach Encodings To A Folder."
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
            "Detach Encodings From A Folder."
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
            "Detach Encodings From A Folder."
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
            "Attach A Logo To A Folder."
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
            "Attach A Logo To A Folder."
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
            "Detach A Logo From A Folder."
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
            "Attach Labels To A Folder."
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
            "Attach Labels To A Folder."
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
            "Detach Labels From A Folder."
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
            "Detach Labels From A Folder."
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
            "Locks The Provided Folder."
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
            "Unlocks The Provided Folder."
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
          "value": "List FTP Users."
        },
        {
          "name": "Create FTP User.",
          "value": "Create FTP User."
        },
        {
          "name": "Show FTP User Details.",
          "value": "Show FTP User Details."
        },
        {
          "name": "Update FTP User Details.",
          "value": "Update FTP User Details."
        },
        {
          "name": "Delete FTP User.",
          "value": "Delete FTP User."
        },
        {
          "name": "Login.",
          "value": "Login."
        },
        {
          "name": "On Connect Callback.",
          "value": "On Connect Callback."
        },
        {
          "name": "On Disconnect Callback.",
          "value": "On Disconnect Callback."
        },
        {
          "name": "On Login Callback.",
          "value": "On Login Callback."
        },
        {
          "name": "On Login Failed Callback.",
          "value": "On Login Failed Callback."
        },
        {
          "name": "On Logout Callback.",
          "value": "On Logout Callback."
        }
      ],
      "default": "List FTP Users.",
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
            "List FTP Users."
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
            "List FTP Users."
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
            "Create FTP User."
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
            "Create FTP User."
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
            "Create FTP User."
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
            "Create FTP User."
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
            "Show FTP User Details."
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
            "Update FTP User Details."
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
            "Update FTP User Details."
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
            "Delete FTP User."
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
            "Login."
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
            "Login."
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
          "value": "Get Media Journal."
        },
        {
          "name": "Get Journal.",
          "value": "Get Journal."
        }
      ],
      "default": "Get Media Journal.",
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
            "Get Media Journal."
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
            "Get Media Journal."
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
            "Get Journal."
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
            "Get Journal."
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
          "value": "List Labels."
        },
        {
          "name": "Bulk Attach Labels.",
          "value": "Bulk Attach Labels."
        },
        {
          "name": "Bulk Delete Labels.",
          "value": "Bulk Delete Labels."
        },
        {
          "name": "Show Label Details.",
          "value": "Show Label Details."
        },
        {
          "name": "Update Label.",
          "value": "Update Label."
        },
        {
          "name": "Delete Label.",
          "value": "Delete Label."
        }
      ],
      "default": "List Labels.",
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
            "List Labels."
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
            "List Labels."
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
            "Bulk Attach Labels."
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
            "Bulk Attach Labels."
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
            "Bulk Delete Labels."
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
            "Bulk Delete Labels."
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
            "Show Label Details."
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
            "Update Label."
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
            "Update Label."
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
            "Delete Label."
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
          "value": "List Languages."
        },
        {
          "name": "Show Language Details.",
          "value": "Show Language Details."
        }
      ],
      "default": "List Languages.",
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
            "List Languages."
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
            "Show Language Details."
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
            "V3 > Linked Svc"
          ]
        }
      },
      "options": [
        {
          "name": "Sync Linked Services.",
          "value": "Sync Linked Services."
        }
      ],
      "default": "Sync Linked Services.",
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
            "V3 > Linked Svc"
          ],
          "operation": [
            "Sync Linked Services."
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
            "V3 > Linked Svc"
          ],
          "operation": [
            "Sync Linked Services."
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
          "value": "List Logos."
        },
        {
          "name": "Create A New Logo.",
          "value": "Create A New Logo."
        },
        {
          "name": "Bulk Delete Logos.",
          "value": "Bulk Delete Logos."
        },
        {
          "name": "Show Logo Details.",
          "value": "Show Logo Details."
        },
        {
          "name": "Update Logo Details.",
          "value": "Update Logo Details."
        },
        {
          "name": "Delete A Logo.",
          "value": "Delete A Logo."
        }
      ],
      "default": "List Logos.",
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
            "List Logos."
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
            "List Logos."
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
            "Create A New Logo."
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
            "Create A New Logo."
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
            "Create A New Logo."
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
            "Bulk Delete Logos."
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
            "Bulk Delete Logos."
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
            "Show Logo Details."
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
            "Update Logo Details."
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
            "Update Logo Details."
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
            "Delete A Logo."
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
          "value": "List Media."
        },
        {
          "name": "Get Media Statuses Counters.",
          "value": "Get Media Statuses Counters."
        },
        {
          "name": "Show Media Details.",
          "value": "Show Media Details."
        },
        {
          "name": "Update Media Details.",
          "value": "Update Media Details."
        },
        {
          "name": "Get Metadata From A Media.",
          "value": "Get Metadata From A Media."
        },
        {
          "name": "Update Metadata From A Media.",
          "value": "Update Metadata From A Media."
        },
        {
          "name": "Deletes Metadata From A Media.",
          "value": "Deletes Metadata From A Media."
        },
        {
          "name": "Share Media.",
          "value": "Share Media."
        },
        {
          "name": "Bulk Delete Media Shares.",
          "value": "Bulk Delete Media Shares."
        },
        {
          "name": "Attach Suggested Media.",
          "value": "Attach Suggested Media."
        },
        {
          "name": "Attach Labels To A Media.",
          "value": "Attach Labels To A Media."
        },
        {
          "name": "Detach Labels From A Media.",
          "value": "Detach Labels From A Media."
        }
      ],
      "default": "List Media.",
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
            "List Media."
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
            "List Media."
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
            "Get Media Statuses Counters."
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
            "Get Media Statuses Counters."
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
            "Show Media Details."
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
            "Update Media Details."
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
            "Update Media Details."
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
            "Get Metadata From A Media."
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
            "Get Metadata From A Media."
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
            "Update Metadata From A Media."
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
            "Update Metadata From A Media."
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
            "Deletes Metadata From A Media."
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
            "Deletes Metadata From A Media."
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
            "Share Media."
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
            "Share Media."
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
            "Bulk Delete Media Shares."
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
            "Bulk Delete Media Shares."
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
            "Attach Suggested Media."
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
            "Attach Suggested Media."
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
            "Attach Labels To A Media."
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
            "Attach Labels To A Media."
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
            "Detach Labels From A Media."
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
            "Detach Labels From A Media."
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
          "value": "List Metadata."
        },
        {
          "name": "Bulk Attach Metadata.",
          "value": "Bulk Attach Metadata."
        },
        {
          "name": "Bulk Delete Metadata.",
          "value": "Bulk Delete Metadata."
        },
        {
          "name": "Update Metadata.",
          "value": "Update Metadata."
        },
        {
          "name": "Delete Metadata.",
          "value": "Delete Metadata."
        }
      ],
      "default": "List Metadata.",
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
            "List Metadata."
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
            "List Metadata."
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
            "Bulk Attach Metadata."
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
            "Bulk Attach Metadata."
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
            "Bulk Delete Metadata."
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
            "Bulk Delete Metadata."
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
            "Update Metadata."
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
            "Update Metadata."
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
            "Delete Metadata."
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
          "value": "List Mixtapes."
        },
        {
          "name": "Create A Mixtape.",
          "value": "Create A Mixtape."
        },
        {
          "name": "Bulk Delete Mixtapes.",
          "value": "Bulk Delete Mixtapes."
        },
        {
          "name": "Show Mixtape Details.",
          "value": "Show Mixtape Details."
        },
        {
          "name": "Update A Mixtape.",
          "value": "Update A Mixtape."
        },
        {
          "name": "Delete A Mixtape.",
          "value": "Delete A Mixtape."
        },
        {
          "name": "List Media In Mixtape.",
          "value": "List Media In Mixtape."
        },
        {
          "name": "Attach Direct Media.",
          "value": "Attach Direct Media."
        },
        {
          "name": "Detach Direct Media.",
          "value": "Detach Direct Media."
        },
        {
          "name": "Move A Manually Attached Media In Mixtape.",
          "value": "Move A Manually Attached Media In Mixtape."
        }
      ],
      "default": "List Mixtapes.",
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
            "List Mixtapes."
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
            "List Mixtapes."
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
            "Create A Mixtape."
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
            "Create A Mixtape."
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
            "Create A Mixtape."
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
            "Bulk Delete Mixtapes."
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
            "Bulk Delete Mixtapes."
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
            "Show Mixtape Details."
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
            "Update A Mixtape."
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
            "Update A Mixtape."
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
            "Delete A Mixtape."
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
            "List Media In Mixtape."
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
            "List Media In Mixtape."
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
            "Attach Direct Media."
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
            "Attach Direct Media."
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
            "Detach Direct Media."
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
            "Detach Direct Media."
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
            "Move A Manually Attached Media In Mixtape."
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
            "Move A Manually Attached Media In Mixtape."
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
            "Move A Manually Attached Media In Mixtape."
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
            "Move A Manually Attached Media In Mixtape."
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
          "value": "List Players."
        },
        {
          "name": "Create Player.",
          "value": "Create Player."
        },
        {
          "name": "Bulk Delete Players.",
          "value": "Bulk Delete Players."
        },
        {
          "name": "Show Player Details.",
          "value": "Show Player Details."
        },
        {
          "name": "Update Player Details.",
          "value": "Update Player Details."
        },
        {
          "name": "Delete Player.",
          "value": "Delete Player."
        }
      ],
      "default": "List Players.",
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
            "List Players."
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
            "List Players."
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
            "Create Player."
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
            "Create Player."
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
            "Create Player."
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
            "Bulk Delete Players."
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
            "Bulk Delete Players."
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
            "Show Player Details."
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
            "Update Player Details."
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
            "Update Player Details."
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
            "Delete Player."
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
          "value": "List Playlists."
        },
        {
          "name": "List Media In Playlist.",
          "value": "List Media In Playlist."
        },
        {
          "name": "Show Playlist Details.",
          "value": "Show Playlist Details."
        }
      ],
      "default": "List Playlists.",
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
            "List Playlists."
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
            "List Playlists."
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
            "List Media In Playlist."
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
            "List Media In Playlist."
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
            "Show Playlist Details."
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
          "value": "Get Vversion"
        },
        {
          "name": "Create Vversion",
          "value": "Create Vversion"
        }
      ],
      "default": "Get Vversion",
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
            "Get Vversion"
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
            "Get Vversion"
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
            "Create Vversion"
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
            "Create Vversion"
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
          "value": "Download Media Source."
        },
        {
          "name": "Display Thumbnail.",
          "value": "Display Thumbnail."
        },
        {
          "name": "Display Playlist Image.",
          "value": "Display Playlist Image."
        },
        {
          "name": "Display Share Image.",
          "value": "Display Share Image."
        },
        {
          "name": "Render Share Link.",
          "value": "Render Share Link."
        },
        {
          "name": "Display Player Image.",
          "value": "Display Player Image."
        },
        {
          "name": "Display A Logo Image.",
          "value": "Display A Logo Image."
        },
        {
          "name": "Render Chapter.",
          "value": "Render Chapter."
        },
        {
          "name": "Display Chapter Image.",
          "value": "Display Chapter Image."
        },
        {
          "name": "Render Subtitle.",
          "value": "Render Subtitle."
        },
        {
          "name": "List Suggested Media.",
          "value": "List Suggested Media."
        }
      ],
      "default": "Download Media Source.",
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
            "Download Media Source."
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
            "Display Thumbnail."
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
            "Display Thumbnail."
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
            "Display Playlist Image."
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
            "Display Playlist Image."
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
            "Display Share Image."
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
            "Display Share Image."
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
            "Display Share Image."
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
            "Render Share Link."
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
            "Render Share Link."
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
            "Display Player Image."
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
            "Display Player Image."
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
            "Display Player Image."
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
            "Display A Logo Image."
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
            "Display A Logo Image."
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
            "Render Chapter."
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
            "Render Chapter."
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
            "Display Chapter Image."
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
            "Display Chapter Image."
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
            "Render Subtitle."
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
            "Render Subtitle."
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
            "List Suggested Media."
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
          "value": "List Channel Shares."
        },
        {
          "name": "Bulk Delete Shares.",
          "value": "Bulk Delete Shares."
        },
        {
          "name": "List Media Shares.",
          "value": "List Media Shares."
        },
        {
          "name": "Show Share Details.",
          "value": "Show Share Details."
        },
        {
          "name": "Update Share Details.",
          "value": "Update Share Details."
        },
        {
          "name": "Delete Share.",
          "value": "Delete Share."
        }
      ],
      "default": "List Channel Shares.",
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
            "List Channel Shares."
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
            "List Channel Shares."
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
            "Bulk Delete Shares."
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
            "Bulk Delete Shares."
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
            "List Media Shares."
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
            "List Media Shares."
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
            "Show Share Details."
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
            "Update Share Details."
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
            "Update Share Details."
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
            "Delete Share."
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
          "value": "Get Top Media Statistics."
        },
        {
          "name": "Get Media Unique Viewers' Statistics.",
          "value": "Get Media Unique Viewers' Statistics."
        },
        {
          "name": "Get Media Viewers' Statistics.",
          "value": "Get Media Viewers' Statistics."
        },
        {
          "name": "Get The Consumption.",
          "value": "Get The Consumption."
        },
        {
          "name": "Get The View Time.",
          "value": "Get The View Time."
        },
        {
          "name": "Get The Viewers.",
          "value": "Get The Viewers."
        },
        {
          "name": "Get The Unique Viewers.",
          "value": "Get The Unique Viewers."
        },
        {
          "name": "Get The Average View Time.",
          "value": "Get The Average View Time."
        },
        {
          "name": "Get Encoding Statistics.",
          "value": "Get Encoding Statistics."
        },
        {
          "name": "Get Browsers Statistics.",
          "value": "Get Browsers Statistics."
        },
        {
          "name": "Get Browsers Statistics.",
          "value": "Get Browsers Statistics. (2)"
        },
        {
          "name": "Get Cities Statistics.",
          "value": "Get Cities Statistics."
        },
        {
          "name": "Get Countries Statistics.",
          "value": "Get Countries Statistics."
        },
        {
          "name": "Get Operating System Statistics.",
          "value": "Get Operating System Statistics."
        },
        {
          "name": "Get Playbacks Statistics.",
          "value": "Get Playbacks Statistics."
        },
        {
          "name": "Get Players Statistics.",
          "value": "Get Players Statistics."
        },
        {
          "name": "Get Cluster Statistics.",
          "value": "Get Cluster Statistics."
        },
        {
          "name": "Get Viewers Per Encoding Statistics.",
          "value": "Get Viewers Per Encoding Statistics."
        },
        {
          "name": "Get Consumed Time Per IP Statistics.",
          "value": "Get Consumed Time Per IP Statistics."
        },
        {
          "name": "Get Consumed Time Per Encoding Statistics.",
          "value": "Get Consumed Time Per Encoding Statistics."
        }
      ],
      "default": "Get Top Media Statistics.",
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
            "Get Top Media Statistics."
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
            "Get Top Media Statistics."
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
            "Get Media Unique Viewers' Statistics."
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
            "Get Media Unique Viewers' Statistics."
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
            "Get Media Unique Viewers' Statistics."
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
            "Get Media Viewers' Statistics."
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
            "Get Media Viewers' Statistics."
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
            "Get Media Viewers' Statistics."
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
            "Get The Consumption."
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
            "Get The Consumption."
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
            "Get The View Time."
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
            "Get The View Time."
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
            "Get The Viewers."
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
            "Get The Viewers."
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
            "Get The Unique Viewers."
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
            "Get The Unique Viewers."
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
            "Get The Average View Time."
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
            "Get The Average View Time."
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
            "Get Encoding Statistics."
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
            "Get Encoding Statistics."
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
            "Get Browsers Statistics."
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
            "Get Browsers Statistics."
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
            "Get Browsers Statistics. (2)"
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
            "Get Browsers Statistics. (2)"
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
            "Get Cities Statistics."
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
            "Get Cities Statistics."
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
            "Get Countries Statistics."
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
            "Get Countries Statistics."
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
            "Get Operating System Statistics."
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
            "Get Operating System Statistics."
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
            "Get Playbacks Statistics."
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
            "Get Playbacks Statistics."
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
            "Get Players Statistics."
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
            "Get Players Statistics."
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
            "Get Cluster Statistics."
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
            "Get Cluster Statistics."
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
            "Get Viewers Per Encoding Statistics."
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
            "Get Viewers Per Encoding Statistics."
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
            "Get Consumed Time Per IP Statistics."
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
            "Get Consumed Time Per IP Statistics."
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
            "Get Consumed Time Per Encoding Statistics."
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
            "Get Consumed Time Per Encoding Statistics."
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
          "value": "List Subtitles."
        },
        {
          "name": "Create Subtitle.",
          "value": "Create Subtitle."
        },
        {
          "name": "Bulk Delete Subtitles.",
          "value": "Bulk Delete Subtitles."
        },
        {
          "name": "Show Subtitle Details.",
          "value": "Show Subtitle Details."
        },
        {
          "name": "Update Subtitle Details.",
          "value": "Update Subtitle Details."
        },
        {
          "name": "Delete A Subtitle.",
          "value": "Delete A Subtitle."
        }
      ],
      "default": "List Subtitles.",
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
            "List Subtitles."
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
            "List Subtitles."
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
            "Create Subtitle."
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
            "Create Subtitle."
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
            "Create Subtitle."
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
            "Bulk Delete Subtitles."
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
            "Bulk Delete Subtitles."
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
            "Show Subtitle Details."
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
            "Update Subtitle Details."
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
            "Update Subtitle Details."
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
            "Delete A Subtitle."
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
          "value": "List Thumbnails."
        },
        {
          "name": "Show Thumbnail Details.",
          "value": "Show Thumbnail Details."
        }
      ],
      "default": "List Thumbnails.",
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
            "List Thumbnails."
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
            "List Thumbnails."
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
            "Show Thumbnail Details."
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
          "value": "Get An Upload Endpooint."
        },
        {
          "name": "Create Upload",
          "value": "Create Upload"
        }
      ],
      "default": "Get An Upload Endpooint.",
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
            "Get An Upload Endpooint."
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
            "Create Upload"
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
            "Create Upload"
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
            "List Advertisements.",
            "List Alerts.",
            "List Categories.",
            "List Channels.",
            "List Chapters.",
            "Show Chapter Details.",
            "List Countries.",
            "List Encodings.",
            "Browse Channel Root.",
            "Browse Trash.",
            "List Folders.",
            "List FTP Users.",
            "Get Media Journal.",
            "Get Journal.",
            "List Labels.",
            "List Languages.",
            "List Logos.",
            "List Media.",
            "Get Media Statuses Counters.",
            "Get Metadata From A Media.",
            "List Metadata.",
            "List Mixtapes.",
            "List Media In Mixtape.",
            "List Players.",
            "List Playlists.",
            "List Media In Playlist.",
            "List Channel Shares.",
            "List Media Shares.",
            "List Subtitles.",
            "List Thumbnails."
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
            "List Advertisements.",
            "List Alerts.",
            "List Categories.",
            "List Channels.",
            "List Chapters.",
            "Show Chapter Details.",
            "List Countries.",
            "List Encodings.",
            "Browse Channel Root.",
            "Browse Trash.",
            "List Folders.",
            "List FTP Users.",
            "Get Media Journal.",
            "Get Journal.",
            "List Labels.",
            "List Languages.",
            "List Logos.",
            "List Media.",
            "Get Media Statuses Counters.",
            "Get Metadata From A Media.",
            "List Metadata.",
            "List Mixtapes.",
            "List Media In Mixtape.",
            "List Players.",
            "List Playlists.",
            "List Media In Playlist.",
            "List Channel Shares.",
            "List Media Shares.",
            "List Subtitles.",
            "List Thumbnails."
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
