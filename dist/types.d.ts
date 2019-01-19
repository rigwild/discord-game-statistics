import { Game } from 'discord.js';
/** The list of guilds in the Stats file */
interface StatGuild {
    guilds: {
        [guild: string]: StatObj[];
    };
}
/** A data backup containing the date of the backup, and its data */
interface StatObj {
    timestamp: Date;
    content: StatusObj[];
}
/**
 * Content to save
 *
 * @param pseudo The pseudo of the user
 * @param status The status of the user
 * @param game Activity of the user
 */
interface StatusObj {
    pseudo: string;
    status: string;
    game: Game;
}
export { StatGuild, StatObj, StatusObj };
