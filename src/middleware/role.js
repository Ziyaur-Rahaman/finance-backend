const { errorResponse } = require('../utils/response');


function authorize(...allowedRoles) {

  
  return function(req, res, next) {

    
    if (!req.user) {
      return errorResponse(res, 'Authentication required', 401);
    }

    const userRole = req.user.role;

    
    if (!allowedRoles.includes(userRole)) {
      return errorResponse(
        res,
        `Access denied. Required role: ${allowedRoles.join(' or ')}`,
        403
      );
    }

    
    next();
  };
}

module.exports = { authorize };