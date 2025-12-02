# urbanMeet - Full-Stack Platform Complete ✅

## What Was Built

A complete Meetup-like platform for tech meetups, hackathons, and study groups targeting college students and developers.

### Tech Stack
- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + Glassmorphism UI
- **State Management**: TanStack Query (React Query)
- **Backend**: Express + TypeScript + Prisma ORM
- **Database**: MySQL (local)
- **Auth**: JWT-based authentication with bcrypt

---

## Project Structure

```
urbanMeet/
├── server/              # Express backend API
│   ├── src/
│   │   ├── index.ts           # Server entry
│   │   ├── prisma.ts          # Prisma client
│   │   ├── middleware/auth.ts # JWT auth middleware
│   │   └── routes/
│   │       ├── auth.ts        # Register/Login/Me
│   │       ├── users.ts       # Profile endpoints
│   │       ├── groups.ts      # Groups CRUD + join/leave
│   │       ├── events.ts      # Events CRUD + RSVP
│   │       └── comments.ts    # Event comments
│   ├── prisma/
│   │   └── schema.prisma      # Database schema (MySQL)
│   ├── .env                   # DB connection + secrets
│   └── package.json
│
└── client/              # Next.js frontend
    ├── app/
    │   ├── layout.tsx         # Root layout with QueryProvider + Navbar
    │   ├── page.tsx           # Home (events feed with filters)
    │   ├── landing/page.js    # Landing page hero
    │   ├── auth/
    │   │   ├── login/page.tsx
    │   │   └── register/page.tsx
    │   ├── profile/page.tsx   # Profile view + edit
    │   ├── groups/
    │   │   ├── page.tsx       # Groups list
    │   │   ├── create/page.tsx
    │   │   └── [id]/page.tsx  # Group detail + events
    │   ├── events/
    │   │   ├── create/page.tsx
    │   │   └── [id]/page.tsx  # Event detail + RSVP + comments
    │   └── dashboard/page.tsx # Organizer dashboard
    ├── components/
    │   ├── Navbar.tsx         # Top nav with auth state
    │   ├── EventCard.tsx      # Glassmorphism event card
    │   ├── SearchFilters.tsx  # City/date filters
    │   ├── Footer.tsx
    │   └── Skeletons.tsx
    ├── lib/
    │   ├── api.ts             # Axios API client
    │   └── queryClient.tsx    # React Query setup
    └── package.json

```

---

## Running the Platform

### Backend (Port 4001)

```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
PORT=4001 npx ts-node-dev --respawn --transpile-only src/index.ts
```

✅ Server runs at **http://localhost:4001**  
✅ Health check: `GET /api/health`

### Frontend (Port 3000)

```bash
cd client
npm install
NEXT_PUBLIC_API_URL=http://localhost:4001 npm run dev
```

✅ App runs at **http://localhost:3000**

---

## Core Features Implemented

### ✅ Auth & Profiles
- **Register**: POST /api/auth/register (email, password, name)
- **Login**: POST /api/auth/login → returns JWT token
- **Profile**: GET/PATCH /api/users/me (edit name, bio, city, interests)
- JWT stored in localStorage, sent as `Authorization: Bearer <token>`

### ✅ Groups
- **List**: GET /api/groups?city=&search= (paginated)
- **Detail**: GET /api/groups/:id (with members + events)
- **Create**: POST /api/groups (auth required)
- **Update/Delete**: PATCH/DELETE /api/groups/:id (owner only)
- **Join**: POST /api/groups/:id/join
- **Leave**: POST /api/groups/:id/leave

### ✅ Events
- **List**: GET /api/events?city=&from=&to= (filterable)
- **Detail**: GET /api/events/:id (with attendees + comments)
- **Create**: POST /api/events (requires groupId, auth)
- **Update/Delete**: PATCH/DELETE /api/events/:id
- **RSVP**: POST /api/events/:id/rsvp?status=going|interested
- **Cancel RSVP**: DELETE /api/events/:id/rsvp

### ✅ Comments
- **List**: GET /api/:eventId/comments
- **Post**: POST /api/:eventId/comments (auth required)

### ✅ Discovery & Search
- Home feed with upcoming events
- Search filters (city, date range)
- Event cards with glassmorphism styling

### ✅ Interactions
- RSVP (going/interested) with optimistic updates
- Threaded comments on events
- Attendee count display

---

## UI/UX Highlights

### Glassmorphism Theme
- **Colors**: Black/pink-500/white gradients
- **Effects**: `backdrop-blur-md`, `bg-white/20` overlays
- **Animations**: Hover scale transforms on cards

