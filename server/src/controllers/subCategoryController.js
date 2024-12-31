const SubCategory = require("../models/SubCategory");

// Create a new subcategory
const createSubCategory = async (req, res) => {
  const {
    category,
    name,
    code,
    subCatCode,
    organization,
    isCustom = false,
    description,
    status = "active",
  } = req.body;

  try {
    const createdAt = new Date();
    const newSubCategory = new SubCategory({
      category,
      name,
      code,
      subCatCode,
      organization,
      isCustom,
      status,
      description,
      createdAt,
      updatedAt: createdAt,
    });

    await newSubCategory.save();

    res.status(201).json(newSubCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create multiple subcategories
const createMultipleSubCategories = async (req, res) => {
  const subcategories = req.body.subcategories;

  try {
    const createdSubCategories = [];
    for (const subCategoryData of subcategories) {
      const {
        category,
        name,
        code,
        subCatCode,
        organization,
        isCustom = false,
      } = subCategoryData;
      const status = "active";

      const createdAt = new Date();
      const newSubCategory = new SubCategory({
        category,
        name,
        code,
        subCatCode,
        organization,
        isCustom,
        status,
        createdAt,
        updatedAt: createdAt,
      });

      await newSubCategory.save();
      createdSubCategories.push(newSubCategory);
    }

    res.status(201).json(createdSubCategories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all subcategories
const getSubCategories = async (req, res) => {
  try {
    const subcategories = await SubCategory.find({ isCustom: false }).sort({
      name: 1,
    });
    res.json(subcategories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single subcategory by ID
const getSubCategoryById = async (req, res) => {
  try {
    const subcategory = await SubCategory.findById(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ message: "Sub Category not found" });
    }
    res.json(subcategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a subcategory by ID
const updateSubCategory = async (req, res) => {
  const {
    category,
    name,
    code,
    subCatCode,
    organization,
    description,
    isCustom = false,
    status,
  } = req.body;

  try {
    const subcategory = await SubCategory.findById(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ message: "Sub Category not found" });
    }

    const updatedAt = new Date();

    subcategory.category = category || subcategory.category;
    subcategory.name = name || subcategory.name;
    subcategory.code = code || subcategory.code;
    subcategory.subCatCode = subCatCode || subcategory.subCatCode;
    subcategory.organization = organization || subcategory.organization;
    subcategory.description = description || subcategory.description;
    subcategory.isCustom = isCustom || subcategory.isCustom;
    subcategory.status = status || subcategory.status;
    subcategory.updatedAt = updatedAt;

    await subcategory.save();
    res.json(subcategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a subcategory by ID
const deleteSubCategory = async (req, res) => {
  try {
    const subcategory = await SubCategory.findById(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ message: "Sub Category not found" });
    }

    await SubCategory.deleteOne({ _id: req.params.id });
    res.json({ message: "SubCategory removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createSubCategory,
  createMultipleSubCategories,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
};
