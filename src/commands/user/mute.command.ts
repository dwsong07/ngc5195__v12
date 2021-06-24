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

            user.roles.set([mutedRoleId]);

            msg.channel.send(`<@${userId}>님을 뮤트했습니다.`);
        } catch (err) {
            console.error(err);
            msg.reply("에러 났어요!");
        }
    },
};

export default command;
