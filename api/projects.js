// GET /api/projects
// Reads the projects from Supabase and sends them to the Works page as JSON.

import { getSupabase } from './_lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from('projects').select('*').order('sort_order', { ascending: true });

    if (error) throw error;

    // Let Vercel's CDN keep a copy for 5 minutes, so Supabase is not asked on every visit
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(data);
  } catch (error) {
    console.error('GET /api/projects failed:', error);
    return res.status(500).json({ error: 'Could not load projects.' });
  }
}
