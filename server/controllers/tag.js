const DB = require("../models/tag");
const Helper = require("../utils/helper");

const all = async (req, res, next) => {
  let db_tag = await DB.find();
  Helper.fMsg(res, "All Tag", db_tag);
};

const get = async (req, res, next) => {
  let db_tag = await DB.findById(req.params.id);
  if (db_tag) {
    Helper.fMsg(res, "Single Tag", db_tag);
  } else {
    next(new Error("No Tag with that id"));
  }
};

const add = async (req, res, next) => {
  let db_tag = await DB.findOne({ name: req.body.name });
  if (db_tag) {
    next(new Error("Tag is already exist"));
  } else {
    let result = await new DB(req.body).save();
    Helper.fMsg(res, "Tag Saved", result);
  }
};

const patch = async (req, res, next) => {
  let db_tag = await DB.findById(req.params.id);
  if (db_tag) {
    let exist_tag = await DB.findOne({ name: req.body.name });
    if (exist_tag) {
      next(new Error("Tag is already exist"));
    } else {
      await DB.findByIdAndUpdate(db_tag._id, req.body);
      let result = await DB.findById(req.params.id);
      if (db_tag.name === req.body.name) {
        Helper.fMsg(
          res,
          "Nothing changed to Original Tag because of the same Tag Name",
          result,
        );
      } else {
        Helper.fMsg(res, "Tag Updated", result);
      }
    }
  } else {
    next(new Error("No Tag with that id"));
  }
};

const drop = async (req, res, next) => {
  let db_tag = await DB.findById(req.params.id);
  if (db_tag) {
    await DB.findByIdAndDelete(db_tag._id);
    Helper.fMsg(res, `${db_tag.name} Tag Deleted`);
  } else {
    next(new Error("No Tag with that id"));
  }
};

module.exports = {
  all,
  add,
  get,
  patch,
  drop,
};
