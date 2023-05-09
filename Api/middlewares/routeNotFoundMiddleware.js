// import not found error
const { NotFoundError } = require("../errors");

// Create route not found middleware
const routeNotFound = (req, res) => {
  throw new NotFoundError("Route not Found!");
};

// export middleware
module.exports = routeNotFound;
