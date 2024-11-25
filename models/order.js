const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "user", require: true },
  items: [{ type: Schema.Types.ObjectId, ref: "order_item" }],
  count: { type: Number, require: true },
  total: { type: Number, require: true },
  created_at: { type: Date, default: Date.now },
});

const Order = mongoose.model("order", OrderSchema);
module.exports = Order;
