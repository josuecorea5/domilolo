import { Router } from "express";
import { body } from "express-validator";
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory } from "../handlers/category";
import { protectRoutes } from "../middlewares/protectRoutesMiddleware";
import { errorMiddleware } from "../middlewares/errorMiddleware";

const router = Router();

router.get("/categories", getCategories)

router.get("/categories/:id", getCategory)

router.post("/categories", 
  protectRoutes,
  body("name").notEmpty().isLength({ min: 3 }),
  errorMiddleware,
  createCategory)

router.put("/categories/:id",
  protectRoutes,
  body("name").notEmpty().isLength({ min: 3 }),
  updateCategory)

router.delete("/categories/:id", protectRoutes, deleteCategory)

export default router;
