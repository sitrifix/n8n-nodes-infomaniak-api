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
  "Product Management": {
    "List All Your AI Tools": {
      "method": "GET",
      "path": "/1/ai",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Product Management > Consumptions": {
    "List All Consumptions": {
      "method": "GET",
      "path": "/1/ai/{product_id}/consumptions",
      "pagination": "limit-skip",
      "pathParams": [
        {
          "name": "product_id",
          "field": "path_product_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Results": {
    "Get The Result Of An Async Model Batch": {
      "method": "GET",
      "path": "/1/ai/{product_id}/results/{batch_id}",
      "pagination": "none",
      "pathParams": [
        {
          "name": "product_id",
          "field": "path_product_id"
        },
        {
          "name": "batch_id",
          "field": "path_batch_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Download The Output Result Of An Async Model Batch": {
      "method": "GET",
      "path": "/1/ai/{product_id}/results/{batch_id}/download",
      "pagination": "none",
      "pathParams": [
        {
          "name": "product_id",
          "field": "path_product_id"
        },
        {
          "name": "batch_id",
          "field": "path_batch_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Usage > V1 > Images": {
    "Customizing Realistic Human Photos": {
      "method": "POST",
      "path": "/1/ai/{product_id}/images/generations/photo_maker",
      "pagination": "none",
      "pathParams": [
        {
          "name": "product_id",
          "field": "path_product_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "guidance_scale",
          "field": "body_guidance_scale"
        },
        {
          "name": "images",
          "field": "body_images"
        },
        {
          "name": "n",
          "field": "body_n"
        },
        {
          "name": "negative_prompt",
          "field": "body_negative_prompt"
        },
        {
          "name": "prompt",
          "field": "body_prompt"
        },
        {
          "name": "quality",
          "field": "body_quality"
        },
        {
          "name": "response_format",
          "field": "body_response_format"
        },
        {
          "name": "size",
          "field": "body_size"
        },
        {
          "name": "style",
          "field": "body_style"
        },
        {
          "name": "style_strength_ratio",
          "field": "body_style_strength_ratio"
        },
        {
          "name": "sync",
          "field": "body_sync"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Usage > V1 > Models": {
    "List Models": {
      "method": "GET",
      "path": "/1/ai/models",
      "pagination": "none",
      "pathParams": [],
      "queryParams": [],
      "optionalQueryCollectionName": "queryParameters",
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    }
  },
  "Usage > V1 > Open AI": {
    "List Models": {
      "method": "GET",
      "path": "/1/ai/{product_id}/openai/models",
      "pagination": "none",
      "pathParams": [
        {
          "name": "product_id",
          "field": "path_product_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create Chat Completion": {
      "method": "POST",
      "path": "/1/ai/{product_id}/openai/chat/completions",
      "pagination": "none",
      "pathParams": [
        {
          "name": "product_id",
          "field": "path_product_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "frequency_penalty",
          "field": "body_frequency_penalty"
        },
        {
          "name": "logit_bias",
          "field": "body_logit_bias"
        },
        {
          "name": "logprobs",
          "field": "body_logprobs"
        },
        {
          "name": "max_tokens",
          "field": "body_max_tokens"
        },
        {
          "name": "messages",
          "field": "body_messages"
        },
        {
          "name": "model",
          "field": "body_model"
        },
        {
          "name": "n",
          "field": "body_n"
        },
        {
          "name": "presence_penalty",
          "field": "body_presence_penalty"
        },
        {
          "name": "profile_type",
          "field": "body_profile_type"
        },
        {
          "name": "seed",
          "field": "body_seed"
        },
        {
          "name": "stop",
          "field": "body_stop"
        },
        {
          "name": "stream",
          "field": "body_stream"
        },
        {
          "name": "temperature",
          "field": "body_temperature"
        },
        {
          "name": "top_logprobs",
          "field": "body_top_logprobs"
        },
        {
          "name": "top_p",
          "field": "body_top_p"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Create Transcription": {
      "method": "POST",
      "path": "/1/ai/{product_id}/openai/audio/transcriptions",
      "pagination": "none",
      "pathParams": [
        {
          "name": "product_id",
          "field": "path_product_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "append_punctuations",
          "field": "body_append_punctuations"
        },
        {
          "name": "chunk_length",
          "field": "body_chunk_length"
        },
        {
          "name": "file",
          "field": "body_file"
        },
        {
          "name": "highlight_words",
          "field": "body_highlight_words"
        },
        {
          "name": "language",
          "field": "body_language"
        },
        {
          "name": "max_line_count",
          "field": "body_max_line_count"
        },
        {
          "name": "max_line_width",
          "field": "body_max_line_width"
        },
        {
          "name": "max_words_per_line",
          "field": "body_max_words_per_line"
        },
        {
          "name": "model",
          "field": "body_model"
        },
        {
          "name": "no_speech_threshold",
          "field": "body_no_speech_threshold"
        },
        {
          "name": "prepend_punctuations",
          "field": "body_prepend_punctuations"
        },
        {
          "name": "prompt",
          "field": "body_prompt"
        },
        {
          "name": "response_format",
          "field": "body_response_format"
        },
        {
          "name": "timestamp_granularities",
          "field": "body_timestamp_granularities"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Create Image": {
      "method": "POST",
      "path": "/1/ai/{product_id}/openai/images/generations",
      "pagination": "none",
      "pathParams": [
        {
          "name": "product_id",
          "field": "path_product_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "model",
          "field": "body_model"
        },
        {
          "name": "n",
          "field": "body_n"
        },
        {
          "name": "negative_prompt",
          "field": "body_negative_prompt"
        },
        {
          "name": "prompt",
          "field": "body_prompt"
        },
        {
          "name": "quality",
          "field": "body_quality"
        },
        {
          "name": "response_format",
          "field": "body_response_format"
        },
        {
          "name": "size",
          "field": "body_size"
        },
        {
          "name": "style",
          "field": "body_style"
        },
        {
          "name": "sync",
          "field": "body_sync"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "Create Embeddings": {
      "method": "POST",
      "path": "/1/ai/{product_id}/openai/v1/embeddings",
      "pagination": "none",
      "pathParams": [
        {
          "name": "product_id",
          "field": "path_product_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "encoding_format",
          "field": "body_encoding_format"
        },
        {
          "name": "input",
          "field": "body_input"
        },
        {
          "name": "mode",
          "field": "body_mode"
        },
        {
          "name": "model",
          "field": "body_model"
        },
        {
          "name": "task_description",
          "field": "body_task_description"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  },
  "Usage > V2 > Open AI": {
    "Create Chat Completion": {
      "method": "POST",
      "path": "/2/ai/{product_id}/openai/v1/chat/completions",
      "pagination": "none",
      "pathParams": [
        {
          "name": "product_id",
          "field": "path_product_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "logit_bias",
          "field": "body_logit_bias"
        },
        {
          "name": "logprobs",
          "field": "body_logprobs"
        },
        {
          "name": "max_completion_tokens",
          "field": "body_max_completion_tokens"
        },
        {
          "name": "messages",
          "field": "body_messages"
        },
        {
          "name": "model",
          "field": "body_model"
        },
        {
          "name": "n",
          "field": "body_n"
        },
        {
          "name": "parallel_tool_calls",
          "field": "body_parallel_tool_calls"
        },
        {
          "name": "presence_penalty",
          "field": "body_presence_penalty"
        },
        {
          "name": "reasoning_effort",
          "field": "body_reasoning_effort"
        },
        {
          "name": "response_format",
          "field": "body_response_format"
        },
        {
          "name": "seed",
          "field": "body_seed"
        },
        {
          "name": "stop",
          "field": "body_stop"
        },
        {
          "name": "stream",
          "field": "body_stream"
        },
        {
          "name": "stream_options",
          "field": "body_stream_options"
        },
        {
          "name": "temperature",
          "field": "body_temperature"
        },
        {
          "name": "tool_choice",
          "field": "body_tool_choice"
        },
        {
          "name": "tools",
          "field": "body_tools"
        },
        {
          "name": "top_logprobs",
          "field": "body_top_logprobs"
        },
        {
          "name": "top_p",
          "field": "body_top_p"
        },
        {
          "name": "user",
          "field": "body_user"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    },
    "List Models": {
      "method": "GET",
      "path": "/2/ai/{product_id}/openai/v1/models",
      "pagination": "none",
      "pathParams": [
        {
          "name": "product_id",
          "field": "path_product_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [],
      "optionalBodyCollectionName": null,
      "bodyFieldName": null
    },
    "Create Embeddings": {
      "method": "POST",
      "path": "/2/ai/{product_id}/openai/v1/embeddings",
      "pagination": "none",
      "pathParams": [
        {
          "name": "product_id",
          "field": "path_product_id"
        }
      ],
      "queryParams": [],
      "optionalQueryCollectionName": null,
      "bodyFields": [
        {
          "name": "dimensions",
          "field": "body_dimensions"
        },
        {
          "name": "encoding_format",
          "field": "body_encoding_format"
        },
        {
          "name": "input",
          "field": "body_input"
        },
        {
          "name": "model",
          "field": "body_model"
        }
      ],
      "optionalBodyCollectionName": "bodyParameters",
      "bodyFieldName": null
    }
  }
};

export class InfomaniakAitools implements INodeType {
	description: INodeTypeDescription = {
  "displayName": "Infomaniak Aitools",
  "name": "infomaniakAitools",
  "icon": "file:../../icons/ai-tools.svg",
  "group": [
    "output"
  ],
  "version": 1,
  "description": "Interact with Infomaniak Aitools API",
  "defaults": {
    "name": "Infomaniak Aitools"
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
          "name": "Product Management",
          "value": "Product Management"
        },
        {
          "name": "Product Management > Consumptions",
          "value": "Product Management > Consumptions"
        },
        {
          "name": "Results",
          "value": "Results"
        },
        {
          "name": "Usage > V1 > Images",
          "value": "Usage > V1 > Images"
        },
        {
          "name": "Usage > V1 > Models",
          "value": "Usage > V1 > Models"
        },
        {
          "name": "Usage > V1 > Open AI",
          "value": "Usage > V1 > Open AI"
        },
        {
          "name": "Usage > V2 > Open AI",
          "value": "Usage > V2 > Open AI"
        }
      ],
      "default": "Product Management",
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
            "Product Management"
          ]
        }
      },
      "options": [
        {
          "name": "List All Your AI Tools",
          "value": "List All Your AI Tools"
        }
      ],
      "default": "List All Your AI Tools",
      "noDataExpression": true
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Product Management > Consumptions"
          ]
        }
      },
      "options": [
        {
          "name": "List All Consumptions",
          "value": "List All Consumptions"
        }
      ],
      "default": "List All Consumptions",
      "noDataExpression": true
    },
    {
      "displayName": "Product Id",
      "name": "path_product_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Product Management > Consumptions"
          ],
          "operation": [
            "List All Consumptions"
          ]
        }
      },
      "required": true,
      "description": "*AI Tools* product identifier: use [GET `/1/ai`](/docs/api/get/1/ai) to retrieve your product identifier."
    },
    {
      "displayName": "Additional Query Parameters",
      "name": "queryParameters",
      "type": "collection",
      "placeholder": "Add Parameter",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Product Management > Consumptions"
          ],
          "operation": [
            "List All Consumptions"
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
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Results"
          ]
        }
      },
      "options": [
        {
          "name": "Get The Result Of An Async Model Batch",
          "value": "Get The Result Of An Async Model Batch"
        },
        {
          "name": "Download The Output Result Of An Async Model Batch",
          "value": "Download The Output Result Of An Async Model Batch"
        }
      ],
      "default": "Get The Result Of An Async Model Batch",
      "noDataExpression": true
    },
    {
      "displayName": "Product Id",
      "name": "path_product_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Results"
          ],
          "operation": [
            "Get The Result Of An Async Model Batch"
          ]
        }
      },
      "required": true,
      "description": "*AI Tools* product identifier: use [GET `/1/ai`](/docs/api/get/1/ai) to retrieve your product identifier."
    },
    {
      "displayName": "Batch Id",
      "name": "path_batch_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Results"
          ],
          "operation": [
            "Get The Result Of An Async Model Batch"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Product Id",
      "name": "path_product_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Results"
          ],
          "operation": [
            "Download The Output Result Of An Async Model Batch"
          ]
        }
      },
      "required": true,
      "description": "*AI Tools* product identifier: use [GET `/1/ai`](/docs/api/get/1/ai) to retrieve your product identifier."
    },
    {
      "displayName": "Batch Id",
      "name": "path_batch_id",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Results"
          ],
          "operation": [
            "Download The Output Result Of An Async Model Batch"
          ]
        }
      },
      "required": true,
      "description": "The batch id."
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V1 > Images"
          ]
        }
      },
      "options": [
        {
          "name": "Customizing Realistic Human Photos",
          "value": "Customizing Realistic Human Photos"
        }
      ],
      "default": "Customizing Realistic Human Photos",
      "noDataExpression": true
    },
    {
      "displayName": "Product Id",
      "name": "path_product_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V1 > Images"
          ],
          "operation": [
            "Customizing Realistic Human Photos"
          ]
        }
      },
      "required": true,
      "description": "*AI Tools* product identifier: use [GET `/1/ai`](/docs/api/get/1/ai) to retrieve your product identifier."
    },
    {
      "displayName": "Images",
      "name": "body_images",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V1 > Images"
          ],
          "operation": [
            "Customizing Realistic Human Photos"
          ]
        }
      },
      "required": true,
      "description": "Upload the images of the individual you wish to customize. While a single image is sufficient, providing additional images can yield better results. Ensure that the face occupies the majority of the uploaded image."
    },
    {
      "displayName": "Prompt",
      "name": "body_prompt",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V1 > Images"
          ],
          "operation": [
            "Customizing Realistic Human Photos"
          ]
        }
      },
      "required": true,
      "description": "Provide a text description to stylize the image. Make sure to <b>follow the class word</b> you want to customize with the <b>trigger word</b>: img, such as: man img, woman img, or girl img"
    },
    {
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V1 > Images"
          ],
          "operation": [
            "Customizing Realistic Human Photos"
          ]
        }
      },
      "options": [
        {
          "displayName": "Guidance Scale",
          "name": "body_guidance_scale",
          "type": "number",
          "default": 0,
          "description": "Weights for the prompt. Increasing guidance makes generation follow more closely to the prompt."
        },
        {
          "displayName": "N",
          "name": "body_n",
          "type": "number",
          "default": 0,
          "description": "The number of images to generate (default: 1)"
        },
        {
          "displayName": "Negative Prompt",
          "name": "body_negative_prompt",
          "type": "string",
          "default": "",
          "description": "The prompt does not guide the image generation. The maximum length is 77 tokens, Note that the \"sdxl_lightning\" and \"flux\" model does not support this feature."
        },
        {
          "displayName": "Quality",
          "name": "body_quality",
          "type": "options",
          "default": "",
          "description": "The quality of the image that will be generated (default: standard)",
          "options": [
            {
              "name": "hd",
              "value": "hd"
            },
            {
              "name": "standard",
              "value": "standard"
            }
          ]
        },
        {
          "displayName": "Response Format",
          "name": "body_response_format",
          "type": "options",
          "default": "",
          "description": "The format in which the generated images are returned. Currently, only 'b64_json' is supported as the response format",
          "options": [
            {
              "name": "b64_json",
              "value": "b64_json"
            },
            {
              "name": "url",
              "value": "url"
            }
          ]
        },
        {
          "displayName": "Size",
          "name": "body_size",
          "type": "options",
          "default": "",
          "description": "The size of the generated images.",
          "options": [
            {
              "name": "1024x1024",
              "value": "1024x1024"
            },
            {
              "name": "1024x1792",
              "value": "1024x1792"
            },
            {
              "name": "1792x1024",
              "value": "1792x1024"
            }
          ]
        },
        {
          "displayName": "Style",
          "name": "body_style",
          "type": "options",
          "default": "",
          "description": "Change the style to guidance for the generation",
          "options": [
            {
              "name": "cinematic",
              "value": "cinematic"
            },
            {
              "name": "comic_book",
              "value": "comic_book"
            },
            {
              "name": "digital_art",
              "value": "digital_art"
            },
            {
              "name": "disney_charactor",
              "value": "disney_charactor"
            },
            {
              "name": "enhance",
              "value": "enhance"
            },
            {
              "name": "fantasy_art",
              "value": "fantasy_art"
            },
            {
              "name": "line_art",
              "value": "line_art"
            },
            {
              "name": "lowpoly",
              "value": "lowpoly"
            },
            {
              "name": "neonpunk",
              "value": "neonpunk"
            },
            {
              "name": "photographic",
              "value": "photographic"
            }
          ]
        },
        {
          "displayName": "Style Strength Ratio",
          "name": "body_style_strength_ratio",
          "type": "number",
          "default": 0,
          "description": "Adjust the Style strength to 15-50. The larger the number, the less ID fidelity, but the stylization ability will be better."
        },
        {
          "displayName": "Sync",
          "name": "body_sync",
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
            "Usage > V1 > Models"
          ]
        }
      },
      "options": [
        {
          "name": "List Models",
          "value": "List Models"
        }
      ],
      "default": "List Models",
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
            "Usage > V1 > Models"
          ],
          "operation": [
            "List Models"
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
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V1 > Open AI"
          ]
        }
      },
      "options": [
        {
          "name": "List Models",
          "value": "List Models"
        },
        {
          "name": "Create Chat Completion",
          "value": "Create Chat Completion"
        },
        {
          "name": "Create Transcription",
          "value": "Create Transcription"
        },
        {
          "name": "Create Image",
          "value": "Create Image"
        },
        {
          "name": "Create Embeddings",
          "value": "Create Embeddings"
        }
      ],
      "default": "List Models",
      "noDataExpression": true
    },
    {
      "displayName": "Product Id",
      "name": "path_product_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V1 > Open AI"
          ],
          "operation": [
            "List Models"
          ]
        }
      },
      "required": true,
      "description": "*AI Tools* product identifier: use [GET `/1/ai`](/docs/api/get/1/ai) to retrieve your product identifier."
    },
    {
      "displayName": "Product Id",
      "name": "path_product_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V1 > Open AI"
          ],
          "operation": [
            "Create Chat Completion"
          ]
        }
      },
      "required": true,
      "description": "*AI Tools* product identifier: use [GET `/1/ai`](/docs/api/get/1/ai) to retrieve your product identifier."
    },
    {
      "displayName": "Messages",
      "name": "body_messages",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V1 > Open AI"
          ],
          "operation": [
            "Create Chat Completion"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Model",
      "name": "body_model",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V1 > Open AI"
          ],
          "operation": [
            "Create Chat Completion"
          ]
        }
      },
      "required": true,
      "description": "Model name to use"
    },
    {
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V1 > Open AI"
          ],
          "operation": [
            "Create Chat Completion"
          ]
        }
      },
      "options": [
        {
          "displayName": "Frequency Penalty",
          "name": "body_frequency_penalty",
          "type": "number",
          "default": 0,
          "description": "Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim."
        },
        {
          "displayName": "Logit Bias",
          "name": "body_logit_bias",
          "type": "json",
          "default": {},
          "description": "UNUSED Modify the likelihood of specified tokens appearing in the completion. Accepts a JSON object that maps tokens (specified by their token ID in the tokenizer) to an associated bias value from -100 to 100. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token."
        },
        {
          "displayName": "Logprobs",
          "name": "body_logprobs",
          "type": "boolean",
          "default": false,
          "description": "Whether to return log probabilities of the output tokens or not. If true, returns the log probabilities of each output token returned in the content of message."
        },
        {
          "displayName": "Max Tokens",
          "name": "body_max_tokens",
          "type": "number",
          "default": 0,
          "description": "Maximum number of generated tokens."
        },
        {
          "displayName": "N",
          "name": "body_n",
          "type": "number",
          "default": 0,
          "description": "UNUSED How many chat completion choices to generate for each input message. Note that you will be charged based on the number of generated tokens across all of the choices. Keep n as 1 to minimize costs."
        },
        {
          "displayName": "Presence Penalty",
          "name": "body_presence_penalty",
          "type": "number",
          "default": 0,
          "description": "The number should be above -2.0 but below 2.0. A positive value for the number will result in a penalty for any new tokens that are similar to those already present in the text, encouraging the model to discuss different topics. It is recommended to set the value between -1.5 and -0.5. Using higher values along with a larger temperature setting may cause a hallucination loop."
        },
        {
          "displayName": "Profile Type",
          "name": "body_profile_type",
          "type": "options",
          "default": "",
          "description": "Define parameter profiles according to your usage preferences. Creativity encourages greater diversity in text generation. Standard settings offer a well-balanced chatbot output. Strict settings result in highly predictable generation, suitable for tasks like translation or text classification labeling.",
          "options": [
            {
              "name": "creative",
              "value": "creative"
            },
            {
              "name": "standard",
              "value": "standard"
            },
            {
              "name": "strict",
              "value": "strict"
            }
          ]
        },
        {
          "displayName": "Seed",
          "name": "body_seed",
          "type": "number",
          "default": 0,
          "description": "Random sampling seed."
        },
        {
          "displayName": "Stop",
          "name": "body_stop",
          "type": "string",
          "default": "",
          "description": "Up to 4 sequences where the API will stop generating further tokens."
        },
        {
          "displayName": "Stream",
          "name": "body_stream",
          "type": "boolean",
          "default": false,
          "description": " Enable streaming SSE"
        },
        {
          "displayName": "Temperature",
          "name": "body_temperature",
          "type": "number",
          "default": 0,
          "description": "What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. We generally recommend altering this or `top_p` but not both."
        },
        {
          "displayName": "Top Logprobs",
          "name": "body_top_logprobs",
          "type": "number",
          "default": 0,
          "description": "An integer between 0 and 5 specifying the number of most likely tokens to return at each token position, each with an associated log probability. logprobs must be set to true if this parameter is used."
        },
        {
          "displayName": "Top P",
          "name": "body_top_p",
          "type": "number",
          "default": 0,
          "description": "An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered."
        }
      ]
    },
    {
      "displayName": "Product Id",
      "name": "path_product_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V1 > Open AI"
          ],
          "operation": [
            "Create Transcription"
          ]
        }
      },
      "required": true,
      "description": "*AI Tools* product identifier: use [GET `/1/ai`](/docs/api/get/1/ai) to retrieve your product identifier."
    },
    {
      "displayName": "File",
      "name": "body_file",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V1 > Open AI"
          ],
          "operation": [
            "Create Transcription"
          ]
        }
      },
      "required": true,
      "description": "The audio file to transcribe (50mo max, types : mp3,mp4,aac,wav,flac,ogg,opus,wma,m4a)"
    },
    {
      "displayName": "Model",
      "name": "body_model",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V1 > Open AI"
          ],
          "operation": [
            "Create Transcription"
          ]
        }
      },
      "required": true,
      "description": "Model name to use"
    },
    {
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V1 > Open AI"
          ],
          "operation": [
            "Create Transcription"
          ]
        }
      },
      "options": [
        {
          "displayName": "Append Punctuations",
          "name": "body_append_punctuations",
          "type": "string",
          "default": "",
          "description": "Only if timestamp_granularities[]:word is True, merge these punctuation symbols with the previous word"
        },
        {
          "displayName": "Chunk Length",
          "name": "body_chunk_length",
          "type": "number",
          "default": 0,
          "description": "Defines the maximum duration for an active segment in sec. For subtitle tasks, it's recommended to set this to a short duration (5-10 seconds) to avoid long sentences."
        },
        {
          "displayName": "Highlight Words",
          "name": "body_highlight_words",
          "type": "boolean",
          "default": false,
          "description": "Subtitle task. Underline each word as it is spoken in srt and vtt output formats (requires timestamp_granularities[]:word)"
        },
        {
          "displayName": "Language",
          "name": "body_language",
          "type": "options",
          "default": "",
          "description": "The language of the input audio. Supplying the input language will translate the output.",
          "options": [
            {
              "name": "af",
              "value": "af"
            },
            {
              "name": "am",
              "value": "am"
            },
            {
              "name": "ar",
              "value": "ar"
            },
            {
              "name": "as",
              "value": "as"
            },
            {
              "name": "az",
              "value": "az"
            },
            {
              "name": "ba",
              "value": "ba"
            },
            {
              "name": "be",
              "value": "be"
            },
            {
              "name": "bg",
              "value": "bg"
            },
            {
              "name": "bn",
              "value": "bn"
            },
            {
              "name": "bo",
              "value": "bo"
            },
            {
              "name": "br",
              "value": "br"
            },
            {
              "name": "bs",
              "value": "bs"
            },
            {
              "name": "ca",
              "value": "ca"
            },
            {
              "name": "cs",
              "value": "cs"
            },
            {
              "name": "cy",
              "value": "cy"
            },
            {
              "name": "da",
              "value": "da"
            },
            {
              "name": "de",
              "value": "de"
            },
            {
              "name": "el",
              "value": "el"
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
              "name": "et",
              "value": "et"
            },
            {
              "name": "eu",
              "value": "eu"
            },
            {
              "name": "fa",
              "value": "fa"
            },
            {
              "name": "fi",
              "value": "fi"
            },
            {
              "name": "fo",
              "value": "fo"
            },
            {
              "name": "fr",
              "value": "fr"
            },
            {
              "name": "gl",
              "value": "gl"
            },
            {
              "name": "gu",
              "value": "gu"
            },
            {
              "name": "ha",
              "value": "ha"
            },
            {
              "name": "haw",
              "value": "haw"
            },
            {
              "name": "he",
              "value": "he"
            },
            {
              "name": "hi",
              "value": "hi"
            },
            {
              "name": "hr",
              "value": "hr"
            },
            {
              "name": "ht",
              "value": "ht"
            },
            {
              "name": "hu",
              "value": "hu"
            },
            {
              "name": "hy",
              "value": "hy"
            },
            {
              "name": "id",
              "value": "id"
            },
            {
              "name": "is",
              "value": "is"
            },
            {
              "name": "it",
              "value": "it"
            },
            {
              "name": "ja",
              "value": "ja"
            },
            {
              "name": "jw",
              "value": "jw"
            },
            {
              "name": "ka",
              "value": "ka"
            },
            {
              "name": "kk",
              "value": "kk"
            },
            {
              "name": "km",
              "value": "km"
            },
            {
              "name": "kn",
              "value": "kn"
            },
            {
              "name": "ko",
              "value": "ko"
            },
            {
              "name": "la",
              "value": "la"
            },
            {
              "name": "lb",
              "value": "lb"
            },
            {
              "name": "ln",
              "value": "ln"
            },
            {
              "name": "lo",
              "value": "lo"
            },
            {
              "name": "lt",
              "value": "lt"
            },
            {
              "name": "lv",
              "value": "lv"
            },
            {
              "name": "mg",
              "value": "mg"
            },
            {
              "name": "mi",
              "value": "mi"
            },
            {
              "name": "mk",
              "value": "mk"
            },
            {
              "name": "ml",
              "value": "ml"
            },
            {
              "name": "mn",
              "value": "mn"
            },
            {
              "name": "mr",
              "value": "mr"
            },
            {
              "name": "ms",
              "value": "ms"
            },
            {
              "name": "mt",
              "value": "mt"
            },
            {
              "name": "my",
              "value": "my"
            },
            {
              "name": "ne",
              "value": "ne"
            },
            {
              "name": "nl",
              "value": "nl"
            },
            {
              "name": "nn",
              "value": "nn"
            },
            {
              "name": "no",
              "value": "no"
            },
            {
              "name": "oc",
              "value": "oc"
            },
            {
              "name": "pa",
              "value": "pa"
            },
            {
              "name": "pl",
              "value": "pl"
            },
            {
              "name": "ps",
              "value": "ps"
            },
            {
              "name": "pt",
              "value": "pt"
            },
            {
              "name": "ro",
              "value": "ro"
            },
            {
              "name": "ru",
              "value": "ru"
            },
            {
              "name": "sa",
              "value": "sa"
            },
            {
              "name": "sd",
              "value": "sd"
            },
            {
              "name": "si",
              "value": "si"
            },
            {
              "name": "sk",
              "value": "sk"
            },
            {
              "name": "sl",
              "value": "sl"
            },
            {
              "name": "sn",
              "value": "sn"
            },
            {
              "name": "so",
              "value": "so"
            },
            {
              "name": "sq",
              "value": "sq"
            },
            {
              "name": "sr",
              "value": "sr"
            },
            {
              "name": "su",
              "value": "su"
            },
            {
              "name": "sv",
              "value": "sv"
            },
            {
              "name": "sw",
              "value": "sw"
            },
            {
              "name": "ta",
              "value": "ta"
            },
            {
              "name": "te",
              "value": "te"
            },
            {
              "name": "tg",
              "value": "tg"
            },
            {
              "name": "th",
              "value": "th"
            },
            {
              "name": "tk",
              "value": "tk"
            },
            {
              "name": "tl",
              "value": "tl"
            },
            {
              "name": "tr",
              "value": "tr"
            },
            {
              "name": "tt",
              "value": "tt"
            },
            {
              "name": "uk",
              "value": "uk"
            },
            {
              "name": "ur",
              "value": "ur"
            },
            {
              "name": "uz",
              "value": "uz"
            },
            {
              "name": "vi",
              "value": "vi"
            },
            {
              "name": "yi",
              "value": "yi"
            },
            {
              "name": "yo",
              "value": "yo"
            },
            {
              "name": "yue",
              "value": "yue"
            },
            {
              "name": "zh",
              "value": "zh"
            }
          ]
        },
        {
          "displayName": "Max Line Count",
          "name": "body_max_line_count",
          "type": "number",
          "default": 0,
          "description": "Subtitle task. The maximum number of lines in a segment in srt and vtt output formats (requires timestamp_granularities[]:word)"
        },
        {
          "displayName": "Max Line Width",
          "name": "body_max_line_width",
          "type": "number",
          "default": 0,
          "description": "Subtitle task. The maximum number of characters in a line before breaking the line in srt and vtt output formats (requires timestamp_granularities[]:word)"
        },
        {
          "displayName": "Max Words Per Line",
          "name": "body_max_words_per_line",
          "type": "number",
          "default": 0,
          "description": "Subtitle task. The maximum number of words in a segment (requires timestamp_granularities[]:word)"
        },
        {
          "displayName": "No Speech Threshold",
          "name": "body_no_speech_threshold",
          "type": "number",
          "default": 0,
          "description": "If the no_speech probability is higher than this value AND the average log probability over sampled tokens is below `log_prob_threshold`, consider the segment as silent."
        },
        {
          "displayName": "Prepend Punctuations",
          "name": "body_prepend_punctuations",
          "type": "string",
          "default": "",
          "description": "Only if timestamp_granularities[]:word is True, merge these punctuation symbols with the next word"
        },
        {
          "displayName": "Prompt",
          "name": "body_prompt",
          "type": "string",
          "default": "",
          "description": "An optional text to guide the model's style or continue a previous audio segment. The prompt should match the audio language."
        },
        {
          "displayName": "Response Format",
          "name": "body_response_format",
          "type": "options",
          "default": "",
          "description": "The format of the transcript output (default: json)",
          "options": [
            {
              "name": "json",
              "value": "json"
            },
            {
              "name": "srt",
              "value": "srt"
            },
            {
              "name": "text",
              "value": "text"
            },
            {
              "name": "verbose_json",
              "value": "verbose_json"
            },
            {
              "name": "vtt",
              "value": "vtt"
            }
          ]
        },
        {
          "displayName": "Timestamp Granularities",
          "name": "body_timestamp_granularities",
          "type": "json",
          "default": {},
          "description": "The timestamp granularities to populate for this transcription. Either or both of these options are supported: word, or segment. Requires `response_format=verbose_json`. Defaults to segment."
        }
      ]
    },
    {
      "displayName": "Product Id",
      "name": "path_product_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V1 > Open AI"
          ],
          "operation": [
            "Create Image"
          ]
        }
      },
      "required": true,
      "description": "*AI Tools* product identifier: use [GET `/1/ai`](/docs/api/get/1/ai) to retrieve your product identifier."
    },
    {
      "displayName": "Model",
      "name": "body_model",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V1 > Open AI"
          ],
          "operation": [
            "Create Image"
          ]
        }
      },
      "required": true,
      "description": "Model name to use"
    },
    {
      "displayName": "Prompt",
      "name": "body_prompt",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V1 > Open AI"
          ],
          "operation": [
            "Create Image"
          ]
        }
      },
      "required": true,
      "description": "A text description of the desired image(s). The maximum length is 77 tokens"
    },
    {
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V1 > Open AI"
          ],
          "operation": [
            "Create Image"
          ]
        }
      },
      "options": [
        {
          "displayName": "N",
          "name": "body_n",
          "type": "number",
          "default": 0,
          "description": "The number of images to generate (default: 1)"
        },
        {
          "displayName": "Negative Prompt",
          "name": "body_negative_prompt",
          "type": "string",
          "default": "",
          "description": "The prompt does not guide the image generation. The maximum length is 77 tokens, Note that the \"sdxl_lightning\" and \"flux\" model does not support this feature."
        },
        {
          "displayName": "Quality",
          "name": "body_quality",
          "type": "options",
          "default": "",
          "description": "The quality of the image that will be generated (default: standard)",
          "options": [
            {
              "name": "hd",
              "value": "hd"
            },
            {
              "name": "standard",
              "value": "standard"
            }
          ]
        },
        {
          "displayName": "Response Format",
          "name": "body_response_format",
          "type": "options",
          "default": "",
          "description": "The format in which the generated images are returned. Currently, only 'b64_json' is supported as the response format",
          "options": [
            {
              "name": "b64_json",
              "value": "b64_json"
            },
            {
              "name": "url",
              "value": "url"
            }
          ]
        },
        {
          "displayName": "Size",
          "name": "body_size",
          "type": "options",
          "default": "",
          "description": "The size of the generated images.",
          "options": [
            {
              "name": "1024x1024",
              "value": "1024x1024"
            },
            {
              "name": "1024x1792",
              "value": "1024x1792"
            },
            {
              "name": "1792x1024",
              "value": "1792x1024"
            }
          ]
        },
        {
          "displayName": "Style",
          "name": "body_style",
          "type": "options",
          "default": "",
          "description": "Change the style to guidance for the generation",
          "options": [
            {
              "name": "cinematic",
              "value": "cinematic"
            },
            {
              "name": "comic_book",
              "value": "comic_book"
            },
            {
              "name": "digital_art",
              "value": "digital_art"
            },
            {
              "name": "disney_charactor",
              "value": "disney_charactor"
            },
            {
              "name": "enhance",
              "value": "enhance"
            },
            {
              "name": "fantasy_art",
              "value": "fantasy_art"
            },
            {
              "name": "line_art",
              "value": "line_art"
            },
            {
              "name": "lowpoly",
              "value": "lowpoly"
            },
            {
              "name": "neonpunk",
              "value": "neonpunk"
            },
            {
              "name": "photographic",
              "value": "photographic"
            }
          ]
        },
        {
          "displayName": "Sync",
          "name": "body_sync",
          "type": "boolean",
          "default": false
        }
      ]
    },
    {
      "displayName": "Product Id",
      "name": "path_product_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V1 > Open AI"
          ],
          "operation": [
            "Create Embeddings"
          ]
        }
      },
      "required": true,
      "description": "*AI Tools* product identifier: use [GET `/1/ai`](/docs/api/get/1/ai) to retrieve your product identifier."
    },
    {
      "displayName": "Input",
      "name": "body_input",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V1 > Open AI"
          ],
          "operation": [
            "Create Embeddings"
          ]
        }
      },
      "required": true,
      "description": "Input text to embed. Is can be string, array of string, array of int (for tokenize sentence), array of array of int (batch of tokenize sentence)"
    },
    {
      "displayName": "Model",
      "name": "body_model",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V1 > Open AI"
          ],
          "operation": [
            "Create Embeddings"
          ]
        }
      },
      "required": true,
      "description": "Model name to use"
    },
    {
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V1 > Open AI"
          ],
          "operation": [
            "Create Embeddings"
          ]
        }
      },
      "options": [
        {
          "displayName": "Encoding Format",
          "name": "body_encoding_format",
          "type": "options",
          "default": "",
          "description": "The encoding format of the returned embeddings. Defaults to float.",
          "options": [
            {
              "name": "base64",
              "value": "base64"
            },
            {
              "name": "float",
              "value": "float"
            }
          ]
        },
        {
          "displayName": "Mode",
          "name": "body_mode",
          "type": "options",
          "default": "",
          "description": "Specify the mode of the embedding request.",
          "options": [
            {
              "name": "index",
              "value": "index"
            },
            {
              "name": "query",
              "value": "query"
            }
          ]
        },
        {
          "displayName": "Task Description",
          "name": "body_task_description",
          "type": "string",
          "default": "",
          "description": "Optional set your custom task information in query mode"
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
            "Usage > V2 > Open AI"
          ]
        }
      },
      "options": [
        {
          "name": "Create Chat Completion",
          "value": "Create Chat Completion"
        },
        {
          "name": "List Models",
          "value": "List Models"
        },
        {
          "name": "Create Embeddings",
          "value": "Create Embeddings"
        }
      ],
      "default": "Create Chat Completion",
      "noDataExpression": true
    },
    {
      "displayName": "Product Id",
      "name": "path_product_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V2 > Open AI"
          ],
          "operation": [
            "Create Chat Completion"
          ]
        }
      },
      "required": true,
      "description": "*AI Tools* product identifier: use [GET `/1/ai`](/docs/api/get/1/ai) to retrieve your product identifier."
    },
    {
      "displayName": "Messages",
      "name": "body_messages",
      "type": "json",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V2 > Open AI"
          ],
          "operation": [
            "Create Chat Completion"
          ]
        }
      },
      "required": true
    },
    {
      "displayName": "Model",
      "name": "body_model",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V2 > Open AI"
          ],
          "operation": [
            "Create Chat Completion"
          ]
        }
      },
      "required": true,
      "description": "Model name used to generate the response, like `qwen3` or `swiss-ai/Apertus-70B-Instruct-2509`. Infomaniak offers a wide range of models with different capabilities, performance characteristics, and price points. Use the endpoint [GET `/1/ai/models?with=pricing`](/docs/api/get/1/ai/models) to retrieve the models list with various informations."
    },
    {
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V2 > Open AI"
          ],
          "operation": [
            "Create Chat Completion"
          ]
        }
      },
      "options": [
        {
          "displayName": "Logit Bias",
          "name": "body_logit_bias",
          "type": "json",
          "default": {},
          "description": "Modify the likelihood of specified tokens appearing in the completion. Accepts a JSON object that maps tokens (specified by their token ID in the tokenizer) to an associated bias value from -100 to 100. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token."
        },
        {
          "displayName": "Logprobs",
          "name": "body_logprobs",
          "type": "boolean",
          "default": false,
          "description": "Whether to return log probabilities of the output tokens or not. If true, returns the log probabilities of each output token returned in the <code>content</code> of <code>message</code>."
        },
        {
          "displayName": "Max Completion Tokens",
          "name": "body_max_completion_tokens",
          "type": "number",
          "default": 0,
          "description": "An upper bound for the number of tokens that can be generated for a completion, including visible output tokens and <a href=\"https://platform.openai.com/docs/guides/reasoning\">reasoning tokens</a>."
        },
        {
          "displayName": "N",
          "name": "body_n",
          "type": "number",
          "default": 0,
          "description": "<b>Unused</b><br>How many chat completion choices to generate for each input message. Note that you will be charged based on the number of generated tokens across all of the choices. Keep <code>n</code> as <code>1</code> to minimize costs."
        },
        {
          "displayName": "Parallel Tool Calls",
          "name": "body_parallel_tool_calls",
          "type": "boolean",
          "default": false,
          "description": "<i>Defaults to</i> <code>true</code><br>Whether to enable <a href=\"https://platform.openai.com/docs/guides/function-calling#configuring-parallel-function-calling\">parallel function calling</a> during tool use."
        },
        {
          "displayName": "Presence Penalty",
          "name": "body_presence_penalty",
          "type": "number",
          "default": 0,
          "description": "<i>Defaults to</i> <code>0</code><br>The number should be above -2.0 but below 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics."
        },
        {
          "displayName": "Reasoning Effort",
          "name": "body_reasoning_effort",
          "type": "string",
          "default": "",
          "description": "<i>Defaults to</i> <code>\"medium\"</code><br>Constrains effort on reasoning for reasoning models. Currently supported values are <code>minimal</code>, <code>low</code>, <code>medium</code>, and <code>high</code>. Reducing reasoning effort can result in faster responses and fewer tokens used on reasoning in a response."
        },
        {
          "displayName": "Response Format",
          "name": "body_response_format",
          "type": "json",
          "default": {},
          "description": "An object specifying the format that the model must output.<br>Setting to <code>{ \"type\": \"json_schema\", \"json_schema\": {...} }</code> enables Structured Outputs which ensures the model will match your supplied JSON schema. Learn more in the <a href=\"https://platform.openai.com/docs/guides/structured-outputs\">Structured Outputs guide</a>.<br>Setting to <code>{ \"type\": \"json_object\" }</code> enables the older JSON mode, which ensures the message the model generates is valid JSON. Using <code>json_schema</code> is preferred for models that support it."
        },
        {
          "displayName": "Seed",
          "name": "body_seed",
          "type": "number",
          "default": 0,
          "description": "<b>Deprecated</b><br>This feature is in Beta. If specified, our system will make a best effort to sample deterministically, such that repeated requests with the same <code>seed</code> and parameters should return the same result. Determinism is not guaranteed, and you should refer to the <code>system_fingerprint</code> response parameter to monitor changes in the backend."
        },
        {
          "displayName": "Stop",
          "name": "body_stop",
          "type": "string",
          "default": "",
          "description": "<i>Defaults to</i> <code>null</code><br>Up to 4 sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence."
        },
        {
          "displayName": "Stream",
          "name": "body_stream",
          "type": "boolean",
          "default": false,
          "description": "<i>Defaults to</i> <code>true</code><br>If set to true, the model response data will be streamed to the client as it is generated using <a href=\"https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format\">server-sent events</a>. See the <a href=\"https://platform.openai.com/docs/api-reference/chat/streaming\">OpenAI streaming section</a> for more information, along with the <a href=\"https://platform.openai.com/docs/guides/streaming-responses\">OpenAI streaming responses guide</a> for more information on how to handle the streaming events."
        },
        {
          "displayName": "Stream Options",
          "name": "body_stream_options",
          "type": "json",
          "default": {},
          "description": "<i>Defaults to</i> <code>null</code><br>Options for streaming response. Only set this when you set <code>stream: true</code>."
        },
        {
          "displayName": "Temperature",
          "name": "body_temperature",
          "type": "number",
          "default": 0,
          "description": "<i>Defaults to</i> <code>1</code><br>What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. We generally recommend altering this or <code>top_p</code> but not both."
        },
        {
          "displayName": "Tool Choice",
          "name": "body_tool_choice",
          "type": "string",
          "default": "",
          "description": "Controls which (if any) tool is called by the model. <code>none</code> means the model will not call any tool and instead generates a message. <code>auto</code> means the model can pick between generating a message or calling one or more tools. <code>required</code> means the model must call one or more tools. Specifying a particular tool via <code>{\"type\": \"function\", \"function\": {\"name\": \"my_function\"}}</code> forces the model to call that tool.<br><code>none</code> is the default when no tools are present. <code>auto</code> is the default if tools are present.See the OpenAI documentation about <a href=\"https://platform.openai.com/docs/api-reference/chat/create#chat-create-tool_choice\"><code>tool_choice</code></a>."
        },
        {
          "displayName": "Tools",
          "name": "body_tools",
          "type": "json",
          "default": {},
          "description": "A list of tools the model may call. You can provide either <a href=\"https://platform.openai.com/docs/guides/function-calling#custom-tools\">custom tools</a> or <a href=\"https://platform.openai.com/docs/guides/function-calling\">function tools</a>.<br>See the OpenAI documentation about <a href=\"https://platform.openai.com/docs/api-reference/chat/create#chat-create-tools\"><code>tools</code></a>."
        },
        {
          "displayName": "Top Logprobs",
          "name": "body_top_logprobs",
          "type": "number",
          "default": 0,
          "description": "An integer between 0 and 20 specifying the number of most likely tokens to return at each token position, each with an associated log probability."
        },
        {
          "displayName": "Top P",
          "name": "body_top_p",
          "type": "number",
          "default": 0,
          "description": "<i>Defaults to</i> <code>1</code><br>An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.<br>We generally recommend altering this or <code>temperature</code> but not both."
        },
        {
          "displayName": "User",
          "name": "body_user",
          "type": "string",
          "default": "",
          "description": "<b>Deprecated</b><br>This field is being replaced by <code>safety_identifier</code> and <code>prompt_cache_key</code>. Use <code>prompt_cache_key</code> instead to maintain caching optimizations. A stable identifier for your end-users. Used to boost cache hit rates by better bucketing similar requests and to help OpenAI detect and prevent abuse."
        }
      ]
    },
    {
      "displayName": "Product Id",
      "name": "path_product_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V2 > Open AI"
          ],
          "operation": [
            "List Models"
          ]
        }
      },
      "required": true,
      "description": "*AI Tools* product identifier: use [GET `/1/ai`](/docs/api/get/1/ai) to retrieve your product identifier."
    },
    {
      "displayName": "Product Id",
      "name": "path_product_id",
      "type": "number",
      "default": 0,
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V2 > Open AI"
          ],
          "operation": [
            "Create Embeddings"
          ]
        }
      },
      "required": true,
      "description": "*AI Tools* product identifier: use [GET `/1/ai`](/docs/api/get/1/ai) to retrieve your product identifier."
    },
    {
      "displayName": "Input",
      "name": "body_input",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V2 > Open AI"
          ],
          "operation": [
            "Create Embeddings"
          ]
        }
      },
      "required": true,
      "description": "Input text to embed, encoded as a string or array of tokens. To embed multiple inputs in a single request, pass an array of strings or array of token arrays. The input must not exceed the max input tokens for the model (8192 tokens for all embedding models), cannot be an empty string, and any array must be 2048 dimensions or less. [Example Python code](https://cookbook.openai.com/examples/how_to_count_tokens_with_tiktoken) for counting tokens. In addition to the per-input token limit, all embedding models enforce a maximum of 300,000 tokens summed across all inputs in a single request."
    },
    {
      "displayName": "Model",
      "name": "body_model",
      "type": "string",
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V2 > Open AI"
          ],
          "operation": [
            "Create Embeddings"
          ]
        }
      },
      "required": true,
      "description": "Model name to use. You can use the endpoint [GET `/1/ai/models?with=pricing`](/docs/api/get/1/ai/models) to see all our available models with various informations."
    },
    {
      "displayName": "Additional Body Fields",
      "name": "bodyParameters",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "displayOptions": {
        "show": {
          "resource": [
            "Usage > V2 > Open AI"
          ],
          "operation": [
            "Create Embeddings"
          ]
        }
      },
      "options": [
        {
          "displayName": "Dimensions",
          "name": "body_dimensions",
          "type": "number",
          "default": 0,
          "description": "The number of dimensions the resulting output embeddings should have. May not be supported by all the available models."
        },
        {
          "displayName": "Encoding Format",
          "name": "body_encoding_format",
          "type": "string",
          "default": "",
          "description": "*Defaults to* `float`<br>The format to return the embeddings in. Can be either `float` or `base64`."
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
            "Product Management > Consumptions"
          ],
          "operation": [
            "List All Consumptions"
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
            "Product Management > Consumptions"
          ],
          "operation": [
            "List All Consumptions"
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
