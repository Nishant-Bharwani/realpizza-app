import React from 'react';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import styles from './VerifyEmailPage.module.css';


const VerifyEmailPage = () => {
    useAuthRedirect();
    return (
        <div className={`${styles.headingWrapper}`}>
            <h1 className={`${styles.headline}`}>Please verify your email to continue</h1>
            <a className={`${styles.openGmailBtn}`} href="https://mail.google.com/">Open Gmail</a>
        </div>
    );
};

export default VerifyEmailPage;
