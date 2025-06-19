require('dotenv').config();

module.exports = {
    EBAY: {
        API_KEY:process.env.API_KEY,
        CLIENT_SECRET:process.env.CLIENT_SECRET,
        RU_NAME:process.env.RU_NAME
    },
    
    DATABASE: {
        HOST:process.env.HOST,
        USER:process.env.USER,
        PASSWORD:process.env.PASSWORD,
        NAME:process.env.NAME
    }
}