const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
const helmet = require('helmet')
const auth = require('../middleware/auth')
const { spotifActive } = require('../api/external')
const { format, differenceInDays } = require('date-fns')
const { translate } = require('@vitalets/google-translate-api')

require('dotenv').config()

const app = express()
app.use(helmet()) // security api
app.use(bodyParser.json()) // body parser
app.use(cors()) // handing cors

app.get('/', async (req, res) => {
  try {
    res.status(200).json({ message: 'Please contact developer for more information' })
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
    const response = await axios({
      method: 'GET',
      url: `${process.env.URL_RANDOM_QUOTES_API}/random`,
    })

    const { text } = await translate(`${response?.data?.content}`, { to: 'id' })
    const message = `<b>Hallo Gengs!!</b> gimana kabarnya hari ini?? semoga sehat selalu. Ada quotes menarik dari <em>${response?.data?.author} - ${text}.</em> So, semangat terus ya untuk hari ini`

    await axios({
      method: 'GET',
      url: `${process.env.URL_TELEGRAM_API}/${process.env.BOT_TOKEN}/sendMessage?chat_id=${process.env.CHAT_ID}&parse_mode=html&text=${message}`,
    })

    res.status(200).json({ success: true, message: 'Ok' })
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
    console.log('err => ', e)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

app.post('/', async (req, res) => {
  const getMessage = req.body.message.text
  const response = await spotifActive()
  const diff = differenceInDays(new Date(response?.data?.expires_at), new Date())

  const message = {
    1: `Saat ini kalian tergabung di <b>${response?.data?.title ?? ''}</b> <code>jumlah member:${
      response?.data?.member_count ?? 0
    }/6</code>, berakhir pada: <b>${format(new Date(response?.data?.expires_at), 'd MMMM yyyy')} (${diff} hari lagi)</b>`,
    2: 'Perkenalkan saya <b>Spotifriend Bot</b>, untuk informasi detailnya bisa melalui perintah: <code>/info</code> https://media.giphy.com/media/Q66ZEIpjEQddUOOKGW/giphy.gif',
  }

  try {
    if (getMessage.match(/hello|hi/gi)) {
      await axios({
        method: 'GET',
        url: `${process.env.URL_TELEGRAM_API}/${process.env.BOT_TOKEN}/sendMessage?chat_id=${process.env.CHAT_ID}&parse_mode=html&text=${message[2]}`,
      })
      res.status(200).json({ success: true, message: 'Ok' })
    }

    if (getMessage.match(/info/gi)) {
      await axios({
        method: 'GET',
        url: `${process.env.URL_TELEGRAM_API}/${process.env.BOT_TOKEN}/sendMessage?chat_id=${process.env.CHAT_ID}&parse_mode=html&text=${message[1]}`,
      })
      res.status(200).json({ success: true, message: 'Ok' })
    }
  } catch (e) {
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// // This should be the last route else any after it won't work
// app.use('*', (_, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Page not found',
//   })
// })

module.exports = app
