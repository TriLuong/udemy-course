const express = require("express");
const { usersModel } = require("../models");
const { auth } = require("../middleware");
const router = new express.Router();
const { ResponseSuccess, ResponseError } = require("../common/ResponseMess");
const { CheckPost } = require("../validator/usersValidator");
const { check } = require("express-validator");
const { ROLES } = require("../common/constants");

router.post("/users", auth, async (req, res) => {
  const user = new usersModel(req.body);

  try {
    await user.save();
    ResponseSuccess(res, user);
  } catch {
    ResponseError(res, 400, "Email has already existed.");
  }
});

router.get("/users", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.role) {
    match.role = req.query.role || null;
  }

  try {
    const users = await usersModel.find(match, null, {
      limit: parseInt(req.query.limit),
      sort: {
        [req.query.sortBy]: req.query.sortType === "decs" ? -1 : 1
      }
    });
    // .populate({
    //   path: "users",
    //   match,
    //   options: {
    //     limit: parseInt(req.query.limit)
    //   }
    // })
    // .exec();
    const totalItem = users.length;
    const pageSize = req.query.limit;
    let totalPage = 1;
    if (totalItem > pageSize) {
      totalItem = parseInt(totalItem / pageSize);
      if (totalItem % pageSize !== 0) {
        totalItem += 1;
      }
    }
    const pageIndex = req.query.page;
    res.send({ data: users, totalItem, pageSize, totalPage, pageIndex });
    // res.send(req.user);
  } catch {
    res.status(500).send();
  }
});

router.get("/users/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await usersModel.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch {
    res.status(500).send();
  }
});

router.patch("/users/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);

  try {
    const user = await usersModel.findById(req.params.id);
    updates.forEach(update => (user[update] = req.body[update]));
    await user.save();
    // const user = await usersModel.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true
    // });
    res.send(user);
  } catch (error) {
    res.status(400).send({ code: 400, error });
  }
});

router.delete("/users/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await usersModel.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).send();
    }
    res.send();
  } catch {
    res.status(500).send();
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const user = await usersModel.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    ResponseSuccess(res, user);
  } catch (error) {
    ResponseError(res, 400, error);
  }
});

module.exports = router;
