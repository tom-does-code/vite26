# Momentum

A task and budget tracker built with a React + TypeScript frontend and an ASP.NET Core Web API backend.

You sign up, add tasks with priorities, categories and due dates, watch your completion rate and
streak build up on the statistics page, and track what you earned and spent each month. Preferences
like theme and accent colour are stored per account, so they follow you between devices.

## Tech stack

**Frontend**

- React 19 with TypeScript
- Vite
- React Router for routing and route guards
- CSS Modules with custom properties for theming
- Material Symbols for icons

**Backend**

- ASP.NET Core 8 Web API (controllers)
- Entity Framework Core 8 with SQLite
- JWT bearer authentication
- `PasswordHasher<T>` for password storage
- xUnit for tests

## Running it locally

You need the [.NET 8 SDK](https://dotnet.microsoft.com/download) and [Node 20+](https://nodejs.org).

Start the API first:

```bash
cd server/Momentum.Api && dotnet run
```

It listens on `http://localhost:5080` and creates `momentum.db` on first run by applying the EF Core
migrations, so there is no database to set up. Swagger is at `http://localhost:5080/swagger` in
development.

Then start the frontend in a second terminal:

```bash
npm install && npm run dev
```

The app runs on `http://localhost:5173`. If that port is busy Vite moves to 5174 or 5175, which the
API also accepts. If you host the API somewhere else, copy `.env.example` to `.env` and point
`VITE_API_URL` at it, and add your frontend URL to `Frontend:Origins` in `appsettings.json` so CORS
lets it through.

## Tests

```bash
cd server && dotnet test
```

24 tests cover the task filtering and sorting rules, ownership checks (one account cannot read or
delete another account's data), password hashing and login failures, the streak and completion rate
maths, and the budget category totals.

## Project layout

```
src/                        React frontend
  Frontend/
    Api/                    fetch wrapper, auth token handling, shared types
    Components/             reusable UI, including the settings tabs
    Context/                auth, preferences and toast providers
    Pages/                  one file per route
    Styles/                 CSS modules
    Utils/                  date and currency formatting
server/
  Momentum.Api/
    Controllers/            auth, tasks, stats, profile, account, budget
    Data/                   DbContext and migrations
    Dtos/                   request and response shapes
    Models/                 EF Core entities
    Services/               JWT token creation
  Momentum.Api.Tests/       xUnit tests
```

## API

Everything except register and login needs an `Authorization: Bearer <token>` header.

| Method | Route | What it does |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an account and return a token |
| POST | `/api/auth/login` | Log in and return a token |
| GET | `/api/auth/me` | The signed in user |
| GET | `/api/tasks` | List tasks, with `search`, `priority`, `category`, `status` and `sortBy` |
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks/{id}` | A single task |
| PUT | `/api/tasks/{id}` | Update a task |
| PATCH | `/api/tasks/{id}/toggle` | Flip a task between done and active |
| DELETE | `/api/tasks/{id}` | Delete a task |
| DELETE | `/api/tasks/completed` | Delete every completed task |
| GET | `/api/tasks/categories` | Categories the user has used |
| GET | `/api/stats` | Totals, completion rate, streak and 14 day activity |
| GET | `/api/profile` | Profile details |
| PUT | `/api/profile` | Update profile details |
| GET | `/api/profile/preferences` | Theme, accent, task defaults |
| PUT | `/api/profile/preferences` | Save preferences |
| PUT | `/api/account/email` | Change the login email |
| PUT | `/api/account/password` | Change the password |
| DELETE | `/api/account` | Delete the account and everything on it |
| GET | `/api/budget` | Monthly summary, breakdown and entries |
| POST | `/api/budget` | Add an income or expense entry |
| DELETE | `/api/budget/{id}` | Remove an entry |

## Notes

Every query is scoped to the user id taken from the JWT rather than an id sent by the client, so one
account cannot reach another account's tasks or budget entries. Deleting a user cascades to their
tasks, profile and budget entries.

The JWT signing key in `appsettings.json` is a development placeholder. Anything deployed for real
should supply its own through environment variables or user secrets.
