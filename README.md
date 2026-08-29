# Ficha GURPS Fantasy

Aplicativo web de ficha de personagem automatizada para GURPS Fantasy (GURPS 4ª edição).
Preencha atributos, vantagens/desvantagens, perícias, magias, equipamento e combate — os
valores derivados (PV, PF, Vontade, Percepção, Velocidade Básica, Deslocamento, Esquiva,
dano de Aparo/Corte, carga e nível de encumbrance) e o total de pontos gastos são
calculados automaticamente.

Múltiplas fichas ficam salvas no navegador (localStorage) e podem ser exportadas/importadas
como JSON.

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

React + TypeScript + Vite, Tailwind CSS, Zustand (estado + persistência) e React Router.

As regras de custo de pontos, tabela de dano por ST e níveis de perícia/carga estão em
`src/gurps/` (`rules.ts` e `calculations.ts`), separadas da interface.
