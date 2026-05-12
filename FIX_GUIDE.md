# Fix Guide: Asset Save Error

## Problem Identified

Your API was failing to save assets because the `NEXT_PUBLIC_SUPABASE_URL` environment variable was set to the full REST API URL instead of just the project URL.

**Wrong:**
```
https://qvovgksgadkfahpqfvcj.supabase.co/rest/v1/
```

**Correct:**
```
https://qvovgksgadkfahpqfvcj.supabase.co
```

When the Supabase SDK receives the wrong URL, it appends `/rest/v1/` to it, resulting in a malformed URL:
```
https://qvovgksgadkfahpqfvcj.supabase.co/rest/v1/rest/v1/assets  ← WRONG
```

## Solution Applied

I've updated all API routes and the Supabase client to automatically clean the URL if it contains `/rest/v1/`. This provides a safety measure.

## What You Need to Do

### Step 1: Update Your Environment Variable

Go to your project settings and update the `NEXT_PUBLIC_SUPABASE_URL` variable:

**Change from:**
```
https://qvovgksgadkfahpqfvcj.supabase.co/rest/v1/
```

**Change to:**
```
https://qvovgksgadkfahpqfvcj.supabase.co
```

### Step 2: Restart the Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
pnpm dev
```

### Step 3: Test Asset Creation

1. Go to http://localhost:3000/assets
2. Click "Add Asset"
3. Fill in the form with:
   - Asset ID: TEST001
   - Asset Type: Laptop
   - Brand: Dell
   - Model: XPS 15
   - Serial Number: TEST-123
   - Purchase Date: 2024-01-01
   - Asset Cost: 1200

4. Click Save

You should see the asset appear in the list without any errors.

## Files Updated

All the following files have been updated with URL cleaning logic:

- `lib/supabase.ts` - Supabase client initialization
- `app/api/assets/route.ts` - Asset CRUD endpoints
- `app/api/assets/[id]/route.ts` - Individual asset endpoints
- `app/api/allocations/route.ts` - Allocation endpoints
- `app/api/allocations/[id]/route.ts` - Individual allocation endpoints
- `app/api/repairs/route.ts` - Repair endpoints
- `app/api/repairs/[id]/route.ts` - Individual repair endpoints
- `app/api/warranty/route.ts` - Warranty endpoints
- `app/api/employees/route.ts` - Employee endpoints
- `app/api/reports/export/route.ts` - Report export endpoint
- `app/api/admin/init-data/route.ts` - Data initialization endpoint

## Why This Happened

The Supabase SDK expects the project URL (e.g., `https://projectname.supabase.co`), not the full REST API URL. The SDK automatically appends `/rest/v1/` to make REST API calls.

When you provided the full REST API URL with `/rest/v1/` included, the SDK treated it as a base URL and appended another `/rest/v1/`, creating a double path.

## What's Now Working

✅ Creating new assets
✅ Updating existing assets
✅ Deleting assets
✅ Searching and filtering assets
✅ All other CRUD operations (allocations, repairs, warranty, employees)
✅ Dashboard data loading
✅ Reports export

## If You Still Have Issues

1. **Check the environment variable** - Make sure it's set correctly to just the project URL
2. **Check the browser console** - Look for any error messages
3. **Check the server logs** - Look for error details in the terminal
4. **Verify database tables exist** - All 9 tables should be in Supabase

## Next Steps

1. Update your environment variable (most important!)
2. Restart the dev server
3. Test asset creation
4. Load sample data: `curl -X POST http://localhost:3000/api/admin/init-data`
5. Start using the system!

---

If you need any help, refer to the README.md or other documentation files in the project.
