import { prismaMock } from "../__mocks__/singleton";
import { Request, Response } from "express";
import { createCategory, getCategories, getCategory, updateCategory, deleteCategory } from "../handlers/category";

let req: Partial<Request>;
let res = {} as unknown as Response;

describe("category.handlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    res.json = jest.fn();
    res.status = jest.fn(() => res);
  })

  describe("createCategory", () => {

    it("should create a category", async () => {
      req = {
        user: {
          id: "adbcssas123"
        },
        body: {
          name: "test category"
        }
      } as unknown as Request;
      const category = {
        id: "abc123",
        name: "store",
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedById: "adbcssas123"
      }

      prismaMock.category.create.mockResolvedValue(category);

      await createCategory(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(category);

    })

    it("should handle error", async() => {
      const consoleErrSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      const error = new Error("Database connection");

      prismaMock.category.create.mockRejectedValue(error);

      await createCategory(req as Request, res as Response);

      expect(consoleErrSpy).toHaveBeenCalledWith(error);

      consoleErrSpy.mockRestore();
    })
  })

  describe("get categories", () => {
    const categories = [
      {
        id: "abc123",
        name: "store",
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedById: "adbcssas123"
      },
      {
        id: "abc123",
        name: "restaurant",
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedById: "adbcssas123"
      }
    ];

    it("should get categories", async () => {
      prismaMock.category.findMany.mockResolvedValue(categories);

      await getCategories(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(categories);
    })

    it("should handle error", async () => {
      const consoleErrSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      const error = new Error("Database connection");

      prismaMock.category.findMany.mockRejectedValue(error);

      await getCategories(req as Request, res as Response);

      expect(consoleErrSpy).toHaveBeenCalledWith(error);
      consoleErrSpy.mockRestore();
    })
  })

  describe("get category", () => {
    it("should get a category by id", async () => {
      req = {
        params: {
          id: "abcdq123"
        }
      }
      const category = {
        id: "abcdq123",
        name: "store",
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedById: "adbcssas123"
      };

      const findUnique = prismaMock.category.findUnique.mockResolvedValue(category);

      await getCategory(req as Request, res as Response);

      expect(findUnique).toHaveBeenCalledWith({ where: { "id": req?.params?.id}})

      expect(res.json).toHaveBeenCalledWith(category);
    })

    it("should return an error if category was not found", async() => {
      req = {
        params: {
          id: "abcdq123"
        }
      }
      prismaMock.category.findUnique.mockResolvedValue(null);

      await getCategory(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Category not found"});
    })
  })

  describe("update category", () => {
    it("should update a category", async () => {
      req = {
        user: {
          id: "adbcssas123"
        },
        body: {
          name: "update category"
        },
        params: {
          id: "abcdq123"
        }
      } as Partial<Request>;

      const category = {
        id: "abcdq123",
        name: "store",
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedById: "adbcssas123"
      }

      const categoryUpdated = {
        ...category,
        name: req?.body?.name
      }

      prismaMock.category.findUnique.mockResolvedValue(category);
      prismaMock.category.update.mockResolvedValue(categoryUpdated);

      await updateCategory(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(categoryUpdated);
    })

    it("shuold return an error if category was not found", async() => {
      req = {
        user: {
          id: "adbcssas123"
        },
        body: {
          name: "update category"
        },
        params: {
          id: "12"
        }
      } as Partial<Request>;

      prismaMock.category.findUnique.mockResolvedValue(null);

      await updateCategory(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Category not found"})
    })

    it("should handle error", async () => {
      const consoleErrSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      const error = new Error("Database connection");

      prismaMock.category.findMany.mockRejectedValue(error);

      await getCategories(req as Request, res as Response);

      expect(consoleErrSpy).toHaveBeenCalledWith(error);
      consoleErrSpy.mockRestore();
    })
  })

  describe("delete category", () => {
    it("should delete a category by id", async () => {
      req = {
        params: {
          id: "abcdq123"
        }
      }
      const category = {
        id: "abcdq123",
        name: "store",
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedById: "adbcssas123"
      }

      prismaMock.category.findUnique.mockResolvedValue(category);
      prismaMock.category.delete.mockResolvedValue(category);

      await deleteCategory(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(category);
    })

    it("should return an error if category was not found", async () => {
      req = {
        params: {
          id: "abcdq123"
        }
      }
      prismaMock.category.findUnique.mockResolvedValue(null);

      await deleteCategory(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Category not found"});
    })
  })
})
