const express = require("express");
require("./db/mongoose");
const {
  userRouter,
  loadRouter,
  chatRouter,
  uploadRouter
} = require("./routers");

const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use("/api/v1", userRouter);
app.use("/api/v1", loadRouter);
app.use("/api/v1", chatRouter);
app.use("/api/v1", uploadRouter);

app.listen(port, () => {
  console.log("Server is up on port", port);
});
