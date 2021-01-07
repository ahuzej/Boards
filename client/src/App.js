import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Login from './ui/Login';
import BoardList from './Boards/BoardList';
import PrivateRoute from './ui/PrivateRoute';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './ui/Navbar';
import BoardForm from './Boards/BoardForm';
import BoardHome from './Boards/BoardHome';
import Register from './ui/Register';
import { getUserSelector } from './slices/userSlice';
import { getAllBoards, resetBoards } from './slices/boardsSlice';
import NavigationContext from './contexts/NavigationContext';
import { appName } from './ui/uiSettings';
import ProfileHome from './Profile/ProfileHome';

function App() {
  const user = useSelector(getUserSelector);
  const dispatch = useDispatch();
  const [currentNavigation, setCurrentNavigation] = useState(appName);
  const boardStatus = useSelector(state => state.boards.status);
  useEffect(() => {
    if (user.loggedIn && boardStatus === 'idle') {
      dispatch(getAllBoards());
    }

    return () => {
      if (boardStatus === 'complete') {
        dispatch(resetBoards());
      }
    }

  }, [boardStatus, dispatch, user.id, user.loggedIn, user.token]);

  /**
   * Render app based on login status.
   */
  if (!user.loggedIn) {
    return (
      <div>
        <Router>
          <Switch>
            <Route path='/register'>
              <Register />
            </Route>
            <Route path='/'>
              <Login />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  } else {
    return (
      <Router>
        <NavigationContext.Provider value={{
          title: currentNavigation,
          setTitle: (newTitle) => { setCurrentNavigation(newTitle) }
        }}>
          <Navbar />
          <Switch>
            <PrivateRoute path='/boards/new'>
              <BoardForm />
            </PrivateRoute>
            <PrivateRoute path='/boards/:id' component={BoardHome}>
            </PrivateRoute>
            <PrivateRoute exact path='/boards'>
              <BoardList />
            </PrivateRoute>
            <PrivateRoute exact path='/profile/:id'>
              <ProfileHome />
            </PrivateRoute>
            <PrivateRoute>
              <BoardList />

            </PrivateRoute>
          </Switch>

        </NavigationContext.Provider>
      </Router>

    );
  }

}

export default App;
