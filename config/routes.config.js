const express = require("express");
const router = express.Router();
const users = require("../controllers/users.controllers");
const { checkAuth } = require("../middlewares/auth.middlewares");

// CRUD operations
// Create
router.post("/api/posts", users.create);
router.post("/api/users", users.create);

// Login
router.post("/api/login", users.login);

router.use(checkAuth);

// Read
router.get("/api/posts", users.list);
router.get("/api/posts/:id", users.detail);
router.get("/api/users", users.list);
router.get("/api/users/:id", users.detail);

// Update
router.patch("/api/posts/:id", users.update);

// Delete
router.delete("/api/posts/:id", users.delete);

module.exports = router;
