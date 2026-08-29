# Mapeamento de Vida Apaixonante

Ferramenta online da **Mentoria Bússola** (Instituto Mirra) para as alunas
desenharem como querem viver a vida pessoal no futuro e, a partir disso,
entenderem a estrutura de negócio que precisam construir para servir a essa
vida. Ao final, a aluna gera um PDF com todas as respostas.

Etapas do mapeamento:

1. **Negociáveis & Inegociáveis** — o que ela está disposta a negociar em
   tarefas, rotinas e situações do dia a dia, e o que não negocia de jeito
   nenhum.
2. **Rotina da vida apaixonante** — uma tabela com os 7 dias da semana,
   divididos em manhã / tarde / noite, onde ela escreve o que quer viver em
   cada bloco.
3. **Revisão e PDF** — revisão de tudo e geração do PDF final para download.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Supabase](https://supabase.com) para autenticação (login com e-mail e
  senha) e banco de dados (as respostas de cada aluna ficam salvas)
- [`@react-pdf/renderer`](https://react-pdf.org) para gerar o PDF final no
  servidor

## Configurando o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **Authentication → Providers**, deixe o login por **Email** habilitado
   (é o padrão). Se quiser exigir confirmação por e-mail antes do primeiro
   acesso, mantenha "Confirm email" ativado em **Authentication → Sign In / Providers**.
3. Em **Authentication → URL Configuration**, defina a *Site URL* como a URL
   onde o app vai rodar em produção (ex: `https://mapeamento.institutomirra.com`)
   e adicione essa mesma URL (e `http://localhost:3000` para testes locais)
   em *Redirect URLs* — isso é necessário para o link de "esqueci minha
   senha" funcionar.
4. Vá em **SQL Editor**, cole o conteúdo do arquivo [`supabase/schema.sql`](./supabase/schema.sql)
   deste repositório e execute. Isso cria as tabelas `profiles` e
   `mapeamentos`, com Row Level Security habilitado (cada aluna só acessa os
   próprios dados).
5. Em **Project Settings → API**, copie a **Project URL** e a chave
   **anon public**.

## Configurando o projeto localmente

```bash
cp .env.example .env.local
```

Preencha `.env.local` com os valores do seu projeto Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

Se for usar o fluxo de "esqueci minha senha" em produção, defina também:

```
NEXT_PUBLIC_SITE_URL=https://sua-url-em-producao.com
```

Instale as dependências e rode o servidor de desenvolvimento:

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Deploy

O app é um projeto Next.js padrão — pode ser publicado na
[Vercel](https://vercel.com/new) (recomendado) ou em qualquer host que
suporte Next.js. Configure as mesmas variáveis de ambiente do `.env.local`
nas configurações do projeto na plataforma escolhida.

## Estrutura

```
src/
  app/
    (auth)/            login, cadastro, esqueci-senha, redefinir-senha
    auth/               server actions e callback de autenticação
    dashboard/          painel da aluna com o progresso do mapeamento
    mapeamento/         as 3 etapas do formulário (negociáveis, rotina, revisão)
    api/pdf/             gera e retorna o PDF final
  components/           componentes de UI reutilizáveis
  lib/
    supabase/            clients do Supabase (browser, server, middleware)
    types.ts              tipos do domínio (Mapeamento, Rotina, etc.)
    mapeamento.ts          leitura/criação do mapeamento da aluna
    pdf-document.tsx       layout do PDF (@react-pdf/renderer)
supabase/
  schema.sql             schema SQL para rodar no seu projeto Supabase
```

Cada aluna tem um único mapeamento, que fica salvo e pode ser editado a
qualquer momento — o PDF é gerado sob demanda a partir dos dados salvos.
