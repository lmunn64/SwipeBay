// tests/controllers/userController.test.js
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const userData = {
    userName: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User'
};  

request(app)
    .post('/api/users/addUser')
    .send(userData)
    .expect(201)
    .end(function(err, res) {
        if (err) throw err.message
})

