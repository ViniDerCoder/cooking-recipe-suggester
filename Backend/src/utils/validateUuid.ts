export default function validateUuid(uuid: string): boolean {
    const uuidRegex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$');
    return uuidRegex.test(uuid);
}