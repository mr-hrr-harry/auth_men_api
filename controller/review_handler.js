mongo_conn = require('../database/mongodb/mongodb_conn')
review_schema = require('../database/mongodb/schema')

// request GET 
// view all submitted reviews
const getAllReviews = (req, res) => {
    res.json({"message": "getAll"})
}

// request DELETE 
// delete all submitted reviews
const removeAllReviews = (req, res) => {
    res.json({"message": "delAll"})
}

// request GET
// get one particular review
const getOneReview = (req, res) => {
    res.json({"message": "getOne"})
}

// request POST
// submit a new review
const postReview = async (req, res) => {
    server_response = {}
    const {user_id, movie_id, theatre_name, overall_rating, review_content} = req.body

    if(!(user_id && movie_id && theatre_name && overall_rating && review_content)){
        server_response["status_code"] = 400 
        server_response["message"] = "Insufficient details for review submission"
        // logger.warn("ubmit review request declined, Insufficient review submission details")
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
            // logger.warn("Unhandled error occured during review submission", err)
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
const removeReview = (req, res) => {
    res.json({"message": "delone"})
}

module.exports = {getAllReviews, removeAllReviews, getOneReview, postReview, updateReview, removeReview} 