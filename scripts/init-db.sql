-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  warranty_provider BOOLEAN DEFAULT FALSE,
  repair_provider BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  department VARCHAR(100),
  designation VARCHAR(100),
  phone VARCHAR(20),
  manager_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id VARCHAR(100) UNIQUE NOT NULL,
  asset_type VARCHAR(100) NOT NULL,
  brand VARCHAR(100),
  model_number VARCHAR(100),
  serial_number VARCHAR(255) UNIQUE,
  processor VARCHAR(100),
  ram VARCHAR(50),
  storage VARCHAR(100),
  operating_system VARCHAR(100),
  purchase_date DATE,
  vendor_id UUID REFERENCES vendors(id),
  invoice_number VARCHAR(100),
  warranty_start_date DATE,
  warranty_end_date DATE,
  warranty_months INTEGER,
  asset_cost DECIMAL(12, 2),
  asset_status VARCHAR(50) DEFAULT 'in_stock',
  current_location VARCHAR(255),
  asset_condition VARCHAR(50) DEFAULT 'new',
  notes TEXT,
  qr_code_url TEXT,
  depreciation_value DECIMAL(12, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create asset_allocations table
CREATE TABLE IF NOT EXISTS asset_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  allocation_date DATE NOT NULL,
  return_date DATE,
  expected_return_date DATE,
  asset_condition_at_allocation VARCHAR(50),
  accessories_included TEXT,
  employee_acknowledgement BOOLEAN DEFAULT FALSE,
  acknowledgement_date TIMESTAMP WITH TIME ZONE,
  allocation_status VARCHAR(50) DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create repairs table
CREATE TABLE IF NOT EXISTS repairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number VARCHAR(100) UNIQUE NOT NULL,
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  problem_description TEXT NOT NULL,
  date_reported DATE NOT NULL,
  vendor_id UUID REFERENCES vendors(id),
  warranty_applicable BOOLEAN DEFAULT FALSE,
  repair_cost DECIMAL(12, 2),
  expected_resolution_date DATE,
  repair_status VARCHAR(50) DEFAULT 'open',
  resolution_notes TEXT,
  completed_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create warranty_tracking table
CREATE TABLE IF NOT EXISTS warranty_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  warranty_start_date DATE NOT NULL,
  warranty_end_date DATE NOT NULL,
  warranty_months INTEGER,
  warranty_type VARCHAR(50),
  vendor_id UUID REFERENCES vendors(id),
  is_expired BOOLEAN DEFAULT FALSE,
  expiry_notification_sent_30 BOOLEAN DEFAULT FALSE,
  expiry_notification_sent_90 BOOLEAN DEFAULT FALSE,
  renewal_status VARCHAR(50),
  renewal_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create asset_documents table
CREATE TABLE IF NOT EXISTS asset_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  document_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  uploaded_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create asset_status_logs table
CREATE TABLE IF NOT EXISTS asset_status_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  previous_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by VARCHAR(255),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (for role-based access)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_assets_asset_id ON assets(asset_id);
CREATE INDEX IF NOT EXISTS idx_assets_serial_number ON assets(serial_number);
CREATE INDEX IF NOT EXISTS idx_assets_asset_status ON assets(asset_status);
CREATE INDEX IF NOT EXISTS idx_assets_warranty_end_date ON assets(warranty_end_date);
CREATE INDEX IF NOT EXISTS idx_allocations_employee_id ON asset_allocations(employee_id);
CREATE INDEX IF NOT EXISTS idx_allocations_asset_id ON asset_allocations(asset_id);
CREATE INDEX IF NOT EXISTS idx_allocations_status ON asset_allocations(allocation_status);
CREATE INDEX IF NOT EXISTS idx_repairs_asset_id ON repairs(asset_id);
CREATE INDEX IF NOT EXISTS idx_repairs_status ON repairs(repair_status);
CREATE INDEX IF NOT EXISTS idx_warranty_asset_id ON warranty_tracking(asset_id);
CREATE INDEX IF NOT EXISTS idx_documents_asset_id ON asset_documents(asset_id);
CREATE INDEX IF NOT EXISTS idx_status_logs_asset_id ON asset_status_logs(asset_id);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_employee_id ON employees(employee_id);
