const express = require('express') 
require('./logger')

app = express()
app.use(express.json())

app.use('/ticketer/auth', require('./router/auth_router'))
app.use('/ticketer/reviews', require('./router/reviews_router'))

app.listen(5000, "0.0.0.0", () => {
    logger.info("Server App started on port 5000")
})