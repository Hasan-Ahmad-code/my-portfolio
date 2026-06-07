const express = require('express');
const cors    = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Supabase Connection ─────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

console.log('✅ Supabase client ready');

// ── Routes ──────────────────────────────────────────────

// POST /api/contact  →  Save a new submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, institution, interest, message, resumeLink } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert([{ name, email, institution, interest, message, resume_link: resumeLink }]);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log(`📩 New submission from: ${name} <${email}>`);
    res.status(201).json({ success: true, message: 'Submission saved successfully.' });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// GET /api/submissions  →  View all submissions
app.get('/api/submissions', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch submissions.' });
  }
});

// GET /  →  Health check
app.get('/', (req, res) => {
  res.json({ status: 'Portfolio backend is running 🚀' });
});

// ── Start Server ────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
