import express from 'express';
import cors from 'cors';

import recipeRoute from './routes/recipeRoutes.js';
import loginRoute from './routes/loginRoutes.js';
import ingredientRoute from './routes/ingredientRoutes.js';
import suggestionRoute from './routes/suggestionsRoutes.js';

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/recipes', recipeRoute);
app.use('/api/auth', loginRoute);
app.use('/api/ingredients', ingredientRoute);
app.use('/api/suggestions', suggestionRoute);

export default app;