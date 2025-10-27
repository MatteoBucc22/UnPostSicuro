import { Request, Response } from 'express';
import { supabase } from '../database/supabaseClient';

export const getEbooks = async (req: Request, res: Response) => {
  const { data, error } = await supabase.from('ebooks').select('*');
  console.log(data)
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const addEbook = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const { data, error } = await supabase.from('ebooks').insert([{ title, description }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// 👇 NUOVO ENDPOINT: singolo ebook
export const getEbookById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('ebooks')
    .select('*')
    .eq('id', id)   // filtra per id
    .single();      // restituisce un solo record

  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
};
