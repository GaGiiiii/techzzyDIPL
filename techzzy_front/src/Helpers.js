import axios from "axios";

export function login(data) {
  localStorage.setItem("user", JSON.stringify(data.user));
}

export function logout() {
  axios.post(`http://localhost:8000/logout`, {}, { withCredentials: true }).then(res => {
    console.log(res.data);
    localStorage.removeItem("user");
  }).catch(error => {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  });
}

export function isLoggedIn() {
  localStorage.getItem("user");
}