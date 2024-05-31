import { Router } from "express";
import { createUser, loginUser } from "../handlers/user";

const router = Router();

router.post("/signup", createUser)
router.post("/login", loginUser)

export default router;