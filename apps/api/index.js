import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import userRoutes from "./router/userRouter.js";
import productRoutes from "./router/productRouter.js";
import orderRoutes from "./router/orderRouter.js";
import reviewRoutes from "./router/reviewRoute.js";
import flashSaleRoutes from "./router/flashSaleRouter.js";
import chatRoutes from "./router/chatRouter.js";
import errorHandler from "./middleware/errorHandler.js";
import dbConnect from "./config/dbConnect.js";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import qs from "qs";
import cookieParser from 'cookie-parser';

import dashboardRoute from "./router/dashboardRouter.js";
import stripeRoutes from "./router/stripeRouter.js";

dotenv.config();

const app = express();
app.set('trust proxy', 1); // trust first proxy (Replit, Heroku, etc.)
const port = process.env.PORT || 3001;

dbConnect();

// Cấu hình CORS
const corsOptions = {
  origin: [
    'http://localhost:3000', 
    'http://localhost:3002', 
    'https://shoe-store--ysnef.replit.app'
  ],
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

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "data:", "res.cloudinary.com"],
        "connect-src": ["'self'", "api.stripe.com"],
      },
    },
  })
);

app.use(morgan("dev"));

app.use("/api/dashboard", dashboardRoute);
app.use("/api/users", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/flash-sale", flashSaleRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/chat", chatRoutes);

app.use(errorHandler);

// deployment
app.use('/admin', express.static(path.resolve(__dirname, '../admin/dist')));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../admin/dist', 'index.html'));
});

app.use('/', express.static(path.resolve(__dirname, '../web/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../web/dist', 'index.html'));
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
