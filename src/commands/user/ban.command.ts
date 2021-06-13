import { UserResolvable } from "discord.js";
import commandType from "../type";
import permission from "../../utils/permission";
import fetchUser from "../../utils/fetchUser";

const command: commandType = {
    name: "ban",
    description: "유저를 밴합니다.",
    args: true,
    usage: "<밴할 유저 id>, <밴 사유>",
    guildOnly: true,
    async execute(msg, args) {
        try {
            const userId = args[0];
            if (
                !(await permission(
                    msg,
                    userId,
                    "BAN_MEMBERS",
                    "봇에 밴 권한을 추가해 주세요."
                ))
            ) {
                return;
            }

            const user = await fetchUser(msg, userId);
            if (!user) return;

            const commandUserId = msg.author.id;
            if (commandUserId === userId) {
                return msg.reply("자기 자신을 밴할 수 없습니다.");
            }

            const reason = args.slice(1).join(", ");

            await msg.guild?.members.ban(user as UserResolvable, {
                reason: reason,
            });

            await msg.channel.send(
                `<@${user?.id}>님을 밴했습니다. 사유: ${reason}`
            );
        } catch (err) {
            console.error(err);
            msg.reply("에러 났어요!");
        }
    },
};

export default command;
