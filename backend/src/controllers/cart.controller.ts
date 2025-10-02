import { Request, Response } from 'express';
import { supabase } from '../database/supabaseClient';

export const getCart = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { data, error } = await supabase
    .from('cart_items')
    .select('id, ebook_id, specialist_id, ebooks(*), specialists(*)')
    .eq('user_id', userId);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const addItem = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { ebookId } = req.body;

  // Aggiorna la row esistente (qui supponiamo ci sia una row per userId senza ebook_id)
  const { data, error } = await supabase
    .from('cart_items')
    .update({ ebook_id: ebookId })
    .eq('user_id', userId)
    .is('ebook_id', null)   // aggiorna solo le row dove ebook_id è NULL
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};


export const removeItem = async (req: Request, res: Response) => {
  const { userId, itemId } = req.params;

  const { data, error } = await supabase
    .from('cart_items')
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
    .from('cart_items')
    .update({ specialist_id: specialistId })
    .eq('id', itemId)
    .eq('user_id', userId)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
