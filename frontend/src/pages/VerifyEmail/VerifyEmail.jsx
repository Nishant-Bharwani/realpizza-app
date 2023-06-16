import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { verifyEmail } from '../../http';
import { setAuth } from '../../store/authSlice';

const VerifyEmail = () => {

    const { token } = useParams();
    const [verificationStatus, setVerificationStatus] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const verifyToken = async () => {
            const { data } = await verifyEmail(token);
            setVerificationStatus(data.isVerified);
            dispatch(setAuth(data));

            if (data.isVerified === true) {
                navigate('/dashboard');
            }

        };

        verifyToken();
    }, [token]);


    return (
        <div>VerifyEmail, {verificationStatus}</div>
    )
}

export default VerifyEmail