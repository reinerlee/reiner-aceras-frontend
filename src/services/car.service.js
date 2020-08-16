import http from "../http-common";

class CarDataService {
  getAll(params) {
    return http.get("/cars", { params });
  }

  get(id) {
    return http.get(`/cars/${id}`);
  }
  
  getStats(id) {
    return http.get(`/cars/stats`);
  }

  create(data) {
    return http.post("/cars", data);
  }

  update(id, data) {
    return http.put(`/cars/${id}`, data);
  }

  delete(id) {
    return http.delete(`/cars/${id}`);
  }

  deleteAll() {
    return http.delete("/cars");
  }
}

export default new CarDataService();
