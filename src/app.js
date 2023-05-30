const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
const helmet = require('helmet')
const auth = require('../middleware/auth')

require('dotenv').config()

const app = express()
app.use(helmet()) // security api
app.use(bodyParser.json()) // body parser
app.use(cors()) // handing cors

app.get('/health', async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    responsetime: process.hrtime(),
    message: 'OK',
    timestamp: Date.now(),
  }
  try {
    res.status(200).send(healthcheck)
  } catch (error) {
    healthcheck.message = error
    res.status(503).send()
  }
})

app.post('/say-something', auth, async (req, res) => {
  try {
    // const message = '![👍](tg://emoji?id=5368324170671202286)'
    // await axios({
    //   method: 'GET',
    //   url: `${process.env.URL_TELEGRAM_API}/${process.env.BOT_TOKEN}/sendMessage?chat_id=${process.env.CHAT_ID}&parse_mode=MarkdownV2&text=${message}`,
    // })
    res.status(200).json({ success: true, message: 'Ok' })
  } catch (error) {}
})

app.post('/', async (req, res) => {
  const chatId = req.body.message.chat.id
  const sentMessage = req.body.message.text

  // Regex for hello
  if (sentMessage.match(/hello/gi)) {
    axios
      .post(`${url}${apiToken}/sendMessage`, {
        chat_id: chatId,
        text: 'hello back 👋',
      })
      .then((response) => {
        res.status(200).send(response)
      })
      .catch((error) => {
        res.send(error)
      })
  } else {
    res.status(200).send({})
  }
})

// This should be the last route else any after it won't work
app.use('*', (_, res) => {
  res.status(404).json({
    success: false,
    message: 'Page not found',
  })
})

module.exports = app