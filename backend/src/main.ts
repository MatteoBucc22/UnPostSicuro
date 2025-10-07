import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import usersRoutes from './routes/users.routes';
import ebooksRoutes from './routes/ebooks.routes';
import specialistsRoutes from './routes/specialists.routes';
import authRoutes from './routes/auth.routes';
import cartRoutes from './routes/cart.routes';
import paymentsRoutes from './routes/payment.routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ ROUTES
app.use('/users', usersRoutes);
app.use('/ebooks', ebooksRoutes);
app.use('/specialists', specialistsRoutes);
app.use('/users', cartRoutes);
app.use('/auth', authRoutes);
app.use('/payments', paymentsRoutes); // 👈 route per i pagamenti

// ✅ SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
