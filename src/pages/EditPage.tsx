import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchPrompt, updatePrompt } from '../lib/api'
import type { Prompt } from '../types'

export default function EditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [jpPrompt, setJpPrompt] = useState('')
  const [enPrompt, setEnPrompt] = useState('')
  const [memo, setMemo] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!id) return
    fetchPrompt(id).then(data => {
      setPrompt(data)
      setJpPrompt(data.japanese_prompt)
      setEnPrompt(data.english_prompt)
      setMemo(data.memo)
      if (data.image_url) setPreview(data.image_url)
    })
  }, [id])

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit() {
    if (!prompt) return
    if (!jpPrompt.trim() && !enPrompt.trim()) {
      setError('プロンプトを入力してください')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await updatePrompt(
        prompt.id,
        { japanese_prompt: jpPrompt, english_prompt: enPrompt, memo },
        imageFile,
        prompt.image_url
      )
      navigate(`/detail/${prompt.id}`)
    } catch {
      setError('更新に失敗しました。もう一度お試しください。')
    } finally {
      setSubmitting(false)
    }
  }

  if (!prompt) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
          <span>キャンセル</span>
        </button>
        <h1 className="text-base font-semibold text-gray-800">編集</h1>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="text-primary text-sm font-semibold disabled:opacity-50 active:opacity-70"
        >
          {submitting ? '保存中...' : '保存'}
        </button>
      </div>

      <div className="p-4 space-y-4 pb-8">
        {/* 画像選択 */}
        <section>
          <label className="block text-sm font-medium text-gray-700 mb-1">画像</label>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full bg-white border border-gray-200 rounded-xl flex items-center gap-3 px-4 py-3 text-sm text-gray-400 active:bg-gray-50"
          >
            {preview ? (
              <img src={preview} alt="preview" className="w-10 h-10 object-cover rounded-lg" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
            <span>{preview ? '画像を変更...' : '画像を選択...'}</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </section>

        {/* 日本語プロンプト */}
        <section>
          <label className="block text-sm font-medium text-gray-700 mb-1">日本語プロンプト</label>
          <textarea
            value={jpPrompt}
            onChange={e => setJpPrompt(e.target.value)}
            rows={3}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
          />
        </section>

        {/* 英語プロンプト */}
        <section>
          <label className="block text-sm font-medium text-gray-700 mb-1">英語プロンプト</label>
          <textarea
            value={enPrompt}
            onChange={e => setEnPrompt(e.target.value)}
            rows={3}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
          />
        </section>

        {/* メモ */}
        <section>
          <label className="block text-sm font-medium text-gray-700 mb-1">メモ</label>
          <input
            type="text"
            value={memo}
            onChange={e => setMemo(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
          />
        </section>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  )
}
