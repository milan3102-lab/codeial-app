const mongoose = require('mongoose');

// Connect to MongoDB without deprecated options
mongoose.connect('mongodb://localhost/codeial_development');

// Get the connection
const db = mongoose.connection;

// Handle connection errors
db.on('error', console.error.bind(console, "Error connecting to mongodb"));

// Log when connected successfully
db.once('open', function() {
    console.log('Connected to database:: MongoDB');
});

// Export the connection
module.exports = db;
