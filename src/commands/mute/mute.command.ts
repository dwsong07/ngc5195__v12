import ms from "ms";
import fetchUser from "../../utils/fetchUser";
import commandType from "../type";

const command: commandType = {
    name: "mute",
    description: "유저를 뮤트합니다.",
    guildOnly: true,
    usage: "<뮤트할 유저 아이디>, <시간>",
    args: true,
    permission: "MANAGE_ROLES",
    async execute(msg, args) {
        try {
            const userId = args[0];
            const serverId = msg.guild?.id ?? "";

            const user = await fetchUser(msg, userId);
            if (!user) return;

            if (msg.author.id === userId) {
                return msg.reply("자기 자신을 뮤트할 수 없습니다.");
            }

            const time = args[1];
            if (!time) return msg.reply("시간을 입력해주세요.");

            // check if user id already muted
            const ids = await msg.client.db.all(
                "SELECT user_id FROM muted WHERE user_id = ? AND server_id = ?",
                userId,
                serverId
            );

            if (ids.length) {
                return msg.reply("이미 뮤트되어 있습니다.");
            }

            const expireTime = new Date();
            expireTime.setMilliseconds(expireTime.getMilliseconds() + ms(time));
            const expireUnixTime = Math.floor(expireTime.getTime() / 1000);

            await msg.client.db.run(
                "INSERT INTO muted(user_id, expire_time, server_id, timestamp) VALUES(?, ?, ?, strftime('%s','now'))",
                userId,
                expireUnixTime,
                serverId
            );

            const mutedRole = msg.guild?.roles.cache.find(
                (role) => role.name === "Muted"
            );
            if (!mutedRole) return msg.reply("Muted 역할이 없어요!");
            user.roles.add(mutedRole?.id ?? "");

            const displayTime = expireTime.toLocaleString("ko-KR", {
                timeZone: "Asia/Seoul",
            });

            msg.channel.send(
                `<@${userId}>님을 뮤트했습니다. (${displayTime}까지)`
            );
        } catch (err) {
            console.error(err);
            msg.reply("에러 났어요!");
        }
    },
};

export default command;
