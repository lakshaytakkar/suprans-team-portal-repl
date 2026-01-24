# Team Portal - Suprans Business CRM

## Overview
A comprehensive team portal and CRM system for Suprans Business Consulting. The application includes:
- **Sales CRM**: Lead management, pipeline tracking, activities, and performance analytics
- **HR Portal**: Employee management, attendance, leave requests, recruitment, and candidate tracking
- **Events Management**: Event planning, attendees, vendors, and venue comparisons
- **Faire Wholesale**: Wholesale order management, product catalog, suppliers, and store management
- **LLC Clients**: LLC formation tracking, document management, bank applications, and client timeline
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
45+ tables including:
- Core: users, leads, activities, tasks, services, templates, employees
- Travel: travel_packages, travel_bookings
- Events: events, event_attendees, event_hotels, event_flights, event_vendors, event_vendor_items
- HR: hr_employees, candidates, job_openings, interviews, attendance, leave_requests
- Faire: faire_stores, faire_suppliers, faire_products, faire_product_variants, faire_orders, faire_order_items, faire_shipments
- LLC: llc_banks, llc_document_types, llc_clients, llc_client_documents, llc_client_timeline

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
- `/team/faire/orders` - Faire order management
- `/team/faire/products` - Faire product catalog
- `/team/faire/stores` - Faire store management
- `/team/faire/suppliers` - Faire supplier management
- `/team/admin/*` - Admin pages (superadmin only)

## API Endpoints
### Faire Wholesale
- `GET/POST /api/faire/stores` - List/create stores
- `GET/PATCH/DELETE /api/faire/stores/:id` - Get/update/delete store
- `GET/POST /api/faire/suppliers` - List/create suppliers
- `GET/PATCH/DELETE /api/faire/suppliers/:id` - Get/update/delete supplier
- `GET/POST /api/faire/products` - List/create products
- `GET/PATCH/DELETE /api/faire/products/:id` - Get/update/delete product
- `GET/PATCH /api/faire/orders` - List/update orders
- `GET/POST /api/faire/shipments` - List/create shipments

### LLC Clients
- `GET /api/llc/banks` - List available banks
- `GET/POST /api/llc/clients` - List/create clients
- `GET/PATCH/DELETE /api/llc/clients/:id` - Get/update/delete client
- `GET/POST /api/llc/clients/:clientId/documents` - List/create documents
- `GET /api/llc/clients/:clientId/timeline` - Get client timeline

## Recent Changes
- January 2026: Imported from GitHub repository (replit-agent branch)
- January 24, 2026: Added Faire Wholesale management (stores, suppliers, products, orders)
- January 24, 2026: Added LLC Clients module (banks, clients, documents, timeline)
- Database tables expanded to 45+ tables
- API routes with Zod validation and CRUD operations

## Development
Run `npm run dev` to start the development server on port 5000.
