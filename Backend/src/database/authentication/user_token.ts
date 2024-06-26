import onCleanup from '../../utils/cleanup.js';
import query from '../../utils/query.js';

onCleanup("userAuthenticationTokesCleanup", "DATABASE", async () => {
    const q = ''
    + 'SELECT authentication_token FROM '
    + 'cooking_recipe_suggester.user_authentication '
    + 'WHERE expires_at < ? '
    + 'ALLOW FILTERING';

    const result = await query(q, [new Date()]);
    if(typeof result === "string") return false;

    result.rows.forEach(async (row) => {
        const q = ''
        + 'DELETE FROM '
        + 'cooking_recipe_suggester.user_authentication '
        + 'WHERE authentication_token = ?';

        if(typeof (await query(q, [row.authentication_token])) === "string") return false;
    });
    
    return true;
});

export async function getUserFromToken(token: string) {
    const params = [token];
    const q = ''
    + 'SELECT user_id, expires_at '
    + 'FROM '
    + 'cooking_recipe_suggester.user_authentication '
    + 'WHERE authentication_token = ?';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error checking token exists';
    if(result.rows.length > 0) {
        if(result.rows[0].expires_at < new Date()) return 'Token expired';
        return result.rows;
    }
    else return 'Something went wrong checking token';
}

const tokenExpiresIn = 1000 * 60 * 60 * 24 * 7; // 7 days

export async function insertToken(token: string, userId: string) {
    const params = [token, userId, new Date(Date.now() - tokenExpiresIn)];
    const q = ''
    + 'INSERT INTO '
    + 'cooking_recipe_suggester.user_authentication '
    + '(authentication_token, user_id, expires_at) '
    + 'VALUES (?, ?, ?)';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error inserting token';
    else return undefined;
}