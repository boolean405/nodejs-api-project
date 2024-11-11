const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  phone: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  roles: [{ type: Schema.Types.ObjectId, ref: "role" }],
  permits: [{ type: Schema.Types.ObjectId, ref: "permit" }],
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
