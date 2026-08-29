# Ficha GURPS Fantasy

Aplicativo web de ficha de personagem automatizada para GURPS Fantasy (GURPS 4ª edição),
com contas de usuário para uma campanha: cada jogador mantém sua própria ficha e o
narrador (administrador) concede XP, que atualiza o total de pontos disponíveis do
personagem.

Preencha atributos, vantagens/desvantagens, perícias, magias, equipamento e combate — os
valores derivados (PV, PF, Vontade, Percepção, Velocidade Básica, Deslocamento, Esquiva,
dano de Aparo/Corte, carga e nível de encumbrance) e o total de pontos gastos são
calculados automaticamente.

## Contas e papéis

- Login é feito por e-mail e senha (Supabase Auth).
- A **primeira pessoa a criar uma conta** no app vira automaticamente **narrador**
  (administrador da campanha); todas as contas seguintes entram como **jogador**.
- Jogador: cria e edita suas próprias fichas. O campo "Pontos totais" é somente leitura —
  ele sobe conforme o narrador concede XP.
- Narrador: enxerga as fichas de todos os jogadores na tela inicial, pode editar qualquer
  ficha e tem o botão **Conceder XP** em cada uma (pontos + motivo opcional), que fica
  registrado no histórico de XP da ficha.
- Para promover ou rebaixar alguém manualmente depois, rode no SQL Editor do Supabase:
  ```sql
  update public.profiles set role = 'narrador' where email = 'email@exemplo.com';
  ```

## Configurando o Supabase (obrigatório para login funcionar)

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. No painel do projeto, abra **SQL Editor**, cole o conteúdo de `supabase/schema.sql`
   inteiro e rode. Isso cria as tabelas (`profiles`, `characters`, `xp_grants`), os
   gatilhos (perfil automático no cadastro, primeiro usuário vira narrador, proteção do
   campo de pontos) e as políticas de RLS (cada jogador só vê/edita a própria ficha; o
   narrador vê e edita todas).
3. Em **Project Settings > API**, copie a **Project URL** e a **anon public key**.
4. Copie `.env.example` para `.env` e preencha:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
5. (Opcional, para testar rápido com o grupo) em **Authentication > Providers > Email**,
   você pode desativar "Confirm email" para que o cadastro não exija clicar num link por
   e-mail antes do primeiro login.

Sem essas variáveis configuradas, o app mostra uma tela avisando que o Supabase não foi
configurado, em vez de quebrar.

## Rodando localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
```

## Stack

React + TypeScript + Vite, Tailwind CSS, Zustand (estado), React Router e Supabase
(autenticação + banco de dados Postgres com Row Level Security).

As regras de custo de pontos, tabela de dano por ST e níveis de perícia/carga estão em
`src/gurps/` (`rules.ts` e `calculations.ts`), puras e independentes da interface ou do
backend. A camada de acesso ao Supabase fica em `src/data/charactersApi.ts` e
`src/auth/AuthContext.tsx`.
