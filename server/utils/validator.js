const jwt = require("jsonwebtoken");
const Redis = require("./redis");
module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      let result = schema.validate(req.body);
      if (result.error) {
        // result.error.details.forEach(err => next(new Error(err.message)));
        next(new Error(result.error.details[0].message));
      } else {
        next();
      }
    };
  },

  validateParam: (schema, param) => {
    return (req, res, next) => {
      let obj = {};
      obj[`${param}`] = req.params[`${param}`];
      let result = schema.validate(obj);
      if (result.error) {
        next(new Error(result.error.details[0].message));
      } else {
        next();
      }
    };
  },

  validateToken: () => {
    return async (req, res, next) => {
      if (req.headers.authorization) {
        let token = req.headers.authorization.split(" ")[1];
        try {
          if (token) {
            let decoded = jwt.verify(token, process.env.SECRET_KEY);
            if (decoded) {
              let user = await Redis.get(decoded._id);
              if (user) {
                req.user = user;
                next();
              } else {
                next(new Error("Tokenization Error"));
              }
            } else {
              next(new Error("Tokenization Error"));
            }
          } else {
            next(new Error("Tokenization Error"));
          }
        } catch (error) {
          next(new Error("Tokenization Error"));
        }
      } else {
        next(new Error("Tokenization Error"));
      }
    };
  },

  validateRole: (role) => {
    return async (req, res, next) => {
      let user = req.user;
      let exist_role = req.user.roles.find((r) => r.name == role);
      if (exist_role) {
        next();
      } else {
        next(
          new Error(
            `${user.name} don't have permission, only ${role} can access`
          )
        );
      }
    };
  },

  hasAnyRole: (roles) => {
    return async (req, res, next) => {
      let role_status = false;
      for (let i = 0; i < roles.length; i++) {
        let has_role = req.user.roles.find((role) => role.name === roles[i]);
        if (has_role) {
          role_status = true;
          break;
        }
      }
      role_status ? next() : next(new Error("You don't have any role"));
    };
  },

  hasAnyPermit: (permits) => {
    return async (req, res, next) => {
      let permit_status = false;
      for (let i = 0; i < permits.length; i++) {
        let has_permit = req.user.permits.find(
          (permit) => permit.name === permits[i]
        );
        if (has_permit) {
          permit_status = true;
          break;
        }
      }
      permit_status ? next() : next(new Error("You don't have any permission"));
    };
  },
};
