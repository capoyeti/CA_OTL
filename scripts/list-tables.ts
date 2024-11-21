import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function listTables() {
  try {
    // Query to list all tables in the public schema
    const { data, error } = await supabase
      .from('_tables')
      .select('*')
      .eq('schema', 'public')

    if (error) {
      console.error('Error:', error.message)
      return
    }

    console.log('Existing tables:')
    console.log(JSON.stringify(data, null, 2))

    // Also check if fica_submissions table exists
    const { data: ficaTable, error: ficaError } = await supabase
      .from('fica_submissions')
      .select('*')
      .limit(1)

    if (ficaError) {
      console.log('\nfica_submissions table does not exist yet')
    } else {
      console.log('\nfica_submissions table exists')
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

listTables()
