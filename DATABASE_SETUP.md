# Database Setup Guide - Asset Management System

## Problem: "Failed to save asset" Error

This error occurs because your Supabase database tables have not been created yet. Follow these steps to initialize your database.

---

## Step 1: Access Supabase SQL Editor

1. Go to your Supabase project: https://qvovgksgadkfahpqfvcj.supabase.co
2. Sign in with your credentials
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

---

## Step 2: Copy and Run the Database Schema

1. Open the file: `/vercel/share/v0-project/scripts/init-db.sql`
2. Copy ALL the SQL code
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)

**Expected Result:** All tables created successfully with no errors

---

## Step 3: Verify Tables Were Created

In Supabase:
1. Go to **Table Editor** in the left sidebar
2. You should see these 9 tables:
   - `vendors`
   - `employees`
   - `assets`
   - `asset_allocations`
   - `repairs`
   - `warranty_tracking`
   - `asset_documents`
   - `asset_status_logs`
   - `users`

If you don't see these tables, the SQL script didn't run successfully. Check for error messages.

---

## Step 4: Test the Connection

In your terminal:
```bash
cd /vercel/share/v0-project
pnpm dev
```

Then open http://localhost:3000/assets and try to add an asset.

---

## Step 5: Load Initial Data (Optional)

Once the tables are created, you can load sample data:

```bash
curl -X POST http://localhost:3000/api/admin/init-data \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
```

Replace `YOUR_SERVICE_ROLE_KEY` with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2b3Zna3NnYWRrZmFocHFmdmNqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODU1Njg5NiwiZXhwIjoyMDk0MTMyODk2fQ.l1uJvw67WSqwDSXLk0OeuVr_2r8F1JqHWqJBhLoobNo`

---

## Troubleshooting

### Error: "relation "assets" does not exist"
**Solution:** The tables haven't been created. Run the SQL script from Step 2.

### Error: "Failed to save asset"
**Solution:** Check the browser console (F12) for detailed error messages.

### Tables were created but still getting errors
**Solution:** 
1. Refresh your browser (Ctrl+F5)
2. Restart the dev server: `pnpm dev`
3. Try adding an asset again

### Environment variables are not set
**Solution:** Check that these are set in your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://qvovgksgadkfahpqfvcj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2b3Zna3NnYWRrZmFocHFmdmNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NTY4OTYsImV4cCI6MjA5NDEzMjg5Nn0.Gqai9WgEfXz9gIE4T-00vbwbEqs5ICf302IEuLqbjKA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2b3Zna3NnYWRrZmFocHFmdmNqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODU1Njg5NiwiZXhwIjoyMDk0MTMyODk2fQ.l1uJvw67WSqwDSXLk0OeuVr_2r8F1JqHWqJBhLoobNo
```

---

## Database Schema Overview

### Assets Table
- Stores all IT assets with 20+ fields
- Tracks purchase date, warranty, cost, and status
- Status values: `in_stock`, `allocated`, `under_diagnosis`, `under_repair`, `repaired`, `replacement_initiated`, `replaced`, `returned`, `damaged`, `scrap`

### Asset Allocations Table
- Tracks which employee has which asset
- Includes allocation date and return date
- Supports employee acknowledgement

### Repairs Table
- Tracks maintenance and repair tickets
- Includes problem description, vendor, and cost
- Status workflow: `open` → `in_progress` → `completed` → `closed`

### Warranty Tracking Table
- Monitors warranty expiry dates
- Tracks notification dates (90-day, 30-day alerts)
- Supports warranty renewal

### Other Tables
- **Vendors**: Service providers and manufacturers
- **Employees**: Employee directory
- **Asset Documents**: Uploaded files for assets
- **Asset Status Logs**: Audit trail of status changes
- **Users**: System users and roles

---

## Quick Test

After setting up:

1. Go to http://localhost:3000/assets
2. Click "Add Asset"
3. Fill in:
   - Asset ID: `LAPTOP-001`
   - Asset Type: `Laptop`
   - Brand: `Dell`
   - Model Number: `XPS 15`
   - Serial Number: `SN12345`
   - Asset Cost: `1500`
   - Purchase Date: `2024-01-15`
4. Click "Save"

Expected: Asset is created successfully and appears in the list.

---

## Next Steps

Once the database is set up:

1. Add real assets to your inventory
2. Create employees
3. Start allocating assets
4. Track warranty expirations
5. Log repairs and maintenance

For any issues, check the browser console (F12) for detailed error messages and refer to this guide.
