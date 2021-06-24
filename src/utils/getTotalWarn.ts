import { Database } from "sqlite";

export default async function (db: Database, userId: string): Promise<number> {
    const result = await db.all(
        "SELECT sum(count) FROM warned WHERE user_id = ?",
        userId
    );

    return result[0]["sum(count)"];
}
