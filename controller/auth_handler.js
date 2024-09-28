const pg_conn = require('../database/potsgres/postgres_auth')
const {randomInt} = require('crypto')

// request GET
const userSignIn = async (req, res) => {
    server_response = {}
    if(pg_conn){
        const user_email = req.body.user_email
        const user_password = req.body.user_password

        data = await pg_conn `SELECT server_uid FROM table_user_auth WHERE user_email=${user_email} AND user_password=${user_password}`

        if(data[0]){
            server_response["status_code"] = 200
            server_response["message"] = "Authentication successful"
            server_response["data"] = data[0]
            // logger.info(`Authentication successful for user with email ${user_email}`)
        }
        else{
            server_response["status_code"] = 401
            server_response["message"] = "Authentication failed, User not found!"
            // logger.error(`Authentication failed for user with email ${user_email}`)
        }
    }
    else{
        server_response["status_code"] = 500
        server_response["message"] = "Internal Server Error"
        // logger.error("DB connection failed, unable to fulfill user request")
    }
    res.json(server_response)
}

const _generate_server_uid = () => {
    const random_no = randomInt(1000000000, 9999999999);
    return String(random_no)
}

// request POST 
const userSignUp = async (req, res) => {
    server_response = {}
    if(pg_conn){
        const user_email = req.body.user_email
        const user_password = req.body.user_password

        data = await pg_conn `SELECT server_uid FROM table_user_auth WHERE user_email=${user_email}`

        if (data[0]){
            server_response["status_code"] = 409 // 409: conflict
            server_response["message"] = "Email ID taken already"
            // logger.warn("User creation request declined, Email ID taken already")
        }
        else{
            let generated_uid, data, attempt=1;
            do{
                generated_uid = _generate_server_uid();
                data = await pg_conn `SELECT server_uid FROM table_user_auth WHERE server_uid=${generated_uid}`
                // logger.info("User ID creation attempt: ", attempt++)
            } while(data[0]);

            await pg_conn `INSERT INTO table_user_auth(user_email, user_password, server_uid) VALUES(${user_email}, ${user_password}, ${generated_uid})`

            server_response["status_code"] = 200
            server_response["message"] = "New user created successfuly"
            server_response["data"] = {"server_uid": generated_uid}
            // logger.info(`User creation successful with email ${user_email}`)
        }
    }
    else{
        server_response["status_code"] = 500
        server_response["message"] = "Internal Server Error"
        // logger.error("DB connection failed, unable to fulfill user request")
    }
    res.json(server_response)
}

module.exports = {userSignIn, userSignUp}
