const mongoose = require('mongoose')
require('dotenv').config({path: 'database/mongodb/mongo.env'})

mongodb_url = process.env.MONGO_URL

mongoose.connect(mongodb_url, {
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useCreateIndex: true,
    useFindAndModify: false,
})

mongo_conn = mongoose.connection

mongo_conn.on('open', () => {
    logger.info("MongoDB connection established successfully")
}).on('error', (err) => {
    logger.error("Error reaching Mongodb", err)
})

module.exports = mongo_conn