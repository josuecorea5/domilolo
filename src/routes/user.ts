import { Router } from "express";
import { createUser, loginUser } from "../handlers/user";
import { body } from "express-validator";
import { errorMiddleware } from "../middlewares/errorMiddleware";

const router = Router();

router.post(
  "/signup",
  body("email").isEmail(),
  body("username").notEmpty().isLength({ min: 5 }),
  body("password").notEmpty().isLength({ min: 8 }),
  errorMiddleware,
  createUser)

router.post("/login", 
  body("username").notEmpty().isLength({ min: 5 }),
  body("password").notEmpty().isLength({ min: 8 }),
  errorMiddleware,
  loginUser)

export default router;
