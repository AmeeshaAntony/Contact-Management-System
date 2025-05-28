import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ViewContacts from './components/ViewContacts';
import AddContact from './components/AddContact';
import EditContact from './components/EditContact';
import NavBar from './components/NavBar';
import Home from './components/Home';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? (
    <>
      <NavBar />
      {children}
    </>
  ) : (
    <Navigate to="/" />
  );
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contacts" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/view-contacts" element={<PrivateRoute><ViewContacts /></PrivateRoute>} />
        <Route
          path="/add-contact"
          element={
            <PrivateRoute>
              <AddContact />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-contact/:id"
          element={
            <PrivateRoute>
              <EditContact />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <PrivateRoute>
              <EditContact />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
