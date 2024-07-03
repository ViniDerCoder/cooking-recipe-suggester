export type User = {
    id: string,
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    createdAt: Date
}

export type AuthenticationUser = {
    userId: string,
    expiresAt: Date
}