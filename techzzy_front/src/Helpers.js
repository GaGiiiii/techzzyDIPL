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

export function calculateProductRating(product) {
  let rating = 0;

  for (let i = 0; i < product.ratings.length; i++) {
    rating += product.ratings[i].rating;
  }

  return (Math.round(rating / product.ratings.length * 100) / 100) || 0;
}

export function formatDate(date) {
  let formattedDate = new Date(date);
  formattedDate = `${("0" + formattedDate.getDate()).slice(-2)}.${("0" + (formattedDate.getMonth() + 1)).slice(-2)}.${formattedDate.getFullYear()}. ${("0" + formattedDate.getHours()).slice(-2)}:${("0" + formattedDate.getMinutes()).slice(-2)}`;

  return formattedDate;
}