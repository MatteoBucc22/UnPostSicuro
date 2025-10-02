import { Router } from 'express';
import { getSpecialists, addSpecialist, getSpecialistsbyId } from '../controllers/specialists.controller';

const router = Router();

router.get('/', getSpecialists);
router.post('/', addSpecialist);
router.get('/:id', getSpecialistsbyId);

export default router;
