const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectToDB = require("./src/config/db"); // Import the db connection function
const morgan = require("morgan");
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));

const authRouter = require("./src/routes/authRoute");
const postRouter = require("./src/routes/postRoutes");

const {auth} = require("./src/middleware/authMiddleware")

app.use("/api/auth", authRouter);
app.use("/api/posts",auth, postRouter);

app.listen(PORT, async () => {
  console.log(`server Start on Port ${PORT}`);
  try {
    await connectToDB();
  } catch (err) {
    console.log(err);
    app.use((req, res) => {
      res.status(500).json({
        message: "Database connection failed. Please try again later.",
      });
      //process.exit(1);
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "404 not found",
    status: 404,
  });
});
// Global error handler
app.use((err, req, res, next) => {
  const status = err?.status || 500;
  const message = err?.message || "Internal Server Error";
  res.status(status).json({ message, status });
});
