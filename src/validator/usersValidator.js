const { check } = require("express-validator");
const { ROLES } = require("../common/constants");
const { ResponseError } = require("../common/ResponseMess");

function CheckPost(req, res, next) {
  const allowUpdates = ["name", "email", "password", "role"];
  const userKey = Object.keys(req.body);

  const isValidOperation = allowUpdates.every(value => userKey.includes(value));

  if (!isValidOperation) {
    return ResponseError(res, 400, `User need include ${allowUpdates}`);
  }

  const isValidateRole = Object.values(ROLES).includes(req.body.role);
  if (!isValidateRole) {
    return ResponseError(
      res,
      400,
      `Role needs to set one of ${Object.values(ROLES)}`
    );
  }
  next();
}

module.exports = { CheckPost };
