const express = require('express')
const router = express.Router()

const {userSignIn, userSignUp} = require('../controller/auth_handler')

router.route('/signup').post()
router.route('/signin').get(userSignIn)

module.exports = router