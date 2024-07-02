const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String },
  lastName: { type: String },
  username: { type: String },
  email: { type: String },
  password: { type: String },
  creationTime: { type: Date, default: new Date().getTime() },
});

module.exports = mongoose.model("User", userSchema);
