import commandType from "../type";

const command: commandType = {
    name: "ping",
    description: "핑!",
    async execute(msg, args) {
        const sent = await msg.channel.send("Pinging..");
        sent.edit(
            `Pong! 지연시간: ${sent.createdTimestamp - msg.createdTimestamp}ms`
        );
    },
};

export default command;
