import commandType from "../type";
import permission from "../../utils/permission";
import fetchUser from "../../utils/fetchUser";

const command: commandType = {
    name: "kick",
    description: "유저를 킥합니다.",
    args: true,
    usage: "<킥할 유저 아이디>, <사유>",
    guildOnly: true,
    async execute(msg, args) {
        try {
            const userId = args[0];
            if (
                !(await permission(
                    msg,
                    userId,
                    "KICK_MEMBERS",
                    "봇에 킥 권한을 추가해 주세요."
                ))
            ) {
                return;
            }

            const user = await fetchUser(msg, userId);
            if (!user) return;

            const commandUserId = msg.author.id;
            if (commandUserId === userId) {
                return msg.reply("자기 자신을 킥할 수 없습니다.");
            }

            const reason = args.slice(1).join(", ");

            await user?.kick(reason);

            await msg.channel.send(
                `<@${user?.id}>님을 킥했습니다. 사유: ${reason}`
            );
        } catch (err) {
            console.error(err);
            msg.reply("에러 났어요!");
        }
    },
};

export default command;
