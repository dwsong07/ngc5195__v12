import { Client, GuildChannel } from "discord.js";

export default async function (client: Client) {
    client.on("channelCreate", (channel) => {
        if (channel.type === "dm") return;

        const mutedRole = (channel as GuildChannel).guild.roles.cache.find(
            (_) => _.name === "Muted"
        );
        if (!mutedRole) return;

        (channel as GuildChannel).overwritePermissions([
            {
                id: mutedRole?.id,
                deny: ["SEND_MESSAGES", "ADD_REACTIONS", "CONNECT"],
            },
        ]);
    });
}
