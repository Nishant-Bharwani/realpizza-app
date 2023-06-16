import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import Loader from '../../components/shared/Loader/Loader';
import { loginUser, registerUser } from '../../http';
import { setAuth } from '../../store/authSlice';
import './AuthForm.css';




function AuthForm() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    function LoginForm() {

        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [loading, setLoading] = useState(false);


        const handleSubmit = async (event) => {
            setLoading(true);
            event.preventDefault();
            try {
                const { data } = await loginUser({ email, password });
                dispatch(setAuth(data));
                // navigate('/verify')
                return <Loader />
            } catch (err) {
                console.log(err.response.data.message);
                toast.error(err.response.data.message, {
                    position: "top-right",
                });

            } finally {
                setLoading(false);
            }

        };

        // if (loading) return <Loader />


        const handleForgotPassword = () => {
            navigate('/forgot-password');
        }

        return (

            <div style={{ background: '#f8f9fa', minHeight: 'calc(100vh - 70px)' }} className="d-flex align-items-center justify-content-center">
                <Toaster />
                <div className="container">
                    <div className="row justify-content-center mt-5">
                        <div className="col-md-6 col-sm-12">
                            <div className="card formCardWrapper">
                                <div className="card-body" style={{ position: 'relative' }}>
                                    <h4 className="card-title text-center mb-4">Login</h4>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            {/* <label htmlFor="email">Email Address</label> */}
                                            <input type="email" className="form-control" id="email" placeholder="Enter your email address" required value={email} onChange={(event) => setEmail(event.target.value)} />
                                        </div>
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
                                                placeholder="Enter your password"
                                            />
                                        </div>
                                        <button type="submit" className={`btn btn-primary btn-block mt-4`} style={{ textAlign: 'center', margin: '0 auto' }}>
                                            Login
                                        </button>
                                    </form>

                                    <p className="mt-3 text-center">
                                        Don't have an account? <span onClick={handleToggleForm}>Signup</span>
                                    </p>
                                    <p className="mt-3 text-center">
                                        <span onClick={handleForgotPassword}>Forgot Password</span>
                                    </p>
                                    <div className="pizza-slice"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    function SignupForm() {
        // useAuthRedirect();
        const [name, setName] = useState("");
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [confirmPassword, setConfirmPassword] = useState("");
        const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
        const [loading, setLoading] = useState(false);

        const handleConfirmPasswordChange = (event) => {
            const inputConfirmPassword = event.target.value;
            setConfirmPassword(inputConfirmPassword);

            if (inputConfirmPassword === password) {
                setConfirmPasswordValid(true);
            } else {
                setConfirmPasswordValid(false);
            }
        };

        const handleSubmit = async (event) => {
            setLoading(true);
            try {
                event.preventDefault();
                const { data } = await registerUser({ name, email, password });

                navigate('/verify/email');

            } catch (err) {
                console.log(err);
                toast.error(err.response.data.message, {
                    position: "top-right",
                });
            } finally {
                setLoading(false);
            }

        };

        // if (loading) return <Loader />

        return (
            <div style={{ background: '#f8f9fa', minHeight: 'calc(100vh - 70px)' }} className="d-flex align-items-center justify-content-center">
                <Toaster />
                <div className="container">
                    <div className="row justify-content-center mt-5">
                        <div className="col-md-6 col-sm-12">
                            <div className="card formCardWrapper">
                                <div className="card-body" style={{ position: 'relative' }}>
                                    <h4 className="card-title text-center mb-4">Create an Account</h4>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            {/* <label htmlFor="name">Full Name</label> */}
                                            <input type="text" className="form-control" id="name" value={name} placeholder="Enter your name" onChange={(event) => setName(event.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            {/* <label htmlFor="email">Email Address</label> */}
                                            <input type="email" className="form-control" id="email" placeholder="Enter your email address" value={email} onChange={(event) => setEmail(event.target.value)} required />
                                        </div>
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
                                                placeholder="Enter your password"
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
                                                placeholder="Retype your password"
                                            />
                                        </div>
                                        <button type="submit" className={`btn btn-primary btn-block mt-4 ${password.length >= 6 && confirmPasswordValid ? '' : 'disabled'} ${password.length >= 6 && confirmPasswordValid ? '' : 'cursor-not-allowed'}`} style={{
                                            margin: '0 auto',
                                            background: '#dd4b39'
                                        }}>
                                            Signup
                                        </button>
                                    </form>
                                    <p className="mt-3 text-center">
                                        Already have an account? <span onClick={handleToggleForm}>Login</span>
                                    </p>
                                    <div className="pizza-slice"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const [isLogin, setIsLogin] = useState(false);

    const handleToggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div>
            {isLogin ? <LoginForm /> : <SignupForm />}
        </div>
    );
}


export default AuthForm;