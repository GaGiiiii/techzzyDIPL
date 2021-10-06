import React, {useContext} from 'react'
import Footer from '../Footer';
import NavbarC from '../NavbarC';
import { CurrentUserContext } from '../../App';
import { Redirect } from 'react-router';
import './dashboard.css';


export default function Dashboard({ products }) {
  const { currentUser } = useContext(CurrentUserContext);

  if (!currentUser) {
    return <Redirect to="/login" />
  }

  return (
    <>
      <NavbarC products={products} />
      <Footer />
    </>
  )
}
