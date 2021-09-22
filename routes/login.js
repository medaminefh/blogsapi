const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { JWT } = process.env;
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const Admin = require("../models/admin");

// Create admin or Signin admin
router.post("/", async (req, res) => {
  try {
    const { token: Token } = req.body;
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: Token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    console.log(ticket);
    console.log(ticket.getPayload());
    const { name, email } = ticket.getPayload();
    const admin = await Admin.find();

    //login
    if (admin.length !== 1) return res.status(400).json({ err: "No Admin" });
    const { username: adminUsername, email: adminEmail } = admin[0];

    if (name !== adminUsername || email !== adminEmail)
      return res.status(400).json({
        msg: "You're Not Supposed to be Here 😟, Get The Fuck Out Of Here",
      });

    req.isAuthorized = true;
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
