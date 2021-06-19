import commandType from "../type";
import permission from "../../utils/permission";
import fetchUser from "../../utils/fetchUser";
import getTotalWarn from "../../utils/getTotalWarn";
import warnUser from "../../utils/warnUser";

const command: commandType = {
    name: "warn",
    description: "유저에게 경고를 줍니다.",
    guildOnly: true,
    args: true,
    usage: "<경고를 줄 유저 아이디>, <경고수>, <사유>",
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
                return msg.reply("자기 자신을 경고할 수 없습니다.");
            }

            const count = Number(args[1]);
            if (!Number.isInteger(count) || count <= 0)
                return msg.reply("경고 수는 자연수여야 합니다.");

            const reason = args.slice(2).join(", ");

            await warnUser(userId, count);

            const total = await getTotalWarn(userId);

            if (total >= 10) {
                await msg.guild?.members.ban(user, {
                    reason: "경고 10개 이상",
                });
                return msg.channel.send(
                    `총 경고 수가 10개 이상이므로 <@${userId}>님을 밴했습니다.`
                );
            }

            msg.channel.send(
                `<@${userId}>님을 경고했습니다. 총 경고 수: ${total}`
            );
        } catch (err) {
            console.error(err);
            msg.reply("에러 났어요!");
        }
    },
};

export default command;
