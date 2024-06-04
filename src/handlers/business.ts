import cloudinary from "../utils/cloudinary"
import prisma from "../db/db";
import path from "path";

export const getBusinesses = async (req, res) => {
  try {
    const businesses = await prisma.business.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        website: true,
        image: true,
        contacts: true,
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    res.json(businesses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message })
  }
}

export const getBusiness = async (req, res) => {
  const { id } = req.params;
  try {
    const business = await prisma.business.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        website: true,
        image: true,
        contacts: true,
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if(!business) {
      return res.status(404).json({ message: "Business not found"});
    }

    res.json(business)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

export const createBusiness = async(req, res) => {
  const { name, description, contacts, address, website, categoryId} = req.body;
  const userId = req.user.id;
  const listOfContacts = JSON.parse(contacts);
  const findCategory = await prisma.category.findUnique({
    where: {
      id: categoryId
    }
  })

  if(!findCategory) {
    return res.status(404).json({ message: "Category not found"});
  }

  try {
    const response = await cloudinary.uploader.upload(req.file.path, { folder: "domilolo"});
    
    const createBusiness = await prisma.business.create({
      data: {
        name,
        description,
        contacts: listOfContacts,
        address,
        website,
        categoryId,
        updatedById: userId,
        image: response.secure_url
      }
    });

    return res.status(201).json(createBusiness);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message })
  }
}

export const updateBusiness = async(req, res) => {
  const dataBusiness = req.body;
  const businessId = req.params.id;
  const updatedById = req.user.id;

  const findBusiness = await prisma.business.findUnique({
    where: {
      id: businessId
    }
  });

  const findCategory = await prisma.category.findUnique({
    where: {
      id: findBusiness.categoryId
    }
  });

  if(!findBusiness) {
    return res.status(404).json({ message: "Business not found"});
  }

  if(!findCategory) {
    return res.status(404).json({ message: "Category not found"});
  }

  if(dataBusiness.contacts) {
    dataBusiness.contacts = JSON.parse(dataBusiness.contacts);
  }

  try {
    const updateBusiness = await prisma.business.update({
      where: {
        id: businessId,
      },
      data: {
        ...dataBusiness,
        updatedById
      }
    });

    res.json(updateBusiness);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });    
  }
}

export const updateImageBusiness = async (req, res) => {
  if(!req.file) {
    return res.status(400).json({ message: "No image uploaded"})
  }
  const businessId = req.params.id;
  const updatedById = req.user.id;
  const findBusiness = await prisma.business.findUnique({
    where: {
      id: businessId
    }
  });

  if(!findBusiness) {
    return res.status(404).json({ message: "Business not found"});
  }

  try {
    const newImage = await cloudinary.uploader.upload(req.file.path, { folder: "domilolo"});

    const oldImage = path.parse(findBusiness.image).name;
    
    const updateBusinessImage = await prisma.business.update({
      where: {
        id: businessId
      },
      data: {
        image: newImage.secure_url,
        updatedById
      }
    });
    
    await cloudinary.uploader.destroy(oldImage);
    
    res.json(updateBusinessImage);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message })
  }
}

export const deleteBusiness = async (req, res) => {
  const id = req.params.id;

  const findBusiness = await prisma.business.findUnique({
    where: {
      id
    }
  });

  if(!findBusiness) {
    return res.status(404).json({ message: "Business not found"});
  }

  const imageUrl = path.parse(findBusiness.image).name;

  try {
    const deleteBusiness = await prisma.business.delete({
      where: {
        id
      }
    });
    await cloudinary.uploader.destroy(imageUrl);
    res.json(deleteBusiness)
  } catch (error) {
    console.error(error);
  }
}
