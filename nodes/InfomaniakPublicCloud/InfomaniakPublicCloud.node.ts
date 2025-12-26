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
  "Config": {
    "Get Config": {
      "method": "GET",
      "path": "/1/public_clouds/config",
      "pagination": "none",
      "pathParams": [],
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
  "Database Service": {
    "List All Database Services": {
      "method": "GET",
      "path": "/1/public_clouds/dbaas",
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
    },
    "List Database Services": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/dbaas",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create Database Service": {
      "method": "POST",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/dbaas",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "backup_schedule",
          "field": "body_backup_schedule"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "pack_id",
          "field": "body_pack_id"
        },
        {
          "name": "region",
          "field": "body_region"
        },
        {
          "name": "type",
          "field": "body_type"
        },
        {
          "name": "version",
          "field": "body_version"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Get Database Service": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/dbaas/{dbaas_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "dbaas_id",
          "field": "path_dbaas_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update Database Service": {
      "method": "PATCH",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/dbaas/{dbaas_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "dbaas_id",
          "field": "path_dbaas_id"
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
          "name": "pack_id",
          "field": "body_pack_id"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete Database Service": {
      "method": "DELETE",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/dbaas/{dbaas_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "dbaas_id",
          "field": "path_dbaas_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "keep_backup_files",
          "field": "body_keep_backup_files"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Reset Password": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/dbaas/{dbaas_id}/reset_password",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "dbaas_id",
          "field": "path_dbaas_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Database Service > Backups": {
    "List Backups": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/dbaas/{dbaas_id}/backups",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "dbaas_id",
          "field": "path_dbaas_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Get Backup": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/dbaas/{dbaas_id}/backups/{backup_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "dbaas_id",
          "field": "path_dbaas_id"
        },
        {
          "name": "backup_id",
          "field": "path_backup_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Delete Backup": {
      "method": "DELETE",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/dbaas/{dbaas_id}/backups/{backup_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "dbaas_id",
          "field": "path_dbaas_id"
        },
        {
          "name": "backup_id",
          "field": "path_backup_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Database Service > Backups > Scheduled": {
    "List Backup Schedules": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/dbaas/{dbaas_id}/backup_schedules",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "dbaas_id",
          "field": "path_dbaas_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create Backup Schedule": {
      "method": "POST",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/dbaas/{dbaas_id}/backup_schedules",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "dbaas_id",
          "field": "path_dbaas_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "is_pitr_enabled",
          "field": "body_is_pitr_enabled"
        },
        {
          "name": "retention",
          "field": "body_retention"
        },
        {
          "name": "scheduled_at",
          "field": "body_scheduled_at"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Get Backup Schedule": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/dbaas/{dbaas_id}/backup_schedules/{backup_schedule_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "dbaas_id",
          "field": "path_dbaas_id"
        },
        {
          "name": "backup_schedule_id",
          "field": "path_backup_schedule_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update Backup Schedule": {
      "method": "PATCH",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/dbaas/{dbaas_id}/backup_schedules/{backup_schedule_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "dbaas_id",
          "field": "path_dbaas_id"
        },
        {
          "name": "backup_schedule_id",
          "field": "path_backup_schedule_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "is_pitr_enabled",
          "field": "body_is_pitr_enabled"
        },
        {
          "name": "retention",
          "field": "body_retention"
        },
        {
          "name": "scheduled_at",
          "field": "body_scheduled_at"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete Backup Schedule": {
      "method": "DELETE",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/dbaas/{dbaas_id}/backup_schedules/{backup_schedule_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "dbaas_id",
          "field": "path_dbaas_id"
        },
        {
          "name": "backup_schedule_id",
          "field": "path_backup_schedule_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Database Service > Configurations": {
    "Get Configuration Information": {
      "method": "GET",
      "path": "/1/public_clouds/dbaas/configurations",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "List Configuration": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/dbaas/{dbaas_id}/configurations",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "dbaas_id",
          "field": "path_dbaas_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create/Update Configuration": {
      "method": "PUT",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/dbaas/{dbaas_id}/configurations",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "dbaas_id",
          "field": "path_dbaas_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "auto_increment_increment",
          "field": "body_auto_increment_increment"
        },
        {
          "name": "auto_increment_offset",
          "field": "body_auto_increment_offset"
        },
        {
          "name": "character_set_server",
          "field": "body_character_set_server"
        },
        {
          "name": "connect_timeout",
          "field": "body_connect_timeout"
        },
        {
          "name": "group_concat_max_len",
          "field": "body_group_concat_max_len"
        },
        {
          "name": "information_schema_stats_expiry",
          "field": "body_information_schema_stats_expiry"
        },
        {
          "name": "innodb_change_buffer_max_size",
          "field": "body_innodb_change_buffer_max_size"
        },
        {
          "name": "innodb_flush_neighbors",
          "field": "body_innodb_flush_neighbors"
        },
        {
          "name": "innodb_ft_max_token_size",
          "field": "body_innodb_ft_max_token_size"
        },
        {
          "name": "innodb_ft_min_token_size",
          "field": "body_innodb_ft_min_token_size"
        },
        {
          "name": "innodb_ft_server_stopword_table",
          "field": "body_innodb_ft_server_stopword_table"
        },
        {
          "name": "innodb_lock_wait_timeout",
          "field": "body_innodb_lock_wait_timeout"
        },
        {
          "name": "innodb_log_buffer_size",
          "field": "body_innodb_log_buffer_size"
        },
        {
          "name": "innodb_online_alter_log_max_size",
          "field": "body_innodb_online_alter_log_max_size"
        },
        {
          "name": "innodb_print_all_deadlocks",
          "field": "body_innodb_print_all_deadlocks"
        },
        {
          "name": "innodb_read_io_threads",
          "field": "body_innodb_read_io_threads"
        },
        {
          "name": "innodb_rollback_on_timeout",
          "field": "body_innodb_rollback_on_timeout"
        },
        {
          "name": "innodb_stats_persistent_sample_pages",
          "field": "body_innodb_stats_persistent_sample_pages"
        },
        {
          "name": "innodb_thread_concurrency",
          "field": "body_innodb_thread_concurrency"
        },
        {
          "name": "innodb_write_io_threads",
          "field": "body_innodb_write_io_threads"
        },
        {
          "name": "interactive_timeout",
          "field": "body_interactive_timeout"
        },
        {
          "name": "lock_wait_timeout",
          "field": "body_lock_wait_timeout"
        },
        {
          "name": "log_bin_trust_function_creators",
          "field": "body_log_bin_trust_function_creators"
        },
        {
          "name": "long_query_time",
          "field": "body_long_query_time"
        },
        {
          "name": "max_allowed_packet",
          "field": "body_max_allowed_packet"
        },
        {
          "name": "max_connections",
          "field": "body_max_connections"
        },
        {
          "name": "max_digest_length",
          "field": "body_max_digest_length"
        },
        {
          "name": "max_heap_table_size",
          "field": "body_max_heap_table_size"
        },
        {
          "name": "max_prepared_stmt_count",
          "field": "body_max_prepared_stmt_count"
        },
        {
          "name": "min_examined_row_limit",
          "field": "body_min_examined_row_limit"
        },
        {
          "name": "net_buffer_length",
          "field": "body_net_buffer_length"
        },
        {
          "name": "net_read_timeout",
          "field": "body_net_read_timeout"
        },
        {
          "name": "net_write_timeout",
          "field": "body_net_write_timeout"
        },
        {
          "name": "performance_schema_max_digest_length",
          "field": "body_performance_schema_max_digest_length"
        },
        {
          "name": "require_secure_transport",
          "field": "body_require_secure_transport"
        },
        {
          "name": "sort_buffer_size",
          "field": "body_sort_buffer_size"
        },
        {
          "name": "sql_mode",
          "field": "body_sql_mode"
        },
        {
          "name": "table_definition_cache",
          "field": "body_table_definition_cache"
        },
        {
          "name": "table_open_cache",
          "field": "body_table_open_cache"
        },
        {
          "name": "table_open_cache_instances",
          "field": "body_table_open_cache_instances"
        },
        {
          "name": "thread_stack",
          "field": "body_thread_stack"
        },
        {
          "name": "transaction_isolation",
          "field": "body_transaction_isolation"
        },
        {
          "name": "wait_timeout",
          "field": "body_wait_timeout"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Remove Configuration": {
      "method": "DELETE",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/dbaas/{dbaas_id}/configurations",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "dbaas_id",
          "field": "path_dbaas_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Database Service > Data": {
    "List Regions": {
      "method": "GET",
      "path": "/1/public_clouds/dbaas/regions",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "List Packs": {
      "method": "GET",
      "path": "/1/public_clouds/dbaas/packs",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Pack Filters": {
      "method": "GET",
      "path": "/1/public_clouds/dbaas/packs/filters",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "List Types": {
      "method": "GET",
      "path": "/1/public_clouds/dbaas/types",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Database Service > IP Filters": {
    "List IP Filters": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/dbaas/{dbaas_id}/ip_filters",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "dbaas_id",
          "field": "path_dbaas_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create/Update IP Filters": {
      "method": "PUT",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/dbaas/{dbaas_id}/ip_filters",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "dbaas_id",
          "field": "path_dbaas_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "ip_filters",
          "field": "body_ip_filters"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Remove IP Filters": {
      "method": "DELETE",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/dbaas/{dbaas_id}/ip_filters",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "dbaas_id",
          "field": "path_dbaas_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Database Service > Restores": {
    "Get Restore": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/dbaas/{dbaas_id}/restores/{restore_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "dbaas_id",
          "field": "path_dbaas_id"
        },
        {
          "name": "restore_id",
          "field": "path_restore_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create Restore": {
      "method": "POST",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/dbaas/{dbaas_id}/restores",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "dbaas_id",
          "field": "path_dbaas_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "backup_id",
          "field": "body_backup_id"
        },
        {
          "name": "new_service",
          "field": "body_new_service"
        },
        {
          "name": "pitr_restore_date",
          "field": "body_pitr_restore_date"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Kubernetes Service": {
    "List All Kubernetes Services": {
      "method": "GET",
      "path": "/1/public_clouds/kaas",
      "pagination": "limit-skip",
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
    },
    "List Kubernetes Services": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/kaas",
      "pagination": "limit-skip",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create Kubernetes Service": {
      "method": "POST",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/kaas",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "kaas_pack_id",
          "field": "body_kaas_pack_id"
        },
        {
          "name": "kubernetes_version",
          "field": "body_kubernetes_version"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "region",
          "field": "body_region"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Get Kubernetes Service": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/kaas/{kaas_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "kaas_id",
          "field": "path_kaas_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update Kubernetes Service": {
      "method": "PATCH",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/kaas/{kaas_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "kaas_id",
          "field": "path_kaas_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "kubernetes_version",
          "field": "body_kubernetes_version"
        },
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete Kubernetes Service": {
      "method": "DELETE",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/kaas/{kaas_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "kaas_id",
          "field": "path_kaas_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Get The Current State Of A Kaas Apiserver Params": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/kaas/{kaas_id}/apiserver",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "kaas_id",
          "field": "path_kaas_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Patch Apiserver Params Of A Specific Kaas": {
      "method": "PATCH",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/kaas/{kaas_id}/apiserver",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "kaas_id",
          "field": "path_kaas_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "apiserver_params",
          "field": "body_apiserver_params"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Download Kubernetes Service Configuration": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/kaas/{kaas_id}/kube_config",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "kaas_id",
          "field": "path_kaas_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Kubernetes Service > Data": {
    "List Packs": {
      "method": "GET",
      "path": "/1/public_clouds/kaas/packs",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "List Kubernetes Versions": {
      "method": "GET",
      "path": "/1/public_clouds/kaas/versions",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "List Regions": {
      "method": "GET",
      "path": "/1/public_clouds/kaas/regions",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "List Availability Zones": {
      "method": "GET",
      "path": "/1/public_clouds/kaas/availability_zones",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [
        {
          "name": "region",
          "field": "query_region"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "List Flavors": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/kaas/flavors",
      "pagination": "page-per-page",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        }
      ],
      "queryParams": [
        {
          "name": "region",
          "field": "query_region"
        }
      ],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "List Flavor Filters": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/kaas/flavors/filters",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        }
      ],
      "queryParams": [
        {
          "name": "region",
          "field": "query_region"
        }
      ],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Kubernetes Service > IP Filtering": {
    "List IP Filters": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/kaas/{kaas_id}/ip_filters",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "kaas_id",
          "field": "path_kaas_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create/Update IP Filters": {
      "method": "PUT",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/kaas/{kaas_id}/ip_filters",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "kaas_id",
          "field": "path_kaas_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "ip_filters",
          "field": "body_ip_filters"
        }
      ],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Remove IP Filters": {
      "method": "DELETE",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/kaas/{kaas_id}/ip_filters",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "kaas_id",
          "field": "path_kaas_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Kubernetes Service > Instance Pools": {
    "List Instance Pools": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/kaas/{kaas_id}/instance_pools",
      "pagination": "limit-skip",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "kaas_id",
          "field": "path_kaas_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create Instance Pool": {
      "method": "POST",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/kaas/{kaas_id}/instance_pools",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "kaas_id",
          "field": "path_kaas_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "availability_zone",
          "field": "body_availability_zone"
        },
        {
          "name": "flavor",
          "field": "body_flavor"
        },
        {
          "name": "labels",
          "field": "body_labels"
        },
        {
          "name": "maximum_instances",
          "field": "body_maximum_instances"
        },
        {
          "name": "minimum_instances",
          "field": "body_minimum_instances"
        },
        {
          "name": "name",
          "field": "body_name"
        },
        {
          "name": "prefix",
          "field": "body_prefix"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Get Instance Pool": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/kaas/{kaas_id}/instance_pools/{kaas_worker_pool_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "kaas_id",
          "field": "path_kaas_id"
        },
        {
          "name": "kaas_worker_pool_id",
          "field": "path_kaas_worker_pool_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update Instance Pool": {
      "method": "PATCH",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/kaas/{kaas_id}/instance_pools/{kaas_worker_pool_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "kaas_id",
          "field": "path_kaas_id"
        },
        {
          "name": "kaas_worker_pool_id",
          "field": "path_kaas_worker_pool_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "labels",
          "field": "body_labels"
        },
        {
          "name": "maximum_instances",
          "field": "body_maximum_instances"
        },
        {
          "name": "minimum_instances",
          "field": "body_minimum_instances"
        },
        {
          "name": "name",
          "field": "body_name"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete Instance Pool": {
      "method": "DELETE",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/kaas/{kaas_id}/instance_pools/{kaas_worker_pool_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "kaas_id",
          "field": "path_kaas_id"
        },
        {
          "name": "kaas_worker_pool_id",
          "field": "path_kaas_worker_pool_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Product Management": {
    "List All Public Clouds": {
      "method": "GET",
      "path": "/1/public_clouds",
      "pagination": "limit-skip",
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
    },
    "Accesses": {
      "method": "GET",
      "path": "/1/public_clouds/accesses",
      "pagination": "none",
      "pathParams": [],
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
    "Get Public Cloud Info": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update A Public Cloud": {
      "method": "PATCH",
      "path": "/1/public_clouds/{public_cloud_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
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
    }
  },
  "Projects": {
    "List Projects": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}/projects",
      "pagination": "limit-skip",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create Project": {
      "method": "POST",
      "path": "/1/public_clouds/{public_cloud_id}/projects",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "project_name",
          "field": "body_project_name"
        },
        {
          "name": "user_description",
          "field": "body_user_description"
        },
        {
          "name": "user_email",
          "field": "body_user_email"
        },
        {
          "name": "user_password",
          "field": "body_user_password"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Get Project Details": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update Project": {
      "method": "PATCH",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
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
    "Delete Project": {
      "method": "DELETE",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create Project With Invitation": {
      "method": "POST",
      "path": "/1/public_clouds/{public_cloud_id}/projects/invite",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "project_name",
          "field": "body_project_name"
        },
        {
          "name": "user_description",
          "field": "body_user_description"
        },
        {
          "name": "user_email",
          "field": "body_user_email"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Users": {
    "List Users": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/users",
      "pagination": "limit-skip",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
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
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/users",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
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
          "name": "password",
          "field": "body_password"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Get User": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/users/{public_cloud_user_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "public_cloud_user_id",
          "field": "path_public_cloud_user_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Update User": {
      "method": "PATCH",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/users/{public_cloud_user_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "public_cloud_user_id",
          "field": "path_public_cloud_user_id"
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
          "name": "email",
          "field": "body_email"
        },
        {
          "name": "password",
          "field": "body_password"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Delete User": {
      "method": "DELETE",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/users/{public_cloud_user_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "public_cloud_user_id",
          "field": "path_public_cloud_user_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Get Authentication File": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/users/{public_cloud_user_id}/authentication/{type}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "public_cloud_user_id",
          "field": "path_public_cloud_user_id"
        },
        {
          "name": "type",
          "field": "path_type"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Get Authentication File (2)": {
      "method": "GET",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/users/{public_cloud_user_id}/openrc",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "public_cloud_user_id",
          "field": "path_public_cloud_user_id"
        },
        {
          "name": "type",
          "field": "path_type"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create User Invitation": {
      "method": "POST",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/users/invite",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
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
          "name": "email",
          "field": "body_email"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Update User With Invitation": {
      "method": "POST",
      "path": "/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/users/{public_cloud_user_id}/invite",
      "pagination": "none",
      "pathParams": [
        {
          "name": "public_cloud_id",
          "field": "path_public_cloud_id"
        },
        {
          "name": "public_cloud_project_id",
          "field": "path_public_cloud_project_id"
        },
        {
          "name": "public_cloud_user_id",
          "field": "path_public_cloud_user_id"
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
          "name": "email",
          "field": "body_email"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  }
};

export class InfomaniakPublicCloud implements INodeType {
	description: INodeTypeDescription = {
  "displayName": "Infomaniak Public Cloud",
  "name": "infomaniakPublicCloud",
  "icon": "file:../../icons/public-cloud.svg",
  "group": [
    "output"
  ],
  "version": 1,
  "description": "Interact with Infomaniak Public Cloud API",
  "defaults": {
    "name": "Infomaniak Public Cloud"
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
          "name": "Config",
          "value": "Config"
        },
        {
          "name": "Database Service",
          "value": "Database Service"
        },
        {
          "name": "Database Service > Backups",
          "value": "Database Service > Backups"
        },
        {
          "name": "Database Service > Backups > Scheduled",
          "value": "Database Service > Backups > Scheduled"
        },
        {
          "name": "Database Service > Configurations",
          "value": "Database Service > Configurations"
        },
        {
          "name": "Database Service > Data",
          "value": "Database Service > Data"
        },
        {
          "name": "Database Service > IP Filters",
          "value": "Database Service > IP Filters"
        },
        {
          "name": "Database Service > Restores",
          "value": "Database Service > Restores"
        },
        {
          "name": "Kubernetes Service",
          "value": "Kubernetes Service"
        },
        {
          "name": "Kubernetes Service > Data",
          "value": "Kubernetes Service > Data"
        },
        {
          "name": "Kubernetes Service > IP Filtering",
          "value": "Kubernetes Service > IP Filtering"
        },
        {
          "name": "Kubernetes Service > Instance Pools",
          "value": "Kubernetes Service > Instance Pools"
        },
        {
          "name": "Product Management",
          "value": "Product Management"
        },
        {
          "name": "Projects",
          "value": "Projects"
        },
        {
          "name": "Users",
          "value": "Users"
        }
      ],
      "default": "Config",
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
            "Config"
          ]
        }
      },
      "options": [
        {
          "name": "Get Config",
          "value": "Get Config"
        }
      ],
      "default": "Get Config",
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
            "Config"
          ],
          "operation": [
            "Get Config"
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
            "Database Service"
          ]
        }
      },
      "options": [
        {
          "name": "List All Database Services",
          "value": "List All Database Services"
        },
        {
          "name": "List Database Services",
          "value": "List Database Services"
        },
        {
          "name": "Create Database Service",
          "value": "Create Database Service"
        },
        {
          "name": "Get Database Service",
          "value": "Get Database Service"
        },
        {
          "name": "Update Database Service",
          "value": "Update Database Service"
        },
        {
          "name": "Delete Database Service",
          "value": "Delete Database Service"
        },
        {
          "name": "Reset Password",
          "value": "Reset Password"
        }
      ],
      "default": "List All Database Services",
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
            "Database Service"
          ],
          "operation": [
            "List All Database Services"
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
            "Database Service"
          ],
          "operation": [
            "List All Database Services"
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
          "displayName": "Public Cloud Id",
          "name": "query_public_cloud_id",
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
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service"
          ],
          "operation": [
            "List Database Services"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service"
          ],
          "operation": [
            "List Database Services"
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
            "Database Service"
          ],
          "operation": [
            "List Database Services"
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
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service"
          ],
          "operation": [
            "Create Database Service"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service"
          ],
          "operation": [
            "Create Database Service"
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
            "Database Service"
          ],
          "operation": [
            "Create Database Service"
          ]
        }
      },
      "required": true,
      "description": "Database Service Name"
    },
    {
      "displayName": "Pack Id",
      "name": "body_pack_id",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service"
          ],
          "operation": [
            "Create Database Service"
          ]
        }
      },
      "required": true,
      "description": "Database Service Pack Identifier",
      "options": [
        {
          "name": "1",
          "value": "1"
        }
      ]
    },
    {
      "displayName": "Region",
      "name": "body_region",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service"
          ],
          "operation": [
            "Create Database Service"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Region",
      "options": [
        {
          "name": "dc4-a",
          "value": "dc4-a"
        }
      ]
    },
    {
      "displayName": "Type",
      "name": "body_type",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service"
          ],
          "operation": [
            "Create Database Service"
          ]
        }
      },
      "required": true,
      "description": "Type of the resource `{name}`",
      "options": [
        {
          "name": "mysql",
          "value": "mysql"
        }
      ]
    },
    {
      "displayName": "Version",
      "name": "body_version",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service"
          ],
          "operation": [
            "Create Database Service"
          ]
        }
      },
      "required": true,
      "description": "Database Version",
      "options": [
        {
          "name": "8.0.42",
          "value": "8.0.42"
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
            "Database Service"
          ],
          "operation": [
            "Create Database Service"
          ]
        }
      },
      "options": [
        {
          "displayName": "Backup Schedule",
          "name": "body_backup_schedule",
          "type": "json",
          "default": {},
          "description": "Backup schedule settings"
        }
      ]
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service"
          ],
          "operation": [
            "Get Database Service"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service"
          ],
          "operation": [
            "Get Database Service"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Dbaas Id",
      "name": "path_dbaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service"
          ],
          "operation": [
            "Get Database Service"
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
            "Database Service"
          ],
          "operation": [
            "Get Database Service"
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
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service"
          ],
          "operation": [
            "Update Database Service"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service"
          ],
          "operation": [
            "Update Database Service"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Dbaas Id",
      "name": "path_dbaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service"
          ],
          "operation": [
            "Update Database Service"
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
            "Database Service"
          ],
          "operation": [
            "Update Database Service"
          ]
        }
      },
      "options": [
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "Name to use for your Database Service"
        },
        {
          "displayName": "Pack Id",
          "name": "body_pack_id",
          "type": "options",
          "default": "",
          "description": "Database Service Pack Identifier",
          "options": [
            {
              "name": "1",
              "value": "1"
            }
          ]
        }
      ]
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service"
          ],
          "operation": [
            "Delete Database Service"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service"
          ],
          "operation": [
            "Delete Database Service"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Dbaas Id",
      "name": "path_dbaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service"
          ],
          "operation": [
            "Delete Database Service"
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
            "Database Service"
          ],
          "operation": [
            "Delete Database Service"
          ]
        }
      },
      "options": [
        {
          "displayName": "Keep Backup Files",
          "name": "body_keep_backup_files",
          "type": "boolean",
          "default": false,
          "description": "Should the database backup files be kept and not deleted"
        }
      ]
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service"
          ],
          "operation": [
            "Reset Password"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service"
          ],
          "operation": [
            "Reset Password"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Dbaas Id",
      "name": "path_dbaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service"
          ],
          "operation": [
            "Reset Password"
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
            "Database Service > Backups"
          ]
        }
      },
      "options": [
        {
          "name": "List Backups",
          "value": "List Backups"
        },
        {
          "name": "Get Backup",
          "value": "Get Backup"
        },
        {
          "name": "Delete Backup",
          "value": "Delete Backup"
        }
      ],
      "default": "List Backups",
      "noDataExpression": true
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups"
          ],
          "operation": [
            "List Backups"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups"
          ],
          "operation": [
            "List Backups"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Dbaas Id",
      "name": "path_dbaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups"
          ],
          "operation": [
            "List Backups"
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
            "Database Service > Backups"
          ],
          "operation": [
            "List Backups"
          ]
        }
      },
      "options": [
        {
          "displayName": "Filter",
          "name": "query_filter",
          "type": "json",
          "default": {}
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
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups"
          ],
          "operation": [
            "Get Backup"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups"
          ],
          "operation": [
            "Get Backup"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Dbaas Id",
      "name": "path_dbaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups"
          ],
          "operation": [
            "Get Backup"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Backup Id",
      "name": "path_backup_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups"
          ],
          "operation": [
            "Get Backup"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups"
          ],
          "operation": [
            "Delete Backup"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups"
          ],
          "operation": [
            "Delete Backup"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Dbaas Id",
      "name": "path_dbaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups"
          ],
          "operation": [
            "Delete Backup"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Backup Id",
      "name": "path_backup_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups"
          ],
          "operation": [
            "Delete Backup"
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
            "Database Service > Backups > Scheduled"
          ]
        }
      },
      "options": [
        {
          "name": "List Backup Schedules",
          "value": "List Backup Schedules"
        },
        {
          "name": "Create Backup Schedule",
          "value": "Create Backup Schedule"
        },
        {
          "name": "Get Backup Schedule",
          "value": "Get Backup Schedule"
        },
        {
          "name": "Update Backup Schedule",
          "value": "Update Backup Schedule"
        },
        {
          "name": "Delete Backup Schedule",
          "value": "Delete Backup Schedule"
        }
      ],
      "default": "List Backup Schedules",
      "noDataExpression": true
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups > Scheduled"
          ],
          "operation": [
            "List Backup Schedules"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups > Scheduled"
          ],
          "operation": [
            "List Backup Schedules"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Dbaas Id",
      "name": "path_dbaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups > Scheduled"
          ],
          "operation": [
            "List Backup Schedules"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups > Scheduled"
          ],
          "operation": [
            "Create Backup Schedule"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups > Scheduled"
          ],
          "operation": [
            "Create Backup Schedule"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Dbaas Id",
      "name": "path_dbaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups > Scheduled"
          ],
          "operation": [
            "Create Backup Schedule"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Scheduled At",
      "name": "body_scheduled_at",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups > Scheduled"
          ],
          "operation": [
            "Create Backup Schedule"
          ]
        }
      },
      "required": true,
      "description": "Use the given time as the time to create the scheduled backup (24 hour, UTC)"
    },
    {
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups > Scheduled"
          ],
          "operation": [
            "Create Backup Schedule"
          ]
        }
      },
      "options": [
        {
          "displayName": "Is Pitr Enabled",
          "name": "body_is_pitr_enabled",
          "type": "boolean",
          "default": false,
          "description": "Enable/Disable point in time recovery"
        },
        {
          "displayName": "Retention",
          "name": "body_retention",
          "type": "number",
          "default": 0,
          "description": "The number of backups to keep for the schedule"
        }
      ]
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups > Scheduled"
          ],
          "operation": [
            "Get Backup Schedule"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups > Scheduled"
          ],
          "operation": [
            "Get Backup Schedule"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Dbaas Id",
      "name": "path_dbaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups > Scheduled"
          ],
          "operation": [
            "Get Backup Schedule"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Backup Schedule Id",
      "name": "path_backup_schedule_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups > Scheduled"
          ],
          "operation": [
            "Get Backup Schedule"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups > Scheduled"
          ],
          "operation": [
            "Update Backup Schedule"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups > Scheduled"
          ],
          "operation": [
            "Update Backup Schedule"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Dbaas Id",
      "name": "path_dbaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups > Scheduled"
          ],
          "operation": [
            "Update Backup Schedule"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Backup Schedule Id",
      "name": "path_backup_schedule_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups > Scheduled"
          ],
          "operation": [
            "Update Backup Schedule"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Scheduled At",
      "name": "body_scheduled_at",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups > Scheduled"
          ],
          "operation": [
            "Update Backup Schedule"
          ]
        }
      },
      "required": true,
      "description": "Use the given time as the time to create the scheduled backup (24 hour, UTC)"
    },
    {
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups > Scheduled"
          ],
          "operation": [
            "Update Backup Schedule"
          ]
        }
      },
      "options": [
        {
          "displayName": "Is Pitr Enabled",
          "name": "body_is_pitr_enabled",
          "type": "boolean",
          "default": false,
          "description": "Enable/Disable point in time recovery"
        },
        {
          "displayName": "Retention",
          "name": "body_retention",
          "type": "number",
          "default": 0,
          "description": "The number of backups to keep for the schedule"
        }
      ]
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups > Scheduled"
          ],
          "operation": [
            "Delete Backup Schedule"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups > Scheduled"
          ],
          "operation": [
            "Delete Backup Schedule"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Dbaas Id",
      "name": "path_dbaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups > Scheduled"
          ],
          "operation": [
            "Delete Backup Schedule"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Backup Schedule Id",
      "name": "path_backup_schedule_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Backups > Scheduled"
          ],
          "operation": [
            "Delete Backup Schedule"
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
            "Database Service > Configurations"
          ]
        }
      },
      "options": [
        {
          "name": "Get Configuration Information",
          "value": "Get Configuration Information"
        },
        {
          "name": "List Configuration",
          "value": "List Configuration"
        },
        {
          "name": "Create/Update Configuration",
          "value": "Create/Update Configuration"
        },
        {
          "name": "Remove Configuration",
          "value": "Remove Configuration"
        }
      ],
      "default": "Get Configuration Information",
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
            "Database Service > Configurations"
          ],
          "operation": [
            "Get Configuration Information"
          ]
        }
      },
      "options": [
        {
          "displayName": "Filter",
          "name": "query_filter",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Configurations"
          ],
          "operation": [
            "List Configuration"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Configurations"
          ],
          "operation": [
            "List Configuration"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Dbaas Id",
      "name": "path_dbaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Configurations"
          ],
          "operation": [
            "List Configuration"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Configurations"
          ],
          "operation": [
            "Create/Update Configuration"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Configurations"
          ],
          "operation": [
            "Create/Update Configuration"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Dbaas Id",
      "name": "path_dbaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Configurations"
          ],
          "operation": [
            "Create/Update Configuration"
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
            "Database Service > Configurations"
          ],
          "operation": [
            "Create/Update Configuration"
          ]
        }
      },
      "options": [
        {
          "displayName": "Auto Increment Increment",
          "name": "body_auto_increment_increment",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Auto Increment Offset",
          "name": "body_auto_increment_offset",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Character Set Server",
          "name": "body_character_set_server",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Connect Timeout",
          "name": "body_connect_timeout",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Group Concat Max Len",
          "name": "body_group_concat_max_len",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Information Schema Stats Expiry",
          "name": "body_information_schema_stats_expiry",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Innodb Change Buffer Max Size",
          "name": "body_innodb_change_buffer_max_size",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Innodb Flush Neighbors",
          "name": "body_innodb_flush_neighbors",
          "type": "options",
          "default": "",
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
          "displayName": "Innodb Ft Max Token Size",
          "name": "body_innodb_ft_max_token_size",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Innodb Ft Min Token Size",
          "name": "body_innodb_ft_min_token_size",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Innodb Ft Server Stopword Table",
          "name": "body_innodb_ft_server_stopword_table",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "Innodb Lock Wait Timeout",
          "name": "body_innodb_lock_wait_timeout",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Innodb Log Buffer Size",
          "name": "body_innodb_log_buffer_size",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Innodb Online Alter Log Max Size",
          "name": "body_innodb_online_alter_log_max_size",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Innodb Print All Deadlocks",
          "name": "body_innodb_print_all_deadlocks",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "OFF",
              "value": "OFF"
            },
            {
              "name": "ON",
              "value": "ON"
            }
          ]
        },
        {
          "displayName": "Innodb Read Io Threads",
          "name": "body_innodb_read_io_threads",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Innodb Rollback On Timeout",
          "name": "body_innodb_rollback_on_timeout",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "OFF",
              "value": "OFF"
            },
            {
              "name": "ON",
              "value": "ON"
            }
          ]
        },
        {
          "displayName": "Innodb Stats Persistent Sample Pages",
          "name": "body_innodb_stats_persistent_sample_pages",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Innodb Thread Concurrency",
          "name": "body_innodb_thread_concurrency",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Innodb Write Io Threads",
          "name": "body_innodb_write_io_threads",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Interactive Timeout",
          "name": "body_interactive_timeout",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Lock Wait Timeout",
          "name": "body_lock_wait_timeout",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Log Bin Trust Function Creators",
          "name": "body_log_bin_trust_function_creators",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "OFF",
              "value": "OFF"
            },
            {
              "name": "ON",
              "value": "ON"
            }
          ]
        },
        {
          "displayName": "Long Query Time",
          "name": "body_long_query_time",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Max Allowed Packet",
          "name": "body_max_allowed_packet",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Max Connections",
          "name": "body_max_connections",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Max Digest Length",
          "name": "body_max_digest_length",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Max Heap Table Size",
          "name": "body_max_heap_table_size",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Max Prepared Stmt Count",
          "name": "body_max_prepared_stmt_count",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Min Examined Row Limit",
          "name": "body_min_examined_row_limit",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Net Buffer Length",
          "name": "body_net_buffer_length",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Net Read Timeout",
          "name": "body_net_read_timeout",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Net Write Timeout",
          "name": "body_net_write_timeout",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Performance Schema Max Digest Length",
          "name": "body_performance_schema_max_digest_length",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Require Secure Transport",
          "name": "body_require_secure_transport",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "OFF",
              "value": "OFF"
            },
            {
              "name": "ON",
              "value": "ON"
            }
          ]
        },
        {
          "displayName": "Sort Buffer Size",
          "name": "body_sort_buffer_size",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Sql Mode",
          "name": "body_sql_mode",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Table Definition Cache",
          "name": "body_table_definition_cache",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Table Open Cache",
          "name": "body_table_open_cache",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Table Open Cache Instances",
          "name": "body_table_open_cache_instances",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Thread Stack",
          "name": "body_thread_stack",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Transaction Isolation",
          "name": "body_transaction_isolation",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "READ-COMMITTED",
              "value": "READ-COMMITTED"
            },
            {
              "name": "READ-UNCOMMITTED",
              "value": "READ-UNCOMMITTED"
            },
            {
              "name": "REPEATABLE-READ",
              "value": "REPEATABLE-READ"
            },
            {
              "name": "SERIALIZABLE",
              "value": "SERIALIZABLE"
            }
          ]
        },
        {
          "displayName": "Wait Timeout",
          "name": "body_wait_timeout",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Configurations"
          ],
          "operation": [
            "Remove Configuration"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Configurations"
          ],
          "operation": [
            "Remove Configuration"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Dbaas Id",
      "name": "path_dbaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Configurations"
          ],
          "operation": [
            "Remove Configuration"
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
            "Database Service > Data"
          ]
        }
      },
      "options": [
        {
          "name": "List Regions",
          "value": "List Regions"
        },
        {
          "name": "List Packs",
          "value": "List Packs"
        },
        {
          "name": "Pack Filters",
          "value": "Pack Filters"
        },
        {
          "name": "List Types",
          "value": "List Types"
        }
      ],
      "default": "List Regions",
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
            "Database Service > Data"
          ],
          "operation": [
            "List Packs"
          ]
        }
      },
      "options": [
        {
          "displayName": "Filter",
          "name": "query_filter",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Type",
          "name": "query_type",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "mysql",
              "value": "mysql"
            }
          ]
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
            "Database Service > Data"
          ],
          "operation": [
            "Pack Filters"
          ]
        }
      },
      "options": [
        {
          "displayName": "Filter",
          "name": "query_filter",
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
            "Database Service > IP Filters"
          ]
        }
      },
      "options": [
        {
          "name": "List IP Filters",
          "value": "List IP Filters"
        },
        {
          "name": "Create/Update IP Filters",
          "value": "Create/Update IP Filters"
        },
        {
          "name": "Remove IP Filters",
          "value": "Remove IP Filters"
        }
      ],
      "default": "List IP Filters",
      "noDataExpression": true
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > IP Filters"
          ],
          "operation": [
            "List IP Filters"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > IP Filters"
          ],
          "operation": [
            "List IP Filters"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Dbaas Id",
      "name": "path_dbaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > IP Filters"
          ],
          "operation": [
            "List IP Filters"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > IP Filters"
          ],
          "operation": [
            "Create/Update IP Filters"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > IP Filters"
          ],
          "operation": [
            "Create/Update IP Filters"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Dbaas Id",
      "name": "path_dbaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > IP Filters"
          ],
          "operation": [
            "Create/Update IP Filters"
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
            "Database Service > IP Filters"
          ],
          "operation": [
            "Create/Update IP Filters"
          ]
        }
      },
      "options": [
        {
          "displayName": "Ip Filters",
          "name": "body_ip_filters",
          "type": "json",
          "default": {},
          "description": "List of whitelist IP filters to apply to the given Database Service"
        }
      ]
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > IP Filters"
          ],
          "operation": [
            "Remove IP Filters"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > IP Filters"
          ],
          "operation": [
            "Remove IP Filters"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Dbaas Id",
      "name": "path_dbaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > IP Filters"
          ],
          "operation": [
            "Remove IP Filters"
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
            "Database Service > Restores"
          ]
        }
      },
      "options": [
        {
          "name": "Get Restore",
          "value": "Get Restore"
        },
        {
          "name": "Create Restore",
          "value": "Create Restore"
        }
      ],
      "default": "Get Restore",
      "noDataExpression": true
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Restores"
          ],
          "operation": [
            "Get Restore"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Restores"
          ],
          "operation": [
            "Get Restore"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Dbaas Id",
      "name": "path_dbaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Restores"
          ],
          "operation": [
            "Get Restore"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Restore Id",
      "name": "path_restore_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Restores"
          ],
          "operation": [
            "Get Restore"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Restores"
          ],
          "operation": [
            "Create Restore"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Restores"
          ],
          "operation": [
            "Create Restore"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Dbaas Id",
      "name": "path_dbaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Database Service > Restores"
          ],
          "operation": [
            "Create Restore"
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
            "Database Service > Restores"
          ],
          "operation": [
            "Create Restore"
          ]
        }
      },
      "options": [
        {
          "displayName": "Backup Id",
          "name": "body_backup_id",
          "type": "string",
          "default": ""
        },
        {
          "displayName": "New Service",
          "name": "body_new_service",
          "type": "json",
          "default": {},
          "description": "Create a new Database Service and restore the backed up data. Use this object to specify service options."
        },
        {
          "displayName": "Pitr Restore Date",
          "name": "body_pitr_restore_date",
          "type": "string",
          "default": "",
          "description": "Point in time recovery date in ISO 3339 format"
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
            "Kubernetes Service"
          ]
        }
      },
      "options": [
        {
          "name": "List All Kubernetes Services",
          "value": "List All Kubernetes Services"
        },
        {
          "name": "List Kubernetes Services",
          "value": "List Kubernetes Services"
        },
        {
          "name": "Create Kubernetes Service",
          "value": "Create Kubernetes Service"
        },
        {
          "name": "Get Kubernetes Service",
          "value": "Get Kubernetes Service"
        },
        {
          "name": "Update Kubernetes Service",
          "value": "Update Kubernetes Service"
        },
        {
          "name": "Delete Kubernetes Service",
          "value": "Delete Kubernetes Service"
        },
        {
          "name": "Get The Current State Of A Kaas Apiserver Params",
          "value": "Get The Current State Of A Kaas Apiserver Params"
        },
        {
          "name": "Patch Apiserver Params Of A Specific Kaas",
          "value": "Patch Apiserver Params Of A Specific Kaas"
        },
        {
          "name": "Download Kubernetes Service Configuration",
          "value": "Download Kubernetes Service Configuration"
        }
      ],
      "default": "List All Kubernetes Services",
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
            "Kubernetes Service"
          ],
          "operation": [
            "List All Kubernetes Services"
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
            "Kubernetes Service"
          ],
          "operation": [
            "List All Kubernetes Services"
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
          "displayName": "Public Cloud Id",
          "name": "query_public_cloud_id",
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
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service"
          ],
          "operation": [
            "List Kubernetes Services"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service"
          ],
          "operation": [
            "List Kubernetes Services"
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
            "Kubernetes Service"
          ],
          "operation": [
            "List Kubernetes Services"
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
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service"
          ],
          "operation": [
            "Create Kubernetes Service"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service"
          ],
          "operation": [
            "Create Kubernetes Service"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Kaas Pack Id",
      "name": "body_kaas_pack_id",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service"
          ],
          "operation": [
            "Create Kubernetes Service"
          ]
        }
      },
      "required": true,
      "description": "Kubernetes Service Pack Identifier",
      "options": [
        {
          "name": "1",
          "value": 1
        },
        {
          "name": "2",
          "value": 2
        }
      ]
    },
    {
      "displayName": "Kubernetes Version",
      "name": "body_kubernetes_version",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service"
          ],
          "operation": [
            "Create Kubernetes Service"
          ]
        }
      },
      "required": true,
      "description": "Kubernetes Version",
      "options": [
        {
          "name": "1.29",
          "value": "1.29"
        },
        {
          "name": "1.30",
          "value": "1.30"
        },
        {
          "name": "1.31",
          "value": "1.31"
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
            "Kubernetes Service"
          ],
          "operation": [
            "Create Kubernetes Service"
          ]
        }
      },
      "required": true,
      "description": "Kubernetes Service Name"
    },
    {
      "displayName": "Region",
      "name": "body_region",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service"
          ],
          "operation": [
            "Create Kubernetes Service"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Region",
      "options": [
        {
          "name": "dc3-a",
          "value": "dc3-a"
        },
        {
          "name": "dc4-a",
          "value": "dc4-a"
        }
      ]
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service"
          ],
          "operation": [
            "Get Kubernetes Service"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service"
          ],
          "operation": [
            "Get Kubernetes Service"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Kaas Id",
      "name": "path_kaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service"
          ],
          "operation": [
            "Get Kubernetes Service"
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
            "Kubernetes Service"
          ],
          "operation": [
            "Get Kubernetes Service"
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
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service"
          ],
          "operation": [
            "Update Kubernetes Service"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service"
          ],
          "operation": [
            "Update Kubernetes Service"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Kaas Id",
      "name": "path_kaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service"
          ],
          "operation": [
            "Update Kubernetes Service"
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
            "Kubernetes Service"
          ],
          "operation": [
            "Update Kubernetes Service"
          ]
        }
      },
      "options": [
        {
          "displayName": "Kubernetes Version",
          "name": "body_kubernetes_version",
          "type": "options",
          "default": "",
          "description": "Upgrade version. This will start a rolling update of the given Kubernetes Service. Only 1 minor version can be updated at a time. The version can never be downgraded",
          "options": [
            {
              "name": "1.29",
              "value": "1.29"
            },
            {
              "name": "1.30",
              "value": "1.30"
            },
            {
              "name": "1.31",
              "value": "1.31"
            }
          ]
        },
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "Name to use for your Kubernetes Service"
        }
      ]
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service"
          ],
          "operation": [
            "Delete Kubernetes Service"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service"
          ],
          "operation": [
            "Delete Kubernetes Service"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Kaas Id",
      "name": "path_kaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service"
          ],
          "operation": [
            "Delete Kubernetes Service"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service"
          ],
          "operation": [
            "Get The Current State Of A Kaas Apiserver Params"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service"
          ],
          "operation": [
            "Get The Current State Of A Kaas Apiserver Params"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Kaas Id",
      "name": "path_kaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service"
          ],
          "operation": [
            "Get The Current State Of A Kaas Apiserver Params"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service"
          ],
          "operation": [
            "Patch Apiserver Params Of A Specific Kaas"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service"
          ],
          "operation": [
            "Patch Apiserver Params Of A Specific Kaas"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Kaas Id",
      "name": "path_kaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service"
          ],
          "operation": [
            "Patch Apiserver Params Of A Specific Kaas"
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
            "Kubernetes Service"
          ],
          "operation": [
            "Patch Apiserver Params Of A Specific Kaas"
          ]
        }
      },
      "options": [
        {
          "displayName": "Apiserver Params",
          "name": "body_apiserver_params",
          "type": "json",
          "default": {}
        }
      ]
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service"
          ],
          "operation": [
            "Download Kubernetes Service Configuration"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service"
          ],
          "operation": [
            "Download Kubernetes Service Configuration"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Kaas Id",
      "name": "path_kaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service"
          ],
          "operation": [
            "Download Kubernetes Service Configuration"
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
            "Kubernetes Service > Data"
          ]
        }
      },
      "options": [
        {
          "name": "List Packs",
          "value": "List Packs"
        },
        {
          "name": "List Kubernetes Versions",
          "value": "List Kubernetes Versions"
        },
        {
          "name": "List Regions",
          "value": "List Regions"
        },
        {
          "name": "List Availability Zones",
          "value": "List Availability Zones"
        },
        {
          "name": "List Flavors",
          "value": "List Flavors"
        },
        {
          "name": "List Flavor Filters",
          "value": "List Flavor Filters"
        }
      ],
      "default": "List Packs",
      "noDataExpression": true
    },
    {
      "displayName": "Region",
      "name": "query_region",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Data"
          ],
          "operation": [
            "List Availability Zones"
          ]
        }
      },
      "required": true,
      "options": [
        {
          "name": "dc3-a",
          "value": "dc3-a"
        },
        {
          "name": "dc4-a",
          "value": "dc4-a"
        }
      ]
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Data"
          ],
          "operation": [
            "List Flavors"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Data"
          ],
          "operation": [
            "List Flavors"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Region",
      "name": "query_region",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Data"
          ],
          "operation": [
            "List Flavors"
          ]
        }
      },
      "required": true,
      "options": [
        {
          "name": "dc3-a",
          "value": "dc3-a"
        },
        {
          "name": "dc4-a",
          "value": "dc4-a"
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
            "Kubernetes Service > Data"
          ],
          "operation": [
            "List Flavors"
          ]
        }
      },
      "options": [
        {
          "displayName": "Filter",
          "name": "query_filter",
          "type": "json",
          "default": {}
        },
        {
          "displayName": "Page",
          "name": "query_page",
          "type": "number",
          "default": 0
        },
        {
          "displayName": "Per Page",
          "name": "query_per_page",
          "type": "number",
          "default": 0
        }
      ]
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Data"
          ],
          "operation": [
            "List Flavor Filters"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Data"
          ],
          "operation": [
            "List Flavor Filters"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Region",
      "name": "query_region",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Data"
          ],
          "operation": [
            "List Flavor Filters"
          ]
        }
      },
      "required": true,
      "options": [
        {
          "name": "dc3-a",
          "value": "dc3-a"
        },
        {
          "name": "dc4-a",
          "value": "dc4-a"
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
            "Kubernetes Service > IP Filtering"
          ]
        }
      },
      "options": [
        {
          "name": "List IP Filters",
          "value": "List IP Filters"
        },
        {
          "name": "Create/Update IP Filters",
          "value": "Create/Update IP Filters"
        },
        {
          "name": "Remove IP Filters",
          "value": "Remove IP Filters"
        }
      ],
      "default": "List IP Filters",
      "noDataExpression": true
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > IP Filtering"
          ],
          "operation": [
            "List IP Filters"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > IP Filtering"
          ],
          "operation": [
            "List IP Filters"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Kaas Id",
      "name": "path_kaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > IP Filtering"
          ],
          "operation": [
            "List IP Filters"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > IP Filtering"
          ],
          "operation": [
            "Create/Update IP Filters"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > IP Filtering"
          ],
          "operation": [
            "Create/Update IP Filters"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Kaas Id",
      "name": "path_kaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > IP Filtering"
          ],
          "operation": [
            "Create/Update IP Filters"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Ip Filters",
      "name": "body_ip_filters",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > IP Filtering"
          ],
          "operation": [
            "Create/Update IP Filters"
          ]
        }
      },
      "required": true,
      "description": "List of whitelist IP filters to apply to the given Database Service"
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > IP Filtering"
          ],
          "operation": [
            "Remove IP Filters"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > IP Filtering"
          ],
          "operation": [
            "Remove IP Filters"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Kaas Id",
      "name": "path_kaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > IP Filtering"
          ],
          "operation": [
            "Remove IP Filters"
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
            "Kubernetes Service > Instance Pools"
          ]
        }
      },
      "options": [
        {
          "name": "List Instance Pools",
          "value": "List Instance Pools"
        },
        {
          "name": "Create Instance Pool",
          "value": "Create Instance Pool"
        },
        {
          "name": "Get Instance Pool",
          "value": "Get Instance Pool"
        },
        {
          "name": "Update Instance Pool",
          "value": "Update Instance Pool"
        },
        {
          "name": "Delete Instance Pool",
          "value": "Delete Instance Pool"
        }
      ],
      "default": "List Instance Pools",
      "noDataExpression": true
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Instance Pools"
          ],
          "operation": [
            "List Instance Pools"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Instance Pools"
          ],
          "operation": [
            "List Instance Pools"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Kaas Id",
      "name": "path_kaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Instance Pools"
          ],
          "operation": [
            "List Instance Pools"
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
            "Kubernetes Service > Instance Pools"
          ],
          "operation": [
            "List Instance Pools"
          ]
        }
      },
      "options": [
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
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Instance Pools"
          ],
          "operation": [
            "Create Instance Pool"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Instance Pools"
          ],
          "operation": [
            "Create Instance Pool"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Kaas Id",
      "name": "path_kaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Instance Pools"
          ],
          "operation": [
            "Create Instance Pool"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Flavor",
      "name": "body_flavor",
      "type": "options",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Instance Pools"
          ],
          "operation": [
            "Create Instance Pool"
          ]
        }
      },
      "required": true,
      "description": "Instance Pool Flavor, <a href=\"/docs/api/get/1/public_clouds/{public_cloud_id}/projects/{public_cloud_project_id}/kaas/flavors\" target=\"_blank\" rel=\"noopener noreferrer\">possible flavors</a>",
      "options": [
        {
          "name": "see link below",
          "value": "see link below"
        }
      ]
    },
    {
      "displayName": "Minimum Instances",
      "name": "body_minimum_instances",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Instance Pools"
          ],
          "operation": [
            "Create Instance Pool"
          ]
        }
      },
      "required": true,
      "description": "Minimum number of instances"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Instance Pools"
          ],
          "operation": [
            "Create Instance Pool"
          ]
        }
      },
      "required": true,
      "description": "Instance Pool Name"
    },
    {
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Instance Pools"
          ],
          "operation": [
            "Create Instance Pool"
          ]
        }
      },
      "options": [
        {
          "displayName": "Availability Zone",
          "name": "body_availability_zone",
          "type": "options",
          "default": "",
          "description": "Region Availability Zone",
          "options": [
            {
              "name": "az-1",
              "value": "az-1"
            },
            {
              "name": "az-2",
              "value": "az-2"
            },
            {
              "name": "az-3",
              "value": "az-3"
            },
            {
              "name": "dc3-a-04",
              "value": "dc3-a-04"
            },
            {
              "name": "dc3-a-09",
              "value": "dc3-a-09"
            },
            {
              "name": "dc3-a-10",
              "value": "dc3-a-10"
            }
          ]
        },
        {
          "displayName": "Labels",
          "name": "body_labels",
          "type": "json",
          "default": {},
          "description": "Array of valid Kubernetes labels to apply to the instances. The label must have a prefix of node-role.kubernetes.io or belong to the domains node-restriction.kubernetes.io or custom.kaas.infomaniak.cloud. For more information about label formats, see: <a href=\"https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set\" target=\"_blank\" rel=\"noopener noreferrer\">Label Information</a>"
        },
        {
          "displayName": "Maximum Instances",
          "name": "body_maximum_instances",
          "type": "number",
          "default": 0,
          "description": "Maximum number of instances. If maximum_instances is greater than minimum_instances, autoscaling will be enabled"
        },
        {
          "displayName": "Prefix",
          "name": "body_prefix",
          "type": "string",
          "default": "",
          "description": "Prefix to use with when naming instances"
        }
      ]
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Instance Pools"
          ],
          "operation": [
            "Get Instance Pool"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Instance Pools"
          ],
          "operation": [
            "Get Instance Pool"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Kaas Id",
      "name": "path_kaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Instance Pools"
          ],
          "operation": [
            "Get Instance Pool"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Kaas Worker Pool Id",
      "name": "path_kaas_worker_pool_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Instance Pools"
          ],
          "operation": [
            "Get Instance Pool"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Instance Pools"
          ],
          "operation": [
            "Update Instance Pool"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Instance Pools"
          ],
          "operation": [
            "Update Instance Pool"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Kaas Id",
      "name": "path_kaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Instance Pools"
          ],
          "operation": [
            "Update Instance Pool"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Kaas Worker Pool Id",
      "name": "path_kaas_worker_pool_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Instance Pools"
          ],
          "operation": [
            "Update Instance Pool"
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
            "Kubernetes Service > Instance Pools"
          ],
          "operation": [
            "Update Instance Pool"
          ]
        }
      },
      "options": [
        {
          "displayName": "Labels",
          "name": "body_labels",
          "type": "json",
          "default": {},
          "description": "Array of valid Kubernetes labels to apply to the instances. The label must have a prefix of node-role.kubernetes.io or belong to the domains node-restriction.kubernetes.io or custom.kaas.infomaniak.cloud. For more information about label formats, see: <a href=\"https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set\" target=\"_blank\" rel=\"noopener noreferrer\">Label Information</a>"
        },
        {
          "displayName": "Maximum Instances",
          "name": "body_maximum_instances",
          "type": "number",
          "default": 0,
          "description": "Maximum number of instances. If maximum_instances is greater than minimum_instances, autoscaling will be enabled"
        },
        {
          "displayName": "Minimum Instances",
          "name": "body_minimum_instances",
          "type": "number",
          "default": 0,
          "description": "Minimum number of instances"
        },
        {
          "displayName": "Name",
          "name": "body_name",
          "type": "string",
          "default": "",
          "description": "Instance Pool Name"
        }
      ]
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Instance Pools"
          ],
          "operation": [
            "Delete Instance Pool"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Instance Pools"
          ],
          "operation": [
            "Delete Instance Pool"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Kaas Id",
      "name": "path_kaas_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Instance Pools"
          ],
          "operation": [
            "Delete Instance Pool"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Kaas Worker Pool Id",
      "name": "path_kaas_worker_pool_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Kubernetes Service > Instance Pools"
          ],
          "operation": [
            "Delete Instance Pool"
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
            "Product Management"
          ]
        }
      },
      "options": [
        {
          "name": "List All Public Clouds",
          "value": "List All Public Clouds"
        },
        {
          "name": "Accesses",
          "value": "Accesses"
        },
        {
          "name": "Get Public Cloud Info",
          "value": "Get Public Cloud Info"
        },
        {
          "name": "Update A Public Cloud",
          "value": "Update A Public Cloud"
        }
      ],
      "default": "List All Public Clouds",
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
            "Product Management"
          ],
          "operation": [
            "List All Public Clouds"
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
            "Product Management"
          ],
          "operation": [
            "List All Public Clouds"
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
            "Product Management"
          ],
          "operation": [
            "Accesses"
          ]
        }
      },
      "required": true,
      "description": "The account identifier"
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Product Management"
          ],
          "operation": [
            "Get Public Cloud Info"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Public Cloud product"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Product Management"
          ],
          "operation": [
            "Get Public Cloud Info"
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
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Product Management"
          ],
          "operation": [
            "Update A Public Cloud"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Public Cloud product"
    },
    {
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Product Management"
          ],
          "operation": [
            "Update A Public Cloud"
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
          "default": "",
          "description": "Customer name"
        },
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": "",
          "description": "Public Cloud description"
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
            "Projects"
          ]
        }
      },
      "options": [
        {
          "name": "List Projects",
          "value": "List Projects"
        },
        {
          "name": "Create Project",
          "value": "Create Project"
        },
        {
          "name": "Get Project Details",
          "value": "Get Project Details"
        },
        {
          "name": "Update Project",
          "value": "Update Project"
        },
        {
          "name": "Delete Project",
          "value": "Delete Project"
        },
        {
          "name": "Create Project With Invitation",
          "value": "Create Project With Invitation"
        }
      ],
      "default": "List Projects",
      "noDataExpression": true
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Projects"
          ],
          "operation": [
            "List Projects"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Public Cloud product"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Projects"
          ],
          "operation": [
            "List Projects"
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
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Projects"
          ],
          "operation": [
            "Create Project"
          ]
        }
      },
      "required": true,
      "description": "Unique identifier of the Public Cloud"
    },
    {
      "displayName": "Project Name",
      "name": "body_project_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Projects"
          ],
          "operation": [
            "Create Project"
          ]
        }
      },
      "required": true,
      "description": "Project name"
    },
    {
      "displayName": "User Password",
      "name": "body_user_password",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Projects"
          ],
          "operation": [
            "Create Project"
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
            "Projects"
          ],
          "operation": [
            "Create Project"
          ]
        }
      },
      "options": [
        {
          "displayName": "User Description",
          "name": "body_user_description",
          "type": "string",
          "default": "",
          "description": "User description"
        },
        {
          "displayName": "User Email",
          "name": "body_user_email",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Projects"
          ],
          "operation": [
            "Get Project Details"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Identifier"
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Projects"
          ],
          "operation": [
            "Get Project Details"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Project Identifier"
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Projects"
          ],
          "operation": [
            "Get Project Details"
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
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Projects"
          ],
          "operation": [
            "Update Project"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Identifier"
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Projects"
          ],
          "operation": [
            "Update Project"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Project Identifier"
    },
    {
      "displayName": "Name",
      "name": "body_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Projects"
          ],
          "operation": [
            "Update Project"
          ]
        }
      },
      "required": true,
      "description": "Project name"
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Projects"
          ],
          "operation": [
            "Delete Project"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Identifier"
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Projects"
          ],
          "operation": [
            "Delete Project"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Project Identifier"
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Projects"
          ],
          "operation": [
            "Create Project With Invitation"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Identifier"
    },
    {
      "displayName": "Project Name",
      "name": "body_project_name",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Projects"
          ],
          "operation": [
            "Create Project With Invitation"
          ]
        }
      },
      "required": true,
      "description": "Project name"
    },
    {
      "displayName": "User Email",
      "name": "body_user_email",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Projects"
          ],
          "operation": [
            "Create Project With Invitation"
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
            "Projects"
          ],
          "operation": [
            "Create Project With Invitation"
          ]
        }
      },
      "options": [
        {
          "displayName": "User Description",
          "name": "body_user_description",
          "type": "string",
          "default": "",
          "description": "User description"
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
          "name": "List Users",
          "value": "List Users"
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
          "name": "Get Authentication File",
          "value": "Get Authentication File"
        },
        {
          "name": "Get Authentication File",
          "value": "Get Authentication File (2)"
        },
        {
          "name": "Create User Invitation",
          "value": "Create User Invitation"
        },
        {
          "name": "Update User With Invitation",
          "value": "Update User With Invitation"
        }
      ],
      "default": "List Users",
      "noDataExpression": true
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "List Users"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Product Identifier"
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "List Users"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Project Identifier"
    },
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
            "List Users"
          ]
        }
      },
      "options": [
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
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Create User"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Product Identifier"
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Create User"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Project Identifier"
    },
    {
      "displayName": "Password",
      "name": "body_password",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Create User"
          ]
        }
      },
      "required": true,
      "description": "User password"
    },
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
            "Create User"
          ]
        }
      },
      "options": [
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": "",
          "description": "User description"
        }
      ]
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Get User"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Product Identifier"
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Get User"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Project Identifier"
    },
    {
      "displayName": "Public Cloud User Id",
      "name": "path_public_cloud_user_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Get User"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud User Identifier"
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Update User"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Product Identifier"
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Update User"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Project Identifier"
    },
    {
      "displayName": "Public Cloud User Id",
      "name": "path_public_cloud_user_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Update User"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud User Identifier"
    },
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
            "Update User"
          ]
        }
      },
      "options": [
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": "",
          "description": "User description"
        },
        {
          "displayName": "Email",
          "name": "body_email",
          "type": "string",
          "default": "",
          "description": "User email address"
        },
        {
          "displayName": "Password",
          "name": "body_password",
          "type": "string",
          "default": ""
        }
      ]
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Delete User"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Product Identifier"
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Delete User"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Project Identifier"
    },
    {
      "displayName": "Public Cloud User Id",
      "name": "path_public_cloud_user_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Delete User"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud User Identifier"
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Get Authentication File"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Product Identifier"
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Get Authentication File"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Project Identifier"
    },
    {
      "displayName": "Public Cloud User Id",
      "name": "path_public_cloud_user_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Get Authentication File"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud User Identifier"
    },
    {
      "displayName": "Type",
      "name": "path_type",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Get Authentication File"
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
            "Users"
          ],
          "operation": [
            "Get Authentication File"
          ]
        }
      },
      "options": [
        {
          "displayName": "Region",
          "name": "query_region",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "pub1",
              "value": "pub1"
            },
            {
              "name": "pub2",
              "value": "pub2"
            }
          ]
        }
      ]
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Get Authentication File (2)"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Product Identifier"
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Get Authentication File (2)"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Project Identifier"
    },
    {
      "displayName": "Public Cloud User Id",
      "name": "path_public_cloud_user_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Get Authentication File (2)"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud User Identifier"
    },
    {
      "displayName": "Type",
      "name": "path_type",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Get Authentication File (2)"
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
            "Users"
          ],
          "operation": [
            "Get Authentication File (2)"
          ]
        }
      },
      "options": [
        {
          "displayName": "Region",
          "name": "query_region",
          "type": "options",
          "default": "",
          "options": [
            {
              "name": "pub1",
              "value": "pub1"
            },
            {
              "name": "pub2",
              "value": "pub2"
            }
          ]
        }
      ]
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Create User Invitation"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Product Identifier"
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Create User Invitation"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Project Identifier"
    },
    {
      "displayName": "Email",
      "name": "body_email",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Create User Invitation"
          ]
        }
      },
      "required": true,
      "description": "User email address"
    },
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
            "Create User Invitation"
          ]
        }
      },
      "options": [
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": "",
          "description": "User description"
        }
      ]
    },
    {
      "displayName": "Public Cloud Id",
      "name": "path_public_cloud_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Update User With Invitation"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Identifier"
    },
    {
      "displayName": "Public Cloud Project Id",
      "name": "path_public_cloud_project_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Update User With Invitation"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud Project Identifier"
    },
    {
      "displayName": "Public Cloud User Id",
      "name": "path_public_cloud_user_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Update User With Invitation"
          ]
        }
      },
      "required": true,
      "description": "Public Cloud User Identifier"
    },
    {
      "displayName": "Email",
      "name": "body_email",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Users"
          ],
          "operation": [
            "Update User With Invitation"
          ]
        }
      },
      "required": true,
      "description": "User email address"
    },
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
            "Update User With Invitation"
          ]
        }
      },
      "options": [
        {
          "displayName": "Description",
          "name": "body_description",
          "type": "string",
          "default": "",
          "description": "User description"
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
            "Database Service",
            "Database Service",
            "Kubernetes Service",
            "Kubernetes Service",
            "Kubernetes Service > Data",
            "Kubernetes Service > Instance Pools",
            "Product Management",
            "Projects",
            "Users"
          ],
          "operation": [
            "List All Database Services",
            "List Database Services",
            "List All Kubernetes Services",
            "List Kubernetes Services",
            "List Flavors",
            "List Instance Pools",
            "List All Public Clouds",
            "List Projects",
            "List Users"
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
            "Database Service",
            "Database Service",
            "Kubernetes Service",
            "Kubernetes Service",
            "Kubernetes Service > Data",
            "Kubernetes Service > Instance Pools",
            "Product Management",
            "Projects",
            "Users"
          ],
          "operation": [
            "List All Database Services",
            "List Database Services",
            "List All Kubernetes Services",
            "List Kubernetes Services",
            "List Flavors",
            "List Instance Pools",
            "List All Public Clouds",
            "List Projects",
            "List Users"
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
