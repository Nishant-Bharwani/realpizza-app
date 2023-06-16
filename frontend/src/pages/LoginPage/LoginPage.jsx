// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import styles from './LoginPage.module.css';

// const LoginPage = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log("Email: ", email);
//         console.log("Password: ", password);
//     };

//     return (
//         <div className={`${styles.loginContainer} d-flex justify-content-center align-items-center`}>
//             <form className={styles.loginForm} onSubmit={handleSubmit}>
//                 <h1>Login</h1>
//                 <div className="mb-3">
//                     <input
//                         type="email"
//                         className="form-control"
//                         id="email"
//                         placeholder="Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                     />
//                 </div>
//                 <div className="mb-3">
//                     <input
//                         type="password"
//                         className="form-control"
//                         id="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//                 </div>
//                 <button type="submit" className={`btn btn-primary ${styles.loginBtn}`}>
//                     Login
//                 </button>
//                 <p className={styles.loginSignup}>
//                     Don't have an account? <Link to="/signup">Sign up</Link>
//                 </p>
//             </form>
//         </div>
//     );
// };

// export default LoginPage;



import React, { useState } from "react";
import './LoginForm.css';

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
                                    <button type="submit" className={`btn btn-primary btn-block mt-4`}>
                                        Login
                                    </button>
                                </form>
                                {/* <p className="mt-3 text-center">
                                    Don't have an account? <a href="#">Signup</a>
                                </p> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
