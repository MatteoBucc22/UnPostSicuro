import { Request, Response } from 'express';
import { supabase } from '../database/supabaseClient';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name, surname, dob, gender, phone, city } = req.body;

    // Registrazione utente con Supabase Auth
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
};
