const { body } = require("express-validator");

const RegisteruserValidation = () => {
  return [
    body("name")
      .isLength({ min: 4 })
      .withMessage("Name must be at least 4 character long"),

    body("email")
      .isEmail()
      .withMessage("Invalid Email")
      .isLength({ min: 10, max: 50 }),

    body("password")
      .isLength({ min: 7, max: 25 })
      .withMessage(
        "Password length must be minimum 7 character and maximum 25 character long"
      ),
  ];
};

const LoginuserValidation = () => {
  return [
    body("email")
      .isEmail()
      .withMessage("Invalid Email")
      .isLength({ min: 10, max: 50 }),

    body("password")
      .isLength({ min: 7, max: 25 })
      .withMessage(
        "Password length must be minimum 7 character and maximum 25 character long"
      ),
  ];
};

const noticeValidation = () => {
  return [
    body("title")
      .isString()
      .withMessage("Not a valid title")
      .isLength({ min: 8, max: 50 })
      .withMessage(
        "Title must be minimum 8 character and maximum 50 character long"
      ),
    body("description")
      .isString()
      .withMessage("Not a valid description")
      .isLength({ min: 15, max: 120 })
      .withMessage(
        "Description must exceed 15 and should be less than 120 character"
      ),
  ];
};

const editNoticeValidation = () => {
  return [
    body("title")
      .optional()
      .isString()
      .withMessage("Not a valid title")
      .isLength({ min: 8, max: 50 })
      .withMessage(
        "Title must be minimum 8 character and maximum 50 character long"
      ),
    body("description")
      .optional()
      .isString()
      .withMessage("Not a valid description")
      .isLength({ min: 15, max: 120 })
      .withMessage(
        "Description must exceed 15 and should be less than 120 character"
      ),
  ];
};

module.exports = {
  RegisteruserValidation,
  LoginuserValidation,
  noticeValidation,
  editNoticeValidation,
};
