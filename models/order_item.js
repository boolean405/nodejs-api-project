const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "product", require: true },
  order: { type: Schema.Types.ObjectId, ref: "order", require: true },
  status: {
    type: String,
    enum: [
      "ACCEPT",
      "CANCELED",
      "PREPARING",
      "DELIVERING",
      "DELIVERED",
      "DELIVERY FAILED",
    ],
    default: "ACCEPT",
  },
  name: { type: String, require: true },
  price: { type: Number, require: true },
  count: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now },
});

const OrderSchema = mongoose.model("order_item", OrderItemSchema);
module.exports = OrderSchema;
