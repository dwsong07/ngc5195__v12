require("dotenv").config({ path: "./.env" });

import Discord from "discord.js";
import commands from "./commands";
import { dbInit } from "./db";

import { prefix } from "./config.json";

const client = new Discord.Client();

client.once("ready", async () => {
    console.log("Bot Ready");
    await dbInit();
});

client.on("message", (msg) => {
    try {
        if (!msg.content.startsWith(prefix) || msg.author.bot) return;

        const content = msg.content.slice(prefix.length).trim();

        const commandName = content.split(/ +/)[0].toLowerCase(); // split with ,(comma)
        const args = content.slice(commandName.length).trim().split(/ *, */);

        if (!commands.has(commandName)) return;

        const command = commands.get(commandName);

        // if the command is guild only
        if (command?.guildOnly && msg.channel.type === "dm") {
            return msg.reply("DM에서는 실행할 수 없습니다!");
        }

        // if there's no args but args is required.
        if (command?.args && args[0] === "") {
            return msg.channel.send(
                `파라미터가 필요합니다! 사용법: ${command?.usage ?? ""}`
            );
        }

        commands.get(commandName)?.execute(msg, args);
    } catch (err) {
        console.error(err);
        msg.channel.send("에러 났어요!");
    }
});

// close db when exit
process.on("exit", () => global.db.close());

client.login(process.env.BOT_TOKEN);