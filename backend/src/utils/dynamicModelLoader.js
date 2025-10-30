const fs = require('fs');
const path = require('path');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const definedModels = {};
const definitionsDir = path.join(__dirname, '../models/definitions');

function mapFieldType(type) {
  if (!type) return DataTypes.STRING;
  switch (type.toLowerCase()) {
    case 'string': return DataTypes.STRING;
    case 'number': return DataTypes.INTEGER;
    case 'boolean': return DataTypes.BOOLEAN;
    case 'date': return DataTypes.DATE;
    case 'float': return DataTypes.FLOAT;
    case 'text': return DataTypes.TEXT;
    default: return DataTypes.STRING;
  }
}

function defineModel(modelDef) {
  if (!modelDef || !modelDef.name || !Array.isArray(modelDef.fields)) {
    throw new Error('Invalid model definition');
  }

  const modelName = modelDef.name.trim();
  const key = modelName.toLowerCase();

  if (definedModels[key]) {
    return definedModels[key].model;
  }

  const attributes = {};

  attributes.id = {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  };

  for (const field of modelDef.fields) {
    if (!field.name) continue;

    const attr = {
      type: mapFieldType(field.type),
      allowNull: field.required ? false : true,
    };

    if (field.default !== undefined && field.default !== null) {
      attr.defaultValue = field.default;
    }
    if (field.required && attr.allowNull === false && field.default === undefined) {
      const type = field.type.toLowerCase();
      if (type === 'string' || type === 'text') attr.defaultValue = '';
      else if (['number', 'float', 'integer'].includes(type)) attr.defaultValue = 0;
      else if (type === 'boolean') attr.defaultValue = false;
    }

    if (field.unique) attr.unique = true;
    attributes[field.name] = attr;
  }

  const model = sequelize.define(modelName, attributes, { timestamps: true });
  definedModels[key] = { model, definition: modelDef };

  model
    .sync({ alter: true })
    .then(() => console.log())
    .catch((err) => console.error(`Failed to sync model ${modelName}:`, err.message));

  return model;
}

function ensureModelsLoaded() {
  if (!fs.existsSync(definitionsDir)) return;
  const files = fs.readdirSync(definitionsDir);

  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const modelDef = JSON.parse(fs.readFileSync(path.join(definitionsDir, file), 'utf-8'));
    const key = modelDef.name.toLowerCase();
    if (!definedModels[key]) defineModel(modelDef);
  }
}

function getDefinedModels() {
  if (Object.keys(definedModels).length === 0) ensureModelsLoaded();
  return definedModels;
}

module.exports = { defineModel, getDefinedModels };
