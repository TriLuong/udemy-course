const express = require("express");
const { usersModel } = require("../models");
const { auth } = require("../middleware");
const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new usersModel(req.body);
  try {
    await user.save();
    res.send(user);
  } catch {
    res.status(500).send();
  }
});

router.get("/users", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.name) {
    match.name = req.query.name || null;
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
    const total = users.length;
    res.send({ users, total });
    // res.send(req.user);
  } catch {
    res.status(500).send();
  }
});

router.get("/users/:id", async (req, res) => {
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

router.patch("/users/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every(update =>
    allowUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

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
    res.status(400).send(error);
  }
});

router.delete("/users/:id", async (req, res) => {
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
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ code: 400, error });
  }
});

module.exports = router;
