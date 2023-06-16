import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import toast, { Toaster } from 'react-hot-toast';
import { getAllOrdersAdmin, updateStatus } from '../../../http';
import { socketInit } from '../../../socket';

import OrderDetailsModal from '../../../components/admin/OrderDetailsModal/OrderDetailsModal';

const Orders = () => {

    const [showModal, setShowModal] = useState(false);
    const [ordersData, setOrdersData] = useState([]);
    const [order, setOrder] = useState({});

    const socket = useRef(null);

    useEffect(() => {
        async function handleGetAllOrders() {
            const { data } = await getAllOrdersAdmin();
            setOrdersData(data);
        }

        handleGetAllOrders();
    }, []);

    useEffect(() => {
        socket.current = socketInit();

        if (socket.current) {
            socket.current.emit('join', "adminOrderPage");

            socket.current.on('orderConfirmedCart', (data) => {
                toast.success(`New Order From ${data.name}`, {
                    position: 'top-center'
                });
            });

            socket.current.on('orderConfirmed', (data) => {
                toast.success(`New Order From ${data.name}`, {
                    position: 'top-center'
                });
            });
        }
    }, []);

    const StatusDropdown = ({ orderId, value, onChange }) => {
        const [status, setStatus] = useState(value);
        const options = ['created', 'in_kitchen', 'sent_to_delivery', 'delivered'];

        const handleStatusChange = async (e) => {
            try {
                const newStatus = e.target.value;
                setStatus(newStatus);
                onChange(newStatus);
            } catch (err) {
                console.log(err);
            }

        };

        return (
            <select value={status} onChange={handleStatusChange}>
                {options.map(option => (
                    <option style={{ textTransform: 'capitalize' }} key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        );
    };


    const handleStatusChange = async (row, newStatus) => {
        try {
            const { orderId } = row;
            // Update the status in the backend
            const { data } = await updateStatus({ orderId, status: newStatus });
            // Handle the state update or any other logic here
            toast.success(data.message, {
                position: 'top-right'
            })
        } catch (err) {
            console.log(err);

            toast.error(err.response.data.message, {
                position: "top-right",
            });
        }
    };

    const handleViewDetails = (row) => {
        setShowModal(true);
        setOrder(row);
    };


    const handleCloseModal = () => {
        setShowModal(false);
    };


    const orderColumns = [
        {
            name: 'Id',
            selector: row => row._id,
            sortable: false,
            width: '0px',
            cell: () => null,
            header: () => null,
        },
        {
            name: 'Order Id',
            cell: (row) => {
                if (row.orderId) {
                    return <span style={{
                        color: '#dd4b39'
                    }}>{row.orderId}</span>;
                } else {
                    return 'No OrderId';
                }
            },
            sortable: true
        },
        {
            name: 'User Details',
            cell: (row) => {
                if (row.userId) {
                    return <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <span>{row.userId.name}</span>
                        <span className='mt-1 text-primary' style={{
                            fontWeight: '600'
                        }}>{row.userId.email}</span>
                    </div>
                } else {
                    return 'No User Information'
                }
            },
            width: '20%'
        },
        {
            name: 'Address',
            cell: (row) => {
                if (row.address) {
                    return row.address;
                } else {
                    return 'No Address';
                }
            }
        },
        {
            name: 'Phone',
            cell: (row) => {
                if (row.phone) {
                    return row.phone;
                } else {
                    return 'No Phone';
                }
            },
            sortable: true
        },
        {
            name: 'Date',
            cell: (row) => {
                if (row.date) {
                    return moment(row.date).format('DD-MM-YY HH:mm A');
                } else {
                    return 'No Date';
                }
            },
            sortable: true,
            width: '13%'
        },
        {
            name: 'Amount',
            cell: (row) => {
                if (row.totalPrice) {
                    return row.totalPrice;
                } else {
                    return 'No Price';
                }
            },
            sortable: true
        }, {
            name: 'Status',
            selector: row => row.status,
            cell: (row) => <StatusDropdown orderId={row.orderId} value={row.status} onChange={(newStatus) => handleStatusChange(row, newStatus)} />
        },
        {
            name: '',
            cell: (row) => {
                return <span onClick={() => { handleViewDetails(row) }} style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    color: '#007bff',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                }}>View Details</span>
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }

    ]

    return (
        <div className="container mt-5 text-center">
            <h1 style={{ color: '#dd4b39', margin: '2rem' }}>List Of All Orders</h1>

            <div className='border border-2'>
                <Toaster />
                <DataTable
                    columns={orderColumns}
                    data={ordersData}
                    pagination
                    paginationComponentOptions={{}}
                    responsive
                    striped
                    bordered
                    highlightOnHover
                    pointerOnHover
                    customStyles={{
                        head: {
                            style: {
                                fontWeight: 'bold',
                                textAlign: 'center',
                                fontSize: '1.125rem'
                            }
                        },
                        headCells: {
                            style: {
                                textAlign: 'center'
                            }
                        },

                        rows: {
                            style: {
                                textAlign: 'center',
                                fontWeight: '600'
                            }
                        },

                        cells: {
                            style: {
                                textAlign: 'center'
                            }
                        }


                    }}
                />

                {showModal && <OrderDetailsModal onClose={handleCloseModal} order={order} />}
            </div>
        </div>
    )
}

export default Orders