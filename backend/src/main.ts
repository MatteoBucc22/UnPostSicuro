import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/users.routes';
import ebooksRoutes from './routes/ebooks.routes';
import specialistsRoutes from './routes/specialists.routes';
import authRoutes from './routes/auth.routes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/users', usersRoutes);
app.use('/ebooks', ebooksRoutes);
app.use('/specialists', specialistsRoutes);
app.use('/', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
