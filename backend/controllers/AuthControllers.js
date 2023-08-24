const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const createError = require("../utils/Error");

const register = async (req, res, next) => {
  try {
    const doesExist = await User.findOne({ email: req.body.email });

    if (doesExist) {
      return next(createError(400, "User with this email already exists!"));
    }

    const hashedPswd = await bcrypt.hash(req.body.password, 8);

    const { username, email, profileImg, followers, followings } = req.body;

    const newUser = await User.create({
      username,
      email,
      profileImg,
      followers,
      followings,
      password: hashedPswd,
    });

    const { password, ...others } = newUser._doc;

    const token = jwt.sign({ id: newUser._id }, process.env.SK, {
      expiresIn: "5d",
    });

    res.status(201).json({ ...others, token });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(createError(400, "Wrong email or password!"));
    }

    const isValidPswd = await bcrypt.compare(req.body.password, user.password);

    if (!isValidPswd) {
      return next(createError(400, "Wrong email or password"));
    }

    const { password, ...others } = user._doc;
    const token = jwt.sign({ id: user._id }, process.env.SK, {
      expiresIn: "5d",
    });

    res.status(200).json({ ...others, token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
