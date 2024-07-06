import * as uuid from "uuid";

import { IngredientProperties } from "../../utils/types.js";
import createRequest from "../../database/ingredients/actionRequests/createRequest.js";
import editRequest from "../../database/ingredients/actionRequests/editRequest.js";
import deleteRequest from "../../database/ingredients/actionRequests/deleteRequest.js";


export async function doActionRequest(userId: string, rq: {type: "UPDATE" | "DELETE", id: string} | {type: "CREATE", ingredient: {name: string, props: IngredientProperties}}) {
    if(typeof rq !== "object" || !rq) return "Invalid request";
    if(!rq.type) return "Invalid request type";
    if(typeof userId !== "string" || !uuid.validate(userId)) return "Invalid user id";
    
    if(rq.type === "CREATE") {
        if(typeof rq.ingredient !== "object" || !rq.ingredient) return "Invalid ingredient";
        if(typeof rq.ingredient.name !== "string") return "Invalid ingredient name";
        if(typeof rq.ingredient.props !== "object" || !rq.ingredient.props) return "Invalid ingredient properties";

        if(typeof rq.ingredient.props.vegan         !== "boolean") return "Invalid vegan property";
        if(typeof rq.ingredient.props.vegetarian    !== "boolean") return "Invalid vegetarian property";
        if(typeof rq.ingredient.props.glutenFree    !== "boolean") return "Invalid glutenFree property";
        if(typeof rq.ingredient.props.dairyFree     !== "boolean") return "Invalid dairyFree property";
        if(typeof rq.ingredient.props.nutFree       !== "boolean") return "Invalid nutFree property";
        if(typeof rq.ingredient.props.eggFree       !== "boolean") return "Invalid eggFree property";
        if(typeof rq.ingredient.props.fishFree      !== "boolean") return "Invalid fishFree property";
        if(typeof rq.ingredient.props.shellfishFree !== "boolean") return "Invalid shellfishFree property";
        if(typeof rq.ingredient.props.soyFree       !== "boolean") return "Invalid soyFree property";

        return await createRequest(userId, rq.ingredient);
    } else if(rq.type === "UPDATE") {
        if(typeof rq.id !== "string" || !uuid.validate(rq.id)) return "Invalid request id";
        return await editRequest(userId, rq.id);
    } else if(rq.type === "DELETE"){
        if(typeof rq.id !== "string" || !uuid.validate(rq.id)) return "Invalid request id";
        return await deleteRequest(userId, rq.id);
    } else {
        return "Invalid request type";
    }
}