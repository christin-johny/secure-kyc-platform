const User = require('../models/User');

// SRP: Only handles querying the database with pagination and search logic
exports.getUsersPaginated = async (page = 1, limit = 5, search = '') => {
  // We use regex for a "LIKE" search on Name OR Email, completely case insensitive ($options: 'i')
  const query = {
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ]
  };

  // Skip calculates how many records to jump over based on the current page
  const startIndex = (page - 1) * limit;
  const total = await User.countDocuments(query);
  const users = await User.find(query).skip(startIndex).limit(limit);

  return {
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
    data: users
  };
};
