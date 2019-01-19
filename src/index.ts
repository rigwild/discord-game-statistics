import Discord from 'discord.js'
import { existsSync } from 'fs'
import { promises as fs } from 'fs'
import { StatGuild, StatObj, StatusObj } from './types'

import { discordAuthToken, dataFile } from './config'
const bot = new Discord.Client()
bot.login(discordAuthToken)

/**
 * Save retrieved guilds to database
 * @param data Guilds list to save
 */
const save = (data: StatGuild): Promise<void> => fs.writeFile(dataFile, JSON.stringify(data))

/** Load database */
const load = async (): Promise<StatGuild> => {
  if (!existsSync(dataFile)) await fs.writeFile(dataFile, '{"guilds":{}}')
  return JSON.parse(await fs.readFile(dataFile, 'utf8')) || []
}

/**
 * Main function
 * @param guilds Guilds the bot has access to
 */
const setup = async (guilds: Discord.Collection<string, Discord.Guild>) => {
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

bot.on('ready', () => {
  console.log('Bot is ready and listening for data.')

  // Gather data on bot login
  setup(bot.guilds)

  // Gather data every 30 minutes
  const loop = setInterval(() => setup(bot.guilds), 60 * 10 * 1000)
})
