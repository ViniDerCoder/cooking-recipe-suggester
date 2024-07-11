import query from '../../utils/query.js';
import { User } from '../../utils/types/authentication.js';

export async function getUserFromEmail(email: string) {
    const params = [email];
    const q = ''
    + 'SELECT id, first_name, last_name, username, email, created_at '
    + 'FROM '
    + 'cooking_recipe_suggester.users '
    + 'WHERE email = ? '
    + 'ALLOW FILTERING';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error checking for user by email';
    if(result.rows.length > 0) {
        return {
            id: result.rows[0].id.toString('hex'),
            firstName: result.rows[0].first_name,
            lastName: result.rows[0].last_name,
            username: result.rows[0].username,
            email: result.rows[0].email,
            createdAt: new Date(result.rows[0].created_at)
        } as User;
    }
    else return "User not found by email";
}