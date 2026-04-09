import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchPrompt } from '../lib/api'
import type { Prompt } from '../types'

export default function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedJp, setCopiedJp] = useState(false)
  const [copiedEn, setCopiedEn] = useState(false)

  useEffect(() => {
    if (!id) return
    fetchPrompt(id)
      .then(setPrompt)
      .finally(() => setLoading(false))
  }, [id])

  async function copy(text: string, type: 'jp' | 'en') {
    await navigator.clipboard.writeText(text)
    if (type === 'jp') {
      setCopiedJp(true)
      setTimeout(() => setCopiedJp(false), 2000)
    } else {
      setCopiedEn(true)
      setTimeout(() => setCopiedEn(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg text-gray-400">
        <p>見つかりませんでした</p>
      </div>
    )
  }

  return (
    <div className="bg-bg min-h-screen">
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 safe-top">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-primary text-sm active:opacity-70"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>戻る</span>
        </button>
        <button
          onClick={() => navigate(`/edit/${prompt.id}`)}
          className="bg-white border border-gray-200 rounded-lg px-4 py-1.5 text-sm text-gray-700 active:bg-gray-50"
        >
          編集
        </button>
      </div>

      {/* 画像 */}
      {prompt.image_url && (
        <div className="w-full bg-gray-100">
          <img
            src={prompt.image_url}
            alt={prompt.japanese_prompt}
            className="w-full max-h-80 object-contain"
          />
        </div>
      )}

      {/* コンテンツ */}
      <div className="p-4 space-y-4">
        {/* 日本語プロンプト */}
        {prompt.japanese_prompt && (
          <div>
            <button
              onClick={() => copy(prompt.japanese_prompt, 'jp')}
              className="w-full bg-primary text-white font-semibold py-3 rounded-xl text-sm active:opacity-80 transition-opacity"
            >
              {copiedJp ? 'コピーしました！' : '日本語プロンプトをコピー'}
            </button>
            <div className="mt-2 bg-white rounded-xl px-4 py-3">
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{prompt.japanese_prompt}</p>
            </div>
          </div>
        )}

        {/* 英語プロンプト */}
        {prompt.english_prompt && (
          <div>
            <button
              onClick={() => copy(prompt.english_prompt, 'en')}
              className="w-full bg-primary text-white font-semibold py-3 rounded-xl text-sm active:opacity-80 transition-opacity"
            >
              {copiedEn ? 'コピーしました！' : '英語プロンプトをコピー'}
            </button>
            <div className="mt-2 bg-white rounded-xl px-4 py-3">
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{prompt.english_prompt}</p>
            </div>
          </div>
        )}

        {/* メモ */}
        {prompt.memo && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">メモ</h3>
            <div className="bg-white rounded-xl px-4 py-3">
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{prompt.memo}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
