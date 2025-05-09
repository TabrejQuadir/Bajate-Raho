// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/spotifyClone';
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
