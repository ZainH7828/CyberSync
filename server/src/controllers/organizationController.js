const Organization = require("../models/Organization");
const User = require("../models/User"); // Assuming you have a User model
const crypto = require("crypto");
const sendEmail = require("../emailService");
const SubCategory = require("../models/SubCategory");

// Create a new organization
const createOrganization = async (req, res) => {
  const { name, email, status, licensePeriod, licenseEndDate } = req.body;

  try {
    const existingOrganization = await Organization.findOne({ email });
    if (existingOrganization) {
      return res.status(400).json({ message: "Email is already taken" });
    }

    const createdAt = new Date();
    const newOrganization = new Organization({
      name,
      email,
      status,
      licensePeriod,
      licenseEndDate,
      createdAt,
      updatedAt: createdAt,
    });

    await newOrganization.save();

    // Generate a dummy password
    const dummyPassword = crypto.randomBytes(8).toString("hex");

    // Hash the dummy password
    // const hashedPassword = await bcrypt.hash(dummyPassword, 10);

    const newUser = new User({
      name: name,
      email,
      password: dummyPassword,
      role: "company-admin",
      rights: {
        category: {
          add: true,
          edit: true,
        },
        task: {
          add: true,
          edit: true,
        },
        targetScore: [],
        downloadReport: true,
        manageTeam: true,
      },
      organization: newOrganization.id,
    });
    await newUser.save();

    // Send email with dummy password
    const subject = "Welcome to MICT";
    const text = `Dear ${name},\n\nYour organization has been created.\n\nPlease use the following password to log in for the first time: ${dummyPassword}\n\nThank you!`;
    sendEmail(email, subject, text);

    res.status(201).json(newOrganization);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all organizations
const getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find().sort({ updatedAt: -1 });
    res.json(organizations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single organization by ID
const getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }
    res.json(organization);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update an organization by ID
const updateOrganization = async (req, res) => {
  const {
    setupCompleted = false,
    name = null,
    email = null,
    framework = null,
    module = null,
    categories = null,
    subCategories = null,
    subCategoriesId = null,
    targetScore = [],
    status = null,
  } = req.body;

  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const updatedAt = new Date();

    organization.setupCompleted = setupCompleted || organization.setupCompleted;
    organization.name = name || organization.name;
    organization.email = email || organization.email;
    organization.framework = framework || organization.framework;
    organization.module = module || organization.module;
    organization.categories = categories || organization.categories;
    organization.subCategories = subCategories || organization.subCategories;
    organization.subCategoriesId =
      subCategoriesId || organization.subCategoriesId;
    organization.targetScore = targetScore || organization.targetScore;
    organization.status = status || organization.status;
    organization.createdAt = organization.createdAt;
    organization.updatedAt = updatedAt || organization.updatedAt;

    await organization.save();
    res.json(organization);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getCategoriesByOrgId = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.orgId)
      .populate("categories")
      .exec();

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.json(organization.categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getSubCategoriesByOrgId = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.orgId)
      .populate("subCategories")
      .exec();

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.json(organization.subCategories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const addSubCategoriesToOrg = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { subCategoryId } = req.body;
    const userId = req.user._id;

    if (!subCategoryId) {
      return res.status(400).json({ message: "subCategoryId is required" });
    }

    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    if (!organization.subCategories.includes(subCategoryId)) {
      organization.subCategories.push(subCategoryId);
    }

    const user = await User.findById(userId);
    if (user.role !== "company-admin") {
      if (!user.subCategories.includes(subCategoryId)) {
        user.subCategories.push(subCategoryId);
      }
      await user.save();
    }

    await organization.save();

    res.status(200).json(organization);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteSubCategoryFromOrg = async (req, res) => {
  try {
    const { orgId, subCategoryId } = req.params;
    const userId = req.user._id;

    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const subCategoryIdString = subCategoryId.toString();
    organization.subCategories = organization.subCategories.filter(
      (id) => id.toString() !== subCategoryIdString
    );

    const remainingSubCategories = await SubCategory.find({
      _id: { $in: organization.subCategories },
    }).distinct("category");

    const categoryMap = new Map();
    for (const categoryId of remainingSubCategories) {
      categoryMap.set(categoryId.toString(), true);
    }

    organization.categories = organization.categories.filter((categoryId) => {
      return categoryMap.has(categoryId.toString());
    });

    await User.updateMany(
      { organization: orgId },
      { $pull: { subCategories: subCategoryIdString } }
    );

    await organization.save();

    res.status(200).json({ message: "SubCategory removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateOrganizationCompleted = async (req, res) => {
  const {
    name = null,
    email = null,
    framework = null,
    module = null,
    categories = null,
    subCategories = null,
    status,
  } = req.body;

  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    organization.setupCompleted = true;
    organization.name = organization.name;
    organization.email = organization.email;
    organization.status = organization.status;
    organization.createdAt = organization.createdAt;
    organization.updatedAt = organization.updatedAt;

    await organization.save();
    res.json(organization);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteOrganization = async (req, res) => {
  const { id } = req.params;

  try {
    const organization = await Organization.findById(id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }
    await User.deleteMany({ organization: id });

    await Organization.deleteOne({ _id: req.params.id });

    res.status(200).json({
      message: "Organization and associated users removed successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const addSubCategoryIdToOrg = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { subCategoryId } = req.body;
    const userId = req.user._id;

    if (!subCategoryId) {
      return res.status(400).json({ message: "subCategoryId is required" });
    }

    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    if (!organization.subCategoriesId.includes(subCategoryId)) {
      organization.subCategoriesId.push(subCategoryId);
    }

    const user = await User.findById(userId);
    if (user.role !== "company-admin") {
      if (!user.subCategories.includes(subCategoryId)) {
        user.subCategories.push(subCategoryId);
      }
      await user.save();
    }

    await organization.save();

    res.status(200).json(organization);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getSubCategoryIDByOrgId = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.orgId)
      .populate("subCategoriesId")
      .exec();

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.json(organization.subCategoriesId);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  getSubCategoriesByOrgId,
  addSubCategoriesToOrg,
  deleteSubCategoryFromOrg,
  getCategoriesByOrgId,
  updateOrganizationCompleted,
  deleteOrganization,
  getSubCategoryIDByOrgId,
  addSubCategoryIdToOrg,
};
