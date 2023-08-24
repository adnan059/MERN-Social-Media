require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");

const authRoutes = require("./routes/AuthRoutes");
const userRoutes = require("./routes/UserRoutes");
const postRoutes = require("./routes/PostRoutes");
const commentRoutes = require("./routes/CommentRoutes");
const { verifyToken } = require("./utils/Verify");
const createError = require("./utils/Error");
const path = require("path");
const { log } = require("console");

////////////////////////////////////////////////////////

const PORT = process.env.PORT || 8000;
const DB_URL = process.env.DB_URL;
const UPLOAD_FOLDER = "./uploads/files";

////////////////////////////////////////////////////////

const app = express();
app.use(cors());
app.use(express.json());
app.use("/files", express.static("uploads/files"));

////////////////////////////////////////////////////////

const connect = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Database Connected");
    app.listen(PORT, () => console.log(`Server Listening to Port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

connect();

/////////////////////////////////////////////////////////

const storage = multer.diskStorage({
  destination: UPLOAD_FOLDER,
  filename: (req, file, cb) => {
    cb(null, req.body.filename);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(createError(400, "Only jpeg, jpg and png format photos are allowed!"));
    }
  },
});

///////////////////////////////////////////////////////
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);

app.post("/upload", verifyToken, upload.single("image"), (req, res) => {
  res.status(201).json({ message: "File Uploaded Successfully!" });
});

////////////////////////////////////////////////////////

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const messge = err.message || "Something Went Wrong!";
  return res.status(status).json({
    status,
    messge,
    stack: err.stack,
    success: false,
  });
});
