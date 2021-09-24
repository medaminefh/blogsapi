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
    if (!token) return (req.isAuthorized = false);

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

module.exports = { auth, userIsAdmin };
