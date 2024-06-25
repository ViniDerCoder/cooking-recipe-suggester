import query from '../../utils/query.js';

export async function checkIfUsernameExists(username: string) {
    const params = [username];
    const q = ''
    + 'SELECT username '
    + 'FROM '
    + 'cooking_recipe_suggester.users '
    + 'WHERE username = ? '
    + 'ALLOW FILTERING';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error checking if username exists';
    if(result.rows.length > 0) return true;
    else return false;
}

export async function checkIfEmailExists(email: string) {
    const params = [email];
    const q = ''
    + 'SELECT email '
    + 'FROM '
    + 'cooking_recipe_suggester.users '
    + 'WHERE email = ? '
    + 'ALLOW FILTERING';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error checking if email exists';
    if(result.rows.length > 0) return true;
    else return false;
}