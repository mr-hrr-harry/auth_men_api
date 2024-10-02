const { response } = require('express')

mongo_conn = require('../database/mongodb/mongodb_conn')
review_schema = require('../database/mongodb/schema')

// request GET 
// view all submitted reviews
const getAllReviews = async (req, res) => {
    server_response = {}
    const user_id = req.body.user_id

    if(!user_id){
        server_response["status_code"] = 400 
        server_response["message"] = "Insufficient details for all reviews retrival. Provide User_id"
        // logger.warn("Retrive all review request declined, Insufficient details")
        return res.json(server_response)
    }   
    try{
        const all_reviews = await review_schema.find(
            {"user_id": user_id},
            {"user_id":0, "__v":0}
        )
        if (all_reviews[0]){
            server_response["status_code"] = 200
            server_response["message"] = "All Reviews data retrival successful"
            server_response["data"] = all_reviews
            // logger.info(`All Reviews data retrival successful for USER_ID: ${user_id} -> REVIEW_ID: ${review_id}`
            return res.json(server_response)
        }
        else{
            server_response["status_code"] = 404
            server_response["message"] = "User has not reviewed any movie yet"
            // logger.warn(`All Reviews data retrival failed for user ${user_id} with 0 reviews`
            return res.json(server_response)        
        }
    }
    catch(err){
        server_response["status_code"] = 500
        server_response["message"] = "Internal Server Error"
        console.log(err)
        // logger.error("DB connection failed, unable to fulfill user request", err)
        return res.json(server_response)
    }
}

// request DELETE 
// delete all submitted reviews
const removeAllReviews = async (req, res) => {
    server_response = {}
    const user_id = req.body.user_id

    if(!user_id){
        server_response["status_code"] = 400 
        server_response["message"] = "Insufficient details for all reviews deletion. Provide User_id"
        // logger.warn("Delete all review request declined, Insufficient details")
        return res.json(server_response)
    }   
    try{
        const deletion_status = await review_schema.deleteMany({"user_id": user_id})
        if (deletion_status["n"] != 0){
            server_response["status_code"] = 200
            server_response["message"] = "All Reviews data deleted successfully"
            // logger.info(`All Reviews data deletion successful for USER_ID: ${user_id} -> REVIEW_ID: ${review_id}`
            return res.json(server_response)
        }
        else{
            server_response["status_code"] = 404
            server_response["message"] = "User has not reviewed any movie yet"
            // logger.warn(`All Reviews data retrival failed for user ${user_id} with 0 reviews`
            return res.json(server_response)        
        }
    }
    catch (err){
        server_response["status_code"] = 500
        server_response["message"] = "Internal Server Error"
        // logger.error("Unhandled MongoDB error occured during review submission", err)
        console.log("ERROR:", err)
        return res.json(server_response)
    }
}

// request GET  
// get one particular review
const getOneReview = async(req, res) => {
    server_response = {}
    const review_id = req.query.rid
    const user_id = req.body.user_id

    if(!(user_id && review_id)){
        server_response["status_code"] = 400 
        server_response["message"] = "Insufficient details for review retrival. Provide Review_id & User_id"
        // logger.warn("Retrive review request declined, Insufficient review details")
        return res.json(server_response)
    }

    try{
        const user_review = await review_schema.findOne(
            {"_id": review_id},
            {"_id":0, "__v":0, "user_id":0}
        )
        if (user_review){
            server_response["status_code"] = 200
            server_response["message"] = "Review data retrival successful"
            server_response["data"] = user_review
            // logger.info(`Review data retrival successful for USER_ID: ${user_id} -> REVIEW_ID: ${review_id}`
            return res.json(server_response)
        }
        else{
            server_response["status_code"] = 404
            server_response["message"] = "Provided Review id doesnot exist for review retrival"
            // logger.warn(`Nonexistent review retrival request by USER_ID: ${user_id} -> REVIEW_ID: ${review_id}`)
            return res.json(server_response)
        }   
    }
    catch (err){
        if (err.name === "CastError"){
            server_response["status_code"] = 400
            server_response["message"] = "Check for the correctness of length of the Review id"
            // logger.warn(`Invalid review_id length(${review_id.length}/24): ${review_id} requested by user_id: ${user_id}`)
            return res.json(server_response)
        }
        else{
            server_response["status_code"] = 500
            server_response["message"] = "Internal Server Error"
            console.log(err)
            // logger.error("DB connection failed, unable to fulfill user request", err)
            return res.json(server_response)
        }
    }
}

// request POST
// submit a new review
const postReview = async (req, res) => {
    server_response = {}
    const {user_id, movie_id, theatre_name, overall_rating, review_content} = req.body

    if(!(user_id && movie_id && theatre_name && overall_rating)){
        server_response["status_code"] = 400 
        server_response["message"] = "Insufficient details for review submission. Provide Movie name, Theatre name & Rating atleast"
        // logger.warn("Submit review request declined, Insufficient review submission details")
        return res.json(server_response)
    }
    try{
        const review_data = await review_schema.create({
            user_id, movie_id, theatre_name, overall_rating, review_content
        })
        server_response["status_code"] = 200
        server_response["message"] = "Review Submission successful"
        server_response["review_id"] = review_data._id
        // logger.info(`Review submission successful for user ${user_id}`)
        return res.json(server_response)
    }
    catch (err){
        if (err.code === 11000){
            server_response["status_code"] = 409
            server_response["message"] = "You have reviewed this movie already"
           // logger.warn("Review submission failed for user ${user_id} ")
            return res.json(server_response)
        }
        else{
            server_response["status_code"] = 500
            server_response["message"] = "Internal Server Error"
            // logger.error("Unhandled MongoDB error occured during review submission", err)
            return res.json(server_response)
        }
    }
}

//request PUT
// edit one particular review
const updateReview = (req, res) => {
    res.json({"message": "updateOne"})  
}

//request DELETE
// delete one particular review
const removeReview = async (req, res) => {
    server_response = {}
    const review_id = req.query.rid
    const user_id = req.body.user_id

    if(!(user_id && review_id)){
        server_response["status_code"] = 400 
        server_response["message"] = "Insufficient details for review deletion. Provide Review_id & User_id"
        // logger.warn(`Delete review request declined, Insufficient review details by user USER_ID: ${user_id}`)
        return res.json(server_response)
    }
    try{
        const deletion_status = await review_schema.deleteOne({"_id": review_id})
        if (deletion_status["n"] != 0){
            server_response["status_code"] = 200 
            server_response["message"] = "Review Deletion successful"
            // logger.info(`Review submission successful for user ${user_id}`)
            return res.json(server_response) 
        }
        else{
            server_response["status_code"] = 404
            server_response["message"] = "Provided Review id doesnot exist for review deletion"
            // logger.warn(`Nonexistent review deletion request by USER_ID: ${user_id} -> REVIEW_ID: ${review_id}`)
            return res.json(server_response)
        }
    }
    catch(err){
        server_response["status_code"] = 500
        server_response["message"] = "Internal Server Error"
        // logger.error("Unhandled MongoDB error occured during review submission", err)
        console.log("ERROR:", err)
        return res.json(server_response)
    }
}

module.exports = {getAllReviews, removeAllReviews, getOneReview, postReview, updateReview, removeReview} 