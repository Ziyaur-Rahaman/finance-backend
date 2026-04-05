const {
  getAllUsers,
  findUserById,
  updateUserRole,
  updateUserStatus
} = require('../models/userModel');

const { successResponse, errorResponse } = require('../utils/response');


function getUsers(req, res) {
  try {
    const users = getAllUsers();
    return successResponse(res, { users });

  } catch (error) {
    console.error('Get users error:', error);
    return errorResponse(res, 'Something went wrong', 500);
  }
}


function getUser(req, res) {
  try {
    
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return errorResponse(res, 'Invalid user ID', 400);
    }

    const user = findUserById(userId);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, { user });

  } catch (error) {
    console.error('Get user error:', error);
    return errorResponse(res, 'Something went wrong', 500);
  }
}


function changeUserRole(req, res) {
  try {
    const userId = parseInt(req.params.id);
    const { role } = req.body;


    if (isNaN(userId)) {
      return errorResponse(res, 'Invalid user ID', 400);
    }

   
    const allowedRoles = ['viewer', 'analyst', 'admin'];
    if (!role || !allowedRoles.includes(role)) {
      return errorResponse(
        res,
        'Role must be one of: viewer, analyst, admin',
        400
      );
    }

  
    const user = findUserById(userId);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }


    if (userId === req.user.id) {
      return errorResponse(res, 'You cannot change your own role', 400);
    }

  
    updateUserRole(userId, role);

    return successResponse(res, {
      message: `User role updated to ${role}`,
      userId,
      newRole: role
    });

  } catch (error) {
    console.error('Change role error:', error);
    return errorResponse(res, 'Something went wrong', 500);
  }
}


function changeUserStatus(req, res) {
  try {
    const userId = parseInt(req.params.id);
    const { is_active } = req.body;

    
    if (isNaN(userId)) {
      return errorResponse(res, 'Invalid user ID', 400);
    }

  
    if (typeof is_active !== 'boolean') {
      return errorResponse(res, 'is_active must be true or false', 400);
    }

  
    const user = findUserById(userId);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

   
    if (userId === req.user.id) {
      return errorResponse(res, 'You cannot deactivate your own account', 400);
    }

    updateUserStatus(userId, is_active ? 1 : 0);

    const statusText = is_active ? 'activated' : 'deactivated';

    return successResponse(res, {
      message: `User account ${statusText} successfully`,
      userId,
      is_active
    });

  } catch (error) {
    console.error('Change status error:', error);
    return errorResponse(res, 'Something went wrong', 500);
  }
}

module.exports = {
  getUsers,
  getUser,
  changeUserRole,
  changeUserStatus
};