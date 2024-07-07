import { v4 as uuidV4 } from 'uuid';

import query from '../../utils/query.js';
import { User } from '../../utils/types/authentication.js';
import initializeSettingsForUser from '../suggestions/suggestionSettings/initialize.js';

export async function registerNewUser(username: string, email: string, firstName: string, lastName: string) {
    const userId = uuidV4();
    const createdAt = new Date()

    const params = [userId, firstName, lastName, username, email, createdAt];
    const q = ''
    + 'INSERT INTO '
    + 'cooking_recipe_suggester.users '
    + '(id, first_name, last_name, username, email, created_at) '
    + 'VALUES (?, ?, ?, ?, ?, ?)';

    const result = await query(q, params)

    if(typeof result === "string") return 'Error registering user';

    const initializingSuggestionsSettings = await initializeSettingsForUser(userId);

    if(typeof initializingSuggestionsSettings === "string") return 'Error initializing settings';

    return {
        user: {
            id: userId,
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            createdAt: createdAt
        } as User
    };
}