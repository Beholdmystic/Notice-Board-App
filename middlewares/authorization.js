const Notice = require("../models/notice");
const User = require("../models/user");
const { role } = require("../models/user");

//getting user authorization to know whether the user is admin or not

function getUserauthorization(req, res, next) {
  const user = req.user;

  try {
    if (user.role == role.admin) {
      next();
    } else {
      return res
        .status(401)
        .send({ status: "fail", message: "unauthorized access" });
      //401 =Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated".
      //That is, the client must authenticate itself to get the requested response.
    }
  } catch (ex) {
    return res.status(404).send("Something went Wrong!");
  }
}

async function noticePermission(req, res, next) {
  const user = req.user;
  const noticeId = req.params.id;
  try {
    const notice = await Notice.findById(noticeId, { _id: 0 })
      //this is an amazing steps
      //first we select what to populate with in notice model
      //then we replace or populate _id with the user data in another collection
      //then we execute other function
      .populate("users", "_id")
      .exec((error, noticeDetails) => {
        //The exec() method executes a search for a match in a specified string. Returns a result array, or null .
        //or exec() creates a new shell process and executes a command in that shell.
        if (!noticeDetails) {
          return res.status(400).send({
            status: "fail",
            data: { notice: "The notice entered cannot be found" },
          });
        }
        //Populate is way of automatically replacing a path in document with actual documents from other collections.
        // E.g. Replace the user id in a document with the data of that user.
        if (error) {
          return res
            .status(400)
            .send({ status: "error", message: error.message });
        } else {
          if (
            noticeDetails.title._id == user.userId ||
            user.role == role.admin
          ) {
            next();
          } else {
            return res
              .status(400)
              .send({ status: "fail", data: { user: "User not authorized" } });
          }
        }
      });
  } catch (ex) {
    return res
      .status(400)
      .send({ status: "error", message: "Something went pretty wrong" });
  }
}

function deletePermission(req, res, next) {
  const user = req.user;
  try {
    if (user.role == role.admin || user.userId == req.params.id) {
      next();
    } else {
      return res
        .status(401)
        .send({ status: "fail", message: "unauthorized access" });
    }
  } catch (ex) {
    return res.status(400).send({
      status: "error",
      message: "Opps! Something went pretty wrong",
    });
  }
}

module.exports = { getUserauthorization, noticePermission, deletePermission };