### Key Pages
1. **Landing** (`/landing`): Hero with CTA buttons
2. **Home** (`/`): Events grid + search filters
3. **Event Detail** (`/events/:id`): RSVP buttons + comments
4. **Group Page** (`/groups/:id`): Cover, description, events list, join button
5. **Dashboard** (`/dashboard`): Stats + create group link
6. **Profile** (`/profile`): Edit bio, city, name

### Responsive Design
- Mobile-first grid layout
- Navbar adapts to auth state (Login/Logout button)
- Cards stack on small screens

---

## Database Schema (MySQL)

```prisma
User {
  id, email, password, name, avatarUrl, bio, city, interests (JSON)
  groups (GroupMember[])
  eventsAttending (EventAttendee[])
  ownedGroups (Group[])
  comments (Comment[])
}

Group {
  id, name, description, city, coverImage, ownerId
  members (GroupMember[])
  events (Event[])
}

Event {
  id, groupId, title, description, startsAt, endsAt, venue, address, city, capacity, imageUrl
  attendees (EventAttendee[])
  comments (Comment[])
}

GroupMember { userId, groupId, role, joinedAt }
EventAttendee { userId, eventId, status }
Comment { id, eventId, userId, content, createdAt }
```

---

## API Endpoints Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Create account | No |
| POST | /api/auth/login | Get JWT | No |
| GET | /api/auth/me | Current user | Bearer |
| GET | /api/users/me | Profile | Bearer |
| PATCH | /api/users/me | Update profile | Bearer |
| GET | /api/groups | List groups | No |
| POST | /api/groups | Create group | Bearer |
| GET | /api/groups/:id | Group detail | No |
| PATCH | /api/groups/:id | Update group | Bearer (owner) |
| DELETE | /api/groups/:id | Delete group | Bearer (owner) |
| POST | /api/groups/:id/join | Join group | Bearer |
| POST | /api/groups/:id/leave | Leave group | Bearer |
| GET | /api/events | List events | No |
| POST | /api/events | Create event | Bearer |
| GET | /api/events/:id | Event detail | No |
| PATCH | /api/events/:id | Update event | Bearer |
| DELETE | /api/events/:id | Delete event | Bearer |
| POST | /api/events/:id/rsvp | RSVP to event | Bearer |
| DELETE | /api/events/:id/rsvp | Cancel RSVP | Bearer |
| GET | /api/:eventId/comments | List comments | No |
| POST | /api/:eventId/comments | Post comment | Bearer |

---

## Testing the Platform (Quick Flow)

1. **Register**: Go to `/auth/register` → create account
2. **Login**: Redirects to home → JWT saved in localStorage
3. **Create Group**: `/groups/create` → enter name, city, description
4. **View Group**: Click group card → see detail page
5. **Create Event**: In group page → "Create Event" → fill form
6. **RSVP**: Go to event detail → click "RSVP: Going"
7. **Comment**: Scroll to comments → type and post
8. **Profile**: `/profile` → click "Edit" → update bio/city

---

## What's Next (Phase 2 - Optional)

### Integrations Not Yet Implemented
- [ ] **Cloudinary**: Image uploads for events/groups
- [ ] **Resend**: Email notifications (RSVPs, reminders)
- [ ] **Stripe**: Paid event tickets
- [ ] **NextAuth**: Google OAuth + Prisma adapter

### Advanced Features
- [ ] QR code check-in for events
- [ ] CSV export of attendees
- [ ] Event views analytics
- [ ] Recommendations based on interests
- [ ] In-app notifications

---

## Notes & Troubleshooting

### Port Usage
- Backend runs on **4001** (not 4000, which was already in use)
- Frontend runs on **3000**
- Update `NEXT_PUBLIC_API_URL` if backend port changes

### MySQL Connection
- Database: `urbanMeetup`
- User: `root`
- Password: `underxcore` (from .env)
- Update `.env` if credentials differ

### Import Paths
- All client imports use `@/` alias (defined in tsconfig)
- Example: `import API from '@/lib/api'`

### TypeScript Errors
- React Query v5 requires object syntax: `useQuery({ queryKey, queryFn })`
- All page components using hooks are marked `"use client"`

---

## Summary

✅ **MVP Complete** - All core features working:
- Auth (register/login/profile)
- Groups (create/join/leave/list)
- Events (create/RSVP/filter/search)
- Comments (post/view)
- Dashboard (organizer view)

✅ **Backend** - Express + Prisma + MySQL fully functional  
✅ **Frontend** - Next.js 15 + React Query + Tailwind with glassmorphism  
✅ **Both servers running** and tested

Live Link - https://urban-meet.vercel.app/
