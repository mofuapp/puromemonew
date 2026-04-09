import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('.env に VITE_SUPABASE_URL と VITE_SUPABASE_ANON_KEY を設定してください')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const STORAGE_BUCKET = 'prompt-images'

export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false
  })
  if (error) throw error
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function deleteImage(url: string): Promise<void> {
  const path = url.split(`/${STORAGE_BUCKET}/`)[1]
  if (!path) return
  await supabase.storage.from(STORAGE_BUCKET).remove([path])
}
