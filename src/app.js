require("dotenv").config();
require("express-async-errors");
require("./utils/scheduleTasks"); // if you dont add this scheduleTask cannot work ,if you like pray nothing for you but error

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
//pakages
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

// database
const connectDB = require("./database/connect");
//middleware
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");
const { webhook } = require("./controllers/paymentController");
//routes
const authRouter = require("./routes/authRoutes");
const taskRouter = require("./routes/taskRoutes");
const paymentRouter = require("./routes/paymentRoutes");

app.post(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }),
  webhook
);

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.JWT_SECRET));

app.use(morgan("dev"));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/task", taskRouter);
app.use("/api/v1/payment", paymentRouter);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(PORT, console.log(`app is listening on port ${PORT}...`));
  } catch (error) {
    console.log("Failed to connect to database", error);
  }
};
const now = new Date(Date.now());
console.log(now);
start();
