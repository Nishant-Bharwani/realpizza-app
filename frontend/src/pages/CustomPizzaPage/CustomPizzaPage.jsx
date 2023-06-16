import React, { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import OrderModal from "../../components/OrderModal/OrderModal";
import PizzaButton from "../../components/shared/PizzaButton/PizzaButton";
import { getAllBasesName, getAllCheesesName, getAllSaucesName, getAllVeggiesName, orderCustomPizza } from "../../http";

import styles from './CustomPizzaPage.module.css';

const CustomPizzaPage = () => {
    const [base, setBase] = useState("");
    const [sauce, setSauce] = useState("");
    const [cheese, setCheese] = useState("");
    const [selectedVeggies, setSelectedVeggies] = useState([]);


    const [basesList, setBasesList] = useState([]);
    const [saucesList, setSaucesList] = useState([]);
    const [cheesesList, setCheesesList] = useState([]);
    const [veggiesList, setVeggiesList] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [orderData, setOrderData] = useState({});
    const [quantity, setQuantity] = useState(1);


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
        const veggie = e.target.value;
        const isChecked = e.target.checked;

        const index = selectedVeggies.indexOf(veggie);

        if (isChecked && index === -1) {
            if (selectedVeggies.length < 2) {
                setSelectedVeggies([...selectedVeggies, veggie]);
            }
        } else if (!isChecked && index !== -1) {
            setSelectedVeggies([
                ...selectedVeggies.slice(0, index),
                ...selectedVeggies.slice(index + 1),
            ]);
        }
    }


    const handleCloseModal = () => {
        setShowModal(false);
    };

    const getImageSrc = () => {
        let imageUrl = '/images/custom_pizzas/pizza-'

        switch (base) {
            case "thin-crust":
                imageUrl += "thin-crust";
                break;
            case "thick-crust":
                imageUrl += "thick-crust";
                break;
            case "whole-wheat-crust":
                imageUrl += "whole-wheat-crust";
                break;
            case "gluten-free-crust":
                imageUrl += "gluten-free-crust";
                break;
            case "cauliflower-crust":
                imageUrl += "cauliflower-crust";
                break;
            default:
                break;
        }


        if (selectedVeggies.length > 0) {
            imageUrl += `-${selectedVeggies.join("-")}`;
        }


        imageUrl += ".png";

        return imageUrl;

    };

    const imageUrl = getImageSrc();



    const handleOrderNow = async () => {
        try {
            console.log("Ordered", {
                base,
                sauce,
                cheese,
                selectedVeggies
            });

            let dataObj = {};
            if (base) {
                dataObj.base = {
                    name: base
                }
            }

            if (sauce) {
                dataObj.sauce = {
                    name: sauce
                }
            }

            if (cheese) {
                dataObj.cheese = {
                    name: cheese
                }
            }

            if (selectedVeggies.length === 0) {

            } else if (selectedVeggies.length === 1) {
                dataObj.veggies = [
                    {
                        name: selectedVeggies[0]
                    }
                ]
            } else {
                dataObj.veggies = [
                    {
                        name: selectedVeggies[0]
                    },
                    {
                        name: selectedVeggies[1]
                    }
                ]
            }
            if (quantity) {
                dataObj.quantity = quantity;
            } else {
                setQuantity(1);
                dataObj.quantity = 1;

            }

            const { data } = await orderCustomPizza(dataObj);
            toast.success(data.message, { position: 'top-right' });

            setOrderData(data);
            setShowModal(true);
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message, {
                position: "top-right",
            });
        }

    };

    let selectedVeggieCaption = "";
    if (selectedVeggies.length === 0) {

    } else if (selectedVeggies.length === 1) {
        selectedVeggieCaption = `${selectedVeggies[0]}`
    } else if (selectedVeggies.length === 2) {
        selectedVeggieCaption = `${selectedVeggies[0]} and ${selectedVeggies[1]}`
    }


    useEffect(() => {
        async function getStockData() {
            try {
                const { data: bases } = await getAllBasesName();
                const { data: sauces } = await getAllSaucesName();
                const { data: cheeses } = await getAllCheesesName();
                const { data: veggies } = await getAllVeggiesName();

                setBasesList(bases);
                setSaucesList(sauces);
                setCheesesList(cheeses);
                setVeggiesList(veggies);
            } catch (err) {
                console.log(err);
            }
        }

        getStockData();
    }, []);

    return (
        <div className={`${styles.customizePageWrapper} container`}>
            <h1>Customize Your Pizza</h1>
            <Toaster />
            {showModal && <OrderModal orderData={orderData} onClose={handleCloseModal} />}

            <div className={`${styles.mainContentWrapper} d-flex align-items-center justify-content-evenly flex-wrap`}>
                <div className={`${styles.pizzaImageWrapper}`}>
                    {/* {<img src={imageUrl} alt={imageUrl} />} */}
                    {<p className={`${styles.pizzaCaption}`}>{`${base} base with ${sauce} sauce, ${cheese} cheese with ${selectedVeggies.length !== 0 ? selectedVeggieCaption : ""}`}</p>}

                    <label style={{ color: '#dd4b39', fontSize: '1.6rem' }} htmlFor="quantity">Enter quantity: </label>
                    <input type="number" name="quantity" placeholder="Enter quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                    <PizzaButton onClick={handleOrderNow}>Order Now</PizzaButton>
                </div>
                <div style={{ display: 'flex' }} className={`${styles.pizzaControllers}`}>
                    <div style={{
                        width: '400px', marginRight: '50px', display: 'block',
                        marginBottom: '20px'
                    }}>
                        <h3 style={{ color: '#dd4b39' }}>Choose Your Base:</h3>
                        <select value={base} onChange={handleBaseChange} required>
                            <option value="">--Please choose a base--</option>
                            {/* <option value="Thin crust">Thin Crust</option>
                            <option value="Thick crust">Thick Crust</option>
                            <option value="Whole wheat crust">Whole Wheat Crust</option>
                            <option value="Gluten free crust">Gluten Free Crust</option>
                            <option value="Cauliflower crust">Cauliflower Crust</option> */}
                            {basesList.map((base) => (
                                <option key={base.name} value={base.name} style={{ textTransform: 'capitalize' }}>{base.name}</option>
                            ))}
                        </select>

                        <h3 style={{ color: '#dd4b39' }}>Choose Your Sauce:</h3>
                        <select value={sauce} onChange={handleSauceChange} required>
                            <option value="">--Please choose a sauce--</option>
                            {/* <option value="Tomato sauce">Tomato Sauce</option>
                            <option value="Pesto sauce">Pesto</option>
                            <option value="Alfredo sauce">Alfredo</option>
                            <option value="Barbecue sauce">Barbecue</option>
                            <option value="Garlic olive oil">Garlic Olive Oil</option> */}
                            {saucesList.map((sauces) => (
                                <option key={sauces.name} value={sauces.name} style={{ textTransform: 'capitalize' }}>{sauces.name}</option>
                            ))}
                        </select>
                        <h3 style={{ color: '#dd4b39' }}>Choose Your Cheese:</h3>
                        <select value={cheese} onChange={handleCheeseChange}>
                            <option value="">--Please choose a cheese--</option>
                            {/* <option value="Mozzarella">Mozzarella</option>
                            <option value="Parmesan">Parmesan</option>
                            <option value="Cheddar">Cheddar</option>
                            <option value="Gouda">Gouda</option>
                            <option value="Feta">Feta</option> */}
                            {cheesesList.map((cheese) => (
                                <option key={cheese.name} value={cheese.name} style={{ textTransform: 'capitalize' }}>{cheese.name}</option>
                            ))}
                        </select>


                        <div style={{ width: "400px" }} >
                            <h3 style={{ color: '#dd4b39' }}>Choose Your Veggies (max 2):</h3>

                            {selectedVeggies.length === 2 && (
                                <p className={`${styles.textDanger}`}>You can select at max. 2 veggies</p>
                            )}

                            {/* <div className="form-check" style={{ display: 'flex', padding: 0 }}>
                                <input
                                    className={`${styles.veggieInputCheckbox}`}
                                    type="checkbox"
                                    value="mushrooms"
                                    onChange={handleVeggiesChange}
                                    checked={selectedVeggies.includes("mushrooms")}
                                    disabled={selectedVeggies.length === 2 && !selectedVeggies.includes("mushrooms")}
                                />

                                <label className={`${styles.labelVeggie} form-check-label`} htmlFor="mushrooms">
                                    Mushrooms
                                </label>
                            </div>
                            <div className="form-check" style={{ display: 'flex', padding: 0 }}>
                                <input
                                    className={`${styles.veggieInputCheckbox}`}
                                    type="checkbox"
                                    value="onions"
                                    onChange={handleVeggiesChange}
                                    checked={selectedVeggies.includes("onions")}
                                    disabled={selectedVeggies.length === 2 && !selectedVeggies.includes("onions")}
                                />

                                <label className={`${styles.labelVeggie} form-check-label`} htmlFor="onions">
                                    Onions
                                </label>
                            </div>
                            <div className="form-check" style={{ display: 'flex', padding: 0 }}>
                                <input
                                    className={`${styles.veggieInputCheckbox}`}
                                    type="checkbox"
                                    value="tomatoes"
                                    onChange={handleVeggiesChange}
                                    checked={selectedVeggies.includes("tomatoes")}
                                    disabled={selectedVeggies.length === 2 && !selectedVeggies.includes("tomatoes")}
                                />

                                <label className={`${styles.labelVeggie} form-check-label`} htmlFor="tomatoes">
                                    Tomatoes
                                </label>
                            </div>
                            <div className="form-check" style={{ display: 'flex', padding: 0 }}>
                                <input
                                    className={`${styles.veggieInputCheckbox}`}
                                    type="checkbox"
                                    value="olives"
                                    onChange={handleVeggiesChange}
                                    checked={selectedVeggies.includes("olives")}
                                    disabled={selectedVeggies.length === 2 && !selectedVeggies.includes("olives")}
                                />

                                <label className={`${styles.labelVeggie} form-check-label`} htmlFor="olives">
                                    Olives
                                </label>
                            </div>
                            <div className="form-check" style={{ display: 'flex', padding: 0 }}>
                                <input
                                    className={`${styles.veggieInputCheckbox}`}
                                    type="checkbox"
                                    value="jalapenos"
                                    onChange={handleVeggiesChange}
                                    checked={selectedVeggies.includes("jalapenos")}
                                    disabled={selectedVeggies.length === 2 && !selectedVeggies.includes("jalapenos")}
                                />

                                <label className={`${styles.labelVeggie} form-check-label`} htmlFor="jalapenos">
                                    Jalapenos
                                </label>
                            </div> */}

                            {veggiesList.map((veggie) => (
                                <div key={veggie.name} className="form-check" style={{ display: 'flex', padding: 0 }}>
                                    <input
                                        className={`${styles.veggieInputCheckbox}`}
                                        type="checkbox"
                                        value={veggie.name}
                                        onChange={handleVeggiesChange}
                                        checked={selectedVeggies.includes(veggie.name)}
                                        disabled={selectedVeggies.length === 2 && !selectedVeggies.includes(veggie.name)}
                                    />

                                    <label className={`${styles.labelVeggie} form-check-label`} htmlFor={veggie.name} style={{ textTransform: 'capitalize' }}>
                                        {veggie.name}
                                    </label>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>
        </div >

    );
};

export default CustomPizzaPage;
