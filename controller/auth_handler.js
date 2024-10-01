const pg_conn = require('../database/potsgres/postgres_auth')
const {randomInt} = require('crypto')

// request GET
// retrieve user id
const userSignIn = async (req, res) => {
    server_response = {}
    if(pg_conn){
        const user_email = req.body.user_email
        const user_password = req.body.user_password

        try{
           data = await pg_conn `SELECT user_name, server_uid FROM table_user_auth WHERE user_email=${user_email} AND user_password=${user_password}`
        }
        catch (err){
            server_response["status_code"] = 500
            server_response["message"] = "Internal Server Error"
            // logger.error("DB connection failed, unable to fulfill user request")
            return res.json(server_response)
        }
        
        if(data[0]){
            server_response["status_code"] = 200
            server_response["message"] = "Authentication successful"
            server_response["data"] = data[0]
            // logger.info(`Authentication successful for user with email ${user_email}`)
            return res.json(server_response)
        }
        else{
            server_response["status_code"] = 401
            server_response["message"] = "Authentication failed, User with provided credentials not found!"
            // logger.error(`Authentication failed for user with email ${user_email}`)
            return res.json(server_response)
        }
    }
    else{
        server_response["status_code"] = 500
        server_response["message"] = "Internal Server Error"
        // logger.error("DB connection failed, unable to fulfill user request")
        return res.json(server_response)
    }
}

const _generate_server_uid = () => {
    const random_no = randomInt(1000000000, 9999999999);
    return String(random_no)
}

// request POST 
// create new user
const userSignUp = async (req, res) => {
    server_response = {}
    if(pg_conn){
        const user_name = req.body.user_name
        const user_email = req.body.user_email
        const user_password = req.body.user_password

        if(!(user_name && user_email && user_password)){
            server_response["status_code"] = 400 
            server_response["message"] = "Insufficient details for user creation"
            // logger.warn("User creation request declined, Insufficient user creation details")
            return res.json(server_response)
        }
        try{
            data = await pg_conn `SELECT server_uid FROM table_user_auth WHERE user_email=${user_email}`
        }
        catch (err){
            server_response["status_code"] = 500
            server_response["message"] = "Internal Server Error"
            // logger.error("DB connection failed, unable to fulfill user request")
            return res.json(server_response)
        }

        if (data[0]){
            server_response["status_code"] = 409 // 409: conflict
            server_response["message"] = "Email ID logged in already"
            // logger.warn("User creation request declined, Email ID logged in already")
            return res.json(server_response)
        }
        else{
            let generated_uid, data, attempt=1;
            do{
                generated_uid = _generate_server_uid();
                try{
                    data = await pg_conn `SELECT server_uid FROM table_user_auth WHERE server_uid=${generated_uid}`
                }
                catch (err){
                    server_response["status_code"] = 500
                    server_response["message"] = "Internal Server Error"
                    // logger.error("DB connection failed, unable to fulfill user request")
                    return res.json(server_response)
                }
                // logger.info("User ID creation attempt: ", attempt++)
            } while(data[0]);

            try{
                await pg_conn `INSERT INTO table_user_auth(user_name, user_email, user_password, server_uid) VALUES(${user_name}, ${user_email}, ${user_password}, ${generated_uid})`
            }
            catch (err){
                server_response["status_code"] = 500
                server_response["message"] = "Internal Server Error"
                // logger.error("DB connection failed, unable to fulfill user request")
                return res.json(server_response)
            }
            server_response["status_code"] = 200
            server_response["message"] = "New user created successfully"
            server_response["data"] = {"server_uid": generated_uid}
            // logger.info(`User creation successful with email ${user_email}`)
            return res.json(server_response)
        }
    }
    else{
        server_response["status_code"] = 500
        server_response["message"] = "Internal Server Error"
        // logger.error("DB connection failed, unable to fulfill user request")
        return res.json(server_response)
    }
}
module.exports = {userSignIn, userSignUp}
