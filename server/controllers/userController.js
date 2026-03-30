const userService = require('../services/userService');

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5; 
    const search = req.query.search || '';

    const paginationData = await userService.getUsersPaginated(page, limit, search);
    
    res.status(200).json({ success: true, ...paginationData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};