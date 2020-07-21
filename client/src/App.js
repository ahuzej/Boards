import React, { useState } from 'react';
import Navbar from './components/navbar/Navbar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './components/home/Home';
import Registration from './components/registration/Registration';
import Login from './components/login/Login';
import PrivateRoute from './_components/privateRoute/PrivateRoute';
import { AuthContext } from './context/authContext/AuthContext';
import AuthService from './_services/AuthService';
import CssBaseline from '@material-ui/core/CssBaseline';
import NewProject from './components/newProject/NewProject';

function App() {
  const [user, setUser] = useState(AuthService.getCurrentUser());
  const value = { user, setUser };

  return (
    <AuthContext.Provider value={value}>
      <CssBaseline />
      <Router>
        <Navbar />
          <Switch>
            <PrivateRoute path='/home' component={Home} />
            <Route path='/registration' component={Registration} />
            <Route path='/login' component={Login} />
            <PrivateRoute path='/project/new' component={NewProject} />
          </Switch>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
