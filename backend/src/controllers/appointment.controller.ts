import { Request, Response } from 'express';
import { supabase } from '../database/supabaseClient';

export const getAppointmentsBySpecialist = async (req: Request, res: Response) => {
  const { specialistId } = req.params;
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('specialist_id', specialistId)
      .order('start_time', { ascending: true });

    if (error) throw error;
    console.log(data)
    res.json(data);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Errore caricamento appuntamenti' });
  }
};

export const createPendingAppointment = async (req: Request, res: Response) => {
  const { userId, specialistId, startTime, endTime } = req.body;

  try {
    // Calcola la scadenza a 10 minuti
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Controlla conflitti
    const { data: conflicts, error: conflictError } = await supabase
      .from('appointments')
      .select('*')
      .eq('specialist_id', specialistId)
      .gte('start_time', startTime)
      .lt('end_time', endTime);

    if (conflictError) throw conflictError;
    if (conflicts && conflicts.length > 0) {
      return res.status(400).json({ message: 'Slot già prenotato' });
    }

    // Inserisce appuntamento "bloccato"
    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          user_id: userId,
          specialist_id: specialistId,
          start_time: startTime,
          end_time: endTime,
          status: 'blocked',       // stato iniziale
          expires_at: expiresAt    // scadenza 10 minuti
        }
      ])
      .select();

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Errore durante la prenotazione' });
  }
};



// Conferma appuntamento bloccato
export const confirmAppointment = async (req: Request, res: Response) => {
  const { appointmentId } = req.params;

  if (!appointmentId) {
    return res.status(400).json({ message: 'appointmentId mancante' });
  }

  try {
    const { data, error } = await supabase
      .from('appointments')
      .update({ 
        status: 'booked', 
        expires_at: null // rimuove scadenza
      })
      .eq('id', appointmentId)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Appuntamento non trovato' });
    }

    res.json({ message: 'Appuntamento confermato', appointment: data[0] });
  } catch (err: any) {
    console.error('Errore conferma appuntamento:', err);
    res.status(500).json({ message: 'Errore durante la conferma', error: err.message });
  }
};


// Annulla prenotazione (es. timeout 10 minuti)
export const cancelAppointment = async (req: Request, res: Response) => {
  const { appointmentId } = req.params;
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status: 'canceled', expires_at: null })
      .eq('id', appointmentId)
      .select();

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Errore cancellazione appuntamento' });
  }
};

export const getPendingAppointment = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'blocked')
      .gt('expires_at', now)   // solo ancora valido
      .limit(1);

    if (error) throw error;

    res.json(data?.[0] || null);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Errore recupero appuntamento pendente' });
  }
};

export const getAppointmentsByUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        specialists!inner(id, name, surname)
      `)
      .eq('user_id', userId)
      .order('start_time', { ascending: true });

    if (error) throw error;

    console.log('Raw appointments from Supabase:', JSON.stringify(data, null, 2));

    res.json(data);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Errore caricamento appuntamenti' });
  }
};



export const updateAppointment = async (req: Request, res: Response) => {
  const { appointmentId } = req.params;
  const { start_time, end_time } = req.body;

  if (!start_time || !end_time) {
    return res.status(400).json({ message: 'Data o ora mancanti' });
  }

  try {
    // Controlla conflitti con altri appuntamenti del medesimo specialista
    const { data: currentApp } = await supabase
      .from('appointments')
      .select('specialist_id')
      .eq('id', appointmentId)
      .single();

    if (!currentApp) {
      return res.status(404).json({ message: 'Appuntamento non trovato' });
    }

    const { data: conflicts, error: conflictErr } = await supabase
      .from('appointments')
      .select('*')
      .eq('specialist_id', currentApp.specialist_id)
      .neq('id', appointmentId)
      .gte('start_time', start_time)
      .lt('end_time', end_time);

    if (conflictErr) throw conflictErr;
    if (conflicts && conflicts.length > 0) {
      return res.status(400).json({ message: 'Orario già occupato' });
    }

    // Aggiorna orario
    const { data, error } = await supabase
      .from('appointments')
      .update({ start_time, end_time })
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err: any) {
    console.error('Errore aggiornamento appuntamento:', err);
    res.status(500).json({ message: 'Errore aggiornamento appuntamento', error: err.message });
  }
};

