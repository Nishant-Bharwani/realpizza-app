import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { forgotPassword } from '../../http';
import '../AuthForm/AuthForm.css';


const ForgotPassword = () => {

    const [email, setEmail] = useState('');
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const { data } = await forgotPassword({ email });
            toast.success(data.message, {
                position: 'top-right'
            });
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
                                <h4 className="card-title text-center mb-4">Enter your registered email address</h4>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        {/* <label htmlFor="email">Email Address</label> */}
                                        <input type="email" className="form-control" id="email" placeholder="Enter your email address" required value={email} onChange={(event) => setEmail(event.target.value)} />
                                    </div>

                                    <button type="submit" className={`btn btn-primary btn-block mt-4`} style={{ textAlign: 'center', margin: '0 auto' }}>
                                        Submit
                                    </button>
                                </form>

                                {/* <p className="mt-3 text-center">
                                    Don't have an account? <span onClick={handleToggleForm}>Signup</span>
                                </p>
                                <p className="mt-3 text-center">
                                    <span onClick={handleForgotPassword}>Forgot Password</span>
                                </p> */}
                                <div className="pizza-slice"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword