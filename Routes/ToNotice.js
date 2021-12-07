const express = require("express");
const Notice = require("../models/notice");
const {
  noticeValidation,
  editNoticeValidation,
} = require("../validation/validation");
const multer = require("multer");
const { validationResult } = require("express-validator");
const { verifyLogin } = require("../middlewares/verifylogin");
const { noticePermission } = require("../middlewares/authorization");

const storage = multer.diskStorage({
  //Where the incoming file should be stored is(destination)
  //There is request, file and call back
  //You get the request to the folder, access to the file and call back function
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },

  //It shows how the file name should be define
  filename: function (req, file, cb) {
    //we put the Date.now() function because it gives the date stamp(when we uploaded the image) and makes it unique.
    cb(null, Date.now() + "_" + file.originalname);
  },
});

//filtering the requested file
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//limiting the size of file
const uploads = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

const type = uploads.single("image");

const router = express.Router();

//get all notice
router.get("/", async (req, res) => {
  try {
    await Notice.find({})
      .populate("users", "_id")
      .exec((error, notice) => {
        if (error) {
          return res.send({ status: "error", message: error });
        }
        return res.status(200).send({
          status: "success",
          results: notice.length, //optional just to see how many notice are there
          data: { notice: notice },
        });
      });
  } catch (ex) {
    return res
      .status(400)
      .send({ status: "error", message: "Something went wrong" });
  }
});

//to get posted notice
router.get("/mynotice", verifyLogin, async (req, res) => {
  try {
    const user = req.user;
    Notice.find({ users: user._id }, (error, notice) => {
      if (error) {
        return res.status(400).send({
          status: "error",
          message: "Error!! while getting your notices",
        });
      }
      return res
        .status(200)
        .send({ status: "success", data: { notice: notice } });
    });
  } catch (ex) {
    return res
      .status(400)
      .send({ status: "error", message: "Cannot get notices" });
  }
});

//to post notice
router.post("/", type, verifyLogin, noticeValidation(), async (req, res) => {
  //validationResult(req) = extracts the validation errors from a request and makes them available in a result object
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //Returns: a boolean indicating whether this result object contains no errors at all.
    const param = errors.array()[0].param;
    const error = errors.array()[0].msg;
    return res.send({ status: "fail", data: { [param]: error } });
  }
  if (!req.file) {
    return res
      .status(400)
      .send({ status: "fail", data: { image: "No file selected" } });
  }

  try {
    const user = req.user;
    console.log(user);
    const noticeDetails = {
      title: req.body.title,
      image: req.file.path,
      description: req.body.description,
      users: req.user._id,
    };

    const notice = new Notice(noticeDetails);
    const result = await notice.save();
    return res.send({ status: "Success", data: { notice: result } });
  } catch (ex) {
    return res.send({ status: "error", message: ex.message });
  }
});

//to delete notice
router.delete(
  "/:id",
  verifyLogin,
  noticePermission,

  async (req, res) => {
    const id = req.params.id;
    try {
      Notice.deleteOne({ _id: id }, (error, result) => {
        if (error) {
          return res
            .status(400)
            .send({ status: "error", message: error.message });
        }
        return res.status(200).send({ status: "Sucess", data: null });
      });
    } catch (ex) {
      return res.status(404).send({ status: "error", message: ex.message });
    }
  }
);

//to update notice
router.put(
  "/:id",
  verifyLogin,
  noticePermission,
  type,
  editNoticeValidation(),
  async (req, res) => {
    const id = req.params.id;
    try {
      Notice.findOne({ _id: id }, (error, notice) => {
        if (error)
          return res
            .status(400)
            .send({ status: "error", message: "Something went wrong" });
        if (!notice)
          return res
            .status(400)
            .send({ status: "fail", data: { notice: "No notice exists" } });

        if (!req.body.title && !req.body.description && !req.file) {
          return res.status(400).send({
            status: "fail",
            data: { update: "Atleast try to update a field" },
          });
        }
        if (req.body.title) {
          notice.title = req.body.title;
        }
        if (req.body.description) {
          notice.description = req.body.description;
        }
        if (req.file) {
          notice.image = req.file.path;
        }
        notice.save((error, result) => {
          if (error) {
            return res
              .status(400)
              .send({ status: "error", message: error.message });
          }
          return res
            .status(200)
            .send({ status: "success", data: { notice: "updated" } });
        });
      });
    } catch (ex) {
      return res
        .status(400)
        .send({ status: "error", message: "Something went pretty wrong" });
    }
  }
);

module.exports = router;
