import express from 'express';

import verifyRequest from '../utils/defaultVerification.js';
import limit from '../utils/rate-limiter.js';
import { editSuggestionsSettings, getSuggestionsSettings } from '../controller/suggestions/settings.js';
import { AuthenticationUser } from '../utils/types/authentication.js';
import { getSuggestionsForUser, removeUserSuggestions } from '../controller/suggestions/suggestions.js';

const router = express.Router();

router.use(async (req, res, next) => {
    verifyRequest(req, res, next);
});

router.get('/', limit(1000 * 60 * 5, 5), async (req, res) => {
    const user = req.body.user as AuthenticationUser;

    const suggestions = await getSuggestionsForUser(user.userId);

    if(typeof suggestions === "string") res.status(400).send({error: suggestions});
    else res.send({error: undefined, message: "Fetching of suggestions was successfull", data: { suggestions: suggestions }});
});

router.post('/', limit(1000 * 60 * 2, 3), async (req, res) => {
    const user = req.body.user as AuthenticationUser;

    removeUserSuggestions(user.userId);

    const suggestions = await getSuggestionsForUser(user.userId);

    if(typeof suggestions === "string") res.status(400).send({error: suggestions});
    else res.send({error: undefined, message: "Fetching of new suggestions was successfull", data: { suggestions: suggestions }});
});

router.post('/settings/', limit(1000 * 60 * 5, 3), async (req, res) => {
    const user = req.body.user;
    const settings = req.body.settings;

    const result = await editSuggestionsSettings(user.id, settings);

    if(typeof result === "string") res.status(400).send({error: result});
    else res.send({error: undefined, message: "Editing of suggestions settings was successfull", data: { settings: result }});
});

router.get('/settings/', limit(1000 * 60 * 5, 3), async (req, res) => {
    const user = req.body.user;

    const settings = await getSuggestionsSettings(user.id);

    if(typeof settings === "string") res.status(400).send({error: settings});
    else res.send({error: undefined, message: "Fetching of suggestions settings was successfull", data: { settings: settings }});
})

export default router;
