const User = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("../emailService");
const SubCategory = require("../models/SubCategory");
const mongoose = require("mongoose");
// Create a new user
const createUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const createdAt = new Date();
    const newUser = new User({
      email,
      password,
      createdAt,
      updatedAt: createdAt,
    });

    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ updatedAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Sub Category not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update an user by ID
const updateUser = async (req, res) => {
  const { name, email, status, role, rights, subCategories } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Sub Category not found" });
    }

    const updatedAt = new Date();

    user.name = name || user.name;
    user.email = email || user.email;
    user.status = status || user.status;
    user.role = role || user.role;
    user.rights = rights || user.rights;
    user.subCategories = subCategories || user.subCategories;
    user.createdAt = user.createdAt;
    user.updatedAt = updatedAt || user.updatedAt;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete an user by ID
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Sub Category not found" });
    }

    await User.deleteOne({ _id: req.params.id });
    res.json({ message: "User removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const inviteUserIntoOrganization = async (req, res) => {
  const {
    name = null,
    email = null,
    role = null,
    rights = null,
    organization = null,
  } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const createdAt = new Date();
    const dummyPassword = crypto.randomBytes(8).toString("hex");
    const newUser = new User({
      name: name,
      email: email,
      password: dummyPassword,
      role: role,
      rights: rights,
      organization: organization,
      createdAt: createdAt,
      updatedAt: createdAt,
    });

    await newUser.save();

    // Send email with dummy password
    const subject = "Welcome to MICT";
    const text = `Dear ${name},\n\nYou've been added to organization.\n\nPlease use the following password to log in for the first time: ${dummyPassword}\n\nThank you!`;
    sendEmail(email, subject, text);

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const fetchUserByOrganization = async (req, res) => {
  try {
    const users = await User.find({ organization: req.params.id });
    if (!users) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const fetchUserByOrganizationAndSubCategory = async (req, res) => {
  const { organizationId, subCategoryId } = req.params;

  // Validate ObjectIDs
  if (
    !mongoose.Types.ObjectId.isValid(organizationId) ||
    !mongoose.Types.ObjectId.isValid(subCategoryId)
  ) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    // Convert IDs to ObjectID type
    const orgId = new mongoose.Types.ObjectId(organizationId);
    const subCatId = new mongoose.Types.ObjectId(subCategoryId);

    const users = await User.find({
      organization: orgId,
      subCategories: { $in: [subCatId] },
    });

    if (!users || users.length === 0) {
      return res.status(200).json([]);
    }

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const addCategoriesToUsers = async (req, res) => {
  const { assignation } = req.body;
  try {
    if (!Array.isArray(assignation) || assignation.length === 0) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    for (let item of assignation) {
      const { userID, subCategoryID } = item;

      if (!userID || !subCategoryID) {
        return res
          .status(400)
          .json({ error: "Missing userID or subCategoryID" });
      }

      // const subCategory = await SubCategory.findOne({ subCategoryID });
      // if (!subCategory) {
      //   return res.status(404).json({ error: `SubCategory ${subCategoryID} not found` });
      // }

      // Update the user document
      await User.findOneAndUpdate(
        { _id: userID },
        { $addToSet: { subCategories: subCategoryID } },
        { upsert: true }
      );
    }

    res.status(200).json({ message: "Subcategories added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

const removeCategoriesFromUsers = async (req, res) => {
  const { assignation } = req.body;
  try {
    if (!Array.isArray(assignation) || assignation.length === 0) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    for (let item of assignation) {
      const { userID, subCategoryID } = item;

      if (!userID || !subCategoryID) {
        return res
          .status(400)
          .json({ error: "Missing userID or subCategoryID" });
      }

      // const subCategory = await SubCategory.findOne({ subCategoryID });
      // if (!subCategory) {
      //   return res.status(404).json({ error: `SubCategory ${subCategoryID} not found` });
      // }

      // Update the user document
      await User.findOneAndUpdate(
        { _id: userID },
        { $pull: { subCategories: subCategoryID } }
      );
    }

    res.status(200).json({ message: "Subcategories removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  inviteUserIntoOrganization,
  fetchUserByOrganization,
  fetchUserByOrganizationAndSubCategory,
  addCategoriesToUsers,
  removeCategoriesFromUsers,
};
