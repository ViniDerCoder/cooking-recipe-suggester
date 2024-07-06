import { isUuid, Uuid } from "./other.js";


export type User = {
    id: Uuid,
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    createdAt: Date
}

export function isUser(any: any): any is User {
    if(typeof any !== "object" || !any) return false;

    if(!isUuid(any.id)) return false;
    if(typeof any.firstName !== "string") return false;
    if(typeof any.lastName !== "string") return false;
    if(typeof any.username !== "string") return false;
    if(typeof any.email !== "string") return false;
    if(!(any.createdAt instanceof Date)) return false;

    return true;
}

export type AuthenticationUser = {
    userId: Uuid,
    expiresAt: Date
}

export function isAuthenticationUser(any: any): any is AuthenticationUser {
    if(typeof any !== "object" || !any) return false;

    if(!isUuid(any.userId)) return false;
    if(!(any.expiresAt instanceof Date)) return false;

    return true;
}