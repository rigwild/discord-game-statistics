/// <reference types="node" />
import { StatGuild } from './types';
/** Load database */
export declare const load: () => Promise<StatGuild>;
/**
 * @returns The setInterval of the data scapper
 */
declare const botStart: () => Promise<NodeJS.Timeout>;
export default botStart;
