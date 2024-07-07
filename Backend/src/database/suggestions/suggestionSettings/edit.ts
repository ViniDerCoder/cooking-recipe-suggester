import query from "../../../utils/query.js";
import { Uuid } from "../../../utils/types/other.js";

export default async function editSettingsOfUser(userId: Uuid, changes: {key: string, value: any}[]) {

    const params = changes.map((change) => change.value);

    params.push(userId)

    const q = ''
    + 'UPDATE '
    + 'cooking_recipe_suggester.suggestions_user_settings '
    + 'SET '
    + changes.map((change, index) => {
        return `${change.key} = ?` + (index < changes.length - 1 ? ', ' : '');
    }).join('')
    + ' WHERE user_id = ?';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error editing settings';
    else return undefined
}