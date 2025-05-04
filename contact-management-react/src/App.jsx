// src/App.js
import React from 'react';
import Register from './components/Register';
import Login from './components/Login';
import AddContact from './components/AddContact';

function App() {
  return (
    <div>
      <h1>React Contact Management</h1>
      <Register />
      <Login />
      <AddContact />
    </div>
  );
}

export default App;
