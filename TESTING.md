# Asset Management System - Testing Guide

## ✅ Pre-Deployment Testing Checklist

### 1. Database Setup Verification

```sql
-- Run in Supabase SQL Editor to verify tables exist:

SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Should show:
-- assets
-- asset_allocations
-- asset_documents
-- asset_status_logs
-- employees
-- repairs
-- users
-- vendors
-- warranty_tracking
```

### 2. Sample Data Initialization

#### Option A: Using API (Recommended)
```bash
curl -X POST http://localhost:3000/api/admin/init-data \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"

# Expected response:
# {
#   "success": true,
#   "message": "Initial data loaded successfully",
#   "counts": {
#     "vendors": 4,
#     "employees": 4,
#     "assets": 4
#   }
# }
```

#### Option B: Using SQL
Copy the sample data SQL into Supabase SQL Editor:

```sql
-- Insert Vendors
INSERT INTO vendors (name, contact_person, email, phone, repair_provider, warranty_provider)
VALUES 
  ('Dell', 'John Smith', 'sales@dell.com', '+1-800-123-4567', true, true),
  ('HP', 'Jane Doe', 'support@hp.com', '+1-800-789-0123', true, true),
  ('Apple', 'Mike Johnson', 'sales@apple.com', NULL, false, true),
  ('Lenovo', 'Sarah Williams', 'support@lenovo.com', NULL, true, true);

-- Insert Employees
INSERT INTO employees (employee_id, name, email, department, designation, status)
VALUES 
  ('EMP001', 'Alice Johnson', 'alice@company.com', 'Engineering', 'Senior Developer', 'active'),
  ('EMP002', 'Bob Smith', 'bob@company.com', 'Design', 'UX Designer', 'active'),
  ('EMP003', 'Carol Williams', 'carol@company.com', 'HR', 'HR Manager', 'active'),
  ('EMP004', 'David Brown', 'david@company.com', 'Engineering', 'Full Stack Developer', 'active');

-- Insert Assets (sample)
INSERT INTO assets (asset_id, asset_type, brand, model_number, serial_number, asset_cost, asset_status, asset_condition, purchase_date)
VALUES 
  ('LAP001', 'Laptop', 'Dell', 'XPS 15', 'DELL-SN-001', 1200.00, 'in_stock', 'new', '2023-01-15'),
  ('LAP002', 'Laptop', 'HP', 'Pavilion 15', 'HP-SN-001', 800.00, 'allocated', 'good', '2023-02-20'),
  ('MNT001', 'Monitor', 'Dell', 'U2720Q', 'DELL-MON-001', 500.00, 'in_stock', 'new', '2023-03-10'),
  ('KEY001', 'Keyboard', 'Logitech', 'MX Keys', 'LOG-KEY-001', 100.00, 'allocated', 'good', '2023-04-05');
```

## 🧪 Feature Testing

### Dashboard Tests
```
Test: Dashboard loads with KPI cards
Steps:
1. Navigate to http://localhost:3000/dashboard
2. Wait for data to load (2-3 seconds)
3. Verify 8 KPI cards display numbers

Expected: All cards show values > 0 (after sample data init)
```

### Asset Management Tests

#### Test: List Assets
```
1. Go to /assets
2. View asset list
3. Should show all assets from database

Expected: At least 4 sample assets visible
```

#### Test: Search Assets
```
1. Go to /assets
2. Type "LAP" in search box
3. Should filter to laptop assets only

Expected: Only assets with "LAP" in ID shown
```

#### Test: Add New Asset
```
1. Go to /assets
2. Click "Add Asset"
3. Fill required fields:
   - Asset ID: TEST001
   - Asset Type: Laptop
   - Serial Number: TEST-SN-001
4. Click "Save Asset"

Expected: 
- Modal closes
- New asset appears in list
- No console errors
```

#### Test: Edit Asset
```
1. Go to /assets
2. Click edit icon on an asset
3. Change status to "damaged"
4. Click "Save Asset"

Expected:
- Asset updates in list
- Status shows "damaged"
```

#### Test: Delete Asset
```
1. Go to /assets
2. Click delete icon on an asset
3. Confirm deletion
4. Wait for list to refresh

Expected:
- Asset removed from list
- List count decreases
```

### Allocation Tests

#### Test: Create Allocation
```
1. Go to /allocations
2. Click "New Allocation"
3. Select asset LAP001
4. Select employee Alice Johnson
5. Set allocation date to today
6. Click "Save"

Expected:
- Allocation created
- Asset status changes to "allocated"
- Shows in active allocations
```

#### Test: View Allocation History
```
1. Go to /allocations
2. Filter by "Active" status
3. Should show current allocations

Expected:
- Multiple allocations visible
- Shows employee, asset, dates
```

### Warranty Tests

#### Test: View Warranty Status
```
1. Go to /warranty
2. Should see warranty list

Expected:
- Assets with warranty dates shown
- Color-coded status indicators
```

#### Test: Filter Warranty
```
1. Go to /warranty
2. Click status filter
3. Select "expiring_soon"

Expected:
- Only expiring soon warranties shown
- List updates immediately
```

### Reports Tests

#### Test: Export Inventory Report
```
1. Go to /reports
2. Select "Inventory Report"
3. Click "Export as CSV"

Expected:
- CSV file downloads
- File named: inventory-report-YYYY-MM-DD.csv
- Contains asset data
- Openable in Excel/Sheets
```

#### Test: Export Allocations Report
```
1. Go to /reports
2. Select "Allocations Report"
3. Click "Export as CSV"

Expected:
- CSV downloads with allocation data
- Shows employee names, asset IDs, dates
```

## 🔌 API Testing

### Using cURL

#### Test Get Assets
```bash
curl http://localhost:3000/api/assets

# Expected: JSON array of assets
```

