const express = require('express') 

app = express()
app.use(express.json())

app.use('/ticketer/auth', require('./router/auth_router'))
app.use('/ticketer/reviews', require('./router/reviews_router'))

// app.use((req, res, next) => {
//     res.status(404).json({ error: 'Not Found' });
// });

app.listen(5000, "0.0.0.0", () => {
    console.log("app started on port 5000")
})