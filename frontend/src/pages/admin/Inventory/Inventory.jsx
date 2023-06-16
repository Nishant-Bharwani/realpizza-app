import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import toast, { Toaster } from 'react-hot-toast';

import UpdateStockModal from '../../../components/admin/UpdateStockModal/UpdateStockModal';
import { getAllBases, getAllCheeses, getAllMeats, getAllSauces, getAllVeggies } from '../../../http';
import './Inventory.css';

const Inventory = () => {
    const [isBaseAccordionActive, setIsBaseAccordionActive] = useState(true);

    const toggleBaseAccordion = () => {
        setIsBaseAccordionActive(!isBaseAccordionActive);
    };

    const [isSauceAccordionActive, setIsSauceAccordionActive] = useState(false);

    const toggleSauceAccordion = () => {
        setIsSauceAccordionActive(!isSauceAccordionActive);
    };


    const [isCheeseAccordionActive, setIsCheeseAccordionActive] = useState(false);

    const toggleCheeeseAccordion = () => {
        setIsCheeseAccordionActive(!isCheeseAccordionActive);
    };
    const [isVeggiesAccordionActive, setIsVeggiesAccordionActive] = useState(false);

    const toggleVeggiesAccordion = () => {
        setIsVeggiesAccordionActive(!isVeggiesAccordionActive);
    };
    const [isMeatAccordionActive, setIsMeatAccordionActive] = useState(false);

    const toggleMeatAccordion = () => {
        setIsMeatAccordionActive(!isMeatAccordionActive);
    };


    const [baseData, setBaseData] = useState([]);
    const [sauceData, setSauceData] = useState([]);
    const [cheeseData, setCheeseData] = useState([]);
    const [veggiesData, setVeggiesData] = useState([]);
    const [meatsData, setMeatsData] = useState([]);



    const [showModal, setShowModal] = useState(false);
    const [baseId, setBaseId] = useState('');
    const [sauceId, setSauceId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [baseDataTableKey, setBaseDataTableKey] = useState(0);
    const [sauceDataTableKey, setSauceDataTableKey] = useState(0);


    const reloadBaseDataTable = async () => {
        const { data } = await getAllBases();
        setBaseData(data);
        setBaseDataTableKey(baseDataTableKey + 1);
    }
    const reloadSauceDataTable = async () => {
        const { data } = await getAllSauces();
        setSauceData(data);
        setSauceDataTableKey(sauceDataTableKey + 1);
    }


    const handleBaseUpdate = (row) => {
        setBaseId(row._id);
        setShowModal(true);
    };

    const handleSauceUpdate = (row) => {
        setSauceId(row._id);
        setShowModal(true);
    }




    const baseColumns = [
        {
            name: 'Id',
            selector: row => row._id,
            sortable: false,
            width: '0px',
            cell: () => null,
            header: () => null,
        },
        {
            name: 'Name',
            cell: (row) => {
                return <div style={{ textTransform: 'capitalize' }}>{row.name}</div>
            },
            sortable: true
        },

        {
            name: 'Price',
            selector: row => row.price,
            sortable: true
        },
        {
            name: 'Stock',
            selector: row => row.stock,
            sortable: true
        },

        {
            name: '',
            cell: (row) => {
                return <span onClick={() => handleBaseUpdate(row)} style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    color: '#007bff',
                    fontSize: '1rem',
                    fontWeight: 'normal'
                }}>Update Stock</span>
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];


    const sauceColumns = [
        {
            name: 'Id',
            selector: row => row._id,
            sortable: false,
            width: '0px',
            cell: () => null,
            header: () => null,
        },
        {
            name: 'Name',
            cell: (row) => {
                return <div style={{ textTransform: 'capitalize' }}>{row.name}</div>
            },
            sortable: true
        },

        {
            name: 'Price',
            selector: row => row.price,
            sortable: true
        },
        {
            name: 'Stock',
            selector: row => row.stock,
            sortable: true
        },

        {
            name: '',
            cell: (row) => {
                return <span onClick={() => handleSauceUpdate(row)} style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    color: '#007bff',
                    fontSize: '1rem',
                    fontWeight: 'normal'
                }}>Update Stock</span>
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];


    const restColumnSchema = [
        {
            name: 'Id',
            selector: row => row._id,
            sortable: false,
            width: '0px',
            cell: () => null,
            header: () => null,
        },
        {
            name: 'Name',
            cell: (row) => {
                return <div style={{ textTransform: 'capitalize' }}>{row.name}</div>
            },
            sortable: true
        },

        {
            name: 'Price',
            selector: row => row.price,
            sortable: true
        },
    ]



    useEffect(() => {
        async function handleGetAllBases() {
            const { data } = await getAllBases();
            setBaseData(data);

            const { data: data2 } = await getAllSauces();
            setSauceData(data2);

            const { data: data3 } = await getAllVeggies();
            setVeggiesData(data3);

            const { data: data4 } = await getAllCheeses();
            setCheeseData(data4);

            const { data: data5 } = await getAllMeats();
            setMeatsData(data5);
        }
        handleGetAllBases();
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
    };


    return (
        <div className="accordion-list container mt-5">
            <Toaster />
            <div className={`accordion-item ${isBaseAccordionActive ? 'active' : ''}`}>
                <button className="accordion-title text-left" onClick={toggleBaseAccordion}>
                    Available Bases
                    <span className="accordion-arrow">&#9660;</span>
                </button>
                <div className={`accordion-content ${isBaseAccordionActive ? 'show' : ''}`}>
                    <DataTable
                        title="List of Bases:"
                        key={baseDataTableKey}
                        columns={baseColumns}
                        data={baseData}
                        pagination
                        paginationComponentOptions={{}}
                        responsive
                        highlightOnHover
                        pointerOnHover
                        selectableRows
                        customStyles={{
                            head: {
                                style: {
                                    fontWeight: 'bold',
                                    fontSize: '1.5rem',
                                    textAlign: 'center'
                                }
                            },
                            headCells: {
                                style: {
                                    textAlign: 'center'
                                }
                            },

                            rows: {
                                style: {
                                    color: '#dd4b39',
                                    fontSize: '1.15rem',
                                    fontWeight: 'bold'
                                }
                            },

                            cells: {
                                style: {
                                    textAlign: 'center'
                                }
                            }


                        }}
                    />

                    {showModal && <UpdateStockModal reloadTable={reloadBaseDataTable} baseId={baseId} onClose={handleCloseModal} />}


                </div>
            </div>
            <div className={`accordion-item ${isSauceAccordionActive ? 'active' : ''}`}>
                <button className="accordion-title text-left" onClick={toggleSauceAccordion}>
                    Available Sauces
                    <span className="accordion-arrow">&#9660;</span>
                </button>
                <div className={`accordion-content ${isSauceAccordionActive ? 'show' : ''}`}>
                    <DataTable
                        title="List of Sauces:"
                        key={sauceDataTableKey}
                        columns={sauceColumns}
                        data={sauceData}
                        pagination
                        paginationComponentOptions={{}}
                        responsive
                        highlightOnHover
                        pointerOnHover
                        selectableRows
                        noHeader
                        customStyles={{
                            head: {
                                style: {
                                    fontWeight: 'bold',
                                    fontSize: '1.5rem',
                                    textAlign: 'center'
                                }
                            },
                            headCells: {
                                style: {
                                    textAlign: 'center'
                                }
                            },

                            rows: {
                                style: {
                                    color: '#dd4b39',
                                    fontSize: '1.15rem',
                                    fontWeight: 'bold'
                                }
                            },

                            cells: {
                                style: {
                                    textAlign: 'center'
                                }
                            }


                        }}
                    />

                    {showModal && <UpdateStockModal reloadTable={reloadSauceDataTable} sauceId={sauceId} onClose={handleCloseModal} />}
                </div>
            </div>
            <div className={`accordion-item ${isCheeseAccordionActive ? 'active' : ''}`}>
                <button className="accordion-title text-left" onClick={toggleCheeeseAccordion}>
                    Available Cheeses
                    <span className="accordion-arrow">&#9660;</span>
                </button>
                <div className={`accordion-content ${isCheeseAccordionActive ? 'show' : ''}`}>
                    <DataTable
                        title="List of Cheeses:"
                        columns={restColumnSchema}
                        data={cheeseData}
                        pagination
                        paginationComponentOptions={{}}
                        responsive
                        highlightOnHover
                        pointerOnHover
                        selectableRows
                        noHeader
                        customStyles={{
                            head: {
                                style: {
                                    fontWeight: 'bold',
                                    fontSize: '1.5rem',
                                    textAlign: 'center'
                                }
                            },
                            headCells: {
                                style: {
                                    textAlign: 'center'
                                }
                            },

                            rows: {
                                style: {
                                    color: '#dd4b39',
                                    fontSize: '1.15rem',
                                    fontWeight: 'bold'
                                }
                            },

                            cells: {
                                style: {
                                    textAlign: 'center'
                                }
                            }


                        }}
                    />
                </div>
            </div>
            <div className={`accordion-item ${isVeggiesAccordionActive ? 'active' : ''}`}>
                <button className="accordion-title text-left" onClick={toggleVeggiesAccordion}>
                    Available Veggies
                    <span className="accordion-arrow">&#9660;</span>
                </button>
                <div className={`accordion-content ${isVeggiesAccordionActive ? 'show' : ''}`}>
                    <DataTable
                        title="List of Veggies:"
                        columns={restColumnSchema}
                        data={veggiesData}
                        pagination
                        paginationComponentOptions={{}}
                        responsive
                        highlightOnHover
                        pointerOnHover
                        selectableRows
                        noHeader
                        customStyles={{
                            head: {
                                style: {
                                    fontWeight: 'bold',
                                    fontSize: '1.5rem',
                                    textAlign: 'center'
                                }
                            },
                            headCells: {
                                style: {
                                    textAlign: 'center'
                                }
                            },

                            rows: {
                                style: {
                                    color: '#dd4b39',
                                    fontSize: '1.15rem',
                                    fontWeight: 'bold'
                                }
                            },

                            cells: {
                                style: {
                                    textAlign: 'center'
                                }
                            }


                        }}
                    />
                </div>
            </div>
            <div className={`accordion-item ${isMeatAccordionActive ? 'active' : ''}`}>
                <button className="accordion-title text-left" onClick={toggleMeatAccordion}>
                    Available Meats
                    <span className="accordion-arrow">&#9660;</span>
                </button>
                <div className={`accordion-content ${isMeatAccordionActive ? 'show' : ''}`}>
                    <DataTable
                        title="List of Meats:"
                        columns={restColumnSchema}
                        data={meatsData}
                        pagination
                        paginationComponentOptions={{}}
                        responsive
                        highlightOnHover
                        pointerOnHover
                        selectableRows
                        customStyles={{
                            head: {
                                style: {
                                    fontWeight: 'bold',
                                    fontSize: '1.5rem',
                                    textAlign: 'center'
                                }
                            },
                            headCells: {
                                style: {
                                    textAlign: 'center'
                                }
                            },

                            rows: {
                                style: {
                                    color: '#dd4b39',
                                    fontSize: '1.15rem',
                                    fontWeight: 'bold'
                                }
                            },

                            cells: {
                                style: {
                                    textAlign: 'center'
                                }
                            }


                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default Inventory