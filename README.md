# Klarit labs CRM

A React lead-intake and pipeline app built with Vite, Tailwind CSS, and Lucide icons.

## Development

```sh
npm install
npm run dev
```

The client-facing lead form is available at `/`. Admin views use separate routes:

- `/admin/pipeline` — search and manage leads
- `/admin/team` — review team members and workload
- `/admin/analytics` — view lead analytics
- `/admin/intake` — open the intake form with admin presets

The legacy `/?view=admin` URL redirects to `/admin/pipeline`.

Component styles live beside their components in `src/components/*.css`; `src/index.css` contains app-wide design tokens and base styles.

## Production build

```sh
npm run build
npm run preview
```

Leads and team data are stored in the current browser's local storage. The separate views are a UI distinction, not authentication or access control; a production deployment should protect the admin view and persist leads with an authenticated backend.
