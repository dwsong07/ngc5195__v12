import { MessageEmbed } from "discord.js";
import fetchUser from "../../utils/fetchUser";
import commandType from "../type";

function makeEmbedFields(warned: any[]) {
    return warned.map((item) => ({
        name:
            new Date(item.timestamp + " GMT").toLocaleString("ko-KR", {
                timeZone: "Asia/Seoul",
            }) + " (KST)",
        value: `${
            item.count > 0 ? "**경고** 수: " : "**경고 해제** 수: "
        } ${Math.abs(item.count)}\n사유: ${item.reason || "(없음)"}`,
    }));
}

const command: commandType = {
    name: "warn_history",
    description: "유저의 경고 히스토리를 봅니다.",
    usage: "<유저 아이디(선택)>",
    guildOnly: true,
    async execute(msg, args) {
        try {
            const userId = args[0] || msg.author.id;
            const serverId = msg.guild?.id;

            const guildMem = await fetchUser(msg, userId);
            if (!guildMem) return;

            const user = guildMem.user || msg.author;

            const db = msg.client.db;

            const warned = await db.all(
                "SELECT count, timestamp, reason FROM warned WHERE user_id = ? AND server_id = ?",
                userId,
                serverId
            );

            const totalWarn = warned.reduce(
                (prev, curr) => prev + curr.count,
                0
            );

            const embed = new MessageEmbed()
                .setDescription(`**총 경고 수: ${totalWarn}**`)
                .setTitle(`${user.tag}님의 경고 히스토리`)
                .addFields(makeEmbedFields(warned));

            msg.channel.send(embed);
        } catch (err) {
            console.error(err);
            msg.reply("에러 났어요!");
        }
    },
};

export default command;
