import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

// Remove /rest/v1/ from URL if it exists - the SDK adds it automatically
const cleanUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '')

const supabase = createClient(cleanUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    // Check auth (in production, use proper auth)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Add vendors
    const vendorData = [
      { name: 'Dell', contact_person: 'John Smith', email: 'sales@dell.com', phone: '+1-800-123-4567', repair_provider: true },
      { name: 'HP', contact_person: 'Jane Doe', email: 'support@hp.com', phone: '+1-800-789-0123', repair_provider: true },
      { name: 'Apple', contact_person: 'Mike Johnson', email: 'sales@apple.com', warranty_provider: true },
      { name: 'Lenovo', contact_person: 'Sarah Williams', email: 'support@lenovo.com', repair_provider: true },
    ]

    const { data: vendors, error: vendorError } = await supabase
      .from('vendors')
      .insert(vendorData)
      .select()

    if (vendorError) {
      console.error('Vendor insert error:', vendorError)
    }

    // Add employees
    const employeeData = [
      {
        employee_id: 'EMP001',
        name: 'Alice Johnson',
        email: 'alice@company.com',
        department: 'Engineering',
        designation: 'Senior Developer',
        phone: '+1-555-0101',
        status: 'active',
      },
      {
        employee_id: 'EMP002',
        name: 'Bob Smith',
        email: 'bob@company.com',
        department: 'Design',
        designation: 'UX Designer',
        phone: '+1-555-0102',
        status: 'active',
      },
      {
        employee_id: 'EMP003',
        name: 'Carol Williams',
        email: 'carol@company.com',
        department: 'HR',
        designation: 'HR Manager',
        phone: '+1-555-0103',
        status: 'active',
      },
      {
        employee_id: 'EMP004',
        name: 'David Brown',
        email: 'david@company.com',
        department: 'Engineering',
        designation: 'Full Stack Developer',
        phone: '+1-555-0104',
        status: 'active',
      },
    ]

    const { data: employees, error: employeeError } = await supabase
      .from('employees')
      .insert(employeeData)
      .select()

    if (employeeError) {
      console.error('Employee insert error:', employeeError)
    }

    // Add assets
    const assetData = [
      {
        asset_id: 'LAP001',
        asset_type: 'Laptop',
        brand: 'Dell',
        model_number: 'XPS 15',
        serial_number: 'DELL-SN-001',
        processor: 'Intel i7-13700H',
        ram: '16GB',
        storage: '512GB SSD',
        operating_system: 'Windows 11',
        purchase_date: '2023-01-15',
        invoice_number: 'INV-2023-001',
        warranty_start_date: '2023-01-15',
        warranty_end_date: '2024-01-15',
        warranty_months: 12,
        asset_cost: 1200.00,
        asset_status: 'in_stock',
        asset_condition: 'new',
        current_location: 'Office',
      },
      {
        asset_id: 'LAP002',
        asset_type: 'Laptop',
        brand: 'HP',
        model_number: 'Pavilion 15',
        serial_number: 'HP-SN-001',
        processor: 'AMD Ryzen 5',
        ram: '8GB',
        storage: '256GB SSD',
        operating_system: 'Windows 11',
        purchase_date: '2023-02-20',
        invoice_number: 'INV-2023-002',
        warranty_start_date: '2023-02-20',
        warranty_end_date: '2024-02-20',
        warranty_months: 12,
        asset_cost: 800.00,
        asset_status: 'allocated',
        asset_condition: 'good',
        current_location: 'Office',
      },
      {
        asset_id: 'MNT001',
        asset_type: 'Monitor',
        brand: 'Dell',
        model_number: 'U2720Q',
        serial_number: 'DELL-MON-001',
        purchase_date: '2023-03-10',
        invoice_number: 'INV-2023-003',
        warranty_start_date: '2023-03-10',
        warranty_end_date: '2025-03-10',
        warranty_months: 24,
        asset_cost: 500.00,
        asset_status: 'in_stock',
        asset_condition: 'new',
        current_location: 'Storage',
      },
      {
        asset_id: 'KEY001',
        asset_type: 'Keyboard',
        brand: 'Logitech',
        model_number: 'MX Keys',
        serial_number: 'LOG-KEY-001',
        purchase_date: '2023-04-05',
        invoice_number: 'INV-2023-004',
        warranty_start_date: '2023-04-05',
        warranty_end_date: '2024-04-05',
        warranty_months: 12,
        asset_cost: 100.00,
        asset_status: 'allocated',
        asset_condition: 'good',
        current_location: 'Office',
      },
    ]

    const { data: assets, error: assetError } = await supabase
      .from('assets')
      .insert(assetData)
      .select()

    if (assetError) {
      console.error('Asset insert error:', assetError)
    }

    return NextResponse.json({
      success: true,
      message: 'Initial data loaded successfully',
      counts: {
        vendors: vendors?.length || 0,
        employees: employees?.length || 0,
        assets: assets?.length || 0,
      },
    })
  } catch (error: any) {
    console.error('Initialization error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
