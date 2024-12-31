const SelfAssessment = require("../models/SelfAssessment");
const Organization = require("../models/Organization");
const stringify = require("csv-stringify/sync");
const { ObjectId } = require("mongodb");
const XLSX = require("xlsx");
const fs = require("fs");
const ExcelJS = require("exceljs");

// Create a new self-assessment
const createSelfAssessment = async (req, res) => {
  try {
    const selfAssessment = new SelfAssessment(req.body);
    await selfAssessment.save();
    res.status(201).json(selfAssessment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getLatestSelfAssessmentScore = async (req, res) => {
  try {
    const { organizationId } = req.params;

    const latestSelfAssessment = await SelfAssessment.findOne({
      organization: organizationId,
    }).sort({ createdAt: -1 });

    if (!latestSelfAssessment) {
      return res.json([]);
    }

    const scores = latestSelfAssessment.report.map((item) => ({
      category: item.category,
      subCategory: item.subCategory,
      targetScore: item.targetScore,
      score: item.score,
    }));

    res.json(scores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all self-assessments
const getAllSelfAssessments = async (req, res) => {
  try {
    const selfAssessments = await SelfAssessment.find().populate(
      "report.category report.subCategory"
    );
    res.json(selfAssessments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single self-assessment by ID
const getSelfAssessmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const selfAssessment = await SelfAssessment.findById(id).populate(
      "report.category report.subCategory"
    );
    if (!selfAssessment) {
      return res.status(404).json({ message: "Self-assessment not found" });
    }
    res.json(selfAssessment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getSelfAssessmentsByOrganizationId = async (req, res) => {
  const { organizationId } = req.params;

  try {
    const selfAssessments = await SelfAssessment.find({
      organization: organizationId,
    })
      .populate("report.category report.subCategory")
      .sort({ createdAt: -1 });
    if (!selfAssessments || selfAssessments.length === 0) {
      return res.json([]);
    }

    res.json(selfAssessments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a self-assessment by ID
const updateSelfAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const selfAssessment = await SelfAssessment.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ).populate("report.category report.subCategory");
    if (!selfAssessment) {
      return res.status(404).json({ message: "Self-assessment not found" });
    }
    res.json(selfAssessment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a self-assessment by ID
const deleteSelfAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const selfAssessment = await SelfAssessment.findByIdAndDelete(id);
    if (!selfAssessment) {
      return res.status(404).json({ message: "Self-assessment not found" });
    }
    res.json({ message: "Self-assessment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getTargetScoreByOrgId = async (req, res) => {
  try {
    const organization = await Organization.findById(
      req.params.organizationId
    ).populate({
      path: "targetScore.subCategory",
      populate: {
        path: "category",
        model: "Category",
      },
    });

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.json(organization.targetScore);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const downloadCSV = async (req, res) => {
  try {
    const { id } = req.params;
    const csvFilePath = `${id}_${Date.now()}.csv`;
    const pipeline = [
      {
        $match: { _id: new ObjectId(id) },
      },
      {
        $unwind: {
          path: "$report",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "report.category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "report.subCategory",
          foreignField: "_id",
          as: "subCategoryDetails",
        },
      },
      {
        $unwind: {
          path: "$categoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$subCategoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          reports: {
            $push: {
              prevScore: "$report.prevScore",
              score: "$report.score",
              note: "$report.note",
              categoryDetails: {
                name: "$categoryDetails.name",
                code: "$categoryDetails.code",
              },
              subCategoryDetails: {
                name: "$subCategoryDetails.name",
                code: "$subCategoryDetails.subCatCode",
              },
            },
          },
        },
      },
    ];

    const data = await SelfAssessment.aggregate(pipeline);

    const exportData = data[0].reports.map((item, key) => ({
      id: key + 1,
      category: item?.categoryDetails?.name,
      catCode: item?.categoryDetails?.code,
      subCategory: item?.subCategoryDetails?.name,
      subCatCode:
        item?.categoryDetails?.code + "." + item?.subCategoryDetails?.code,
      prevScore: item?.prevScore,
      score: item?.score,
      note: item?.note,
    }));

    const headers = [
      "ID",
      "Category",
      "Category Code",
      "SubCategory",
      "SubCategory Code",
      "Previous Score",
      "Score",
      "Note",
    ];

    // Use csv-stringify to generate CSV in-memory
    const csvData = stringify.stringify([
      headers,
      ...exportData.map(Object.values),
    ]);

    // Set headers to indicate a CSV download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=" + csvFilePath);

    // Send CSV data directly in response
    res.send(csvData);
  } catch (err) {
    console.error("An error occurred:", err);
    res.status(500).send("An error occurred");
  }
};

const downloadExcel = async (req, res) => {
  try {
    const { id } = req.params;
    const fileName = `${id}_${Date.now()}.xlsx`;

    const pipeline = [
      {
        $match: { _id: new ObjectId(id) },
      },
      {
        $unwind: {
          path: "$report",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "report.category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "report.subCategory",
          foreignField: "_id",
          as: "subCategoryDetails",
        },
      },
      {
        $unwind: {
          path: "$categoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$subCategoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          reports: {
            $push: {
              prevScore: "$report.prevScore",
              score: "$report.score",
              targetScore: "$report.targetScore",
              note: "$report.note",
              categoryDetails: {
                name: "$categoryDetails.name",
                code: "$categoryDetails.code",
                color: "$categoryDetails.colorCode",
              },
              subCategoryDetails: {
                name: "$subCategoryDetails.name",
                code: "$subCategoryDetails.subCatCode",
              },
            },
          },
        },
      },
    ];

    const data = await SelfAssessment.aggregate(pipeline);

    const sortedData = data[0].reports.sort((a, b) =>
      a.categoryDetails.name.localeCompare(b.categoryDetails.name)
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    worksheet.columns = [
      { header: "", key: "category", width: 5 },
      { header: "NIST CSF 2.0 Categories", key: "subCategory", width: 60 },
      { header: "Target Score", key: "targetScore", width: 13 },
      { header: "Policy Score", key: "prevScore", width: 13 },
      { header: "Practice Score", key: "score", width: 13 },
      { header: "Note", key: "note", width: 20 },
    ];

    worksheet.eachRow((row) => {
      row.height = 10;
    });

    worksheet.getRow(1).alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    let lastCategory = null;
    let categoryStartRow = 2;

    sortedData.forEach((item, idx) => {
      const row = worksheet.addRow({
        category: item?.categoryDetails?.name,
        subCategory:
          item?.subCategoryDetails?.name +
          " (" +
          item?.categoryDetails?.code +
          "." +
          item?.subCategoryDetails?.code +
          ")",
        targetScore: item?.targetScore,
        prevScore: item?.prevScore,
        score: item?.score,
        note: item?.note,
      });

      let categoryColor = item?.categoryDetails?.color;
      if (!categoryColor || !/^#[0-9A-F]{6}$/i.test(categoryColor)) {
        categoryColor = "#FFFFFF";
      }
      categoryColor = categoryColor.replace("#", "");

      const categoryCell = row.getCell("category");
      categoryCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: categoryColor },
      };

      if (item.categoryDetails.name !== lastCategory) {
        if (lastCategory && categoryStartRow < idx + 1) {
          worksheet.mergeCells(`A${categoryStartRow}:A${idx + 1}`);
        }
        lastCategory = item.categoryDetails.name;
        categoryStartRow = idx + 2;
      }

      row.getCell("category").alignment = {
        vertical: "middle",
        horizontal: "center",
        textRotation: 90,
      };
      row.getCell("targetScore").alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      row.getCell("prevScore").alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      row.getCell("score").alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      row.getCell("subCategory").alignment = { vertical: "middle" };
      row.getCell("note").alignment = { vertical: "middle" };

      const scoreCell = row.getCell("score");
      const prevScoreCell = row.getCell("prevScore");
      const targetScoreCell = row.getCell("targetScore");

      if (item.score < item.targetScore) {
        scoreCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFC7CD" },
        };
        scoreCell.font = {
          color: { argb: "9B0005" },
        };
      } else {
        scoreCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "C6EECF" },
        };
        scoreCell.font = {
          color: { argb: "006200" },
        };
      }

      if (item.prevScore < 3) {
        prevScoreCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFC7CD" },
        };
        prevScoreCell.font = {
          color: { argb: "9B0005" },
        };
      } else {
        prevScoreCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "C6EECF" },
        };
        prevScoreCell.font = {
          color: { argb: "006200" },
        };
      }
    });

    if (lastCategory && categoryStartRow < sortedData.length + 2) {
      worksheet.mergeCells(`A${categoryStartRow}:A${sortedData.length + 1}`);
    }

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    res.send(buffer);
  } catch (err) {
    console.error("An error occurred:", err);
    res.status(500).send("An error occurred");
  }
};

module.exports = {
  createSelfAssessment,
  getLatestSelfAssessmentScore,
  getAllSelfAssessments,
  getSelfAssessmentById,
  getSelfAssessmentsByOrganizationId,
  updateSelfAssessment,
  deleteSelfAssessment,
  downloadCSV,
  downloadExcel,
  getTargetScoreByOrgId,
};
