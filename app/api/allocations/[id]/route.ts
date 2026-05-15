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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const body = await request.json()

    const { allocation_status } = body

    const { data: allocation, error: fetchError } =
      await supabase
        .from('asset_allocations')
        .select('*')
        .eq('id', id)
        .single()

    if (fetchError || !allocation) {
      return NextResponse.json(
        { error: 'Allocation not found' },
        { status: 404 }
      )
    }

    const updatePayload: any = {
      ...body,
    }

    if (allocation_status === 'returned') {
      updatePayload.return_date = new Date()
        .toISOString()
        .split('T')[0]
    }

    const { data, error } = await supabase
      .from('asset_allocations')
      .update(updatePayload)
      .eq('id', id)
      .select()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (
      allocation_status === 'returned' &&
      allocation.asset_id
    ) {
      await supabase
        .from('assets')
        .update({
          asset_status: 'in_stock',
        })
        .eq('id', allocation.asset_id)
    }

    return NextResponse.json(data[0])
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('asset_allocations')
      .delete()
      .eq('id', params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
