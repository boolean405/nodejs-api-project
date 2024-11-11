const DB = require("../models/permit");
const Helper = require("../utils/helper");

const all = async (req, res, next) => {
  let db_permit = await DB.find();
  Helper.fMsg(res, "All Permits", db_permit);
};

const get = async (req, res, next) => {
  let db_permit = await DB.findById(req.params.id);
  if (db_permit) {
    Helper.fMsg(res, "Single Permit", db_permit);
  } else {
    next(new Error("No Permit with that id"));
  }
};

const add = async (req, res, next) => {
  let db_permit = await DB.findOne({ name: req.body.name });
  if (db_permit) {
    next(new Error("Permit is already exist"));
  } else {
    let result = await new DB(req.body).save();
    Helper.fMsg(res, "Permit Saved", result);
  }
};

const patch = async (req, res, next) => {
  let db_permit = await DB.findById(req.params.id);
  if (db_permit) {
    let exist_permit = await DB.findOne({ name: req.body.name });
    if (exist_permit) {
      next(new Error("Permit is already exist"));
    } else {
      await DB.findByIdAndUpdate(db_permit._id, req.body);
      let result = await DB.findById(req.params.id);
      if (db_permit.name === req.body.name) {
        Helper.fMsg(
          res,
          "Nothing changed to Original Permit because of the same Permit Name",
          result,
        );
      } else {
        Helper.fMsg(res, "Permit Updated", result);
      }
    }
  } else {
    next(new Error("No Permit with that id"));
  }
};

const drop = async (req, res, next) => {
  let db_permit = await DB.findById(req.params.id);
  if (db_permit) {
    let permit = db_permit.name;
    await DB.findByIdAndDelete(db_permit._id);
    Helper.fMsg(res, `${permit} Permit Deleted`);
  } else {
    next(new Error("No Permit with that id"));
  }
};

module.exports = {
  all,
  add,
  get,
  patch,
  drop,
};
