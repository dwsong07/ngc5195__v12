import { Collection } from "discord.js";
import { statSync, readdirSync } from "fs";
import path from "path";

import commandType from "./type";

const commands = new Collection<string, commandType>();

// get all the files under directory recursively
const getFiles = (dirPath: string, arrayOfFiles: string[] = []) => {
    const files: string[] = readdirSync(dirPath);

    files.forEach(function (file) {
        if (statSync(path.join(dirPath, file)).isDirectory()) {
            arrayOfFiles = getFiles(path.join(dirPath, file), arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, file));
        }
    });

    return arrayOfFiles;
};

const commandFiles =
    getFiles(path.resolve(__dirname))?.filter((file) =>
        file.match(/\.command\.(ts|js)$/)
    ) || [];

for (const file of commandFiles) {
    const command: commandType = require(file).default; // due to export default thing

    commands.set(command.name, command);
}

export default commands;
