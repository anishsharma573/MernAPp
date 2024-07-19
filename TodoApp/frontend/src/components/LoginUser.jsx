import React, { useContext, useState } from 'react';
import instance from '../Axios/axios';
import { SET_TOKEN, SET_USER } from '../reducer/userAction.types';
import { TokenContext } from '../context/TokenContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { tokenDispatch, userDispatch } = useContext(TokenContext);
  const [error, setError] = useState(null);
 const navigate = useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous error
    try {
      const result = await instance.post('/login', formData);

      if (result && result.data) {
        tokenDispatch({ type: SET_TOKEN, payload: result.data.token });
        userDispatch({ type: SET_USER, payload: result.data.user });
        localStorage.setItem('authToken', JSON.stringify(result.data.token));
        console.log('User logged in:', result.data.user); // Log user details
        navigate('/getTodos')
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (err) {
      console.error('Error during login:', err);
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'An unexpected error occurred';
      setError({ message: errorMessage });
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error.message}</div>}

      <form method="post" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

