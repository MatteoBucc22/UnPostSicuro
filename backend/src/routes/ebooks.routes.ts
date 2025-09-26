import { Router } from 'express';
import { getEbooks, addEbook, getEbookById } from '../controllers/ebooks.controller';

const router = Router();

router.get('/', getEbooks);
router.post('/', addEbook);
router.get('/:id', getEbookById);

export default router;
