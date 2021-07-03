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
            /*
            rule must be like this:
            <emoji id>=<role id> <emoji id>=<role id> (..)
            */
            if (!rules || rules === "") return msg.reply("규칙을 적어주세요");
            for (const rule of rules.split(" ")) {
                const split = rule.split("=");
                if (split.length > 2)
                    return msg.reply("규칙을 잘못 적으신 것 같음..");

                const [emojiId, roleId] = split;

                if (!emojiId || !roleId)
                    return msg.reply("규칙을 잘못 적으신 것 같음..");

                const roleSelectorTable = await msg.client.db.all(
                    "SELECT id FROM role_selector WHERE msg_id = ? AND emoji_id = ?",
                    targetMsgId,
                    emojiId
                );

                if (roleSelectorTable.length) {
                    return msg.reply(
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
            switch (err.code) {
                case 10014:
                    return await msg.reply(
                        "잘못된 이모지 id를 입력하신 것 같아요."
                    );
                case 10008:
                    return msg.reply(
                        "잘못된 메세지 아이디를 입력하신 것 같아요."
                    );
                default:
                    console.log(err);
                    msg.reply("에러 났어요!");
                    break;
            }
        }
    },
};

export default command;
