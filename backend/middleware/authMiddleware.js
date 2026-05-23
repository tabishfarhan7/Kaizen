import jwt from 'jsonwebtoken';

export const protectRoute = (req, res, next) => {
  try {
    // 1. Grab the token from the HTTP-Only cookie vault
    const token = req.cookies.token;

    // 2. If there is no token, kick them out immediately
    if (!token) {
      return res.status(401).json({ error: "Access denied. Please log in." });
    }

    // 3. Verify the token is mathematically valid using your secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach the decoded user ID to the request so the next function can use it
    req.user = decoded;

    // 5. Open the door and let them pass to the actual controller
    next();

  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};