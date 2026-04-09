-- ① テーブル作成
create table public.prompts (
  id uuid primary key default gen_random_uuid(),
  image_url text,
  japanese_prompt text not null default '',
  english_prompt text not null default '',
  memo text not null default '',
  user_id uuid,
  created_at timestamptz not null default now()
);

-- ② RLS 有効化（全員読み書き可能 = 共有モード）
alter table public.prompts enable row level security;

create policy "anyone can read prompts"
  on public.prompts for select using (true);

create policy "anyone can insert prompts"
  on public.prompts for insert with check (true);

create policy "anyone can update prompts"
  on public.prompts for update using (true);

create policy "anyone can delete prompts"
  on public.prompts for delete using (true);

-- ③ Storage バケット作成（Supabase Dashboard > Storage から「prompt-images」を作成し Public にする）
-- または SQL で：
insert into storage.buckets (id, name, public)
values ('prompt-images', 'prompt-images', true)
on conflict (id) do nothing;

create policy "anyone can upload images"
  on storage.objects for insert with check (bucket_id = 'prompt-images');

create policy "anyone can view images"
  on storage.objects for select using (bucket_id = 'prompt-images');

create policy "anyone can delete images"
  on storage.objects for delete using (bucket_id = 'prompt-images');
