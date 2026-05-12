# Asset Management System - Quick Start Guide

## 🚀 Getting Started (5 minutes)

### Step 1: Set Environment Variables
Your environment variables are already configured. If you need to check them:
```
NEXT_PUBLIC_SUPABASE_URL=https://qvovgksgadkfahpqfvcj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-key>
```

### Step 2: Create Database Tables
Copy the entire SQL script from `/scripts/init-db.sql` and run it in your Supabase SQL Editor:
1. Go to: https://app.supabase.com/project/qvovgksgadkfahpqfvcj/sql/new
2. Paste the contents of `scripts/init-db.sql`
3. Click "Run"

### Step 3: Start the Development Server
```bash
pnpm dev
```
The app will be available at http://localhost:3000

### Step 4: Initialize Sample Data (Optional)
```bash
curl -X POST http://localhost:3000/api/admin/init-data \
  -H "Authorization: Bearer <YOUR_SERVICE_ROLE_KEY>"
```
This will add sample vendors, employees, and assets.

## 📋 Core Workflows

### Adding a New Asset
1. Navigate to `/assets`
2. Click "Add Asset"
3. Fill in required fields:
   - Asset ID (unique identifier)
   - Asset Type (Laptop, Monitor, etc.)
   - Serial Number
   - Other details as needed
4. Click "Save Asset"

### Allocating Assets to Employees
1. Go to `/allocations`
2. Click "New Allocation"
3. Select asset and employee
4. Set allocation date and expected return date
5. Save

### Tracking Repairs
1. Go to `/repairs`
2. Click "New Repair Ticket"
3. Link to asset, describe problem, select vendor
4. Track status through workflow: Open → In Progress → Completed → Closed

### Monitoring Warranty
1. Go to `/warranty`
2. View all warranty expiry dates
3. System auto-alerts for:
   - 90 days before expiry
   - 30 days before expiry
   - On expiry date

### Generating Reports
1. Go to `/reports`
2. Select report type
3. Choose filters (optional)
4. Click "Export as CSV"

## 🔌 API Endpoints Reference

### Assets
- `GET /api/assets` - List all assets
- `POST /api/assets` - Create asset
- `GET /api/assets/[id]` - Get single asset
- `PUT /api/assets/[id]` - Update asset
- `DELETE /api/assets/[id]` - Delete asset

**Query Parameters:**
- `status` - Filter by asset status
- `search` - Search by ID, serial, brand
- `type` - Filter by asset type

### Allocations
- `GET /api/allocations` - List allocations
- `POST /api/allocations` - Create allocation
- `PUT /api/allocations/[id]` - Update allocation
- `DELETE /api/allocations/[id]` - Delete allocation

**Query Parameters:**
- `status` - Filter by status
- `employeeId` - Filter by employee

### Repairs
- `GET /api/repairs` - List repairs
- `POST /api/repairs` - Create repair ticket
- `PUT /api/repairs/[id]` - Update repair
- `DELETE /api/repairs/[id]` - Delete repair

**Query Parameters:**
- `status` - Filter by status

### Warranty
- `GET /api/warranty` - List warranty records
- `POST /api/warranty` - Create warranty record

**Query Parameters:**
- `status` - 'active', 'expired', 'expiring_soon'

### Employees
- `GET /api/employees` - List employees
- `POST /api/employees` - Create employee

**Query Parameters:**
- `search` - Search by name, email, employee_id
- `department` - Filter by department

### Reports
- `GET /api/reports/export` - Export reports

**Query Parameters:**
- `type` - 'inventory', 'allocations', 'warranty', 'repairs'

## 📊 Dashboard Overview
The dashboard shows:
- **KPI Cards**: Total assets, allocated, available, in repair, warranty alerts, damaged, scrap
- **Expiring Warranties**: Assets with warranty expiring soon
- **Recent Repairs**: Latest repair tickets
- **Asset Status Summary**: Breakdown of asset statuses

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| `assets` | Master inventory of all IT assets |
| `employees` | Employee records for allocations |
| `asset_allocations` | Track which employee has which asset |
| `repairs` | Repair and maintenance tickets |
| `warranty_tracking` | Monitor warranty expiry dates |
| `asset_documents` | Store uploaded invoices, warranties |
| `asset_status_logs` | Audit trail of asset changes |
| `vendors` | Vendor/service provider information |
| `users` | System users and roles |

## 🔐 Authentication
Currently uses API route auth. For production, implement:
1. Supabase Auth (recommended)
2. Row Level Security (RLS) policies
3. JWT validation in API routes

## 🐛 Troubleshooting

### Assets not loading
- Check browser console for errors
- Verify Supabase URL and keys in environment
- Check Supabase SQL Editor for errors

### Can't save asset
- Verify all required fields are filled
- Check unique constraints (asset_id, serial_number)
- Check browser console for API response

### Dashboard showing 0 assets
- Initialize sample data with `/api/admin/init-data`
- Or add assets manually via `/assets` page

## 📈 Next Steps
1. **Add Authentication**: Implement Supabase Auth
2. **File Uploads**: Upload invoices/warranty cards
3. **QR Codes**: Generate QR codes for quick asset lookup
4. **Notifications**: Email alerts for warranty expiry
5. **Mobile App**: React Native version

## 📚 Documentation
- Full Setup Guide: See `SETUP.md`
- Database Schema: See `scripts/init-db.sql`
- API Routes: See `app/api/` directory

## 💬 Support
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Check browser console for detailed error messages

---

**Happy Asset Managing!** 🎉
