const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const crypto = require("crypto");
const { ResponseError, ResponseSuccess } = require("../common/ResponseMess");

const mongoURI =
  "mongodb+srv://triluong:studyhard5194@cluster0-0rlhg.mongodb.net/test?retryWrites=true&w=majority";

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    });
  }
});

const parser = multer({ storage });

module.exports = parser;
