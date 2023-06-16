import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';


import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../../http';
import '../AuthForm/AuthForm.css';

const ResetPassword = () => {

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
    const navigate = useNavigate();
    const { resetToken } = useParams();




    const handleConfirmPasswordChange = (event) => {
        const inputConfirmPassword = event.target.value;
        setConfirmPassword(inputConfirmPassword);

        if (inputConfirmPassword === password) {
            setConfirmPasswordValid(true);
        } else {
            setConfirmPasswordValid(false);
        }
    };

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const { data } = await resetPassword(resetToken, { password });
            toast.success(data.message, {
                position: 'top-right'
            });
            navigate('/login');
        } catch (err) {
            toast.error(err.response.data.message, {
                position: "top-right",
            });
        }

    }

    return (
        <div style={{ background: '#f8f9fa', minHeight: 'calc(100vh - 70px)' }} className="d-flex align-items-center justify-content-center">
            <Toaster />
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-6 col-sm-12">
                        <div className="card formCardWrapper">
                            <div className="card-body" style={{ position: 'relative' }}>
                                <h4 className="card-title text-center mb-4">Reset Password</h4>
                                <form onSubmit={handleSubmit}>

                                    <div className="form-group">
                                        {/* <label htmlFor="password">Password</label> */}
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            minLength="6"
                                            required
                                            value={password}
                                            onChange={(event) => setPassword(event.target.value)}
                                            placeholder="Enter your new password"
                                        />
                                        <small id="passwordHelpBlock" className={`form-text text-danger ${password.length < 6 ? '' : 'd-none'}text-center`}>
                                            Your password must be at least 6 characters long.
                                        </small>
                                    </div>
                                    <div className="form-group">
                                        {/* <label htmlFor="confirm-password">Confirm Password</label> */}
                                        <input
                                            type="password"
                                            className={`form-control ${confirmPasswordValid ? "is-valid" : "is-invalid"}`}
                                            id="confirm-password"
                                            minLength="6"
                                            required
                                            value={confirmPassword}
                                            onChange={handleConfirmPasswordChange}
                                            placeholder="Retype your new password"
                                        />
                                    </div>
                                    <button type="submit" className={`btn btn-primary btn-block mt-4 ${password.length >= 6 && confirmPasswordValid ? '' : 'disabled'} ${password.length >= 6 && confirmPasswordValid ? '' : 'cursor-not-allowed'}`} style={{ margin: '0 auto', background: '#dd4b39' }}>
                                        Submit
                                    </button>
                                </form>

                                <div className="pizza-slice"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword