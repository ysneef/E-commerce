import express from "express";
import userRoutes from "./router/userRouter.js";
import productRoutes from "./router/productRouter.js";
import orderRoutes from "./router/orderRouter.js";
import reviewRoutes from "./router/reviewRoute.js";
import errorHandler from "./middleware/errorHandler.js";
import dbConnect from "./config/dbConnect.js";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import qs from "qs";
import cookieParser from 'cookie-parser';

import dashboardRoute from "./router/dashboardRouter.js";


const app = express();
const port = process.env.PORT || 3001;

dbConnect();

// Cấu hình CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use((req, res, next) => {
  const urlParts = req.url.split("?");
  if (urlParts.length > 1) {
    req.query = qs.parse(urlParts[1]);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(helmet());
app.use(morgan("dev"));

app.use("/api/dashboard", dashboardRoute);

app.use("/api/users", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(errorHandler);

// Khởi động server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
