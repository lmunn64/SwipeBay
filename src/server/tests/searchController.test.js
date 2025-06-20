// tests/controllers/userController.test.js
const request = require('supertest');
const app = require('../app');

(async () => {
    try {
        const res = await request(app)
            .get('/api/auth/appToken')
            .expect(200);
        const tokenData = res.body;
        console.log(tokenData);

        const searchData = {
            token: tokenData.access_token,
            search_q: 'earthbound',
            limit: "2"
        };

        const searchRes = await request(app)
            .get('/api/search')
            .send(searchData)
            .expect(200);
        const s = searchRes.body;
        console.log(s);
    } catch (err) {
        console.error('Test failed:', err);
    }
})();