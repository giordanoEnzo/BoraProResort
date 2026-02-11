
# Bora Pro Resort

Plataforma institucional e sistema de reservas para a Bora Pro Resort.

## Tecnologias

- **Framework**: Next.js 16 (App Router)
- **Banco de Dados**: SQLite
- **ORM**: Prisma
- **Estilização**: CSS Modules (Vanilla)
- **Design**: Responsivo, Premium, Tropical

## Como Rodar

Basta um único comando para iniciar o projeto (Frontend + Backend + Banco de Dados):

```bash
npm run dev
```

Acesse em: `http://localhost:3000`

## Funcionalidades

- **Home**: Apresentação institucional, resorts parceiros.
- **Resorts**: Páginas individuais com calendário interativo.
- **Reservas**: Solicitação de reserva (Status: Pendente).
- **Admin**: Painel administrativo protegido.
  - URL: `/admin`
  - Senha: `admin123`
  - Gestão de status (Confirmar, Cancelar).

## Estrutura

- `src/app`: Rotas e Páginas via App Router.
- `src/components`: Componentes Reutilizáveis (Header, Footer, CalendarSystem, etc).
- `src/lib`: Configuração do Prisma Client.
- `prisma`: Schema do banco de dados e script de seed.

## Comandos Úteis

- `npx prisma studio`: Interface visual para gerenciar o banco de dados.
- `npx prisma db seed`: Repopular o banco de dados com dados iniciais.
