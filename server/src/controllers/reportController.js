const ExcelJS = require("exceljs");
const Organization = require("../models/Organization");
const User = require("../models/User");
const Task = require("../models/Task");
const SubCategory = require("../models/SubCategory");
const Category = require("../models/Category");
const { ObjectId } = require('mongodb');

const infoReport = async (req, res) => {
  const { organizationId } = req.params;
  const org = await Organization.findById(organizationId).populate(
    "categories subCategories"
  );
  if (!org) {
    return res.status(404).json({ message: "Organization not found" });
  }
  const user = await User.find({
    organization: organizationId,
  }, { _id: 1, name: 1 })

  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  res.json({
    framework: org.categories,
    category: org.subCategories,
    user
  });

}

const downloadReportExcel = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { status, user, fromDate, toDate, subcategory } = req.body
    // const fileName = `${organizationId}_${Date.now()}.xlsx`;

    // const user = ["66a72f67d567f521a4602285"];
    // const status = "ALL"
    // const status = ["in-progress" ]
    // {
    //     organization: organizationId,
    //     createdAt:{$gte:new Date('2024-01-05'),$lt:new Date('2024-11-05')},
    //     createdBy:{$in : [new ObjectId('66a72f67d567f521a4602285')]},
    //     subCategory:{$in : [new ObjectId('66e82b6af8a20475dc57e606')]} 
    // }
    let query = ""

    if (status == "ALL") {
      query = {
        organization: new ObjectId(organizationId),  // Filter tasks by organization (ObjectId reference)
        createdAt: { $gte: new Date(fromDate), $lt: new Date(toDate) },
        createdBy: { $in: user.map(item => new ObjectId(item)) },
        subCategory: { $in: subcategory.map(item => new ObjectId(item)) },

      }
    } else {
      query = {
        organization: new ObjectId(organizationId),  // Filter tasks by organization (ObjectId reference)
        createdAt: { $gte: new Date(fromDate), $lt: new Date(toDate) },
        createdBy: { $in: user.map(item => new ObjectId(item)) },
        status: { $in: status },
        subCategory: { $in: subcategory.map(item => new ObjectId(item)) },
      }
    }

    // Aggregation pipeline to categorize tasks by subCategory and return task details
    const tasks = await Task.aggregate([
      {
        $match: {
          ...query
        }
      },
      // Lookup to join tasks with the subCategory collection
      {
        $lookup: {
          from: 'subcategories',   // Mongoose automatically pluralizes the model name, so it would be 'subcategories'
          localField: 'subCategory',  // Field in the 'tasks' collection
          foreignField: '_id',        // Field in the 'subCategories' collection
          as: 'subCategoryDetails'    // Name of the field to store the joined subcategory details
        }
      },
      {
        $unwind: "$subCategoryDetails"  // Unwind the subCategoryDetails array to flatten the structure
      },
      {
        $lookup: {
          from: 'users',  // Assuming the collection for users is named 'users'
          localField: 'createdBy',  // Field in the 'tasks' collection (reference to the user)
          foreignField: '_id',      // Field in the 'users' collection
          as: 'createdByDetails'    // Output field to store the user details
        }
      },
      {
        $unwind: "$createdByDetails"  // Unwind the createdByDetails array to flatten the structure
      },
      // Group by subCategory and push task details into an array
      {
        $group: {
          _id: "$subCategory",  // Group by subCategory (ObjectId)
          subCategoryId: { $first: "$subCategoryDetails._id" },  // Get the _id of the subCategory
          CategoryName: { $first: "$subCategoryDetails.name" },  // Get the subCategory name
          tasks: {
            $push: {  // Push each task's details into an array
              item: "$name",  // Task name
              dueDate: "$due_date",  // Task due date
              status: "$status",  // Task status,
              participant: "$createdByDetails.name"  // User's name who created the task
            }
          }
        }
      },
      // Project the final structure
      {
        $project: {
          _id: 0,  // Exclude the _id field
          CategoryName: 1,  // Include subCategory name
          subCategoryId: 1,  // Include the subCategory's _id
          tasks: 1  // Include the array of tasks
        }
      }
    ])

    let Organizationtasks = await Task.find({ organization: organizationId });
    let usersCount = await User.find({ organization: organizationId }).countDocuments();
    let organization = await Organization.findById(organizationId)

    let tasksCount = Organizationtasks.length
    let taskStatusCount = Organizationtasks.reduce((acc, task) => {
      const status = task.status;
      if (status) {
        acc[status] = (acc[status] || 0) + 1;
      }
      return acc;
    }, {});

    // Mapping the original task statuses to a more readable format
    const statusMap = {
      "in-progress": { label: "In Progress", color: "#fdab3d" },
      "needs-schedule": { label: "Needs Schedule", color: "#DF2F4A" },
      "scheduled": { label: "Scheduled", color: "#3D85C6" },
      "done": { label: "Done", color: "#00C875" },
      "on-hold": { label: "On Hold", color: "#9CD326" },
      "stuck": { label: "Stuck", color: "#A61C00" },
      "behind-schedule": { label: "Behind Schedule", color: "#A61C00" },
      "not-started": { label: "Not Started", color: "#DF2F4A" }
    };

    // Convert the taskStatusCount object to an array with label and value format
    const transformedStatus = Object.entries(taskStatusCount).map(([key, value]) => {

      return {
        label: statusMap[key]?.label || key, // Use statusMap for readable labels
        color: statusMap[key]?.color || "#000000",  // Default to black if no color is found
        value: value
      }
    });

    let framworkCount = organization.categories.length


    // const tasks = await  Task.find(query).populate("subCategory createdBy")

    // const category = await Category.find({})

    // const groupedTasks = tasks.reduce((acc, task) => {
    //     const CategoryId = task.subCategory.category._id.toString();
    //     const categorydetail = category.find(cat => cat._id ==CategoryId );
    //     if (!acc[categorydetail.name]) {
    //       acc[categorydetail.name] = [];
    //     }
    //     acc[categorydetail.name].push({task , categorydetail});
    //     return acc;
    //   }, {});

    //   const workbook = new ExcelJS.Workbook();
    //   const worksheet = workbook.addWorksheet("Report");

    //   worksheet.columns = [
    //     { header: "Category", key: "category", width: 60 },
    //     { header: "item", key: "name", width: 13 },
    //     { header: "Participant", key: "createdBy", width: 13 },
    //     { header: "Due Date", key: "dueDate", width: 13 },
    //     { header: "status", key: "status", width: 40 },
    //   ];

    //   Object.keys(groupedTasks).forEach(key => {
    //     console.log(key, groupedTasks[key]); // key is the property, obj[key] is the value
    //     const categorytask = groupedTasks[key];
    //     categorytask.forEach((item, idx) => {
    //         const row = worksheet.addRow({
    //             category: item.categorydetail.name,
    //             name:item.task.name,
    //             createdBy: item.task.createdBy.name,
    //             dueDate:item.task.due_date,
    //             status:item.task.status
    //        })
    //     })
    // });

    //   const buffer = await workbook.xlsx.writeBuffer();

    // res.setHeader(
    //     "Content-Type",
    //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    // );
    // res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    // res.send(buffer);
    // groupedTasks
    res.json({ tasks, reportdata: { tasksCount, usersCount, framworkCount, transformedStatus } })
  } catch (err) {
    console.error("An error occurred:", err);
    res.status(500).send("An error occurred");
  }
}

