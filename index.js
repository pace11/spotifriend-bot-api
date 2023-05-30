const http = require('http')
const app = require('./src/app')
const server = http.createServer(app)

const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log('Press Ctrl+C to quit.')
})
