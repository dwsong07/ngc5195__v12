import { Message } from "discord.js";

export default async function (msg: Message, userId: string) {
    try {
        return await msg.guild?.members.fetch(userId);
    } catch (err) {
        await msg.reply("그런 사람 없는데요...");
        return false;
    }
}
