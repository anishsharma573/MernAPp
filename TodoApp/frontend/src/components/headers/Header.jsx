import React from 'react';
import GetTodos from '../createTask/GetTodos';
import CreateTask from "../createTask/createTask"
import './header.css';

const Header = () => {
  return (
    <div className="header-container">
      <CreateTask />
      <GetTodos />
    </div>
  );
};

export default Header;
