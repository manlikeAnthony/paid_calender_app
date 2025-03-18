const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "must provide the email"],
  },
  title: {
    type: String,
    required: [true, "must provide title"],
  },
  date: {
    type: Date,
    required: [true, "must provide date"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  notified: {
    type: Boolean,
    default: false,
  },
  archived:{
    type:Boolean,
    default:false
  },
  flagged:{
    type:String,
    enum :{
      values:['red','orange','green', 'none'],
      message:'{VALUE} is not supported color'
    },
    default : 'none'
  }
},{timestamps:true});

module.exports = mongoose.model("Task", TaskSchema);
