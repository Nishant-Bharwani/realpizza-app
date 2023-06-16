// import React from 'react';
// import styles from './Loader.module.css';

// const Loader = () => {
//     return (
//         <div className={styles.loader}>
//             <div className={`${styles.pizzaSliceContainer}`}>
//                 <img
//                     className={styles.pizzaSlice}
//                     src="/images/pizza-slice.png"
//                     alt="Pizza slice"
//                 />
//                 <p className={styles.loadingCaption}>Loading...</p>
//             </div>
//         </div>
//     )
// }

// export default Loader


import React from 'react';
import styles from './Loader.module.css';

const Loader = () => {
    return (
        <div className={styles.loader}>
            <div className={`${styles.pizzaSliceContainer}`}>
                <img
                    className={styles.pizzaSlice}
                    src="/images/pizza-slice.png"
                    alt="Pizza slice"
                />
                {/* <p className={styles.loadingCaption}>
                    Loading...
                    <span className={styles.dotsContainer}>
                        <span className={styles.dot}>.</span>
                        <span className={styles.dot}>.</span>
                        <span className={styles.dot}>.</span>
                    </span>
                </p> */}
            </div>
        </div>
    );
};

export default Loader;
