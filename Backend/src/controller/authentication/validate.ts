import { getUserFromToken } from "../../database/authentication/user_token.js";

export async function isTokenValid(token: string) {
    const result = await getUserFromToken(token);
    
    if(typeof result === "string") return false;
    else if(result.length === 0) return false;
    else return true;
}