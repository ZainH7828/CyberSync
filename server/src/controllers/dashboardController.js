const User = require("../models/User");
const Organization = require("../models/Organization");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const Task = require("../models/Task");
const SubTask = require("../models/SubTask");

// Helper function to populate assignees
const populateAssignees = async (assignees) => {
  const users = await User.find({ _id: { $in: assignees } }, "name");
  return users.map((user) => ({ _id: user._id, name: user.name }));
};

// Create a new framework
const home = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const organization = await Organization.findById(
      user.organization
    ).populate("categories");

    const isCompanyAdmin = user.role === "company-admin";

    const getSubTasks = async (taskId) => {
      const subTasks = await SubTask.find({ taskId });
      return Promise.all(
        subTasks.map(async (subTask) => {
          const populatedAssignees = await populateAssignees(subTask.assignees);
          return { ...subTask.toObject(), assignees: populatedAssignees };
        })
      );
    };

    const getTasksWithSubTasks = async (subcategoryTasks) => {
      return Promise.all(
        subcategoryTasks.map(async (task) => {
          const subTasks = await getSubTasks(task._id);
          const populatedAssignees = await populateAssignees(task.assignees);
          return {
            ...task.toObject(),
            assignees: populatedAssignees,
            subTasks,
          };
        })
      );
    };

    let subcategories;
    let tasks;

    if (isCompanyAdmin) {
      subcategories = await SubCategory.find({
        _id: { $in: organization.subCategories },
      });
      tasks = await Task.find({ organization: organization._id }).populate('subCategoriesId');
    } else {
      subcategories = await SubCategory.find({
        _id: { $in: user.subCategories },
      });

      tasks = await Task.find({
        $and: [
          { organization: organization._id },
          { $or: [{ createdBy: user._id }, { assignees: user._id }] },
        ],
      }).populate('subCategoriesId');;
    }

    const result = {
      categories: await Promise.all(
        organization.categories.map(async (category) => {
          const categorySubcategories = subcategories.filter(
            (subcategory) =>
              subcategory.category.toString() === category._id.toString()
          );
          const categoryTasks = await Promise.all(
            categorySubcategories.map(async (subcategory) => {
              const subcategoryTasks = tasks.filter(
                (task) =>
                  task.subCategory.toString() === subcategory._id.toString()
              );
              const tasksWithSubTasks = await getTasksWithSubTasks(
                subcategoryTasks
              );
              return { ...subcategory.toObject(), tasks: tasksWithSubTasks };
            })
          );
          return {
            ...category.toObject(),
            subCategory: categoryTasks.length > 0 ? categoryTasks : undefined,
          };
        })
      ).then((categoriesWithTasks) =>
        categoriesWithTasks.filter((category) => category.subCategory)
      ),
    };

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  home,
};
