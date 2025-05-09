const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const albumRoutes = require('./routes/albumRoutes');
const songRoutes = require('./routes/songRoutes');
const categoryRoutes = require('./routes/categoryRoute');
const authRoutes = require("./routes/authRoutes")
const playlistRoutes = require('./routes/playlistRoutes');
const path = require('path');


require('dotenv').config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payload

// Sample route
app.get('/', (req, res) => res.send('API Running'));
// Routes
app.use('/api', albumRoutes);
app.use('/api', songRoutes);
app.use('/api', categoryRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/playlists', playlistRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
