import Discord, { NewsChannel, TextChannel } from "discord.js";
import commands from "./commands";
import { dbInit } from "./db";
import muteInterval from "./muteInterval";
import roleSelect from "./roleSelect";

import {
    prefix,
    bot_token,
    userRoleId,
    welcomeChannelId,
} from "../config.json";

const client = new Discord.Client({
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

client.once("ready", async () => {
    client.db = await dbInit();
    client.commands = commands;
    console.log("Bot Ready");

    muteInterval(client);
});

client.on("message", async (msg) => {
    try {
        if (msg.partial) await msg.fetch();

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

        if (command?.permission) {
            const channel = msg.channel as TextChannel | NewsChannel;
            const authorPerms = channel.permissionsFor(msg.author);
            if (!authorPerms || !authorPerms.has(command.permission)) {
                return msg.reply("권한이 없습니다.");
            }

            if (!msg.guild?.me?.hasPermission(command.permission)) {
                return msg.reply("봇에 권한을 추가해 주세요.");
            }
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

client.on("guildMemberAdd", async (member) => {
    if (member.user.bot) return;

    member.roles.set([userRoleId]);

    const welcomeChannel = client.channels.cache.get(
        welcomeChannelId
    ) as TextChannel;
    welcomeChannel.send(`<@${member.id}>님, 환영합니다!`);
});

client.on("messageReactionAdd", (reaction, user) => {
    roleSelect(reaction, user, true);
});

client.on("messageReactionRemove", (reaction, user) => {
    roleSelect(reaction, user, false);
});

// close db when exit
process.on("exit", () => client.db.close());

client.login(bot_token);
