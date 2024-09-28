const express = require('express')
const router = express.Router()

const {userSignIn, userSignUp} = require('../controller/auth_handler')

router.route('/signup').post(userSignUp)
router.route('/signin').get(userSignIn)

module.exports = router