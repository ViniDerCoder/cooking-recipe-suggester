import { v4 } from "uuid";

import query from "../../../utils/query.js";

export default async function editRequest(userId: string, ingredientId: string) {
    const actionId = v4();
    const createdAt = new Date();

    const params = [actionId, "UPDATE", createdAt, userId, ingredientId];
    const q = ''
    + 'INSERT INTO '
    + 'ingredient_action_requests '
    + '(id, action, created_at, created_by, ingredient_id) '
    + 'VALUES (?, ?, ?, ?, ?)';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error creating update request';
    else return {
        actionId: actionId,
        action: "UPDATE",
        createdAt: createdAt,
        userId: userId,
        ingredientId: ingredientId
    };
}