const mongoose = require("mongoose");
const { Schema } = mongoose;

const ChildCategorySchema = new Schema({
  name: { type: String, require: true, unique: true },
  image: { type: String, require: true },
  sub_category: { type: Schema.Types.ObjectId, ref: "sub_category" },
  created_at: { type: Date, default: Date.now },
});

const ChildCategory = mongoose.model("child_category", ChildCategorySchema);
module.exports = ChildCategory;
