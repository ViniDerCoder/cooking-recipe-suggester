import express from 'express';
import recipeRoute from './routes/recipeRoutes.js';
import loginRoute from './routes/loginRoutes.js';

const app = express();

app.use(express.json());

app.use('/api/recipes', recipeRoute);
app.use('/api/auth', loginRoute);

export default app;