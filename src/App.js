import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";

import AddCar from "./components/add-car.component";
import Car from "./components/car.component";
import CarsList from "./components/cars-list.component";

class App extends Component {
	
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user
      });
    }
  }

  logOut() {
    AuthService.logout();
  }
	
  render() {
    const { currentUser } = this.state;
	  
    return (
      <Router>
        <div>
          <nav className="navbar navbar-expand navbar-light bg-light">
            <a href="/" className="navbar-brand">
              Home
            </a>
            {currentUser ? (
				<div className="navbar-nav mr-auto">
				  <li className="nav-item">
					<Link to={"/cars"} className="nav-link">
					  Cars
					</Link>
				  </li>
				  <li className="nav-item">
					<Link to={"/addCar"} className="nav-link">
					  Add Car
					</Link>
				  </li>
					<li className="nav-item">
					  <a href="/login" className="nav-link" onClick={this.logOut}>
						Logout
					  </a>
					</li>
				</div>
            ) : (
				<div className="navbar-nav mr-auto">		
					<li className="nav-item">
						<a href="/login" className="nav-link" onClick={this.logOut}>
							Login
						</a>
					</li>
					<li className="nav-item">
						<a href="/register" className="nav-link">
							Register
						</a>
					</li>
				</div>
            )}
          </nav>

          <div className="container mt-3">
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/cars" component={CarsList} />
              <Route exact path="/addCar" component={AddCar} />
              <Route exact path="/register" component={Register} />
              <Route path="/cars/:id" component={Car} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
