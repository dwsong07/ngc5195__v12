import commandType from "../type";
import permission from "../../utils/permission";
import fetchUser from "../../utils/fetchUser";
import getTotalWarn from "../../utils/getTotalWarn";
import warnUser from "../../utils/warnUser";

const command: commandType = {
    name: "unwarn",
    description: "경고를 해제합니다.",
    guildOnly: true,
    args: true,
    usage: "<경고 해제할 유저 아이디>, <해제할 경고 수>",
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

            let count = Number(args[1]);
            if (!Number.isInteger(count) || count <= 0)
                return msg.reply("해제할 경고 수는 자연수이여야 합니다.");

            const beforeTotal = await getTotalWarn(userId); // total warn **before** unwarn

            // if count > beforeTotal, the afterTotal will be negative
            // to prevent negative total
            //  make count the beforeTotal if count > beforeTotal
            count = Math.min(count, beforeTotal);

            await warnUser(userId, -count);
            const afterTotal = beforeTotal - count;

            msg.channel.send(
                `<@${userId}>님을 경고 해제했습니다. 총 경고 수: ${afterTotal}`
            );
        } catch (err) {
            console.error(err);
            msg.reply("에러 났어요!");
        }
    },
};

export default command;
