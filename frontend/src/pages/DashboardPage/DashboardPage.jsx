import React, { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import PizzaCard from "../../components/PizzaCard/PizzaCard";
import CustomButton from "../../components/shared/CustomButton/CustomButton";
import { addToCart, getAllPizzas } from "../../http";
import styles from "./DashboardPage.module.css";

const DashboardPage = () => {
    const pizzas = [
        {
            id: 1,
            name: "Margherita",
            description: "Tomato sauce, mozzarella cheese, fresh basil.",
            price: 295,
            imageUrl: "https://picsum.photos/200",
        },
        {
            id: 2,
            name: "Pepperoni",
            description: "Tomato sauce, mozzarella cheese, pepperoni.",
            price: 500,
            imageUrl: "https://picsum.photos/200",
        },
        {
            id: 3,
            name: "Meat Lovers",
            description: "Tomato sauce, mozzarella cheese, pepperoni, sausage, bacon, ground beef.",
            price: 500,
            imageUrl: "https://picsum.photos/200",
        },
        {
            id: 4,
            name: "Meat Lovers",
            description: "Tomato sauce, mozzarella cheese, pepperoni, sausage, bacon, ground beef.",
            price: 300,
            imageUrl: "https://picsum.photos/200",
        },
        {
            id: 4,
            name: "Meat Lovers",
            description: "Tomato sauce, mozzarella cheese, pepperoni, sausage, bacon, ground beef.",
            price: 300,
            imageUrl: "https://picsum.photos/200",
        },
        {
            id: 4,
            name: "Meat Lovers",
            description: "Tomato sauce, mozzarella cheese, pepperoni, sausage, bacon, ground beef.",
            price: 300,
            imageUrl: "https://picsum.photos/200",
        },
        {
            id: 4,
            name: "Meat Lovers",
            description: "Tomato sauce, mozzarella cheese, pepperoni, sausage, bacon, ground beef.",
            price: 300,
            imageUrl: "https://picsum.photos/200",
        },
        {
            id: 4,
            name: "Meat Lovers",
            description: "Tomato sauce, mozzarella cheese, pepperoni, sausage, bacon, ground beef.",
            price: 300,
            imageUrl: "https://picsum.photos/200",
        },
        {
            id: 4,
            name: "Meat Lovers",
            description: "Tomato sauce, mozzarella cheese, pepperoni, sausage, bacon, ground beef.",
            price: 300,
            imageUrl: "https://picsum.photos/200",
        },
        {
            id: 4,
            name: "Meat Lovers",
            description: "Tomato sauce, mozzarella cheese, pepperoni, sausage, bacon, ground beef.",
            price: 300,
            imageUrl: "https://picsum.photos/200",
        },
        {
            id: 4,
            name: "Meat Lovers",
            description: "Tomato sauce, mozzarella cheese, pepperoni, sausage, bacon, ground beef.",
            price: 300,
            imageUrl: "https://picsum.photos/200",
        },
        {
            id: 4,
            name: "Meat Lovers",
            description: "Tomato sauce, mozzarella cheese, pepperoni, sausage, bacon, ground beef.",
            price: 300,
            imageUrl: "https://picsum.photos/200",
        },
        {
            id: 4,
            name: "Meat Lovers",
            description: "Tomato sauce, mozzarella cheese, pepperoni, sausage, bacon, ground beef.",
            price: 300,
            imageUrl: "https://picsum.photos/200",
        },
        {
            id: 4,
            name: "Meat Lovers",
            description: "Tomato sauce, mozzarella cheese, pepperoni, sausage, bacon, ground beef.",
            price: 300,
            imageUrl: "https://picsum.photos/200",
        },
        {
            id: 4,
            name: "Meat Lovers",
            description: "Tomato sauce, mozzarella cheese, pepperoni, sausage, bacon, ground beef.",
            price: 300,
            imageUrl: "https://picsum.photos/200",
        },
        {
            id: 4,
            name: "Meat Lovers",
            description: "Tomato sauce, mozzarella cheese, pepperoni, sausage, bacon, ground beef.",
            price: 300,
            imageUrl: "https://picsum.photos/200",
        },
        {
            id: 4,
            name: "Meat Lovers",
            description: "Tomato sauce, mozzarella cheese, pepperoni, sausage, bacon, ground beef.",
            price: 300,
            imageUrl: "https://picsum.photos/200",
        },
        {
            id: 4,
            name: "Meat Lovers",
            description: "Tomato sauce, mozzarella cheese, pepperoni, sausage, bacon, ground beef.",
            price: 300,
            imageUrl: "https://picsum.photos/200",
        },
        {
            id: 4,
            name: "Meat Lovers",
            description: "Tomato sauce, mozzarella cheese, pepperoni, sausage, bacon, ground beef.",
            price: 300,
            imageUrl: "https://picsum.photos/200",
        },
        {
            id: 4,
            name: "Meat Lovers",
            description: "Tomato sauce, mozzarella cheese, pepperoni, sausage, bacon, ground beef.",
            price: 300,
            imageUrl: "https://picsum.photos/200",
        },
    ];

    const [pizzaList, setPizzaList] = useState([]);


    useEffect(() => {
        async function getPizzaList() {
            const { data } = await getAllPizzas();
            setPizzaList(data);
        }

        getPizzaList();
    }, []);

    async function handleAddToCart(pizza) {
        try {
            const { _id } = pizza;
            const { data } = await addToCart({
                pizzaId: _id,
                quantity: 1
            });


            toast.success(data.message, {
                position: "top-right",
            });
        } catch (err) {
            console.log(err);

            toast.error(err.response.data.message, {
                position: "top-right",
            });

        }
    }

    return (
        <>

            <div className={`container mx-auto ${styles.dashboardPage}`}>
                <h1 className={styles.pageTitle}>Available Pizzas</h1>
                <div className={`${styles.allPizzaWrapper}`}>


                    {pizzaList.map((pizza) => (
                        <div key={pizza.id}>
                            <PizzaCard pizza={pizza} handleAddToCart={() => handleAddToCart(pizza)} />
                        </div>
                    ))}



                </div>
            </div>
            <Toaster />
            <CustomButton path="/custom-pizza" />
        </>
    );
};

export default DashboardPage;
