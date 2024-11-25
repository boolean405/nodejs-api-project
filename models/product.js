const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: { type: String, require: true, unique: true },
  category: { type: Schema.Types.ObjectId, ref: "category" },
  sub_category: { type: Schema.Types.ObjectId, ref: "sub_category" },
  child_category: { type: Schema.Types.ObjectId, ref: "child_category" },
  tags: [{ type: Schema.Types.ObjectId, ref: "tag" }],
  delivery: { type: Schema.Types.ObjectId, ref: "delivery" },
  price: { type: Number, require: true },
  discount: { type: Number, default: 0 },
  rating: { type: Number, require: true },
  desc: { type: String, require: true },
  detail: { type: String, require: true },
  max_person: { type: String, require: true },
  duration: { type: String, require: true },
  start_time: { type: String, require: true },
  images: { type: Array, require: true },
  recommended: { type: Array, require: true },
  not_recommended: { type: Array, require: true },
  highlights: { type: Array, require: true },
  included: { type: Array, require: true },
  excluded: { type: Array, require: true },
  to_bring: { type: Array, require: true },
  destinations: { type: Array, require: true },
  expect_detail: { type: Array, require: true },
  status: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});

const Product = mongoose.model("product", ProductSchema);
module.exports = Product;
