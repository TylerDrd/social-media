import jwt from "jsonwebtoken";
// const AWS = require("aws-sdk");

// export const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,       // securely stored in .env or Vercel
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,                   // e.g., "us-east-1"
// });

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    //grabbing the authorization header which contains the token
    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};