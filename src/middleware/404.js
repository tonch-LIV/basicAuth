'use strict';

function handleNotFound(req, res) {
  res.status(404).json({
    status: 404,
    message: 'Not Found',
    route: req.path,
  });
}

module.exports = handleNotFound;