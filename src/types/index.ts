export interface Prompt {
  id: string
  image_url: string | null
  japanese_prompt: string
  english_prompt: string
  memo: string
  created_at: string
  user_id: string | null
}

export type PromptInsert = Omit<Prompt, 'id' | 'created_at'>
export type PromptUpdate = Partial<PromptInsert>
