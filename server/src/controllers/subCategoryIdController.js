const SubCategoryId = require("../models/SubCategoryID");
const Organization = require("../models/Organization");

// Create a new subcategory Id
const createSubCategoryId = async (req, res) => {
  const {
    subCategory,
    name,
    description,
    subCode,
    organization,
    isCustom = false,
    status = "active",
  } = req.body;

  try {
    const createdAt = new Date();
    const newSubCategoryId = new SubCategoryId({
      subCategory,
      name,
      description,
      subCode,
      organization,
      isCustom,
      status,
      createdAt,
      updatedAt: createdAt,
    });

    await newSubCategoryId.save();

    res.status(201).json(newSubCategoryId);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all subcategoriesID
const getSubCategoriesID = async (req, res) => {
  try {
    const subcategoriesID = await SubCategoryId.find({ isCustom: false }).sort({
      name: 1,
    });
    res.json(subcategoriesID);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single subcategoryID by ID
const getSubCategoryIdById = async (req, res) => {
  try {
    const subcategoryId = await SubCategoryId.findById(req.params.id);
    if (!subcategoryId) {
      return res.status(404).json({ message: "Sub Category Id not found" });
    }
    res.json(subcategoryId);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get subcategoryID by  Sub category
const getSubCategoryIdBySubCatId = async (req, res) => {
  try {
    const subcategoryId = await SubCategoryId.find({
      subCategory: req.params.subCategoryId,
    });
    if (!subcategoryId || subcategoryId.length === 0) {
      return res.status(200).json([]);
    }

    res.json(subcategoryId);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getSubCategoryIdByOrganization = async (req, res) => {
  const { organizationId } = req.params;

  try {
    const organization = await Organization.findById(organizationId).populate(
      "subCategoriesId"
    );

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const subCategoryIds = await SubCategoryId.find({
      _id: { $in: organization.subCategoriesId },
    }).populate("subCategory");

    if (!subCategoryIds || subCategoryIds.length === 0) {
      return res.status(200).json([]);
    }

    res.json(subCategoryIds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getSubCategoryIdBySubCategoryAndOrganization = async (req, res) => {
  const { subCategory, organizationId } = req.params;

  try {
    const organization = await Organization.findById(organizationId).populate({
      path: "subCategoriesId",
      match: { subCategory },
    });

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const matchingSubCategoryIds = organization.subCategoriesId.filter(
      (subCatId) => subCatId.subCategory.toString() === subCategory
    );

    if (!matchingSubCategoryIds || matchingSubCategoryIds.length === 0) {
      return res.status(200).json([]);
    }

    res.json(matchingSubCategoryIds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a subcategoryId by ID
const updateSubCategoryId = async (req, res) => {
  const {
    subCategory,
    name,
    description,
    subCode,
    isCustom = false,
    status,
  } = req.body;

  try {
    const subcategoryId = await SubCategoryId.findById(req.params.id);
    if (!subcategoryId) {
      return res.status(404).json({ message: "Sub Category not found" });
    }

    const updatedAt = new Date();

    subcategoryId.subCategory = subCategory || subcategoryId.subCategory;
    subcategoryId.name = name || subcategoryId.name;
    subcategoryId.description = description || subcategoryId.description;
    subcategoryId.subCode = subCode || subcategoryId.subCode;
    subcategoryId.isCustom = isCustom || subcategoryId.isCustom;
    subcategoryId.status = status || subcategoryId.status;
    subcategoryId.updatedAt = updatedAt;

    await subcategoryId.save();
    res.json(subcategoryId);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a subcategoryId by ID
const deleteSubCategoryId = async (req, res) => {
  try {
    const subcategoryId = await SubCategoryId.findById(req.params.id);
    if (!subcategoryId) {
      return res.status(404).json({ message: "Sub Category not found" });
    }

    await subcategoryId.deleteOne({ _id: req.params.id });
    res.json({ message: "SubCategoryId removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createSubCategoryId,
  getSubCategoriesID,
  getSubCategoryIdById,
  getSubCategoryIdBySubCatId,
  getSubCategoryIdByOrganization,
  updateSubCategoryId,
  deleteSubCategoryId,
  getSubCategoryIdBySubCategoryAndOrganization,
};
