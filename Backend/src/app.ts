import express from 'express';
import recipeRoute from './routes/recipeRoutes.js';

const app = express();

app.use(express.json());

app.use('/api/recipes', recipeRoute);

export default app;