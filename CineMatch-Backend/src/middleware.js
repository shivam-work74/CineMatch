// --- Authentication Middleware ---
// This file exports a "protect" function that acts as a security guard
// for our protected API routes.

const jwt = require('jsonwebtoken');
const User = require('./models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Check for a token in the 'Authorization' header
  // The header looks like: "Authorization: Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Get the token part from the header
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using our JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user from the token's ID
      // We attach the user object to the 'req' (request)
      // We exclude the password from being returned
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // 5. All good! Move to the next step in the request (the actual route)
      next();

    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token was found at all
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };

