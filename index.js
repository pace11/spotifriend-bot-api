const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
const helmet = require('helmet')
const auth = require('./middleware/auth')
const { spotifActive, randomQuotes, translateId } = require('./api/external')
const { renderText } = require('./utils')

require('dotenv').config()

const PORT = process.env.PORT || 8080

const app = express()
app.use(helmet()) // security api
app.use(bodyParser.json()) // body parser
app.use(cors()) // handing cors

app.get('/', async (req, res) => {
  try {
    res
      .status(200)
      .json({ message: 'Please contact developer for more information' })
  } catch (error) {
    healthcheck.message = error
    res.status(503).send()
  }
})

app.get('/health', async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    responsetime: process.hrtime(),
    message: 'Ok',
    timestamp: Date.now(),
  }
  try {
    res.status(200).json(healthcheck)
  } catch (error) {
    healthcheck.message = error
    res.status(503).json()
  }
})

app.post('/say-something', auth, async (req, res) => {
  try {
    const responseSpotify = await spotifActive()
    const response = await randomQuotes()
    const translate = await translateId(response?.content)

    await axios({
      method: 'GET',
      url: `${process.env.URL_TELEGRAM_API}/${
        process.env.BOT_TOKEN
      }/sendMessage?chat_id=${
        process.env.CHAT_ID
      }&parse_mode=html&text=${renderText({
        type: 'says',
        data: {
          content: translate,
          author: response?.author,
          ...responseSpotify?.data,
        },
      })}`,
    })

    res.status(200).json({
      success: true,
      message: 'Ok',
    })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

app.post('/test', async (req, res) => {
  try {
    const response = await spotifActive()

    res.status(200).json({
      success: true,
      message: 'Ok',
      data: response?.data,
    })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

app.post('/', async (req, res) => {
  const getMessage = req.body.message.text
  const response = await spotifActive()

  try {
    if (getMessage.match(/hello|hi/gi)) {
      await axios({
        method: 'GET',
        url: `${process.env.URL_TELEGRAM_API}/${
          process.env.BOT_TOKEN
        }/sendMessage?chat_id=${
          process.env.CHAT_ID
        }&parse_mode=html&text=${renderText({
          type: 'hello',
          data: response?.data,
        })}`,
      })
    }

    if (getMessage.match(/info/gi)) {
      await axios({
        method: 'GET',
        url: `${process.env.URL_TELEGRAM_API}/${
          process.env.BOT_TOKEN
        }/sendMessage?chat_id=${
          process.env.CHAT_ID
        }&parse_mode=html&text=${renderText({
          type: !!response?.data ? 'info' : 'noMembership',
          data: response?.data,
        })}`,
      })
    }

    if (
      getMessage.match(
        /terima\skasih|trima\skasih|trm\sksh|thx|thanks|ty|thanks\syou|thank\syou|mksh|makasih|mksih|nuhun/gi,
      )
    ) {
      await axios({
        method: 'GET',
        url: `${process.env.URL_TELEGRAM_API}/${
          process.env.BOT_TOKEN
        }/sendMessage?chat_id=${
          process.env.CHAT_ID
        }&parse_mode=html&text=${renderText({
          type: 'thanks',
          data: response?.data,
        })}`,
      })
    }

    res.status(200).json({ success: true, message: 'Ok' })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log('Press Ctrl+C to quit.')
})
