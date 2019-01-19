import express from 'express'

import bot, { load as loadDataFile } from './bot'
import { serverPort as p } from './config'

const setup = async () => {
  // Start the bot
  if (!process.argv.includes('--no-bot')) {
    const botInstance: NodeJS.Timeout = await bot()
  } else console.log('Bot will not be started. (--no-bot)')

  // Start the server
  if (!process.argv.includes('--no-server')) {
    const app = express()
    app.set('view engine', 'ejs')
    app.set('views', __dirname + '/../public/')
    app.use('/assets/', express.static(__dirname + '/../public/assets/'))

    app.get('/', async (req, res) => res.render('index', { data: await loadDataFile() }))

    app.get('/api', async (req, res) => res.json(await loadDataFile()))

    app.listen(p, () => console.log(`Server is listening on port ${p}. http://localhost:${p}/`))
  } else console.log('Server will not be started. (--no-server)')
}

setup().catch(console.error)
