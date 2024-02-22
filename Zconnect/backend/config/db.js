const mongoose = require('mongoose');

// Connection URI
const uri = 'mongodb://localhost:27017/zconnect';

// Connect to MongoDB using Mongoose
mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Export the connected mongoose object
module.exports = mongoose;