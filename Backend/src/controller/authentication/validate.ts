import { getUserIdFromToken } from "../../database/authentication/user_token.js";

export async function isTokenValid(token: string) {
    const result = await getUserIdFromToken(token);

    if(typeof result === "string" && result === "Error checking token exists") return result;
    else if(typeof result === "string") return false;
    else return true;
}