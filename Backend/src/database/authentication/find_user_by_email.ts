import query from '../../utils/query.js';

type User = {
    id: string,
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    createdAt: Date
}

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
            id: result.rows[0].id,
            firstName: result.rows[0].first_name,
            lastName: result.rows[0].last_name,
            username: result.rows[0].username,
            email: result.rows[0].email,
            createdAt: result.rows[0].created_at
        } as User;
    }
    else return "User not found by email";
}