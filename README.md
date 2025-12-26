# n8n-nodes-infomaniak

Pack de nœuds communautaires n8n pour l’API Infomaniak. Un nœud par produit, avec UI Resource/Operation et champs dédiés, généré depuis les spécifications OpenAPI locales (dossier `api/`).

## Fonctionnalités

- Couverture complète : Mail, kDrive, kChat, Streaming, Newsletter, etc.
- Un nœud par produit : “Infomaniak Mail”, “Infomaniak kDrive”, etc.
- UI propre (Resource/Operation + champs dédiés).
- OAuth2 + API Key.
- Pagination automatique (limit/skip ou page/per_page), gestion des erreurs et du rate limiting (retry/backoff).

## Pré-requis

- n8n v1+.
- Compte Infomaniak + accès API.
- Crédentials OAuth2 ou clé API.

## Installation locale

```bash
npm install
npm run build
```

Ensuite, installez le package dans votre instance n8n (mode custom/community node) :

```bash
npm install /chemin/vers/n8n-nodes-infomaniak
```

## Configuration des credentials

### OAuth2

- Authorization URL : `https://login.infomaniak.com/authorize`
- Token URL : `https://login.infomaniak.com/token`
- Scopes recommandés : `mail domain web` (ajoutez les scopes requis par l’endpoint)

### API Key

Utilise l’en-tête `Authorization: Bearer <API_KEY>`.

## Utilisation

1. Ajouter le nœud du produit (ex. “Infomaniak Mail”).
2. Choisir **Resource** puis **Operation**.
3. Renseigner les champs requis (path/query/body) directement dans l’UI.

## Pagination

- `Return All Pages` active la pagination automatique si l’endpoint expose `limit/skip` ou `page/per_page`.
- Sinon, utilisez `Limit` et les paramètres de pagination dans `Query Parameters`.

## Exemples

- `examples/workflows/list-domains.json`
- `examples/workflows/create-mailbox.json`

## Notes d’implémentation

- Retry automatique sur `429/503/504` (backoff progressif + respect du `Retry-After`).
- Timeouts HTTP à 30s.
- Les specs OpenAPI sont copiées dans `dist/api` lors du build.
- La génération des nœuds est automatisée via `scripts/generate-nodes.js`.

## Licence

MIT. Voir `LICENSE`.
