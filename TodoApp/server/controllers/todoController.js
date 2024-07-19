
const BigPromise = require('../middleware/BigPromise');
const Todo = require('../models/todo');
const CustomError = require('../utils/CustomError');

exports.createTodo = BigPromise(async (req, res, next) => {
  const { title, description, userId , userName} = req.body;

  try {
    const todo = new Todo({
      title,
      description,
      userId,
      userName // Ensure this is being saved
    });

    await todo.save();
    res.status(201).send(todo);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});



exports.getTodos = BigPromise(async (req,res,next)=>{

    const todos = await Todo.find({userId:req.user._id})
    res.status(200).json(todos)
    
})

exports.getTodoById =BigPromise(async (req,res,next)=>{
    const todo = await Todo.findById(req.params.id)
    if(!todo || todo.userId.toString() !== req.user._id.toString()){
     throw new CustomError("Todo not Found",400)
     
    }``
    res.status(200).json(todo)
})

///update todo
exports.updateTodo = BigPromise(async (req,res,next)=>{
    const todo = await Todo.findById(req.params.id)
    if(!todo || todo.userId.toString() !== req.user._id.toString()){
     throw new CustomError("Todo not Found",400)
     
    }
    Object.assign(todo,req.body)
        await todo.save()
        res.status(200).json(todo)
    
})

//deleteTodo 

exports.deleteTodo =BigPromise(async(req,res,next)=>{
    const todo = await Todo.findById(req.params.id)
    if(!todo || todo.userId.toString() !== req.user._id.toString()){
     throw new CustomError("Todo not Found",400)
     
    }
    await Todo.deleteOne({ _id: req.params.id });
    res.status(200).json({
        success:true,
        message:"Todo deleted successfully"
  
  
      })
})

exports.isCompletedTodo = BigPromise(async (req,res,next)=>{
  const { id } = req.params;
  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).send('Todo not found');
    }
    todo.completed = !todo.completed;
    await todo.save();
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).send('Server error');
  }
});