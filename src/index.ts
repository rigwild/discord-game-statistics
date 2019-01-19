import express from 'express'

import { StatGuild } from './types'
import bot, { load as loadDataFile } from './bot'
import { serverPort as p } from './config'

// Start the bot
let botInstance: NodeJS.Timeout
;(async () => (botInstance = await bot()))().catch(err => console.error('Bot crashed.', err))

const app = express()
app.use('/', express.static(__dirname + '/../public'))

app.get('/api', async (req, res) => {
  const data: StatGuild = await loadDataFile()
  res.json(data)
})

app.listen(p, () => console.log(`Server is listening on port ${p}. http://localhost:${p}/`))
