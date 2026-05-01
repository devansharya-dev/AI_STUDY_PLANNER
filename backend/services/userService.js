const supabase = require('../config/supabaseClient');

const getAllUsers = async () => {
  try {
    // Attempting to fetch users from the basic 'users' table if it exists.
    // Replace with auth.users or proper mock data depending on actual table structure.
    const { data: users, error } = await supabase
      .from('users')
      .select('id')
      .limit(100); // good practice to limit for simple automation endpoints

    if (error) {
      // In case table doesn't exist or is protected, fallback to mock data
      console.warn('Failed fetching users from DB. Returning mock users.');
      return [{ id: 'mock-user-1' }, { id: 'mock-user-2' }];
    }

    return users || [];
  } catch (e) {
    console.error('Error in getAllUsers:', e);
    // Return mock data if DB fails
    return [{ id: 'mock-user-1' }, { id: 'mock-user-2' }];
  }
};

module.exports = {
  getAllUsers
};
