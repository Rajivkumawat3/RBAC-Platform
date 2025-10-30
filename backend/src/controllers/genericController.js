
const { getDefinedModels } = require('../utils/dynamicModelLoader');

function getModelByName(name) {
  const models = getDefinedModels();
  const key = name.toLowerCase();
  const entry = models[key];
  if (!entry) throw new Error(`Model ${key} not loaded`);
  return entry.model;
}

function getModelByName(name) {
  const models = getDefinedModels();
  const key = name.toLowerCase();
  const entry = models[key];
  if (!entry) throw new Error(`Model ${key} not loaded`);
  return entry;
}

exports.create = async (req, res) => {
  try {
    const modelName = req.params.model || req.baseUrl.split('/').pop();
    const { model, definition } = getModelByName(modelName);

    const validFields = Object.keys(model.rawAttributes).filter(
      f => !['id', 'createdAt', 'updatedAt'].includes(f)
    );

    const payload = {};
    const missingFields = [];

    for (const fieldDef of definition.fields) {
      const { name, required } = fieldDef;
      if (req.body[name] !== undefined) {
        payload[name] = req.body[name];
      } else if (required) {
        missingFields.push(name);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    const created = await model.create(payload);
    res.status(201).json(created);

  } catch (err) {
    console.error('Create error:', err);
    res.status(400).json({ error: err.message });
  }
};


exports.list = async (req, res) => {
  try {
    const modelName = req.params.model || req.baseUrl.split('/').pop();
    const Model = getModelByName(modelName);
    const rows = await Model.model.findAll();
    res.json(rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const Model = getModelByName(req.params.model || req.baseUrl.split('/').pop());
    const row = await Model.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.update = async (req, res) => {
  try {
    // ✅ Ensure model name is extracted correctly from route
    const baseUrlParts = req.baseUrl.split('/');
    const modelName = baseUrlParts[baseUrlParts.length - 1] || req.params.model;

    const Model = getModelByName(modelName);

    if (!Model) {
      return res.status(404).json({ error: `Model '${modelName}' not found.` });
    }

    const record = await Model.model.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    await record.update(req.body);
    res.json(record);
  } catch (err) {
    console.error('❌ Update error:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const baseUrlParts = req.baseUrl.split('/');
    const modelName = baseUrlParts[baseUrlParts.length - 1] || req.params.model;

    const Model = getModelByName(modelName);
    if (!Model) {
      return res.status(404).json({ error: `Model '${modelName}' not found.` });
    }

    const record = await Model.model.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    await record.destroy();
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    res.status(400).json({ error: err.message });
  }
};
