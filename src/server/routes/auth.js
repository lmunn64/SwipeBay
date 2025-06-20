const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')


//GET
router.get('/getAuthUrl', authController.getAuthURL)
router.get('/exchangeAuth', authController.exchangeAuthCode)
router.get('/appToken', authController.getApplicationToken)
module.exports = router