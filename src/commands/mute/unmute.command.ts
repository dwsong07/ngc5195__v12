import fetchUser from "../../utils/fetchUser";
import commandType from "../type";
import { userRoleId } from "../../../config.json";

const command: commandType = {
    name: "unmute",
    description: "유저를 뮤트 해제합니다.",
    guildOnly: true,
    usage: "<뮤트할 유저 아이디>",
    args: true,
    permission: "MANAGE_ROLES",
    async execute(msg, args) {
        try {
            const userId = args[0];
            const user = await fetchUser(msg, userId);
            if (!user) return;

            const removedRoles = await msg.client.db.all(
                "SELECT user_id, removed_roles FROM muted WHERE user_id = ?",
                userId
            );

            if (!removedRoles) {
                return msg.reply("뮤트되어 있지 않습니다.");
            }

            user.roles.set(removedRoles[0].removed_roles.split(" "));

            await msg.client.db.run(
                "DELETE FROM muted WHERE user_id = ?",
                userId
            );

            msg.channel.send(`<@${userId}>님을 뮤트 해제했습니다.`);
        } catch (err) {
            console.error(err);
            msg.reply("에러 났어요!");
        }
    },
};

export default command;
