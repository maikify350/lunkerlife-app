import { FC } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navigation: FC = () => {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/species', label: 'Fish Species', icon: '🐟' },
    { path: '/reports', label: 'Reports', icon: '📄' },
    { path: '/import', label: 'Import Data', icon: '📥' },
    { path: '/export', label: 'Export Data', icon: '📤' },
  ]
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }
  
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-ocean-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🐟</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">LuckerLife</h1>
            <p className="text-xs text-gray-500">Fish Database</p>
          </div>
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive(item.path)
                  ? 'bg-ocean-100 text-ocean-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        
        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 rounded-md hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {/* Mobile Navigation (hidden by default, would need state management to show) */}
      <div className="md:hidden mt-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium
              ${isActive(item.path)
                ? 'bg-ocean-100 text-ocean-700'
                : 'text-gray-600'
              }
            `}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default Navigation