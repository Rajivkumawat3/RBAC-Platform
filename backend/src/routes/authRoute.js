const express = require('express');
const { register, login, logout, getUserDetails } = require('../controllers/authController');
const {isAuthenticatedUser}=require('../middleware/auth')
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.route("/me").get( isAuthenticatedUser ,getUserDetails)

module.exports = router;
