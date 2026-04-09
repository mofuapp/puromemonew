import { NavLink } from 'react-router-dom'

export default function BottomNav() {
  return (
    <nav className="bg-white border-t border-gray-200 safe-bottom">
      <div className="flex">
        <NavLink
          to="/list"
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-2 text-xs gap-1 transition-colors ${
              isActive ? 'text-primary' : 'text-gray-400'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={isActive ? 2.5 : 1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className={isActive ? 'font-semibold' : ''}>プロメモ</span>
            </>
          )}
        </NavLink>
        <NavLink
          to="/add"
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-2 text-xs gap-1 transition-colors ${
              isActive ? 'text-primary' : 'text-gray-400'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={isActive ? 2.5 : 1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className={isActive ? 'font-semibold' : ''}>追加</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  )
}
