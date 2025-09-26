import { Request, Response } from 'express';
import { supabase } from '../database/supabaseClient';

// Prendi tutti gli specialisti
export const getSpecialists = async (req: Request, res: Response) => {
  const { data, error } = await supabase.from('specialists').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Aggiungi un nuovo specialista
export const addSpecialist = async (req: Request, res: Response) => {
  const { name, surname, bio, expertise } = req.body;
  const { data, error } = await supabase
    .from('specialists')
    .insert([{ name, surname, bio, expertise }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const deleteSpecialist = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('specialists')
    .delete()
    .eq('id', id)
    .select();

  if (error) return res.status(400).json({ error });
  res.json(data);
};