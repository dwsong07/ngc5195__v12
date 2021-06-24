import commandType from "../type";
import fetchUser from "../../utils/fetchUser";
import getTotalWarn from "../../utils/getTotalWarn";
import warnUser from "../../utils/warnUser";

const command: commandType = {
    name: "unwarn",
    description: "경고를 해제합니다.",
    guildOnly: true,
    args: true,
    usage: "<경고 해제할 유저 아이디>, <해제할 경고 수>",
    permission: "BAN_MEMBERS",
    async execute(msg, args) {
        try {
            const userId = args[0];

            const user = await fetchUser(msg, userId);
            if (!user) return;

            let count = Number(args[1]);
            if (!Number.isInteger(count) || count <= 0)
                return msg.reply("해제할 경고 수는 자연수이여야 합니다.");

            const beforeTotal = await getTotalWarn(msg.client.db, userId); // total warn **before** unwarn

            // if count > beforeTotal, the afterTotal will be negative
            // to prevent negative total
            //  make count the beforeTotal if count > beforeTotal
            count = Math.min(count, beforeTotal);

            await warnUser(msg.client.db, userId, -count);
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
