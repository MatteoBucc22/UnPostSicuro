import { Router } from 'express';
import { userExists, completeRegistration, getUserProfile, updateUserProfile } from '../controllers/users.controller';

const router = Router();

router.get('/exists/:id', userExists); // endpoint per callback Google
router.post('/complete-registration', completeRegistration); // endpoint per dati aggiuntivi Google
router.get('/:id', getUserProfile);
router.patch('/:id', updateUserProfile);
export default router;
