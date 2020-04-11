const express = require("express"),
  app = express(),
  bodyParser = require("body-parser");

require("./DB/task-manager");

const userRouter = require("./Routes/User");
const taskRouter = require("./Routes/Task");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/users", userRouter);
app.use("/tasks", taskRouter);

const port = parseInt(process.env.PORT, 10) || 8080;

app.get("/", (request, response) => {
  response.send("<h1>/user  post data</h1>");
});

var listener = app.listen(port, function() {
  console.log("Listening on  port " + listener.address().port);
});
