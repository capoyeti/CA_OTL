import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const requestData = await request.json()

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    // Get the FICA template ID
    const { data: templateData, error: templateError } = await supabase
      .from('templates')
      .select('id')
      .eq('name', 'FICA CDD Form')
      .single()
    if (templateError) throw templateError

    // Create the FICA submission
    const { data, error } = await supabase
      .from('fica_submissions')
      .insert({
        template_id: templateData.id,
        submission_data: requestData,
        submitted_by: user.id,
        submission_ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('FICA submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit FICA form' },
      { status: 500 }
    )
  }
}
