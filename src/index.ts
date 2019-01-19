import express from 'express'

import bot, { load as loadDataFile } from './bot'
import { serverPort as p } from './config'

// Start the bot
let botInstance: NodeJS.Timeout
;(async () => (botInstance = await bot()))().catch(err => console.error('Bot crashed.', err))

const app = express()
app.set('view engine', 'ejs')
app.set('views', __dirname + '/../public/')
app.use('/assets/', express.static(__dirname + '/../public/assets/'))

app.get('/', async (req, res) => {
  res.render('index', { data: await loadDataFile() })
})

app.get('/api', async (req, res) => res.json(await loadDataFile()))

app.listen(p, () => console.log(`Server is listening on port ${p}. http://localhost:${p}/`))
