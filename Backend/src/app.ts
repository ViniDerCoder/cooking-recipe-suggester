import express from 'express';
import cors, { CorsOptions } from 'cors';

import recipeRoute from './routes/recipeRoutes.js';
import loginRoute from './routes/loginRoutes.js';
import ingredientRoute from './routes/ingredientRoutes.js';
import suggestionRoute from './routes/suggestionsRoutes.js';

const app = express();

const allowedOrigins: string[] = ['http://localhost:3000', 'https://vinidercoder.github.io'];

const corsOptions: CorsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/recipes', recipeRoute);
app.use('/api/auth', loginRoute);
app.use('/api/ingredients', ingredientRoute);
app.use('/api/suggestions', suggestionRoute);

export default app;