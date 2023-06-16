import './App.css';


import { useSelector } from 'react-redux';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import Loader from './components/shared/Loader/Loader';
import Navbar from './components/shared/NavbarComponent/NavbarComponent';
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';
import About from './pages/About';
import AuthForm from './pages/AuthForm/AuthForm';
import Cart from './pages/Cart/EmptyCart';
import CustOrders from './pages/CustOrder.jsx/CustOrders';
import CustomPizzaPage from './pages/CustomPizzaPage/CustomPizzaPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import HomePage from './pages/HomePage/HomePage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import SingleOrder from './pages/SingleOrder/SingleOrder';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import VerifyEmailPage from './pages/VerifyEmail/VerifyEmailPage';
import Inventory from './pages/admin/Inventory/Inventory';
import Orders from './pages/admin/Orders/Orders';


function App() {
  const isAuth = useSelector((state) => state.authSlice.isAuth);
  const { loading } = useLoadingWithRefresh();

  return loading ? (<Loader />) : (

    <>
      <Router>
        {<Navbar />}
        <Routes>
          <Route path='/' element={
            <HomePage />
          }></Route>
          <Route path='/about' element={<About />}></Route>
          <Route path='/login' element={
            <GuestRoute>
              <AuthForm />
            </GuestRoute>
          }></Route>
          <Route path='/verify/email' element={<VerifyEmailPage />} ></Route>
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }></Route>
          <Route path='/custom-pizza' element={
            <ProtectedRoute>
              <CustomPizzaPage />
            </ProtectedRoute>
          }></Route>

          <Route path='/profile' element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }>


          </Route>
          <Route path='/cart' element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }></Route>

          <Route path='/auth/verify/:token' element={
            <VerifyEmail />
          }>
          </Route>

          <Route path='/forgot-password' element={
            <ForgotPassword />
          }></Route>

          <Route path='/reset-password/:resetToken' element={
            <ResetPassword />
          }></Route>

          <Route path='/orders' element={
            <CustOrders />
          }></Route>

          <Route path='/admin/inventory' element={
            <AdminRoute>
              <Inventory />
            </AdminRoute>
          }></Route>
          <Route path='/admin/orders' element={
            <AdminRoute>
              <Orders />
            </AdminRoute>
          }></Route>

          <Route path='/order/:orderId' element={
            <SingleOrder />
          }></Route>
        </Routes>
      </Router>
    </>
  );
}


const ProtectedRoute = ({ children }) => {
  const isAuth = useSelector((state) => state.authSlice.isAuth);

  const location = useLocation();
  return !isAuth ? (
    <Navigate to="/login" state={{ from: location }} />
  ) : (
    children
  )
}


const AdminRoute = ({ children }) => {
  const user = useSelector((state) => state.authSlice.user);
  const location = useLocation();

  if (!user) {
    // Redirect to login if user is not logged in
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (user.role !== 'admin') {
    // Redirect to home page if user is not an admin
    return <Navigate to="/" />;
  }
  return children;
};




const GuestRoute = ({ children }) => {
  const isAuth = useSelector((state) => state.authSlice.isAuth);
  const location = useLocation();
  return isAuth ? (
    <Navigate to="/dashboard" state={{ from: location }} />
  ) : (
    children
  )
}

export default App;
