import express from 'express';
import cors, { CorsOptions } from 'cors';

import recipeRoute from './routes/recipeRoutes.js';
import loginRoute from './routes/loginRoutes.js';
import ingredientRoute from './routes/ingredientRoutes.js';
import suggestionRoute from './routes/suggestionsRoutes.js';

const app = express();

const allowedOrigins: string[] = ['http://localhost:3000', 'https://vinidercoder.github.io', 'https://cooking-recipe-suggester.loca.lt'];

const corsOptions: CorsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'bypass-tunnel-reminder'],
    optionsSuccessStatus: 200,
    preflightContinue: false,
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(express.json({limit: '1mb'}));

app.use('/api/recipes', recipeRoute);
app.use('/api/auth', loginRoute);
app.use('/api/ingredients', ingredientRoute);
app.use('/api/suggestions', suggestionRoute);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err.message === 'Not allowed by CORS') {
        res.status(403).json({ error: 'CORS policy does not allow access from the specified origin.' });
    } else {
        next(err);
    }
});

export default app;