import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';


import styles from '../UpdateStockModal/UpdateStockModal.module.css';

const OrderDetailsModal = (props) => {



    return (
        <>
            <Toaster />
            <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                    <h2>Order Details</h2>

                    {props.order.pizzas.length === 0 ?

                        <div key={props.order.orderId} className={`d-flex align-items-center ms-4 ${styles.singleOrder}`} style={{ margin: '8px 0' }}>

                            <h5 className='me-3'>{`${props.order.base.name ? props.order.base.name : ""} base, ${props.order.sauce.name ? props.order.sauce.name : ""} with ${props.order.cheese.name ? props.order.cheese.name : ""} cheese and  ${props.order.veggie1.name ? props.order.veggie1.name : ""}${props.order.veggie1.name && props.order.veggie2.name ? " and " : ""}${props.order.veggie2.name ? props.order.veggie2.name : ""} ${props.order.meat.name ? props.order.meat.name : ""}`}</h5>
                            <div className='d-flex flex-column'>
                                <span className='' >{props.order.quantity} Pcs</span>
                                <span className={`${styles.price}`}>₹ {props.order.totalPrice}</span>
                            </div>


                        </div>
                        :


                        props.order.pizzas.map(pizza => (
                            <div key={pizza._id} className={`d-flex align-items-center justify-content-between ${styles.singleOrder}`} style={{ margin: '8px 0' }}>
                                <div className='ms-4 me-5'>
                                    <h5 style={{ fontWeight: 'bold', textAlign: 'left' }}>{pizza.pizza.name}</h5>
                                    <span className='text-muted'>{pizza.pizza.description}</span>
                                </div>
                                <div className='d-flex flex-column'>
                                    <span className='' >{pizza.quantity} Pcs</span>
                                    <span className={`${styles.price}`}>₹ {pizza.price}</span>
                                </div>
                            </div>
                        ))}


                    <div className={styles.buttonContainer}>
                        <button type="button" onClick={props.onClose}>
                            Cancel
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}

export default OrderDetailsModal