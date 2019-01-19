"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const fs_1 = require("fs");
const fs_2 = require("fs");
const config_1 = require("./config");
const bot = new discord_js_1.default.Client();
bot.login(config_1.discordAuthToken);
/**
 * Save retrieved guilds to database
 * @param data Guilds list to save
 */
const save = (data) => fs_2.promises.writeFile(config_1.dataFile, JSON.stringify(data));
/** Load database */
const load = async () => {
    if (!fs_1.existsSync(config_1.dataFile))
        await fs_2.promises.writeFile(config_1.dataFile, '{"guilds":{}}');
    return JSON.parse(await fs_2.promises.readFile(config_1.dataFile, 'utf8')) || [];
};
/**
 * Main function
 * @param guilds Guilds the bot has access to
 */
const setup = async (guilds) => {
    let bckp = await load();
    // For each guild, collect members activity data
    for (let aGuild of guilds.values()) {
        await aGuild.fetchMembers();
        // If the user is playing a game, save it
        const content = aGuild.members
            .filter(x => x.presence.game !== null)
            .map((x) => ({
            pseudo: x.displayName,
            status: x.presence.status,
            game: x.presence.game
        }));
        // Data saved to database
        const data = {
            timestamp: new Date(),
            content
        };
        // Don't add data if none was retrived
        if (data.content.length === 0)
            continue;
        // Create Guild key if it does not exist
        if (!bckp.guilds.hasOwnProperty(aGuild.name))
            bckp.guilds[aGuild.name] = [];
        bckp.guilds[aGuild.name].push(data);
    }
    await save(bckp);
};
bot.on('ready', () => {
    console.log('Bot is ready and listening for data.');
    setup(bot.guilds);
});
