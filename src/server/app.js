const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const searchRoutes = require('./routes/search');

const app = express();

const options = {
  origin: [
      /^https:\/\/.*\.lhr\.life$/,
      'https://lmunn64.github.io',
      'localhost:3000',
  ]
}
// middleware
app.use(cors(options))
app.use(express.static(__dirname));
app.use(bodyParser.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);

module.exports = app