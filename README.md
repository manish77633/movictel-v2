# Movictel Next.js

Run npm ci and npm run dev from this directory. The homepage is carried over from the Vite preview. Services, Projects, Industries, About, Blog, Contact, and Consultation use editable page records.

Copy .env.example to .env.local before using /admin. Set MOVICTEL_ADMIN_PASSWORD to a strong password of at least 12 characters and MOVICTEL_ADMIN_SECRET to a separate random secret of at least 32 characters. Use HTTPS in production.

The admin uses SQLite for drafts, published content, media and consultation leads. Upload photos or MP4/WebM clips from the page editor. Each file is limited to 20 MB, with a 24 MB request limit; save large clips one at a time. Deploy as one Node.js app using npm run build and npm start. Set MOVICTEL_DB_PATH to a file on a persistent volume and back up the database. For a stateless or multi-instance deployment, replace the local database and media store with managed storage before production.

For Hostinger, use a Node.js Web App or a Node.js server on a VPS. Use Node.js 22 or 24 and point MOVICTEL_DB_PATH to a writable absolute file path outside the deployment's versioned build folders. Copy the existing SQLite file to that location before first start if you want to retain local CMS data and uploaded files. This configuration does not require a MongoDB connection URL.

To email new enquiries, set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `ENQUIRY_TO_EMAIL` in the hosting dashboard. For Hostinger Email use `smtp.hostinger.com`, port `465` (or `587` with STARTTLS), the full sending mailbox address, its SMTP password, and the receiving Gmail address. The visitor email is used for replies. Enquiries are saved before email is attempted and remain in Content Studio → Enquiries if sending fails. A failed send is logged and is not retried automatically.

The Content Studio lists pages by their website name and URL. Use Pages to save or publish content, and SEO to edit the search title, description, canonical URL, page heading, crawler directives and social card. SEO publishing updates metadata and the page heading on the live version. Other unpublished page changes remain in the draft. The sitemap includes published, indexable canonical pages. The Settings panel accepts the Google Search Console HTML verification value.

Open Pages → Home to see the eleven built-in landing-page sections in their published order. Each panel contains the fields for that section, including visibility, background color, background media and an optional button. Use the arrows to change the section order and the destination menu to link to an existing page or anchor. The Services directory, individual services, Blog, articles, About, Contact and Portfolio expose their template sections in the same editor. Saved records supply the content while the templates supply page structure, responsive behavior and interactive components. Header and Footer have site-wide editors.

Media supports single and batch upload, search, and reuse from the section editor and SEO editor. Use a direct HTTPS URL to reference externally hosted media. Upload JPG, PNG, WebP, MP4 or WebM, with a 20 MB per-file limit and a 24 MB combined request limit. For larger batches, split the selection across requests. Built-in URLs are fixed. CMS-created pages can be deleted, while the existing application assets are managed in source control.

SQLite creates the additional CMS tables automatically on first use. Back up the existing SQLite database before deployment. No seed or reset is required. Google Search Console separately controls property verification and indexing requests for the deployed domain.

Saving a draft leaves the editor open and updates matching draft previews in the same browser. Publish section applies that section to the live page while leaving other pending edits in the editor. Publishing updates matching public preview tabs in the same browser without a full browser reload. SEO includes live mobile and desktop search and social previews while editing. Google chooses the final display for search results after crawling the deployed page.

The seeded project is an illustrative concept. Existing WordPress posts and portfolio records need editorial review before migration.
