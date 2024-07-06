import query from "../../../utils/query.js";

export default async function getSettingsOfUser(userId: string) {

    const params = [userId];

    const q = ''
    + 'SELECT * FROM '
    + 'cooking_recipe_suggester.suggestions_user_settings '
    + 'WHERE user_id = ?';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error initializing settings';
    else return 
    
}