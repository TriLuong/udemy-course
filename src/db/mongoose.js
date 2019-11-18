const mongoose = require("mongoose");

const connectionURL =
  "mongodb+srv://triluong:studyhard5194@cluster0-0rlhg.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
