const pg_conn = require('../database/potsgres/postgres_auth')

server_response = {}

// request GET
const userSignIn = async (req, res) => {
    if(pg_conn){
        const user_email = req.body.user_email
        const user_password = req.body.user_password

        data = await pg_conn `SELECT server_uid FROM table_user_auth WHERE user_email=${user_email} AND user_password=${user_password}`
        server_response["status_code"] = 200
        server_response["message"] = "Authentication verfication successful"
        server_response["data"] = data
    }
    else{
        server_response["status_code"] = 404
        server_response["message"] = "Internal Server Error"
    }
    res.json(server_response)
}

// request POST 
const userSignUp = async (req, res) => {

}

module.exports = {userSignIn, userSignUp}
