import { Collection } from "discord.js";
import { Database } from "sqlite";
import sqlite3 from "sqlite3";
import commandType from "./commands/type";

declare module "discord.js" {
    export interface Client {
        commands: Collection<unknown, commandType>;
        db: Database<sqlite3.Database, sqlite3.Statement>;
    }
}
