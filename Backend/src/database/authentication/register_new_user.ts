import { v4 as uuidV4 } from 'uuid';

import client from '../../db.js';

export async function registerNewUser(username: string, email: string, firstName: string, lastName: string) {
    const userId = uuidV4();
    const createdAt = new Date()

    const params = [userId, firstName, lastName, username, email, createdAt];
    const query = `INSERT INTO cooking_recipe_suggester.users (id, first_name, last_name, username, email, created_at) VALUES (?, ?, ?, ?, ?, ?)`;

    try {
        await client.execute(query, params, { prepare: true });
        return undefined;
    } catch (err) {
        return 'Error on inserting new user in the database - ' + err
    }
}