const express = require("express");
require("./db/mongoose");
const { userRouter } = require("./routers");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080;

// app.use((req, res, next) => {
//   if (req.method === "GET") {
//     res.send("GET request are disabled");
//   } else {
//     next();
//   }
// });
app.use(cors());
app.use(express.json());
app.use(userRouter);

app.listen(port, () => {
  console.log("Server is up on port", port);
});
