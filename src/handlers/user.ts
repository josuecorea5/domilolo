import { Request, Response } from "express";
import prisma from "../db/db";
import { comparedPassword, hashPassword } from "../utils/hashPassword";
import { createJWT } from "../utils/createJWT";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    const createUser = await prisma.user.create({
      data: {
        username,
        email,
        password: await hashPassword(password),
        role: "USER"
      }
    })
    res.status(201).json({ message: "user created successfully, singin with your username and password", data: createUser.username});
  } catch (error) {
    console.error(error);
  }
}

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        username
      }
    });

    if(!findUser) {
      return res.status(404).json({ message: "user not found" });
    }

    const isValidPassword = await comparedPassword(password, findUser.password);

    if(!isValidPassword) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const token = createJWT(findUser);

    res.json({ message: "login successful", token });

  } catch (error) {
    console.error(error);
  }
}
