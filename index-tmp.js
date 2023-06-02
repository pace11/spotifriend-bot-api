const http = require('http')
const app = require('./src/app')
const server = http.createServer(app)

// // This should be the last route else any after it won't work
// app.use('*', (_, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Page not found',
//   })
// })

const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log('Press Ctrl+C to quit.')
})
