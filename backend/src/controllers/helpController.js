const HelpQuery = require('../models/HelpQuery');

const submitHelpQuery = async (req, res) => {
  try {
    const { subject, body } = req.body;

    if (!subject || !body) {
      return res.status(400).json({ message: 'Subject and body are required' });
    }

    const helpQuery = await HelpQuery.create({
      subject,
      body
    });

    res.status(201).json({
      message: 'Help query submitted successfully',
      query: {
        id: helpQuery._id,
        subject: helpQuery.subject,
        body: helpQuery.body,
        createdAt: helpQuery.createdAt
      }
    });
  } catch (error) {
    console.error('Help query error:', error);
    res.status(500).json({ message: 'Server error while submitting help query' });
  }
};

const getAllHelpQueries = async (req, res) => {
  try {
    const helpQueries = await HelpQuery.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Help queries retrieved successfully',
      queries: helpQueries
    });
  } catch (error) {
    console.error('Get help queries error:', error);
    res.status(500).json({ message: 'Server error while retrieving help queries' });
  }
};

module.exports = {
  submitHelpQuery,
  getAllHelpQueries
};
