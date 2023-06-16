import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

import PizzaButton from '../../components/shared/PizzaButton/PizzaButton';
const HomePage = () => {
  const isAuth = true;
  const navigate = useNavigate();
  return (
    <>
      <div className={`${styles.hero}`}>
        <div className={`d-flex container mx-auto justify-content-center align-items-center w-100 h-100 ${styles.mainContent}`}>
          <div className="w-50 d-flex flex-column justify-content-center align-items-center">
            <h6><em>Aren't you hungry?</em></h6>
            <h1 >Don't wait !</h1>
            {/* <PizzaButton className='mx-auto' onClick={() => {
              isAuth === false ? navigate('login') : navigate('/dashboard')

            }}>Get Started</PizzaButton> */}
            <button className='mx-auto' onClick={() => {
              isAuth === false ? navigate('login') : navigate('/dashboard')

            }}>Get Started</button>
          </div>
          <div className="container d-flex justify-content-center align-items-start mx-auto w-50">
            <img className="" src="/images/pizza.png" alt="pizza" />
          </div>
        </div>
      </div>

    </>
  )
}
export default HomePage;