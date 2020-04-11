const express = require("express");
const auth = require("../Middleware/Auth");
const Task = require("../Models/Task");

const router = new express.Router();

router.post("/", auth, async (request, response) => {
  let task = new Task({
    ...request.body,
    owner: request.user._id
  });
  console.log("Post tasks", task);

  try {
    let res = await task.save();
    response.status(201).send(res);
  } catch (err) {
    response.status(400).send(err);
  }
});

router.get("/:id", auth, async (request, response) => {
  console.log("get by id task");
  try {
    let res = await Task.findOne({
      _id: request.params.id,
      owner: request.user._id
    });
    if (!res) response.status(400).send();
    response.status(200).send(res);
  } catch (err) {
    response.status(400).send(err);
  }
});

router.get("/", auth, async (request, response) => {
  console.log("get all tasks");
  let match = {};
  let sort = [];

  if (request.query.sortBy) {
    let parts = request.query.sortBy.split("_");
    sort.push([parts[0], parts[1] === "asc" ? 1 : -1]);
  }

  if (request.query.completed)
    match.completed = request.query.completed === "true";

  try {
    let res = await Task.find({
      ...match,
      owner: request.user._id
    })
      .limit(parseInt(request.query.limit, 10))
      .sort([...sort]);
    response.status(200).send(res);
  } catch (err) {
    response.status(400).send(err);
  }
});

router.delete("/:id", auth, async (request, response) => {
  try {
    let res = await Task.findOneAndDelete({
      _id: request.params.id,
      owner: request.user._id
    });
    if (!res) response.status(400).send();
    response.status(200).send(res);
  } catch (err) {
    response.status(400).send(err);
  }
});

router.patch("/:id", auth, async (request, response) => {
  let objKeys = Object.keys(request.body);
  let allowedKeys = ["description", "completed"];
  let isValidUpdate = objKeys.every(key => allowedKeys.includes(key));

  if (!isValidUpdate) response.status(400).send("Not valid keys");

  try {
    let task = await Task.findOne({
      _id: request.params.id,
      owner: request.user._id
    });
    if (!task) {
      response.status(400).send();
    }

    objKeys.forEach(key => (task[key] = request.body[key]));
    let res = await task.save();

    if (!res) response.status(400).send();
    response.status(200).send(res);
  } catch (err) {
    response.status(400).send();
  }
});

module.exports = router;
