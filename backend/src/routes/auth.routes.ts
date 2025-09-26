import { Router } from 'express';
import { supabase } from '../database/supabaseClient';

const router = Router();

// Login/registrazione email/password
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, surname, dob, gender, phone, city } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) return res.status(400).json({ error: authError.message });
    if (!authData.user?.id) return res.status(500).json({ error: 'ID utente mancante' });

    const { data: userData, error: dbError } = await supabase.from('users').insert([{
      id: authData.user.id,
      email,
      name,
      surname,
      dob,
      gender,
      phone,
      city
    }]);

    if (dbError) return res.status(500).json({ error: dbError.message });

    res.json({ message: 'Utente registrato con successo', user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

// // Login/registrazione Google → backend gestisce il callback
// router.get('/auth/google', async (req, res) => {
//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: 'google',
//     options: { redirectTo: 'http://localhost:3000/auth/google/callback' }
//   });
//   if (error) return res.status(400).json({ error: error.message });
//   res.redirect(data.url!);
// });

// router.get('/auth/google/callback', async (req, res) => {
//   const { code } = req.query;
//   if (!code) return res.status(400).send('Code mancante');

//   const { data, error } = await supabase.auth.exchangeCodeForSession(code as string);
//   if (error || !data.user) return res.status(400).send('Errore OAuth');

//   const user = data.user;

//   // Controlla se utente già presente in tabella users
//   const { data: existingUser } = await supabase
//     .from('users')
//     .select('*')
//     .eq('id', user.id)
//     .single();

//   if (!existingUser) {
//     return res.redirect(`http://localhost:4200/registration-page?email=${user.email}&id=${user.id}`);
//   }

//   res.redirect('http://localhost:4200/');
// });

export default router;
