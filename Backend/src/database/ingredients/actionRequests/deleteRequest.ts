import { v4 } from "uuid";

import query from "../../../utils/query.js";
import { Uuid } from "../../../utils/types/other.js";

export default async function deleteRequest(userId: Uuid, ingredientId: Uuid) {
    const actionId = v4();
    const createdAt = new Date();

    const params = [actionId, "DELETE", createdAt, userId, ingredientId];
    const q = ''
    + 'INSERT INTO '
    + 'cooking_recipe_suggester.ingredient_action_requests '
    + '(id, action, created_at, created_by, ingredient_id) '
    + 'VALUES (?, ?, ?, ?, ?)';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error creating delete request';
    else return {
        actionId: actionId,
        action: "DELETE",
        createdAt: new Date(createdAt),
        userId: userId,
        ingredientId: ingredientId
    };
}