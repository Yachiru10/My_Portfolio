// Creates supabase/2_seed.sql from public/data/projects.json.
// Run it after you edit projects.json:   node scripts/make-seed.js
// Then paste the new 2_seed.sql into the Supabase SQL Editor again.

import { readFileSync, writeFileSync } from 'node:fs';

const projects = JSON.parse(readFileSync('public/data/projects.json', 'utf8'));
const json = JSON.stringify(projects, null, 2);

if (json.includes('$json$')) {
  throw new Error('projects.json must not contain the text $json$');
}

const sql = `-- STEP 2 of 2: Run this in Supabase > SQL Editor (after 1_schema.sql).
-- It fills the projects table. This file was made by scripts/make-seed.js.
-- Running it again replaces the old project rows with these.

delete from public.projects;

insert into public.projects
select * from jsonb_populate_recordset(null::public.projects, $json$
${json}
$json$::jsonb);
`;

writeFileSync('supabase/2_seed.sql', sql);
console.log(`Wrote supabase/2_seed.sql with ${projects.length} projects.`);
