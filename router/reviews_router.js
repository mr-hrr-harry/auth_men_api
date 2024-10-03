const express = require('express')
const router = express.Router()

const {getAllReviews, removeAllReviews, getOneReview, postReview, updateReview, removeReview} = require('../controller/review_handler')

router.route('/user').get(getAllReviews).delete(removeAllReviews)
router.route('/submit').post(postReview)
router.route('/review').get(getOneReview).patch(updateReview).delete(removeReview)

module.exports = router