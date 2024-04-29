const bcrypt = require("bcrypt");
const jimp = require("jimp");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const multer = require("multer");

const { avatarUpload } = require("../../config/multer");
const { User } = require("../../models/user");
const { validateUser } = require("../../models/user");
const {
  checkExistingUser,
  createUser,
  findUser,
} = require("../users/services");

const userSignUp = async (req, res) => {
  const { email, password } = req.body;

  const { error } = validateUser({ email, password });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const existingUser = await checkExistingUser(email);
  if (existingUser) {
    return res.status(409).json({ message: "Email in use" });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const avatarURL = gravatar.url(email, {
    protocol: "https",
  });

  const newUser = new User({
    email: email,
    password: hashedPassword,
    subscription: "starter",
    avatarURL: avatarURL,
  });

  try {
    await createUser(newUser);
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  const { error } = validateUser({ email, password });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const user = await checkExistingUser(email);
  if (!user) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  user.token = token;
  await user.save();

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const userLogout = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await findUser(userId);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    user.token = null;
    await user.save();

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const avatarChange = async (req, res) => {
  try {
    avatarUpload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: "Multer error" });
      } else if (err) {
        return res.status(500).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = req.user._id;

      const image = await jimp.read(req.file.path);
      await image.resize(250, 250).writeAsync(req.file.path);

      const avatarURL = `/avatars/${req.file.filename}`;
      await User.findByIdAndUpdate(userId, { avatarURL });

      res.status(200).json({ avatarURL });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  userSignUp,
  userLogin,
  userLogout,
  getCurrentUser,
  avatarChange,
};
