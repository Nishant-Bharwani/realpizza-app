import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { updateBaseStock, updateSauceStock } from '../../../http';

import styles from './UpdateStockModal.module.css';

const UpdateStockModal = (props) => {


    const [quantity, setQuantity] = useState(props.currentStock);

    async function handleSubmit(e) {
        e.preventDefault();

        try {

            let dataMsg = "";
            if (props.baseId) {
                const { data } = await updateBaseStock({
                    baseId: props.baseId,
                    quantity
                });

                dataMsg = data.message;
                props.onClose();
                props.reloadTable();
                toast.success(dataMsg, {
                    position: "top-right",
                });
            } else if (props.sauceId) {
                const { data } = await updateSauceStock({
                    sauceId: props.sauceId,
                    quantity
                });

                dataMsg = data.message;

                props.onClose();
                props.reloadTable();
                toast.success(dataMsg, {
                    position: "top-right",
                });
            }
        } catch (err) {
            console.log(err);


            toast.error(err.response.data.message, {
                position: "top-right",
            });
        }
    }

    function handleQuantityChange(e) {
        setQuantity(e.target.value);
    }


    return (
        <>
            <Toaster />
            <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                    {/* <button className="closeBtn" onClick={onClose}>
            x
        </button> */}
                    <h2>Update Stock Quantity</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            {/* <label htmlFor="quantity">Quantity:</label> */}
                            <input
                                type="number"
                                id="quantity"
                                placeholder={`Enter quantity to be added`}
                                onChange={handleQuantityChange}
                                required
                            />
                        </div>
                        <div className={styles.buttonContainer}>
                            <button type="submit">Update</button>
                            <button type="button" onClick={props.onClose}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default UpdateStockModal