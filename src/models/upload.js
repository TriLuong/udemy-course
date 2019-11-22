const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  image: { data: Buffer, contentType: String }
});

const Upload = mongoose.model("Upload", uploadSchema);

module.exports = Upload;
