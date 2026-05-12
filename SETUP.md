# Asset Management System - Setup Guide

## Overview
This is a full-stack Asset Management System built with Next.js 16, React 19, and Supabase PostgreSQL.

## Environment Setup

### 1. Environment Variables
Add the following environment variables to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://qvovgksgadkfahpqfvcj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 2. Database Setup

#### Option A: Using Supabase Console (Recommended)
1. Go to your Supabase project dashboard
2. Open the SQL Editor
3. Copy and paste the entire content from `/scripts/init-db.sql`
4. Run the SQL script to create all tables and indexes

#### Option B: Using the Initialization Endpoint
Once the server is running, call the initialization endpoint:

```bash
curl -X POST http://localhost:3000/api/admin/init-data \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
```

This will populate the database with sample vendors, employees, and assets.

## Running the Application

### Development
```bash
pnpm install
pnpm dev
```

The app will start at `http://localhost:3000`

### Production Build
```bash
pnpm build
pnpm start
```

## Project Structure

### Frontend Routes
- `/` - Redirects to dashboard
- `/dashboard` - Main dashboard with KPIs
- `/assets` - Asset inventory management
- `/allocations` - Asset allocation and tracking
- `/warranty` - Warranty management and tracking
- `/repairs` - Repair and maintenance tickets
- `/reports` - Reports and analytics
- `/employees` - Employee management
- `/settings` - System settings

### API Routes
- `GET/POST /api/assets` - Asset CRUD operations
- `GET/PUT/DELETE /api/assets/[id]` - Single asset operations
- `GET/POST /api/allocations` - Allocation management
- `GET/POST /api/repairs` - Repair tickets
- `GET/POST /api/warranty` - Warranty tracking
- `GET/POST /api/employees` - Employee management
- `POST /api/admin/init-data` - Initialize with sample data

### Key Files
- `/lib/supabase.ts` - Supabase client setup
- `/lib/types.ts` - TypeScript interfaces
- `/lib/hooks/use-api.ts` - Data fetching hooks using SWR
- `/components/app-shell.tsx` - Main layout component
- `/scripts/init-db.sql` - Database schema

## Database Schema

### Tables
1. **vendors** - Vendor information for repairs and warranties
2. **employees** - Employee records
3. **assets** - Master asset inventory
4. **asset_allocations** - Employee-asset assignments
5. **repairs** - Repair and maintenance tickets
6. **warranty_tracking** - Warranty status and expiry tracking
7. **asset_documents** - Uploaded documents (invoices, warranty cards, etc.)
8. **asset_status_logs** - Audit trail of asset status changes
9. **users** - System users and their roles

## Features Implemented

### Core Features
✅ Asset Inventory Management (CRUD)
✅ Asset Allocation Workflow
✅ Warranty Tracking with expiry alerts
✅ Repair & Maintenance Ticket System
✅ Reports and Analytics with CSV export
✅ Dashboard with KPI metrics
✅ Employee Management
✅ System Settings

### Asset Status Lifecycle
- In Stock
- Allocated
- Under Diagnosis
- Under Repair
- Repaired
- Replacement Initiated
- Replaced
- Returned
- Damaged
- Scrap/Disposed

### Data Fetching Strategy
- Uses SWR for client-side caching and real-time data syncing
- Server-side API routes handle all database operations
- Automatic revalidation on focus/visibility changes

## Authentication & Authorization
Currently using public/private API routes. For production:
1. Implement Supabase Auth for user authentication
2. Add Row Level Security (RLS) policies
3. Validate user roles in API routes
4. Implement proper session management

## File Upload (Future)
Ready to integrate with Vercel Blob for document storage. Update:
1. `asset_documents.document_url` to store blob URLs
2. Add file upload handler in `/api/assets/[id]/documents`

## Troubleshooting

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check that environment variables are loaded
- Ensure service role key has proper permissions

### Data Not Loading
- Check browser console for API errors
- Verify API routes are accessible at `/api/...`
- Check Supabase logs for SQL errors

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `pnpm install`
- Rebuild: `pnpm dev`

## Next Steps

1. **User Authentication**: Implement Supabase Auth
2. **File Uploads**: Add document upload with Vercel Blob
3. **Email Notifications**: Set up warranty expiry reminders
4. **Advanced Reporting**: Add charts and analytics
5. **QR Code Generation**: Auto-generate QR codes for assets
6. **Mobile App**: Build React Native version

## Support
For issues or questions, check:
- Supabase documentation: https://supabase.com/docs
- Next.js documentation: https://nextjs.org/docs
- API response logs in browser DevTools
