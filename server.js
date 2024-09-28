const express = require('express') 

app = express()

app.listen(5000, "0.0.0.0", () => {
    console.log("app started on port 5000")
})