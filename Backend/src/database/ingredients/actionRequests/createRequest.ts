import { v4 } from "uuid";

import query from "../../../utils/query.js";
import { IngredientProperties } from "../../../utils/types.js";

export default async function createRequest(userId: string, ingredient: {name: string, props: IngredientProperties}) {
    const actionId = v4();
    const createdAt = new Date();

    const data = JSON.stringify({
        name: ingredient.name,
        properties: {
            vegan: ingredient.props.vegan,
            vegetarian: ingredient.props.vegetarian,
            glutenFree: ingredient.props.glutenFree,
            dairyFree: ingredient.props.dairyFree,
            nutFree: ingredient.props.nutFree,
            eggFree: ingredient.props.eggFree,
            fishFree: ingredient.props.fishFree,
            shellfishFree: ingredient.props.shellfishFree,
            soyFree: ingredient.props.soyFree
        }
    });

    const params = [actionId, "CREATE", createdAt, userId, data];
    const q = ''
    + 'INSERT INTO '
    + 'cooking_recipe_suggester.ingredient_action_requests '
    + '(id, action, created_at, created_by, data) '
    + 'VALUES (?, ?, ?, ?, ?)';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error creating create request';
    else return {
        actionId: actionId,
        action: "CREATE",
        createdAt: createdAt,
        userId: userId,
        data: JSON.parse(data)
    };
}