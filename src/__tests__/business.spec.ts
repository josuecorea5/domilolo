import { prismaMock } from "../__mocks__/singleton";
import cloudinary from "../utils/cloudinary";
import { Request, Response } from "express";
import { createBusiness, getBusinesses, getBusiness, updateBusiness, deleteBusiness, updateImageBusiness } from "../handlers/business";

let req: Partial<Request>;
let res = {} as unknown as Response;

jest.mock("../utils/cloudinary", () => ({
  uploader: {
    upload: jest.fn(() => Promise.resolve({ secure_url: "https://test.com" })),
    destroy: jest.fn(() => Promise.resolve({ result: "ok" }))
  },
}))

describe("business.handlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    res.json = jest.fn();
    res.status = jest.fn(() => res);
  })


  describe("get businesses", () => {
    it("should return a list of businesses", async() => {
      const businesses = [
        {
          id: "adsadb1",
          name: "business name",
          description: "business description",
          address: "business address",
          website: "business website",
          image: "business image",
          contacts: [{ phoneNumber: "8876-3212"}],
          categoryId: "adsadb1",
          updatedById: "adsadb1",
          createdAt: new Date(),
          updatedAt: new Date(),
          category: {
            id: "adsadb1",
            name: "business category"
          }
        },
        {
          id: "adsadb2",
          name: "business name",
          description: "business description",
          address: "business address",
          website: "business website",
          image: "business image",
          categoryId: "adsadb2",
          updatedById: "adsadb2",
          contacts: [{ phoneNumber: "8876-3212"}],
          createdAt: new Date(),
          updatedAt: new Date(),
          category: {
            id: "adsadb1",
            name: "business category"
          }
        }
      ];

      prismaMock.business.findMany.mockResolvedValue(businesses);

      await getBusinesses(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(businesses);
    })

    it("should handle error", async () => {
      const consoleErrSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      const error = new Error("Database connection");

      prismaMock.business.findMany.mockRejectedValue(error);

      await getBusinesses(req as Request, res as Response);

      expect(consoleErrSpy).toHaveBeenCalledWith(error);

      consoleErrSpy.mockRestore();
    });
  })

  describe("get business", () => {
    it("should return a business", async() => {
      req = {
        params: {
          id: "adsadb1"
        }
      }
      const business = {
        id: "adsadb1",
        name: "business name",
        description: "business description",
        address: "business address",
        website: "business website",
        image: "business image",
        contacts: [{ phoneNumber: "8876-3212"}],
        categoryId: "adsadb1",
        updatedById: "adsadb1",
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          id: "adsadb1",
          name: "business category"
        }
      };

      prismaMock.business.findUnique.mockResolvedValue(business);

      await getBusiness(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(business);
    })

    it("should return an errror if business is not found", async() => {
      prismaMock.business.findUnique.mockResolvedValue(null);

      await getBusiness(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Business not found"});
    });

    it("should handle error", async () => {
      const consoleErrSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      const error = new Error("Database connection");

      prismaMock.business.findUnique.mockRejectedValue(error);

      await getBusiness(req as Request, res as Response);

      expect(consoleErrSpy).toHaveBeenCalledWith(error);

      consoleErrSpy.mockRestore();
    });
  })

  describe("create business", () => {
    it("should create a business", async () => {
      req = {
        body: {
          name: "business name",
          description: "business description",
          contacts: '[{ "phoneNumber": "8876-3212"}]',
          address: "business address",
          website: "business website",
          categoryId: "adsadb1"
        },
        user: {
          id: "adsadb1"
        }
      } as Partial<Request>;

      req.file = {
        path: "business.png"
      } as Express.Multer.File;

      const category = {
        id: "abcdq123",
        name: "store",
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedById: "adbcssas123"
      }

      const business = {
        id: "adsadb1",
        name: "business name",
        description: "business description",
        address: "business address",
        website: "business website",
        image: "business.png",
        contacts: [{ phoneNumber: "8876-3212"}],
        categoryId: "adsadb1",
        updatedById: "adsadb1",
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          id: "abcdq123",
          name: "business category"
        }
      };

      prismaMock.category.findUnique.mockResolvedValue(category);
      prismaMock.business.create.mockResolvedValue(business);

      await createBusiness(req as Request, res as Response);

      expect(cloudinary.uploader.upload).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(business);
    })

    it("should return an error if category is not found", async() => {
      req = {
        body: {
          name: "business name",
          description: "business description",
          contacts: '[{ "phoneNumber": "8876-3212"}]',
          address: "business address",
          website: "business website",
          categoryId: "abcdq123"
        },
        user: {
          id: "adsadb1"
        }
      } as Partial<Request>;

      prismaMock.category.findUnique.mockResolvedValue(null);

      await createBusiness(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Category not found"});
    });

    it("should handle error", async () => {
      req = {
        params: {
          id: "adsadb1"
        }
      }
      const consoleErrSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      const error = new Error("Database connection");

      prismaMock.business.findUnique.mockRejectedValue(error);

      await getBusiness(req as Request, res as Response);

      expect(consoleErrSpy).toHaveBeenCalledWith(error);

      consoleErrSpy.mockRestore();
    });
  })

  describe("update business", () => {
    it("should update a business", async () => {
      req = {
        body: {
          dataBusiness: {
            contacts: '[{ "phoneNumber": "8876-3212", "phoneNumber": "8876-3212"}]',
          },
          categoryId: "abcdq123"
        },
        params: {
          id: "cdeq123"
        },
        user: {
          id: "adsadb1"
        }
      } as Partial<Request>;

      const business = {
        id: "cdeq123",
        name: "business name",
        description: "business description",
        address: "business address",
        website: "business website",
        image: "business image",
        contacts: [{ phoneNumber: "8876-3212"}],
        categoryId: "adsadb1",
        updatedById: "adsadb1",
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          id: "abcdq123",
          name: "business category"
        }
      };

      const category = {
        id: "abcdq123",
        name: "store",
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedById: "adbcssas123"
      };

      const updatedBusiness = {
        ...business,
        contacts: JSON.parse(req.body.dataBusiness.contacts)
      }

      prismaMock.business.findUnique.mockResolvedValue(business);
      prismaMock.category.findUnique.mockResolvedValue(category);
      prismaMock.business.update.mockResolvedValue(updatedBusiness);
      

      await updateBusiness(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(updatedBusiness);
    })

    it("should return an error if business is not found", async() => {
      req = {
        body: {
          dataBusiness: {
            contacts: '[{ "phoneNumber": "8876-3212", "phoneNumber": "8876-3212"}]',
          },
          categoryId: "abcdq123"
        },
        params: {
          id: "12345"
        },
        user: {
          id: "adsadb1"
        }
      } as Partial<Request>;

      prismaMock.business.findUnique.mockResolvedValue(null);

      await updateBusiness(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Business not found"});
    });

    it("should return an error if category is not found", async() => {
      req = {
        body: {
          dataBusiness: {
            contacts: '[{ "phoneNumber": "8876-3212", "phoneNumber": "8876-3212"}]',
            categoryId: "fghca123"
          }
        },
        params: {
          id: "12345"
        },
        user: {
          id: "adsadb1"
        }
      } as Partial<Request>;

      prismaMock.business.findUnique.mockResolvedValue(null);

      await updateBusiness(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Business not found"});
    });
  })

  describe("update image business", () => {
    it ("should update a business image", async() => {
      req = {
        params: {
          id: "cdeq123"
        },
        user: {
          id: "adsadb1"
        }
      } as Partial<Request>;

      req.file = {
        path: "new-business.png"
      } as Express.Multer.File;

      const business = {
        id: "cdeq123",
        name: "business name",
        description: "business description",
        address: "business address",
        website: "business website",
        image: "business image",
        contacts: [{ phoneNumber: "8876-3212"}],
        categoryId: "adsadb1",
        updatedById: "adsadb1",
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          id: "abcdq123",
          name: "business category"
        }
      };

      const updatedBusiness = {
        ...business,
        image: req.file.path
      }

      prismaMock.business.findUnique.mockResolvedValue(business);
      prismaMock.business.update.mockResolvedValue(updatedBusiness);

      await updateImageBusiness(req as Request, res as Response);

      expect(cloudinary.uploader.upload).toHaveBeenCalled();
      expect(cloudinary.uploader.destroy).toHaveBeenCalled();

      expect(res.json).toHaveBeenCalledWith(updatedBusiness);
    });

    it("should return an error if image is not found", async() => {
      req = {
        params: {
          id: "cdeq123"
        }
      }
      await updateImageBusiness(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "No image uploaded"});
    });

    it("should return an error if business is not found", async() => {
      req = {
        params: {
          id: "pwdq123"
        },
        user: {
          id: "adsadb1"
        }
      } as Partial<Request>;

      req.file = {
        path: "new-business.png"
      } as Express.Multer.File;

      prismaMock.business.findUnique.mockResolvedValue(null);

      await updateImageBusiness(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Business not found"});
    })
  })

  describe("delete business", () => {
    it("should delete a business", async() => {
      req = {
        params: {
          id: "cdeq123"
        }
      }

      const business = {
        id: "cdeq123",
        name: "business name",
        description: "business description",
        address: "business address",
        website: "business website",
        image: "business image",
        contacts: [{ phoneNumber: "8876-3212"}],
        categoryId: "adsadb1",
        updatedById: "adsadb1",
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          id: "abcdq123",
          name: "business category"
        }
      };

      prismaMock.business.findUnique.mockResolvedValue(business);
      prismaMock.business.delete.mockResolvedValue(business);

      await deleteBusiness(req as Request, res as Response);

      expect(cloudinary.uploader.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(business);
    })

    it("should delete a business", async() => {
      req = {
        params: {
          id: "cdeq123"
        }
      }

      prismaMock.business.findUnique.mockResolvedValue(null);

      await deleteBusiness(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Business not found"});
    });
  })
})
