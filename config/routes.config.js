const express = require('express');
const router = express.Router();
const users = require('../controllers/users.controllers');

// CRUD operations
// Create
router.post('/api/posts', users.create);

// Read
router.get('/api/posts', users.list);
router.get('/api/posts/:id', users.detail);

// Update
router.patch('/api/posts/:id', users.update);

// Delete
router.delete('/api/posts/:id', users.delete);

module.exports = router;