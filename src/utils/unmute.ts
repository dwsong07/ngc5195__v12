import { GuildMember } from "discord.js";
import { Database } from "sqlite";
import sqlite3 from "sqlite3";

export default async function (
    db: Database<sqlite3.Database, sqlite3.Statement>,
    user: GuildMember,
    serverId: string
) {
    try {
        const mutedUser = await db.all(
            "SELECT user_id FROM muted WHERE user_id = ? AND server_id = ?",
            user.id,
            serverId
        );
        if (!mutedUser.length) return false;

        const mutedRole = user.guild.roles.cache.find(
            (role) => role.name === "Muted"
        );
        if (!mutedRole) return false;

        await user.roles.remove(mutedRole.id);

        await db.run(
            "DELETE FROM muted WHERE user_id = ? AND server_id = ?",
            user.id,
            serverId
        );
        return true;
    } catch (err) {
        throw new Error(err);
    }
}
