import commandType from "../type";

const command: commandType = {
    name: "test",
    description: "테스트 용임.",
    args: true,
    usage: "<args> ...",
    guildOnly: true,
    execute(msg, args) {
        msg.channel.send(`테스트! ${args.join(",")}`);
    },
};

export default command;
