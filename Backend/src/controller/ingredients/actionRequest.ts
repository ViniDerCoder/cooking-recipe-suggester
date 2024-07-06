import * as uuid from "uuid";

import { IngredientProperties, isIngredientActionRequest } from "../../utils/types/ingredient.js";
import createRequest from "../../database/ingredients/actionRequests/createRequest.js";
import editRequest from "../../database/ingredients/actionRequests/editRequest.js";
import deleteRequest from "../../database/ingredients/actionRequests/deleteRequest.js";
import { getIngredientById } from "../../database/ingredients/get.js";
import onCleanup from "../../utils/listener/cleanup.js";
import { isUuid } from "../../utils/types/other.js";

onCleanup('clearIngredientCache', 'DATABASE', async () => {
    //db cleanup all requests older than 30 days
    return true;
});

export async function doActionRequest(userId: unknown, rq: unknown) {
    if(!isUuid(userId) || !isIngredientActionRequest(rq)) return "Invalid request";
    if(!rq.type) return "Invalid request type";
    if(typeof userId !== "string" || !uuid.validate(userId)) return "Invalid user id";
    
    if(rq.type === "CREATE") {
        return await createRequest(userId, rq.ingredient);
    } else if(rq.type === "UPDATE") {
        if(typeof await getIngredientById(rq.id) === "string") return "Ingredient not found";

        return await editRequest(userId, rq.id, rq.ingredient);
    } else if(rq.type === "DELETE") {
        if(typeof await getIngredientById(rq.id) === "string") return "Ingredient not found";

        return await deleteRequest(userId, rq.id);
    } else {
        return "Invalid request type";
    }
}