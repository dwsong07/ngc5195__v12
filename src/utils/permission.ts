import { Message, PermissionResolvable } from "discord.js";

// if user has no permission, it replies that the requester has no permission
// if bot has no permission, it replise that the bot has no permission
// the bot message is a message that'll be replied when the bot has no permission
export default async function permission(
    msg: Message,
    userId: string,
    permission: PermissionResolvable,
    botMessage: string
) {
    try {
        if (!msg.guild?.me?.hasPermission(permission)) {
            await msg.reply(botMessage);
            return false;
        }

        if (!msg.member?.hasPermission(permission)) {
            await msg.reply("권한이 없습니다.");
            return false;
        }
    } catch (err) {
        console.error(err);
    }
    return true;
}
