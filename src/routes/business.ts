import { Router } from "express";
import upload from "../middlewares/multer";
import { createBusiness, deleteBusiness, getBusiness, getBusinesses, updateBusiness, updateImageBusiness } from "../handlers/business";
import { body } from "express-validator";
import { errorMiddleware } from "../middlewares/errorMiddleware";
import { contactValidator } from "../validators/contactsValidator";
import { protectRoutes } from "../middlewares/protectRoutesMiddleware";

const router = Router();

router.get("/businesses", getBusinesses);

router.get("/businesses/:id", getBusiness)

router.post("/businesses",
  protectRoutes,
  upload.single("image"), 
  body("name").notEmpty(),
  body("description").notEmpty().isLength({ min: 5}),
  body("contacts").custom(contactValidator),
  body("address").notEmpty().isString().isLength({ min: 5}),
  body("website").notEmpty(),
  body("categoryId").isMongoId(),
  errorMiddleware,
  createBusiness);

router.put(
  "/businesses/:id",
  protectRoutes,
  body("name").optional().isString(),
  body("description").optional().isLength({ min: 5}),
  body("contacts").optional().custom(contactValidator),
  body("address").optional().isString().isLength({ min: 5}),
  body("website").optional().isString(),
  body("categoryId").optional().isMongoId(),
  errorMiddleware,
  updateBusiness
)

router.put(
  "/businesses/upload/:id",
  protectRoutes,
  upload.single("image"),
  updateImageBusiness
);

router.delete(
  "/businesses/:id",
  protectRoutes,
  deleteBusiness
);

export default router;
