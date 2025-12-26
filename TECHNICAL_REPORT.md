# Rapport technique - n8n Infomaniak Node

## Objectif

Fournir un pack de nœuds n8n couvrant l’ensemble des endpoints Infomaniak via les spécifications OpenAPI locales (dossier `api/`) avec authentification OAuth2 + clé API, gestion des erreurs et pagination.

## Choix d’implémentation

- SDK n8n : utilisation de `@n8n/node-cli`, `n8n-workflow` et `this.helpers.requestWithAuthentication`.
- Authentification :
  - OAuth2 via `https://login.infomaniak.com/authorize` et `https://login.infomaniak.com/token`.
  - API key via header `Authorization: Bearer <token>`.
- Couverture complète via catalogue OpenAPI :
  - Un nœud par produit (`api/infomaniak_api_*.json`).
  - UI Resource/Operation avec champs dédiés (path/query/body).
- Pagination : auto-détection `limit/skip` ou `page/per_page`.
- Erreurs : levées via `NodeApiError` quand le HTTP est en échec ou quand l’API renvoie un `result` non `success`.
- Rate limiting : retry simple sur `429/503/504` avec backoff (1s, 2s, 3s + respect du Retry-After si présent).

## Compatibilité

- API Infomaniak (base `https://api.infomaniak.com`).
- n8n v1+ (community node API version 1).

## Limites connues

- Les schemas de réponse ne sont pas validés localement.

## Tests

- Tests unitaires ciblant les helpers de pagination et parsing (Vitest).
- Prévoir des tests d’intégration avec un compte de test Infomaniak si besoin.

## Conformité licence

- Projet sous licence MIT.
