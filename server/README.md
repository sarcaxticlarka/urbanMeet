# urbanMeet Server (Express + TypeScript + Prisma)

This server implements a REST API for the urbanMeet project using Express, TypeScript and Prisma (Postgres).

Quick start

1. Install dependencies

```bash
cd server
npm install
```

2. Configure env

Edit `.env` if necessary. The default expects Postgres at:

```
DATABASE_URL="postgresql://postgres:underxcore@localhost:5432/urbanMeetup?schema=public"
JWT_SECRET="change_this_jwt_secret_to_a_secure_one"
PORT=4000
```

3. Generate Prisma client and migrate

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Start dev server

```bash
npm run dev
```

API routes (overview)

- POST /api/auth/register { email, password, name }
- POST /api/auth/login { email, password }
- GET /api/auth/me (Bearer token)
- GET/PATCH /api/users/me
- GET /api/groups?city=&search=
- GET/POST/PATCH/DELETE /api/groups/:id
- POST /api/groups/:id/join
- POST /api/groups/:id/leave
- GET /api/events?city=&from=&to=
- GET/POST/PATCH/DELETE /api/events/:id
- POST /api/events/:id/rsvp?status=going
- DELETE /api/events/:id/rsvp
- GET /api/:eventId/comments
- POST /api/:eventId/comments

Notes

- The Prisma schema includes an optional `password` field for credential-based auth. Social logins can keep it null.
- You should set a strong `JWT_SECRET` in production.
