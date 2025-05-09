const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');

exports.protect = async (req, res, next) => {
    let token;
    console.log('Auth Headers:', req.headers.authorization); // Debug log

    try {
        // Check if token exists in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                // Get token from header
                token = req.headers.authorization.split(' ')[1];
                console.log('Extracted token:', token); // Debug log

                // Verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                console.log('Decoded token:', decoded); // Debug log

                // Get user from token
                const user = await User.findById(decoded.userId).select('-password');
                console.log('Found user:', user); // Debug log

                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: 'Not authorized, user not found'
                    });
                }

                // Add user to request object
                req.user = user;
                next();
            } catch (error) {
                console.error('Token verification error:', error); // Debug log
                return res.status(401).json({
                    success: false,
                    message: 'Not authorized, token verification failed',
                    error: error.message
                });
            }
        } else {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no token provided'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error in auth middleware'
        });
    }
};
