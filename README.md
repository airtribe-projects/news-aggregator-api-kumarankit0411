# News Aggregator API

Backend assignment for Airtribe. Users can sign up, set their news preferences, and get personalized articles from NewsAPI.org. Also supports marking articles as read/favoriting them.

## Setup

```bash
git clone <repo-url>
cd news-aggregator-api
npm install
```

You'll need a News API key from [newsapi.org](https://newsapi.org). Create a `.env` file:

```
PORT=3000
JWT_SECRET=your-secret
JWT_EXPIRES_IN=1h
NEWS_API_KEY=your-key
```

## Running

```bash
npm start      # production
npm run dev    # nodemon
npm test       # run tests
```

## How It Works

All requests (except signup/login) need a JWT token:

```
Authorization: Bearer <token>
```

### User Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/signup` | Register. Body: `{ name, email, password, preferences }` |
| POST | `/users/login` | Login. Body: `{ email, password }`. Returns token. |
| GET | `/users/preferences` | Get your preferences |
| PUT | `/users/preferences` | Update preferences. Body: `{ preferences: ["tech", "sports"] }` |

### News Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/news` | Get news based on your preferences |
| GET | `/news/search/:keyword` | Search news |
| POST | `/news/:id/read` | Mark article as read |
| POST | `/news/:id/favorite` | Mark article as favorite |
| GET | `/news/read` | List read articles |
| GET | `/news/favorites` | List favorited articles |

## Project Layout

```
server.js                # entry point
app.js                   # express app
app/
  config/                # env config
  models/                # data shape + in-memory storage
  services/              # business logic, external API calls
  controllers/           # route handlers
  routes/                # express routers
  middleware/            # auth, error handling
test/
  server.test.js         # all tests
```

## Testing

36 tests covering signup, login, preferences, news fetching, caching, article interactions, search, and auth. Run with:

```bash
npm test
```

Uses `tap` + `supertest`.
