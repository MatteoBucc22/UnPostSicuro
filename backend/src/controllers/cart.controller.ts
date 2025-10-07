import { Request, Response } from 'express';
import { supabase } from '../database/supabaseClient';

export const getCart = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from('cart_item')
    .select('id, ebook_id, specialist_id, ebooks(*), specialists(*)')
    .eq('user_id', userId);

  if (error) return res.status(500).json({ error: error.message });
  // Restituisci un array vuoto se non ci sono elementi
  res.json(data || []);
};

export const addItem = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { ebookId } = req.body;

  // Cerca se esiste già una riga con questo ebook (per sicurezza)
  const { data: existing, error: fetchError } = await supabase
    .from('cart_item')
    .select('*')
    .eq('user_id', userId)
    .eq('ebook_id', ebookId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    return res.status(500).json({ error: fetchError.message });
  }

  if (existing) {
    return res.json(existing); 
  } else {
    const { v4: uuidv4 } = await import('uuid');
    const { data, error } = await supabase
      .from('cart_item')
      .insert({ id: uuidv4(), user_id: userId, ebook_id: ebookId })
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }
};

export const removeItem = async (req: Request, res: Response) => {
  const { userId, itemId } = req.params;

  const { data, error } = await supabase
    .from('cart_item')
    .delete()
    .eq('id', itemId)
    .eq('user_id', userId)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const updateSpecialist = async (req: Request, res: Response) => {
  const { userId, itemId } = req.params;
  const { specialistId } = req.body;

  const { data, error } = await supabase
    .from('cart_item')
    .update({ specialist_id: specialistId })
    .eq('id', itemId)
    .eq('user_id', userId)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
