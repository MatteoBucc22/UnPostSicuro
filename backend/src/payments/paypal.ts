import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { supabase } from '../database/supabaseClient';

dotenv.config();

const PAYPAL_API = process.env.PAYPAL_API || 'https://api-m.sandbox.paypal.com';
const PAYPAL_CLIENT = process.env.PAYPAL_CLIENT!;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET!;

async function getAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`).toString('base64');
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()).access_token;
}

// Crea un ordine PayPal
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, userId } = req.body;
    if (!amount || !userId) {
      return res.status(400).json({ error: 'userId o amount mancante' });
    }

    console.log('Creazione ordine per userId:', userId, 'amount:', amount);

    const accessToken = await getAccessToken();

    // Crea ordine PayPal
    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{ amount: { currency_code: 'EUR', value: parseFloat(amount).toFixed(2) } }],
      }),
    });

    const data = await response.json();
    console.log('Risposta PayPal:', data);

    if (!data.id) {
      console.error('Errore: PayPal non ha restituito orderID');
      return res.status(500).json({ error: 'Errore creazione ordine PayPal' });
    }

    // Inserimento ordine in Supabase
    const { error: dbError } = await supabase
      .from('payments')
      .insert([{ user_id: userId, order_id: data.id, amount: parseFloat(amount), status: 'CREATED' }]);

    if (dbError) {
      console.error('Errore inserimento DB:', dbError);
      return res.status(500).json({ error: 'Errore inserimento pagamento su DB' });
    }

    console.log('Ordine salvato su DB con successo');

    res.json({ id: data.id, status: data.status });
  } catch (err) {
    console.error('Errore completo createOrder:', err);
    res.status(500).json({ error: 'Errore interno createOrder', details: err instanceof Error ? err.message : err });
  }
};


// Cattura pagamento PayPal e svuota il carrello
export const captureOrder = async (req: Request, res: Response) => {
  try {
    const { orderID, userId } = req.body;
    if (!orderID || !userId) return res.status(400).json({ error: 'orderID o userId mancante' });

    const accessToken = await getAccessToken();
    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    // Aggiorna lo stato del pagamento
    if (data.status === 'COMPLETED') {
      await supabase.from('payments')
        .update({ status: 'COMPLETED', completed_at: new Date().toISOString() })
        .eq('order_id', orderID);

      // svuota carrello
      await supabase.from('cart_item').delete().eq('user_id', userId);
    } else {
      await supabase.from('payments')
        .update({ status: 'FAILED' })
        .eq('order_id', orderID);
    }

    res.json(data);
  } catch (err) {
    console.error('Errore cattura pagamento PayPal:', err);
    res.status(500).json({ error: 'Errore cattura pagamento PayPal' });
  }
};


export const getPaypalConfig = (req: Request, res: Response) => {
    res.json({ clientId: process.env.PAYPAL_CLIENT });
  };
