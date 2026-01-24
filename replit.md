# Team Portal - Suprans Business CRM

## Overview
A comprehensive team portal and CRM system for Suprans Business Consulting. The application includes:
- **Sales CRM**: Lead management, pipeline tracking, activities, and performance analytics
- **HR Portal**: Employee management, attendance, leave requests, recruitment, and candidate tracking
- **Events Management**: Event planning, attendees, vendors, and venue comparisons
- **Public Website**: Company information, services, travel packages, and contact forms

## User Credentials
- **Admin**: admin@suprans.com / admin123
- **Sales Executive**: sales@suprans.com / sales123

## Tech Stack
- **Frontend**: React, Vite, TypeScript, TailwindCSS, Shadcn/ui
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based with passport.js

## Project Structure
```
client/
├── src/
│   ├── components/
│   │   ├── dialogs/      # Modal dialogs for various actions
│   │   ├── layout/       # App shell, sidebar, header
│   │   ├── modals/       # Search and sign-out modals
│   │   ├── public/       # Public website components
│   │   └── ui/           # Shadcn UI components
│   ├── pages/
│   │   ├── admin/        # Admin dashboard pages
│   │   ├── events/       # Event management pages
│   │   ├── hr/           # HR portal pages
│   │   ├── knowledge/    # Knowledge base
│   │   ├── public/       # Public website pages
│   │   ├── resources/    # Templates and resources
│   │   └── training/     # LMS and recordings
│   ├── lib/
│   │   ├── api.ts        # API client
│   │   ├── store.ts      # Zustand state management
│   │   └── queryClient.ts
│   └── assets/images/    # Static images
server/
├── auth.ts               # Authentication logic
├── db.ts                 # Database connection
├── routes.ts             # API endpoints
├── storage.ts            # Database storage layer
└── seed scripts          # Database seeding
shared/
└── schema.ts             # Drizzle schema definitions
```

## Database Tables
35 tables including: users, leads, activities, tasks, services, templates, employees, travel_packages, events, event_attendees, event_hotels, event_flights, hr_employees, candidates, job_openings, and more.

## Routes
- `/` - Public homepage
- `/services` - Public services page
- `/travel` - Travel packages
- `/about` - About page
- `/contact` - Contact page
- `/team` - Team portal dashboard (requires login)
- `/team/login` - Login page
- `/team/leads` - Lead management
- `/team/pipeline` - Sales pipeline
- `/team/tasks` - Task management
- `/team/hr/*` - HR portal pages
- `/team/events/*` - Event management pages
- `/team/admin/*` - Admin pages (superadmin only)

## Recent Changes
- January 2026: Imported from GitHub repository (replit-agent branch)
- All 35 database tables created and seeded
- Initial user accounts created

## Development
Run `npm run dev` to start the development server on port 5000.
