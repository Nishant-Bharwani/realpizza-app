import React, { useEffect, useRef } from "react";
import './PizzaButton.css';

const PizzaButton = (props) => {
    const buttonRef = useRef(null);

    useEffect(() => {
        const button = buttonRef.current;

        const toppingCount = Math.round(button.offsetWidth * button.offsetHeight / 3000);

        for (let i = 0; i < toppingCount; i++) {
            const topping = document.createElement("div");
            topping.className = "pizza-topping";
            topping.style.left = `${Math.random() * 100}%`;
            topping.style.top = `${Math.random() * 100}%`;
            button.appendChild(topping);
        }
    }, []);

    return (
        <button className="pizza-button" ref={buttonRef} onClick={props.onClick}>
            {props.children}
        </button>
    );
};

export default PizzaButton;
