import React, { useContext, useState } from 'react';
import { TaskContext } from '../../context/TaskContext';
import instance from '../../Axios/axios';


const UpdateTodo = ({ todo, onUpdate }) => {
  const { userToken } = useContext(TaskContext);
  const [todoText, setTodoText] = useState(todo.title);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await instance.put(`/updateTodo/${todo._id}`, { title: todoText }, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      onUpdate(response.data);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
        />
        <button type="submit">Update Todo</button>
      </form>
    </div>
  );
};

export default UpdateTodo;
