import { GuildMember } from "discord.js";
import { Database } from "sqlite";
import sqlite3 from "sqlite3";

export default async function (
    db: Database<sqlite3.Database, sqlite3.Statement>,
    user: GuildMember
) {
    try {
        const removedRoles = await db.all(
            "SELECT user_id, removed_roles FROM muted WHERE user_id = ?",
            user.id
        );

        if (!removedRoles.length) return false;

        user.roles.set(removedRoles[0].removed_roles.split(" "));

        await db.run("DELETE FROM muted WHERE user_id = ?", user.id);
        return true;
    } catch (err) {
        throw new Error(err);
    }
}
