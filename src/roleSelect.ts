import { MessageReaction, PartialUser, User } from "discord.js";

export default async function (
    reaction: MessageReaction,
    user: User | PartialUser,
    add: boolean
) {
    try {
        if (reaction.partial) await reaction.fetch();

        const db = reaction.message.client.db;
        const roleSelector = await db.all("SELECT * FROM role_selector");

        const roleFiltered = roleSelector.filter(
            (_) =>
                _.msg_id === reaction.message.id &&
                _.emoji_id == reaction.emoji.toString()
        );
        if (!roleFiltered.length) return;

        const guildMember = reaction.message.guild?.members.cache.find(
            (member) => member.id === user.id
        );

        // assume roleFilterd.length === 1 becuase emoji_id is unique
        const roleId = roleFiltered[0].role_id;

        if (add) {
            await guildMember?.roles.add(roleId);
        } else {
            if (roleFiltered[0].is_one_time === 1) return;

            await guildMember?.roles.remove(roleId);
        }
    } catch (err) {
        return console.error(err);
    }
}
