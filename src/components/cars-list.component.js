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
      pageSize: 10,
      redirect: null,
      userReady: false,
      currentUser: { username: "" }	  
    };

    this.pageSizes = [10, 20, 30];
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) this.setState({ redirect: "/login" });
    this.retrieveCars();
    this.stats();
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
          cars: cars,
          count: totalPages,
        });
        console.log(response.data);
		
      })
      .catch((e) => {
        console.log(e);
      });
  }

  stats() {
	
    CarDataService.getStats()
      .then((response) => {
        const { totalCars, redCars, blueCars, yellowCars } = response.data;

        this.setState({
          totalCars: totalCars,
          redCars: redCars,
          blueCars: blueCars,
          yellowCars: yellowCars,
        });
        console.log(response.data);
		
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
      totalCars,
      redCars,
      blueCars,
      yellowCars,
    } = this.state;

    return (
      <div className="list row">
		<div class="col-xl-3 col-sm-6 py-2">
			<div class="card bg-success text-white h-100">
				<div class="card-body bg-success">
					<div class="rotate">
						<i class="fa fa-user fa-4x"></i>
					</div>
					<h6 class="text-uppercase">Total Cars</h6>
					<h1 class="display-4">{totalCars}</h1>
				</div>
			</div>
		</div>
		<div class="col-xl-3 col-sm-6 py-2">
			<div class="card text-white bg-danger h-100">
				<div class="card-body bg-danger">
					<div class="rotate">
						<i class="fa fa-list fa-4x"></i>
					</div>
					<h6 class="text-uppercase">Red Cars</h6>
					<h1 class="display-4">{redCars}</h1>
				</div>
			</div>
		</div>
		<div class="col-xl-3 col-sm-6 py-2">
			<div class="card text-white bg-info h-100">
				<div class="card-body bg-info">
					<div class="rotate">
						<i class="fa fa-twitter fa-4x"></i>
					</div>
					<h6 class="text-uppercase">Blue Cars</h6>
					<h1 class="display-4">{blueCars}</h1>
				</div>
			</div>
		</div>		
		<div class="col-xl-3 col-sm-6 py-2">
			<div class="card text-white bg-warning h-100">
				<div class="card-body">
					<div class="rotate">
						<i class="fa fa-share fa-4x"></i>
					</div>
					<h6 class="text-uppercase">Yellow Cars</h6>
					<h1 class="display-4">{yellowCars}</h1>
				</div>
			</div>
		</div>
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
