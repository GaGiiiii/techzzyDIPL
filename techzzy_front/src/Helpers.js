import axios from "axios";

export function login(data) {
  localStorage.setItem("user", JSON.stringify(data.user));
}

export function logout() {
  axios.post(`http://localhost:8000/logout`, {}, { withCredentials: true }).then(res => {
    localStorage.removeItem("user");
  }).catch(error => {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  });
}

export function isLoggedIn() {
  let user = localStorage.getItem('user');
  if (user === null) {
    axios.get(`http://localhost:8000/loggedIn`, { withCredentials: true }).then(res => {
      user = res.data.user;
      localStorage.setItem("user", JSON.stringify(user));
    }).catch(error => {
      user = null;
    });

    return user;
  }

  return JSON.parse(user);
}