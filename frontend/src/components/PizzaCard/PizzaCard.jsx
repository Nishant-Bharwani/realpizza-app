import React, { useState } from "react";
// import { FaChevronDown } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import { Link } from "react-router-dom";
import { addToCart } from "../../http";
import styles from "./PizzaCard.module.css";

const PizzaCard = ({ pizza, handleAddToCart }) => {


    async function addToCartAndShowToast() {
        try {
            await handleAddToCart(pizza);
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message, {
                position: "top-right",
            });
        }
    }


    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <div className={`${styles.pizzaCardWrapper}`}>
            {/* <Toaster /> */}
            <img src={pizza.image} alt="" className={`${styles.pizzaImg}`} />
            <div className="text-center d-flex flex-column justify-content-center align-items-center">
                <h2 className={`${styles.pizzaCardTitle}`}>{pizza.name}</h2>
                {/* <span className={`${styles.pizzaInfo}`}>{pizza.description}</span> */}
                <button
                    className={`d-flex align-items-center`} href=""
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{ border: 'none', color: '#007bff', textDecoration: 'underline', outline: 'none', background: 'transparent' }}
                >
                    <span className="">
                        {isExpanded ? "Hide Details" : "View Details"}
                    </span>
                    <span
                        className={`ml-2 ${isExpanded ? `${styles.downArrow} ${styles.rotated}` : styles.downArrow
                            }`}
                    />
                </button>
                {isExpanded &&
                    <span className={`mt-4 ${styles.pizzaInfo}`}>{pizza.description}</span>

                }



            </div>
            <div className="d-flex justify-content-between align-items-center mt-4 mx-auto" style={{ width: '90%' }}>
                <span>₹ {pizza.price}</span>





                <button className={`d-flex align-items-center ${styles.orderBtn}`} onClick={addToCartAndShowToast}>
                    <span className="">Add +</span>
                </button>




            </div>
        </div>
    );
};

export default PizzaCard;
