# n8n-nodes-infomaniak

Community n8n node pack for the Infomaniak API. One node per product, with Resource/Operation UI and dedicated fields, generated from local OpenAPI specifications (in the `api/` folder).

## Features

- Complete coverage: Mail, kDrive, kChat, Streaming, Newsletter, etc.
- One node per product: "Infomaniak Mail", "Infomaniak kDrive", etc.
- Clean UI (Resource/Operation + dedicated fields).
- OAuth2 + API Key authentication.
- Automatic pagination (limit/skip or page/per_page), error handling and rate limiting (retry/backoff).

## Prerequisites

- n8n v1+.
- Infomaniak account + API access.
- OAuth2 credentials or API key.

## Installation

The package is available via npm at https://www.npmjs.com/package/n8n-nodes-infomaniak-api

To add it to n8n, simply search for `n8n-nodes-infomaniak-api` in the community nodes section of n8n.

### Local Installation (for development)

```bash
npm install
npm run build
```

Then, install the package in your n8n instance (custom/community node mode):

```bash
npm install /path/to/n8n-nodes-infomaniak
```

## Credentials Configuration

### OAuth2

- Authorization URL: `https://login.infomaniak.com/authorize`
- Token URL: `https://login.infomaniak.com/token`
- Recommended scopes: `mail domain web` (add the scopes required by the endpoint)

### API Key

Uses the `Authorization: Bearer <API_KEY>` header.

## Usage

1. Add the product node (e.g., "Infomaniak Mail").
2. Select **Resource** then **Operation**.
3. Fill in the required fields (path/query/body) directly in the UI.

## Pagination

- `Return All Pages` enables automatic pagination if the endpoint exposes `limit/skip` or `page/per_page`.
- Otherwise, use `Limit` and pagination parameters in `Query Parameters`.

## Examples

- `examples/workflows/list-domains.json`
- `examples/workflows/create-mailbox.json`

## Implementation Notes

- Automatic retry on `429/503/504` (progressive backoff + respect for `Retry-After`).
- HTTP timeouts set to 30s.
- OpenAPI specs are copied to `dist/api` during build.
- Node generation is automated via `scripts/generate-nodes.js`.

## License

MIT. See `LICENSE`.
