import React, { useEffect, useRef, useState } from "react";

const CustomPizzaPage2 = () => {
    const [base, setBase] = useState("");
    const [sauce, setSauce] = useState("");
    const [cheese, setCheese] = useState("");
    const [veggies, setVeggies] = useState([]);


    const canvasRef = useRef(null);
    let ctx;
    useEffect(() => {
        const canvas = canvasRef.current;
        ctx = canvas.getContext("2d");
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // clear canvas before redrawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw base
        drawCircle(centerX, centerY, 100, "#F5DEB3");

        // draw sauce
        drawCircle(centerX, centerY, 90, getSauceColor(sauce));

        // draw cheese
        drawCircle(centerX, centerY, 80, getCheeseColor(cheese));

        // draw veggies
        drawToppings(centerX, centerY, 70, veggies);
    }, [base, sauce, cheese, veggies]);

    const handleBaseChange = (e) => {
        setBase(e.target.value);
    };

    const handleSauceChange = (e) => {
        setSauce(e.target.value);
    };

    const handleCheeseChange = (e) => {
        setCheese(e.target.value);
    };

    const handleVeggiesChange = (e) => {
        const selectedVeggies = Array.from(e.target.selectedOptions, (option) =>
            option.value
        );
        setVeggies(selectedVeggies);
    };

    const pizzaToppings = [base, sauce, cheese, ...veggies].filter(
        (topping) => !!topping
    );

    const drawCircle = (x, y, radius, color) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    };

    const getSauceColor = (sauce) => {
        switch (sauce) {
            case "marinara":
                return "#FF5733";
            case "pesto":
                return "#228B22";
            case "alfredo":
                return "#F4A460";
            case "bbq":
                return "#8B0000";
            case "garlic-olive-oil":
                return "#FFFF00";
            default:
                return "#FFFFFF";
        }
    };

    const getCheeseColor = (cheese) => {
        switch (cheese) {
            case "mozzarella":
                return "#FFFACD";
            case "parmesan":
                return "#F5DEB3";
            case "cheddar":
                return "#FFA500";
            case "gouda":
                return "#DAA520";
            case "feta":
                return "#FFFFFF";
            default:
                return "#FFFFFF";
        }
    };

    const drawToppings = (centerX, centerY, radius, toppings) => {
        const toppingsPerRow = Math.ceil(Math.sqrt(toppings.length));
        const angleBetweenToppings = (2 * Math.PI) / toppings.length;
        const spacing = (radius * 2) / toppingsPerRow;

        toppings.forEach((topping, index) => {
            const row = Math.floor(index / toppingsPerRow);
            const col = index % toppingsPerRow;
            const x = centerX - radius + col * spacing + spacing / 2;
            const y = centerY - radius + row * spacing + spacing / 2;

            switch (topping) {
                case "mushrooms":
                    drawMushroom(x, y, radius / toppingsPerRow, "#DAA520");
                    break;
                case "onions":
                    drawOnion(x, y, radius / toppingsPerRow, "#FFFFFF");
                    break;
                case "peppers":
                    drawPepper(x, y, radius / toppingsPerRow, "#FF5733");
                    break;
                case "olives":
                    drawOlive(x, y, radius / toppingsPerRow, "#000000");
                    break;
                case "tomatoes":
                    drawTomato(x, y, radius / toppingsPerRow, "#FF0000");
                    break;
                case "spinach":
                    drawSpinach(x, y, radius / toppingsPerRow, "#228B22");
                    break;
                default:
                    break;
            }
        });
    };




    // Draw a mushroom at the given x, y coordinates with the given radius
    const drawMushroom = (x, y, radius, color) => {
        // Draw the mushroom cap
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y - radius, radius, Math.PI, 0);
        ctx.fill();
        ctx.closePath();

        // Draw the mushroom stem
        const stemHeight = radius * 2;
        const stemWidth = radius / 2;
        ctx.beginPath();
        ctx.fillRect(x - stemWidth / 2, y, stemWidth, stemHeight);
        ctx.closePath();
    }

    // Draw an onion at the given x, y coordinates with the given radius
    const drawOnion = (x, y, radius, color) => {
        // Draw the onion bulb
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        // Draw the onion layers
        const numLayers = 4;
        const layerWidth = radius * 0.4;
        for (let i = 0; i < numLayers; i++) {
            const layerRadius = radius * (0.6 + i * 0.1);
            ctx.beginPath();
            ctx.arc(x, y, layerRadius, 0, 2 * Math.PI);
            ctx.lineWidth = layerWidth;
            ctx.strokeStyle = color;
            ctx.stroke();
            ctx.closePath();
        }
    }

    // Draw a pepper at the given x, y coordinates with the given radius
    const drawPepper = (x, y, radius, color) => {
        // Draw the pepper body
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        // Draw the pepper stem
        const stemHeight = radius * 0.6;
        const stemWidth = radius * 0.2;
        ctx.beginPath();
        ctx.fillRect(x - stemWidth / 2, y - stemHeight, stemWidth, stemHeight);
        ctx.closePath();
    }

    // Draw an olive at the given x, y coordinates with the given radius
    const drawOlive = (x, y, radius, color) => {
        // Draw the olive body
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        // Draw the olive pit
        const pitRadius = radius * 0.5;
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(x, y, pitRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    // Draw a tomato at the given x, y coordinates with the given radius
    const drawTomato = (x, y, radius, color) => {
        // Draw the tomato body
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        // Draw the tomato stem
        const stemHeight = radius * 0.4;
        const stemWidth = radius * 0.1;
        ctx.beginPath();
        ctx.fillRect(x - stemWidth / 2, y - radius - stemHeight, stemWidth, stemHeight);
        ctx.closePath();
    }

    // Draw spinach at the given x, y coordinates with the given radius
    const drawSpinach = (ctx, centerX, centerY, radius) => {
        // Draw the spinach leaves
        const leafSize = radius / 5;
        const leafColor = '#387D3A';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.bezierCurveTo(
            centerX + leafSize, centerY + leafSize,
            centerX + leafSize, centerY - leafSize,
            centerX, centerY - leafSize * 2
        );
        ctx.bezierCurveTo(
            centerX - leafSize, centerY - leafSize,
            centerX - leafSize, centerY + leafSize,
            centerX, centerY
        );
        ctx.fillStyle = leafColor;
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.bezierCurveTo(
            centerX + leafSize, centerY - leafSize,
            centerX + leafSize * 2, centerY - leafSize * 2,
            centerX + leafSize * 3, centerY - leafSize
        );
        ctx.bezierCurveTo(
            centerX + leafSize * 2, centerY,
            centerX + leafSize, centerY,
            centerX, centerY - leafSize
        );
        ctx.fillStyle = leafColor;
        ctx.fill();
        ctx.closePath();
    };













    return (
        <canvas
            ref={canvasRef}
            width={400}
            height={400}
            style={{ border: "1px solid #000" }}
        />


    );
};



export default CustomPizzaPage2;