const DB = require("../models/sub_category");
const CategoryDB = require("../models/category");
const Helper = require("../utils/helper");

const all = async (req, res, next) => {
  let db_sub_cat = await DB.find().populate("parent_category");
  Helper.fMsg(res, "All Sub Categories", result);
};

const add = async (req, res, next) => {
  const db_sub_cat = await DB.findOne({ name: req.body.name });
  if (db_sub_cat) {
    next(new Error(`${db_sub_cat.name} Sub Category name is already exist`));
  } else {
    let db_cat = await CategoryDB.findById(req.body.parent_category);
    if (db_cat) {
      let subCat = await new DB(req.body).save();
      await CategoryDB.findByIdAndUpdate(db_cat._id, {
        $push: { sub_categories: subCat._id },
      });
      let result = await DB.findById(subCat._id).populate("parent_category");
      Helper.fMsg(res, "Sub Category Uploaded", result);
    } else {
      next(new Error("No Category with that id"));
    }
  }
};

const get = async (req, res, next) => {
  let db_sub_cat = await DB.findById(req.params.id).populate("parent_category");
  if (db_sub_cat) {
    Helper.fMsg(res, "Single Sub Category", db_sub_cat);
  } else {
    next(new Error("No Sub Category with that id"));
  }
};

const patch = async (req, res, next) => {
  let db_sub_cat = await DB.findById(req.params.id);
  if (db_sub_cat) {
    let exist_sub_cat = await DB.findOne({ name: req.body.name });
    if (exist_sub_cat) {
      next(new Error("Sub Category is already exist"));
    } else {
      await DB.findByIdAndUpdate(db_sub_cat._id, req.body);
      let result = await DB.findById(req.params.id).populate("parent_category");
      if (db_sub_cat.name === req.body.name) {
        Helper.fMsg(
          res,
          "Nothing changed to Original Sub Category because of the same Sub Category Name",
          result,
        );
      } else {
        Helper.fMsg(res, "Sub Category Updated", result);
      }
    }
  } else {
    next(new Error("No Sub Category with that id"));
  }
};

const drop = async (req, res, next) => {
  let db_sub_cat = await DB.findById(req.params.id);
  if (db_sub_cat) {
    let cat = db_sub_cat.name;
    await CategoryDB.findByIdAndUpdate(db_sub_cat.parent_category._id, {
      $pull: { sub_categories: db_sub_cat._id },
    });
    await DB.findByIdAndDelete(db_sub_cat._id);
    Helper.fMsg(res, `${cat} Sub Category Deleted`);
  } else {
    next(new Error("No Sub Category with that id"));
  }
};

module.exports = {
  all,
  add,
  get,
  patch,
  drop,
};
