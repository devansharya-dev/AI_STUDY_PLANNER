const syllabusService = require('../services/syllabusService');

const createSyllabus = async (req, res) => {
  try {
    const userId = req.user.id;
    const syllabus = await syllabusService.createSyllabus(userId, req.body);
    return res.status(201).json({ message: 'Syllabus created successfully', data: syllabus });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Error creating syllabus' });
  }
};

module.exports = {
  createSyllabus
};
