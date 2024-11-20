'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [status, setStatus] = useState<string>('Testing connection...');
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    async function testConnection() {
      try {
        // First test basic connection
        const { data: tablesData, error: tablesError } = await supabase
          .from('template_variables')
          .select('*')
          .limit(1);
        
        if (tablesError) {
          setStatus(`Connection Error: ${tablesError.message}`);
          console.error('Supabase error:', tablesError);
        } else {
          setStatus('Successfully connected to Supabase!');
          console.log('Connection successful, sample data:', tablesData);
        }

      } catch (err) {
        setStatus(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        console.error('Unexpected error:', err);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
        <p className={`text-lg mb-4 ${status.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
          {status}
        </p>
        <div className="text-sm text-gray-600">
          <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
          <p>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</p>
        </div>
      </div>
    </div>
  );
}
