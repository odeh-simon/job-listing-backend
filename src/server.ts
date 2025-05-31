import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import env from './utils/env.utils';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app: Express = express();

// Middleware
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174", "https://job-demo.onrender.com", "https://job-user-demo.onrender.com", "https://job-user-frontend-ten.vercel.app", "https://job-admin-frontend-iota.vercel.app"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Koovly Backend API' });
});

// Error handling (must be after all other app.use/app.get/app.post)
app.use(errorHandler);

// Start server
app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});