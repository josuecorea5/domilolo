import express from 'express';
import userRoutes from "./routes/user";
import categoryRoutes from "./routes/category";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: "Welcome to domilolo API"});
})

app.use("/api/v1", userRoutes);
app.use("/api/v1", categoryRoutes)

export default app;
