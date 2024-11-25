const DB = require("../models/delivery");
const Helper = require("../utils/helper");

const all = async (req, res, next) => {
  let db_delivery = await DB.find();
  Helper.fMsg(res, "All Deliveries", db_delivery);
};

const get = async (req, res, next) => {
  let db_delivery = await DB.findById(req.params.id);
  if (db_delivery) {
    Helper.fMsg(res, "Single Delivery", db_delivery);
  } else {
    next(new Error("No Delivery with that id"));
  }
};

const add = async (req, res, next) => {
  let db_delivery = await DB.findOne({ name: req.body.name });
  if (db_delivery) {
    next(new Error("Delivery is already exist"));
  } else {
    if (req.body.remarks) {
      Helper.splitTrim(req.body.remarks);
    }
    let result = await new DB(req.body).save();
    Helper.fMsg(res, "Delivery Saved", result);
  }
};

const patch = async (req, res, next) => {
  let db_delivery = await DB.findById(req.params.id);
  if (db_delivery) {
    let exist_delivery = await DB.findOne({ name: req.body.name });
    if (exist_delivery) {
      next(new Error("Delivery is already exist"));
    } else {
      if (req.body.remarks) {
        Helper.splitTrim(req.body.remarks);
      }
      await DB.findByIdAndUpdate(db_delivery._id, req.body);
      let result = await DB.findById(req.params.id);
      if (db_delivery.name === req.body.name) {
        Helper.fMsg(
          res,
          "Nothing changed to Original Delivery because of the same Delivery Name",
          result,
        );
      } else {
        Helper.fMsg(res, "Delivery Updated", result);
      }
    }
  } else {
    next(new Error("No Delivery with that id"));
  }
};

const drop = async (req, res, next) => {
  let db_delivery = await DB.findById(req.params.id);
  if (db_delivery) {
    await DB.findByIdAndDelete(db_delivery._id);
    Helper.fMsg(res, `${db_delivery.name} Delivery Deleted`);
  } else {
    next(new Error("No Delivery with that id"));
  }
};

module.exports = {
  all,
  add,
  get,
  patch,
  drop,
};
