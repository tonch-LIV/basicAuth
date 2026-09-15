'use strict';

// 4 parameters needed for error-specific middleware
function handleServerError(error, req, res, next) {
  res.status(500).json({
    status: 500,
    message: error.message || error,
  });
}

module.exports = handleServerError;