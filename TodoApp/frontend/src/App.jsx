import React, { useReducer, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Register } from './components/Signup';
import ForgotPassword from './components/forgotPassword/ForgotPassword';
import ResetPassword from './components/forgotPassword/ResetPassword';

import userReducer from './reducer/userReducer';
import TaskReducer from './reducer/TaskReducer';
import instance from './Axios/axios';
import { TaskContext } from './context/TaskContext';
import { TokenContext } from './context/TokenContext';
import TokenReducer from './reducer/tokenReducer';
import Logout from './components/Logout';
import { Login } from './components/LoginUser';
import GetTodos from './components/createTask/GetTodos';
import { SET_TASK } from './reducer/TaskAction.types';
import UpdateTodo from './components/createTask/UpdateTodo';
import Header from './components/headers/Header';
import CreateTask from './components/createTask/createTask';

const App = () => {
  const initialToken = JSON.parse(localStorage.getItem('authToken'));
  const [tasks, dispatch] = useReducer(TaskReducer, []);
  const [user, userDispatch] = useReducer(userReducer, {});
  const [userToken, tokenDispatch] = useReducer(TokenReducer, initialToken);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await instance.get('/getUser', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        userDispatch({ type: 'SET_USER', payload: res.data.user });
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    if (userToken) {
      fetchUser();
    }
  }, [userToken]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await instance.get('/getTodos', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        console.log("Fetched tasks:", res.data);

        // Check if the response data is as expected
        if (res.data && Array.isArray(res.data)) {
          dispatch({ type: SET_TASK, payload: res.data });
        } else {
          console.error('Unexpected response structure:', res.data);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    if (userToken) {
      fetchTasks();
    }
  }, [userToken]);

  return (
    <Router>
      <TokenContext.Provider value={{ user, userToken, userDispatch, tokenDispatch }}>
        <TaskContext.Provider value={{ tasks, dispatch }}>
          <Routes>
            <Route path="/signup" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/reset/password/" element={<ResetPassword />} />
            <Route path="/createTask" element={<CreateTask />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/getTodos" element={<GetTodos />} />
            <Route path="/updateTodo" element={<UpdateTodo />} />
            <Route path="/header" element={<Header />} />
          </Routes>
        </TaskContext.Provider>
      </TokenContext.Provider>
    </Router>
  );
};

export default App;