const categoryReport = async (req, res) => {
  const { organizationId } = req.params;
  const { framework, fromDate, toDate } = req.body

  const subcategoryinCategory = await SubCategory.find({
    // organization: new ObjectId(organizationId),
    category: { $in: framework.map(item => new ObjectId(item)) }
  }, { _id: 1 })

  const subcategories = subcategoryinCategory.map(item => item._id);

  // Aggregation pipeline to categorize tasks by subCategory and return task details
  const tasks = await Task.aggregate([
    {
      $match: {
        organization: new ObjectId(organizationId),  // Filter tasks by organization (ObjectId reference)
        createdAt: { $gte: new Date(fromDate), $lt: new Date(toDate) },
        subCategory: { $in: subcategories },
      }
    },
    // Lookup to join tasks with the subCategory collection
    {
      $lookup: {
        from: 'subcategories',   // Mongoose automatically pluralizes the model name, so it would be 'subcategories'
        localField: 'subCategory',  // Field in the 'tasks' collection
        foreignField: '_id',        // Field in the 'subCategories' collection
        as: 'subCategoryDetails'    // Name of the field to store the joined subcategory details
      }
    },
    {
      $unwind: "$subCategoryDetails"  // Unwind the subCategoryDetails array to flatten the structure
    },
    // Group by subCategory and push task details into an array
    {
      $group: {
        _id: "$subCategory",  // Group by subCategory (ObjectId)
        subCategoryId: { $first: "$subCategoryDetails._id" },  // Get the _id of the subCategory
        CategoryName: { $first: "$subCategoryDetails.name" },  // Get the subCategory name
        tasks: {
          $push: {  // Push each task's details into an array
            item: "$name",  // Task name
            status: "$status",  // Task status,
          }
        }
      }
    },
    // Project the final structure
    {
      $project: {
        _id: 0,  // Exclude the _id field
        CategoryName: 1,  // Include subCategory name
        subCategoryId: 1,  // Include the subCategory's _id
        tasks: 1  // Include the array of tasks
      }
    }
  ])

  // Define a helper function to transform the status
  const statusMapping = {
    'in-progress': { label: 'In Progress', color: '#fdab3d' },
    'needs-schedule': { label: 'Needs Schedule', color: '#DF2F4A' },
    'scheduled': { label: 'Scheduled', color: '#3D85C6' },
    'done': { label: 'Done', color: '#00C875' },
    'on-hold': { label: 'On Hold', color: '#9CD326' },
    'stuck': { label: 'Stuck', color: '#A61C00' },
    'behind-schedule': { label: 'Behind Schedule', color: '#A61C00' },
    "not-started": { label: "Not Started", color: "#DF2F4A" }
  };

  // Now transform the status of each category's tasks
  tasks.forEach(subCategory => {
    // Initialize status count map for each category
    const transformedStatus = [
      { label: 'In Progress', color: '#fdab3d', value: 0 },
      { label: 'Needs Schedule', color: '#DF2F4A', value: 0 },
      { label: 'Scheduled', color: '#3D85C6', value: 0 },
      { label: 'Done', color: '#00C875', value: 0 },
      { label: 'On Hold', color: '#9CD326', value: 0 },
      { label: 'Stuck', color: '#A61C00', value: 0 },
      { label: 'Behind Schedule', color: '#A61C00', value: 0 },
      { label: 'Not Started', color: '#DF2F4A', value: 0 }

    ];

    // Count the occurrences of each task status in this subcategory
    subCategory.tasks.forEach(task => {
      const statusObj = statusMapping[task.status];  // Map the status to label/color
      if (statusObj) {
        const statusIndex = transformedStatus.findIndex(status => status.label === statusObj.label);
        if (statusIndex !== -1) {
          transformedStatus[statusIndex].value += 1;
        }
      }
    });

    // Add transformedStatus to the subCategory object
    subCategory.transformedStatus = transformedStatus.filter(status => status.value > 0);  // Only include statuses with counts > 0
  });

  let tasksCount = await Task.find({ organization: organizationId }).countDocuments();

  let usersCount = await User.find({ organization: organizationId }).countDocuments();
  let organization = await Organization.findById(organizationId)
  let framworkCount = organization.categories.length

  res.json({ tasks, reportdata: { tasksCount, usersCount, framworkCount, } })
}

