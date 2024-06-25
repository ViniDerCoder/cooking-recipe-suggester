import client from "../db.js";

export default async function query(query: string, params: any[]) {
    try {
        const result = await client.execute(query, params, { prepare: true });
        return result
    } catch (err) {
        console.log("Error executing " + query + "\n" + err);
        return 'Error on database query'
    }
}