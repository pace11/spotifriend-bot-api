const axios = require('axios')

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

module.exports = { spotifActive }
