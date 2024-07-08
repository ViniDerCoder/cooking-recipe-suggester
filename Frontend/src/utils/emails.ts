export function isEmail(str: string): boolean {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(str)
}