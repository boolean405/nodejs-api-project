const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageSchema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: "user", require: true },
  to: { type: Schema.Types.ObjectId, ref: "user", require: true },
  type: { type: String, enum: ["text", "image"], default: "text" },
  msg: { type: String, require: true },
  created_at: { type: Date, default: Date.now },
});

const Message = mongoose.model("message", MessageSchema);
module.exports = Message;
