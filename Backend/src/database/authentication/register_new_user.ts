import { v4 as uuidV4 } from 'uuid';

import query from '../../utils/query.js';

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
    else return undefined;
}