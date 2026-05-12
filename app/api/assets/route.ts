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
    const search = searchParams.get('search')
    const type = searchParams.get('type')

    let query = supabase
      .from('assets')
      .select('*, vendor:vendors(name)')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('asset_status', status)
    }

    if (type) {
      query = query.eq('asset_type', type)
    }

    if (search) {
      query = query.or(
        `asset_id.ilike.%${search}%,serial_number.ilike.%${search}%,brand.ilike.%${search}%,model_number.ilike.%${search}%`
      )
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
    console.log('[v0] Creating asset with data:', body)

    const { data, error } = await supabase
      .from('assets')
      .insert([body])
      .select()

    if (error) {
      console.error('[v0] Supabase insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('[v0] Asset created successfully:', data)
    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/assets error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
