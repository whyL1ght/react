# Architecture Catalog

Architecture Catalog is a React application for browsing heritage buildings
used for measured drawing study. It includes a searchable and sortable
collection, style filtering, pagination, building details, and a controlled
form for adding buildings.

## Features

- 120 initial building records
- Search by building name or city
- Filter by architectural style
- Sort by name, oldest, or newest
- Pagination with 12 buildings per page
- List and detail views
- Controlled add-building form with validation
- Loading, error, empty, and success states
- Responsive layout for desktop and mobile

## Data source

The project uses the provided simulated API in `src/api.js`. The initial
records are generated in `src/data.js`, and browser `localStorage` is used to
persist buildings added through the form. The data is madeup and not accurate

This means the initial catalog is available to every visitor, while buildings
added by a user are saved only in that user's browser.

## Tech stack

- React
- Vite
- JavaScript
- CSS

## Run locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run the linter:

```bash
npm run lint
```

## Deployment

The application can be deployed with Vercel from the project directory:

```bash
npx vercel login
npx vercel --prod
```

When deploying from the monorepo dashboard, use
`midterm/arch-catalog` as the Root Directory.
