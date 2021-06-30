import { Message } from "discord.js";
import commandType from "../type";

const command: commandType = {
    name: "addroleselector",
    description: "roleSelector를 추가합니다.",
    usage: "<메세지>, <규칙>",
    args: true,
    guildOnly: true,
    permission: "MANAGE_ROLES",
    async execute(msg, args) {
        const targetMsgId = args[0];
        const rules = args[1];

        let targetMsg: Message;

        try {
            targetMsg = await msg.channel.messages.fetch(targetMsgId);
        } catch {
            return await msg.reply("잘못된 메세지 아이디를 입력하신 것 같아요");
        }
        /*
        rule must be like this:
        <emoji id>=<role id> <emoji id>=<role id> (..)
        */
        if (!rules || rules === "") return msg.reply("규칙을 적어주세요");
        try {
            for (const rule of rules.split(" ")) {
                const split = rule.split("=");
                if (split.length > 2)
                    return await msg.reply("규칙을 잘못 적으신 것 같음..");

                const [emojiId, roleId] = split;

                if (!emojiId || !roleId)
                    return await msg.reply("규칙을 잘못 적으신 것 같음..");

                const roleSelectorTable = await msg.client.db.all(
                    "SELECT id FROM role_selector WHERE msg_id = ? AND emoji_id = ?",
                    targetMsgId,
                    emojiId
                );

                if (roleSelectorTable.length) {
                    return await msg.reply(
                        "중복된 메세지와 이모지id를 입력하셨어요."
                    );
                }

                await targetMsg.react(emojiId);

                await msg.client.db.run(
                    "INSERT INTO role_selector(msg_id, emoji_id, role_id) VALUES(?, ?, ?)",
                    targetMsgId,
                    emojiId,
                    roleId
                );
            }

            msg.channel.send("추가했습니다.");
        } catch (err) {
            if (err.code === 10014) {
                return await msg.reply(
                    "잘못된 이모지 id를 입력하신 것 같아요."
                );
            } else {
                console.log(err);
                return msg.reply("에러 났어요!");
            }
        }
    },
};

export default command;
