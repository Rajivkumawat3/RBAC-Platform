const express = require('express');
const generic = require('../controllers/genericController');
const { rbacCheck } = require('../middleware/rbac');
const { isAuthenticatedUser } = require('../middleware/auth'); // ✅ Add this

function registerRoutesForModel(app, modelName) {
  const router = express.Router();

  router.post('/', isAuthenticatedUser, rbacCheck('create'), generic.create);
  router.get('/', isAuthenticatedUser, rbacCheck('read'), generic.list);
  router.get('/:id', isAuthenticatedUser, rbacCheck('read'), generic.getById);
  router.put('/:id', isAuthenticatedUser, rbacCheck('update'), generic.update);
  router.delete('/:id', isAuthenticatedUser, rbacCheck('delete'), generic.remove);

  const base = `/api/${modelName.toLowerCase()}`;
  app.use(base, router);
}

module.exports = { registerRoutesForModel };
