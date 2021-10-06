import axios from "axios";

export function login(user) {
  console.log(user);
  localStorage.setItem("user", JSON.stringify(user));
}

export function logout(user) {
  axios.post(`http://localhost:8000/api/logout`, {}, { headers: { Authorization: `Bearer ${user.token}` } }).then(res => {
    localStorage.removeItem("user");
  }).catch(error => {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  });
}

export function isLoggedIn() {
  return localStorage.getItem('user') === null ? null : JSON.parse(localStorage.getItem('user'));
}