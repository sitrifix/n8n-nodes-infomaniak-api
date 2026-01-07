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
  "Channel": {
    "List Channels": {
      "method": "GET",
      "path": "/1/videos",
      "pagination": "limit-skip",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create A Channel": {
      "method": "POST",
      "path": "/1/videos",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Return A Channel": {
      "method": "GET",
      "path": "/1/videos/{channel}",
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
    "Update A Channel": {
      "method": "PUT",
      "path": "/1/videos/{channel}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
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
    "Delete A Channel": {
      "method": "DELETE",
      "path": "/1/videos/{channel}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Channel > Config": {
    "Config A Channel": {
      "method": "POST",
      "path": "/1/videos/{channel}/encodes",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "password",
          "field": "body_password"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Event": {
    "List All Events": {
      "method": "GET",
      "path": "/1/videos/{channel}/events",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create An Event": {
      "method": "POST",
      "path": "/1/videos/{channel}/events",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "authorize_country",
          "field": "body_authorize_country"
        },
        {
          "name": "fragment_duration",
          "field": "body_fragment_duration"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "start_at",
          "field": "body_start_at"
        },
        {
          "name": "stop_at",
          "field": "body_stop_at"
        },
        {
          "name": "stop_live",
          "field": "body_stop_live"
        },
        {
          "name": "timezone",
          "field": "body_timezone"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Return An Event": {
      "method": "GET",
      "path": "/1/videos/{channel}/events/{repeatable_planned_event}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "repeatable_planned_event",
          "field": "path_repeatable_planned_event"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update An Event": {
      "method": "PUT",
      "path": "/1/videos/{channel}/events/{repeatable_planned_event}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "repeatable_planned_event",
          "field": "path_repeatable_planned_event"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "authorize_country",
          "field": "body_authorize_country"
        },
        {
          "name": "fragment_duration",
          "field": "body_fragment_duration"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "start_at",
          "field": "body_start_at"
        },
        {
          "name": "stop_at",
          "field": "body_stop_at"
        },
        {
          "name": "stop_live",
          "field": "body_stop_live"
        },
        {
          "name": "timezone",
          "field": "body_timezone"
        },
        {
          "name": "type",
          "field": "body_type"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete An Event": {
      "method": "DELETE",
      "path": "/1/videos/{channel}/events/{repeatable_planned_event}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "repeatable_planned_event",
          "field": "path_repeatable_planned_event"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Integrations": {
    "Integration Code": {
      "method": "GET",
      "path": "/1/videos/{channel}/integrations",
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
  "Live": {
    "Resume The Live": {
      "method": "PUT",
      "path": "/1/videos/{channel}/live/start",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
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
    "Interrupt The Live": {
      "method": "PUT",
      "path": "/1/videos/{channel}/live/stop",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
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
    }
  },
  "Misc > Countries": {
    "List Countries": {
      "method": "GET",
      "path": "/1/videos/countries",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "List Timezones": {
      "method": "GET",
      "path": "/1/videos/timezones",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Misc > Stream": {
    "Generate Stream Key": {
      "method": "GET",
      "path": "/1/videos/password",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Option": {
    "List Option": {
      "method": "GET",
      "path": "/1/videos/{channel}/options",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Return Option": {
      "method": "GET",
      "path": "/1/videos/{channel}/options/{video_option}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "video_option",
          "field": "path_video_option"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Undertake Option": {
      "method": "PUT",
      "path": "/1/videos/{channel}/options/{video_option}/recommit",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "video_option",
          "field": "path_video_option"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Terminate Option": {
      "method": "DELETE",
      "path": "/1/videos/{channel}/options/{video_option}/terminate",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "video_option",
          "field": "path_video_option"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Option > Record": {
    "Show A Storage Config": {
      "method": "GET",
      "path": "/1/videos/{channel}/options/recording",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create Recording Config": {
      "method": "POST",
      "path": "/1/videos/{channel}/options/recording",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update Recording Config": {
      "method": "PUT",
      "path": "/1/videos/{channel}/options/recording",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Option > Record > Instant": {
    "Start A Record": {
      "method": "POST",
      "path": "/1/videos/{channel}/options/recording/instant",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "auto_stop",
          "field": "body_auto_stop"
        },
        {
          "name": "fragment_duration",
          "field": "body_fragment_duration"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "selected_storage_id",
          "field": "body_selected_storage_id"
        },
        {
          "name": "storage",
          "field": "body_storage"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Stop A Record": {
      "method": "DELETE",
      "path": "/1/videos/{channel}/options/recording/instant",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Option > Record > Storage": {
    "Lists All Storage Machine": {
      "method": "GET",
      "path": "/1/videos/{channel}/options/recording/storage",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Return A Storage Machine": {
      "method": "POST",
      "path": "/1/videos/{channel}/options/recording/storage",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update A Storage Machine": {
      "method": "POST",
      "path": "/1/videos/{channel}/options/recording/storage/test",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "auto_fragment_duration",
          "field": "body_auto_fragment_duration"
        },
        {
          "name": "default",
          "field": "body_default"
        },
        {
          "name": "protocol",
          "field": "body_protocol"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Create A Storage Machine": {
      "method": "GET",
      "path": "/1/videos/{channel}/options/recording/storage/{storage_machine}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "storage_machine",
          "field": "path_storage_machine"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update A Storage Machine (2)": {
      "method": "PUT",
      "path": "/1/videos/{channel}/options/recording/storage/{storage_machine}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "storage_machine",
          "field": "path_storage_machine"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update A Storage Machine (3)": {
      "method": "DELETE",
      "path": "/1/videos/{channel}/options/recording/storage/{storage_machine}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "storage_machine",
          "field": "path_storage_machine"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Option > Timeshift": {
    "Return Timeshift Config": {
      "method": "GET",
      "path": "/1/videos/{channel}/options/timeshift",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create A Timeshift Config.": {
      "method": "POST",
      "path": "/1/videos/{channel}/options/timeshift",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update A Timeshift Config": {
      "method": "PUT",
      "path": "/1/videos/{channel}/options/timeshift",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Option > Watermarking": {
    "Return Watermark": {
      "method": "GET",
      "path": "/1/videos/{channel}/options/watermark",
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
    "Update Watermark": {
      "method": "PUT",
      "path": "/1/videos/{channel}/options/watermark",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "align",
          "field": "body_align"
        },
        {
          "name": "horizontal_offset",
          "field": "body_horizontal_offset"
        },
        {
          "name": "vertical_offset",
          "field": "body_vertical_offset"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Enabled Watermark": {
      "method": "PUT",
      "path": "/1/videos/{channel}/options/watermark/enable",
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
    "Disable Watermark": {
      "method": "PUT",
      "path": "/1/videos/{channel}/options/watermark/disable",
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
    }
  },
  "Option > Simulcast": {
    "Return Simulcast": {
      "method": "POST",
      "path": "/1/videos/{channel}/simulcasts/{simulcast_platform}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "simulcast_platform",
          "field": "path_simulcast_platform"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "additional_config",
          "field": "body_additional_config"
        },
        {
          "name": "application_instance",
          "field": "body_application_instance"
        },
        {
          "name": "application_name",
          "field": "body_application_name"
        },
        {
          "name": "enabled",
          "field": "body_enabled"
        },
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Lists All Simulcast Config": {
      "method": "GET",
      "path": "/1/videos/{channel}/simulcasts",
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
    "Return Simulcast (2)": {
      "method": "GET",
      "path": "/1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "simulcast_platform",
          "field": "path_simulcast_platform"
        },
        {
          "name": "simulcast_config",
          "field": "path_simulcast_config"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Return Simulcast (3)": {
      "method": "PUT",
      "path": "/1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "simulcast_platform",
          "field": "path_simulcast_platform"
        },
        {
          "name": "simulcast_config",
          "field": "path_simulcast_config"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "application_instance",
          "field": "body_application_instance"
        },
        {
          "name": "application_name",
          "field": "body_application_name"
        },
        {
          "name": "enabled",
          "field": "body_enabled"
        },
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete A Player": {
      "method": "DELETE",
      "path": "/1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "simulcast_platform",
          "field": "path_simulcast_platform"
        },
        {
          "name": "simulcast_config",
          "field": "path_simulcast_config"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Disable Simulcast": {
      "method": "PUT",
      "path": "/1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}/enable",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "simulcast_platform",
          "field": "path_simulcast_platform"
        },
        {
          "name": "simulcast_config",
          "field": "path_simulcast_config"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Disable Simulcast (2)": {
      "method": "PUT",
      "path": "/1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}/disable",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "simulcast_platform",
          "field": "path_simulcast_platform"
        },
        {
          "name": "simulcast_config",
          "field": "path_simulcast_config"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Players": {
    "Lists All Players": {
      "method": "GET",
      "path": "/1/videos/{channel}/players",
      "pagination": "limit-skip",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
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
    "Create A Player": {
      "method": "POST",
      "path": "/1/videos/{channel}/players",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "ads_enabled",
          "field": "body_ads_enabled"
        },
        {
          "name": "allow_full_screen",
          "field": "body_allow_full_screen"
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
          "name": "buffer",
          "field": "body_buffer"
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
          "name": "countdown",
          "field": "body_countdown"
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
          "name": "enable_twitter",
          "field": "body_enable_twitter"
        },
        {
          "name": "extract_preload_img",
          "field": "body_extract_preload_img"
        },
        {
          "name": "facebook_player_embed",
          "field": "body_facebook_player_embed"
        },
        {
          "name": "height",
          "field": "body_height"
        },
        {
          "name": "is360",
          "field": "body_is360"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "ratio",
          "field": "body_ratio"
        },
        {
          "name": "show_controls",
          "field": "body_show_controls"
        },
        {
          "name": "show_controls_during_ads",
          "field": "body_show_controls_during_ads"
        },
        {
          "name": "show_viewers",
          "field": "body_show_viewers"
        },
        {
          "name": "show_viewers_only_after",
          "field": "body_show_viewers_only_after"
        },
        {
          "name": "sound_enabled",
          "field": "body_sound_enabled"
        },
        {
          "name": "sound_percentage",
          "field": "body_sound_percentage"
        },
        {
          "name": "time_before_hide_cb",
          "field": "body_time_before_hide_cb"
        },
        {
          "name": "use_geo_ip_img",
          "field": "body_use_geo_ip_img"
        },
        {
          "name": "use_interrupt_img",
          "field": "body_use_interrupt_img"
        },
        {
          "name": "use_preload_img",
          "field": "body_use_preload_img"
        },
        {
          "name": "use_restrict_img",
          "field": "body_use_restrict_img"
        },
        {
          "name": "width",
          "field": "body_width"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Return A Player": {
      "method": "GET",
      "path": "/1/videos/{channel}/players/{player}",
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
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Copy A Player": {
      "method": "POST",
      "path": "/1/videos/{channel}/players/{player}",
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
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update A Player": {
      "method": "PUT",
      "path": "/1/videos/{channel}/players/{player}",
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
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "ads_enabled",
          "field": "body_ads_enabled"
        },
        {
          "name": "allow_full_screen",
          "field": "body_allow_full_screen"
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
          "name": "buffer",
          "field": "body_buffer"
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
          "name": "countdown",
          "field": "body_countdown"
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
          "name": "enable_twitter",
          "field": "body_enable_twitter"
        },
        {
          "name": "extract_preload_img",
          "field": "body_extract_preload_img"
        },
        {
          "name": "facebook_player_embed",
          "field": "body_facebook_player_embed"
        },
        {
          "name": "height",
          "field": "body_height"
        },
        {
          "name": "is360",
          "field": "body_is360"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "ratio",
          "field": "body_ratio"
        },
        {
          "name": "show_controls",
          "field": "body_show_controls"
        },
        {
          "name": "show_controls_during_ads",
          "field": "body_show_controls_during_ads"
        },
        {
          "name": "show_viewers",
          "field": "body_show_viewers"
        },
        {
          "name": "show_viewers_only_after",
          "field": "body_show_viewers_only_after"
        },
        {
          "name": "sound_enabled",
          "field": "body_sound_enabled"
        },
        {
          "name": "sound_percentage",
          "field": "body_sound_percentage"
        },
        {
          "name": "time_before_hide_cb",
          "field": "body_time_before_hide_cb"
        },
        {
          "name": "use_geo_ip_img",
          "field": "body_use_geo_ip_img"
        },
        {
          "name": "use_interrupt_img",
          "field": "body_use_interrupt_img"
        },
        {
          "name": "use_preload_img",
          "field": "body_use_preload_img"
        },
        {
          "name": "use_restrict_img",
          "field": "body_use_restrict_img"
        },
        {
          "name": "width",
          "field": "body_width"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete A Player": {
      "method": "DELETE",
      "path": "/1/videos/{channel}/players/{player}",
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
  "Players > Ads": {
    "List All Ads": {
      "method": "GET",
      "path": "/1/videos/{channel}/players/{player}/ads",
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
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create An Ads": {
      "method": "POST",
      "path": "/1/videos/{channel}/players/{player}/ads",
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
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "offset",
          "field": "body_offset"
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
    "Copy An Ads": {
      "method": "POST",
      "path": "/1/videos/{channel}/players/{player}/ads/duplicate",
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
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [
        {
          "name": "id",
          "field": "body_id"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Return An Ads": {
      "method": "GET",
      "path": "/1/videos/{channel}/players/{player}/ads/{ads}",
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
          "name": "ads",
          "field": "path_ads"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update An Ads": {
      "method": "PUT",
      "path": "/1/videos/{channel}/players/{player}/ads/{ads}",
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
          "name": "ads",
          "field": "path_ads"
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
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete An Ads": {
      "method": "DELETE",
      "path": "/1/videos/{channel}/players/{player}/ads/{ads}",
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
          "name": "ads",
          "field": "path_ads"
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
    }
  },
  "Players > Embeds": {
    "Integration Code": {
      "method": "GET",
      "path": "/1/videos/{channel}/players/{player}/embed",
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
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Integration URL": {
      "method": "GET",
      "path": "/1/videos/{channel}/players/{player}/embed/url",
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
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Players > Pictures": {
    "Show Picture": {
      "method": "GET",
      "path": "/1/videos/{channel}/players/{player}/thumbnail/{thumbnail}",
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
          "name": "thumbnail",
          "field": "path_thumbnail"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Prices": {
    "Get Price": {
      "method": "GET",
      "path": "/1/videos/shop/prices",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Get Description": {
      "method": "GET",
      "path": "/1/videos/shop/descriptions",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Restrictions": {
    "Show Restriction": {
      "method": "GET",
      "path": "/1/videos/{channel}/restrictions",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update Channels": {
      "method": "PUT",
      "path": "/1/videos/{channel}/restrictions",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Update Restriction Password": {
      "method": "PUT",
      "path": "/1/videos/{channel}/restrictions/password",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "pass_stream",
          "field": "body_pass_stream"
        },
        {
          "name": "password",
          "field": "body_password"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Stats > Channel > Connection History": {
    "Return List Of Connection": {
      "method": "GET",
      "path": "/1/videos/{channel}/history",
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
    "Return A Channel": {
      "method": "GET",
      "path": "/1/videos/{channel}/history/{connection_history}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "connection_history",
          "field": "path_connection_history"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Stats > Channel > Consumption": {
    "Consumption": {
      "method": "GET",
      "path": "/1/videos/{channel}/stats/consumption",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "to",
          "field": "query_to"
        },
        {
          "name": "per",
          "field": "query_per"
        },
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Consumption Per Resolution": {
      "method": "GET",
      "path": "/1/videos/{channel}/stats/consumption/resolutions/histogram",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "to",
          "field": "query_to"
        },
        {
          "name": "per",
          "field": "query_per"
        },
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Stats > Channel > Export Stats": {
    "Return Text/csv": {
      "method": "GET",
      "path": "/1/videos/{channel}/stats/export_csv/{statistics}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        },
        {
          "name": "statistics",
          "field": "path_statistics"
        }
      ],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        },
        {
          "name": "from",
          "field": "query_from"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Stats > Channel > Geolocation": {
    "Countries": {
      "method": "GET",
      "path": "/1/videos/{channel}/stats/geolocation/countries",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "to",
          "field": "query_to"
        },
        {
          "name": "per",
          "field": "query_per"
        },
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Clusters": {
      "method": "GET",
      "path": "/1/videos/{channel}/stats/geolocation/clusters",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "to",
          "field": "query_to"
        },
        {
          "name": "per",
          "field": "query_per"
        },
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Stats > Channel > Technologies": {
    "Browsers Share": {
      "method": "GET",
      "path": "/1/videos/{channel}/stats/technologies/browsers/shares",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "to",
          "field": "query_to"
        },
        {
          "name": "per",
          "field": "query_per"
        },
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Player Share": {
      "method": "GET",
      "path": "/1/videos/{channel}/stats/technologies/players/shares",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "to",
          "field": "query_to"
        },
        {
          "name": "per",
          "field": "query_per"
        },
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "OS Share": {
      "method": "GET",
      "path": "/1/videos/{channel}/stats/technologies/os/shares",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "to",
          "field": "query_to"
        },
        {
          "name": "per",
          "field": "query_per"
        },
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Stats > Channel > Viewers": {
    "Viewers Share": {
      "method": "GET",
      "path": "/1/videos/{channel}/stats/viewers",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "to",
          "field": "query_to"
        },
        {
          "name": "per",
          "field": "query_per"
        },
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Viewers Histogram Share": {
      "method": "GET",
      "path": "/1/videos/{channel}/stats/viewers/histogram",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "to",
          "field": "query_to"
        },
        {
          "name": "per",
          "field": "query_per"
        },
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Viewers Per Resolution Share.": {
      "method": "GET",
      "path": "/1/videos/{channel}/stats/viewers/resolutions/shares",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "to",
          "field": "query_to"
        },
        {
          "name": "per",
          "field": "query_per"
        },
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Viewers Per Resolution Histogram.": {
      "method": "GET",
      "path": "/1/videos/{channel}/stats/viewers/resolutions/histogram",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "to",
          "field": "query_to"
        },
        {
          "name": "per",
          "field": "query_per"
        },
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Unique Viewers.": {
      "method": "GET",
      "path": "/1/videos/{channel}/stats/viewers/uniques",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "to",
          "field": "query_to"
        },
        {
          "name": "per",
          "field": "query_per"
        },
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Stats > Channel > Viewing": {
    "Viewing Time": {
      "method": "GET",
      "path": "/1/videos/{channel}/stats/viewing",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "to",
          "field": "query_to"
        },
        {
          "name": "per",
          "field": "query_per"
        },
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Viewing Histogram Par Channel": {
      "method": "GET",
      "path": "/1/videos/{channel}/stats/viewing/resolutions/histogram",
      "pagination": "none",
      "pathParams": [
        {
          "name": "channel",
          "field": "path_channel"
        }
      ],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "to",
          "field": "query_to"
        },
        {
          "name": "per",
          "field": "query_per"
        },
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Stats > Globals > Consumption": {
    "Consumption": {
      "method": "GET",
      "path": "/1/videos/stats/consumption",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
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
    "Consumption Per Channel Histogram": {
      "method": "GET",
      "path": "/1/videos/stats/consumption/channels/histogram",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
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
  "Stats > Globals > Geolocation": {
    "Countries": {
      "method": "GET",
      "path": "/1/videos/stats/geolocation/countries",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
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
    "Clusters": {
      "method": "GET",
      "path": "/1/videos/stats/geolocation/clusters",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
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
  "Stats > Globals > Viewers": {
    "Viewers": {
      "method": "GET",
      "path": "/1/videos/stats/viewers",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "to",
          "field": "query_to"
        },
        {
          "name": "per",
          "field": "query_per"
        },
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Unique Viewers": {
      "method": "GET",
      "path": "/1/videos/stats/viewers/uniques",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "to",
          "field": "query_to"
        },
        {
          "name": "per",
          "field": "query_per"
        },
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Viewers Histogram": {
      "method": "GET",
      "path": "/1/videos/stats/viewers/histogram",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "to",
          "field": "query_to"
        },
        {
          "name": "per",
          "field": "query_per"
        },
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Viewers Per Channel Histogram": {
      "method": "GET",
      "path": "/1/videos/stats/viewers/channels/histogram",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "to",
          "field": "query_to"
        },
        {
          "name": "per",
          "field": "query_per"
        },
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Viewers Per Channel Share": {
      "method": "GET",
      "path": "/1/videos/stats/viewers/channels/shares",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
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
  "Stats > Globals > Viewing": {
    "Viewing Time": {
      "method": "GET",
      "path": "/1/videos/stats/viewing",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "to",
          "field": "query_to"
        },
        {
          "name": "per",
          "field": "query_per"
        },
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Viewing Histogram Par Channel": {
      "method": "GET",
      "path": "/1/videos/stats/viewing/channels/histogram",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [
        {
          "name": "from",
          "field": "query_from"
        },
        {
          "name": "to",
          "field": "query_to"
        },
        {
          "name": "per",
          "field": "query_per"
        },
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Thumbnail": {
    "Show Picture": {
      "method": "GET",
      "path": "/1/videos/{channel}/thumbnail",
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
  "Order": {
    "Returns A Pack Order": {
      "method": "GET",
      "path": "/1/videos/order/{order}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "order",
          "field": "path_order"
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
    "Returns A Pack Order (2)": {
      "method": "GET",
      "path": "/1/videos/order",
      "pagination": "none",
      "pathParams": [
        {
          "name": "order",
          "field": "path_order"
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
    "Update A Pack": {
      "method": "PUT",
      "path": "/1/videos/order",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [
        {
          "name": "account_id",
          "field": "query_account_id"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  }
};

export class InfomaniakStreamingVideo implements INodeType {
	description: INodeTypeDescription = {
  "displayName": "Infomaniak Streaming Video",
  "name": "infomaniakStreamingVideo",
  "icon": "file:../../icons/video.svg",
  "group": [
    "output"
  ],
  "version": 1,
  "description": "Interact with Infomaniak Streaming Video API",
  "defaults": {
    "name": "Infomaniak Streaming Video"
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
          "name": "Channel",
          "value": "Channel"
        },
        {
          "name": "Channel > Config",
          "value": "Channel > Config"
        },
        {
          "name": "Event",
          "value": "Event"
        },
        {
          "name": "Integrations",
          "value": "Integrations"
        },
        {
          "name": "Live",
          "value": "Live"
        },
        {
          "name": "Misc > Countries",
          "value": "Misc > Countries"
        },
        {
          "name": "Misc > Stream",
          "value": "Misc > Stream"
        },
        {
          "name": "Option",
          "value": "Option"
        },
        {
          "name": "Option > Record",
          "value": "Option > Record"
        },
        {
          "name": "Option > Record > Instant",
          "value": "Option > Record > Instant"
        },
        {
          "name": "Option > Record > Storage",
          "value": "Option > Record > Storage"
        },
        {
          "name": "Option > Timeshift",
          "value": "Option > Timeshift"
        },
        {
          "name": "Option > Watermarking",
          "value": "Option > Watermarking"
        },
        {
          "name": "Option > Simulcast",
          "value": "Option > Simulcast"
        },
        {
          "name": "Players",
          "value": "Players"
        },
        {
          "name": "Players > Ads",
          "value": "Players > Ads"
        },
        {
          "name": "Players > Embeds",
          "value": "Players > Embeds"
        },
        {
          "name": "Players > Pictures",
          "value": "Players > Pictures"
        },
        {
          "name": "Prices",
          "value": "Prices"
        },
        {
          "name": "Restrictions",
          "value": "Restrictions"
        },
        {
          "name": "Stats > Channel > Connection History",
          "value": "Stats > Channel > Connection History"
        },
        {
          "name": "Stats > Channel > Consumption",
          "value": "Stats > Channel > Consumption"
        },
        {
          "name": "Stats > Channel > Export Stats",
          "value": "Stats > Channel > Export Stats"
        },
        {
          "name": "Stats > Channel > Geolocation",
          "value": "Stats > Channel > Geolocation"
        },
        {
          "name": "Stats > Channel > Technologies",
          "value": "Stats > Channel > Technologies"
        },
        {
          "name": "Stats > Channel > Viewers",
          "value": "Stats > Channel > Viewers"
        },
        {
          "name": "Stats > Channel > Viewing",
          "value": "Stats > Channel > Viewing"
        },
        {
          "name": "Stats > Globals > Consumption",
          "value": "Stats > Globals > Consumption"
        },
        {
          "name": "Stats > Globals > Geolocation",
          "value": "Stats > Globals > Geolocation"
        },
        {
          "name": "Stats > Globals > Viewers",
          "value": "Stats > Globals > Viewers"
        },
        {
          "name": "Stats > Globals > Viewing",
          "value": "Stats > Globals > Viewing"
        },
        {
          "name": "Thumbnail",
          "value": "Thumbnail"
        },
        {
          "name": "Order",
          "value": "Order"
        }
      ],
      "default": "Channel",
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
            "Channel"
          ]
        }
      },
      "options": [
        {
          "name": "List Channels",
          "value": "List Channels"
        },
        {
          "name": "Create A Channel",
          "value": "Create A Channel"
        },
        {
          "name": "Return A Channel",
          "value": "Return A Channel"
        },
        {
          "name": "Update A Channel",
          "value": "Update A Channel"
        },
        {
          "name": "Delete A Channel",
          "value": "Delete A Channel"
        }
      ],
      "default": "List Channels",
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
            "Channel"
          ],
          "operation": [
            "List Channels"
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
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Channel"
          ],
          "operation": [
            "Create A Channel"
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
            "Channel"
          ],
          "operation": [
            "Create A Channel"
          ]
        }
      },
      "options": [
        {
          "displayName": "Ttl",
          "name": "query_ttl",
          "type": "number",
          "default": 0
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
            "Channel"
          ],
          "operation": [
            "Create A Channel"
          ]
        }
      },
      "required": true,
      "description": "Specify the name of the channel"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Channel"
          ],
          "operation": [
            "Return A Channel"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Channel"
          ],
          "operation": [
            "Return A Channel"
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
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Channel"
          ],
          "operation": [
            "Update A Channel"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Channel"
          ],
          "operation": [
            "Update A Channel"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Channel"
          ],
          "operation": [
            "Update A Channel"
          ]
        }
      },
      "required": true,
      "description": "Specify the name of the channel"
    },
    {
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Channel"
          ],
          "operation": [
            "Update A Channel"
          ]
        }
      },
      "options": [
        {
          "displayName": "Remember To Config",
          "name": "body_remember_to_config",
          "type": "boolean",
          "default": false,
          "description": "Remember the config"
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
            "Channel"
          ],
          "operation": [
            "Delete A Channel"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Channel"
          ],
          "operation": [
            "Delete A Channel"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Channel > Config"
          ]
        }
      },
      "options": [
        {
          "name": "Config A Channel",
          "value": "Config A Channel"
        }
      ],
      "default": "Config A Channel",
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
            "Channel > Config"
          ],
          "operation": [
            "Config A Channel"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Channel > Config"
          ],
          "operation": [
            "Config A Channel"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Password",
      "name": "body_password",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Channel > Config"
          ],
          "operation": [
            "Config A Channel"
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
            "Event"
          ]
        }
      },
      "options": [
        {
          "name": "List All Events",
          "value": "List All Events"
        },
        {
          "name": "Create An Event",
          "value": "Create An Event"
        },
        {
          "name": "Return An Event",
          "value": "Return An Event"
        },
        {
          "name": "Update An Event",
          "value": "Update An Event"
        },
        {
          "name": "Delete An Event",
          "value": "Delete An Event"
        }
      ],
      "default": "List All Events",
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
            "Event"
          ],
          "operation": [
            "List All Events"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "List All Events"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Create An Event"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Create An Event"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Authorize Country",
      "name": "body_authorize_country",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Create An Event"
          ]
        }
      },
      "required": true,
      "description": "Authorise or Prohibit countries to view the stream"
    },
    {
      "displayName": "Fragment Duration",
      "name": "body_fragment_duration",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Create An Event"
          ]
        }
      },
      "required": true,
      "description": "Limit the size of files"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Create An Event"
          ]
        }
      },
      "required": true,
      "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
    },
    {
      "displayName": "Start At",
      "name": "body_start_at",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Create An Event"
          ]
        }
      },
      "required": true,
      "description": "Start of the event"
    },
    {
      "displayName": "Stop At",
      "name": "body_stop_at",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Create An Event"
          ]
        }
      },
      "required": true,
      "description": "End of the event"
    },
    {
      "displayName": "Stop Live",
      "name": "body_stop_live",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Create An Event"
          ]
        }
      },
      "required": true,
      "description": "Add geographical restrictions"
    },
    {
      "displayName": "Timezone",
      "name": "body_timezone",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Create An Event"
          ]
        }
      },
      "required": true,
      "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
    },
    {
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Create An Event"
          ]
        }
      },
      "options": [
        {
          "displayName": "Access Country",
          "name": "body_access_country",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Date",
          "name": "body_date",
          "type": "string",
          "default": "",
          "description": "Timestamp `{name}` has been created"
        },
        {
          "displayName": "Dvr Window",
          "name": "body_dvr_window",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Record",
          "name": "body_record",
          "type": "boolean",
          "default": false,
          "description": "Activate the interrupt of the live event"
        },
        {
          "displayName": "Record Name",
          "name": "body_record_name",
          "type": "string",
          "default": "",
          "description": "Name of the recording"
        },
        {
          "displayName": "Repeat Interval",
          "name": "body_repeat_interval",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Repeat Until",
          "name": "body_repeat_until",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Simulcasts",
          "name": "body_simulcasts",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Storage Machine Id",
          "name": "body_storage_machine_id",
          "type": "number",
          "default": 0,
          "description": "Unique identifier of the `storage space`"
        },
        {
          "displayName": "Weekdays Only",
          "name": "body_weekdays_only",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Weekends Only",
          "name": "body_weekends_only",
          "type": "boolean",
          "default": false
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
            "Event"
          ],
          "operation": [
            "Return An Event"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Repeatable Planned Event",
      "name": "path_repeatable_planned_event",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Return An Event"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Return An Event"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Update An Event"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Repeatable Planned Event",
      "name": "path_repeatable_planned_event",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Update An Event"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Update An Event"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Authorize Country",
      "name": "body_authorize_country",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Update An Event"
          ]
        }
      },
      "required": true,
      "description": "Authorise or Prohibit countries to view the stream"
    },
    {
      "displayName": "Fragment Duration",
      "name": "body_fragment_duration",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Update An Event"
          ]
        }
      },
      "required": true,
      "description": "Limit the size of files"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Update An Event"
          ]
        }
      },
      "required": true,
      "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
    },
    {
      "displayName": "Start At",
      "name": "body_start_at",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Update An Event"
          ]
        }
      },
      "required": true,
      "description": "Start of the event"
    },
    {
      "displayName": "Stop At",
      "name": "body_stop_at",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Update An Event"
          ]
        }
      },
      "required": true,
      "description": "End of the event"
    },
    {
      "displayName": "Stop Live",
      "name": "body_stop_live",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Update An Event"
          ]
        }
      },
      "required": true,
      "description": "Add geographical restrictions"
    },
    {
      "displayName": "Timezone",
      "name": "body_timezone",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Update An Event"
          ]
        }
      },
      "required": true,
      "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
    },
    {
      "displayName": "Type",
      "name": "body_type",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Update An Event"
          ]
        }
      },
      "required": true,
      "description": "only:Change only this event,all:Change all event,from:Change this event and recurrences",
      "options": [
        {
          "name": "all",
          "value": "all"
        },
        {
          "name": "from",
          "value": "from"
        },
        {
          "name": "only",
          "value": "only"
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
            "Event"
          ],
          "operation": [
            "Update An Event"
          ]
        }
      },
      "options": [
        {
          "displayName": "Access Country",
          "name": "body_access_country",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Date",
          "name": "body_date",
          "type": "string",
          "default": "",
          "description": "Timestamp `{name}` has been created"
        },
        {
          "displayName": "Dvr Window",
          "name": "body_dvr_window",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Record",
          "name": "body_record",
          "type": "boolean",
          "default": false,
          "description": "Activate the interrupt of the live event"
        },
        {
          "displayName": "Record Name",
          "name": "body_record_name",
          "type": "string",
          "default": "",
          "description": "Name of the recording"
        },
        {
          "displayName": "Repeat Interval",
          "name": "body_repeat_interval",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Repeat Until",
          "name": "body_repeat_until",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Simulcasts",
          "name": "body_simulcasts",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Storage Machine Id",
          "name": "body_storage_machine_id",
          "type": "number",
          "default": 0,
          "description": "Unique identifier of the `storage space`"
        },
        {
          "displayName": "Weekdays Only",
          "name": "body_weekdays_only",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Weekends Only",
          "name": "body_weekends_only",
          "type": "boolean",
          "default": false
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
            "Event"
          ],
          "operation": [
            "Delete An Event"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Repeatable Planned Event",
      "name": "path_repeatable_planned_event",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Delete An Event"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Delete An Event"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Event"
          ],
          "operation": [
            "Delete An Event"
          ]
        }
      },
      "options": [
        {
          "displayName": "Date",
          "name": "body_date",
          "type": "number",
          "default": 0,
          "description": "Timestamp `{name}` has been created"
        },
        {
          "displayName": "Type",
          "name": "body_type",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "all",
              "value": "all"
            },
            {
              "name": "from",
              "value": "from"
            },
            {
              "name": "only",
              "value": "only"
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
            "Integrations"
          ]
        }
      },
      "options": [
        {
          "name": "Integration Code",
          "value": "Integration Code"
        }
      ],
      "default": "Integration Code",
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
            "Integrations"
          ],
          "operation": [
            "Integration Code"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Live"
          ]
        }
      },
      "options": [
        {
          "name": "Resume The Live",
          "value": "Resume The Live"
        },
        {
          "name": "Interrupt The Live",
          "value": "Interrupt The Live"
        }
      ],
      "default": "Resume The Live",
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
            "Live"
          ],
          "operation": [
            "Resume The Live"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Live"
          ],
          "operation": [
            "Resume The Live"
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
            "Live"
          ],
          "operation": [
            "Resume The Live"
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
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Live"
          ],
          "operation": [
            "Interrupt The Live"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Live"
          ],
          "operation": [
            "Interrupt The Live"
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
            "Live"
          ],
          "operation": [
            "Interrupt The Live"
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
            "Misc > Countries"
          ]
        }
      },
      "options": [
        {
          "name": "List Countries",
          "value": "List Countries"
        },
        {
          "name": "List Timezones",
          "value": "List Timezones"
        }
      ],
      "default": "List Countries",
      "noDataExpression": true
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Misc > Stream"
          ]
        }
      },
      "options": [
        {
          "name": "Generate Stream Key",
          "value": "Generate Stream Key"
        }
      ],
      "default": "Generate Stream Key",
      "noDataExpression": true
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Option"
          ]
        }
      },
      "options": [
        {
          "name": "List Option",
          "value": "List Option"
        },
        {
          "name": "Return Option",
          "value": "Return Option"
        },
        {
          "name": "Undertake Option",
          "value": "Undertake Option"
        },
        {
          "name": "Terminate Option",
          "value": "Terminate Option"
        }
      ],
      "default": "List Option",
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
            "Option"
          ],
          "operation": [
            "List Option"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option"
          ],
          "operation": [
            "List Option"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option"
          ],
          "operation": [
            "Return Option"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Video Option",
      "name": "path_video_option",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option"
          ],
          "operation": [
            "Return Option"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option"
          ],
          "operation": [
            "Return Option"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option"
          ],
          "operation": [
            "Undertake Option"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Video Option",
      "name": "path_video_option",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option"
          ],
          "operation": [
            "Undertake Option"
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
            "Option"
          ],
          "operation": [
            "Terminate Option"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Video Option",
      "name": "path_video_option",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option"
          ],
          "operation": [
            "Terminate Option"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option"
          ],
          "operation": [
            "Terminate Option"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Option"
          ],
          "operation": [
            "Terminate Option"
          ]
        }
      },
      "options": [
        {
          "displayName": "Instant",
          "name": "body_instant",
          "type": "boolean",
          "default": false
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
            "Option > Record"
          ]
        }
      },
      "options": [
        {
          "name": "Show A Storage Config",
          "value": "Show A Storage Config"
        },
        {
          "name": "Create Recording Config",
          "value": "Create Recording Config"
        },
        {
          "name": "Update Recording Config",
          "value": "Update Recording Config"
        }
      ],
      "default": "Show A Storage Config",
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
            "Option > Record"
          ],
          "operation": [
            "Show A Storage Config"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record"
          ],
          "operation": [
            "Show A Storage Config"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record"
          ],
          "operation": [
            "Create Recording Config"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record"
          ],
          "operation": [
            "Create Recording Config"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record"
          ],
          "operation": [
            "Update Recording Config"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record"
          ],
          "operation": [
            "Update Recording Config"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record"
          ],
          "operation": [
            "Update Recording Config"
          ]
        }
      },
      "options": [
        {
          "displayName": "Auto Record",
          "name": "body_auto_record",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether the recording starts automatically when the stream begins."
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
            "Option > Record > Instant"
          ]
        }
      },
      "options": [
        {
          "name": "Start A Record",
          "value": "Start A Record"
        },
        {
          "name": "Stop A Record",
          "value": "Stop A Record"
        }
      ],
      "default": "Start A Record",
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
            "Option > Record > Instant"
          ],
          "operation": [
            "Start A Record"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record > Instant"
          ],
          "operation": [
            "Start A Record"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Auto Stop",
      "name": "body_auto_stop",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record > Instant"
          ],
          "operation": [
            "Start A Record"
          ]
        }
      },
      "required": true,
      "description": "The auto_stop field is required"
    },
    {
      "displayName": "Fragment Duration",
      "name": "body_fragment_duration",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record > Instant"
          ],
          "operation": [
            "Start A Record"
          ]
        }
      },
      "required": true,
      "description": "The fragment duration is required and must be at least 1 second."
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record > Instant"
          ],
          "operation": [
            "Start A Record"
          ]
        }
      },
      "required": true,
      "description": "The record name is required"
    },
    {
      "displayName": "Selected Storage Id",
      "name": "body_selected_storage_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record > Instant"
          ],
          "operation": [
            "Start A Record"
          ]
        }
      },
      "required": true,
      "description": "The storage machine id is required."
    },
    {
      "displayName": "Storage",
      "name": "body_storage",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record > Instant"
          ],
          "operation": [
            "Start A Record"
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
            "Option > Record > Instant"
          ],
          "operation": [
            "Start A Record"
          ]
        }
      },
      "options": [
        {
          "displayName": "Diffusion At",
          "name": "body_diffusion_at",
          "type": "number",
          "default": 0,
          "description": "The diffusion at time start"
        },
        {
          "displayName": "Diffusion Ends At",
          "name": "body_diffusion_ends_at",
          "type": "number",
          "default": 0,
          "description": "The diffusion end time is required when auto_stop is enabled"
        },
        {
          "displayName": "File Path",
          "name": "body_file_path",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Fragment Number",
          "name": "body_fragment_number",
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
            "Option > Record > Instant"
          ],
          "operation": [
            "Stop A Record"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record > Instant"
          ],
          "operation": [
            "Stop A Record"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record > Storage"
          ]
        }
      },
      "options": [
        {
          "name": "Lists All Storage Machine",
          "value": "Lists All Storage Machine"
        },
        {
          "name": "Return A Storage Machine",
          "value": "Return A Storage Machine"
        },
        {
          "name": "Update A Storage Machine",
          "value": "Update A Storage Machine"
        },
        {
          "name": "Create A Storage Machine",
          "value": "Create A Storage Machine"
        },
        {
          "name": "Update A Storage Machine",
          "value": "Update A Storage Machine (2)"
        },
        {
          "name": "Update A Storage Machine",
          "value": "Update A Storage Machine (3)"
        }
      ],
      "default": "Lists All Storage Machine",
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
            "Option > Record > Storage"
          ],
          "operation": [
            "Lists All Storage Machine"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record > Storage"
          ],
          "operation": [
            "Lists All Storage Machine"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record > Storage"
          ],
          "operation": [
            "Return A Storage Machine"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record > Storage"
          ],
          "operation": [
            "Return A Storage Machine"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record > Storage"
          ],
          "operation": [
            "Update A Storage Machine"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record > Storage"
          ],
          "operation": [
            "Update A Storage Machine"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Auto Fragment Duration",
      "name": "body_auto_fragment_duration",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record > Storage"
          ],
          "operation": [
            "Update A Storage Machine"
          ]
        }
      },
      "required": true,
      "description": "Duration of the media fragment in seconds"
    },
    {
      "displayName": "Default",
      "name": "body_default",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record > Storage"
          ],
          "operation": [
            "Update A Storage Machine"
          ]
        }
      },
      "required": true,
      "description": "Indicates whether this is the default item (true/false)"
    },
    {
      "displayName": "Protocol",
      "name": "body_protocol",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record > Storage"
          ],
          "operation": [
            "Update A Storage Machine"
          ]
        }
      },
      "required": true,
      "description": "a strict string (no HTML/PHP tags or HTML entities allowed)",
      "options": [
        {
          "name": "ftp",
          "value": "ftp"
        },
        {
          "name": "ftpes",
          "value": "ftpes"
        },
        {
          "name": "ftps",
          "value": "ftps"
        },
        {
          "name": "sftp",
          "value": "sftp"
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
            "Option > Record > Storage"
          ],
          "operation": [
            "Update A Storage Machine"
          ]
        }
      },
      "options": [
        {
          "displayName": "Auto Record Name",
          "name": "body_auto_record_name",
          "type": "string",
          "default": "",
          "description": "Name assigned to the recorded media or file"
        },
        {
          "displayName": "Host",
          "name": "body_host",
          "type": "string",
          "default": "",
          "description": "Address or IP of the remote server"
        },
        {
          "displayName": "Login",
          "name": "body_login",
          "type": "string",
          "default": "",
          "description": "Username for server authentication"
        },
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "Name of the server or connection profile"
        },
        {
          "displayName": "Pass",
          "name": "body_pass",
          "type": "string",
          "default": "",
          "description": "Password associated with the login"
        },
        {
          "displayName": "Path",
          "name": "body_path",
          "type": "string",
          "default": "",
          "description": "Remote path to use after connecting"
        },
        {
          "displayName": "Port",
          "name": "body_port",
          "type": "number",
          "default": 0,
          "description": "Port number for the connection (e.g., 21 for FTP, 22 for SFTP)"
        },
        {
          "displayName": "Url Http",
          "name": "body_url_http",
          "type": "string",
          "default": "",
          "description": "HTTP URL where the resource can be accessed"
        },
        {
          "displayName": "Use Path",
          "name": "body_use_path",
          "type": "boolean",
          "default": false,
          "description": "Indicates whether the path should be used (true/false)"
        },
        {
          "displayName": "Void Id",
          "name": "body_void_id",
          "type": "number",
          "default": 0,
          "description": "Unique identifier used for vod product"
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
            "Option > Record > Storage"
          ],
          "operation": [
            "Create A Storage Machine"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Storage Machine",
      "name": "path_storage_machine",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record > Storage"
          ],
          "operation": [
            "Create A Storage Machine"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record > Storage"
          ],
          "operation": [
            "Create A Storage Machine"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record > Storage"
          ],
          "operation": [
            "Update A Storage Machine (2)"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Storage Machine",
      "name": "path_storage_machine",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record > Storage"
          ],
          "operation": [
            "Update A Storage Machine (2)"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record > Storage"
          ],
          "operation": [
            "Update A Storage Machine (2)"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record > Storage"
          ],
          "operation": [
            "Update A Storage Machine (3)"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Storage Machine",
      "name": "path_storage_machine",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record > Storage"
          ],
          "operation": [
            "Update A Storage Machine (3)"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Record > Storage"
          ],
          "operation": [
            "Update A Storage Machine (3)"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Timeshift"
          ]
        }
      },
      "options": [
        {
          "name": "Return Timeshift Config",
          "value": "Return Timeshift Config"
        },
        {
          "name": "Create A Timeshift Config.",
          "value": "Create A Timeshift Config."
        },
        {
          "name": "Update A Timeshift Config",
          "value": "Update A Timeshift Config"
        }
      ],
      "default": "Return Timeshift Config",
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
            "Option > Timeshift"
          ],
          "operation": [
            "Return Timeshift Config"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Timeshift"
          ],
          "operation": [
            "Return Timeshift Config"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Timeshift"
          ],
          "operation": [
            "Create A Timeshift Config."
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Timeshift"
          ],
          "operation": [
            "Create A Timeshift Config."
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Timeshift"
          ],
          "operation": [
            "Update A Timeshift Config"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Timeshift"
          ],
          "operation": [
            "Update A Timeshift Config"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Timeshift"
          ],
          "operation": [
            "Update A Timeshift Config"
          ]
        }
      },
      "options": [
        {
          "displayName": "Enabled",
          "name": "body_enabled",
          "type": "boolean",
          "default": false,
          "description": "Specify a limit before the interruption of live events in case of overrun"
        },
        {
          "displayName": "Record Window Duration",
          "name": "body_record_window_duration",
          "type": "number",
          "default": 0,
          "description": "Define how far your viewers can go back (max.: 240 minutes)"
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
            "Option > Watermarking"
          ]
        }
      },
      "options": [
        {
          "name": "Return Watermark",
          "value": "Return Watermark"
        },
        {
          "name": "Update Watermark",
          "value": "Update Watermark"
        },
        {
          "name": "Enabled Watermark",
          "value": "Enabled Watermark"
        },
        {
          "name": "Disable Watermark",
          "value": "Disable Watermark"
        }
      ],
      "default": "Return Watermark",
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
            "Option > Watermarking"
          ],
          "operation": [
            "Return Watermark"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Watermarking"
          ],
          "operation": [
            "Return Watermark"
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
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Watermarking"
          ],
          "operation": [
            "Update Watermark"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Watermarking"
          ],
          "operation": [
            "Update Watermark"
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
            "Option > Watermarking"
          ],
          "operation": [
            "Update Watermark"
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
      "displayName": "Align",
      "name": "body_align",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Watermarking"
          ],
          "operation": [
            "Update Watermark"
          ]
        }
      },
      "required": true,
      "description": "Specify the position"
    },
    {
      "displayName": "Horizontal Offset",
      "name": "body_horizontal_offset",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Watermarking"
          ],
          "operation": [
            "Update Watermark"
          ]
        }
      },
      "required": true,
      "description": "Specify the horizontal spacing in (px)"
    },
    {
      "displayName": "Vertical Offset",
      "name": "body_vertical_offset",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Watermarking"
          ],
          "operation": [
            "Update Watermark"
          ]
        }
      },
      "required": true,
      "description": "Specify the vertical spacing in (px)"
    },
    {
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Watermarking"
          ],
          "operation": [
            "Update Watermark"
          ]
        }
      },
      "options": [
        {
          "displayName": "Enabled",
          "name": "body_enabled",
          "type": "boolean",
          "default": false,
          "description": "Enable the watermark"
        },
        {
          "displayName": "Follow Update",
          "name": "body_follow_update",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Height",
          "name": "body_height",
          "type": "number",
          "default": 0,
          "description": "Specify the height size of image (px)"
        },
        {
          "displayName": "Image Path",
          "name": "body_image_path",
          "type": "string",
          "default": "",
          "description": "Specify the image in base 64"
        },
        {
          "displayName": "Opacity Percentage",
          "name": "body_opacity_percentage",
          "type": "number",
          "default": 0,
          "description": "Specify the opacity in percent"
        },
        {
          "displayName": "Size Percentage",
          "name": "body_size_percentage",
          "type": "number",
          "default": 0,
          "description": "Specify the size of image in percent"
        },
        {
          "displayName": "Width",
          "name": "body_width",
          "type": "number",
          "default": 0,
          "description": "Specify the width size of image (px)"
        },
        {
          "displayName": "Z Index",
          "name": "body_z_index",
          "type": "number",
          "default": 0,
          "description": "Specify the opacity in percent"
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
            "Option > Watermarking"
          ],
          "operation": [
            "Enabled Watermark"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Watermarking"
          ],
          "operation": [
            "Enabled Watermark"
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
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Watermarking"
          ],
          "operation": [
            "Disable Watermark"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Watermarking"
          ],
          "operation": [
            "Disable Watermark"
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
            "Option > Simulcast"
          ]
        }
      },
      "options": [
        {
          "name": "Return Simulcast",
          "value": "Return Simulcast"
        },
        {
          "name": "Lists All Simulcast Config",
          "value": "Lists All Simulcast Config"
        },
        {
          "name": "Return Simulcast",
          "value": "Return Simulcast (2)"
        },
        {
          "name": "Return Simulcast",
          "value": "Return Simulcast (3)"
        },
        {
          "name": "Delete A Player",
          "value": "Delete A Player"
        },
        {
          "name": "Disable Simulcast",
          "value": "Disable Simulcast"
        },
        {
          "name": "Disable Simulcast",
          "value": "Disable Simulcast (2)"
        }
      ],
      "default": "Return Simulcast",
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
            "Option > Simulcast"
          ],
          "operation": [
            "Return Simulcast"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Simulcast Platform",
      "name": "path_simulcast_platform",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Return Simulcast"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Return Simulcast"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Additional Config",
      "name": "body_additional_config",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Return Simulcast"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Application Instance",
      "name": "body_application_instance",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Return Simulcast"
          ]
        }
      },
      "required": true,
      "description": "a simple string (weak validation)",
      "options": [
        {
          "name": "facebook",
          "value": "facebook"
        },
        {
          "name": "youtube",
          "value": "youtube"
        }
      ]
    },
    {
      "displayName": "Application Name",
      "name": "body_application_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Return Simulcast"
          ]
        }
      },
      "required": true,
      "description": "protocole"
    },
    {
      "displayName": "Enabled",
      "name": "body_enabled",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Return Simulcast"
          ]
        }
      },
      "required": true,
      "description": "Enable or disable the simulcast"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Return Simulcast"
          ]
        }
      },
      "required": true,
      "description": "Specify the name of the simulcast"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Lists All Simulcast Config"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Return Simulcast (2)"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Simulcast Platform",
      "name": "path_simulcast_platform",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Return Simulcast (2)"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Simulcast Config",
      "name": "path_simulcast_config",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Return Simulcast (2)"
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
            "Option > Simulcast"
          ],
          "operation": [
            "Return Simulcast (3)"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Simulcast Platform",
      "name": "path_simulcast_platform",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Return Simulcast (3)"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Simulcast Config",
      "name": "path_simulcast_config",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Return Simulcast (3)"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Return Simulcast (3)"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Application Instance",
      "name": "body_application_instance",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Return Simulcast (3)"
          ]
        }
      },
      "required": true,
      "description": "a simple string (weak validation)",
      "options": [
        {
          "name": "facebook",
          "value": "facebook"
        },
        {
          "name": "youtube",
          "value": "youtube"
        }
      ]
    },
    {
      "displayName": "Application Name",
      "name": "body_application_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Return Simulcast (3)"
          ]
        }
      },
      "required": true,
      "description": "protocole"
    },
    {
      "displayName": "Enabled",
      "name": "body_enabled",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Return Simulcast (3)"
          ]
        }
      },
      "required": true,
      "description": "Enable or disable the simulcast"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Return Simulcast (3)"
          ]
        }
      },
      "required": true,
      "description": "Specify the name of the simulcast"
    },
    {
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Return Simulcast (3)"
          ]
        }
      },
      "options": [
        {
          "displayName": "Additional Config",
          "name": "body_additional_config",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Dest Stream",
          "name": "body_dest_stream",
          "type": "string",
          "default": "",
          "description": "is a query string"
        },
        {
          "displayName": "Host",
          "name": "body_host",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Port",
          "name": "body_port",
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
            "Option > Simulcast"
          ],
          "operation": [
            "Delete A Player"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Simulcast Platform",
      "name": "path_simulcast_platform",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Delete A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Simulcast Config",
      "name": "path_simulcast_config",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Delete A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Delete A Player"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Disable Simulcast"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Simulcast Platform",
      "name": "path_simulcast_platform",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Disable Simulcast"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Simulcast Config",
      "name": "path_simulcast_config",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Disable Simulcast"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Disable Simulcast"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Disable Simulcast (2)"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Simulcast Platform",
      "name": "path_simulcast_platform",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Disable Simulcast (2)"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Simulcast Config",
      "name": "path_simulcast_config",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Disable Simulcast (2)"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Option > Simulcast"
          ],
          "operation": [
            "Disable Simulcast (2)"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ]
        }
      },
      "options": [
        {
          "name": "Lists All Players",
          "value": "Lists All Players"
        },
        {
          "name": "Create A Player",
          "value": "Create A Player"
        },
        {
          "name": "Return A Player",
          "value": "Return A Player"
        },
        {
          "name": "Copy A Player",
          "value": "Copy A Player"
        },
        {
          "name": "Update A Player",
          "value": "Update A Player"
        },
        {
          "name": "Delete A Player",
          "value": "Delete A Player"
        }
      ],
      "default": "Lists All Players",
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
            "Players"
          ],
          "operation": [
            "Lists All Players"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Lists All Players"
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
            "Players"
          ],
          "operation": [
            "Lists All Players"
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
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
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
            "Players"
          ],
          "operation": [
            "Create A Player"
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
      "displayName": "Ads Enabled",
      "name": "body_ads_enabled",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Allow Full Screen",
      "name": "body_allow_full_screen",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Auto Hide Controls",
      "name": "body_auto_hide_controls",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Auto Start",
      "name": "body_auto_start",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Buffer",
      "name": "body_buffer",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Chromecast",
      "name": "body_chromecast",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Control Active Color",
      "name": "body_control_active_color",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true,
      "description": "a CSS hex color string (e.g. #fff or #ffffff)"
    },
    {
      "displayName": "Control Color",
      "name": "body_control_color",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true,
      "description": "a CSS hex color string (e.g. #fff or #ffffff)"
    },
    {
      "displayName": "Controlbar Color",
      "name": "body_controlbar_color",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true,
      "description": "a CSS hex color string (e.g. #fff or #ffffff)"
    },
    {
      "displayName": "Countdown",
      "name": "body_countdown",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Enable Embed Code",
      "name": "body_enable_embed_code",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Enable Facebook",
      "name": "body_enable_facebook",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Enable Twitter",
      "name": "body_enable_twitter",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Extract Preload Img",
      "name": "body_extract_preload_img",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Facebook Player Embed",
      "name": "body_facebook_player_embed",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Height",
      "name": "body_height",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Is360",
      "name": "body_is360",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
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
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true,
      "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
    },
    {
      "displayName": "Ratio",
      "name": "body_ratio",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true,
      "options": [
        {
          "name": "16:9",
          "value": "16:9"
        },
        {
          "name": "4:3",
          "value": "4:3"
        },
        {
          "name": "custom",
          "value": "custom"
        }
      ]
    },
    {
      "displayName": "Show Controls",
      "name": "body_show_controls",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Show Controls During Ads",
      "name": "body_show_controls_during_ads",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Show Viewers",
      "name": "body_show_viewers",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Show Viewers Only After",
      "name": "body_show_viewers_only_after",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Sound Enabled",
      "name": "body_sound_enabled",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Sound Percentage",
      "name": "body_sound_percentage",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Time Before Hide Cb",
      "name": "body_time_before_hide_cb",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Use Geo Ip Img",
      "name": "body_use_geo_ip_img",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Use Interrupt Img",
      "name": "body_use_interrupt_img",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Use Preload Img",
      "name": "body_use_preload_img",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Use Restrict Img",
      "name": "body_use_restrict_img",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Width",
      "name": "body_width",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Create A Player"
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
            "Players"
          ],
          "operation": [
            "Create A Player"
          ]
        }
      },
      "options": [
        {
          "displayName": "Ads Url",
          "name": "body_ads_url",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Countdown Days",
          "name": "body_countdown_days",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Countdown Hours",
          "name": "body_countdown_hours",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Countdown Minutes",
          "name": "body_countdown_minutes",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Countdown Seconds",
          "name": "body_countdown_seconds",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Countdown Txt",
          "name": "body_countdown_txt",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Facebook Back Link",
          "name": "body_facebook_back_link",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Geo Ip Img",
          "name": "body_geo_ip_img",
          "type": "string",
          "default": "",
          "description": "a Base64-encoded image string (data:image/png;base64,...) or a valid storage5.infomaniak.com URL"
        },
        {
          "displayName": "Interrupt Img",
          "name": "body_interrupt_img",
          "type": "string",
          "default": "",
          "description": "a Base64-encoded image string (data:image/png;base64,...) or a valid storage5.infomaniak.com URL"
        },
        {
          "displayName": "Logo Anchor",
          "name": "body_logo_anchor",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "bottom left",
              "value": "bottom left"
            },
            {
              "name": "bottom right",
              "value": "bottom right"
            },
            {
              "name": "top left",
              "value": "top left"
            },
            {
              "name": "top right",
              "value": "top right"
            }
          ]
        },
        {
          "displayName": "Logo Img",
          "name": "body_logo_img",
          "type": "string",
          "default": "",
          "description": "a Base64-encoded image string (data:image/png;base64,...) or a valid storage5.infomaniak.com URL"
        },
        {
          "displayName": "Logo Margin Left",
          "name": "body_logo_margin_left",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Logo Margin Top",
          "name": "body_logo_margin_top",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Logo Percentage",
          "name": "body_logo_percentage",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Preload Img",
          "name": "body_preload_img",
          "type": "string",
          "default": "",
          "description": "a Base64-encoded image string (data:image/png;base64,...) or a valid storage5.infomaniak.com URL"
        },
        {
          "displayName": "Restrict Img",
          "name": "body_restrict_img",
          "type": "string",
          "default": "",
          "description": "a Base64-encoded image string (data:image/png;base64,...) or a valid storage5.infomaniak.com URL"
        },
        {
          "displayName": "Show Logo",
          "name": "body_show_logo",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Show Viewers After",
          "name": "body_show_viewers_after",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Stereo Projection360",
          "name": "body_stereo_projection360",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "left-right",
              "value": "left-right"
            },
            {
              "name": "none",
              "value": "none"
            },
            {
              "name": "top-bottom",
              "value": "top-bottom"
            }
          ]
        },
        {
          "displayName": "Title",
          "name": "body_title",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Twitter Back Link",
          "name": "body_twitter_back_link",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Twitter Related",
          "name": "body_twitter_related",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Twitter Via",
          "name": "body_twitter_via",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
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
            "Players"
          ],
          "operation": [
            "Return A Player"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Return A Player"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the player to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Return A Player"
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
            "Players"
          ],
          "operation": [
            "Return A Player"
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
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Copy A Player"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Copy A Player"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the player to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Copy A Player"
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
            "Players"
          ],
          "operation": [
            "Copy A Player"
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
            "Players"
          ],
          "operation": [
            "Copy A Player"
          ]
        }
      },
      "required": true,
      "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the player to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
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
            "Players"
          ],
          "operation": [
            "Update A Player"
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
      "displayName": "Ads Enabled",
      "name": "body_ads_enabled",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Allow Full Screen",
      "name": "body_allow_full_screen",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Auto Hide Controls",
      "name": "body_auto_hide_controls",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Auto Start",
      "name": "body_auto_start",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Buffer",
      "name": "body_buffer",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Chromecast",
      "name": "body_chromecast",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Control Active Color",
      "name": "body_control_active_color",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true,
      "description": "a CSS hex color string (e.g. #fff or #ffffff)"
    },
    {
      "displayName": "Control Color",
      "name": "body_control_color",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true,
      "description": "a CSS hex color string (e.g. #fff or #ffffff)"
    },
    {
      "displayName": "Controlbar Color",
      "name": "body_controlbar_color",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true,
      "description": "a CSS hex color string (e.g. #fff or #ffffff)"
    },
    {
      "displayName": "Countdown",
      "name": "body_countdown",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Enable Embed Code",
      "name": "body_enable_embed_code",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Enable Facebook",
      "name": "body_enable_facebook",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Enable Twitter",
      "name": "body_enable_twitter",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Extract Preload Img",
      "name": "body_extract_preload_img",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Facebook Player Embed",
      "name": "body_facebook_player_embed",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Height",
      "name": "body_height",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Is360",
      "name": "body_is360",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
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
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true,
      "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
    },
    {
      "displayName": "Ratio",
      "name": "body_ratio",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true,
      "options": [
        {
          "name": "16:9",
          "value": "16:9"
        },
        {
          "name": "4:3",
          "value": "4:3"
        },
        {
          "name": "custom",
          "value": "custom"
        }
      ]
    },
    {
      "displayName": "Show Controls",
      "name": "body_show_controls",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Show Controls During Ads",
      "name": "body_show_controls_during_ads",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Show Viewers",
      "name": "body_show_viewers",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Show Viewers Only After",
      "name": "body_show_viewers_only_after",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Sound Enabled",
      "name": "body_sound_enabled",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Sound Percentage",
      "name": "body_sound_percentage",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Time Before Hide Cb",
      "name": "body_time_before_hide_cb",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Use Geo Ip Img",
      "name": "body_use_geo_ip_img",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Use Interrupt Img",
      "name": "body_use_interrupt_img",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Use Preload Img",
      "name": "body_use_preload_img",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Use Restrict Img",
      "name": "body_use_restrict_img",
      "type": "boolean",
      "default": false,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Width",
      "name": "body_width",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Update A Player"
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
            "Players"
          ],
          "operation": [
            "Update A Player"
          ]
        }
      },
      "options": [
        {
          "displayName": "Ads Url",
          "name": "body_ads_url",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Countdown Days",
          "name": "body_countdown_days",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Countdown Hours",
          "name": "body_countdown_hours",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Countdown Minutes",
          "name": "body_countdown_minutes",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Countdown Seconds",
          "name": "body_countdown_seconds",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Countdown Txt",
          "name": "body_countdown_txt",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Facebook Back Link",
          "name": "body_facebook_back_link",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Geo Ip Img",
          "name": "body_geo_ip_img",
          "type": "string",
          "default": "",
          "description": "a Base64-encoded image string (data:image/png;base64,...) or a valid storage5.infomaniak.com URL"
        },
        {
          "displayName": "Interrupt Img",
          "name": "body_interrupt_img",
          "type": "string",
          "default": "",
          "description": "a Base64-encoded image string (data:image/png;base64,...) or a valid storage5.infomaniak.com URL"
        },
        {
          "displayName": "Logo Anchor",
          "name": "body_logo_anchor",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "bottom left",
              "value": "bottom left"
            },
            {
              "name": "bottom right",
              "value": "bottom right"
            },
            {
              "name": "top left",
              "value": "top left"
            },
            {
              "name": "top right",
              "value": "top right"
            }
          ]
        },
        {
          "displayName": "Logo Img",
          "name": "body_logo_img",
          "type": "string",
          "default": "",
          "description": "a Base64-encoded image string (data:image/png;base64,...) or a valid storage5.infomaniak.com URL"
        },
        {
          "displayName": "Logo Margin Left",
          "name": "body_logo_margin_left",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Logo Margin Top",
          "name": "body_logo_margin_top",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Logo Percentage",
          "name": "body_logo_percentage",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Preload Img",
          "name": "body_preload_img",
          "type": "string",
          "default": "",
          "description": "a Base64-encoded image string (data:image/png;base64,...) or a valid storage5.infomaniak.com URL"
        },
        {
          "displayName": "Restrict Img",
          "name": "body_restrict_img",
          "type": "string",
          "default": "",
          "description": "a Base64-encoded image string (data:image/png;base64,...) or a valid storage5.infomaniak.com URL"
        },
        {
          "displayName": "Show Logo",
          "name": "body_show_logo",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Show Viewers After",
          "name": "body_show_viewers_after",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Stereo Projection360",
          "name": "body_stereo_projection360",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "left-right",
              "value": "left-right"
            },
            {
              "name": "none",
              "value": "none"
            },
            {
              "name": "top-bottom",
              "value": "top-bottom"
            }
          ]
        },
        {
          "displayName": "Title",
          "name": "body_title",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Twitter Back Link",
          "name": "body_twitter_back_link",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Twitter Related",
          "name": "body_twitter_related",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
        },
        {
          "displayName": "Twitter Via",
          "name": "body_twitter_via",
          "type": "string",
          "default": "",
          "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
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
            "Players"
          ],
          "operation": [
            "Delete A Player"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Delete A Player"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the player to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players"
          ],
          "operation": [
            "Delete A Player"
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
            "Players"
          ],
          "operation": [
            "Delete A Player"
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
            "Players > Ads"
          ]
        }
      },
      "options": [
        {
          "name": "List All Ads",
          "value": "List All Ads"
        },
        {
          "name": "Create An Ads",
          "value": "Create An Ads"
        },
        {
          "name": "Copy An Ads",
          "value": "Copy An Ads"
        },
        {
          "name": "Return An Ads",
          "value": "Return An Ads"
        },
        {
          "name": "Update An Ads",
          "value": "Update An Ads"
        },
        {
          "name": "Delete An Ads",
          "value": "Delete An Ads"
        }
      ],
      "default": "List All Ads",
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
            "Players > Ads"
          ],
          "operation": [
            "List All Ads"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Ads"
          ],
          "operation": [
            "List All Ads"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the player to request."
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Ads"
          ],
          "operation": [
            "List All Ads"
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
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Ads"
          ],
          "operation": [
            "Create An Ads"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Ads"
          ],
          "operation": [
            "Create An Ads"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the player to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Ads"
          ],
          "operation": [
            "Create An Ads"
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
            "Players > Ads"
          ],
          "operation": [
            "Create An Ads"
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
      "displayName": "Offset",
      "name": "body_offset",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Ads"
          ],
          "operation": [
            "Create An Ads"
          ]
        }
      },
      "required": true,
      "description": "the offset to play the ad"
    },
    {
      "displayName": "Type",
      "name": "body_type",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Ads"
          ],
          "operation": [
            "Create An Ads"
          ]
        }
      },
      "required": true,
      "description": "the ad type to play the ad",
      "options": [
        {
          "name": "mid-roll",
          "value": "mid-roll"
        },
        {
          "name": "pre-roll",
          "value": "pre-roll"
        }
      ]
    },
    {
      "displayName": "Url",
      "name": "body_url",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Ads"
          ],
          "operation": [
            "Create An Ads"
          ]
        }
      },
      "required": true,
      "description": "the url of the vast XML"
    },
    {
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Ads"
          ],
          "operation": [
            "Create An Ads"
          ]
        }
      },
      "options": [
        {
          "displayName": "Is Periodic",
          "name": "body_is_periodic",
          "type": "boolean",
          "default": false,
          "description": "boolean to determine if ad should cycle"
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
            "Players > Ads"
          ],
          "operation": [
            "Copy An Ads"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Ads"
          ],
          "operation": [
            "Copy An Ads"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the player to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Ads"
          ],
          "operation": [
            "Copy An Ads"
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
            "Players > Ads"
          ],
          "operation": [
            "Copy An Ads"
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
      "displayName": "Id",
      "name": "body_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Ads"
          ],
          "operation": [
            "Copy An Ads"
          ]
        }
      },
      "required": true,
      "description": "the ads Id"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Ads"
          ],
          "operation": [
            "Return An Ads"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Ads"
          ],
          "operation": [
            "Return An Ads"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the player to request."
    },
    {
      "displayName": "Ads",
      "name": "path_ads",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Ads"
          ],
          "operation": [
            "Return An Ads"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the ads to request."
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Ads"
          ],
          "operation": [
            "Return An Ads"
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
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Ads"
          ],
          "operation": [
            "Update An Ads"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Ads"
          ],
          "operation": [
            "Update An Ads"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the player to request."
    },
    {
      "displayName": "Ads",
      "name": "path_ads",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Ads"
          ],
          "operation": [
            "Update An Ads"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the ads to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Ads"
          ],
          "operation": [
            "Update An Ads"
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
            "Players > Ads"
          ],
          "operation": [
            "Update An Ads"
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
            "Players > Ads"
          ],
          "operation": [
            "Update An Ads"
          ]
        }
      },
      "options": [
        {
          "displayName": "Is Periodic",
          "name": "body_is_periodic",
          "type": "boolean",
          "default": false,
          "description": "boolean to determine if ad should cycle"
        },
        {
          "displayName": "Offset",
          "name": "body_offset",
          "type": "number",
          "default": 0,
          "description": "the offset to play the ad"
        },
        {
          "displayName": "Type",
          "name": "body_type",
          "type": "options",
          "default": "",
          "description": "the ad type to play the ad",
          "options": [
            {
              "name": "mid-roll",
              "value": "mid-roll"
            },
            {
              "name": "pre-roll",
              "value": "pre-roll"
            }
          ]
        },
        {
          "displayName": "Url",
          "name": "body_url",
          "type": "string",
          "default": "",
          "description": "the url of the vast XML"
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
            "Players > Ads"
          ],
          "operation": [
            "Delete An Ads"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Ads"
          ],
          "operation": [
            "Delete An Ads"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the player to request."
    },
    {
      "displayName": "Ads",
      "name": "path_ads",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Ads"
          ],
          "operation": [
            "Delete An Ads"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the ads to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Ads"
          ],
          "operation": [
            "Delete An Ads"
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
            "Players > Ads"
          ],
          "operation": [
            "Delete An Ads"
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
            "Players > Embeds"
          ]
        }
      },
      "options": [
        {
          "name": "Integration Code",
          "value": "Integration Code"
        },
        {
          "name": "Integration URL",
          "value": "Integration URL"
        }
      ],
      "default": "Integration Code",
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
            "Players > Embeds"
          ],
          "operation": [
            "Integration Code"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Embeds"
          ],
          "operation": [
            "Integration Code"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the player to request."
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Embeds"
          ],
          "operation": [
            "Integration Code"
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
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Embeds"
          ],
          "operation": [
            "Integration URL"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Embeds"
          ],
          "operation": [
            "Integration URL"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the player to request."
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Embeds"
          ],
          "operation": [
            "Integration URL"
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
            "Players > Pictures"
          ]
        }
      },
      "options": [
        {
          "name": "Show Picture",
          "value": "Show Picture"
        }
      ],
      "default": "Show Picture",
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
            "Players > Pictures"
          ],
          "operation": [
            "Show Picture"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Player",
      "name": "path_player",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Pictures"
          ],
          "operation": [
            "Show Picture"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the player to request."
    },
    {
      "displayName": "Thumbnail",
      "name": "path_thumbnail",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Players > Pictures"
          ],
          "operation": [
            "Show Picture"
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
            "Players > Pictures"
          ],
          "operation": [
            "Show Picture"
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
            "Prices"
          ]
        }
      },
      "options": [
        {
          "name": "Get Price",
          "value": "Get Price"
        },
        {
          "name": "Get Description",
          "value": "Get Description"
        }
      ],
      "default": "Get Price",
      "noDataExpression": true
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Restrictions"
          ]
        }
      },
      "options": [
        {
          "name": "Show Restriction",
          "value": "Show Restriction"
        },
        {
          "name": "Update Channels",
          "value": "Update Channels"
        },
        {
          "name": "Update Restriction Password",
          "value": "Update Restriction Password"
        }
      ],
      "default": "Show Restriction",
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
            "Restrictions"
          ],
          "operation": [
            "Show Restriction"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Restrictions"
          ],
          "operation": [
            "Show Restriction"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Restrictions"
          ],
          "operation": [
            "Update Channels"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Restrictions"
          ],
          "operation": [
            "Update Channels"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Restrictions"
          ],
          "operation": [
            "Update Channels"
          ]
        }
      },
      "options": [
        {
          "displayName": "Access Country",
          "name": "body_access_country",
          "type": "string",
          "default": "",
          "description": "Specify the ISO 3166-1 alpha-2 country code for access control."
        },
        {
          "displayName": "Allow Domain",
          "name": "body_allow_domain",
          "type": "string",
          "default": "",
          "description": "Allow access only from this domain (e.g., example.com)."
        },
        {
          "displayName": "Authorize Country",
          "name": "body_authorize_country",
          "type": "boolean",
          "default": false,
          "description": "Set to true to restrict access to specific countries."
        },
        {
          "displayName": "Exception Ip",
          "name": "body_exception_ip",
          "type": "string",
          "default": "",
          "description": "Comma-separated list of IPs that bypass restrictions."
        },
        {
          "displayName": "Forbidden Ip",
          "name": "body_forbidden_ip",
          "type": "string",
          "default": "",
          "description": "An IP address that is explicitly blocked (stored as integer)."
        },
        {
          "displayName": "Shared Key",
          "name": "body_shared_key",
          "type": "string",
          "default": "",
          "description": "Shared key for validating access or external system auth."
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
            "Restrictions"
          ],
          "operation": [
            "Update Restriction Password"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Restrictions"
          ],
          "operation": [
            "Update Restriction Password"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Pass Stream",
      "name": "body_pass_stream",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Restrictions"
          ],
          "operation": [
            "Update Restriction Password"
          ]
        }
      },
      "required": true,
      "description": "a strict string (no HTML/PHP tags or HTML entities allowed)"
    },
    {
      "displayName": "Password",
      "name": "body_password",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Restrictions"
          ],
          "operation": [
            "Update Restriction Password"
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
            "Stats > Channel > Connection History"
          ]
        }
      },
      "options": [
        {
          "name": "Return List Of Connection",
          "value": "Return List Of Connection"
        },
        {
          "name": "Return A Channel",
          "value": "Return A Channel"
        }
      ],
      "default": "Return List Of Connection",
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
            "Stats > Channel > Connection History"
          ],
          "operation": [
            "Return List Of Connection"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Connection History"
          ],
          "operation": [
            "Return A Channel"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Connection History",
      "name": "path_connection_history",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Connection History"
          ],
          "operation": [
            "Return A Channel"
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
            "Stats > Channel > Consumption"
          ]
        }
      },
      "options": [
        {
          "name": "Consumption",
          "value": "Consumption"
        },
        {
          "name": "Consumption Per Resolution",
          "value": "Consumption Per Resolution"
        }
      ],
      "default": "Consumption",
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
            "Stats > Channel > Consumption"
          ],
          "operation": [
            "Consumption"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the Pack order to request."
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Consumption"
          ],
          "operation": [
            "Consumption"
          ]
        }
      },
      "required": true,
      "description": "Specify the starting date to get Consumption"
    },
    {
      "displayName": "To",
      "name": "query_to",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Consumption"
          ],
          "operation": [
            "Consumption"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption"
    },
    {
      "displayName": "Per",
      "name": "query_per",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Consumption"
          ],
          "operation": [
            "Consumption"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption",
      "options": [
        {
          "name": "day",
          "value": "day"
        },
        {
          "name": "hour",
          "value": "hour"
        },
        {
          "name": "minute",
          "value": "minute"
        },
        {
          "name": "month",
          "value": "month"
        },
        {
          "name": "quarter",
          "value": "quarter"
        },
        {
          "name": "week",
          "value": "week"
        },
        {
          "name": "year",
          "value": "year"
        }
      ]
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Consumption"
          ],
          "operation": [
            "Consumption"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Consumption"
          ],
          "operation": [
            "Consumption Per Resolution"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the Pack order to request."
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Consumption"
          ],
          "operation": [
            "Consumption Per Resolution"
          ]
        }
      },
      "required": true,
      "description": "Specify the starting date to get Consumption"
    },
    {
      "displayName": "To",
      "name": "query_to",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Consumption"
          ],
          "operation": [
            "Consumption Per Resolution"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption"
    },
    {
      "displayName": "Per",
      "name": "query_per",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Consumption"
          ],
          "operation": [
            "Consumption Per Resolution"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption",
      "options": [
        {
          "name": "day",
          "value": "day"
        },
        {
          "name": "hour",
          "value": "hour"
        },
        {
          "name": "minute",
          "value": "minute"
        },
        {
          "name": "month",
          "value": "month"
        },
        {
          "name": "quarter",
          "value": "quarter"
        },
        {
          "name": "week",
          "value": "week"
        },
        {
          "name": "year",
          "value": "year"
        }
      ]
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Consumption"
          ],
          "operation": [
            "Consumption Per Resolution"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Export Stats"
          ]
        }
      },
      "options": [
        {
          "name": "Return Text/csv",
          "value": "Return Text/csv"
        }
      ],
      "default": "Return Text/csv",
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
            "Stats > Channel > Export Stats"
          ],
          "operation": [
            "Return Text/csv"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Statistics",
      "name": "path_statistics",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Export Stats"
          ],
          "operation": [
            "Return Text/csv"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Export Stats"
          ],
          "operation": [
            "Return Text/csv"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Export Stats"
          ],
          "operation": [
            "Return Text/csv"
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
            "Stats > Channel > Export Stats"
          ],
          "operation": [
            "Return Text/csv"
          ]
        }
      },
      "options": [
        {
          "displayName": "Per",
          "name": "query_per",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "day",
              "value": "day"
            },
            {
              "name": "hour",
              "value": "hour"
            },
            {
              "name": "minute",
              "value": "minute"
            },
            {
              "name": "month",
              "value": "month"
            },
            {
              "name": "quarter",
              "value": "quarter"
            },
            {
              "name": "week",
              "value": "week"
            },
            {
              "name": "year",
              "value": "year"
            }
          ]
        },
        {
          "displayName": "To",
          "name": "query_to",
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
            "Stats > Channel > Geolocation"
          ]
        }
      },
      "options": [
        {
          "name": "Countries",
          "value": "Countries"
        },
        {
          "name": "Clusters",
          "value": "Clusters"
        }
      ],
      "default": "Countries",
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
            "Stats > Channel > Geolocation"
          ],
          "operation": [
            "Countries"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the Pack order to request."
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Geolocation"
          ],
          "operation": [
            "Countries"
          ]
        }
      },
      "required": true,
      "description": "Specify the starting date to get Consumption"
    },
    {
      "displayName": "To",
      "name": "query_to",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Geolocation"
          ],
          "operation": [
            "Countries"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption"
    },
    {
      "displayName": "Per",
      "name": "query_per",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Geolocation"
          ],
          "operation": [
            "Countries"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption",
      "options": [
        {
          "name": "day",
          "value": "day"
        },
        {
          "name": "hour",
          "value": "hour"
        },
        {
          "name": "minute",
          "value": "minute"
        },
        {
          "name": "month",
          "value": "month"
        },
        {
          "name": "quarter",
          "value": "quarter"
        },
        {
          "name": "week",
          "value": "week"
        },
        {
          "name": "year",
          "value": "year"
        }
      ]
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Geolocation"
          ],
          "operation": [
            "Countries"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Geolocation"
          ],
          "operation": [
            "Clusters"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the Pack order to request."
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Geolocation"
          ],
          "operation": [
            "Clusters"
          ]
        }
      },
      "required": true,
      "description": "Specify the starting date to get Consumption"
    },
    {
      "displayName": "To",
      "name": "query_to",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Geolocation"
          ],
          "operation": [
            "Clusters"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption"
    },
    {
      "displayName": "Per",
      "name": "query_per",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Geolocation"
          ],
          "operation": [
            "Clusters"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption",
      "options": [
        {
          "name": "day",
          "value": "day"
        },
        {
          "name": "hour",
          "value": "hour"
        },
        {
          "name": "minute",
          "value": "minute"
        },
        {
          "name": "month",
          "value": "month"
        },
        {
          "name": "quarter",
          "value": "quarter"
        },
        {
          "name": "week",
          "value": "week"
        },
        {
          "name": "year",
          "value": "year"
        }
      ]
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Geolocation"
          ],
          "operation": [
            "Clusters"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Technologies"
          ]
        }
      },
      "options": [
        {
          "name": "Browsers Share",
          "value": "Browsers Share"
        },
        {
          "name": "Player Share",
          "value": "Player Share"
        },
        {
          "name": "OS Share",
          "value": "OS Share"
        }
      ],
      "default": "Browsers Share",
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
            "Stats > Channel > Technologies"
          ],
          "operation": [
            "Browsers Share"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the Pack order to request."
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Technologies"
          ],
          "operation": [
            "Browsers Share"
          ]
        }
      },
      "required": true,
      "description": "Specify the starting date to get Consumption"
    },
    {
      "displayName": "To",
      "name": "query_to",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Technologies"
          ],
          "operation": [
            "Browsers Share"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption"
    },
    {
      "displayName": "Per",
      "name": "query_per",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Technologies"
          ],
          "operation": [
            "Browsers Share"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption",
      "options": [
        {
          "name": "day",
          "value": "day"
        },
        {
          "name": "hour",
          "value": "hour"
        },
        {
          "name": "minute",
          "value": "minute"
        },
        {
          "name": "month",
          "value": "month"
        },
        {
          "name": "quarter",
          "value": "quarter"
        },
        {
          "name": "week",
          "value": "week"
        },
        {
          "name": "year",
          "value": "year"
        }
      ]
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Technologies"
          ],
          "operation": [
            "Browsers Share"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Technologies"
          ],
          "operation": [
            "Player Share"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the Pack order to request."
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Technologies"
          ],
          "operation": [
            "Player Share"
          ]
        }
      },
      "required": true,
      "description": "Specify the starting date to get Consumption"
    },
    {
      "displayName": "To",
      "name": "query_to",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Technologies"
          ],
          "operation": [
            "Player Share"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption"
    },
    {
      "displayName": "Per",
      "name": "query_per",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Technologies"
          ],
          "operation": [
            "Player Share"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption",
      "options": [
        {
          "name": "day",
          "value": "day"
        },
        {
          "name": "hour",
          "value": "hour"
        },
        {
          "name": "minute",
          "value": "minute"
        },
        {
          "name": "month",
          "value": "month"
        },
        {
          "name": "quarter",
          "value": "quarter"
        },
        {
          "name": "week",
          "value": "week"
        },
        {
          "name": "year",
          "value": "year"
        }
      ]
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Technologies"
          ],
          "operation": [
            "Player Share"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Technologies"
          ],
          "operation": [
            "OS Share"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the Pack order to request."
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Technologies"
          ],
          "operation": [
            "OS Share"
          ]
        }
      },
      "required": true,
      "description": "Specify the starting date to get Consumption"
    },
    {
      "displayName": "To",
      "name": "query_to",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Technologies"
          ],
          "operation": [
            "OS Share"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption"
    },
    {
      "displayName": "Per",
      "name": "query_per",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Technologies"
          ],
          "operation": [
            "OS Share"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption",
      "options": [
        {
          "name": "day",
          "value": "day"
        },
        {
          "name": "hour",
          "value": "hour"
        },
        {
          "name": "minute",
          "value": "minute"
        },
        {
          "name": "month",
          "value": "month"
        },
        {
          "name": "quarter",
          "value": "quarter"
        },
        {
          "name": "week",
          "value": "week"
        },
        {
          "name": "year",
          "value": "year"
        }
      ]
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Technologies"
          ],
          "operation": [
            "OS Share"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewers"
          ]
        }
      },
      "options": [
        {
          "name": "Viewers Share",
          "value": "Viewers Share"
        },
        {
          "name": "Viewers Histogram Share",
          "value": "Viewers Histogram Share"
        },
        {
          "name": "Viewers Per Resolution Share.",
          "value": "Viewers Per Resolution Share."
        },
        {
          "name": "Viewers Per Resolution Histogram.",
          "value": "Viewers Per Resolution Histogram."
        },
        {
          "name": "Unique Viewers.",
          "value": "Unique Viewers."
        }
      ],
      "default": "Viewers Share",
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
            "Stats > Channel > Viewers"
          ],
          "operation": [
            "Viewers Share"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the Pack order to request."
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewers"
          ],
          "operation": [
            "Viewers Share"
          ]
        }
      },
      "required": true,
      "description": "Specify the starting date to get Consumption"
    },
    {
      "displayName": "To",
      "name": "query_to",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewers"
          ],
          "operation": [
            "Viewers Share"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption"
    },
    {
      "displayName": "Per",
      "name": "query_per",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewers"
          ],
          "operation": [
            "Viewers Share"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption",
      "options": [
        {
          "name": "day",
          "value": "day"
        },
        {
          "name": "hour",
          "value": "hour"
        },
        {
          "name": "minute",
          "value": "minute"
        },
        {
          "name": "month",
          "value": "month"
        },
        {
          "name": "quarter",
          "value": "quarter"
        },
        {
          "name": "week",
          "value": "week"
        },
        {
          "name": "year",
          "value": "year"
        }
      ]
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewers"
          ],
          "operation": [
            "Viewers Share"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewers"
          ],
          "operation": [
            "Viewers Histogram Share"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the Pack order to request."
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewers"
          ],
          "operation": [
            "Viewers Histogram Share"
          ]
        }
      },
      "required": true,
      "description": "Specify the starting date to get Consumption"
    },
    {
      "displayName": "To",
      "name": "query_to",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewers"
          ],
          "operation": [
            "Viewers Histogram Share"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption"
    },
    {
      "displayName": "Per",
      "name": "query_per",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewers"
          ],
          "operation": [
            "Viewers Histogram Share"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption",
      "options": [
        {
          "name": "day",
          "value": "day"
        },
        {
          "name": "hour",
          "value": "hour"
        },
        {
          "name": "minute",
          "value": "minute"
        },
        {
          "name": "month",
          "value": "month"
        },
        {
          "name": "quarter",
          "value": "quarter"
        },
        {
          "name": "week",
          "value": "week"
        },
        {
          "name": "year",
          "value": "year"
        }
      ]
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewers"
          ],
          "operation": [
            "Viewers Histogram Share"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewers"
          ],
          "operation": [
            "Viewers Per Resolution Share."
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the Pack order to request."
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewers"
          ],
          "operation": [
            "Viewers Per Resolution Share."
          ]
        }
      },
      "required": true,
      "description": "Specify the starting date to get Consumption"
    },
    {
      "displayName": "To",
      "name": "query_to",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewers"
          ],
          "operation": [
            "Viewers Per Resolution Share."
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption"
    },
    {
      "displayName": "Per",
      "name": "query_per",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewers"
          ],
          "operation": [
            "Viewers Per Resolution Share."
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption",
      "options": [
        {
          "name": "day",
          "value": "day"
        },
        {
          "name": "hour",
          "value": "hour"
        },
        {
          "name": "minute",
          "value": "minute"
        },
        {
          "name": "month",
          "value": "month"
        },
        {
          "name": "quarter",
          "value": "quarter"
        },
        {
          "name": "week",
          "value": "week"
        },
        {
          "name": "year",
          "value": "year"
        }
      ]
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewers"
          ],
          "operation": [
            "Viewers Per Resolution Share."
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewers"
          ],
          "operation": [
            "Viewers Per Resolution Histogram."
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the Pack order to request."
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewers"
          ],
          "operation": [
            "Viewers Per Resolution Histogram."
          ]
        }
      },
      "required": true,
      "description": "Specify the starting date to get Consumption"
    },
    {
      "displayName": "To",
      "name": "query_to",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewers"
          ],
          "operation": [
            "Viewers Per Resolution Histogram."
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption"
    },
    {
      "displayName": "Per",
      "name": "query_per",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewers"
          ],
          "operation": [
            "Viewers Per Resolution Histogram."
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption",
      "options": [
        {
          "name": "day",
          "value": "day"
        },
        {
          "name": "hour",
          "value": "hour"
        },
        {
          "name": "minute",
          "value": "minute"
        },
        {
          "name": "month",
          "value": "month"
        },
        {
          "name": "quarter",
          "value": "quarter"
        },
        {
          "name": "week",
          "value": "week"
        },
        {
          "name": "year",
          "value": "year"
        }
      ]
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewers"
          ],
          "operation": [
            "Viewers Per Resolution Histogram."
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewers"
          ],
          "operation": [
            "Unique Viewers."
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the Pack order to request."
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewers"
          ],
          "operation": [
            "Unique Viewers."
          ]
        }
      },
      "required": true,
      "description": "Specify the starting date to get Consumption"
    },
    {
      "displayName": "To",
      "name": "query_to",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewers"
          ],
          "operation": [
            "Unique Viewers."
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption"
    },
    {
      "displayName": "Per",
      "name": "query_per",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewers"
          ],
          "operation": [
            "Unique Viewers."
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption",
      "options": [
        {
          "name": "day",
          "value": "day"
        },
        {
          "name": "hour",
          "value": "hour"
        },
        {
          "name": "minute",
          "value": "minute"
        },
        {
          "name": "month",
          "value": "month"
        },
        {
          "name": "quarter",
          "value": "quarter"
        },
        {
          "name": "week",
          "value": "week"
        },
        {
          "name": "year",
          "value": "year"
        }
      ]
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewers"
          ],
          "operation": [
            "Unique Viewers."
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewing"
          ]
        }
      },
      "options": [
        {
          "name": "Viewing Time",
          "value": "Viewing Time"
        },
        {
          "name": "Viewing Histogram Par Channel",
          "value": "Viewing Histogram Par Channel"
        }
      ],
      "default": "Viewing Time",
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
            "Stats > Channel > Viewing"
          ],
          "operation": [
            "Viewing Time"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the Pack order to request."
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewing"
          ],
          "operation": [
            "Viewing Time"
          ]
        }
      },
      "required": true,
      "description": "Specify the starting date to get Consumption"
    },
    {
      "displayName": "To",
      "name": "query_to",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewing"
          ],
          "operation": [
            "Viewing Time"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption"
    },
    {
      "displayName": "Per",
      "name": "query_per",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewing"
          ],
          "operation": [
            "Viewing Time"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption",
      "options": [
        {
          "name": "day",
          "value": "day"
        },
        {
          "name": "hour",
          "value": "hour"
        },
        {
          "name": "minute",
          "value": "minute"
        },
        {
          "name": "month",
          "value": "month"
        },
        {
          "name": "quarter",
          "value": "quarter"
        },
        {
          "name": "week",
          "value": "week"
        },
        {
          "name": "year",
          "value": "year"
        }
      ]
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewing"
          ],
          "operation": [
            "Viewing Time"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Channel",
      "name": "path_channel",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewing"
          ],
          "operation": [
            "Viewing Histogram Par Channel"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the Pack order to request."
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewing"
          ],
          "operation": [
            "Viewing Histogram Par Channel"
          ]
        }
      },
      "required": true,
      "description": "Specify the starting date to get Consumption"
    },
    {
      "displayName": "To",
      "name": "query_to",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewing"
          ],
          "operation": [
            "Viewing Histogram Par Channel"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption"
    },
    {
      "displayName": "Per",
      "name": "query_per",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewing"
          ],
          "operation": [
            "Viewing Histogram Par Channel"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption",
      "options": [
        {
          "name": "day",
          "value": "day"
        },
        {
          "name": "hour",
          "value": "hour"
        },
        {
          "name": "minute",
          "value": "minute"
        },
        {
          "name": "month",
          "value": "month"
        },
        {
          "name": "quarter",
          "value": "quarter"
        },
        {
          "name": "week",
          "value": "week"
        },
        {
          "name": "year",
          "value": "year"
        }
      ]
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Channel > Viewing"
          ],
          "operation": [
            "Viewing Histogram Par Channel"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Consumption"
          ]
        }
      },
      "options": [
        {
          "name": "Consumption",
          "value": "Consumption"
        },
        {
          "name": "Consumption Per Channel Histogram",
          "value": "Consumption Per Channel Histogram"
        }
      ],
      "default": "Consumption",
      "noDataExpression": true
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Consumption"
          ],
          "operation": [
            "Consumption"
          ]
        }
      },
      "required": true,
      "description": "Specify the starting date to get Consumption"
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Consumption"
          ],
          "operation": [
            "Consumption"
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
            "Stats > Globals > Consumption"
          ],
          "operation": [
            "Consumption"
          ]
        }
      },
      "options": [
        {
          "displayName": "Per",
          "name": "query_per",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "day",
              "value": "day"
            },
            {
              "name": "hour",
              "value": "hour"
            },
            {
              "name": "minute",
              "value": "minute"
            },
            {
              "name": "month",
              "value": "month"
            },
            {
              "name": "quarter",
              "value": "quarter"
            },
            {
              "name": "week",
              "value": "week"
            },
            {
              "name": "year",
              "value": "year"
            }
          ]
        },
        {
          "displayName": "To",
          "name": "query_to",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Consumption"
          ],
          "operation": [
            "Consumption Per Channel Histogram"
          ]
        }
      },
      "required": true,
      "description": "Specify the starting date to get Consumption"
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Consumption"
          ],
          "operation": [
            "Consumption Per Channel Histogram"
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
            "Stats > Globals > Consumption"
          ],
          "operation": [
            "Consumption Per Channel Histogram"
          ]
        }
      },
      "options": [
        {
          "displayName": "Per",
          "name": "query_per",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "day",
              "value": "day"
            },
            {
              "name": "hour",
              "value": "hour"
            },
            {
              "name": "minute",
              "value": "minute"
            },
            {
              "name": "month",
              "value": "month"
            },
            {
              "name": "quarter",
              "value": "quarter"
            },
            {
              "name": "week",
              "value": "week"
            },
            {
              "name": "year",
              "value": "year"
            }
          ]
        },
        {
          "displayName": "To",
          "name": "query_to",
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
            "Stats > Globals > Geolocation"
          ]
        }
      },
      "options": [
        {
          "name": "Countries",
          "value": "Countries"
        },
        {
          "name": "Clusters",
          "value": "Clusters"
        }
      ],
      "default": "Countries",
      "noDataExpression": true
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Geolocation"
          ],
          "operation": [
            "Countries"
          ]
        }
      },
      "required": true,
      "description": "Specify the starting date to get Consumption"
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Geolocation"
          ],
          "operation": [
            "Countries"
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
            "Stats > Globals > Geolocation"
          ],
          "operation": [
            "Countries"
          ]
        }
      },
      "options": [
        {
          "displayName": "Per",
          "name": "query_per",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "day",
              "value": "day"
            },
            {
              "name": "hour",
              "value": "hour"
            },
            {
              "name": "minute",
              "value": "minute"
            },
            {
              "name": "month",
              "value": "month"
            },
            {
              "name": "quarter",
              "value": "quarter"
            },
            {
              "name": "week",
              "value": "week"
            },
            {
              "name": "year",
              "value": "year"
            }
          ]
        },
        {
          "displayName": "To",
          "name": "query_to",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Geolocation"
          ],
          "operation": [
            "Clusters"
          ]
        }
      },
      "required": true,
      "description": "Specify the starting date to get Consumption"
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Geolocation"
          ],
          "operation": [
            "Clusters"
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
            "Stats > Globals > Geolocation"
          ],
          "operation": [
            "Clusters"
          ]
        }
      },
      "options": [
        {
          "displayName": "Per",
          "name": "query_per",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "day",
              "value": "day"
            },
            {
              "name": "hour",
              "value": "hour"
            },
            {
              "name": "minute",
              "value": "minute"
            },
            {
              "name": "month",
              "value": "month"
            },
            {
              "name": "quarter",
              "value": "quarter"
            },
            {
              "name": "week",
              "value": "week"
            },
            {
              "name": "year",
              "value": "year"
            }
          ]
        },
        {
          "displayName": "To",
          "name": "query_to",
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
            "Stats > Globals > Viewers"
          ]
        }
      },
      "options": [
        {
          "name": "Viewers",
          "value": "Viewers"
        },
        {
          "name": "Unique Viewers",
          "value": "Unique Viewers"
        },
        {
          "name": "Viewers Histogram",
          "value": "Viewers Histogram"
        },
        {
          "name": "Viewers Per Channel Histogram",
          "value": "Viewers Per Channel Histogram"
        },
        {
          "name": "Viewers Per Channel Share",
          "value": "Viewers Per Channel Share"
        }
      ],
      "default": "Viewers",
      "noDataExpression": true
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewers"
          ],
          "operation": [
            "Viewers"
          ]
        }
      },
      "required": true,
      "description": "Specify the starting date to get Consumption"
    },
    {
      "displayName": "To",
      "name": "query_to",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewers"
          ],
          "operation": [
            "Viewers"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption"
    },
    {
      "displayName": "Per",
      "name": "query_per",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewers"
          ],
          "operation": [
            "Viewers"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption",
      "options": [
        {
          "name": "day",
          "value": "day"
        },
        {
          "name": "hour",
          "value": "hour"
        },
        {
          "name": "minute",
          "value": "minute"
        },
        {
          "name": "month",
          "value": "month"
        },
        {
          "name": "quarter",
          "value": "quarter"
        },
        {
          "name": "week",
          "value": "week"
        },
        {
          "name": "year",
          "value": "year"
        }
      ]
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewers"
          ],
          "operation": [
            "Viewers"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewers"
          ],
          "operation": [
            "Unique Viewers"
          ]
        }
      },
      "required": true,
      "description": "Specify the starting date to get Consumption"
    },
    {
      "displayName": "To",
      "name": "query_to",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewers"
          ],
          "operation": [
            "Unique Viewers"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption"
    },
    {
      "displayName": "Per",
      "name": "query_per",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewers"
          ],
          "operation": [
            "Unique Viewers"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption",
      "options": [
        {
          "name": "day",
          "value": "day"
        },
        {
          "name": "hour",
          "value": "hour"
        },
        {
          "name": "minute",
          "value": "minute"
        },
        {
          "name": "month",
          "value": "month"
        },
        {
          "name": "quarter",
          "value": "quarter"
        },
        {
          "name": "week",
          "value": "week"
        },
        {
          "name": "year",
          "value": "year"
        }
      ]
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewers"
          ],
          "operation": [
            "Unique Viewers"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewers"
          ],
          "operation": [
            "Viewers Histogram"
          ]
        }
      },
      "required": true,
      "description": "Specify the starting date to get Consumption"
    },
    {
      "displayName": "To",
      "name": "query_to",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewers"
          ],
          "operation": [
            "Viewers Histogram"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption"
    },
    {
      "displayName": "Per",
      "name": "query_per",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewers"
          ],
          "operation": [
            "Viewers Histogram"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption",
      "options": [
        {
          "name": "day",
          "value": "day"
        },
        {
          "name": "hour",
          "value": "hour"
        },
        {
          "name": "minute",
          "value": "minute"
        },
        {
          "name": "month",
          "value": "month"
        },
        {
          "name": "quarter",
          "value": "quarter"
        },
        {
          "name": "week",
          "value": "week"
        },
        {
          "name": "year",
          "value": "year"
        }
      ]
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewers"
          ],
          "operation": [
            "Viewers Histogram"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewers"
          ],
          "operation": [
            "Viewers Per Channel Histogram"
          ]
        }
      },
      "required": true,
      "description": "Specify the starting date to get Consumption"
    },
    {
      "displayName": "To",
      "name": "query_to",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewers"
          ],
          "operation": [
            "Viewers Per Channel Histogram"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption"
    },
    {
      "displayName": "Per",
      "name": "query_per",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewers"
          ],
          "operation": [
            "Viewers Per Channel Histogram"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption",
      "options": [
        {
          "name": "day",
          "value": "day"
        },
        {
          "name": "hour",
          "value": "hour"
        },
        {
          "name": "minute",
          "value": "minute"
        },
        {
          "name": "month",
          "value": "month"
        },
        {
          "name": "quarter",
          "value": "quarter"
        },
        {
          "name": "week",
          "value": "week"
        },
        {
          "name": "year",
          "value": "year"
        }
      ]
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewers"
          ],
          "operation": [
            "Viewers Per Channel Histogram"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewers"
          ],
          "operation": [
            "Viewers Per Channel Share"
          ]
        }
      },
      "required": true,
      "description": "Specify the starting date to get Consumption"
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewers"
          ],
          "operation": [
            "Viewers Per Channel Share"
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
            "Stats > Globals > Viewers"
          ],
          "operation": [
            "Viewers Per Channel Share"
          ]
        }
      },
      "options": [
        {
          "displayName": "Per",
          "name": "query_per",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "day",
              "value": "day"
            },
            {
              "name": "hour",
              "value": "hour"
            },
            {
              "name": "minute",
              "value": "minute"
            },
            {
              "name": "month",
              "value": "month"
            },
            {
              "name": "quarter",
              "value": "quarter"
            },
            {
              "name": "week",
              "value": "week"
            },
            {
              "name": "year",
              "value": "year"
            }
          ]
        },
        {
          "displayName": "To",
          "name": "query_to",
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
            "Stats > Globals > Viewing"
          ]
        }
      },
      "options": [
        {
          "name": "Viewing Time",
          "value": "Viewing Time"
        },
        {
          "name": "Viewing Histogram Par Channel",
          "value": "Viewing Histogram Par Channel"
        }
      ],
      "default": "Viewing Time",
      "noDataExpression": true
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewing"
          ],
          "operation": [
            "Viewing Time"
          ]
        }
      },
      "required": true,
      "description": "Specify the starting date to get Consumption"
    },
    {
      "displayName": "To",
      "name": "query_to",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewing"
          ],
          "operation": [
            "Viewing Time"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption"
    },
    {
      "displayName": "Per",
      "name": "query_per",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewing"
          ],
          "operation": [
            "Viewing Time"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption",
      "options": [
        {
          "name": "day",
          "value": "day"
        },
        {
          "name": "hour",
          "value": "hour"
        },
        {
          "name": "minute",
          "value": "minute"
        },
        {
          "name": "month",
          "value": "month"
        },
        {
          "name": "quarter",
          "value": "quarter"
        },
        {
          "name": "week",
          "value": "week"
        },
        {
          "name": "year",
          "value": "year"
        }
      ]
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewing"
          ],
          "operation": [
            "Viewing Time"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "From",
      "name": "query_from",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewing"
          ],
          "operation": [
            "Viewing Histogram Par Channel"
          ]
        }
      },
      "required": true,
      "description": "Specify the starting date to get Consumption"
    },
    {
      "displayName": "To",
      "name": "query_to",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewing"
          ],
          "operation": [
            "Viewing Histogram Par Channel"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption"
    },
    {
      "displayName": "Per",
      "name": "query_per",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewing"
          ],
          "operation": [
            "Viewing Histogram Par Channel"
          ]
        }
      },
      "required": true,
      "description": "Specify the ending date to get Consumption",
      "options": [
        {
          "name": "day",
          "value": "day"
        },
        {
          "name": "hour",
          "value": "hour"
        },
        {
          "name": "minute",
          "value": "minute"
        },
        {
          "name": "month",
          "value": "month"
        },
        {
          "name": "quarter",
          "value": "quarter"
        },
        {
          "name": "week",
          "value": "week"
        },
        {
          "name": "year",
          "value": "year"
        }
      ]
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Stats > Globals > Viewing"
          ],
          "operation": [
            "Viewing Histogram Par Channel"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Thumbnail"
          ]
        }
      },
      "options": [
        {
          "name": "Show Picture",
          "value": "Show Picture"
        }
      ],
      "default": "Show Picture",
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
            "Thumbnail"
          ],
          "operation": [
            "Show Picture"
          ]
        }
      },
      "required": true,
      "description": "The unique identifier (ID) of the channel to request."
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Order"
          ]
        }
      },
      "options": [
        {
          "name": "Returns A Pack Order",
          "value": "Returns A Pack Order"
        },
        {
          "name": "Returns A Pack Order",
          "value": "Returns A Pack Order (2)"
        },
        {
          "name": "Update A Pack",
          "value": "Update A Pack"
        }
      ],
      "default": "Returns A Pack Order",
      "noDataExpression": true
    },
    {
      "displayName": "Order",
      "name": "path_order",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Order"
          ],
          "operation": [
            "Returns A Pack Order"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Order"
          ],
          "operation": [
            "Returns A Pack Order"
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
            "Order"
          ],
          "operation": [
            "Returns A Pack Order"
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
      "displayName": "Order",
      "name": "path_order",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Order"
          ],
          "operation": [
            "Returns A Pack Order (2)"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Account Id",
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Order"
          ],
          "operation": [
            "Returns A Pack Order (2)"
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
            "Order"
          ],
          "operation": [
            "Returns A Pack Order (2)"
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
      "name": "query_account_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Order"
          ],
          "operation": [
            "Update A Pack"
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
            "Order"
          ],
          "operation": [
            "Update A Pack"
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
            "Order"
          ],
          "operation": [
            "Update A Pack"
          ]
        }
      },
      "options": [
        {
          "displayName": "Allowed Excess",
          "name": "body_allowed_excess",
          "type": "number",
          "default": 0,
          "description": "Specify a limit before the interruption of live events in case of overrun"
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
            "Channel",
            "Players"
          ],
          "operation": [
            "List Channels",
            "Lists All Players"
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
            "Channel",
            "Players"
          ],
          "operation": [
            "List Channels",
            "Lists All Players"
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
