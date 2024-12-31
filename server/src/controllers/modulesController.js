const Modules = require("../models/Modules");

// Create a new modules
const createModules = async (req, res) => {
    const { name, status } = req.body;

    try {
        const existingModules = await Modules.findOne({ name });
        if (existingModules) {
            return res.status(400).json({ message: "Modules is already exists" });
        }

        const createdAt = new Date();
        const newModules = new Modules({
            name,
            status,
            createdAt,
            updatedAt: createdAt,
        });

        await newModules.save();

        res.status(201).json(newModules);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all moduless
const getModuless = async (req, res) => {
    try {
        const moduless = await Modules.find().sort({ createdAt: -1 });
        res.json(moduless);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get a single modules by ID
const getModulesById = async (req, res) => {
    try {
        const modules = await Modules.findById(req.params.id);
        if (!modules) {
            return res.status(404).json({ message: "Modules not found" });
        }
        res.json(modules);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Update an modules by ID
const updateModules = async (req, res) => {
    const { name, status } = req.body;

    try {
        const modules = await Modules.findById(req.params.id);
        if (!modules) {
            return res.status(404).json({ message: "Modules not found" });
        }

        const updatedAt = new Date();

        modules.name = name || modules.name;
        modules.status = status || modules.status;
        modules.createdAt = modules.createdAt;
        modules.updatedAt = updatedAt || modules.updatedAt;

        await modules.save();
        res.json(modules);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete an modules by ID
const deleteModules = async (req, res) => {
    try {
        const modules = await Modules.findById(req.params.id);
        if (!modules) {
            return res.status(404).json({ message: "Modules not found" });
        }

        await Modules.deleteOne({ _id: req.params.id });
        res.json({ message: "Modules removed" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createModules,
    getModuless,
    getModulesById,
    updateModules,
    deleteModules,
};
