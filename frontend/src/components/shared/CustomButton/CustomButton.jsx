import React from "react";
import { Link } from "react-router-dom";
import styles from './CustomPizzaButton.module.css';

const CustomButton = (props) => {
    return (
        <button className={`${styles.customPizzaButton}`}>
            <img src="/images/customize-pizza.png" alt="Pizza watermark" className={`${styles.pizzaWatermark}`} />
            <div className={`${styles.overlay}`}>
                <span className={`${styles.overlayText}`}>
                    <Link to={`${props.path}`} style={{ textDecoration: 'none', color: '#fff' }}>CUSTOMIZE PIZZA</Link>
                </span>
            </div>
        </button >

    );
};

export default CustomButton;
