const express = require("express");

const auth = require("../Middleware/Auth");
const User = require("../Models/Users");
const multer = require("multer");
const sharp = require("sharp");

const router = new express.Router();
router.post("/", async (request, response) => {
  console.log("post users");
  let user = new User(request.body);

  try {
    let res = await user.save();
    let token = await res.genrateAuthToken(
      request.body.email,
      request.body.password
    );
    response.status(201).send({ res, token });
  } catch (err) {
    response.status(400).send(err);
  }
});

router.get("/me", auth, async (request, response) => {
  console.log("me");
  response.status(200).send({ myUser: request.user });
});

router.get("/logout", auth, async (request, response) => {
  console.log("logout");
  try {
    request.user.tokens = request.user.tokens.filter(token => {
      return token.token !== request.tokezn;
    });

    let res = await request.user.save();
    if (!res) return response.status(404).send();

    response.status(200).send(res);
  } catch (err) {
    response.status(404).send(err);
  }
});

router.delete("/me", async (request, response) => {
  try {
    let res = request.user.remove();
    response.status(200).send(res);
  } catch (err) {
    response.status(400).send(err);
  }
});

router.patch("/:id", async (request, response) => {
  let objKeys = Object.keys(request.body);
  let allowedKeys = ["name", "email", "password", "age"];
  let isValidUpdate = objKeys.every(key => allowedKeys.includes(key));
  if (!isValidUpdate) return response.status(400).send("In valid keys");
  try {
    let user = await User.findById(request.params.id);
    objKeys.forEach(key => (user[key] = request.body[key]));
    let res = await user.save();

    if (!res) return response.status(404).send();
    response.status(200).send(res);
  } catch (err) {
    response.status(400).send(err);
  }
});

router.post("/login", async (request, response) => {
  try {
    let res = await User.findByCredentials(
      request.body.email,
      request.body.password
    );

    if (!res) return response.status(404).send();

    let token = await res.genrateAuthToken(
      request.body.email,
      request.body.password
    );

    response.status(200).send(token);
  } catch (err) {
    response.status(400).send();
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.{jpg|png|jpeg}/)) {
      return cb(new Error("Please upload an image"));
    }

    cb(undefined, true);
  }
});

router.post(
  "/:id/avatar",
  auth,
  upload.single("avatar"),
  async (request, response) => {
    const buffer = await sharp(request.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    request.user.avatar = buffer;
    await request.user.save();
    response.status(200).send();
  },
  (error, response, request, next) => {
    response.status(400).send({ error: error.message });
  }
);

router.delete("/me/avatar", async (request, response) => {
  request.user.avatar = undefined;
  await request.user.save();
  response.send();
});

router.get("/me/avatar", auth, async (request, response) => {
  try {
    let user = await User.findById(request.user._id);
    if (!user.avatar) throw new Error("Img Not found");

    response.set("Content-Type", "image/png");
    response.send(user.avatar);
  } catch (err) {
    response.status(400).send();
  }
});

module.exports = router;
