import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPrompt } from '../lib/api'

export default function AddPage() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [jpPrompt, setJpPrompt] = useState('')
  const [enPrompt, setEnPrompt] = useState('')
  const [memo, setMemo] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit() {
    if (!jpPrompt.trim() && !enPrompt.trim()) {
      setError('プロンプトを入力してください')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await createPrompt(
        { japanese_prompt: jpPrompt, english_prompt: enPrompt, memo },
        imageFile
      )
      setImageFile(null)
      setPreview(null)
      setJpPrompt('')
      setEnPrompt('')
      setMemo('')
      navigate('/list')
    } catch {
      setError('保存に失敗しました。もう一度お試しください。')
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit = (jpPrompt.trim() || enPrompt.trim()) && !submitting

  return (
    <div className="p-4 space-y-4 pb-6">
      {/* 画像選択 */}
      <section>
        <label className="block text-sm font-medium text-gray-700 mb-1">画像</label>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full bg-white border border-gray-200 rounded-xl flex items-center gap-2 px-4 py-3 text-sm text-gray-400 active:bg-gray-50"
        >
          {preview ? (
            <img src={preview} alt="preview" className="w-10 h-10 object-cover rounded-lg" />
          ) : (
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
          <span>{preview ? imageFile?.name ?? '画像を選択...' : '画像を選択...'}</span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </section>

      {/* 日本語プロンプト */}
      <section>
        <label className="block text-sm font-medium text-gray-700 mb-1">日本語プロンプト</label>
        <textarea
          value={jpPrompt}
          onChange={e => setJpPrompt(e.target.value)}
          rows={3}
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
          placeholder="日本語でプロンプトを入力..."
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
          placeholder="Enter prompt in English..."
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
          placeholder="メモを入力..."
        />
      </section>

      {/* エラー */}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* 提出ボタン */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="bg-primary-light text-primary font-semibold rounded-xl px-6 py-3 text-sm transition-all disabled:opacity-50 active:scale-95"
      >
        {submitting ? '保存中...' : '提出'}
      </button>
    </div>
  )
}
