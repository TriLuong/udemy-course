const express = require("express");
const { chatModel, loadsModel } = require("../models");
const { auth } = require("../middleware");
const router = new express.Router();
const { ResponseSuccess, ResponseError } = require("../common/ResponseMess");

router.get("/chats", auth, async (req, res) => {
  try {
    const chats = await chatModel.find({});
    ResponseSuccess(res, chats);
  } catch (error) {
    ResponseError(res, 400, error);
  }
});

router.patch("/chats/:id", auth, async (req, res) => {
  try {
    const load = await loadsModel.findById(req.params.id);
    let chat = {};
    if (!load.chat) {
      chat = new chatModel(req.body);
      load.chat = chat._id;
      if (chat.status) {
        load.status = chat.status;
      }
    } else {
      const updates = Object.keys(req.body);
      chat = await chatModel.findById(load.chat);
      updates.forEach(update => (chat[update] = req.body[update]));
      if (chat.status) {
        load.status = chat.status;
      }
    }
    await load.save();
    await chat.save();
    ResponseSuccess(res, chat);
  } catch (error) {
    ResponseError(res, 400, error);
  }
});

module.exports = router;
