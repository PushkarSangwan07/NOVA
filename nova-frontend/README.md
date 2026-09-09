# NOVA — Frontend

React (Vite) + Tailwind frontend for NOVA.

## Setup

```bash
npm install
cp .env.example .env      # point VITE_API_URL at your backend
npm run dev                # http://localhost:5173
```

Requires the NOVA backend running (see nova-backend README) with `CLIENT_URL` set to this app's origin so CORS + cookies work.

## Structure

```
src/api/axios.js            Axios instance: attaches Bearer token, silently
                             refreshes it on 401 using the httpOnly cookie
src/context/AuthContext.jsx Session state: login/register/logout, bootstraps
                             from the refresh cookie on page load
src/components/             Navbar, ProjectCard, TaskCard, ProgressBar,
                             NewProjectModal, NewTaskModal, TaskDetailModal,
                             InviteMemberModal, ProtectedRoute
src/pages/
  Login.jsx / Register.jsx   Auth screens
  Dashboard.jsx              Project list + create project
  ProjectBoard.jsx           Kanban board (To do / In progress / Done),
                             progress bar, team panel, task detail w/ comments
```

## How auth works end-to-end
1. Login/register returns an access token (kept in memory only, not localStorage) and sets an httpOnly refresh cookie.
2. Every API request attaches the access token as a Bearer header.
3. On a 401 (expired token), the axios interceptor calls `/auth/refresh` once, gets a new access token, and retries the original request — the user never sees a failed request.
4. On page reload, `AuthContext` calls `/auth/refresh` on mount to restore the session from the cookie.

## Design notes
Visual identity: deep indigo (`#2F3C7E`) as the one brand color, warm amber for in-progress/priority, teal for done — so board columns read at a glance without relying on labels alone. Display type is Fraunces (used only for page titles / the login hero), body and UI text is IBM Plex Sans, and IBM Plex Mono is reserved for small data — dates, assignee names on cards — to visually separate "data" from "content."

## Deployment
Deploy to Vercel/Netlify. Set `VITE_API_URL` to your deployed backend's `/api` URL, and make sure the backend's `CLIENT_URL` env var matches this app's deployed origin exactly (cookies require it).
