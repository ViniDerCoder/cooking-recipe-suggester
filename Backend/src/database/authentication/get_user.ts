import query from '../../utils/query.js';
import { User } from '../../utils/types.js';

export async function getUser(userId: string) {
    const params = [userId];
    const q = ''
    + 'SELECT * '
    + 'FROM '
    + 'cooking_recipe_suggester.users '
    + 'WHERE authentication_token = ?';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error getting user';
    if(result.rows.length > 0) {
        return {
            id: result.rows[0].id,
            firstName: result.rows[0].first_name,
            lastName: result.rows[0].last_name,
            username: result.rows[0].username,
            email: result.rows[0].email,
            createdAt: result.rows[0].created_at
        } as User;
    }
    else return 'User not found';
}