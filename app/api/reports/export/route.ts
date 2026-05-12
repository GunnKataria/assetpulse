import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import Papa from 'papaparse'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

// Remove /rest/v1/ from URL if it exists - the SDK adds it automatically
const cleanUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '')

const supabase = createClient(cleanUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const reportType = searchParams.get('type') || 'inventory'

    let data: any = []
    let filename = 'report.csv'

    switch (reportType) {
      case 'inventory':
        const { data: assets } = await supabase
          .from('assets')
          .select('asset_id, asset_type, brand, model_number, serial_number, asset_cost, asset_status, warranty_end_date')

        data = assets || []
        filename = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`
        break

      case 'allocations':
        const { data: allocations } = await supabase
          .from('asset_allocations')
          .select('*, asset:assets(asset_id), employee:employees(name, employee_id, department)')

        data = (allocations || []).map((a: any) => ({
          asset_id: a.asset?.asset_id,
          employee_name: a.employee?.name,
          employee_id: a.employee?.employee_id,
          department: a.employee?.department,
          allocation_date: a.allocation_date,
          return_date: a.return_date,
          status: a.allocation_status,
        }))
        filename = `allocations-report-${new Date().toISOString().split('T')[0]}.csv`
        break

      case 'warranty':
        const { data: warranties } = await supabase
          .from('warranty_tracking')
          .select('*, asset:assets(asset_id), vendor:vendors(name)')

        data = (warranties || []).map((w: any) => ({
          asset_id: w.asset?.asset_id,
          warranty_start: w.warranty_start_date,
          warranty_end: w.warranty_end_date,
          warranty_months: w.warranty_months,
          is_expired: w.is_expired,
          vendor: w.vendor?.name,
        }))
        filename = `warranty-report-${new Date().toISOString().split('T')[0]}.csv`
        break

      case 'repairs':
        const { data: repairs } = await supabase
          .from('repairs')
          .select('*, asset:assets(asset_id), vendor:vendors(name)')

        data = (repairs || []).map((r: any) => ({
          ticket_number: r.ticket_number,
          asset_id: r.asset?.asset_id,
          problem: r.problem_description,
          date_reported: r.date_reported,
          vendor: r.vendor?.name,
          cost: r.repair_cost,
          status: r.repair_status,
        }))
        filename = `repairs-report-${new Date().toISOString().split('T')[0]}.csv`
        break
    }

    // Convert to CSV
    const csv = Papa.unparse(data)

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
