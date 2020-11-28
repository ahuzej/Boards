import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import ProjectList from './components/ProjectList';
import PrivateRoute from './ui/PrivateRoute';
import { useDispatch, useSelector } from 'react-redux';
import Profile from './People/Profile';
import Navbar from './ui/Navbar';
import { appName } from './ui/uiSettings';
import { Subtitle } from './ui/Title';
import BoardForm from './Boards/BoardForm';
import BoardHome from './Boards/BoardHome';
import { logoutAction } from './actions/authActions';
import Register from './components/Register';
import { getUserSelector } from './slices/userSlice';

function App() {
  const user = useSelector(getUserSelector);
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutAction());
  }
  /**
   * Render app based on login status.
   */
  if (!user.loggedIn) {
    return (
      <div>
        <Router>
          <Switch>
            <Route path='/'>
              <Login />
            </Route>
            <Route exact path='/register'>
              <Register />
            </Route>

          </Switch>

        </Router>
      </div>
    );
  } else {
    return (
      <Router>
        <Navbar>
          <Subtitle dark>{appName}</Subtitle>
          <Link className='nav-item' to='/projects'>Boards</Link>
          <Link className='nav-item' to='/account'>Account</Link>
          <div className='logout-section'>
            <span className='nav-item' onClick={handleLogout}>Logout</span>
          </div>
        </Navbar>
        <Switch>
          <PrivateRoute path='/projects/new'>
            <BoardForm />
          </PrivateRoute>
          <PrivateRoute path='/projects/:id' component={BoardHome}>
          </PrivateRoute>
          <PrivateRoute path='/profile/:id' component={Profile}>
          </PrivateRoute>
          <PrivateRoute exact path='/projects'>
            <ProjectList />
          </PrivateRoute>

        </Switch>
      </Router>

    );
  }

}

export default App;
