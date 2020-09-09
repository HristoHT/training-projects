require('dotenv').config({path: __dirname + '/.env'})

module.exports = {
    REFRESH_TOKEN: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN: process.env.REFRESH_TOKEN_SECRET,
}