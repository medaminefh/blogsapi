const jwt = require("jsonwebtoken");
const { JWT } = process.env;

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(400).json({ msg: "Invalid Authentication." });

    jwt.verify(token, JWT, (err, _) => {
      if (err) {
        return res.status(400).json({ msg: "Invalid Authentication." });
      }

      req.isAuthorized = true;
      next();
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const userIsAdmin = (req, _, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      req.isAuthorized = false;
      next();
    }

    jwt.verify(token, JWT, (err, _) => {
      if (err) {
        return (req.isAuthorized = false);
      }

      req.isAuthorized = true;
      next();
    });
  } catch (err) {
    return (req.isAuthorized = false);
  }
};


function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  /* eslint-enable no-unused-vars */
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
}

module.exports = { auth, userIsAdmin,  notFound,
  errorHandler };
