import prisma from "../db/db";

export const createCategory = async (req, res) => {
  const userId = req.user.id;
  const { name } = req.body;
  try {
    const createCategory = await prisma.category.create({
      data: {
        name,
        updatedById: userId
      }
    });

    res.status(201).json(createCategory);
  } catch (error) {
    console.error(error);
  }
}

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error(error);
  }
}

export const getCategory = async (req, res) => {
  const { id } = req.params;
  const category = await prisma.category.findUnique({ where: { id }});
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.json(category);
}

export const updateCategory = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const category = await prisma.category.findUnique({ where: { id }});
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        updatedById: userId
      }
    });

    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
  }
}

export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.findUnique({ where: { id }});
    if(!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const categoryDeleted = await prisma.category.delete({ where: { id }});

    res.json(categoryDeleted);
  } catch (error) {
    console.log(error);
  }
}
