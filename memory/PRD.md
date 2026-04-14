# HR Analytics & Report System - PRD

## Project Overview
Next.js 14+ App Router frontend for an HR Analytics and Report system with BFF (Backend for Frontend) pattern.

## Architecture
- **Frontend**: Next.js 14 App Router + TypeScript + Tailwind CSS + Shadcn/ui
- **Backend**: Express.js 5 + Prisma (PostgreSQL) + BullMQ (Redis) + JWT (separate service, not modified)
- **State Management**: TanStack Query v5 (server state), Zustand (UI state), React Hook Form + Zod (forms)
- **Auth**: httpOnly cookies via BFF pattern (Next.js API routes)
- **Mocking**: MSW v2 for development when Express backend is unavailable

## User Types
1. **B2C** (Regular end-users) - public-facing, SEO matters
2. **B2B** (Business partners) - authenticated dashboard
3. **Admin** (Internal staff) - CMS, users, roles management

## Core Requirements (Static)
- Triple auth system (B2C, B2B, Admin login pages)
- BFF layer for secure token handling (httpOnly cookies)
- Middleware-based route protection with role-based redirects
- RBAC with permission tree from backend
- User CRUD (admin)
- Role CRUD with permission management (admin)
- Profile management

## What's Been Implemented (Jan 2026)
### Auth System
- [x] B2C Login (`/login`) with split-screen design
- [x] Admin Login (`/admin/login`) with dark theme
- [x] B2B Login (`/b2b/login`) with business portal design
- [x] Registration (`/register`)
- [x] Forgot Password (`/forgot-password`) with email sent confirmation
- [x] Email Verification (`/verify-email`)

### BFF Routes (under `/bff/` prefix)
- [x] `/bff/auth/login` - Login with httpOnly cookie setting
- [x] `/bff/auth/logout` - Logout with cookie clearing
- [x] `/bff/auth/refresh` - Token refresh
- [x] `/bff/auth/register` - Registration proxy
- [x] `/bff/auth/session` - Session check
- [x] `/bff/auth/action` - Generic auth actions (forgot password, etc.)
- [x] `/bff/proxy/[...path]` - Authenticated proxy to Express backend

### Protected Pages
- [x] Users management (`/users`) - DataTable with search, CRUD, role assignment
- [x] Roles management (`/roles`) - DataTable with permission tree, CRUD, delete confirmation
- [x] Profile (`/profile`) - View & edit profile, avatar initials, role badge

### Common Components
- [x] Sidebar with navigation (Profile, Users, Roles)
- [x] Navbar with user dropdown (Profile, Logout)
- [x] DataTable with pagination, search, actions
- [x] All Shadcn/ui components (Radix-based, Tailwind 3 compatible)

### Infrastructure
- [x] MSW handlers for all Express API endpoints
- [x] Next.js instrumentation for server-side MSW
- [x] Middleware for route protection with role-based redirects
- [x] TanStack Query provider with global config
- [x] Zustand store for UI state (sidebar toggle)

## API Endpoints Consumed
| Method | Express Endpoint | BFF Route |
|--------|-----------------|-----------|
| POST | /api/v1/auth/login | /bff/auth/login |
| POST | /api/v1/auth/register | /bff/auth/register |
| POST | /api/v1/auth/refresh-token | /bff/auth/refresh |
| POST | /api/v1/auth/logout | /bff/auth/logout |
| GET | /api/v1/profile | /bff/proxy/profile |
| PUT | /api/v1/profile | /bff/proxy/profile |
| GET | /api/v1/users | /bff/proxy/users |
| POST | /api/v1/users | /bff/proxy/users |
| PUT | /api/v1/users/:slug | /bff/proxy/users/:slug |
| GET | /api/v1/roles | /bff/proxy/roles |
| POST | /api/v1/roles | /bff/proxy/roles |
| PUT | /api/v1/roles/:slug | /bff/proxy/roles/:slug |
| DELETE | /api/v1/roles/:slug | /bff/proxy/roles/:slug |
| GET | /api/v1/roles/access-list | /bff/proxy/roles/access-list |

## Prioritized Backlog
### P0 (Critical)
- Connect to real Express.js backend (replace MSW with actual API calls)
- Production build optimization (change `yarn start` from `next dev` to `next build && next start`)

### P1 (Important)
- Dashboard page with analytics widgets and charts
- Activity history/log page
- User soft-delete support
- Avatar upload in profile
- SSR for SEO-critical public pages

### P2 (Nice to have)
- Dark mode support
- Responsive mobile optimization
- Email notification preferences
- Batch user operations
- Export data to CSV/PDF

## Technical Notes
- BFF routes use `/bff/` prefix instead of `/api/` to avoid Kubernetes ingress routing conflicts in preview environment
- In production with Nginx reverse proxy, routes should be at `/api/auth/*` as per original spec
- MSW is enabled via `NEXT_PUBLIC_ENABLE_MOCKING=true` env variable
- Cookie names: `hr_access_token`, `hr_refresh_token`
