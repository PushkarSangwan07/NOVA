# NOVA — Backend API

Node.js + Express + MongoDB (Mongoose) backend for NOVA, a team project management app.

## Stack
- Express
- MongoDB / Mongoose
- JWT auth (short-lived access token in response body, refresh token in httpOnly cookie)
- bcryptjs for password hashing

## Setup

```bash
npm install
cp .env.example .env   # fill in MONGO_URI and JWT secrets
npm run dev             # requires nodemon (npm install -g nodemon), or: npm start
```

## Folder structure

```
config/db.js              MongoDB connection
models/                   Mongoose schemas: User, Project, Task, Comment
middleware/auth.js         JWT verification (protect)
middleware/projectAccess.js  Membership / ownership checks for project routes
controllers/               Route handler logic
routes/                    Express routers
server.js                  App entry point
```

## API overview

### Auth — `/api/auth`
| Method | Route      | Body                          | Notes                     |
|--------|-----------|--------------------------------|----------------------------|
| POST   | /register | name, email, password          | Returns accessToken + user |
| POST   | /login    | email, password                 | Returns accessToken + user |
| POST   | /refresh  | (refreshToken cookie)           | Returns new accessToken    |
| POST   | /logout   | —                                | Clears refresh cookie      |
| GET    | /me       | — (Bearer token required)       | Current user profile       |

### Projects — `/api/projects` (all require Bearer token)
| Method | Route                          | Notes                          |
|--------|--------------------------------|---------------------------------|
| GET    | /                               | Projects the user is a member of|
| POST   | /                               | Create project (creator = owner)|
| GET    | /:projectId                     | Project detail                  |
| PATCH  | /:projectId                     | Update name/description         |
| DELETE | /:projectId                     | Owner only                      |
| GET    | /:projectId/progress            | Task counts + % complete        |
| POST   | /:projectId/members             | Owner only — add by email       |
| DELETE | /:projectId/members/:userId     | Owner only                      |

### Tasks — `/api/projects/:projectId/tasks`
| Method | Route          | Notes                              |
|--------|---------------|--------------------------------------|
| GET    | /              | List tasks for the project           |
| POST   | /              | Create task                          |
| PATCH  | /:taskId       | Update task (status change auto-logs to activity feed) |
| DELETE | /:taskId       | Delete task                          |

### Comments/activity — `/api/projects/:projectId/tasks/:taskId/comments`
| Method | Route | Notes                                 |
|--------|-------|-----------------------------------------|
| GET    | /     | Comments + system activity, oldest first|
| POST   | /     | Add a comment                           |

## Auth flow notes
All routes except `/api/auth/*` expect `Authorization: Bearer <accessToken>`.
Access tokens are short-lived (15m default); call `/api/auth/refresh` (cookie sent automatically by the browser) to get a new one when it expires.

## Deployment
Set these env vars on your host (Render/Railway): `MONGO_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL` (your deployed frontend origin), `NODE_ENV=production`.
