/* eslint-disable comma-dangle */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
// Import User model
const User = require("../model/user");

dotenv.config();

// Import register validation
const {
  registerValidation,
  loginValidation,
} = require("../validation/authValidation");

// eslint-disable-next-line consistent-return
const userRegister = async (req, res) => {
  // Validation before user can register
  const { error } = registerValidation(req.body);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }

  // Check if there already exists a user with the same name in the database
  const userExisted = await User.findOne({ name: req.body.name });
  if (userExisted) {
    return res.status(400).send({ success: false, msg: "User already exists" });
  }

  // Check if there already exists a user with the same email in the database
  const emailExisted = await User.findOne({ email: req.body.email });
  if (emailExisted) {
    return res
      .status(400)
      .send({ success: false, msg: "Email address has been occupied" });
  }

  // If all above validation are passed, hash the password for security
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.status(201).send({ success: true, data: savedUser });
  } catch (err) {
    res.status(400).send({ success: false, msg: err });
  }
};

// eslint-disable-next-line consistent-return
const userLogin = async (req, res) => {
  // Validation before user can login
  const { error } = loginValidation(req.body);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: "Invalid username or password" });
  }

  // Check if there exists a user with the same email in the database
  const user = await User.findOne({ name: req.body.name });
  if (!user) {
    return res
      .status(400)
      .send({ success: false, msg: "Invalid username or password" });
  }
  if (user.isLocked) {
    if ((Date.now() - new Date(user.lockTime).getTime()) / 1000 > 6) {
      await User.updateOne({ name: req.body.name }, { attempts: 0 });
      await User.updateOne({ name: req.body.name }, { isLocked: false });
    } else {
      return res
        .status(429)
        .send({ success: false, msg: "Try again after 1 minute" });
    }
  }
  const updatedUser = await User.findOne({ name: req.body.name });
  // Check if the password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    if (updatedUser.attempts !== 3) {
      await User.updateOne(
        { name: req.body.name },
        { attempts: updatedUser.attempts + 1 }
      );
      if (updatedUser.attempts !== 2) {
        return res
          .status(400)
          .send({ success: false, msg: "Invalid username or password" });
      }
    }
    await User.updateOne({ name: req.body.name }, { isLocked: true });
    await User.updateOne({ name: req.body.name }, { lockTime: new Date() });
    return res
      .status(429)
      .send({ success: false, msg: "Try again after 1 minute" });
  }

  // If email and password match records in the database, create and assign a token to the response
  const token = jwt.sign(
    { _id: user._id, name: user.name, avatarUrl: user.avatarUrl },
    // eslint-disable-next-line comma-dangle
    process.env.TOKEN_SECRET
  );
  await User.updateOne({ name: req.body.name }, { attempts: 0 });
  res.header("auth-token", token);
  return res
    .status(200)
    .send({ success: true, msg: "Login Successful", token });
};

// eslint-disable-next-line consistent-return
const verifyToken = (req, res, next) => {
  const token = req.header("auth-token");
  // If no token assigned to the request, reject the access
  if (!token) {
    return res.status(401).send({ error: "Access Denied" });
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send({ error: "Invalid Token" });
  }
};

module.exports = {
  userRegister,
  userLogin,
  verifyToken,
};
