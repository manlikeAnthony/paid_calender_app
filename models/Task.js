const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "must provide the email"],
  },
  title: {
    type: String,
    required: [true, "must provide email"],
  },
  date: {
    type: Date,
    required: [true, "must provide date"],
  },
  notified: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("Task", TaskSchema);
