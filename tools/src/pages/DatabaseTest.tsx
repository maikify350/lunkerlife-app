import { FC, useState } from 'react'
import { supabase } from '../services/supabase'

const DatabaseTest: FC = () => {
  const [testResult, setTestResult] = useState<string>('Not tested yet')
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    setTestResult('Testing connection...')
    
    try {
      // Test basic Supabase connection
      const { data: connectionTest, error: connectionError } = await supabase
        .from('fish_species')
        .select('count', { count: 'exact', head: true })

      if (connectionError) {
        setTestResult(`Connection Error: ${connectionError.message}`)
        setIsLoading(false)
        return
      }

      const count = connectionTest?.[0]?.count || 0
      
      // Try to get actual data
      const { data: fishData, error: fishError } = await supabase
        .from('fish_species')
        .select('id, common_name, family, class, created_at')
        .limit(5)

      if (fishError) {
        setTestResult(`Data Query Error: ${fishError.message}`)
        setIsLoading(false)
        return
      }

      setTestResult(`
SUCCESS! 
- Connection: ✅ Working
- Database: ✅ Connected
- Fish count: ${count} records
- Sample data: ${fishData.length} fish loaded
- First fish: ${fishData[0]?.common_name || 'None'}
- Class field exists: ${fishData[0]?.hasOwnProperty('class') ? '✅ Yes' : '❌ No'}

Sample fish:
${fishData.map((fish, i) => `${i+1}. ${fish.common_name} (${fish.family || 'No family'}) - Class: ${fish.class || 'No class'}`).join('\n')}
      `)

    } catch (error) {
      setTestResult(`JavaScript Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    
    setIsLoading(false)
  }

  const testSortingFile = async () => {
    setIsLoading(true)
    setTestResult('Testing sorting.json file...')
    
    try {
      const response = await fetch('/sorting.json')
      if (!response.ok) {
        setTestResult(`Sorting file error: ${response.status} ${response.statusText}`)
        setIsLoading(false)
        return
      }
      
      const sortingData = await response.json()
      setTestResult(`
SORTING.JSON SUCCESS!
- File loaded: ✅ 
- Options count: ${sortingData.length}
- Show=true options: ${sortingData.filter((opt: any) => opt.show).length}

Options:
${sortingData.filter((opt: any) => opt.show).map((opt: any, i: number) => `${i+1}. ${opt.label} (${opt.value})`).join('\n')}
      `)
      
    } catch (error) {
      setTestResult(`Sorting file error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    
    setIsLoading(false)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Database Connection Test</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testConnection}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Testing...' : 'Test Database Connection'}
        </button>
        
        <button
          onClick={testSortingFile}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 ml-4"
        >
          {isLoading ? 'Testing...' : 'Test Sorting.json File'}
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded text-sm font-mono whitespace-pre-wrap">
        {testResult}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold text-yellow-800 mb-2">Important:</h3>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• Make sure you ran the SQL import script in Supabase dashboard</li>
          <li>• The SQL script is: <code>import-fish-data-with-images.sql</code></li>
          <li>• Also run: <code>database/migrations/004_add_class_field.sql</code></li>
          <li>• The new interface is at: <code>/management</code> not <code>/species</code></li>
        </ul>
      </div>
    </div>
  )
}

export default DatabaseTest