import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: Request) {
  try {
    const formData = await request.json()

    // Validate required fields
    const requiredFields = [
      'company_name_and_reg',
      'company_sa_presence',
      'company_tax_number',
      'company_registered_address',
      'representative_id_details',
      'representative_address',
      'representative_contact_details',
      'service_type',
      'payment_financing',
      'business_description',
      'ownership_structure',
      'ubo_method',
      'ubo_details',
      'ubo_addresses',
    ]

    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Add timestamps and status
    const submission = {
      ...formData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'pending_review',
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('fica_submissions')
      .insert([submission])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save submission' },
        { status: 500 }
      )
    }

    // Send email notification (you can implement this based on your email service)
    // await sendNotificationEmail(data[0])

    return NextResponse.json(
      { 
        message: 'Form submitted successfully',
        submissionId: data[0].id 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
