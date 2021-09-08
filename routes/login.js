const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { JWT } = process.env;
const bcrypt = require("bcrypt");
const Admin = require("../models/admin");

// Create admin or Signin admin
router.post("/", async (req, res) => {
  try {
    const { username, password, status } = req.body;
    const admin = await Admin.find();
    if (status) {
      // check if there is already a user
      console.log(admin.length);
      if (admin.length) return res.status(400).json({ err: "Go Login" });

      // hash the password
      const passwordHash = await bcrypt.hash(password, 12);

      // create admin
      const newAdmin = new Admin({
        username,
        password: passwordHash,
      });
      // save that admin into the db
      await newAdmin.save();
      const token = jwt.sign(
        {
          newAdmin,
        },
        JWT
      );
      return res.status(200).json({ msg: "Done! 😎", token });
    }

    //login
    if (admin.length !== 1) return res.status(400).json({ err: "No Admin" });
    const { username: adminUsername, password: adminPassword } = admin[0];

    if (username !== adminUsername)
      return res.status(400).json({ msg: "username don't much" });

    const isMatch = await bcrypt.compare(password, adminPassword);

    if (!isMatch)
      return res.status(400).json({ msg: "Password is incorrect." });
    req.user = admin[0];
    const token = jwt.sign(
      {
        admin: admin[0],
      },
      JWT
    );
    return res.json({ msg: "Login success! 🤩", token });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
