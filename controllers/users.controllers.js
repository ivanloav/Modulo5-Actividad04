const User = require('../models/user.model');

// CRUD operations
// Create
module.exports.create = (req, res) => {
    User.create(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(400).json(`Error: ${err.message}`);
        });
}

// Read
module.exports.list = (req, res) => {
    User.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(400).json(`Error: ${err.message}`);
        });
}

module.exports.detail = (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                res.status(404).json("Error: User not found.");
            } else {
                res.status(200).json(user);
            }
        })
        .catch(console.error);
}

// Update
module.exports.update = (req, res) => {
    User.findByIdAndUpdate (req.params.id, req.body, { 
        new: true, 
        runValidators: true 
    })
        .then(user => {
            if (!user) {
                res.status(404).json("Error: User not found.");
            } else {
                res.status(200).json(user);
            }
        })
        .catch(console.error);
}

// Delete
module.exports.delete = (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(user => {
            if (!user) {
                res.status(404).json("Error: User not found.");
            }
            res.status(204).end();
        })
        .catch(console.error);
}