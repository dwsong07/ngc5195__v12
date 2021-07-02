import { NewsChannel, TextChannel } from "discord.js";
import commandType from "../type";

const command: commandType = {
    name: "rm",
    description: "챗을 대량 학살합니다.",
    args: true,
    usage: "<삭제할 챗 수>",
    guildOnly: true,
    permission: "MANAGE_MESSAGES",
    async execute(msg, args) {
        try {
            const num = Number(args[0]);
            if (!Number.isInteger(num) || num <= 0) {
                return msg.reply("자연수로 입력해주세요!");
            }

            const { size } = await (
                msg.channel as TextChannel | NewsChannel
            ).bulkDelete(num);

            msg.channel.send(`${size}개의 메세지를 삭제했습니다.`);
        } catch (err) {
            console.error(err);
            msg.reply("에러 났어요!");
        }
    },
};

export default command;
