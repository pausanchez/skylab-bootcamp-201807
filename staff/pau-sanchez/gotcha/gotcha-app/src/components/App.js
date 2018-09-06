import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, withRouter} from 'react-router-dom'
import Landing from '../pages/landing'
import Register from '../pages/register'
import Login from '../pages/login'
import Profile from '../pages/profile'
import Home from '../pages/home'
import NotebookEditor from '../pages/notebookeditor'
import NotebookPlayer from '../pages/notebookplayer'
import NotebookUpdate from '../pages/notebookupdate'
import Notebooks from '../pages/notebooks'
import Listnotes from '../pages/listnotes'
import NotePlayer from '../pages/noteplayer'
import Faq from '../pages/faq'
import About from '../pages/about'


import Navbar from './Navbar'

class App extends Component {

  state = {
    name: sessionStorage.getItem('name') || '',
    token: sessionStorage.getItem('token') || '',
    landingurl: sessionStorage.getItem('landingurl') || '',
    userId: ''
  }
  
  onLoggedIn = (userId, token) => {
    this.setState({ userId, token })

    sessionStorage.setItem('userId', userId)
    sessionStorage.setItem('token', token)

    this.props.history.push('/home')
  }

  onLogout = e => {
    e.preventDefault()
    this.setState({ userId: '', token: '' })
    sessionStorage.clear()
  }

  isLoggedIn() {
    return !!this.state.token
  }





  render() {

    const { userId, token } = this.state

    return (
      <Router>
        <div>
          <Navbar onLogout={this.onLogout}/>

            <Switch>
              <Route path='/' exact component={Landing} />
              <Route path='/register' render={() => this.isLoggedIn() ? <Redirect to='/home'/> : <Register/>} />
              <Route path='/login' render={() => this.isLoggedIn() ? <Redirect to='/home' /> : <Login onLoggedIn={this.onLoggedIn} />} />
              <Route path='/profile' render={() => this.isLoggedIn() ? <Profile onLogout={this.onLogout}/> : <Redirect to='/' /> }/>
              <Route path='/home' render={() => this.isLoggedIn() ? <Home userId={userId} token={token} onLogout={this.onLogout}/> : <Redirect to='/' />} />
              <Route path='/editor'  render={() => this.isLoggedIn() ? <NotebookEditor userId={userId} token={token} onLogout={this.onLogout}/> : <Redirect to='/'/>} />
              <Route path='/editorlanding'  render={() => <NotebookEditor />} />
              <Route path='/editnotebook/:id/:editor'  render={(props) => this.isLoggedIn() ? <NotebookUpdate id={props.match.params.id} editor={props.match.params.editor} userId={userId} token={token} onLogout={this.onLogout}/> : <Redirect to='/'/>} />
            {/*<Route path='/player/:id/:editor'  render={(props) => this.isLoggedIn() ? <NotebookPlayer id={props.match.params.id} editor={props.match.params.editor} userId={userId} token={token}/> : <Redirect to='/'/>} /> */}
              <Route path='/player/:id/:editor'  render={(props) => <NotebookPlayer id={props.match.params.id} editor={props.match.params.editor} />} />
              <Route path='/notebooks' render={() => this.isLoggedIn() ? <Notebooks userId={userId} token={token} onLogout={this.onLogout}/> : <Redirect to='/'/>} />
              <Route path='/notes' render={() => this.isLoggedIn() ? <Listnotes userId={userId} token={token} onLogout={this.onLogout}/> : <Redirect to='/'/>}/>
              <Route path='/noteplayer/:noteid/:editor' render={(props) => <NotePlayer noteid={props.match.params.noteid} editor={props.match.params.editor} />} />
              <Route path='/faq' component={Faq} />
              <Route path='/about' component={About} />
              <Route render={() => <h1>404</h1>} />
            </Switch>
        </div>
      </Router>

      
    );
  }
}

export default withRouter(App)
