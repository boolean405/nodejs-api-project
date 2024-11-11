const mongoose = require("mongoose");
const { Schema } = mongoose;

const DeliverySchema = new Schema({
  name: { type: String, require: true, unique: true },
  price: { type: Number, require: true },
  duration: { type: String, require: true },
  image: { type: String, require: true },
  remarks: { type: Array },
  created_at: { type: Date, default: Date.now },
});

const Delivery = mongoose.model("delivery", DeliverySchema);
module.exports = Delivery;
