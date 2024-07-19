const express = require("express");
const { createTodo, getTodos, getTodoById, updateTodo, deleteTodo, isCompletedTodo } = require("../controllers/todoController");
const isLoggedIn = require('../middleware/user');
const router = express.Router();

router.route("/createTodo").post(isLoggedIn, createTodo);
router.route("/getTodos").get(isLoggedIn, getTodos);
router.route("/getTodo/:id").get(isLoggedIn, getTodoById);
router.route("/updateTodo/:id").put(isLoggedIn, updateTodo);
router.route("/deleteTodo/:id").delete(isLoggedIn, deleteTodo);
router.route("/completeTodo/:id").patch(isLoggedIn, isCompletedTodo);

module.exports = router;
