const express = require("express");
const router = new express.Router();
const { loadsModel } = require("../models");
const { auth } = require("../middleware");
const { ResponseError, ResponseSuccess } = require("../common/ResponseMess");

router.get("/loads", auth, async (req, res) => {
  const match = {};

  if (req.query.status) {
    match.status = req.query.status || null;
  }
  try {
    const totalLoads = await loadsModel.find();
    const loads = await loadsModel.find(match, null, {
      limit: parseInt(req.query.limit) || 10
    });

    const totalItem = totalLoads.length;
    const pageSize = req.query.limit || 10;
    let totalPage = parseInt(totalItem / pageSize);
    if (totalItem % pageSize !== 0) {
      totalPage += 1;
    }

    const pageIndex = req.query.page;
    ResponseSuccess(res, {
      data: loads,
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
    await loads.save();
    ResponseSuccess(res, loads);
  } catch (error) {
    ResponseError(res, 400, error);
  }
});

module.exports = router;
