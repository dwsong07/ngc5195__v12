import { Database } from "sqlite";

export default async function (
    db: Database,
    userId: string,
    server_id: string
): Promise<number> {
    const result = await db.all(
        "SELECT sum(count) FROM warned WHERE user_id = ? AND server_id = ?",
        userId,
        server_id
    );

    return result[0]["sum(count)"];
}
