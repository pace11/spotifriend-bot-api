const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
const helmet = require('helmet')
const { statusMessage } = require('./utils')

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
    res.send(healthcheck)
  } catch (error) {
    healthcheck.message = error
    res.status(503).send()
  }
})

app.post('/say-something', async (req, res) => {
  try {
    const message = '![👍](tg://emoji?id=5368324170671202286)'
    await axios({
      method: 'GET',
      url: `${process.env.URL_TELEGRAM_API}/${process.env.BOT_TOKEN}/sendMessage?chat_id=${process.env.CHAT_ID}&parse_mode=MarkdownV2&text=${message}`,
    })
    res.send({
      status: 200,
      message: statusMessage[200],
    })
  } catch (error) {}
})

app.post('/', async (req, res) => {
  // console.log(req.body);
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

// app.get("/lead_members/:id", async (req, res) => {
//   const body = {
//     selector: {
//       _id: {
//         $gt: null,
//       },
//       id: req.params.id,
//     },
//     execution_stats: false,
//     limit: 1,
//     skip: 0,
//   };
//   const env = req.headers.environtment || "uat";
//   const urlApi = {
//     stg: `${process.env.API_MEMBER_KABAYAN_STG_COUCHDB}`,
//     uat: `${process.env.API_MEMBER_KABAYAN_UAT_COUCHDB}`,
//   };
//   const response = await axios({
//     method: "POST",
//     url: urlApi[env],
//     data: body,
//     withCredentials: false,
//     headers: {
//       size: "100",
//       skip: "0",
//     },
//   });
//   const couchDBResponse = response.data.docs;
//   const statusCode = response.data.bookmark !== "nil" ? 200 : 404;
//   res.send({
//     status: statusCode,
//     message: statusMessage[statusCode],
//     data: statusCode === 200 ? couchDBResponse : null,
//   });
// });

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
  console.log('Press Ctrl+C to quit.')
})
