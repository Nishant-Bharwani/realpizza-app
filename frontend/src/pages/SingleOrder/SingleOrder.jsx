import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { getOrder } from '../../http';
import { socketInit } from '../../socket/index';
import styles from './SingleOrder.module.css';

const SingleOrder = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState({});

    const socket = useRef(null);


    useEffect(() => {
        async function handleGetOrder() {
            try {
                const { data } = await getOrder({
                    orderId
                });
                setOrder(data);
            } catch (err) {
                console.log(err.response.data.message);
            }
        }

        handleGetOrder();
    }, []);


    useEffect(() => {
        socket.current = socketInit();

        if (socket.current && orderId) {
            socket.current.emit('join', `order_${orderId}`);

            socket.current.on('orderUpdated', (data) => {
                const updatedOrder = { ...order };
                updatedOrder.updatedAt = moment().format();
                updatedOrder.status = data.status;
                setOrder(data);
                toast.success('Order Updated', {
                    position: 'top-right'
                })
            });
        }

        // return () => {
        //     if (socket.current) {
        //         socket.current.disconnect();
        //     }
        // };
    }, [orderId]);




    return (
        <div className={`${styles.statusWrapper}`}>
            <Toaster />
            <div className="container mx-auto mt-5 d-flex align-items-center flex-column justify-content-between">
                <div className={`${styles.status} mx-auto d-flex flex-row-reverse  h-100 flex-column align-items-center justify-content-between w-100`}>
                    <span className='d-flex'><h1>Date</h1>
                        <h6>{moment(order.date).format('DD-MM-YY HH:mm A')}</h6></span>
                    <span className='d-flex'><h1>Phone</h1>
                        <h6>{order.phone}</h6></span>

                    <span className='d-flex'><h1>Address</h1>
                        <h6>{order.address}</h6></span>


                </div>
                <div className={`${styles.status} mx-auto d-flex align-items-center justify-content-center`}>
                    <ul>


                        {['created', 'in_kitchen', 'sent_to_delivery', 'delivered'].map((status, index) => (
                            <li key={index} className={`${index !== 3 ? styles.statusLine : ''} ${order.status === status ? styles.current : order.status === 'delivered' && index === 3 ? styles.current : order.status !== 'delivered' && index < ['created', 'in_kitchen', 'sent_to_delivery'].indexOf(order.status) ? styles.stepCompleted : ''}`}>
                                <span>{status === 'created' ? 'Order Placed' : status === 'in_kitchen' ? 'In the Kitchen' : status === 'sent_to_delivery' ? 'Sent for Delivery' : 'Delivered'}</span>
                            </li>
                        ))}




                    </ul>
                </div>


            </div>
        </div>
    )
}

export default SingleOrder