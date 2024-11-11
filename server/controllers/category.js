const DB = require("../models/category");
const Helper = require("../utils/helper");

const all = async (req, res, next) => {
  let result = await DB.find().populate({
    path: "sub_categories",
    populate: {
      path: "child_categories",
      model: "child_category",
    },
  });
  Helper.fMsg(res, "All Categories", result);
};

const add = async (req, res, next) => {
  const db_cat = await DB.findOne({ name: req.body.name });
  if (db_cat) {
    next(new Error(`${db_cat.name} Category name is already exist`));
  } else {
    if (req.body.free_pickup_zone)
      req.body.free_pickup_zone = Helper.splitTrim(req.body.free_pickup_zone);

    if (req.body.extra_charge_pickup_zone)
      req.body.extra_charge_pickup_zone = Helper.splitTrim(
        req.body.extra_charge_pickup_zone
      );

    let result = await new DB(req.body).save();
    Helper.fMsg(res, "Category Uploaded", result);
  }
};

const get = async (req, res, next) => {
  let db_cat = await DB.findById(req.params.id);
  if (db_cat) {
    Helper.fMsg(res, "Single Category", db_cat);
  } else {
    next(new Error("No Category with that id"));
  }
};

const patch = async (req, res, next) => {
  let db_cat = await DB.findById(req.params.id);
  if (db_cat) {
    let exist_cat = await DB.findOne({ name: req.body.name });
    if (exist_cat) {
      next(new Error("Category is already exist"));
    } else {
      if (req.body.free_pickup_zone) {
        req.body.free_pickup_zone = Helper.splitTrim(req.body.free_pickup_zone);
      }
      if (req.body.extra_charge_pickup_zone) {
        req.body.extra_charge_pickup_zone = Helper.splitTrim(
          req.body.extra_charge_pickup_zone
        );
      }
      await DB.findByIdAndUpdate(db_cat._id, req.body);
      let result = await DB.findById(req.params.id);
      if (db_cat.name === req.body.name) {
        Helper.fMsg(
          res,
          "Nothing changed to Original Category because of the same Category Name",
          result
        );
      } else {
        Helper.fMsg(res, "Category Updated", result);
      }
    }
  } else {
    next(new Error("No Category with that id"));
  }
};

const drop = async (req, res, next) => {
  let db_cat = await DB.findById(req.params.id);
  if (db_cat) {
    let cat = db_cat.name;
    await DB.findByIdAndDelete(db_cat._id);
    Helper.fMsg(res, `${cat} Category Deleted`);
  } else {
    next(new Error("No Category with that id"));
  }
};

module.exports = {
  all,
  add,
  get,
  patch,
  drop,
};
