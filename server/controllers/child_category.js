const DB = require("../models/child_category");
const Helper = require("../utils/helper");
const SubCategoryDB = require("../models/sub_category");

const all = async (req, res, next) => {
  let db_child_cat = await DB.find().populate("sub_category");
  Helper.fMsg(res, "All Child Categories", db_child_cat);
};

const get = async (req, res, next) => {
  let db_child_cat = await DB.findById(req.params.id);
  if (db_child_cat) {
    Helper.fMsg(res, "Single ChildCategory", db_child_cat);
  } else {
    next(new Error("No Child Category with that id"));
  }
};

const add = async (req, res, next) => {
  let db_child_cat = await DB.findOne({ name: req.body.name });
  if (db_child_cat) {
    next(new Error("Child Category is already exist"));
  } else {
    let sub_cat = await SubCategoryDB.findById(req.body.sub_category);
    if (sub_cat) {
      let childCat = await new DB(req.body).save();
      await SubCategoryDB.findByIdAndUpdate(sub_cat._id, {
        $push: { child_categories: childCat._id },
      });
      let result = await DB.findById(childCat._id).populate("sub_category");
      Helper.fMsg(res, "Child Category Saved", result);
    } else {
      next(new Error("No Sub Category with that id"));
    }
  }
};

const patch = async (req, res, next) => {
  let db_child_cat = await DB.findById(req.params.id);
  if (db_child_cat) {
    let exist_child_cat = await DB.findOne({ name: req.body.name });
    if (exist_child_cat) {
      next(new Error("Child Category is already exist"));
    } else {
      await DB.findByIdAndUpdate(db_child_cat._id, req.body);
      let result = await DB.findById(req.params.id);
      Helper.fMsg(res, "Child Category Updated", result);
    }
  } else {
    next(new Error("No Child Category with that id"));
  }
};

const drop = async (req, res, next) => {
  let db_child_cat = await DB.findById(req.params.id);
  if (db_child_cat) {
    await SubCategoryDB.findByIdAndUpdate(db_child_cat.sub_category._id, {
      $pull: { child_categories: db_child_cat._id },
    });
    await DB.findByIdAndDelete(db_child_cat._id);
    Helper.fMsg(res, `${db_child_cat.name} ChildCategory Deleted`);
  } else {
    next(new Error("No Child Category with that id"));
  }
};

module.exports = {
  all,
  add,
  get,
  patch,
  drop,
};
