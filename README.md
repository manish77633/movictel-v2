# Movictel Next.js

Run npm ci and npm run dev from this directory. The homepage is carried over from the Vite preview. Services, Projects, Industries, About, Blog, Contact, and Consultation use editable page records.

Copy .env.example to .env.local before using /admin. Set MOVICTEL_ADMIN_PASSWORD to a strong password of at least 12 characters and MOVICTEL_ADMIN_SECRET to a separate random secret of at least 32 characters. Use HTTPS in production.

The admin uses SQLite for drafts, published content, media and consultation leads. Upload photos or MP4/WebM clips from the page editor. Each file is limited to 20 MB, with a 24 MB request limit; save large clips one at a time. Deploy as one Node.js app using npm run build and npm start. Set MOVICTEL_DB_PATH to a file on a persistent volume and back up the database. For a stateless or multi-instance deployment, replace the local database and media store with managed storage before production.

The existing homepage copy and media are still defined in app/home.jsx. The seeded project is an illustrative concept. Existing WordPress posts and portfolio records need editorial review before migration.
