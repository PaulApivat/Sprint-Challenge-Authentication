import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { NavLink, Route } from 'react-router-dom';
import Signup from './auth/Signup.js';
import Signin from './auth/Signin.js';


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
            <nav>
                <NavLink to='/signup' exact>
                  Sign Up
                </NavLink>
                &nbsp;|&nbsp;
                <NavLink to='/signin' exact>
                  Sign In
                </NavLink>
                &nbsp;|&nbsp;
                <NavLink to='/users' exact>
                  Jokes
                </NavLink>
                &nbsp;|&nbsp;
                  <button onClick={this.signout}>Sign Out</button>
            </nav>
            <main>
              <Route path='/signup' component={Signup} exact></Route>
              <Route path='/signin' component={Signin} exact></Route>
              {/* <Route path='/users' component={Jokes} exact></Route> */}
            </main>
        </header>
      </div>
    );
  }
}

export default App;
