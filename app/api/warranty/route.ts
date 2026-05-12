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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')

    let query = supabase
      .from('warranty_tracking')
      .select(
        `
        *,
        asset:assets(asset_id, brand, model_number, serial_number, asset_type),
        vendor:vendors(name)
      `
      )
      .order('warranty_end_date', { ascending: true })

    if (status === 'active') {
      query = query.eq('is_expired', false)
    } else if (status === 'expired') {
      query = query.eq('is_expired', true)
    } else if (status === 'expiring_soon') {
      const today = new Date()
      const ninetyDaysAhead = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]
      query = query
        .eq('is_expired', false)
        .lt('warranty_end_date', ninetyDaysAhead)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from('warranty_tracking')
      .insert([body])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