#### Test Get Assets with Filter
```bash
curl "http://localhost:3000/api/assets?status=in_stock"

# Expected: Only assets with status 'in_stock'
```

#### Test Create Asset
```bash
curl -X POST http://localhost:3000/api/assets \
  -H "Content-Type: application/json" \
  -d '{
    "asset_id": "API001",
    "asset_type": "Monitor",
    "brand": "ASUS",
    "serial_number": "API-SN-001",
    "asset_cost": 350.00,
    "asset_status": "in_stock",
    "asset_condition": "new"
  }'

# Expected: Returns created asset with ID
```

#### Test Get Employees
```bash
curl http://localhost:3000/api/employees

# Expected: JSON array of employees
```

#### Test Get Allocations
```bash
curl http://localhost:3000/api/allocations

# Expected: JSON array of allocations
```

#### Test Get Repairs
```bash
curl http://localhost:3000/api/repairs

# Expected: JSON array of repairs
```

### Using Postman

1. Import API endpoints
2. Set headers: `Content-Type: application/json`
3. Test each endpoint with sample data
4. Verify response codes (200, 201, 400, 500)

## 📊 Database Validation

### Check Data Integrity

```sql
-- Count records in each table
SELECT COUNT(*) as asset_count FROM assets;
SELECT COUNT(*) as allocation_count FROM asset_allocations;
SELECT COUNT(*) as repair_count FROM repairs;
SELECT COUNT(*) as warranty_count FROM warranty_tracking;
SELECT COUNT(*) as employee_count FROM employees;
SELECT COUNT(*) as vendor_count FROM vendors;

-- Verify foreign key relationships
SELECT a.id, a.asset_id, e.name 
FROM asset_allocations a
LEFT JOIN employees e ON a.employee_id = e.id
LIMIT 5;

-- Check asset status distribution
SELECT asset_status, COUNT(*) 
FROM assets 
GROUP BY asset_status;
```

## 🎨 UI Validation

### Responsive Design Test
```
1. Open dashboard in Chrome DevTools
2. Test at these breakpoints:
   - Mobile: 320px (iPhone SE)
   - Tablet: 768px (iPad)
   - Desktop: 1920px (Full screen)
3. Verify layout adapts correctly
4. Check sidebar collapses on mobile
```

### Browser Compatibility
```
Test on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

Expected: All features work correctly
```

### Dark Mode
```
1. Verify dark theme applied
2. Check text contrast (WCAG AA)
3. Test all colors readable
4. Verify no broken images
```

## ⚡ Performance Testing

### Load Time Test
```
1. Open http://localhost:3000/dashboard
2. Open DevTools Network tab
3. Reload page
4. Check metrics:
   - First Contentful Paint (FCP): < 1.5s
   - Largest Contentful Paint (LCP): < 2.5s
   - Cumulative Layout Shift (CLS): < 0.1
```

### Data Loading Test
```
1. Navigate to /assets
2. Watch for loading state
3. Data should load in < 2 seconds
4. SWR should cache subsequent requests
```

## 🔐 Security Testing

### API Authentication
```
1. Test accessing API without proper keys
   curl http://localhost:3000/api/assets
   Expected: Should work (uses anon key)

2. Test sensitive operations
   - Verify service role key required for admin ops
   - Check DELETE operations have auth
```

### Input Validation
```
1. Try adding asset with missing required field
2. Try duplicate serial number
3. Try invalid date format
4. Try special characters in fields

Expected: Proper error messages
```

## 🐛 Error Handling Test

### Network Error
```
1. Disable network in DevTools
2. Try to load /assets
3. Should show error message gracefully
4. Should not crash application
```

### Invalid Data
```
1. Try to create asset with invalid cost (-100)
2. Try empty required fields
3. Try XSS injection in notes field

Expected: Validation errors shown to user
```

## 📝 Testing Checklist

- [ ] Database tables created
- [ ] Sample data initialized
- [ ] Dashboard loads with metrics
- [ ] Assets list displays
- [ ] Can add new asset
- [ ] Can edit asset
- [ ] Can delete asset
- [ ] Search functionality works
- [ ] Filters work correctly
- [ ] Allocations can be created
- [ ] Warranty dates tracking
- [ ] Repairs workflow complete
- [ ] Reports export as CSV
- [ ] API endpoints respond
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Dark theme applied correctly
- [ ] Navigation works
- [ ] All links functional
- [ ] Loading states display

## 🚀 Pre-Production Checklist

- [ ] All environment variables set
- [ ] Database backups configured
- [ ] Supabase Auth implemented (if needed)
- [ ] RLS policies configured
- [ ] Error logging enabled
- [ ] Performance monitoring active
- [ ] HTTPS configured
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Monitoring/alerts setup

## 📞 Debugging

### Enable Console Logging
Add to components for debugging:
```typescript
console.log('[v0] Component mounted', props)
console.log('[v0] Data loaded:', data)
console.log('[v0] Error occurred:', error)
```

### Check Browser DevTools
1. **Console** - Error messages
2. **Network** - API requests/responses
3. **Application** - LocalStorage, IndexedDB
4. **Performance** - Load metrics

### Check Supabase Logs
1. Go to Supabase dashboard
2. Check SQL Editor → Query History
3. Review execution logs
4. Check table row counts

## 🎯 Success Criteria

Application is production-ready when:
- ✅ All 8 pages load without errors
- ✅ All CRUD operations work
- ✅ API endpoints return proper responses
- ✅ Database relationships intact
- ✅ Reports export correctly
- ✅ No console errors
- ✅ Responsive design works
- ✅ Performance metrics good
- ✅ Error handling graceful
- ✅ Documentation complete

---

**After completing all tests, the system is ready for production deployment!** 🎉
