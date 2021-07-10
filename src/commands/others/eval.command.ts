import { MessageAttachment } from "discord.js";
import commandType from "../type";
import { ownerID } from "../../../config.json";

const command: commandType = {
    name: "eval",
    description: "주인만 사용할 수 있는 이발 커맨드",
    usage: "<eval code>",
    execute(msg, args) {
        const clean = (text: any) => {
            if (typeof text === "string")
                return text
                    .replace(/`/g, "`" + String.fromCharCode(8203))
                    .replace(/@/g, "@" + String.fromCharCode(8203));
            else return text;
        };

        if (msg.author.id !== ownerID) return msg.reply("쓰지 마세요!");

        try {
            const code = args.join(", ");
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            msg.channel.send(clean(evaled), { code: "xl" }).catch(() => {
                const attachment = new MessageAttachment(
                    Buffer.from(clean(evaled)),
                    "result.txt"
                );

                msg.channel.send("파일 참고", attachment);
            });
        } catch (err) {
            msg.channel.send(`\`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    },
};

export default command;
