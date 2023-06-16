import React, { useState } from "react";
import './SignupPage.css';

function SignupForm() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);

    const handleConfirmPasswordChange = (event) => {
        const inputConfirmPassword = event.target.value;
        setConfirmPassword(inputConfirmPassword);

        if (inputConfirmPassword === password) {
            setConfirmPasswordValid(true);
        } else {
            setConfirmPasswordValid(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Your form submission logic here

    };

    return (
        <div style={{ background: '#dadada', minHeight: 'calc(100vh - 70px)' }} className="d-flex align-items-center justify-content-center">
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-6 col-sm-12">
                        <div className="card">
                            <div className="card-body" style={{ position: 'relative' }}>
                                <h4 className="card-title text-center mb-4">Create an Account</h4>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        {/* <label htmlFor="name">Full Name</label> */}
                                        <input type="text" className="form-control" id="name" placeholder="Enter your name" required />
                                    </div>
                                    <div className="form-group">
                                        {/* <label htmlFor="email">Email Address</label> */}
                                        <input type="email" className="form-control" id="email" placeholder="Enter your email address" required />
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
                                    <button type="submit" className={`btn btn-primary btn-block mt-4 ${password.length >= 6 && confirmPasswordValid ? '' : 'disabled'} ${password.length >= 6 && confirmPasswordValid ? '' : 'cursor-not-allowed'}`}>
                                        Signup
                                    </button>
                                </form>
                                {/* <p className="mt-3 text-center">
                                    Already have an account? <a href="#">Login</a>
                                </p> */}
                                <div className="pizza-slice"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupForm;
