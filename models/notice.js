const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Notice = mongoose.model(
  "Notice",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 50,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
      minlength: 15,
      maxlength: 120,
    },
    users: { type: Schema.Types.ObjectId, ref: "User", required: true },
  })
);

module.exports = Notice;
