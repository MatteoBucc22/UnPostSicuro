import { Request, Response } from 'express';
import { supabase } from '../database/supabaseClient';

// Controlla se utente esiste nella tabella pubblica "users"
export const userExists = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message });
    // Se data è null → utente NON esiste
    res.json(!!data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Inserisce dati aggiuntivi nella tabella pubblica "users" dopo login Google
export const completeRegistration = async (req: Request, res: Response) => {
  try {
    const { email, name, surname, dob, gender, phone, city, providerId } = req.body;

    if (!providerId) {
      return res.status(400).json({ error: 'ID utente mancante' });
    }

    const { data, error } = await supabase.from('users').insert([{
      id: providerId,
      email,
      name,
      surname,
      dob,
      gender,
      phone,
      city
    }]);

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: 'Utente completato con successo', data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
