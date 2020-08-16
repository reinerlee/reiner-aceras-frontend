import React, { Component } from "react";
import CarDataService from "../services/car.service";

import AuthService from "../services/auth.service";
import { Redirect } from "react-router-dom";

export default class AddCar extends Component {
  constructor(props) {
    super(props);
    this.onChangeModel = this.onChangeModel.bind(this);
    this.onChangeColor = this.onChangeColor.bind(this);
    this.saveCar = this.saveCar.bind(this);
    this.newCar = this.newCar.bind(this);

    this.state = {
      id: null,
      model: "", 
      color: "Red",
      redirect: null,
      userReady: false,
      currentUser: { username: "" },
      submitted: false

    };
  }
  
  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) this.setState({ redirect: "/login" });
  }
  
  onChangeModel(e) {
    this.setState({
      model: e.target.value
    });
  }

  onChangeColor(e) {
    this.setState({
      color: e.target.value
    });
  }

  saveCar() {
    var data = {
      model: this.state.model,
      color: this.state.color
    };

    CarDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          model: response.data.model,
          color: response.data.description,
          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newCar() {
    this.setState({
      id: null,
      model: "",
      color: "",
    });
  }

  render() {

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }	 	  	  
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <a href="/cars"><button className="btn btn-success" onClick={this.newCar}>
              Back
            </button></a>
          </div>
        ) : (
          <div>

            <div className="form-group">
              <label htmlFor="model">Model</label>
              <input
                type="text"
                className="form-control"
                id="model"
                required
                value={this.state.model}
                onChange={this.onChangeModel}
                name="model"
              />
            </div>

            <div className="form-group">
              <label htmlFor="color">Color</label>
			  <select className="form-control" id="color" name="color" value={this.state.color} onChange={this.onChangeColor}>
				<option value="Red">Red</option>
				<option value="Blue">Blue</option>
				<option value="Yellow">Yellow</option>
			  </select>
            </div>


            <button onClick={this.saveCar} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>
    );
  }
}
