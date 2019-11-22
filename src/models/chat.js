const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    type: String,
    status: String,
    bolImageUrl: String,
    podImageUrl: String,
    chassis: String,
    isDropAndHookLoad: Number,
    container: String,
    containerPiece: String,
    containerType: String,
    containerPieceCount: Number,
    containerPieceType: String,
    containerWeight: Number,
    containerSealNumber: String,
    problem: String,
    delivery: String
  },
  {
    timestamps: true
  }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
