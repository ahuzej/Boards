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
        <NavigationContext.Provider value={{
          title: currentNavigation,
          setTitle: (newTitle) => { setCurrentNavigation(newTitle) }
        }}>
          <Navbar />
          <Switch>
            <PrivateRoute path='/projects/new'>
              <BoardForm />
            </PrivateRoute>
            <PrivateRoute path='/projects/:id' component={BoardHome}>
            </PrivateRoute>
            <PrivateRoute exact path='/projects'>
              <BoardList />
            </PrivateRoute>

          </Switch>

        </NavigationContext.Provider>
      </Router>

    );
  }

}

export default App;
