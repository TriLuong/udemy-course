const express = require("express");
require("./db/mongoose");
const { userRouter } = require("./routers");
const app = express();
const port = 8080;

// app.use((req, res, next) => {
//   if (req.method === "GET") {
//     res.send("GET request are disabled");
//   } else {
//     next();
//   }
// });

app.use(express.json());
app.use(userRouter);

app.listen(port, () => {
  console.log("Server is up on port", port);
});

const jwt = require("jsonwebtoken");

const myFunction = async () => {
  const token = jwt.sign({ _id: "asfsdf" }, "udemy-nodejs", {
    expiresIn: "7 days"
  });
  console.log(token);

  const data = jwt.verify(token, "udemy-nodejs");
  console.log(data);
};

myFunction();
