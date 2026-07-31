import jwt from "jsonwebtoken";

// Verifies the JWT sent in the Authorization header ("Bearer <token>")
// and attaches the decoded payload to req.user for use in controllers.
export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized, no token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded = { id: user._id, iat, exp }
    req.user = decoded;

    next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:");
    console.error(error.message);

    return res.status(401).json({
      message: "Not authorized, invalid or expired token.",
    });
  }
};

export default protect;
