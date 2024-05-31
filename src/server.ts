import express from 'express';
import userRoutes from "./routes/user";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: "Welcome to domilolo API"});
})

app.use("/api/v1", userRoutes);

export default app;