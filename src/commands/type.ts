import Discord from "discord.js";
import { Database } from "sqlite";

export default interface command {
    name: string;
    description?: string;
    args?: boolean; // is args required
    usage?: string;
    guildOnly?: boolean;
    execute: (message: Discord.Message, arg: string[]) => void;
}