const frameworkReport = async (req, res) => {
  const { organizationId } = req.params;
  const { fromDate, toDate } = req.body

  const alltaskincategory = await Task.find({
    organization: new ObjectId(organizationId),  // Filter tasks by organization (ObjectId reference)
    createdAt: { $gte: new Date(fromDate), $lt: new Date(toDate) },
    // subCategory:{$in : subcategories} ,
  }, { status: 1, subCategory: 1, _id: 1 }).populate("subCategory")

  let categories = []
  let groupbycategory = alltaskincategory.reduce((grouped, task) => {
    const category = task.subCategory.category;
    if (!grouped[category]) {
      categories.push(category)
      grouped[category] = [];  // Initialize the group if it doesn't exist
    }

    grouped[category].push({
      _id: task._id,
      status: task.status
    });

    return grouped;
  }, {});

  // // Define a helper function to transform the status
  const statusMapping = {
    'in-progress': { label: 'In Progress', color: '#fdab3d' },
    'needs-schedule': { label: 'Needs Schedule', color: '#DF2F4A' },
    'scheduled': { label: 'Scheduled', color: '#3D85C6' },
    'done': { label: 'Done', color: '#00C875' },
    'on-hold': { label: 'On Hold', color: '#9CD326' },
    'stuck': { label: 'Stuck', color: '#A61C00' },
    'behind-schedule': { label: 'Behind Schedule', color: '#A61C00' },
    "not-started": { label: "Not Started", color: "#DF2F4A" }
  };

  let = transformedStatus = {}
  Object.entries(groupbycategory).map(([key, value]) => {
    console.log("valueee ,", key)
    console.log("keyee ,", value)

    const transformedStatusval = [
      { label: 'In Progress', color: '#fdab3d', value: 0 },
      { label: 'Needs Schedule', color: '#DF2F4A', value: 0 },
      { label: 'Scheduled', color: '#3D85C6', value: 0 },
      { label: 'Done', color: '#00C875', value: 0 },
      { label: 'On Hold', color: '#9CD326', value: 0 },
      { label: 'Stuck', color: '#A61C00', value: 0 },
      { label: 'Behind Schedule', color: '#A61C00', value: 0 },
      { label: 'Not Started', color: '#DF2F4A', value: 0 }
    ];

    // Count the occurrences of each task status in this subcategory
    value.forEach(task => {
      const statusObj = statusMapping[task.status];  // Map the status to label/color
      if (statusObj) {
        const statusIndex = transformedStatusval.findIndex(status => status.label === statusObj.label);
        if (statusIndex !== -1) {
          transformedStatusval[statusIndex].value += 1;
        }
      }
    });

    // Add transformedStatus to the subCategory object
    transformedStatus[key] = transformedStatusval.filter(status => status.value > 0);  // Only include statuses with counts > 0

  });

  const allcategory = await Category.find({ _id: { $in: categories.map(item => new ObjectId(item)) } }, { _id: 1, name: 1 })

  // Create the mapping from ID to name
  const idToNameMap = allcategory.reduce((map, category) => {
    map[category._id] = category.name;
    return map;
  }, {});

  // Replace the IDs in the transformedStatus with names
  transformedStatus = Object.keys(transformedStatus).reduce((result, id) => {
    const name = idToNameMap[id];  // Get the corresponding name
    if (name) {
      result[name] = transformedStatus[id]; // Replace ID with name
    } else {
      result[id] = transformedStatus[id]; // If no name found, keep the original ID
    }
    return result;
  }, {});

  let tasksCount = await Task.find({ organization: organizationId }).countDocuments();
  let usersCount = await User.find({ organization: organizationId }).countDocuments();
  let organization = await Organization.findById(organizationId)
  let framworkCount = organization.categories.length

  res.json({ transformedStatus, reportdata: { tasksCount, usersCount, framworkCount } })

}

