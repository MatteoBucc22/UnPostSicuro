import { Router } from 'express';
import { getSpecialists, addSpecialist } from '../controllers/specialists.controller';

const router = Router();

router.get('/', getSpecialists);
router.post('/', addSpecialist);

export default router;
