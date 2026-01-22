import { FC } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import FishSpeciesNew from './pages/FishSpeciesNew'
import FishManagementTwoPanel from './pages/FishManagementTwoPanel'
import DatabaseTest from './pages/DatabaseTest'
import ImportData from './pages/ImportData'
import Reports from './pages/Reports'
import { SelectionProvider } from './contexts/SelectionContext'
import './App.css'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SelectionProvider>
        <Router>
          <Layout>
            <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/species" element={<FishManagementTwoPanel />} />
            <Route path="/species-cards" element={<FishSpeciesNew />} />
            <Route path="/test-db" element={<DatabaseTest />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/import" element={<ImportData />} />
            <Route path="/export" element={<div className="text-center py-8"><h2 className="text-2xl font-bold">Data Export - Coming Soon</h2><p className="text-gray-600 mt-2">JSON/CSV export for mobile app seeding</p></div>} />
            </Routes>
          </Layout>
        </Router>
      </SelectionProvider>
    </QueryClientProvider>
  )
}

export default App