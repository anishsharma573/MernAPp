import React, { useContext, useState } from 'react';
import instance from '../Axios/axios';

import { SET_TOKEN, SET_USER } from '../reducer/userAction.types';
import { TokenContext } from '../context/TokenContext';

export const Register = () => {
  const [formData, setFormData] = useState({});
  const { userToken, tokenDispatch, userDispatch } = useContext(TokenContext);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await instance.post('/signup', formData);
      if (result && result.data) {
        tokenDispatch({ type: SET_TOKEN, payload: result.data.token });
        userDispatch({ type: SET_USER, payload: result.data.user });
        localStorage.setItem('authToken', JSON.stringify(result.data.token));
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'An unexpected error occurred';
      setError({ message: errorMessage });
    }
  };

  return (
    <div>
      {error && <div>{error.message}</div>}
      <form method='post' onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full name"
          name="name"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
        />
        <button type="submit">SignUp</button>
      </form>
    </div>
  );
};

export default Register;
