import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchPrompts, deletePrompt } from '../lib/api'
import type { Prompt } from '../types'

export default function ListPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const navigate = useNavigate()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function load() {
    setLoading(true)
    try {
      const data = await fetchPrompts()
      setPrompts(data)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(prompt: Prompt) {
    if (!window.confirm('削除しますか？')) return
    setMenuOpen(null)
    await deletePrompt(prompt)
    setPrompts(prev => prev.filter(p => p.id !== prompt.id))
  }

  const filtered = prompts.filter(p => {
    const q = search.toLowerCase()
    return (
      p.japanese_prompt.toLowerCase().includes(q) ||
      p.english_prompt.toLowerCase().includes(q) ||
      p.memo.toLowerCase().includes(q)
    )
  })

  return (
    <div className="p-3">
      {/* 検索 */}
      <div className="relative mb-3">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          placeholder="検索"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
        />
      </div>

      {/* ローディング */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* 空状態 */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">{search ? '見つかりませんでした' : 'まだ登録がありません'}</p>
        </div>
      )}

      {/* グリッド */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-2 gap-2" ref={menuRef}>
          {filtered.map(prompt => (
            <div
              key={prompt.id}
              className="relative bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer active:opacity-80"
              onClick={() => menuOpen === prompt.id ? setMenuOpen(null) : navigate(`/detail/${prompt.id}`)}
            >
              {/* サムネイル */}
              <div className="aspect-square bg-gray-100">
                {prompt.image_url ? (
                  <img
                    src={prompt.image_url}
                    alt={prompt.japanese_prompt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* メニューボタン */}
              <button
                className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full w-7 h-7 flex items-center justify-center shadow-sm z-10"
                onClick={e => {
                  e.stopPropagation()
                  setMenuOpen(menuOpen === prompt.id ? null : prompt.id)
                }}
              >
                <span className="text-gray-600 text-xs font-bold">···</span>
              </button>

              {/* ドロップダウン */}
              {menuOpen === prompt.id && (
                <div
                  className="absolute top-10 right-2 bg-white rounded-lg shadow-lg z-20 min-w-[80px] py-1"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    className="w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-gray-50 active:bg-gray-100"
                    onClick={() => handleDelete(prompt)}
                  >
                    削除
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
