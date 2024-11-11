const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  encode: (payload) => bcrypt.hashSync(payload),
  comparePassword: (plain, hash) => bcrypt.compareSync(plain, hash),
  fMsg: (res, msg = "", result = []) =>
    res.status(200).json({ con: true, msg, result }),
  makeToken: (payload) =>
    jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "2 days" }),
  timer: async (second) => {
    await new Promise((resolve) => setTimeout(resolve, second * 1000));
  },
  splitTrim: (data) => data.split(",").map((str) => str.trim()),
};
