import axios from "axios";

const backendPortNumber = "5001";
const serverUrl = `http://${window.location.hostname}:${backendPortNumber}/`;

export async function get(endpoint, params = "") {
  return axios.get(serverUrl + endpoint + params, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
}

export async function post(endpoint, data) {
  const bodyData = JSON.stringify(data);
  return axios.post(serverUrl + endpoint, bodyData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
}

export async function uploadFile(endpoint, formData) {
  return axios.post(serverUrl + endpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
}

export async function put(endpoint, data) {
  const bodyData = JSON.stringify(data);
  return axios.put(serverUrl + endpoint, bodyData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
}

export async function del(endpoint, params = "") {
  return axios.delete(serverUrl + endpoint + params, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
}

export async function patch(endpoint, data) {
  const bodyData = JSON.stringify(data);
  return axios.patch(serverUrl + endpoint, bodyData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
}
