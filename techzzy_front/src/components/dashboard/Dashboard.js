import React from 'react'
import Footer from '../Footer';
import NavbarC from '../NavbarC';
import './dashboard.css';
import { CurrentUserContext } from '../../App';
import { useContext } from 'react';
import { Redirect } from 'react-router';

export default function Dashboard({ products }) {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  if (!currentUser) {
    return <Redirect to="/login" />
  }

  function checkForFlash() {
    if (sessionStorage.getItem('loginS')) {
      return true;
    }

    return false;
  }

  function removeFlash() {
    sessionStorage.removeItem('loginS');
  }

  return (
    <>
      <NavbarC products={products} />
      {checkForFlash() && sessionStorage.getItem('loginS')}
      {removeFlash()}
      <Footer />
    </>
  )
}
