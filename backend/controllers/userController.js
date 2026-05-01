const userService = require('../services/userService');

const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Error fetching users' });
  }
};

module.exports = {
  getUsers
};
