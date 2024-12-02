// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// const protect = async (req, res, next) => {
//   let token;

//   if (req.cookies.token) {
//     try {
//       token = req.cookies.token;
      
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id).select('-password');
//       next();
//     } catch (error) {
//       res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   }

//   if (!token) {
//     res.status(401).json({ message: 'Not authorized, no token' });
//   }
// };

// export default protect;

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  // Check if token is provided in query parameters
  if (req.query.token) {
    token = req.query.token;
  }

  if (token) {
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID and attach user data to the request object
      req.user = await User.findById(decoded.id).select('-password');
      
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // Respond with an error if no token is provided
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export default protect;
