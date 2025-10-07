import { Router } from 'express';
import { createOrder, captureOrder, getPaypalConfig } from '../payments/paypal';

const router = Router();

// Crea un ordine PayPal
router.post('/create-order', createOrder);

// Cattura (conferma) il pagamento
router.post('/capture-order', captureOrder);

router.get('/config', (req, res) => {
    res.json({ clientId: process.env.PAYPAL_CLIENT }); // Deve restituire JSON
  });

export default router;
