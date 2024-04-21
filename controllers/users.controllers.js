const User = require("../models/user.model");
const { sessions } = require("../middlewares/auth.middlewares");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// CRUD operations
// Create
module.exports.create = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json("Error: Name, email and password are required.");
    } else {
      const user = new User({ name, email, password, bio });
      user.password = await bcrypt.hash(user.password, 10);

      await user.save();
      res.status(201).json(user);
    }
  } catch (err) {
    res.status(400).json(`Error: ${err.message}`);
  }
  /* 
  User.create(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      res.status(400).json(`Error: ${err.message}`);
    }); */
};

// Read
module.exports.list = (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(400).json(`Error: ${err.message}`);
    });
};

module.exports.detail = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).json("Error: User not found.");
      } else {
        res.status(200).json(user);
      }
    })
    .catch(console.error);
};

// Update
module.exports.update = (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        res.status(404).json("Error: User not found.");
      } else {
        res.status(200).json(user);
      }
    })
    .catch(console.error);
};

// Delete
module.exports.delete = (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).json("Error: User not found.");
      }
      res.status(204).end();
    })
    .catch(console.error);
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json("Error: Email and password are required.");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json("Error: User not found.");
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET || "secretKey",
          { expiresIn: "1h" }
        );

        // sessions.push({ token, userId: user.id });

        res.status(200).json({ token: token });
      } else {
        res.status(401).json("Error: Password incorrect.");
      }
    }
  } catch (err) {
    res.status(400).json(`Error: ${err.message}`);
  }
};
