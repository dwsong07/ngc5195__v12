import { MessageEmbed } from "discord.js";
import commandType from "../type";

const command: commandType = {
    name: "listroleselector",
    description: "roleSelector 리스트를 봅니다.",
    guildOnly: true,
    async execute(msg, args) {
        try {
            const table = await msg.client.db.all(
                "SELECT * FROM role_selector"
            );

            const embed = new MessageEmbed()
                .setTitle("roleSelector 리스트")
                .addFields(
                    table.map(({ msg_id, emoji_id, role_id }) => ({
                        name: `${msg_id}, ${emoji_id}`,
                        value: `<@&${role_id}>`,
                    }))
                );

            msg.channel.send(embed);
        } catch (err) {
            console.error(err);
            msg.reply("에러 났어요!");
        }
    },
};

export default command;
