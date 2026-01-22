import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, testConnection } from '../services/supabase'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'

const Dashboard = () => {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'failed'>('testing')
  const [projectInfo, setProjectInfo] = useState<any>(null)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log('🧪 Testing Supabase connection from React...')
        
        // Test basic connection
        const isConnected = await testConnection()
        
        if (isConnected) {
          setConnectionStatus('connected')
          
          // Try to get some basic project info
          try {
            const { data: authData } = await supabase.auth.getSession()
            setProjectInfo({
              authenticated: !!authData?.session,
              timestamp: new Date().toISOString()
            })
          } catch (error) {
            console.log('Auth check (expected):', error)
          }
        } else {
          setConnectionStatus('failed')
        }
      } catch (error) {
        console.error('Connection test failed:', error)
        setConnectionStatus('failed')
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🐟 LuckerLife Fish Database
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Internal tool for managing fish reference data and images for mobile app seeding
          </p>
        </header>

        {/* Connection Status */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">System Status</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Connection Status */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-2">Supabase Connection</h3>
                <div className="flex items-center space-x-2">
                  {connectionStatus === 'testing' && (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-blue-600">Testing connection...</span>
                    </>
                  )}
                  {connectionStatus === 'connected' && (
                    <>
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-green-600 font-medium">Connected ✅</span>
                    </>
                  )}
                  {connectionStatus === 'failed' && (
                    <>
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span className="text-red-600 font-medium">Connection Failed ❌</span>
                    </>
                  )}
                </div>
              </div>

              {/* Project Info */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-2">Project Information</h3>
                {projectInfo ? (
                  <div className="text-sm text-gray-600">
                    <p>Project: Connected to Supabase</p>
                    <p>Status: Ready for development</p>
                    <p>Last Check: {new Date(projectInfo.timestamp).toLocaleTimeString()}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Gathering information...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">🐟</span>
                <span>Fish Species</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">View and manage your fish species database</p>
              <Link to="/species">
                <Button className="w-full">Manage Fish Species</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">📥</span>
                <span>Import Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Import fish data from your Google Sheets</p>
              <Link to="/import">
                <Button variant="secondary" className="w-full">Import from Sheets</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">📤</span>
                <span>Export Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Export data for mobile app consumption</p>
              <Link to="/export">
                <Button variant="secondary" className="w-full">Export Data</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">⚙️</span>
                <span>System Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Monitor database and connection health</p>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => window.location.reload()}
              >
                Refresh Status
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Implementation Status */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Implementation Progress</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-700">Phase 0: Initialization Complete</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">🔄</span>
                </div>
                <span className="text-gray-700">Phase 1: Link - Supabase connectivity verified</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-xs">2</span>
                </div>
                <span className="text-gray-500">Phase 2: Architect - Database schema implementation</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-xs">3</span>
                </div>
                <span className="text-gray-500">Phase 3: Features - Core application development</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-xs">4</span>
                </div>
                <span className="text-gray-500">Phase 4: Deploy - UI polish and production</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500">
          <p>LuckerLife Fish Database Management Tool</p>
          <p className="text-sm">B.L.A.S.T. + A.N.T. Architecture | Built with React + TypeScript + Supabase</p>
        </footer>
      </div>
    </div>
  )
}

export default Dashboard