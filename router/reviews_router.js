const express = require('express')
const router = express.Router()

const {getAllReviews, removeAllReviews, getOneReview, postReview, updateReview, removeReview} = require('../controller/review_handler')

router.route('/alldata/:uid').get(getAllReviews).delete(removeAllReviews)
router.route('/submit').post(postReview)
router.route('/user/:rid').get(getOneReview).put(updateReview).delete(removeReview)

module.exports = router