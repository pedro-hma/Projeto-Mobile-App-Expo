drop policy if exists "genres are visible for authenticated users" on public.genres;

create policy "genres are visible for authenticated users"
on public.genres for select
to anon, authenticated
using (true);
