export default async function (userId: string, count: number, reason?: string) {
    await global.db.run(
        "INSERT INTO warned(user_id, count, reason) VALUES(?, ?, ?)",
        userId,
        count,
        reason
    );
}
