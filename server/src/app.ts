import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import passport from "passport";

import authRoutes from "./modules/auth/auth.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import groupRoutes from "./modules/groups/group.routes.js";
import expenseRoutes from "./modules/expense/expense.routes.js";
import expenseSharesRoutes from "./modules/expense-shares/expense-shares.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(morgan("dev"));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/groups", groupRoutes);
app.use("/api/v1/expenses", expenseRoutes);
app.use("/api/v1/expense-shares", expenseSharesRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.post("/test", (_req, res) => {
  res.json({
    ok: true,
  });
});

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "THIS IS THE NEW HEALTH ROUTE",
  });
});

app.use(errorHandler);

export default app;
