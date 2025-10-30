const express = require('express');
const { writeModelFile } = require('../utils/modelWriter');
const { defineModel } = require('../utils/dynamicModelLoader');
const { registerRoutesForModel } = require('./dynamicRoutes');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const { sequelize } = require('../config/database');
const User = require('../model/User'); // ✅ Direct import (not destructuring)
const path=require('path')
const fs=require('fs')
const router = express.Router();

/**
 * 🧩 Publish Dynamic Schema (Admin Only)
 */
router.post('/models/publish',
  isAuthenticatedUser,
  authorizeRoles('Admin'),
  async (req, res) => {
    try {
      const modelDef = req.body;

      if (!modelDef || !modelDef.name) {
        return res.status(400).json({ error: 'Invalid model definition' });
      }

      await writeModelFile(modelDef);
      defineModel(modelDef);
      registerRoutesForModel(req.app, modelDef.name);

      res.json({
        success: true,
        message: `✅ Model "${modelDef.name}" published successfully.`,
      });
    } catch (error) {
      console.error('❌ Error publishing model:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/users",
  isAuthenticatedUser,
  authorizeRoles("Admin"),
  async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ["id", "name", "email", "role"],
      });
      res.json(users); // ✅ plain array
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }
);


// ✅ Get all models from /models directory
router.get("/models", isAuthenticatedUser, async (req, res) => {
  try {
    const MODELS_DIR = path.join(__dirname, "../../models");

    if (!fs.existsSync(MODELS_DIR)) {
      return res.status(404).json({ error: "Models directory not found" });
    }

    const files = fs.readdirSync(MODELS_DIR).filter(f => f.endsWith(".json"));
    const models = files.map(file => {
      const raw = fs.readFileSync(path.join(MODELS_DIR, file), "utf-8");
      return JSON.parse(raw);
    });

    res.status(200).json({ success: true, models });
  } catch (err) {
    console.error("❌ Error reading model files:", err);
    res.status(500).json({ error: "Failed to load model definitions" });
  }
});


// in adminRoutes.js
router.put("/users/:id", isAuthenticatedUser, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    user.role = role;
    await user.save();

    res.json({ success: true, message: "Role updated successfully", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
