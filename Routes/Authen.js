const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { LoginuserValidation } = require("../validation/validation");
const { body, validationResult } = require("express-validator");

const router = express.Router();

router.post(
  "/",
  LoginuserValidation(),
  body("password")
    .exists()
    .isString()
    .isLength({ min: 5 })
    .withMessage("Invalid password"),

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
      }
      console.log(req.body);
      let users = await User.findOne({ email: req.body.email });
      console.log(users);
      if (!users) {
        return res
          .status(400)
          .send({ status: "Error", message: "User cannot be found" });
      }
      const validatePassword = await bcrypt.compare(
        req.body.password,
        users.password
      );
      console.log(validatePassword);
      if (!validatePassword) {
        return res
          .status(400)
          .send({ status: "Error", message: "Invalid Password" });
      }
      const token = jwt.sign({ _id: users._id }, process.env.JWT_PRIVATE_KEY);
      res.header("x-auth-token", token).send(token);
    } catch (error) {
      return res.status(400).json({ status: "Error", message: error.message });
    }
  }
);

module.exports = router;
