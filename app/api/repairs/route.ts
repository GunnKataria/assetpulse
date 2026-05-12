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
      .from('repairs')
      .select(
        `
        *,
        asset:assets(asset_id, brand, model_number, serial_number, asset_type),
        vendor:vendors(name)
      `
      )
      .order('date_reported', { ascending: false })

    if (status) {
      query = query.eq('repair_status', status)
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
      .from('repairs')
      .insert([body])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Update asset status to under repair
    await supabase
      .from('assets')
      .update({ asset_status: 'under_repair' })
      .eq('id', body.asset_id)

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
