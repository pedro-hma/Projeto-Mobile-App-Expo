# CineBox - App Mobile com Expo

CineBox e um app mobile para organizar uma lista pessoal de filmes e series. O usuario pode criar conta, fazer login, cadastrar itens na lista, editar, excluir, escolher genero, registrar status e nota.
Tambem possui busca externa na TMDb para preencher cartaz e sinopse automaticamente.

## Integrantes

- Pedro HMA

## Tema

Organizador de filmes e series assistidos, em andamento ou desejados.

## Requisitos atendidos

| Requisito | Implementacao |
| --- | --- |
| React Native + Expo | Projeto criado com Expo |
| Expo Router | Rotas na pasta `app/` |
| Estado global | Zustand em `store/auth-store.ts` e `store/cinebox-store.ts` |
| Home | `app/(tabs)/home.tsx` |
| Sobre | `app/(tabs)/sobre.tsx` |
| Tela de equipe | `app/equipe/pedro.tsx` |
| Interacao | Inputs, botoes, seletor, radio buttons e cards |
| CRUD completo | Entidade `watch_items` |
| Exibicao de outra entidade | Entidade `genres` |
| Relacionamento | `watch_items.genre_id` referencia `genres.id` |
| Autenticacao | Supabase Auth com login, logout e sign up |
| Estilizacao | React Native Paper + estilos manuais |
| API externa | Busca de filmes/series na TMDb |

## Tecnologias

- React Native
- Expo
- Expo Router
- Zustand
- Supabase
- React Native Paper
- TypeScript

## Configuracao do Supabase

1. Crie um projeto no Supabase.
2. Abra o SQL Editor.
3. Execute o script em `supabase/schema.sql`.
4. Copie `.env.example` para `.env`.
5. Preencha:

```env
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
EXPO_PUBLIC_TMDB_TOKEN=seu-token-read-access-tmdb
```

## Como rodar

```bash
npm install
npm start
```

Depois, abra no Expo Go ou rode no emulador Android/iOS.

## Entidades do back-end

### genres

Entidade exibida no app. Representa os generos dos filmes e series.

### watch_items

Entidade com CRUD completo.

Campos principais:

- titulo
- tipo: Filme ou Serie
- status: Quero assistir, Assistindo ou Concluido
- nota
- comentario
- sinopse
- cartaz
- genero relacionado
- usuario dono do registro

## Roteiro sugerido para o video

1. Abrir o app.
2. Criar uma conta ou fazer login.
3. Mostrar a Home.
4. Abrir a tela Generos e mostrar dados vindos do back-end.
5. Abrir Minha Lista.
6. Criar um item novo.
7. Editar o item.
8. Excluir o item.
9. Mostrar a tela Sobre.
10. Mostrar a tela do integrante.
11. Fazer logout.

## Publicacao no Expo

Na entrega, adicione aqui o link publicado:

- Link do Expo: pendente

## Video no YouTube

Na entrega, adicione aqui o link publico ou nao listado:

- Link do YouTube: pendente
