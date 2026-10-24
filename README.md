# Renzo Mingan – Portfolio

Personal portfolio of Renzo Mingan, backend developer.

**Stack:** HTML · Tailwind CSS · JavaScript · Node.js (Vercel Functions) · Supabase (PostgreSQL) · Vercel

## What is inside

```
renzo-portfolio/
├─ public/                ← everything the visitor downloads
│  ├─ index.html          ← Home
│  ├─ about.html          ← About
│  ├─ works.html          ← Works + project popup
│  ├─ contact.html        ← Contact form
│  ├─ css/output.css      ← made by Tailwind (do not edit by hand)
│  ├─ js/main.js          ← theme button, mobile menu, typing text
│  ├─ js/works.js         ← loads projects, filters, popup, slider
│  ├─ js/contact.js       ← checks and sends the form
│  ├─ data/projects.json  ← backup copy of the projects
│  └─ images/             ← screenshots (WebP, about 600 KB total)
├─ api/                   ← the backend (Node.js)
│  ├─ projects.js         ← GET  /api/projects → reads Supabase
│  ├─ contact.js          ← POST /api/contact  → saves to Supabase, emails you
│  └─ _lib/               ← shared code (not an API route)
├─ supabase/
│  ├─ 1_schema.sql        ← creates the tables
│  └─ 2_seed.sql          ← adds the 3 projects
├─ src/input.css          ← your Tailwind + color settings
├─ scripts/make-seed.js   ← rebuilds 2_seed.sql from projects.json
├─ tailwind.config.js
├─ vercel.json
└─ .env.example           ← the secret keys you need
```

## Commands

| Command | What it does |
|---|---|
| `npm install` | Downloads the tools (run once) |
| `npm run build` | Makes `public/css/output.css` |
| `npm run watch` | Remakes the CSS every time you save a file |
| `npm run preview` | Opens the site at http://localhost:3000 (no backend) |
| `npm run dev` | Runs the site and the backend together (needs the Vercel CLI) |
| `node scripts/make-seed.js` | Rebuilds `supabase/2_seed.sql` after you edit `projects.json` |

## Things to change before going live

1. Replace `Yachiru10` with your GitHub username (search all files for it).
2. Put your resume in `public/` and name it `Renzo_Mingan_CV.pdf`.

## How the backend works

- **Works page:** the browser calls `/api/projects`. The Node.js function reads the `projects` table in Supabase and sends it back as JSON. If the API cannot be reached, the page uses `public/data/projects.json`.
- **Contact form:** the browser sends the form to `/api/contact`. The function checks the data again on the server, blocks spam (a hidden "honeypot" field and a limit of 3 messages per email every 10 minutes), saves the message in Supabase, and emails you a copy if Gmail is set up.
- **Security:** both tables have Row Level Security turned on with no public rules, so the browser cannot touch the database directly. Only the server, using the secret service role key, can read or write.
