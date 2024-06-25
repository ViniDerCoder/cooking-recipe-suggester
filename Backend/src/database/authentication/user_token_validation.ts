import query from '../../utils/query.js';

export async function checkIfTokenIsValid(token: string) {
    const params = [token];
    const q = ''
    + 'SELECT user_id '
    + 'FROM '
    + 'cooking_recipe_suggester.user_authentication '
    + 'WHERE authentication_token = ? '
    + 'ALLOW FILTERING';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error checking if username exists';
    if(result.rows.length > 0) return true;
    else return false;
}