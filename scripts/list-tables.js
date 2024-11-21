const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function listTables() {
  try {
    // Query to get table information from Postgres information schema
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')

    if (error) {
      console.error('Error:', error.message)
      return
    }

    console.log('Existing tables in public schema:')
    console.log(JSON.stringify(data, null, 2))

    // Check if fica_submissions table exists
    const { data: ficaTable, error: ficaError } = await supabase
      .from('fica_submissions')
      .select('*')
      .limit(1)

    if (ficaError) {
      console.log('\nfica_submissions table does not exist yet')
    } else {
      console.log('\nfica_submissions table exists')
      console.log('Sample record:', JSON.stringify(ficaTable[0], null, 2))
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

listTables()
