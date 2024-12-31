const Category = require("../models/Category");

// Create a new category
const createCategory = async (req, res) => {
  const {
    name,
    colorCode,
    code,
    status,
    framework,
    displayorder,
    isCustom = false,
  } = req.body;

  try {
    const createdAt = new Date();
    const newCategory = new Category({
      framework,
      name,
      colorCode,
      code,
      status,
      isCustom,
      displayorder,
      createdAt,
      updatedAt: createdAt,
    });

    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create multiple categories
const createMultipleCategories = async (req, res) => {
  const categories = req.body.categories;

  try {
    const createdCategories = [];
    for (const categoryData of categories) {
      const {
        name,
        colorCode,
        code,
        status,
        framework,
        displayorder,
        isCustom = false,
      } = categoryData;

      const createdAt = new Date();
      const newCategory = new Category({
        framework,
        name,
        colorCode,
        code,
        status,
        isCustom,
        displayorder,
        createdAt,
        updatedAt: createdAt,
      });

      await newCategory.save();
      createdCategories.push(newCategory);
    }

    res.status(201).json(createdCategories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isCustom: false }).sort({
      updatedAt: -1,
    });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a category by ID
const updateCategory = async (req, res) => {
  const {
    name,
    colorCode,
    code,
    status,
    framework,
    displayorder,
    isCustom = false,
  } = req.body;

  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updatedAt = new Date();

    category.framework = framework || category.framework;
    category.name = name || category.name;
    category.colorCode = colorCode || category.colorCode;
    category.code = code || category.code;
    category.status = status || category.status;
    category.displayorder = displayorder || category.displayorder;
    category.isCustom = isCustom || category.isCustom;
    category.updatedAt = updatedAt;

    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await Category.deleteOne({ _id: req.params.id });
    res.json({ message: "Category removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createCategory,
  createMultipleCategories,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