const summaryReport = async (req, res) => {
  const { organizationId } = req.params;
  const tasks = await Task.find({
    organization: new ObjectId(organizationId)
  }, { _id: 1, name: 1, due_date: 1, createdAt: 1, status: 1, priority: 1 })

  const topprioritytasks = await Task.find({
    organization: new ObjectId(organizationId)
  }, { _id: 1, name: 1, due_date: 1, createdAt: 1, status: 1, priority: 1 })
    .sort({ priority: -1 })
    .limit(5);

  const priorityTask = topprioritytasks.sort((a, b) => b.due_date - a.due_date);

  const cateoryTask = await Task.aggregate([
    {
      $lookup: {
        from: 'subcategories',
        localField: 'subCategory',
        foreignField: '_id',
        as: 'subcategory_info'
      }
    },
    {
      $unwind: "$subcategory_info"
    },
    {
      $group: {
        _id: "$subCategory",   // Group by subCategory
        category_name: { $first: "$subcategory_info.name" },
        // tasks: { $push: "$status" },  // Collect all tasks in an array
        totalCount: { $sum: 1 },
        doneCount: {
          $sum: {
            $cond: { if: { $eq: ["$status", "done"] }, then: 1, else: 0 }
          }
        }
      }
    }
  ])

  cateoryTask.forEach(category => {
    if (category.totalCount == 0) {
      category.donePercentage = 0
    } else {
      category.donePercentage = (category.doneCount / category.totalCount) * 100
    }
  })

  const sortedCategoryTask = cateoryTask.sort((a, b) => b.donePercentage - a.donePercentage);

  const milestonetask = sortedCategoryTask.slice(0, 5);

  const inProgressTasks = tasks.filter(task => task.status === "in-progress");

  const sortedInProgressTasks = inProgressTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const summarytask = sortedInProgressTasks.slice(0, 6);

  const activityTask = tasks.filter((item) => {
    return item.name.includes("Acquisitions") || item.name.includes("Tenders") || item.name.includes("Licenses")
  }).sort((a, b) => new Date(b.due_date) - new Date(a.due_date));

  const statusCounts = {
    "in-progress": 0,
    "needs-schedule": 0,
    'behind-schedule': 0,
    "scheduled": 0,
    "on-hold": 0,
    "done": 0
  };

  tasks.forEach(task => {
    if (statusCounts[task.status] !== undefined) {
      statusCounts[task.status]++;
    }
  });

  const overallstatus = [
    { label: "In Progress", color: "#fdab3d", value: statusCounts["in-progress"] },
    { label: "Needs Schedule", color: "#DF2F4A", value: statusCounts["needs-schedule"] },
    { label: "Scheduled", color: "#3D85C6", value: statusCounts["scheduled"] },
    { label: 'Behind Schedule', color: '#A61C00', value: statusCounts["behind-schedule"] },
    { label: "On Hold", color: "#9CD326", value: statusCounts["on-hold"] },
    { label: "Done", color: "#4CAF50", value: statusCounts["done"] }
  ].filter(item => item.value > 0);

  const behindScheduledTasks = tasks.filter(task => task.status === "behind-schedule");

  const sortedBehindScheduledTasks = behindScheduledTasks.sort((a, b) => new Date(b.due_date) - new Date(a.due_date));

  const risktask = sortedBehindScheduledTasks.slice(0, 5);

  const alltaskincategory = await Task.find({
    organization: new ObjectId(organizationId),
  }, { status: 1, subCategory: 1, _id: 1 }).populate("subCategory")

  let categories = []
  let groupbycategory = alltaskincategory.reduce((grouped, task) => {
    const category = task.subCategory.category;
    if (!grouped[category]) {
      categories.push(category)
      grouped[category] = [];  // Initialize the group if it doesn't exist
    }

    grouped[category].push({
      _id: task._id,
      status: task.status
    });

    return grouped;
  }, {});

  // // Define a helper function to transform the status
  const statusMapping = {
    'in-progress': { label: 'In Progress', color: '#fdab3d' },
    'needs-schedule': { label: 'Needs Schedule', color: '#DF2F4A' },
    'scheduled': { label: 'Scheduled', color: '#3D85C6' },
    'done': { label: 'Done', color: '#00C875' },
    'on-hold': { label: 'On Hold', color: '#9CD326' },
    'stuck': { label: 'Stuck', color: '#A61C00' },
    'behind-schedule': { label: 'Behind Schedule', color: '#A61C00' },
    "not-started": { label: "Not Started", color: "#DF2F4A" }
  };

  let = transformedStatus = {}
  Object.entries(groupbycategory).map(([key, value]) => {

    const transformedStatusval = [
      { label: 'In Progress', color: '#fdab3d', value: 0 },
      { label: 'Needs Schedule', color: '#DF2F4A', value: 0 },
      { label: 'Scheduled', color: '#3D85C6', value: 0 },
      { label: 'Done', color: '#00C875', value: 0 },
      { label: 'On Hold', color: '#9CD326', value: 0 },
      { label: 'Stuck', color: '#A61C00', value: 0 },
      { label: 'Behind Schedule', color: '#A61C00', value: 0 },
      { label: 'Not Started', color: '#DF2F4A', value: 0 }
    ];

    // Count the occurrences of each task status in this subcategory
    value.forEach(task => {
      const statusObj = statusMapping[task.status];  // Map the status to label/color
      if (statusObj) {
        const statusIndex = transformedStatusval.findIndex(status => status.label === statusObj.label);
        if (statusIndex !== -1) {
          transformedStatusval[statusIndex].value += 1;
        }
      }
    });

    // Add transformedStatus to the subCategory object
    transformedStatus[key] = transformedStatusval.filter(status => status.value > 0);  // Only include statuses with counts > 0

  });

  const allcategory = await Category.find({ _id: { $in: categories.map(item => new ObjectId(item)) } }, { _id: 1, name: 1,displayorder: 1 })

  // Create the mapping from ID to name
  const idToNameMap = allcategory.reduce((map, category) => {
    map[category._id] = category.name;
    return map;
  }, {});

  // Replace the IDs in the transformedStatus with names
  transformedStatus = Object.keys(transformedStatus).reduce((result, id) => {
    const name = idToNameMap[id];  // Get the corresponding name
    if (name) {
      result[name] = transformedStatus[id]; // Replace ID with name
    } else {
      result[id] = transformedStatus[id]; // If no name found, keep the original ID
    }
    return result;
  }, {});

  const categoryOrderMap = allcategory.reduce((map, category) => {
    map[category.name] = category.displayorder;
    return map;
  }, {});

  const sortedTransformedStatus = Object.keys(transformedStatus)
  .sort((a, b) => categoryOrderMap[a] - categoryOrderMap[b])
  .reduce((sortedObj, categoryName) => {
    sortedObj[categoryName] = transformedStatus[categoryName];
    return sortedObj;
  }, {});

  res.json({ milestonetask, overallstatus, summarytask, activityTask, risktask, priorityTask, transformedStatus:sortedTransformedStatus })

}

module.exports = {
  downloadReportExcel,
  infoReport,
  categoryReport,
  frameworkReport,
  summaryReport
}