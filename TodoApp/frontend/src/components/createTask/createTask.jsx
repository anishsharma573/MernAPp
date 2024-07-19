import React, { useContext, useState } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { TokenContext } from '../../context/TokenContext';
import instance from '../../Axios/axios';
import { ADD_TASK } from '../../reducer/TaskAction.types';
import "./createTask.css"

const CreateTask = () => {
  const { dispatch } = useContext(TaskContext);
  const { user, userToken } = useContext(TokenContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Debugging: Print the userToken and task details
    console.log('JWT Token:', userToken);
    console.log('Task Details:', { title, description, userId: user._id , userName: user.name });

    try {
      const res = await instance.post(
        '/createTodo',
        { title, description, userId: user._id , userName: user.name },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      dispatch({
        type: ADD_TASK,
        payload: res.data, // Assuming res.data contains the new task
      });

      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Error creating task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-task-container">
      <form className="create-task-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Title"
          name="title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="create-task-input"
        />
        <textarea
          rows={5}
          style={{ resize: 'none' }}
          placeholder="Description"
          name="description"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="create-task-textarea"
        />
        <button type="submit" className="create-task-button" disabled={loading}>
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </form>
      {error && <p className="create-task-error">{error}</p>}
    </div>
  );
};

export default CreateTask;
