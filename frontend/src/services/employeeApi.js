import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/employees",
});

export const getEmployees = (search = "") =>
  api.get("", {
    params: { search },
  });

export const getEmployee = (id) =>
  api.get(`/${id}`);

export const createEmployee = (data) =>
  api.post("", data);

export const updateEmployee = (id, data) =>
  api.put(`/${id}`, data);

export const deleteEmployee = (id) =>
  api.delete(`/${id}`);