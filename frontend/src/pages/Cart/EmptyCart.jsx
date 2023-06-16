import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCart, getRazorpayKey, orderCart, removeFromCart } from '../../http';
import styles from './Cart.module.css';
import emptyCardStyles from './EmptyCart.module.css';
const Cart = () => {

    const [cartList, setCartList] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const userId = useSelector((state) => state.authSlice.user._id);
    const user = useSelector((state) => state.authSlice.user);

    useEffect(() => {
        async function getCartList() {
            const { data } = await getCart(userId);
            setCartList(data);
            setCartTotal(data.total);
        }

        getCartList();

    }, []);

    async function handleRemovePizzaFromCart(pizza) {
        try {
            const pizzaId = pizza.id;
            const { data } = await removeFromCart({
                pizzaId
            });

            toast.success(data.message, {
                position: 'top-right'
            });
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message, {
                position: "top-right",
            })
        }

    }


    // Make an API call to get the updated cartList whenever it changes
    useEffect(() => {
        async function getUpdatedCartList() {
            const { data } = await getCart(userId);
            setCartList(data);
            setCartTotal(data.total);
        }

        getUpdatedCartList();

    }, [cartList]);


    async function handleOrderNow(e) {
        try {
            e.preventDefault();
            const { data } = await orderCart({ address, phone });

            const { data: { key } } = await getRazorpayKey();



            const options = {
                key,
                amount: data.order.totalPrice,
                currency: "INR",
                name: "Real Pizza",
                description: "Test Transaction",
                image: `${process.env.REACT_APP_API_URL}/storage/logo.png`,
                order_id: data.order.razorpayOrder.id,
                callback_url: `${process.env.REACT_APP_API_URL}/api/order/confirmCartOrder?orderId=${data.order.orderId}`,
                headers: {
                    'orderId': `${data.order.orderId}`
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: data.order.phone
                },
                notes: {
                    "address": "Razorpay Corporate Office",
                    "orderId": data.order.orderId
                },
                theme: {
                    "color": "#dd4b39"
                }
            };

            const razor = new window.Razorpay(options);
            razor.open();
        } catch (err) {
            toast.error(err.response.data.message, {
                position: "top-right",
            });
        }

    }



    return (
        <div style={{ background: '#f8f9fa', padding: '4rem 0', minHeight: 'calc(100vh - 70px)' }} >
            <Toaster />

            {!cartList.pizzas || cartList.pizzas.length === 0 ?

                <div className={`${emptyCardStyles.emptyCart}`}>
                    <div className="container mx-auto text-center d-flex flex-column">
                        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Cart Empty !!</h1>

                        <p>You haven't ordered a pizza yet.</p>
                        <img src="/images/empty-cart.png" alt="mm" />

                        <Link to="/dashboard" className={`${emptyCardStyles.goBack}`}>Go Back</Link>
                    </div>
                </div>
                :
                <div className={`${styles.order} ontainer mx-auto w-50`}>
                    <div className='d-flex align-items-center pb-4'>
                        <img src="/images/cart-black.png" alt="n" />
                        <h1 className={`${styles.orderHeading}`}>Order Summary</h1>
                    </div>

                    <div className={`${styles.cartList}`}>

                        {cartList.pizzas.map(pizza => (

                            <div key={pizza.pizza.id} className='d-flex justify-content-between align-items-center border border-5' style={{ margin: '8px 0' }}>
                                <h4 className='ms-4' style={{ width: '60%', textAlign: 'left' }}>{pizza.pizza.name}</h4>

                                <span className='' style={{ width: '15%', textAlign: 'center' }}>{pizza.quantity} Pcs</span>
                                <span className='font-weight-bold' style={{ width: '15%', textAlign: 'center' }}>Rs. {pizza.price}</span>
                                <i className="fas fa-trash-alt text-danger" style={{ width: '10%', textAlign: 'center' }} onClick={() => handleRemovePizzaFromCart(pizza.pizza)}></i>
                            </div>

                        ))}
                    </div>

                    <hr />

                    <div className='py-4' style={{ textAlign: '' }}>
                        <div>
                            <span style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Total Amount: </span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', marginLeft: '0.5rem', color: '#dd4b39' }}>{cartTotal}</span>
                        </div>
                        <form action="" className={`${styles.orderForm}`} style={{ marginTop: '3rem' }} onSubmit={handleOrderNow}>
                            <input className={`${styles.formInputField} mb-4`} placeholder='Enter your address' type="text" value={address} onChange={(event) => setAddress(event.target.value)} required />
                            <br />
                            <input className={`${styles.formInputField}`} placeholder='Enter your phone number' type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required />
                            <div>
                                <button type='submit' className={`${styles.cartSubmitBtn}`}>Order Now</button>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </div >
    )
}

export default Cart;