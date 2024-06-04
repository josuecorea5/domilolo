import express from "express";
import userRoutes from "./routes/user";
import categoryRoutes from "./routes/category";
import businessRoutes from "./routes/business";
import { errorHandler } from "./middlewares/errorMiddleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: "Welcome to domilolo API"});
})

app.use("/api/v1", userRoutes);
app.use("/api/v1", categoryRoutes)
app.use("/api/v1", businessRoutes);

app.use(errorHandler)

export default app;
