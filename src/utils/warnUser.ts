import { Database } from "sqlite";

export default async function (
    db: Database,
    userId: string,
    count: number,
    reason?: string
) {
    await db.run(
        "INSERT INTO warned(user_id, count, reason, timestamp) VALUES(?, ?, ?, datetime('now'))",
        userId,
        count,
        reason
    );
}
