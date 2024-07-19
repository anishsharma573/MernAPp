import React, { useContext, useEffect, useState } from 'react';
import instance from '../../Axios/axios';
import { TokenContext } from '../../context/TokenContext';
import { TaskContext } from '../../context/TaskContext';
import { MARK_DONE, REMOVE_TASK, UPDATE_TASK } from '../../reducer/TaskAction.types';
import UpdateTodo from './UpdateTodo'; // Import UpdateTodo component
import "./getTodo.css";

const GetTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editTodo, setEditTodo] = useState(null); // State to track the todo being edited
  const { user, userToken } = useContext(TokenContext);
  const { dispatch } = useContext(TaskContext);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await instance.get('/getTodos', {
          headers: { Authorization: `Bearer ${userToken}` },
          params: { userId: user._id },
        });
        setTodos(res.data || []);
      } catch (err) {
        console.error('Error fetching todos:', err);
        setError('Failed to fetch todos.');
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [user._id, userToken]);

  const handleCompletion = async (todoId) => {
    try {
      const res = await instance.patch(`/completeTodo/${todoId}`, null, {
        headers: { Authorization: `Bearer ${userToken}` },
        params: { userId: user._id },
      });

      const updatedTodo = res.data;
      setTodos((prevTodos) => prevTodos.map((todo) => (todo._id === todoId ? updatedTodo : todo)));
      dispatch({ type: MARK_DONE, payload: updatedTodo });
    } catch (err) {
      console.error('Error updating todo:', err);
      setError('Failed to update todo.');
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await instance.delete(`/deleteTodo/${todoId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
        params: { userId: user._id },
      });

      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== todoId));
      dispatch({ type: REMOVE_TASK, payload: todoId });
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Failed to delete todo.');
    }
  };

  const updateTodo = (updatedTodo) => {
    setTodos((prevTodos) => prevTodos.map((todo) => (todo._id === updatedTodo._id ? updatedTodo : todo)));
    dispatch({ type: UPDATE_TASK, payload: updatedTodo });
    setEditTodo(null); // Close the edit form after updating
  };

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      <ul className="todo-list">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <li key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              {editTodo === todo._id ? (
                <UpdateTodo todo={todo} onUpdate={updateTodo} />
              ) : (
                <>
                  <h3 className="todo-title">{todo.title}</h3>
                  <p className="todo-description">{todo.description}</p>
                  <div className="todo-actions">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleCompletion(todo._id)}
                    />
                    <p className="todo-status">{todo.completed ? 'Completed' : 'Pending'}</p>
                    <button className="edit-btn" onClick={() => setEditTodo(todo._id)}>Edit</button>
                    <button className="delete-btn" onClick={() => deleteTodo(todo._id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))
        ) : (
          <li>No todos found.</li>
        )}
      </ul>
    </div>
  );
};

export default GetTodos;
