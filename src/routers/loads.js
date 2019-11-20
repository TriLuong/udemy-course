const express = require("express");
const router = new express.Router();
const { loadsModel } = require("../models");
const { auth } = require("../middleware");
const { ResponseError, ResponseSuccess } = require("../common/ResponseMess");

router.get("/loads", auth, async (req, res) => {
  const match = {};
  const sort = {
    createdAt: -1
  };

  if (req.query.status) {
    match.status = req.query.status || null;
  }
  try {
    let totalLoads = [];
    let statusArray = [];
    let totalItem = 0;
    if (req.query.status) {
      match.status = req.query.status || null;
      statusArray = req.query.status.split(",");
      totalLoads = await loadsModel.find({ status: statusArray });

      totalItem = totalLoads.length;

      totalLoads = await loadsModel
        .find({ status: statusArray }, null, {
          sort,
          limit: parseInt(req.query.limit) || 10,
          skip: parseInt((req.query.page - 1) * (req.query.limit || 10)) || 0
        })
        .populate("driverId");
    } else {
      totalLoads = await loadsModel.find({});
      totalItem = totalLoads.length;

      totalLoads = await loadsModel
        .find({}, null, {
          sort,
          limit: parseInt(req.query.limit) || 10,
          skip: parseInt((req.query.page - 1) * (req.query.limit || 10)) || 0
        })
        .populate("driverId");
    }

    const pageSize = req.query.limit || 10;
    let totalPage = Math.ceil(totalItem / pageSize);

    const pageIndex = req.query.page;
    ResponseSuccess(res, {
      data: totalLoads,
      totalItem,
      pageSize,
      totalPage,
      pageIndex
    });
  } catch (error) {
    ResponseError(res, 400, error);
  }
});

router.post("/loads", auth, async (req, res) => {
  const loads = new loadsModel(req.body);
  try {
    await loads.populate("driverId").execPopulate();
    // console.log(newLoads);
    await loads.save();
    ResponseSuccess(res, loads);
  } catch (error) {
    ResponseError(res, 400, error);
  }
});

router.get("/loads/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const load = await loadsModel.findById(_id);
    if (!load) {
      return ResponseError(res, 404, "Load is NOT FOUND");
    }
    ResponseSuccess(res, load);
  } catch (error) {
    ResponseError(res, 400, error);
  }
});

router.patch("/loads/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    const load = await loadsModel.findById(req.params.id);
    updates.forEach(update => (load[update] = req.body[update]));
    await load.save();
    ResponseSuccess(res, load);
  } catch (error) {
    ResponseError(res, 400, error);
  }
});

router.delete("/loads/:id", auth, async (req, res) => {
  try {
    const load = await loadsModel.findByIdAndDelete(req.params.id);
    if (!load) {
      return ResponseError(res, 404, "Load is NOT FOUND");
    }
    ResponseSuccess(res, "Delete successfully!");
  } catch (error) {
    ResponseError(res, 400, error);
  }
});

module.exports = router;
