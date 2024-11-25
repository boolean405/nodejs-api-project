const DB = require("../models/user");
const RoleDB = require("../models/role");
const PermitDB = require("../models/permit");
const Helper = require("../utils/helper");
const Redis = require("../utils/redis");

const all = async (req, res, next) => {
  let db_user = await DB.find().populate("roles permits");
  Helper.fMsg(res, "All Users", db_user);
};

const register = async (req, res, next) => {
  let db_email_user = await DB.findOne({ email: req.body.email });
  if (db_email_user) {
    next(new Error("Email is already exist"));
    return;
  }

  let db_phone_user = await DB.findOne({ phone: req.body.phone });
  if (db_phone_user) {
    next(new Error("Phone Number is already in use"));
    return;
  }
  req.body.password = Helper.encode(req.body.password);
  let result = await new DB(req.body).save();
  Helper.fMsg(res, "User Register Success", result);
};

// const login = async (req, res, next) => {
//   let db_phone_user = await DB.findOne({ phone: req.body.phone }).populate(
//     "roles permits",
//   );
//   if (db_phone_user) {
//     if (Helper.comparePassword(req.body.password, db_phone_user.password)) {
//       let user = db_phone_user.toObject();
//       delete user.password;
//       user.token = Helper.makeToken(user);
//       Redis.set(user._id, user);
//       Helper.fMsg(res, "Login Success", user);
//     } else {
//       next(new Error("Incorrect Password"));
//     }
//   } else {
//     next(new Error("No user found with Phone Number"));
//   }
// };

const login = async (req, res, next) => {
  let db_user = {};
  let db_phone_user = {};
  let db_email_user = {};

  if (req.body.phone || req.body.email) {
    if (req.body.phone) {
      db_phone_user = await DB.findOne({ phone: req.body.phone }).populate(
        "roles permits"
      );
      if (db_phone_user) {
        db_user = db_phone_user;
      } else {
        next(
          new Error(`No User found with this '${req.body.phone}' Phone Number`)
        );
      }
    } else if (req.body.email) {
      db_email_user = await DB.findOne({ email: req.body.email }).populate(
        "roles permits"
      );
      if (db_email_user) {
        db_user = db_email_user;
      } else {
        next(
          new Error(`No User found with this '${req.body.email}' Email Address`)
        );
      }
    }
    if (db_user.name) {
      if (Helper.comparePassword(req.body.password, db_user.password)) {
        let user = db_user.toObject();
        delete user.password;
        user.token = Helper.makeToken(user);
        Redis.set(user._id, user);
        Helper.fMsg(res, "Login Success", user);
      } else {
        next(new Error("Incorrect Password"));
      }
    } else {
      next(new Error("Email or Phone must be valid"));
    }
  } else {
    next(new Error("Email or Phone must be contain to Login"));
  }
};

const addRole = async (req, res, next) => {
  let db_user = await DB.findById(req.body.user_id);
  let db_role = await RoleDB.findById(req.body.role_id);
  if (db_user) {
    if (db_role) {
      let exist_role = db_user.roles.find((rid) => rid.equals(db_role._id));
      if (exist_role) {
        next(
          new Error(
            `${db_role.name} Role is already exist in ${db_user.name} User`
          )
        );
      } else {
        await DB.findByIdAndUpdate(db_user._id, {
          $push: { roles: db_role._id },
        });
        let user = await DB.findById(db_user._id).populate("roles permits");
        Helper.fMsg(
          res,
          `${db_role.name} Role added to ${user.name} User`,
          user
        );
      }
    } else {
      next(new Error("No role found with id"));
    }
  } else {
    next(new Error("No user found with that id"));
  }
};

const removeRole = async (req, res, next) => {
  let db_user = await DB.findById(req.body.user_id).populate("roles");
  if (db_user) {
    let exist_role = db_user.roles.find((rid) => rid.equals(req.body.role_id));
    if (exist_role) {
      await DB.findByIdAndUpdate(db_user._id, {
        $pull: { roles: req.body.role_id },
      });
      Helper.fMsg(
        res,
        `${exist_role.name} Role removed from ${db_user.name} User`
      );
    } else {
      next(new Error(`Role doesn't exist in ${db_user.name} User`));
    }
  } else {
    next(new Error("No user found with that id"));
  }
};

const addPermit = async (req, res, next) => {
  let db_user = await DB.findById(req.body.user_id);
  let db_permit = await PermitDB.findById(req.body.permit_id);
  if (db_user) {
    if (db_permit) {
      let exist_permit = db_user.permits.find((rid) =>
        rid.equals(db_permit._id)
      );
      if (exist_permit) {
        next(
          new Error(
            `${db_permit.name} Permit is already exist in ${db_user.name} User`
          )
        );
      } else {
        await DB.findByIdAndUpdate(db_user._id, {
          $push: { permits: db_permit._id },
        });
        let user = await DB.findById(db_user._id).populate("roles permits");
        Helper.fMsg(
          res,
          `${db_permit.name} Permit added to ${user.name} User`,
          user
        );
      }
    } else {
      next(new Error("No permit found with id"));
    }
  } else {
    next(new Error("No user found with that id"));
  }
};

const removePermit = async (req, res, next) => {
  let db_user = await DB.findById(req.body.user_id).populate("permits");
  if (db_user) {
    let exist_permit = db_user.permits.find((rid) =>
      rid.equals(req.body.permit_id)
    );
    if (exist_permit) {
      await DB.findByIdAndUpdate(db_user._id, {
        $pull: { permits: req.body.permit_id },
      });
      Helper.fMsg(
        res,
        `${exist_permit.name} Permit removed from ${db_user.name} User`
      );
    } else {
      next(new Error(`Permit doesn't exist in ${db_user.name} User`));
    }
  } else {
    next(new Error("No user found with that id"));
  }
};

const removeUser = async (req, res, next) => {
  let db_user = await DB.findById(req.params.id);
  if (db_user) {
    await DB.findByIdAndDelete(db_user._id);
    Helper.fMsg(res, `${db_user.name} User Deleted`);
  } else {
    next(new Error("No User with that id"));
  }
};

module.exports = {
  all,
  register,
  login,
  addRole,
  removeRole,
  addPermit,
  removePermit,
  removeUser,
};
