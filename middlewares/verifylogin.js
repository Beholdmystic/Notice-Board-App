const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyLogin = async (req, res, next) => {
  try {
    const token = req.header("Authorization"); //.authorization.split(" ")[1];
    //split means space not more than that
    //after split data comes in array
    //and [1] indicates taking 2nd element of array
    if (!token) {
      return res.send({
        status: "fail",
        data: {
          login:
            "Cannot access the content that you are looking for! Please login to Continue",
        },
      });
    }

    const user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const result = await User.findById(user._id);
    req.user = result;
    next();
  } catch (ex) {
    console.log(ex);
    return res.send({ status: "error", message: "Access Denied" });
  }
};

module.exports = { verifyLogin };
//module.exports.verifyLogin = verifyLogin; same as above better one is above for me.
