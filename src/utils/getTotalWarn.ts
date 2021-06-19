export default async function (userId: string): Promise<number> {
    const result = await global.db.all(
        "SELECT sum(count) FROM warned WHERE user_id = ?",
        userId
    );

    return result[0]["sum(count)"];
}
