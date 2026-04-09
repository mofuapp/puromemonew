import { supabase, uploadImage, deleteImage } from './supabase'
import type { Prompt, PromptInsert, PromptUpdate } from '../types'

const TABLE = 'prompts'

export async function fetchPrompts(): Promise<Prompt[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Prompt[]
}

export async function fetchPrompt(id: string): Promise<Prompt> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Prompt
}

export async function createPrompt(
  fields: Omit<PromptInsert, 'image_url' | 'user_id'>,
  imageFile: File | null
): Promise<Prompt> {
  let image_url: string | null = null
  if (imageFile) {
    image_url = await uploadImage(imageFile)
  }
  const payload: PromptInsert = { ...fields, image_url, user_id: null }
  const { data, error } = await supabase.from(TABLE).insert(payload).select().single()
  if (error) throw error
  return data as Prompt
}

export async function updatePrompt(
  id: string,
  fields: PromptUpdate,
  imageFile: File | null,
  oldImageUrl: string | null
): Promise<Prompt> {
  let image_url = fields.image_url ?? oldImageUrl
  if (imageFile) {
    if (oldImageUrl) await deleteImage(oldImageUrl).catch(() => {})
    image_url = await uploadImage(imageFile)
  }
  const payload: PromptUpdate = { ...fields, image_url }
  const { data, error } = await supabase.from(TABLE).update(payload).eq('id', id).select().single()
  if (error) throw error
  return data as Prompt
}

export async function deletePrompt(prompt: Prompt): Promise<void> {
  if (prompt.image_url) await deleteImage(prompt.image_url).catch(() => {})
  const { error } = await supabase.from(TABLE).delete().eq('id', prompt.id)
  if (error) throw error
}
