-- Troque o e-mail abaixo pelo e-mail do usuario usado no login do app.
-- Depois execute este arquivo no SQL Editor do Supabase.

with app_user as (
  select id
  from auth.users
  where email = 'SEU_EMAIL_AQUI'
  limit 1
),
seed_items as (
  select
    'Interestelar' as title,
    'Filme' as type,
    'Concluido' as status,
    9::numeric as rating,
    'Visual marcante e historia envolvente sobre tempo, familia e exploracao espacial.' as notes,
    'Um grupo de exploradores viaja por um buraco de minhoca em busca de um novo lar para a humanidade.' as synopsis,
    'Ficcao cientifica' as genre_name
  union all
  select
    'Breaking Bad',
    'Serie',
    'Assistindo',
    8::numeric,
    'Serie intensa, com evolucao forte dos personagens.',
    'Um professor de quimica passa a produzir metanfetamina enquanto enfrenta uma doenca grave e conflitos morais.',
    'Drama'
  union all
  select
    'Invocacao do Mal',
    'Filme',
    'Quero assistir',
    null::numeric,
    'Adicionar a lista para assistir depois.',
    'Investigadores paranormais ajudam uma familia aterrorizada por uma presenca sombria em uma casa isolada.',
    'Terror'
  union all
  select
    'Divertida Mente',
    'Filme',
    'Concluido',
    7::numeric,
    'Filme criativo e leve, com boa mensagem emocional.',
    'As emocoes de uma garota tentam guia-la durante uma fase de mudancas importantes em sua vida.',
    'Comedia'
  union all
  select
    'O Poco',
    'Filme',
    'Concluido',
    4::numeric,
    'Ideia interessante, mas experiencia pesada.',
    'Presos em uma estrutura vertical precisam lidar com escassez, egoismo e sobrevivencia.',
    'Drama'
)
insert into public.watch_items (
  title,
  type,
  status,
  rating,
  notes,
  synopsis,
  poster_url,
  external_id,
  genre_id,
  user_id
)
select
  seed_items.title,
  seed_items.type,
  seed_items.status,
  seed_items.rating,
  seed_items.notes,
  seed_items.synopsis,
  null,
  null,
  genres.id,
  app_user.id
from seed_items
cross join app_user
join public.genres
  on lower(genres.name) = lower(seed_items.genre_name)
where not exists (
  select 1
  from public.watch_items existing
  where existing.user_id = app_user.id
    and lower(existing.title) = lower(seed_items.title)
);
