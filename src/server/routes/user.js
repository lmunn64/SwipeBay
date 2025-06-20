const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')


//POST
router.post('/addUser', userController.addUser)

// //PUT
// router.put('/:id/')
module.exports = router