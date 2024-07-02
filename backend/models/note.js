const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// const Note = ({
//     header,
//     date,
//     description,
//     categories,
//     publicity,
//     onEdit,
//     onDelete,
//     changePublicity,
//   })
const noteSchema = new Schema({
  header: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  publicity: {
    type: Boolean,
    default: true,
  },
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: new Date().getTime(),
  },
  editDate: {
    type: Date,
    default: new Date().getTime(),
  },
});

module.exports = mongoose.model("Note", noteSchema);
