import { getUser } from "../../database/authentication/get_user.js";
import { getAuthUserFromToken } from "../../database/authentication/user_token.js";

export async function isTokenValid(token: string) {
    if(typeof token !== "string") return "Invalid Input";
    const result = await getAuthUserFromToken(token);

    if(typeof result === "string" && result === "Error checking token exists") return result;
    else if(typeof result === "string") return false;
    else return result;
}

export async function getUserInformation(userid: string) {
    if(typeof userid !== "string") return "Invalid Input";
    const result = await getUser(userid);

    if(typeof result === "string") return "Failed to get user information";
    else return result
}