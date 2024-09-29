const mongoose = require('mongoose')
require('dotenv').config({path: 'database/mongodb/mongo.env'})

mongodb_url = process.env.MONGO_URL

mongoose.connect(mongodb_url, {
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useCreateIndex: true,
})

mongo_conn = mongoose.connection

mongo_conn.on('open', () => {
    console.log("MongoDB connected successfully...")
}).on('error', (err) => {
    console.log("Error reaching Mongodb", err)
})

module.exports = mongo_conn