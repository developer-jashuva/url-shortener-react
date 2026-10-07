# Secure URL Shortener — React UI

React (Vite) frontend for the [Secure URL Shortener API](https://github.com/developer-jashuva/SecureUrlShortener).
Shorten a link, copy it, see click counts per link, and delete links.

## Tech
React 18, Vite, plain CSS, Fetch API

## Run locally
```
npm install
cp .env.example .env.local   # set VITE_API_URL to your running API
npm run dev
```

## API used
| Action | Request |
|---|---|
| Shorten | `POST /api/url/shorten` with `{ "originalUrl": "..." }` |
| List | `GET /api/url/all` |
| Delete | `DELETE /api/url/{code}` |

Field names from the API are mapped in one place: `src/api.js` (`normalize`).

## Notes
- The backend must allow this app's origin in CORS.
- Clicks are counted only when someone opens the short link, not the original URL.
