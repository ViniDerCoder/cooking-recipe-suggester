import query from '../../utils/query.js';
import { User } from '../../utils/types/authentication.js';
import { Uuid } from '../../utils/types/other.js';

export async function getUser(userId: Uuid) {
    const params = [userId];
    const q = ''
    + 'SELECT * '
    + 'FROM '
    + 'cooking_recipe_suggester.users '
    + 'WHERE id = ?';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error getting user';
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
    else return 'User not found';
}