const Framework = require("../models/Framework");

// Create a new framework
const createFramework = async (req, res) => {
    const { name, status, module = null, isCustom = false } = req.body;

    try {
        const existingFramework = await Framework.findOne({ name });
        if (existingFramework) {
            return res.status(400).json({ message: "Framework is already exists" });
        }

        const createdAt = new Date();
        const newFramework = new Framework({
            module,
            name,
            status,
            isCustom,
            createdAt,
            updatedAt: createdAt,
        });

        await newFramework.save();

        res.status(201).json(newFramework);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all frameworks
const getFrameworks = async (req, res) => {
    try {
        const frameworks = await Framework.find().sort({ createdAt: -1 });
        res.json(frameworks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get a single framework by ID
const getFrameworkById = async (req, res) => {
    try {
        const framework = await Framework.findById(req.params.id);
        if (!framework) {
            return res.status(404).json({ message: "Framework not found" });
        }
        res.json(framework);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Update an framework by ID
const updateFramework = async (req, res) => {
    const { name, status, module = null, isCustom = false } = req.body;

    try {
        const framework = await Framework.findById(req.params.id);
        if (!framework) {
            return res.status(404).json({ message: "Framework not found" });
        }

        const updatedAt = new Date();

        framework.module = module || framework.module;
        framework.name = name || framework.name;
        framework.status = status || framework.status;
        framework.isCustom = isCustom || framework.isCustom;
        framework.createdAt = framework.createdAt;
        framework.updatedAt = updatedAt || framework.updatedAt;

        await framework.save();
        res.json(framework);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete an framework by ID
const deleteFramework = async (req, res) => {
    try {
        const framework = await Framework.findById(req.params.id);
        if (!framework) {
            return res.status(404).json({ message: "Framework not found" });
        }

        await Framework.deleteOne({ _id: req.params.id });
        res.json({ message: "Framework removed" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createFramework,
    getFrameworks,
    getFrameworkById,
    updateFramework,
    deleteFramework,
};
