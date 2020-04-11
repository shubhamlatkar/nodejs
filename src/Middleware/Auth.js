const jwt = require("jsonwebtoken");
const User = require("../Models/Users");

const Auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, "secretString");
    const user = await User.findOne({ _id: decode._id, "tokens.token": token });

    if (!user) throw new Error();
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: "not authenticated" });
  }
};

module.exports = Auth;
