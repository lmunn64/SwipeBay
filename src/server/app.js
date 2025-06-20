const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
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

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 SwipeBay server running on port ${PORT}`);
        console.log(`📂 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🌐 Local: http://localhost:${PORT}`);
    });
}
module.exports = app