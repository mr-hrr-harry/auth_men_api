const express = require('express')
const router = express.Router()

const {getAllReviews, getOneReview, postReview, updateReview, removeReview} = require('../controller/review_handler')

router.route('/getall/:uid').get(getAllReviews)
router.route('/').post(postReview)
router.route('/:rid').get(getOneReview).patch(updateReview).delete(removeReview)

module.exports = router