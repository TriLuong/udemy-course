const jwt = require("jsonwebtoken");
const { usersModel } = require("../models");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "udemy-nodejs");
    const user = await usersModel.findOne({
      _id: decoded._id,
      "tokens.token": token
    });
    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch {
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = auth;
