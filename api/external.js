const axios = require('axios')
const { translate } = require('@vitalets/google-translate-api')

const spotifActive = async () => {
  try {
    const result = await axios({
      method: 'GET',
      url: `${process.env.URL_SERVICE_API}/spotify-notif/active`,
    })

    return result?.data
  } catch (error) {
    throw error
  }
}

const randomQuotes = async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${process.env.URL_RANDOM_QUOTES_API}/random`,
    })

    return response?.data
  } catch (error) {
    throw error
  }
}

const translateId = async (data) => {
  try {
    const { text } = await translate(`${data}`, { to: 'id' })
    return text
  } catch (error) {
    throw error
  }
}

module.exports = { spotifActive, randomQuotes, translateId }
