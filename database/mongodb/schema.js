const mongoose = require('mongoose')

const review_schema = mongoose.Schema({
    user_id:{
        type: String,
        required: true,
    },
    movie_id:{
        type: String,
        required: true,
    },
    theatre_name:{
        type: String,
        required: true,
    },
    overall_rating:{
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    review_content:{
        type: String
    }
})

review_schema.index({user_id:1, movie_id:1}, {unique: true})
module.exports = mongoose.model('Review_Collection', review_schema)