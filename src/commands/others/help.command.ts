import commandType from "../type";
import { prefix } from "../../../config.json";

const command: commandType = {
    name: "help",
    description: "도움말",
    usage: "",
    execute(msg, args) {
        const data = [];
        const { commands } = msg.client;

        data.push("```");
        data.push("도움말");

        commands.forEach((command) => {
            data.push(`${prefix} ${command.name}`);
            data.push(`\t${command.description}`);
            data.push(`\t사용법: ${prefix} ${command.name} ${command.usage ?? ""}`);
        });

        data.push("```");

        msg.channel.send(data, { split: true });
    },
};

export default command;
