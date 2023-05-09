// import custom error
const { CustomError } = require("../errors");

// Create error handler middleware
const errorHandler = (err, req, res, next) => {
  // if error is a custom error
  if (err instanceof CustomError) {
    // return error message
    return res.status(err.status).json({ msg: err.message });
  }

  console.log(err);

  // return generic error message
  return res
    .status(500)
    .json({ msg: "Something went wrong, please try again later" });
};

// export middleware
module.exports = errorHandler;
