export interface Asset {
  id: string;
  asset_id: string;
  asset_type: string;
  brand: string;
  model_number: string;
  serial_number: string;
  processor?: string;
  ram?: string;
  storage?: string;
  operating_system?: string;
  purchase_date: string;
  vendor_id?: string;
  invoice_number?: string;
  warranty_start_date?: string;
  warranty_end_date?: string;
  warranty_months?: number;
  asset_cost: number;
  asset_status: 'in_stock' | 'allocated' | 'under_diagnosis' | 'under_repair' | 'repaired' | 'replacement_initiated' | 'replaced' | 'returned' | 'damaged' | 'scrap';
  current_location?: string;
  asset_condition: 'new' | 'good' | 'damaged';
  notes?: string;
  qr_code_url?: string;
  depreciation_value?: number;
  created_at?: string;
  updated_at?: string;
  vendor?: any;
}

export interface Allocation {
  id: string;
  asset_id: string;
  employee_id: string;
  allocation_date: string;
  return_date?: string;
  expected_return_date?: string;
  asset_condition_at_allocation?: string;
  accessories_included?: string;
  employee_acknowledgement: boolean;
  acknowledgement_date?: string;
  allocation_status: 'active' | 'returned' | 'pending_return';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  asset?: any;
  employee?: any;
}

export interface Repair {
  id: string;
  ticket_number: string;
  asset_id: string;
  problem_description: string;
  date_reported: string;
  vendor_id?: string;
  warranty_applicable: boolean;
  repair_cost?: number;
  expected_resolution_date?: string;
  repair_status: 'open' | 'in_progress' | 'completed' | 'closed';
  resolution_notes?: string;
  completed_date?: string;
  created_at?: string;
  updated_at?: string;
  asset?: any;
  vendor?: any;
}

export interface WarrantyTracking {
  id: string;
  asset_id: string;
  warranty_start_date: string;
  warranty_end_date: string;
  warranty_months?: number;
  warranty_type?: string;
  vendor_id?: string;
  is_expired: boolean;
  expiry_notification_sent_30: boolean;
  expiry_notification_sent_90: boolean;
  renewal_status?: string;
  renewal_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  asset?: any;
  vendor?: any;
}

export interface Employee {
  id: string;
  employee_id: string;
  name: string;
  email: string;
  department?: string;
  designation?: string;
  phone?: string;
  manager_name?: string;
  status: 'active' | 'inactive' | 'left';
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'employee';
  department?: string;
  createdAt: string;
}

export interface KPIData {
  totalAssets: number;
  allocatedAssets: number;
  availableStock: number;
  inRepair: number;
  warrantyAlerts: number;
  damagedAssets: number;
  scrapAssets: number;
}
