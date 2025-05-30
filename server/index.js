import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); //storing assets locally



const allowedOrigins = [
  'http://localhost:5173',
  'https://social-media-45w7mb049-jainil-patels-projects-c6189d1f.vercel.app',
  'https://social-media-theta-topaz.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

/* FILE STORAGE */
//const storage = multer.memoryStorage();

//for storing in local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
}); // this syntax found from github repo of multer, this is how to save our file
const upload = multer({storage});

/* ROUTES WITH FILES */
// const uploadToS3 = async (file) => {
//   const params = {
//     Bucket: process.env.S3_BUCKET_NAME,
//     Key: `${Date.now()}-${file.originalname}`, // unique name
//     Body: file.buffer,
//     ContentType: file.mimetype,
//     ACL: "public-read", // if you want to serve the image directly via URL
//   };

//   const data = await s3.upload(params).promise();
//   return data.Location; // this is the public S3 URL
// };

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.post("/auth/register", register); // not in routes because we need to use 'upload'
//route,middleware (store image locally in assets/public),actual logic which is storing register info
app.post("/posts", verifyToken, createPost);



/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));

