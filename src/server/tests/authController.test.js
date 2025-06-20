// tests/controllers/userController.test.js
const request = require('supertest');
const app = require('../app');

request(app)
    .get('/api/auth/getAuthUrl')
    .expect(302)
    .end(function(err, res) {
        if (err) throw err.message
})

const auth = {
    code: "v%5E1.1%23i%5E1%23r%5E1%23p%5E3%23f%5E0%23I%5E3%23t%5EUl41XzExOjA2NUEwRkI2NENBN0M5RjlERUIwRTE5NUVGNjZCQ0M4XzFfMSNFXjI2MA%3D%3D"
}

request(app)
    .get('/api/auth/exchangeAuth')
    .send(auth)
    .expect(200)
    .end(function(err, res) {
            if (err) throw err.message
})

request(app)
    .get('/api/auth/appToken')
    .expect(200)
    .end(function(err, res) {
            if (err) throw err.message
})