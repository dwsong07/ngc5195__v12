import commandType from "../type";

const command: commandType = {
    name: "removeroleselector",
    description: "roleSelector를 삭제합니다.",
    usage: "<메세지id> <이모지id>",
    args: true,
    guildOnly: true,
    permission: "MANAGE_ROLES",
    async execute(msg, args) {
        try {
            const db = msg.client.db;
            const msgId = args[0];
            const emojiId = args[1];

            await db.run(
                "DELETE FROM role_selector WHERE msg_id = ? AND emoji_id = ?",
                msgId,
                emojiId
            );
            msg.channel.send("삭제했습니다.");
        } catch (err) {
            console.error(err);
            msg.reply("에러 났어요!");
        }
    },
};

export default command;
