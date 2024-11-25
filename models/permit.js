const mongoose = require("mongoose");
const { Schema } = mongoose;

const PermitSchema = new Schema({
  name: { type: String, require: true, unique: true },
  created_at: { type: Date, default: Date.now },
});

const Permit = mongoose.model("permit", PermitSchema);
module.exports = Permit;
