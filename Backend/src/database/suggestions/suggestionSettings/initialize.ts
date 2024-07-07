import query from "../../../utils/query.js";
import { Uuid } from "../../../utils/types/other.js";

export default async function initializeSettingsForUser(userId: Uuid) {

    const params = [userId];

    const q = ''
    + 'INSERT INTO '
    + 'cooking_recipe_suggester.suggestions_user_settings '
    + '(user_id) '
    + 'VALUES (?)';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error initializing settings';
    else return {
        userId: userId
    };
}
