import ms from "ms";
import fetchUser from "../../utils/fetchUser";
import commandType from "../type";
import { mutedRoleId } from "../../../config.json";

const command: commandType = {
    name: "mute",
    description: "유저를 뮤트합니다.",
    guildOnly: true,
    usage: "<뮤트할 유저 이름>, <시간>, <사유>",
    args: true,
    async execute(msg, args) {
        try {
            const userId = args[0];
            const user = await fetchUser(msg, userId);

            if (!user) return;

            const time = args[1];
            if (!time) return msg.reply("시간을 입력해주세요.");

            const expireTime = new Date();
            expireTime.setMilliseconds(expireTime.getMilliseconds() + ms(time));

            const reason = args[2];
            const removeRoles = user.roles.cache.map((_) => _.id).join(" ");

            const db = msg.client.db;
            await db.run(
                "INSERT INTO muted(user_id, expire_time, reason, removed_roles, timestamp) VALUES(?, ?, ?, ?, datetime('now'))",
                userId,
                expireTime.toISOString(),
                reason,
                removeRoles
            );

            user.roles.set([mutedRoleId]);

            msg.channel.send(`<@${userId}>님을 뮤트했습니다. (${time}까지)`);
        } catch (err) {
            console.error(err);
            msg.reply("에러 났어요!");
        }
    },
};

export default command;
