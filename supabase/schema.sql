create table if not exists public.genres (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.watch_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('Filme', 'Serie')),
  status text not null check (status in ('Quero assistir', 'Assistindo', 'Concluido')),
  rating numeric check (rating >= 0 and rating <= 10),
  notes text,
  genre_id uuid not null references public.genres(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.genres enable row level security;
alter table public.watch_items enable row level security;

create policy "genres are visible for authenticated users"
on public.genres for select
to authenticated
using (true);

create policy "users can read own watch items"
on public.watch_items for select
to authenticated
using (auth.uid() = user_id);

create policy "users can create own watch items"
on public.watch_items for insert
to authenticated
with check (auth.uid() = user_id);

create policy "users can update own watch items"
on public.watch_items for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users can delete own watch items"
on public.watch_items for delete
to authenticated
using (auth.uid() = user_id);

insert into public.genres (name, description)
values
  ('Acao', 'Filmes e series com aventura, conflito e ritmo intenso.'),
  ('Comedia', 'Historias leves com foco em humor e situacoes divertidas.'),
  ('Drama', 'Narrativas emocionais centradas em personagens e conflitos humanos.'),
  ('Ficcao cientifica', 'Obras com tecnologia, futuro, espaco ou ciencia especulativa.'),
  ('Terror', 'Producoes criadas para suspense, medo e atmosfera de tensao.'),
  ('Documentario', 'Conteudos baseados em fatos, pesquisas e acontecimentos reais.')
on conflict (name) do nothing;
