const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
const helmet = require('helmet')
// const auth = require('../middleware/auth')
const { spotifActive } = require('../api/external')
const { format } = require('date-fns')

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

// app.post('/say-something', auth, async (req, res) => {
//   try {
//     const response = await spotifActive()
//     const message = `Saat ini kalian tergabung di <b>${response?.data?.title ?? ''}</b> <code>jumlah member:${
//       response?.data?.member_count ?? 0
//     }/6</code>, berakhir pada: <b>${format(
//       new Date(response?.data?.expires_at),
//       'd MMMM yyyy',
//     )}</b> https://media.giphy.com/media/Q66ZEIpjEQddUOOKGW/giphy.gif`
//     await axios({
//       method: 'GET',
//       url: `${process.env.URL_TELEGRAM_API}/${process.env.BOT_TOKEN}/sendMessage?chat_id=${process.env.CHAT_ID}&parse_mode=html&text=${message}`,
//     })
//     res.status(200).json({
//       success: true,
//       message: 'Ok',
//     })
//   } catch (e) {
//     console.log('err => ', e)
//     res.status(500).json({ success: false, message: 'Internal server error' })
//   }
// })

app.post('/', async (req, res) => {
  const getMessage = req.body.message.text
  const response = await spotifActive()
  const message = {
    1: `Saat ini kalian tergabung di <b>${response?.data?.title ?? ''}</b> <code>jumlah member:${
      response?.data?.member_count ?? 0
    }/6</code>, berakhir pada: <b>${format(new Date(response?.data?.expires_at), 'd MMMM yyyy')}</b>`,
    2: 'Perkenalkan saya <b>Spotifriend Bot</b>, untuk informasi detailnya bisa melalui perintah: <code>/info</code> https://media.giphy.com/media/Q66ZEIpjEQddUOOKGW/giphy.gif',
  }

  try {
    if (getMessage.match(/hello|hi/gi)) {
      await axios({
        method: 'GET',
        url: `${process.env.URL_TELEGRAM_API}/${process.env.BOT_TOKEN}/sendMessage?chat_id=${process.env.CHAT_ID}&parse_mode=MarkdownV2&text=${message[2]}`,
      })
      res.status(200).json({ success: true, message: 'Ok' })
    }

    if (getMessage.match(/info/gi)) {
      await axios({
        method: 'GET',
        url: `${process.env.URL_TELEGRAM_API}/${process.env.BOT_TOKEN}/sendMessage?chat_id=${process.env.CHAT_ID}&parse_mode=MarkdownV2&text=${message[1]}`,
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
