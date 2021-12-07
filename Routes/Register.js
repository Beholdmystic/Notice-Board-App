const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { RegisteruserValidation } = require("../validation/validation");

const router = express.Router();

router.post("/", RegisteruserValidation(), async (req, res) => {
  //Extracts the validation erros from request and makes them
  //available in a result object
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //location of the param that generated this error,
    //It's either body,query,params,cookies or headers.
    const param = errors.array()[0].param;
    const error = errors.array()[0].msg;
    //these param and error are result object
    return res.status(400).send({ status: "fail", data: { [param]: error } });
    //When an API call is rejected due to invalid data or call conditions, the JSend object's data key contains an
    // object explaining what went wrong, typically a hash of validation errors.

    //for failure: should always be set to fail
    // for data: if the reason for failure correspond to post values then, the response object's keys
    //should correspond to those post values.
  }
  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    roles: req.body.roles,
  };
  const salt = await bcrypt.genSalt(10);
  userData.password = await bcrypt.hash(userData.password, salt);
  //10 is a example of salt
  //A salt is random text added to the string to be hashed. For example, you don't hash my_secret_password;
  // you hash something like 1jfSLKe$*@SL$#)(Sslkfs$34:my_secret_password.
  try {
    User.find({ email: req.body.email }, async (error, users) => {
      if (error)
        return res
          .status(500)
          .send({ status: "error", message: error.message });

      if (users.length > 0) {
        res.status(400).send({
          status: "fail",
          data: { user: "User is already registered" },
        });
        return;
      } else {
        const user = new User(userData);
        const result = await user.save();
        return res.send({ status: "success", data: { user: user } });
      }
    });
  } catch (ex) {
    res.status(500).send({ status: "error", message: ex.message });
  }
});

module.exports = router;
