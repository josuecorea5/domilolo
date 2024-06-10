import { prismaMock } from "../__mocks__/singleton";
import { hashPassword, comparedPassword } from "../utils/hashPassword";
import { createJWT } from "../utils/createJWT";
import { createUser, loginUser } from "../handlers/user";
import { Request, Response } from "express";

let req: Partial<Request>
let res = {} as unknown as Response;

jest.mock("../utils/hashPassword", () => ({
  hashPassword: jest.fn((password) => `hashed${password}`),
  comparedPassword: jest.fn((password, hashedPassword) => password === hashedPassword)
}))
jest.mock("../utils/createJWT", () => ({
  createJWT: jest.fn(() => "dsada21312asda")
}))


describe("user.handlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    res.json = jest.fn();
    res.status = jest.fn(() => res)
  })

  describe("createUser", () => {
    req = {
      body: {
        username: "usernametest", 
        password: "password", 
        email: "test@test.com" 
      }
    }

    it("should create a user", async () => {

      const newUser = {
          id: "adsadb1",
          email: "test@test.com",
          username: "usernametest",
          role: "USER",
          password: "password",
          createdAt: new Date(),
          updatedAt: new Date()
      }

      prismaMock.user.create.mockResolvedValue(newUser);

      await createUser(req as Request, res as Response);
      expect(hashPassword).toHaveBeenCalledWith(req.body.password);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: "user created successfully, singin with your username and password", data: newUser.username});
    })

    it("should handle error", async () => {
      const consoleErrSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      const error = new Error("Database connection");

      prismaMock.user.create.mockRejectedValue(error);

      await createUser(req as Request, res as Response);

      expect(consoleErrSpy).toHaveBeenCalledWith(error);

      consoleErrSpy.mockRestore();
    })

  })

  describe("loginUser", () => {
    req = {
      body: {
        username: "usernametest",
        password: "hashedpassword"
      }
    }
    
    it("should login user", async () => {

      const user = {
        id: "adsadb1",
        email: "test@test.com",
        username: "usernametest",
        role: "USER",
        password: "hashedpassword",
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const token = "dsada21312asda";

      prismaMock.user.findUnique.mockResolvedValue(user);

      await loginUser(req as Request, res as Response);

      expect(comparedPassword).toHaveReturnedWith(true);
      expect(createJWT).toHaveBeenCalledWith(user);
      expect(res.json).toHaveBeenCalledWith({ message: "login successful", token})
    })

    it("should return a message if user was not found", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await loginUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "user not found"});
    })


    it("should return a message when credentials are wrong", async() => {
      const user = {
        id: "adsadb1",
        email: "test@test.com",
        username: "usernametest",
        role: "USER",
        password: "passwordwrong",
        createdAt: new Date(),
        updatedAt: new Date()
      }

      prismaMock.user.findUnique.mockResolvedValue(user);

      await loginUser(req as Request, res as Response);

      expect(comparedPassword).toHaveReturnedWith(false);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({message: "invalid credentials"});
    });

    it("should handle error", async () => {
      const consoleErrSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      const error = new Error("Database connection");

      prismaMock.user.create.mockRejectedValue(error);

      await createUser(req as Request, res as Response);

      expect(consoleErrSpy).toHaveBeenCalledWith(error);

      consoleErrSpy.mockRestore();
    })
  })
})
