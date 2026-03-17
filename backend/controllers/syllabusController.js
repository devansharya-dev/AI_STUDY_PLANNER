const syllabusService = require('../services/syllabusService');

const createSyllabus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, content } = req.body;
    const file = req.file;

    const syllabus = await syllabusService.createSyllabus(userId, { 
      title, 
      description, 
      content, 
      file 
    });

    return res.status(201).json({ 
      message: 'Syllabus created and topics extracted successfully', 
      data: syllabus 
    });
  } catch (error) {
    console.error('Error creating syllabus:', error);
    return res.status(400).json({ error: error.message || 'Error creating syllabus' });
  }
};

module.exports = {
  createSyllabus
};
