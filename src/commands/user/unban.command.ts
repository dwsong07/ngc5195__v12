import commandType from "../type";
import permission from "../../utils/permission";

const command: commandType = {
    name: "unban",
    description: "유저를 밴 해제합니다.",
    args: true,
    usage: "<밴 해제할 아이디>",
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

            const banlist = await msg.guild?.fetchBans();
            const banlistId = banlist?.map((item) => item.user.id);

            if (!banlistId?.includes(userId)) {
                return msg.reply("밴 당하지 않았는데요...");
            }

            const unBanReason = args.slice(1).join(", ");

            await msg.guild?.members.unban(userId, unBanReason);

            await msg.channel.send(
                `<@${userId}>님을 밴 해제했습니다. 사유: ${unBanReason}`
            );
        } catch (err) {
            console.error(err);
            msg.reply("에러 났어요!");
        }
    },
};

export default command;
