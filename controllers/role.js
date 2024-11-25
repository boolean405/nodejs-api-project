const DB = require("../models/role");
const PermitDB = require("../models/permit");
const Helper = require("../utils/helper");

const all = async (req, res, next) => {
  let db_role = await DB.find().populate("permits");
  Helper.fMsg(res, "All Roles", db_role);
};

const get = async (req, res, next) => {
  let db_role = await DB.findById(req.params.id).populate("permits");
  if (db_role) {
    Helper.fMsg(res, "Single Role", db_role);
  } else {
    next(new Error("No Role with that id"));
  }
};

const add = async (req, res, next) => {
  let db_role = await DB.findOne({ name: req.body.name });
  if (db_role) {
    next(new Error("Role is already exist"));
  } else {
    let result = await new DB(req.body).save();
    Helper.fMsg(res, "Role Saved", result);
  }
};

const patch = async (req, res, next) => {
  let db_role = await DB.findById(req.params.id);
  if (db_role) {
    let exist_role = await DB.findOne({ name: req.body.name });
    if (exist_role) {
      next(new Error("Role is already exist"));
    } else {
      await DB.findByIdAndUpdate(db_role._id, req.body);
      let result = await DB.findById(req.params.id).populate("permits");
      Helper.fMsg(res, "Role Updated", result);
    }
  } else {
    next(new Error("No Role with that id"));
  }
};

const drop = async (req, res, next) => {
  let db_role = await DB.findById(req.params.id);
  if (db_role) {
    await DB.findByIdAndDelete(db_role._id);
    Helper.fMsg(res, `${db_role.name} Role Deleted`);
  } else {
    next(new Error("No Role with that id"));
  }
};

const addPermit = async (req, res, next) => {
  let db_role = await DB.findById(req.body.role_id);
  let db_permit = await PermitDB.findById(req.body.permit_id);
  if (db_role) {
    let db_exist_permit = db_role.permits.find((id) => id == req.body.permit_id);
    if (db_exist_permit) {
      next(new Error(`${db_permit.name} is already in ${db_role.name} Role`));
    } else {
      await DB.findByIdAndUpdate(db_role._id, {
        $push: { permits: db_permit._id },
      });
      let result = await DB.findById(db_role._id).populate("permits");
      Helper.fMsg(
        res,
        `${db_permit.name} Permission added to ${db_role.name} Role`,
        result,
      );
    }
  } else if (!db_role && db_permit) {
    next(new Error("Role Id must valid"));
  } else if (!db_permit && db_role) {
    next(new Error("Permit Id must valid"));
  } else {
    next(new Error("Role Id and Permit Id must valid"));
  }
};

const removePermit = async (req, res, next) => {
  let db_role = await DB.findById(req.body.role_id);
  let db_permit = await PermitDB.findById(req.body.permit_id);
  if (db_role) {
    let db_exist_permit = db_role.permits.find((id) => id == req.body.permit_id);
    if (db_exist_permit) {
      await DB.findByIdAndUpdate(db_role._id, {
        $pull: { permits: db_permit._id },
      });
      let result = await DB.findById(db_role._id).populate("permits");
      Helper.fMsg(
        res,
        `${db_permit.name} Permission removed from ${db_role.name} Role`,
        result,
      );
    } else {
      next(
        new Error(
          `Not found input Permission to delete from ${db_role.name} Role`,
        ),
      );
    }
  } else if (!db_role && db_permit) {
    next(new Error("Role Id must valid"));
  } else if (!db_permit && db_role) {
    next(new Error("Permit Id must valid"));
  } else {
    next(new Error("Role Id and Permit Id must valid"));
  }
};

module.exports = {
  all,
  add,
  get,
  patch,
  drop,
  addPermit,
  removePermit,
};
