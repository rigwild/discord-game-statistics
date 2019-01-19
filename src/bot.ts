import Discord from 'discord.js'
import { existsSync } from 'fs'
import { promises as fs } from 'fs'
import { StatGuild, StatObj, StatusObj } from './types'

import { discordAuthToken, dataFile, scrapInterval } from './config'

/**
 * If the bot was not already logged in, do it
 */
const botLogin = async (): Promise<Discord.Client> => {
  const bot = new Discord.Client()
  await bot.login(discordAuthToken)
  return bot
}

/**
 * Save retrieved guilds to database
 * @param data Guilds list to save
 */
const save = (data: StatGuild): Promise<void> => fs.writeFile(dataFile, JSON.stringify(data))

/** Load database */
export const load = async (): Promise<StatGuild> => {
  if (!existsSync(dataFile)) await fs.writeFile(dataFile, '{"guilds":{}}')
  return JSON.parse(await fs.readFile(dataFile, 'utf8')) || []
}

/**
 * Get data from bot's Discord servers
 * @param bot The `Discord.js ` bot instance
 */
const getData = async (bot: Discord.Client) => {
  const guilds = bot.guilds
  let bckp = await load()

  // For each guild, collect members activity data
  for (let aGuild of guilds.values()) {
    await aGuild.fetchMembers()

    // If the user is playing a game, save it
    const content = aGuild.members
      .filter(x => x.presence.game !== null)
      .map(
        (x): StatusObj => ({
          pseudo: x.displayName,
          status: x.presence.status,
          game: x.presence.game
        })
      )

    // Data saved to database
    const data: StatObj = {
      timestamp: new Date(),
      content
    }

    // Don't add data if none was retrived
    if (data.content.length === 0) continue

    // Create Guild key if it does not exist
    if (!bckp.guilds.hasOwnProperty(aGuild.name)) bckp.guilds[aGuild.name] = []

    bckp.guilds[aGuild.name].push(data)
  }
  await save(bckp)
  console.log(new Date() + ' - Data was collected by discord-game-statistics.')
}

/**
 * @returns The setInterval of the data scapper
 */
const botStart = async (): Promise<NodeJS.Timeout> => {
  const bot = await botLogin()
  console.log('Bot is ready and listening for data.')

  // Gather data on bot login
  getData(bot)

  // Gather data every 30 minutes
  const loop = setInterval(() => getData(bot), scrapInterval)
  return loop
}

export default botStart
