const User = require('../models/User')
const axios = require('axios')

class userController{
    static async addUser(req,res){
        try {
            const {userName, email, password, firstName, lastName} = req.body;
            // Validation
            if (!userName || !email || !password || !firstName || !lastName) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            
            const existingUser = await User.findByEmail(email)
            if(existingUser){
                return res.status(409).json({message : 'User already exists!'})
            }

            const userId = await User.createUser({
                userName, 
                email, 
                password, //hash this eventually
                firstName, 
                lastName 
            })
            res.status(201).json({
                message: 'User created successfully',
                user_id: userId
            })
        } catch (error) {
             res.status(500).json({message: 'Failed to create user'})
             console.error('Error creating user: ', error)
        }

    }
    
    // static async getUserInfo(req,res){

    // }
    
}

module.exports = userController;