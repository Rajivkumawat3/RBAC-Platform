const User = require('../model/User');
const sendToken=require("../utils/jwtToken")

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const user = await User.create({ name, email, password, role: role || 'Viewer' });

    sendToken(user, 201, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ error: 'Invalid credentials' });

    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
    });

    if (!user)
      return res.status(404).json({ error: 'User not found' });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: error });
  }
};