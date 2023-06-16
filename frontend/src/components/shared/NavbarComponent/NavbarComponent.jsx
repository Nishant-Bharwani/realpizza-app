import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from "react-redux";
import styles from './NavbarComponent.module.css';

import { logout } from "../../../http";
import { setAuth } from "../../../store/authSlice";

const NavbarComponent = () => {
  const isAuthorized = useSelector((state) => state.authSlice.isAuth);
  // const role = useSelector((state) => state.authSlice.user.role);
  const user = useSelector((state) => state.authSlice.user);


  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function logoutUser() {
    try {
      const { data } = await logout();
      dispatch(setAuth(data));
      window.location.reload();
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  }

  return (

    <div className="container">
      <nav className={`navbar navbar-expand-lg navbar-light ${styles.pizzaNavbar} py-2`}>
        <div className="container">
          <Link className={`navbar-brand ${styles.pizzaNavbarBrand}`} to="/">
            <img src="/images/logo.png" alt="Pizza Logo" className="navbar-brand-logo" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setShowMenu(!showMenu)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${showMenu && "show"}`}>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
              <li className="nav-item">
                {<Link
                  className={`${styles.pizzaNavLink} nav-link`}
                  aria-current="page"
                  to={isAuthorized ? '/dashboard' : '/'}
                  onClick={() => setShowMenu(false)}
                >
                  Home
                </Link>}
              </li>
              {isAuthorized && <li className="nav-item">
                <Link
                  className={`${styles.pizzaNavLink} nav-link`}
                  to="/orders"
                  onClick={() => setShowMenu(false)}
                >
                  Order
                </Link>
              </li>
              }
              {user && user.role === 'admin' && isAuthorized && <li className="nav-item">
                <Link
                  className={`${styles.pizzaNavLink} nav-link`}
                  to="/admin/inventory"
                  onClick={() => setShowMenu(false)}
                >
                  Inventory
                </Link>
              </li>
              }
              {user && user.role === 'admin' && isAuthorized && <li className="nav-item">
                <Link
                  className={`${styles.pizzaNavLink} nav-link`}
                  to="/admin/orders"
                  onClick={() => setShowMenu(false)}
                >
                  Orders
                </Link>
              </li>
              }
              {isAuthorized && <li className="nav-item">
                <Link to="/cart" className={`${styles.pizzaNavLink}`} onClick={() => setShowMenu(false)}>
                  Cart&nbsp;&nbsp;<i className="fas fa-shopping-cart"></i>
                </Link>
              </li>}



              {isAuthorized ? (
                <li className="nav-item">
                  <button
                    title={`Logout`}
                    className="nav-link"
                    onClick={() => {
                      setShowMenu(false);
                      logoutUser().then(() => {
                        // navigate('/');
                      });
                    }}
                  >
                    Logout&nbsp;&nbsp;<i className="fa fa-sign-out" aria-hidden="true"></i>

                  </button>
                </li>
              ) : (
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/login"
                    onClick={() => setShowMenu(false)}
                  >
                    Login/Signup
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav >
    </div >
  );
}

export default NavbarComponent