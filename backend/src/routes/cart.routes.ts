import { Router } from 'express';
import { getCart, addItem, removeItem, updateSpecialist } from '../controllers/cart.controller';

const router = Router();

// GET carrello di un utente
router.get('/:userId/cart', getCart); // 🔹 aggiunto /cart

// POST aggiungi un ebook al carrello
router.post('/:userId/cart/add', addItem);

// DELETE rimuovi un item dal carrello
router.delete('/:userId/cart/remove/:itemId', removeItem);

// PATCH aggiorna specialist selezionato per un item
router.patch('/:userId/cart/item/:itemId/specialist', updateSpecialist);

export default router;
