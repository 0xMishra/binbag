import express from "express";
import userRouter from "./routes/userRoutes";
export const app = express();

app.use(express.json());

app.use("/api/v1/user", userRouter);

app.get("/", (_req, res) => {
  res.status(200).json({ message: "user API" });
});
