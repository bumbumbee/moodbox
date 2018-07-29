import React, { Component } from 'react';
import {Route, BrowserRouter,Switch} from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './components/pages/Home';
import Account from './components/pages/Account';
import SinglePost from './components/pages/SinglePost';
import NoFound from './components/pages/NoFound';
import Author from './components/pages/Author';
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import jwt from 'jsonwebtoken';
import {connect} from 'react-redux';
import * as actions from './actions/authAction';
import axios from 'axios';



class App extends Component {
  componentWillMount(){
    try{
      // pries surenderinant cmp. darom uzklausa i l.s
      const token = localStorage.getItem('moodbox-token');
      // paimam info is token
      if(!token) return
      // jei turim token irasom ji i headers axios bilbiotekoj
      axios.defaults.headers.common['Authorization'] = token;
      const user = jwt.decode(token.split(' ')[1]);
      this.props.setUser(user)
      // update state->auth reducer
    }catch (err){
      console.log(err);
    }
  }
  render() {
    return (
      <BrowserRouter>
       <div>
         <Header/>
         <Switch>
           <Route exact path='/' component={Home}/>
           <Route path='/login' component={Login}/>
           <Route path='/register' component={Register}/>
           <Route path='/account' component={Account}/>
           <Route path='/post/:title' component={SinglePost}/>
           <Route path='/author/:id' component={Author}/>
           <Route component={NoFound}/>
         </Switch>
       </div>
      </BrowserRouter>
    );
  }
}

export default connect(null, actions)(App);
