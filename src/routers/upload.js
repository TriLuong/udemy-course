const express = require("express");
const { uploadModel } = require("../models");
const { auth, upload } = require("../middleware");
const { ResponseSuccess, ResponseError } = require("../common/ResponseMess");
const router = new express.Router();

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log(req.file); // to see what is returned to you
    ResponseSuccess(res, req.file);
  } catch (error) {
    ResponseError(res, 400, error);
  }
});

module.exports = router;
