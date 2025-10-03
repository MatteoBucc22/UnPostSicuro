import { Router } from 'express';
import { registerUser } from '../controllers/auth.controller';

const router = Router();

// Registrazione email/password
router.post('/register', registerUser);

// // Login/registrazione Google (commentato per ora)
// router.get('/auth/google', googleAuth);
// router.get('/auth/google/callback', googleAuthCallback);

export default router;
