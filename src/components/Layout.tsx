import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const isAdd = location.pathname === '/add'

  return (
    <div className="flex flex-col h-screen bg-bg">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 safe-top">
        <div className="flex items-center justify-between px-4 h-12">
          <button className="p-2 -ml-2 text-gray-600" onClick={() => {}}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-base font-semibold text-gray-800">
            {isAdd ? '追加' : 'プロメモ'}
          </h1>
          <div className="w-9" />
        </div>
      </header>

      {/* コンテンツ */}
      <main className="flex-1 overflow-y-auto scroll-area">
        <Outlet />
      </main>

      {/* ボトムナビ */}
      <BottomNav />
    </div>
  )
}
