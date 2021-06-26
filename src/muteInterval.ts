import { Client } from "discord.js";
import unmute from "./utils/unmute";

export default function (client: Client) {
    setInterval(async () => {
        try {
            const muted = await client.db.all(
                "SELECT user_id, expire_time FROM muted"
            );

            muted.forEach(async (item) => {
                // compare with unix time
                if (
                    Math.floor(new Date().getTime() / 1000) >= item.expire_time
                ) {
                    // assume the bot is only in one server
                    const user = await client.guilds?.cache
                        .array()[0]
                        .members.fetch(item.user_id);

                    await unmute(client.db, user);
                }
            });
        } catch (err) {
            console.error(err);
        }
    }, 10 * 1000); // 10 sec
}
