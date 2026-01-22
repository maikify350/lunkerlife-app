import { FC, ReactNode } from 'react'
import Navigation from './Navigation'

interface LayoutProps {
  children: ReactNode
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
      
      {/* Footer - Minimal */}
      <footer className="bg-white border-t border-gray-200 flex-shrink-0">
        <div className="w-full px-6 py-2">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              <strong>LuckerLife Fish Database</strong> - Internal fish reference data management
            </div>
            
            <div className="text-xs text-gray-400">
              React + TypeScript + Supabase
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout