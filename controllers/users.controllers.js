const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// CRUD operations

module.exports.verify = (req, res) => {
  const token = req.query.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    User.findByIdAndUpdate(decoded.sub, { active: true }, { new: true })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: "User not found" });
        } else {
          res.json(user);
        }
      })
      .catch(console.error);
  } catch (err) {
    res.status(401).json({ message: "unable to verify" });
  }
};
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

      const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET);

      const verifyUrl = `http://localhost:8000/api/users/verify?token=${token}`;

      //TODO: send email to user.email with verifyUrl (Hacemos console.log simulando el envío de un email)
      console.log(verifyUrl);

      res.status(201).json(user);
    }
  } catch (err) {
    res.status(400).json(`Error: ${err.message}`);
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json("Error: Email and password are required.");
    }

    const user = await User.findOne({ email });
    if (user.active === false) {
      return res.status(401).json("Error: User not verified.");
    } else if (!user) {
      return res.status(401).json("Error: Invalid credentials.");
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign(
          { sub: user.id, exp: Date.now() / 1000 + 60 },
          process.env.JWT_SECRET
        );

        res.status(200).json({ token: token });
      } else {
        res.status(401).json("Error: Password incorrect.");
      }
    }
  } catch (err) {
    res.status(400).json(`Error: ${err.message}`);
  }
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
