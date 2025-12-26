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
    "GET /1/videos": {
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
    "POST /1/videos": {
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
    "GET /1/videos/{channel}": {
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
    "PUT /1/videos/{channel}": {
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
        },
        {
          "name": "remember_to_config",
          "field": "body_remember_to_config"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /1/videos/{channel}": {
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
    "POST /1/videos/{channel}/encodes": {
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
    "GET /1/videos/{channel}/events": {
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
    "POST /1/videos/{channel}/events": {
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
          "name": "access_country",
          "field": "body_access_country"
        },
        {
          "name": "authorize_country",
          "field": "body_authorize_country"
        },
        {
          "name": "date",
          "field": "body_date"
        },
        {
          "name": "dvr_window",
          "field": "body_dvr_window"
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
          "name": "record",
          "field": "body_record"
        },
        {
          "name": "record_name",
          "field": "body_record_name"
        },
        {
          "name": "repeat_interval",
          "field": "body_repeat_interval"
        },
        {
          "name": "repeat_until",
          "field": "body_repeat_until"
        },
        {
          "name": "simulcasts",
          "field": "body_simulcasts"
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
          "name": "storage_machine_id",
          "field": "body_storage_machine_id"
        },
        {
          "name": "timezone",
          "field": "body_timezone"
        },
        {
          "name": "weekdays_only",
          "field": "body_weekdays_only"
        },
        {
          "name": "weekends_only",
          "field": "body_weekends_only"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /1/videos/{channel}/events/{repeatable_planned_event}": {
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
    "PUT /1/videos/{channel}/events/{repeatable_planned_event}": {
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
          "name": "access_country",
          "field": "body_access_country"
        },
        {
          "name": "authorize_country",
          "field": "body_authorize_country"
        },
        {
          "name": "date",
          "field": "body_date"
        },
        {
          "name": "dvr_window",
          "field": "body_dvr_window"
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
          "name": "record",
          "field": "body_record"
        },
        {
          "name": "record_name",
          "field": "body_record_name"
        },
        {
          "name": "repeat_interval",
          "field": "body_repeat_interval"
        },
        {
          "name": "repeat_until",
          "field": "body_repeat_until"
        },
        {
          "name": "simulcasts",
          "field": "body_simulcasts"
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
          "name": "storage_machine_id",
          "field": "body_storage_machine_id"
        },
        {
          "name": "timezone",
          "field": "body_timezone"
        },
        {
          "name": "type",
          "field": "body_type"
        },
        {
          "name": "weekdays_only",
          "field": "body_weekdays_only"
        },
        {
          "name": "weekends_only",
          "field": "body_weekends_only"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /1/videos/{channel}/events/{repeatable_planned_event}": {
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
      "bodyFields": [
        {
          "name": "date",
          "field": "body_date"
        },
        {
          "name": "type",
          "field": "body_type"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Integrations": {
    "GET /1/videos/{channel}/integrations": {
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
    "PUT /1/videos/{channel}/live/start": {
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
    "PUT /1/videos/{channel}/live/stop": {
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
    "GET /1/videos/countries": {
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
    "GET /1/videos/timezones": {
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
  "Misc > stream": {
    "GET /1/videos/password": {
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
    "GET /1/videos/{channel}/options": {
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
    "GET /1/videos/{channel}/options/{video_option}": {
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
    "PUT /1/videos/{channel}/options/{video_option}/recommit": {
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
    "DELETE /1/videos/{channel}/options/{video_option}/terminate": {
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
      "bodyFields": [
        {
          "name": "instant",
          "field": "body_instant"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Option > Record": {
    "GET /1/videos/{channel}/options/recording": {
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
    "POST /1/videos/{channel}/options/recording": {
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
    "PUT /1/videos/{channel}/options/recording": {
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
      "bodyFields": [
        {
          "name": "auto_record",
          "field": "body_auto_record"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Option > Record > Instant": {
    "POST /1/videos/{channel}/options/recording/instant": {
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
          "name": "diffusion_at",
          "field": "body_diffusion_at"
        },
        {
          "name": "diffusion_ends_at",
          "field": "body_diffusion_ends_at"
        },
        {
          "name": "file_path",
          "field": "body_file_path"
        },
        {
          "name": "fragment_duration",
          "field": "body_fragment_duration"
        },
        {
          "name": "fragment_number",
          "field": "body_fragment_number"
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
    "DELETE /1/videos/{channel}/options/recording/instant": {
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
    "GET /1/videos/{channel}/options/recording/storage": {
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
    "POST /1/videos/{channel}/options/recording/storage": {
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
    "POST /1/videos/{channel}/options/recording/storage/test": {
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
          "name": "auto_record_name",
          "field": "body_auto_record_name"
        },
        {
          "name": "default",
          "field": "body_default"
        },
        {
          "name": "host",
          "field": "body_host"
        },
        {
          "name": "login",
          "field": "body_login"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "pass",
          "field": "body_pass"
        },
        {
          "name": "path",
          "field": "body_path"
        },
        {
          "name": "port",
          "field": "body_port"
        },
        {
          "name": "protocol",
          "field": "body_protocol"
        },
        {
          "name": "url_http",
          "field": "body_url_http"
        },
        {
          "name": "use_path",
          "field": "body_use_path"
        },
        {
          "name": "void_id",
          "field": "body_void_id"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "GET /1/videos/{channel}/options/recording/storage/{storage_machine}": {
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
    "PUT /1/videos/{channel}/options/recording/storage/{storage_machine}": {
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
    "DELETE /1/videos/{channel}/options/recording/storage/{storage_machine}": {
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
    "GET /1/videos/{channel}/options/timeshift": {
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
    "POST /1/videos/{channel}/options/timeshift": {
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
    "PUT /1/videos/{channel}/options/timeshift": {
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
      "bodyFields": [
        {
          "name": "enabled",
          "field": "body_enabled"
        },
        {
          "name": "record_window_duration",
          "field": "body_record_window_duration"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Option > Watermarking": {
    "GET /1/videos/{channel}/options/watermark": {
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
    "PUT /1/videos/{channel}/options/watermark": {
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
          "name": "enabled",
          "field": "body_enabled"
        },
        {
          "name": "follow_update",
          "field": "body_follow_update"
        },
        {
          "name": "height",
          "field": "body_height"
        },
        {
          "name": "horizontal_offset",
          "field": "body_horizontal_offset"
        },
        {
          "name": "image_path",
          "field": "body_image_path"
        },
        {
          "name": "opacity_percentage",
          "field": "body_opacity_percentage"
        },
        {
          "name": "size_percentage",
          "field": "body_size_percentage"
        },
        {
          "name": "vertical_offset",
          "field": "body_vertical_offset"
        },
        {
          "name": "width",
          "field": "body_width"
        },
        {
          "name": "z_index",
          "field": "body_z_index"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "PUT /1/videos/{channel}/options/watermark/enable": {
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
    "PUT /1/videos/{channel}/options/watermark/disable": {
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
  "Option > simulcast": {
    "POST /1/videos/{channel}/simulcasts/{simulcast_platform}": {
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
    "GET /1/videos/{channel}/simulcasts": {
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
    "GET /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}": {
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
    "PUT /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}": {
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
          "name": "dest_stream",
          "field": "body_dest_stream"
        },
        {
          "name": "enabled",
          "field": "body_enabled"
        },
        {
          "name": "host",
          "field": "body_host"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "port",
          "field": "body_port"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "DELETE /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}": {
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
    "PUT /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}/enable": {
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
    "PUT /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}/disable": {
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
    "GET /1/videos/{channel}/players": {
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
    "POST /1/videos/{channel}/players": {
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
          "name": "ads_url",
          "field": "body_ads_url"
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
          "name": "countdown_days",
          "field": "body_countdown_days"
        },
        {
          "name": "countdown_hours",
          "field": "body_countdown_hours"
        },
        {
          "name": "countdown_minutes",
          "field": "body_countdown_minutes"
        },
        {
          "name": "countdown_seconds",
          "field": "body_countdown_seconds"
        },
        {
          "name": "countdown_txt",
          "field": "body_countdown_txt"
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
          "name": "enable_twitter",
          "field": "body_enable_twitter"
        },
        {
          "name": "extract_preload_img",
          "field": "body_extract_preload_img"
        },
        {
          "name": "facebook_back_link",
          "field": "body_facebook_back_link"
        },
        {
          "name": "facebook_player_embed",
          "field": "body_facebook_player_embed"
        },
        {
          "name": "geo_ip_img",
          "field": "body_geo_ip_img"
        },
        {
          "name": "height",
          "field": "body_height"
        },
        {
          "name": "interrupt_img",
          "field": "body_interrupt_img"
        },
        {
          "name": "is360",
          "field": "body_is360"
        },
        {
          "name": "logo_anchor",
          "field": "body_logo_anchor"
        },
        {
          "name": "logo_img",
          "field": "body_logo_img"
        },
        {
          "name": "logo_margin_left",
          "field": "body_logo_margin_left"
        },
        {
          "name": "logo_margin_top",
          "field": "body_logo_margin_top"
        },
        {
          "name": "logo_percentage",
          "field": "body_logo_percentage"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "preload_img",
          "field": "body_preload_img"
        },
        {
          "name": "ratio",
          "field": "body_ratio"
        },
        {
          "name": "restrict_img",
          "field": "body_restrict_img"
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
          "name": "show_logo",
          "field": "body_show_logo"
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
          "name": "sound_enabled",
          "field": "body_sound_enabled"
        },
        {
          "name": "sound_percentage",
          "field": "body_sound_percentage"
        },
        {
          "name": "stereo_projection360",
          "field": "body_stereo_projection360"
        },
        {
          "name": "time_before_hide_cb",
          "field": "body_time_before_hide_cb"
        },
        {
          "name": "title",
          "field": "body_title"
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
    "GET /1/videos/{channel}/players/{player}": {
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
    "POST /1/videos/{channel}/players/{player}": {
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
    "PUT /1/videos/{channel}/players/{player}": {
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
          "name": "ads_url",
          "field": "body_ads_url"
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
          "name": "countdown_days",
          "field": "body_countdown_days"
        },
        {
          "name": "countdown_hours",
          "field": "body_countdown_hours"
        },
        {
          "name": "countdown_minutes",
          "field": "body_countdown_minutes"
        },
        {
          "name": "countdown_seconds",
          "field": "body_countdown_seconds"
        },
        {
          "name": "countdown_txt",
          "field": "body_countdown_txt"
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
          "name": "enable_twitter",
          "field": "body_enable_twitter"
        },
        {
          "name": "extract_preload_img",
          "field": "body_extract_preload_img"
        },
        {
          "name": "facebook_back_link",
          "field": "body_facebook_back_link"
        },
        {
          "name": "facebook_player_embed",
          "field": "body_facebook_player_embed"
        },
        {
          "name": "geo_ip_img",
          "field": "body_geo_ip_img"
        },
        {
          "name": "height",
          "field": "body_height"
        },
        {
          "name": "interrupt_img",
          "field": "body_interrupt_img"
        },
        {
          "name": "is360",
          "field": "body_is360"
        },
        {
          "name": "logo_anchor",
          "field": "body_logo_anchor"
        },
        {
          "name": "logo_img",
          "field": "body_logo_img"
        },
        {
          "name": "logo_margin_left",
          "field": "body_logo_margin_left"
        },
        {
          "name": "logo_margin_top",
          "field": "body_logo_margin_top"
        },
        {
          "name": "logo_percentage",
          "field": "body_logo_percentage"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "preload_img",
          "field": "body_preload_img"
        },
        {
          "name": "ratio",
          "field": "body_ratio"
        },
        {
          "name": "restrict_img",
          "field": "body_restrict_img"
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
          "name": "show_logo",
          "field": "body_show_logo"
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
          "name": "sound_enabled",
          "field": "body_sound_enabled"
        },
        {
          "name": "sound_percentage",
          "field": "body_sound_percentage"
        },
        {
          "name": "stereo_projection360",
          "field": "body_stereo_projection360"
        },
        {
          "name": "time_before_hide_cb",
          "field": "body_time_before_hide_cb"
        },
        {
          "name": "title",
          "field": "body_title"
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
    "DELETE /1/videos/{channel}/players/{player}": {
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
    "GET /1/videos/{channel}/players/{player}/ads": {
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
    "POST /1/videos/{channel}/players/{player}/ads": {
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
          "name": "is_periodic",
          "field": "body_is_periodic"
        },
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
    "POST /1/videos/{channel}/players/{player}/ads/duplicate": {
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
    "GET /1/videos/{channel}/players/{player}/ads/{ads}": {
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
    "PUT /1/videos/{channel}/players/{player}/ads/{ads}": {
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
      "bodyFields": [
        {
          "name": "is_periodic",
          "field": "body_is_periodic"
        },
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
    "DELETE /1/videos/{channel}/players/{player}/ads/{ads}": {
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
    "GET /1/videos/{channel}/players/{player}/embed": {
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
    "GET /1/videos/{channel}/players/{player}/embed/url": {
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
    "GET /1/videos/{channel}/players/{player}/thumbnail/{thumbnail}": {
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
    "GET /1/videos/shop/prices": {
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
    "GET /1/videos/shop/descriptions": {
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
    "GET /1/videos/{channel}/restrictions": {
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
    "PUT /1/videos/{channel}/restrictions": {
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
      "bodyFields": [
        {
          "name": "access_country",
          "field": "body_access_country"
        },
        {
          "name": "allow_domain",
          "field": "body_allow_domain"
        },
        {
          "name": "authorize_country",
          "field": "body_authorize_country"
        },
        {
          "name": "exception_ip",
          "field": "body_exception_ip"
        },
        {
          "name": "forbidden_ip",
          "field": "body_forbidden_ip"
        },
        {
          "name": "shared_key",
          "field": "body_shared_key"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "PUT /1/videos/{channel}/restrictions/password": {
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
  "Stats > Channel > Connection history": {
    "GET /1/videos/{channel}/history": {
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
    "GET /1/videos/{channel}/history/{connection_history}": {
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
    "GET /1/videos/{channel}/stats/consumption": {
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
    "GET /1/videos/{channel}/stats/consumption/resolutions/histogram": {
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
  "Stats > Channel > Export stats": {
    "GET /1/videos/{channel}/stats/export_csv/{statistics}": {
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
    "GET /1/videos/{channel}/stats/geolocation/countries": {
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
    "GET /1/videos/{channel}/stats/geolocation/clusters": {
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
    "GET /1/videos/{channel}/stats/technologies/browsers/shares": {
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
    "GET /1/videos/{channel}/stats/technologies/players/shares": {
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
    "GET /1/videos/{channel}/stats/technologies/os/shares": {
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
    "GET /1/videos/{channel}/stats/viewers": {
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
    "GET /1/videos/{channel}/stats/viewers/histogram": {
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
    "GET /1/videos/{channel}/stats/viewers/resolutions/shares": {
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
    "GET /1/videos/{channel}/stats/viewers/resolutions/histogram": {
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
    "GET /1/videos/{channel}/stats/viewers/uniques": {
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
    "GET /1/videos/{channel}/stats/viewing": {
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
    "GET /1/videos/{channel}/stats/viewing/resolutions/histogram": {
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
    "GET /1/videos/stats/consumption": {
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
    "GET /1/videos/stats/consumption/channels/histogram": {
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
    "GET /1/videos/stats/geolocation/countries": {
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
    "GET /1/videos/stats/geolocation/clusters": {
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
    "GET /1/videos/stats/viewers": {
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
    "GET /1/videos/stats/viewers/uniques": {
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
    "GET /1/videos/stats/viewers/histogram": {
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
    "GET /1/videos/stats/viewers/channels/histogram": {
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
    "GET /1/videos/stats/viewers/channels/shares": {
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
    "GET /1/videos/stats/viewing": {
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
    "GET /1/videos/stats/viewing/channels/histogram": {
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
    "GET /1/videos/{channel}/thumbnail": {
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
  "order": {
    "GET /1/videos/order/{order}": {
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
    "GET /1/videos/order": {
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
    "PUT /1/videos/order": {
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
      "bodyFields": [
        {
          "name": "allowed_excess",
          "field": "body_allowed_excess"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  }
};

export class InfomaniakStreamingVideo implements INodeType {
	description: INodeTypeDescription = {
  "displayName": "Infomaniak Streaming Vidéo",
  "name": "infomaniakStreamingVideo",
  "icon": "file:../../icons/video.svg",
  "group": [
    "output"
  ],
  "version": 1,
  "description": "Interact with Infomaniak Streaming Vidéo API",
  "defaults": {
    "name": "Infomaniak Streaming Vidéo"
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
          "value": "Misc > stream"
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
          "value": "Option > simulcast"
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
          "value": "Stats > Channel > Connection history"
        },
        {
          "name": "Stats > Channel > Consumption",
          "value": "Stats > Channel > Consumption"
        },
        {
          "name": "Stats > Channel > Export Stats",
          "value": "Stats > Channel > Export stats"
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
          "value": "order"
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
          "value": "GET /1/videos"
        },
        {
          "name": "Create A Channel",
          "value": "POST /1/videos"
        },
        {
          "name": "Return A Channel",
          "value": "GET /1/videos/{channel}"
        },
        {
          "name": "Update A Channel",
          "value": "PUT /1/videos/{channel}"
        },
        {
          "name": "Delete A Channel",
          "value": "DELETE /1/videos/{channel}"
        }
      ],
      "default": "GET /1/videos",
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
            "GET /1/videos"
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
            "POST /1/videos"
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
            "POST /1/videos"
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
            "POST /1/videos"
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
            "GET /1/videos/{channel}"
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
            "GET /1/videos/{channel}"
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
            "PUT /1/videos/{channel}"
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
            "PUT /1/videos/{channel}"
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
            "PUT /1/videos/{channel}"
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
            "PUT /1/videos/{channel}"
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
            "DELETE /1/videos/{channel}"
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
            "DELETE /1/videos/{channel}"
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
          "value": "POST /1/videos/{channel}/encodes"
        }
      ],
      "default": "POST /1/videos/{channel}/encodes",
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
            "POST /1/videos/{channel}/encodes"
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
            "POST /1/videos/{channel}/encodes"
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
            "POST /1/videos/{channel}/encodes"
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
          "value": "GET /1/videos/{channel}/events"
        },
        {
          "name": "Create An Event",
          "value": "POST /1/videos/{channel}/events"
        },
        {
          "name": "Return An Event",
          "value": "GET /1/videos/{channel}/events/{repeatable_planned_event}"
        },
        {
          "name": "Update An Event",
          "value": "PUT /1/videos/{channel}/events/{repeatable_planned_event}"
        },
        {
          "name": "Delete An Event",
          "value": "DELETE /1/videos/{channel}/events/{repeatable_planned_event}"
        }
      ],
      "default": "GET /1/videos/{channel}/events",
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
            "GET /1/videos/{channel}/events"
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
            "GET /1/videos/{channel}/events"
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
            "POST /1/videos/{channel}/events"
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
            "POST /1/videos/{channel}/events"
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
            "POST /1/videos/{channel}/events"
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
            "POST /1/videos/{channel}/events"
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
            "POST /1/videos/{channel}/events"
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
            "POST /1/videos/{channel}/events"
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
            "POST /1/videos/{channel}/events"
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
            "POST /1/videos/{channel}/events"
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
            "POST /1/videos/{channel}/events"
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
            "POST /1/videos/{channel}/events"
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
            "GET /1/videos/{channel}/events/{repeatable_planned_event}"
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
            "GET /1/videos/{channel}/events/{repeatable_planned_event}"
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
            "GET /1/videos/{channel}/events/{repeatable_planned_event}"
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
            "PUT /1/videos/{channel}/events/{repeatable_planned_event}"
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
            "PUT /1/videos/{channel}/events/{repeatable_planned_event}"
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
            "PUT /1/videos/{channel}/events/{repeatable_planned_event}"
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
            "PUT /1/videos/{channel}/events/{repeatable_planned_event}"
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
            "PUT /1/videos/{channel}/events/{repeatable_planned_event}"
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
            "PUT /1/videos/{channel}/events/{repeatable_planned_event}"
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
            "PUT /1/videos/{channel}/events/{repeatable_planned_event}"
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
            "PUT /1/videos/{channel}/events/{repeatable_planned_event}"
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
            "PUT /1/videos/{channel}/events/{repeatable_planned_event}"
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
            "PUT /1/videos/{channel}/events/{repeatable_planned_event}"
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
            "PUT /1/videos/{channel}/events/{repeatable_planned_event}"
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
            "PUT /1/videos/{channel}/events/{repeatable_planned_event}"
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
            "DELETE /1/videos/{channel}/events/{repeatable_planned_event}"
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
            "DELETE /1/videos/{channel}/events/{repeatable_planned_event}"
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
            "DELETE /1/videos/{channel}/events/{repeatable_planned_event}"
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
            "DELETE /1/videos/{channel}/events/{repeatable_planned_event}"
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
          "value": "GET /1/videos/{channel}/integrations"
        }
      ],
      "default": "GET /1/videos/{channel}/integrations",
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
            "GET /1/videos/{channel}/integrations"
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
          "value": "PUT /1/videos/{channel}/live/start"
        },
        {
          "name": "Interrupt The Live",
          "value": "PUT /1/videos/{channel}/live/stop"
        }
      ],
      "default": "PUT /1/videos/{channel}/live/start",
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
            "PUT /1/videos/{channel}/live/start"
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
            "PUT /1/videos/{channel}/live/start"
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
            "PUT /1/videos/{channel}/live/start"
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
            "PUT /1/videos/{channel}/live/stop"
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
            "PUT /1/videos/{channel}/live/stop"
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
            "PUT /1/videos/{channel}/live/stop"
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
          "value": "GET /1/videos/countries"
        },
        {
          "name": "List Timezones",
          "value": "GET /1/videos/timezones"
        }
      ],
      "default": "GET /1/videos/countries",
      "noDataExpression": true
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Misc > stream"
          ]
        }
      },
      "options": [
        {
          "name": "Generate Stream Key",
          "value": "GET /1/videos/password"
        }
      ],
      "default": "GET /1/videos/password",
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
          "value": "GET /1/videos/{channel}/options"
        },
        {
          "name": "Return Option",
          "value": "GET /1/videos/{channel}/options/{video_option}"
        },
        {
          "name": "Undertake Option",
          "value": "PUT /1/videos/{channel}/options/{video_option}/recommit"
        },
        {
          "name": "Terminate Option",
          "value": "DELETE /1/videos/{channel}/options/{video_option}/terminate"
        }
      ],
      "default": "GET /1/videos/{channel}/options",
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
            "GET /1/videos/{channel}/options"
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
            "GET /1/videos/{channel}/options"
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
            "GET /1/videos/{channel}/options/{video_option}"
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
            "GET /1/videos/{channel}/options/{video_option}"
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
            "GET /1/videos/{channel}/options/{video_option}"
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
            "PUT /1/videos/{channel}/options/{video_option}/recommit"
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
            "PUT /1/videos/{channel}/options/{video_option}/recommit"
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
            "DELETE /1/videos/{channel}/options/{video_option}/terminate"
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
            "DELETE /1/videos/{channel}/options/{video_option}/terminate"
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
            "DELETE /1/videos/{channel}/options/{video_option}/terminate"
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
            "DELETE /1/videos/{channel}/options/{video_option}/terminate"
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
          "value": "GET /1/videos/{channel}/options/recording"
        },
        {
          "name": "Create Recording Config",
          "value": "POST /1/videos/{channel}/options/recording"
        },
        {
          "name": "Update Recording Config",
          "value": "PUT /1/videos/{channel}/options/recording"
        }
      ],
      "default": "GET /1/videos/{channel}/options/recording",
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
            "GET /1/videos/{channel}/options/recording"
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
            "GET /1/videos/{channel}/options/recording"
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
            "POST /1/videos/{channel}/options/recording"
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
            "POST /1/videos/{channel}/options/recording"
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
            "PUT /1/videos/{channel}/options/recording"
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
            "PUT /1/videos/{channel}/options/recording"
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
            "PUT /1/videos/{channel}/options/recording"
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
          "value": "POST /1/videos/{channel}/options/recording/instant"
        },
        {
          "name": "Stop A Record",
          "value": "DELETE /1/videos/{channel}/options/recording/instant"
        }
      ],
      "default": "POST /1/videos/{channel}/options/recording/instant",
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
            "POST /1/videos/{channel}/options/recording/instant"
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
            "POST /1/videos/{channel}/options/recording/instant"
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
            "POST /1/videos/{channel}/options/recording/instant"
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
            "POST /1/videos/{channel}/options/recording/instant"
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
            "POST /1/videos/{channel}/options/recording/instant"
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
            "POST /1/videos/{channel}/options/recording/instant"
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
            "POST /1/videos/{channel}/options/recording/instant"
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
            "POST /1/videos/{channel}/options/recording/instant"
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
            "DELETE /1/videos/{channel}/options/recording/instant"
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
            "DELETE /1/videos/{channel}/options/recording/instant"
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
          "value": "GET /1/videos/{channel}/options/recording/storage"
        },
        {
          "name": "Return A Storage Machine",
          "value": "POST /1/videos/{channel}/options/recording/storage"
        },
        {
          "name": "Update A Storage Machine",
          "value": "POST /1/videos/{channel}/options/recording/storage/test"
        },
        {
          "name": "Create A Storage Machine",
          "value": "GET /1/videos/{channel}/options/recording/storage/{storage_machine}"
        },
        {
          "name": "Update A Storage Machine",
          "value": "PUT /1/videos/{channel}/options/recording/storage/{storage_machine}"
        },
        {
          "name": "Update A Storage Machine",
          "value": "DELETE /1/videos/{channel}/options/recording/storage/{storage_machine}"
        }
      ],
      "default": "GET /1/videos/{channel}/options/recording/storage",
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
            "GET /1/videos/{channel}/options/recording/storage"
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
            "GET /1/videos/{channel}/options/recording/storage"
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
            "POST /1/videos/{channel}/options/recording/storage"
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
            "POST /1/videos/{channel}/options/recording/storage"
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
            "POST /1/videos/{channel}/options/recording/storage/test"
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
            "POST /1/videos/{channel}/options/recording/storage/test"
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
            "POST /1/videos/{channel}/options/recording/storage/test"
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
            "POST /1/videos/{channel}/options/recording/storage/test"
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
            "POST /1/videos/{channel}/options/recording/storage/test"
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
            "POST /1/videos/{channel}/options/recording/storage/test"
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
            "GET /1/videos/{channel}/options/recording/storage/{storage_machine}"
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
            "GET /1/videos/{channel}/options/recording/storage/{storage_machine}"
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
            "GET /1/videos/{channel}/options/recording/storage/{storage_machine}"
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
            "PUT /1/videos/{channel}/options/recording/storage/{storage_machine}"
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
            "PUT /1/videos/{channel}/options/recording/storage/{storage_machine}"
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
            "PUT /1/videos/{channel}/options/recording/storage/{storage_machine}"
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
            "DELETE /1/videos/{channel}/options/recording/storage/{storage_machine}"
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
            "DELETE /1/videos/{channel}/options/recording/storage/{storage_machine}"
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
            "DELETE /1/videos/{channel}/options/recording/storage/{storage_machine}"
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
          "value": "GET /1/videos/{channel}/options/timeshift"
        },
        {
          "name": "Create A Timeshift Config.",
          "value": "POST /1/videos/{channel}/options/timeshift"
        },
        {
          "name": "Update A Timeshift Config",
          "value": "PUT /1/videos/{channel}/options/timeshift"
        }
      ],
      "default": "GET /1/videos/{channel}/options/timeshift",
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
            "GET /1/videos/{channel}/options/timeshift"
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
            "GET /1/videos/{channel}/options/timeshift"
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
            "POST /1/videos/{channel}/options/timeshift"
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
            "POST /1/videos/{channel}/options/timeshift"
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
            "PUT /1/videos/{channel}/options/timeshift"
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
            "PUT /1/videos/{channel}/options/timeshift"
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
            "PUT /1/videos/{channel}/options/timeshift"
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
          "value": "GET /1/videos/{channel}/options/watermark"
        },
        {
          "name": "Update Watermark",
          "value": "PUT /1/videos/{channel}/options/watermark"
        },
        {
          "name": "Enabled Watermark",
          "value": "PUT /1/videos/{channel}/options/watermark/enable"
        },
        {
          "name": "Disable Watermark",
          "value": "PUT /1/videos/{channel}/options/watermark/disable"
        }
      ],
      "default": "GET /1/videos/{channel}/options/watermark",
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
            "GET /1/videos/{channel}/options/watermark"
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
            "GET /1/videos/{channel}/options/watermark"
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
            "PUT /1/videos/{channel}/options/watermark"
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
            "PUT /1/videos/{channel}/options/watermark"
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
            "PUT /1/videos/{channel}/options/watermark"
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
            "PUT /1/videos/{channel}/options/watermark"
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
            "PUT /1/videos/{channel}/options/watermark"
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
            "PUT /1/videos/{channel}/options/watermark"
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
            "PUT /1/videos/{channel}/options/watermark"
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
            "PUT /1/videos/{channel}/options/watermark/enable"
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
            "PUT /1/videos/{channel}/options/watermark/enable"
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
            "PUT /1/videos/{channel}/options/watermark/disable"
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
            "PUT /1/videos/{channel}/options/watermark/disable"
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
            "Option > simulcast"
          ]
        }
      },
      "options": [
        {
          "name": "Return Simulcast",
          "value": "POST /1/videos/{channel}/simulcasts/{simulcast_platform}"
        },
        {
          "name": "Lists All Simulcast Config",
          "value": "GET /1/videos/{channel}/simulcasts"
        },
        {
          "name": "Return Simulcast",
          "value": "GET /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}"
        },
        {
          "name": "Return Simulcast",
          "value": "PUT /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}"
        },
        {
          "name": "Delete A Player",
          "value": "DELETE /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}"
        },
        {
          "name": "Disable Simulcast",
          "value": "PUT /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}/enable"
        },
        {
          "name": "Disable Simulcast",
          "value": "PUT /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}/disable"
        }
      ],
      "default": "POST /1/videos/{channel}/simulcasts/{simulcast_platform}",
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
            "Option > simulcast"
          ],
          "operation": [
            "POST /1/videos/{channel}/simulcasts/{simulcast_platform}"
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
            "Option > simulcast"
          ],
          "operation": [
            "POST /1/videos/{channel}/simulcasts/{simulcast_platform}"
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
            "Option > simulcast"
          ],
          "operation": [
            "POST /1/videos/{channel}/simulcasts/{simulcast_platform}"
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
            "Option > simulcast"
          ],
          "operation": [
            "POST /1/videos/{channel}/simulcasts/{simulcast_platform}"
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
            "Option > simulcast"
          ],
          "operation": [
            "POST /1/videos/{channel}/simulcasts/{simulcast_platform}"
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
            "Option > simulcast"
          ],
          "operation": [
            "POST /1/videos/{channel}/simulcasts/{simulcast_platform}"
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
            "Option > simulcast"
          ],
          "operation": [
            "POST /1/videos/{channel}/simulcasts/{simulcast_platform}"
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
            "Option > simulcast"
          ],
          "operation": [
            "POST /1/videos/{channel}/simulcasts/{simulcast_platform}"
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
            "Option > simulcast"
          ],
          "operation": [
            "GET /1/videos/{channel}/simulcasts"
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
            "Option > simulcast"
          ],
          "operation": [
            "GET /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}"
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
            "Option > simulcast"
          ],
          "operation": [
            "GET /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}"
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
            "Option > simulcast"
          ],
          "operation": [
            "GET /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}"
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
            "Option > simulcast"
          ],
          "operation": [
            "PUT /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}"
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
            "Option > simulcast"
          ],
          "operation": [
            "PUT /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}"
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
            "Option > simulcast"
          ],
          "operation": [
            "PUT /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}"
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
            "Option > simulcast"
          ],
          "operation": [
            "PUT /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}"
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
            "Option > simulcast"
          ],
          "operation": [
            "PUT /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}"
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
            "Option > simulcast"
          ],
          "operation": [
            "PUT /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}"
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
            "Option > simulcast"
          ],
          "operation": [
            "PUT /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}"
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
            "Option > simulcast"
          ],
          "operation": [
            "PUT /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}"
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
            "Option > simulcast"
          ],
          "operation": [
            "PUT /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}"
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
            "Option > simulcast"
          ],
          "operation": [
            "DELETE /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}"
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
            "Option > simulcast"
          ],
          "operation": [
            "DELETE /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}"
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
            "Option > simulcast"
          ],
          "operation": [
            "DELETE /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}"
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
            "Option > simulcast"
          ],
          "operation": [
            "DELETE /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}"
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
            "Option > simulcast"
          ],
          "operation": [
            "PUT /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}/enable"
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
            "Option > simulcast"
          ],
          "operation": [
            "PUT /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}/enable"
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
            "Option > simulcast"
          ],
          "operation": [
            "PUT /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}/enable"
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
            "Option > simulcast"
          ],
          "operation": [
            "PUT /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}/enable"
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
            "Option > simulcast"
          ],
          "operation": [
            "PUT /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}/disable"
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
            "Option > simulcast"
          ],
          "operation": [
            "PUT /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}/disable"
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
            "Option > simulcast"
          ],
          "operation": [
            "PUT /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}/disable"
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
            "Option > simulcast"
          ],
          "operation": [
            "PUT /1/videos/{channel}/simulcasts/{simulcast_platform}/{simulcast_config}/disable"
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
          "value": "GET /1/videos/{channel}/players"
        },
        {
          "name": "Create A Player",
          "value": "POST /1/videos/{channel}/players"
        },
        {
          "name": "Return A Player",
          "value": "GET /1/videos/{channel}/players/{player}"
        },
        {
          "name": "Copy A Player",
          "value": "POST /1/videos/{channel}/players/{player}"
        },
        {
          "name": "Update A Player",
          "value": "PUT /1/videos/{channel}/players/{player}"
        },
        {
          "name": "Delete A Player",
          "value": "DELETE /1/videos/{channel}/players/{player}"
        }
      ],
      "default": "GET /1/videos/{channel}/players",
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
            "GET /1/videos/{channel}/players"
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
            "GET /1/videos/{channel}/players"
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
            "GET /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "POST /1/videos/{channel}/players"
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
            "GET /1/videos/{channel}/players/{player}"
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
            "GET /1/videos/{channel}/players/{player}"
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
            "GET /1/videos/{channel}/players/{player}"
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
            "GET /1/videos/{channel}/players/{player}"
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
            "POST /1/videos/{channel}/players/{player}"
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
            "POST /1/videos/{channel}/players/{player}"
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
            "POST /1/videos/{channel}/players/{player}"
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
            "POST /1/videos/{channel}/players/{player}"
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
            "POST /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "PUT /1/videos/{channel}/players/{player}"
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
            "DELETE /1/videos/{channel}/players/{player}"
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
            "DELETE /1/videos/{channel}/players/{player}"
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
            "DELETE /1/videos/{channel}/players/{player}"
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
            "DELETE /1/videos/{channel}/players/{player}"
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
          "value": "GET /1/videos/{channel}/players/{player}/ads"
        },
        {
          "name": "Create An Ads",
          "value": "POST /1/videos/{channel}/players/{player}/ads"
        },
        {
          "name": "Copy An Ads",
          "value": "POST /1/videos/{channel}/players/{player}/ads/duplicate"
        },
        {
          "name": "Return An Ads",
          "value": "GET /1/videos/{channel}/players/{player}/ads/{ads}"
        },
        {
          "name": "Update An Ads",
          "value": "PUT /1/videos/{channel}/players/{player}/ads/{ads}"
        },
        {
          "name": "Delete An Ads",
          "value": "DELETE /1/videos/{channel}/players/{player}/ads/{ads}"
        }
      ],
      "default": "GET /1/videos/{channel}/players/{player}/ads",
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
            "GET /1/videos/{channel}/players/{player}/ads"
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
            "GET /1/videos/{channel}/players/{player}/ads"
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
            "GET /1/videos/{channel}/players/{player}/ads"
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
            "POST /1/videos/{channel}/players/{player}/ads"
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
            "POST /1/videos/{channel}/players/{player}/ads"
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
            "POST /1/videos/{channel}/players/{player}/ads"
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
            "POST /1/videos/{channel}/players/{player}/ads"
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
            "POST /1/videos/{channel}/players/{player}/ads"
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
            "POST /1/videos/{channel}/players/{player}/ads"
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
            "POST /1/videos/{channel}/players/{player}/ads"
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
            "POST /1/videos/{channel}/players/{player}/ads"
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
            "POST /1/videos/{channel}/players/{player}/ads/duplicate"
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
            "POST /1/videos/{channel}/players/{player}/ads/duplicate"
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
            "POST /1/videos/{channel}/players/{player}/ads/duplicate"
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
            "POST /1/videos/{channel}/players/{player}/ads/duplicate"
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
            "POST /1/videos/{channel}/players/{player}/ads/duplicate"
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
            "GET /1/videos/{channel}/players/{player}/ads/{ads}"
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
            "GET /1/videos/{channel}/players/{player}/ads/{ads}"
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
            "GET /1/videos/{channel}/players/{player}/ads/{ads}"
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
            "GET /1/videos/{channel}/players/{player}/ads/{ads}"
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
            "PUT /1/videos/{channel}/players/{player}/ads/{ads}"
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
            "PUT /1/videos/{channel}/players/{player}/ads/{ads}"
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
            "PUT /1/videos/{channel}/players/{player}/ads/{ads}"
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
            "PUT /1/videos/{channel}/players/{player}/ads/{ads}"
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
            "PUT /1/videos/{channel}/players/{player}/ads/{ads}"
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
            "PUT /1/videos/{channel}/players/{player}/ads/{ads}"
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
            "DELETE /1/videos/{channel}/players/{player}/ads/{ads}"
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
            "DELETE /1/videos/{channel}/players/{player}/ads/{ads}"
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
            "DELETE /1/videos/{channel}/players/{player}/ads/{ads}"
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
            "DELETE /1/videos/{channel}/players/{player}/ads/{ads}"
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
            "DELETE /1/videos/{channel}/players/{player}/ads/{ads}"
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
          "value": "GET /1/videos/{channel}/players/{player}/embed"
        },
        {
          "name": "Integration URL",
          "value": "GET /1/videos/{channel}/players/{player}/embed/url"
        }
      ],
      "default": "GET /1/videos/{channel}/players/{player}/embed",
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
            "GET /1/videos/{channel}/players/{player}/embed"
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
            "GET /1/videos/{channel}/players/{player}/embed"
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
            "GET /1/videos/{channel}/players/{player}/embed"
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
            "GET /1/videos/{channel}/players/{player}/embed/url"
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
            "GET /1/videos/{channel}/players/{player}/embed/url"
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
            "GET /1/videos/{channel}/players/{player}/embed/url"
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
          "value": "GET /1/videos/{channel}/players/{player}/thumbnail/{thumbnail}"
        }
      ],
      "default": "GET /1/videos/{channel}/players/{player}/thumbnail/{thumbnail}",
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
            "GET /1/videos/{channel}/players/{player}/thumbnail/{thumbnail}"
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
            "GET /1/videos/{channel}/players/{player}/thumbnail/{thumbnail}"
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
            "GET /1/videos/{channel}/players/{player}/thumbnail/{thumbnail}"
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
            "GET /1/videos/{channel}/players/{player}/thumbnail/{thumbnail}"
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
          "value": "GET /1/videos/shop/prices"
        },
        {
          "name": "Get Description",
          "value": "GET /1/videos/shop/descriptions"
        }
      ],
      "default": "GET /1/videos/shop/prices",
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
          "value": "GET /1/videos/{channel}/restrictions"
        },
        {
          "name": "Update Channels",
          "value": "PUT /1/videos/{channel}/restrictions"
        },
        {
          "name": "Update Restriction Password",
          "value": "PUT /1/videos/{channel}/restrictions/password"
        }
      ],
      "default": "GET /1/videos/{channel}/restrictions",
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
            "GET /1/videos/{channel}/restrictions"
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
            "GET /1/videos/{channel}/restrictions"
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
            "PUT /1/videos/{channel}/restrictions"
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
            "PUT /1/videos/{channel}/restrictions"
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
            "PUT /1/videos/{channel}/restrictions"
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
            "PUT /1/videos/{channel}/restrictions/password"
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
            "PUT /1/videos/{channel}/restrictions/password"
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
            "PUT /1/videos/{channel}/restrictions/password"
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
            "PUT /1/videos/{channel}/restrictions/password"
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
            "Stats > Channel > Connection history"
          ]
        }
      },
      "options": [
        {
          "name": "Return List Of Connection",
          "value": "GET /1/videos/{channel}/history"
        },
        {
          "name": "Return A Channel",
          "value": "GET /1/videos/{channel}/history/{connection_history}"
        }
      ],
      "default": "GET /1/videos/{channel}/history",
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
            "Stats > Channel > Connection history"
          ],
          "operation": [
            "GET /1/videos/{channel}/history"
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
            "Stats > Channel > Connection history"
          ],
          "operation": [
            "GET /1/videos/{channel}/history/{connection_history}"
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
            "Stats > Channel > Connection history"
          ],
          "operation": [
            "GET /1/videos/{channel}/history/{connection_history}"
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
          "value": "GET /1/videos/{channel}/stats/consumption"
        },
        {
          "name": "Consumption Per Resolution",
          "value": "GET /1/videos/{channel}/stats/consumption/resolutions/histogram"
        }
      ],
      "default": "GET /1/videos/{channel}/stats/consumption",
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
            "GET /1/videos/{channel}/stats/consumption"
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
            "GET /1/videos/{channel}/stats/consumption"
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
            "GET /1/videos/{channel}/stats/consumption"
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
            "GET /1/videos/{channel}/stats/consumption"
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
            "GET /1/videos/{channel}/stats/consumption"
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
            "GET /1/videos/{channel}/stats/consumption/resolutions/histogram"
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
            "GET /1/videos/{channel}/stats/consumption/resolutions/histogram"
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
            "GET /1/videos/{channel}/stats/consumption/resolutions/histogram"
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
            "GET /1/videos/{channel}/stats/consumption/resolutions/histogram"
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
            "GET /1/videos/{channel}/stats/consumption/resolutions/histogram"
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
            "Stats > Channel > Export stats"
          ]
        }
      },
      "options": [
        {
          "name": "Return Text/csv",
          "value": "GET /1/videos/{channel}/stats/export_csv/{statistics}"
        }
      ],
      "default": "GET /1/videos/{channel}/stats/export_csv/{statistics}",
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
            "Stats > Channel > Export stats"
          ],
          "operation": [
            "GET /1/videos/{channel}/stats/export_csv/{statistics}"
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
            "Stats > Channel > Export stats"
          ],
          "operation": [
            "GET /1/videos/{channel}/stats/export_csv/{statistics}"
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
            "Stats > Channel > Export stats"
          ],
          "operation": [
            "GET /1/videos/{channel}/stats/export_csv/{statistics}"
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
            "Stats > Channel > Export stats"
          ],
          "operation": [
            "GET /1/videos/{channel}/stats/export_csv/{statistics}"
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
            "Stats > Channel > Export stats"
          ],
          "operation": [
            "GET /1/videos/{channel}/stats/export_csv/{statistics}"
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
          "value": "GET /1/videos/{channel}/stats/geolocation/countries"
        },
        {
          "name": "Clusters",
          "value": "GET /1/videos/{channel}/stats/geolocation/clusters"
        }
      ],
      "default": "GET /1/videos/{channel}/stats/geolocation/countries",
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
            "GET /1/videos/{channel}/stats/geolocation/countries"
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
            "GET /1/videos/{channel}/stats/geolocation/countries"
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
            "GET /1/videos/{channel}/stats/geolocation/countries"
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
            "GET /1/videos/{channel}/stats/geolocation/countries"
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
            "GET /1/videos/{channel}/stats/geolocation/countries"
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
            "GET /1/videos/{channel}/stats/geolocation/clusters"
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
            "GET /1/videos/{channel}/stats/geolocation/clusters"
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
            "GET /1/videos/{channel}/stats/geolocation/clusters"
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
            "GET /1/videos/{channel}/stats/geolocation/clusters"
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
            "GET /1/videos/{channel}/stats/geolocation/clusters"
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
          "value": "GET /1/videos/{channel}/stats/technologies/browsers/shares"
        },
        {
          "name": "Player Share",
          "value": "GET /1/videos/{channel}/stats/technologies/players/shares"
        },
        {
          "name": "OS Share",
          "value": "GET /1/videos/{channel}/stats/technologies/os/shares"
        }
      ],
      "default": "GET /1/videos/{channel}/stats/technologies/browsers/shares",
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
            "GET /1/videos/{channel}/stats/technologies/browsers/shares"
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
            "GET /1/videos/{channel}/stats/technologies/browsers/shares"
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
            "GET /1/videos/{channel}/stats/technologies/browsers/shares"
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
            "GET /1/videos/{channel}/stats/technologies/browsers/shares"
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
            "GET /1/videos/{channel}/stats/technologies/browsers/shares"
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
            "GET /1/videos/{channel}/stats/technologies/players/shares"
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
            "GET /1/videos/{channel}/stats/technologies/players/shares"
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
            "GET /1/videos/{channel}/stats/technologies/players/shares"
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
            "GET /1/videos/{channel}/stats/technologies/players/shares"
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
            "GET /1/videos/{channel}/stats/technologies/players/shares"
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
            "GET /1/videos/{channel}/stats/technologies/os/shares"
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
            "GET /1/videos/{channel}/stats/technologies/os/shares"
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
            "GET /1/videos/{channel}/stats/technologies/os/shares"
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
            "GET /1/videos/{channel}/stats/technologies/os/shares"
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
            "GET /1/videos/{channel}/stats/technologies/os/shares"
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
          "value": "GET /1/videos/{channel}/stats/viewers"
        },
        {
          "name": "Viewers Histogram Share",
          "value": "GET /1/videos/{channel}/stats/viewers/histogram"
        },
        {
          "name": "Viewers Per Resolution Share.",
          "value": "GET /1/videos/{channel}/stats/viewers/resolutions/shares"
        },
        {
          "name": "Viewers Per Resolution Histogram.",
          "value": "GET /1/videos/{channel}/stats/viewers/resolutions/histogram"
        },
        {
          "name": "Unique Viewers.",
          "value": "GET /1/videos/{channel}/stats/viewers/uniques"
        }
      ],
      "default": "GET /1/videos/{channel}/stats/viewers",
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
            "GET /1/videos/{channel}/stats/viewers"
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
            "GET /1/videos/{channel}/stats/viewers"
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
            "GET /1/videos/{channel}/stats/viewers"
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
            "GET /1/videos/{channel}/stats/viewers"
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
            "GET /1/videos/{channel}/stats/viewers"
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
            "GET /1/videos/{channel}/stats/viewers/histogram"
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
            "GET /1/videos/{channel}/stats/viewers/histogram"
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
            "GET /1/videos/{channel}/stats/viewers/histogram"
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
            "GET /1/videos/{channel}/stats/viewers/histogram"
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
            "GET /1/videos/{channel}/stats/viewers/histogram"
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
            "GET /1/videos/{channel}/stats/viewers/resolutions/shares"
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
            "GET /1/videos/{channel}/stats/viewers/resolutions/shares"
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
            "GET /1/videos/{channel}/stats/viewers/resolutions/shares"
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
            "GET /1/videos/{channel}/stats/viewers/resolutions/shares"
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
            "GET /1/videos/{channel}/stats/viewers/resolutions/shares"
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
            "GET /1/videos/{channel}/stats/viewers/resolutions/histogram"
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
            "GET /1/videos/{channel}/stats/viewers/resolutions/histogram"
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
            "GET /1/videos/{channel}/stats/viewers/resolutions/histogram"
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
            "GET /1/videos/{channel}/stats/viewers/resolutions/histogram"
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
            "GET /1/videos/{channel}/stats/viewers/resolutions/histogram"
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
            "GET /1/videos/{channel}/stats/viewers/uniques"
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
            "GET /1/videos/{channel}/stats/viewers/uniques"
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
            "GET /1/videos/{channel}/stats/viewers/uniques"
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
            "GET /1/videos/{channel}/stats/viewers/uniques"
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
            "GET /1/videos/{channel}/stats/viewers/uniques"
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
          "value": "GET /1/videos/{channel}/stats/viewing"
        },
        {
          "name": "Viewing Histogram Par Channel",
          "value": "GET /1/videos/{channel}/stats/viewing/resolutions/histogram"
        }
      ],
      "default": "GET /1/videos/{channel}/stats/viewing",
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
            "GET /1/videos/{channel}/stats/viewing"
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
            "GET /1/videos/{channel}/stats/viewing"
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
            "GET /1/videos/{channel}/stats/viewing"
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
            "GET /1/videos/{channel}/stats/viewing"
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
            "GET /1/videos/{channel}/stats/viewing"
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
            "GET /1/videos/{channel}/stats/viewing/resolutions/histogram"
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
            "GET /1/videos/{channel}/stats/viewing/resolutions/histogram"
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
            "GET /1/videos/{channel}/stats/viewing/resolutions/histogram"
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
            "GET /1/videos/{channel}/stats/viewing/resolutions/histogram"
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
            "GET /1/videos/{channel}/stats/viewing/resolutions/histogram"
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
          "value": "GET /1/videos/stats/consumption"
        },
        {
          "name": "Consumption Per Channel Histogram",
          "value": "GET /1/videos/stats/consumption/channels/histogram"
        }
      ],
      "default": "GET /1/videos/stats/consumption",
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
            "GET /1/videos/stats/consumption"
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
            "GET /1/videos/stats/consumption"
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
            "GET /1/videos/stats/consumption"
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
            "GET /1/videos/stats/consumption/channels/histogram"
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
            "GET /1/videos/stats/consumption/channels/histogram"
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
            "GET /1/videos/stats/consumption/channels/histogram"
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
          "value": "GET /1/videos/stats/geolocation/countries"
        },
        {
          "name": "Clusters",
          "value": "GET /1/videos/stats/geolocation/clusters"
        }
      ],
      "default": "GET /1/videos/stats/geolocation/countries",
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
            "GET /1/videos/stats/geolocation/countries"
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
            "GET /1/videos/stats/geolocation/countries"
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
            "GET /1/videos/stats/geolocation/countries"
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
            "GET /1/videos/stats/geolocation/clusters"
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
            "GET /1/videos/stats/geolocation/clusters"
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
            "GET /1/videos/stats/geolocation/clusters"
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
          "value": "GET /1/videos/stats/viewers"
        },
        {
          "name": "Unique Viewers",
          "value": "GET /1/videos/stats/viewers/uniques"
        },
        {
          "name": "Viewers Histogram",
          "value": "GET /1/videos/stats/viewers/histogram"
        },
        {
          "name": "Viewers Per Channel Histogram",
          "value": "GET /1/videos/stats/viewers/channels/histogram"
        },
        {
          "name": "Viewers Per Channel Share",
          "value": "GET /1/videos/stats/viewers/channels/shares"
        }
      ],
      "default": "GET /1/videos/stats/viewers",
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
            "GET /1/videos/stats/viewers"
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
            "GET /1/videos/stats/viewers"
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
            "GET /1/videos/stats/viewers"
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
            "GET /1/videos/stats/viewers"
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
            "GET /1/videos/stats/viewers/uniques"
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
            "GET /1/videos/stats/viewers/uniques"
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
            "GET /1/videos/stats/viewers/uniques"
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
            "GET /1/videos/stats/viewers/uniques"
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
            "GET /1/videos/stats/viewers/histogram"
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
            "GET /1/videos/stats/viewers/histogram"
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
            "GET /1/videos/stats/viewers/histogram"
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
            "GET /1/videos/stats/viewers/histogram"
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
            "GET /1/videos/stats/viewers/channels/histogram"
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
            "GET /1/videos/stats/viewers/channels/histogram"
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
            "GET /1/videos/stats/viewers/channels/histogram"
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
            "GET /1/videos/stats/viewers/channels/histogram"
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
            "GET /1/videos/stats/viewers/channels/shares"
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
            "GET /1/videos/stats/viewers/channels/shares"
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
            "GET /1/videos/stats/viewers/channels/shares"
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
          "value": "GET /1/videos/stats/viewing"
        },
        {
          "name": "Viewing Histogram Par Channel",
          "value": "GET /1/videos/stats/viewing/channels/histogram"
        }
      ],
      "default": "GET /1/videos/stats/viewing",
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
            "GET /1/videos/stats/viewing"
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
            "GET /1/videos/stats/viewing"
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
            "GET /1/videos/stats/viewing"
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
            "GET /1/videos/stats/viewing"
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
            "GET /1/videos/stats/viewing/channels/histogram"
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
            "GET /1/videos/stats/viewing/channels/histogram"
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
            "GET /1/videos/stats/viewing/channels/histogram"
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
            "GET /1/videos/stats/viewing/channels/histogram"
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
          "value": "GET /1/videos/{channel}/thumbnail"
        }
      ],
      "default": "GET /1/videos/{channel}/thumbnail",
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
            "GET /1/videos/{channel}/thumbnail"
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
            "order"
          ]
        }
      },
      "options": [
        {
          "name": "Returns A Pack Order",
          "value": "GET /1/videos/order/{order}"
        },
        {
          "name": "Returns A Pack Order",
          "value": "GET /1/videos/order"
        },
        {
          "name": "Update A Pack",
          "value": "PUT /1/videos/order"
        }
      ],
      "default": "GET /1/videos/order/{order}",
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
            "order"
          ],
          "operation": [
            "GET /1/videos/order/{order}"
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
            "order"
          ],
          "operation": [
            "GET /1/videos/order/{order}"
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
            "order"
          ],
          "operation": [
            "GET /1/videos/order/{order}"
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
            "order"
          ],
          "operation": [
            "GET /1/videos/order"
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
            "order"
          ],
          "operation": [
            "GET /1/videos/order"
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
            "order"
          ],
          "operation": [
            "GET /1/videos/order"
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
            "order"
          ],
          "operation": [
            "PUT /1/videos/order"
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
            "order"
          ],
          "operation": [
            "PUT /1/videos/order"
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
            "order"
          ],
          "operation": [
            "PUT /1/videos/order"
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
            "GET /1/videos",
            "GET /1/videos/{channel}/players"
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
            "GET /1/videos",
            "GET /1/videos/{channel}/players"
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
