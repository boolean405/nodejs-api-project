const mongoose = require("mongoose");
const { Schema } = mongoose;

const SubCategorySchema = new Schema({
  name: { type: String, require: true, unique: true },
  image: { type: String, require: true },
  parent_category: { type: Schema.Types.ObjectId, ref: "category" },
  child_categories: [{ type: Schema.Types.ObjectId, ref: "child_category" }],
  created_at: { type: Date, default: Date.now },
});

const SubCategory = mongoose.model("sub_category", SubCategorySchema);
module.exports = SubCategory;
