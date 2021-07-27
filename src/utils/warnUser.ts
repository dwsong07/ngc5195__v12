import { Database } from "sqlite";

export default async function (
    db: Database,
    userId: string,
    count: number,
    server_id: string,
    reason?: string
) {
    await db.run(
        "INSERT INTO warned(user_id, count, reason, server_id, timestamp) VALUES(?, ?, ?, ?, datetime('now'))",
        userId,
        count,
        reason,
        server_id
    );
}
