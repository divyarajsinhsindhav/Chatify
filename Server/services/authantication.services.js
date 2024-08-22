require('dotenv')
const jwt = require('jsonwebtoken')

const createAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET)
}

exports.createAccessToken = createAccessToken