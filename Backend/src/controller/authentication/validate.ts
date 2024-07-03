import { getUser } from "../../database/authentication/get_user.js";
import { getUserIdFromToken } from "../../database/authentication/user_token.js";

export async function isTokenValid(token: string) {
    const result = await getUserIdFromToken(token);

    if(typeof result === "string" && result === "Error checking token exists") return result;
    else if(typeof result === "string") return false;
    else return result;
}

export async function getUserInformation(userid: string) {
    const result = await getUser(userid);

    if(typeof result === "string") return "Failed to get user information";
    else return result
}