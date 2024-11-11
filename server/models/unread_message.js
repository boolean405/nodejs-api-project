const mongoose = require("mongoose");
const { Schema } = mongoose;

const UnreadMessageSchema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: "user", require: true },
  to: { type: Schema.Types.ObjectId, ref: "user", require: true },
  created_at: { type: Date, default: Date.now },
});

const UnreadMessage = mongoose.model("unread_message", UnreadMessageSchema);
module.exports = UnreadMessage;
