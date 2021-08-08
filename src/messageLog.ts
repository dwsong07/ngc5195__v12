import { Client, Message, MessageEmbed, TextChannel, User } from "discord.js";
import { logChannelIds } from "../config.json";

export default async function (client: Client) {
    function messageEventEmbed(author: User | null) {
        const embed = new MessageEmbed()
            .setAuthor(author?.tag, author?.avatarURL() || "")
            .setTimestamp(new Date());

        return embed;
    }

    function getLogChannel(guildId: string) {
        type channelIds = { [key: string]: string };

        const logChannel = client.channels.cache.get(
            (logChannelIds as channelIds)[guildId]
        ) as TextChannel;
        return logChannel;
    }

    const checkInGuild = (msg: Message) =>
        logChannelIds.hasOwnProperty(msg.guild?.id as string) &&
        !Object.values(logChannelIds).includes(msg.channel.id);

    client.on("message", (msg) => {
        if (msg.channel.type === "dm") return;
        if (!checkInGuild(msg)) return; // guess blocked in here

        const embed = messageEventEmbed(msg.author).setDescription(
            `<@${msg.author.id}> said \`${msg.content}\` in <#${msg.channel.id}>`
        );

        getLogChannel(msg.guild?.id as string).send(embed);
    });

    client.on("messageDelete", (msg) => {
        if (msg.channel.type === "dm") return;
        if (!checkInGuild(msg as Message)) return;

        const embed = messageEventEmbed(msg.author).setDescription(
            `Someone deleted \`${msg.content}\` sent by <@${msg.author?.id}> in <#${msg.channel.id}>`
        );

        getLogChannel(msg.guild?.id as string).send(embed);
    });

    client.on("messageUpdate", (oldMsg, newMsg) => {
        if (oldMsg.channel.type === "dm") return;
        if (!checkInGuild(oldMsg as Message)) return;

        const embed = messageEventEmbed(oldMsg.author).setDescription(
            `Someone edited \`${oldMsg.content}\` to \`${newMsg.content}\` sent by <@${oldMsg.author?.id}> in <#${oldMsg.channel.id}>`
        );

        getLogChannel(oldMsg.guild?.id as string).send(embed);
    });

    client.on("messageReactionAdd", async (reaction, user) => {
        if (reaction.message.channel.type === "dm") return;
        if (!checkInGuild(reaction.message)) return;

        try {
            if (user.partial) await user.fetch();
            const { content, author } = reaction.message;

            const embed = messageEventEmbed(user as User).setDescription(
                `<@${
                    user.id
                }> reacted ${reaction.emoji.toString()} to \`${content}\` sent by <@${
                    author.id
                }>`
            );

            getLogChannel(reaction.message.guild?.id as string).send(embed);
        } catch (err) {
            console.error(err);
        }
    });

    client.on("messageReactionRemove", async (reaction, user) => {
        if (reaction.message.channel.type === "dm") return;
        if (!checkInGuild(reaction.message)) return;

        try {
            if (user.partial) await user.fetch();
            const { content, author } = reaction.message;

            const embed = messageEventEmbed(user as User).setDescription(
                `<@${
                    user.id
                }> unreacted ${reaction.emoji.toString()} to \`${content}\` sent by <@${
                    author.id
                }>`
            );

            getLogChannel(reaction.message.guild?.id as string).send(embed);
        } catch (err) {
            console.error(err);
        }
    });
}
