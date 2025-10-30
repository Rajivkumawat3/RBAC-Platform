const { getDefinedModels } = require('../utils/dynamicModelLoader');

function rbacCheck(action) {
  return (req, res, next) => {
    try {
      const models = getDefinedModels();
      const modelName = req.baseUrl.split('/').pop().toLowerCase();
      const entry = models[modelName];

      if (!entry) {
        return res.status(400).json({ error: `Model ${modelName} not loaded` });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const role = (req.user.role || 'Viewer').toLowerCase();

      const rbac = entry.definition?.rbac || {};
      const normalizedRBAC = Object.keys(rbac).reduce((acc, key) => {
        acc[key.toLowerCase()] = rbac[key];
        return acc;
      }, {});

      const rolePerms = normalizedRBAC[role] || [];

      if (rolePerms.includes('all') || rolePerms.includes(action)) {
        return next();
      }

      return res.status(403).json({
        error: `Access denied. Role "${role}" cannot perform "${action}" on ${modelName}`,
      });
    } catch (err) {
      res.status(500).json({ error: 'RBAC validation failed' });
    }
  };
}

module.exports = { rbacCheck };
