import React, { Component } from "react";
import CarDataService from "../services/car.service";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";

import AuthService from "../services/auth.service";
import { Redirect } from "react-router-dom";

export default class CarsList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.retrieveCars = this.retrieveCars.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveCar = this.setActiveCar.bind(this);
    this.removeAllCars = this.removeAllCars.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);

    this.state = {
      cars: [],
      currentCar: null,
      currentIndex: -1,
      searchTitle: "",
      color: "",

      page: 1,
      count: 0,
      pageSize: 3,
      redirect: null,
      userReady: false,
      currentUser: { username: "" }	  
    };

    this.pageSizes = [3, 6, 9];
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) this.setState({ redirect: "/login" });
    this.retrieveCars();
  }

  onChangeSearchTitle(e) {
    const searchTitle = e.target.value;

    this.setState({
      searchTitle: searchTitle,
    });
  }

  getRequestParams(searchTitle, page, pageSize, color) {
    let params = {};

    if (searchTitle) {
      params["searchTerm"] = searchTitle;
    }

    if (page) {
      params["page"] = page - 1;
    }
	
	if (color) {
      params["color"] = color;
    }

    if (pageSize) {
      params["size"] = pageSize;
    }

    return params;
  }

  retrieveCars() {
    const { searchTitle, page, pageSize , color} = this.state;
    const params = this.getRequestParams(searchTitle, page, pageSize,color);

    CarDataService.getAll(params)
      .then((response) => {
        const { cars, totalPages } = response.data;

        this.setState({
          cars: response.data,
          count: totalPages,
        });
        console.log(response.data);
		console.log('load data');
      })
      .catch((e) => {
        console.log(e);
      });
  }

	onChangeColor = (e) => {
		this.setState({
			color: e.target.value
		},
			this.refreshList
		);
	}

  refreshList() {
    this.retrieveCars();
    this.setState({
      currentCar: null,
      currentIndex: -1,
    });
  }

  setActiveCar(car, index) {
    this.setState({
      currentCar: car,
      currentIndex: index,
    });
  }

  removeAllCars() {
    CarDataService.deleteAll()
      .then((response) => {
        console.log(response.data);
        this.refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  }
  
	enterSearch = (event) => {
		if(event.key === 'Enter') {
			this.refreshList();
		};
	}  
  
  
  handlePageChange(event, value) {
    this.setState(
      {
        page: value,
      },
      () => {
        this.retrieveCars();
      }
    );
  }

  handlePageSizeChange(event) {
    this.setState(
      {
        pageSize: event.target.value,
        page: 1
      },
      () => {
        this.retrieveCars();
      }
    );
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }	  
    const {
      searchTitle,
      cars,
      currentCar,
      currentIndex,
      page,
      count,
      pageSize,
    } = this.state;

    return (
      <div className="list row">
        <div className="col-md-12">
          <div className="input-group mb-3 col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              value={searchTitle}
              onChange={this.onChangeSearchTitle}
			  onKeyDown={this.enterSearch}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.retrieveCars}
              >
                Search
              </button>
		  
            </div>
            <div className="input-group-append col-md-4">
			  Color Filter
			  <select className="form-control" id="color" name="color" value={this.state.color} onChange={this.onChangeColor}>
				<option value="">All</option>
				<option value="Red">Red</option>
				<option value="Blue">Blue</option>
				<option value="Yellow">Yellow</option>
			  </select>				
			  </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Cars List</h4>

          <div className="mt-3">
            {"Items per Page: "}
            <select onChange={this.handlePageSizeChange} value={pageSize}>
              {this.pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>


          </div>

          <ul className="list-group">
            {cars &&
              cars.map((car, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveCar(car, index)}
                  key={index}
                >
                  {car.model} - {car.color}
                </li>
              ))}
          </ul>

          <button
            className="m-3 btn btn-sm btn-danger"
            onClick={this.removeAllCars}
          >
            Remove All
          </button>
        </div>
        <div className="col-md-6">
          {currentCar ? (
            <div>
              <h4>Car</h4>
              <div>
                <label>
                  <strong>Model:</strong>
                </label>{" "}
                {currentCar.model}
              </div>
              <div>
                <label>
                  <strong>Color:</strong>
                </label>{" "}
                {currentCar.color}
              </div>

              <Link
                to={"/cars/" + currentCar.id}
                className="badge badge-warning"
              >
                Edit
              </Link>
            </div>
          ) : (
            <div>
            </div>
          )}
        </div>
		
          <div className="mt-3">
            <Pagination
              className="my-3"
              count={count}
              page={page}
              siblingCount={1}
              boundaryCount={1}
              variant="outlined"
              shape="rounded"
              onChange={this.handlePageChange}
            />
          </div>		
      </div>
    );
  }
}
