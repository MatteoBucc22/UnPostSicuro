import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import {supabase} from './database/supabaseClient'

import usersRoutes from './routes/users.routes';
import ebooksRoutes from './routes/ebooks.routes';
import specialistsRoutes from './routes/specialists.routes';
import authRoutes from './routes/auth.routes';
import cartRoutes from './routes/cart.routes';
import paymentsRoutes from './routes/payment.routes';
import appointmentRoutes from './routes/appointment.routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use('/users', usersRoutes);
app.use('/ebooks', ebooksRoutes);
app.use('/specialists', specialistsRoutes);
app.use('/users', cartRoutes);
app.use('/auth', authRoutes);
app.use('/payments', paymentsRoutes);
app.use('/appointments', appointmentRoutes);


cron.schedule('* * * * *', async () => {
    console.log('⏱️ Controllo appuntamenti scaduti...');
  
    try {
      const now = new Date().toISOString();
  
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'canceled', expires_at: null })
        .lt('expires_at', now)
        .eq('status', 'blocked')
        .select();
  
      if (error) throw error;
  
      if (data && data.length > 0) {
        console.log(`❌ Cancellati ${data.length} appuntamenti scaduti.`);
      }
    } catch (err) {
      console.error('Errore nel cron job:', err);
    }
  });

// SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
