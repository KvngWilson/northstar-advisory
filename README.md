# NorthStar Advisory — AngularJS + MongoDB/File storage

Based on https://github.com/KvngWilson/northstar-advisory. Preserves the original client record fields, overview, directory and profile pages. EJS is replaced with AngularJS 1.8 and JSON API endpoints. The original sample data is retained.

## Requirements
Node.js 20+, npm; MongoDB only for MongoDB mode.

## Setup
```bash
npm install
cp .env.example .env
npm start
```
Open http://localhost:3000. Default `STORAGE_DRIVER=file` reads `data/clients.json` on every API request; editing the file is reflected on refresh.

## MongoDB mode
Start a local MongoDB instance, then set `STORAGE_DRIVER=mongodb` and `MONGODB_URI=mongodb://127.0.0.1:27017/northstar` in `.env`.
```bash
npm run seed
npm start
```
Seeding upserts the supplied sample clients by their stable `id` without deleting other documents. File and MongoDB are **alternative** persistence drivers, not automatic replicas; editing the JSON file will not update MongoDB. Switching modes changes which data is shown.

## API
- `GET /api/clients` — client directory
- `GET /api/clients/:id` — client profile, or JSON 404
- `GET /api/metrics` — aggregate metrics

Invalid file data and unavailable databases return controlled JSON 500 errors. File writes can be performed with `fileStore.replaceAll(records)` using a temporary file and atomic rename; there is intentionally no public mutation endpoint because the original portal is read-only.

## Security / limitations
AngularJS 1.x is end-of-life and should not be selected for new production financial applications. This is a legacy-framework migration demonstration, not a production-ready client portal. No authentication, authorization, audit log, encryption strategy, or financial data protections are provided. Use only fictional data.

## Tests
`npm test` (Node built-in test runner).
