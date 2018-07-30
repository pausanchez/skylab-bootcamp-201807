import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, withRouter, Link, Redirect } from 'react-router-dom'
import NavBar from "./components/NavBar";
import HomePage from "./components/HomePage";
import SearchPage from "./components/SearchPage"
import FavouritesPage from "./components/FavouritesPage"
import UserPage from "./components/UserPage"
import { Button } from 'reactstrap';
import UserRegister from './components/UserRegister';
import ImageDisplayer from './components/ImageDisplayer';
import UserLogin from './components/UserLogin';
import logic from './logic'


class App extends Component {



  state = {
    loggedIn: logic.loggedIn,
  }

  goToRegister = () => {}
  goToLogin = () => {}
  onLogin = (username, password) => {
    logic.loginUser(username, password)
    .then(() => this.setState({loggedIn: true}))
    .catch(console.error)
  }

  onLogout = event => {
    logic.logout()
    this.setState({loggedIn: false})
  }

  render() {

    const {state :{loggedIn}, onLogout }= this

    return(
      <div>
        <NavBar isLoggedIn={loggedIn}  onLogout={onLogout}/>
        <Route exact path="/" component={HomePage}/>
        <Route  path="/home" component={HomePage} />
        <Route  path="/search" render = {() => loggedIn ? <SearchPage/> : <Redirect to="/home" /> } />
        <Route  path="/user" render={() => loggedIn ? <UserPage/> : <Redirect to="/home" /> } />
        <Route  path="/register" render={() => loggedIn ? <Redirect to="/home" /> : <UserRegister/>} />
        <Route  path="/favourites" render={() => loggedIn ?  <FavouritesPage/> : <Redirect to="/user" /> } />
        <Route  path="/login" render={() => loggedIn ? <Redirect to="/home" /> : <UserLogin onLogin={this.onLogin}/>} />




      </div>)
  }

}

export default App;
