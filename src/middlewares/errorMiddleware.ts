import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { validationResult } from "express-validator";

export const errorMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export const errorHandler = (err, req, res, next) => {
    if(err instanceof multer.MulterError) {
      res.status(400).json({ message: err.message });
    }else if (err.message === "Unexpected end of form") {
      res.status(400).json({ message: "No file uploaded"})
    }
    else {
      res.status(500).json({ message: err.message})
    }
}
