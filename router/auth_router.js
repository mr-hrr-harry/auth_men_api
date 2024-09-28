const express = require('express')
const router = express.Router()

const {userSignIn, userSignUp} = require('../controller/auth_handler')

router.route('/signin').get(userSignIn)
router.route('/signup').post(userSignUp)

module.exports = router