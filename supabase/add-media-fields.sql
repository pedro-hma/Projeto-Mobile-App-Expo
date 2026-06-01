alter table public.watch_items
add column if not exists synopsis text,
add column if not exists poster_url text,
add column if not exists external_id text;
