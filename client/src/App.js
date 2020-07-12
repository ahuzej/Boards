import React from 'react';
import Navbar from './components/navbar/navbarComponent';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Registration from './components/registration/registrationComponent';
import Login from './components/login/loginComponent';

function App() {
  return (
    <Router>
      <Navbar/>
      <Switch>
        <Route path='/registration'>
          <Registration/>
        </Route>
        <Route path='/login'>
          <Login/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
