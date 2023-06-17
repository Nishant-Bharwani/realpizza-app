import axios from "axios";
import { config } from '../config';

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
    headers: {
        'Content-type': 'application/json',
        Accept: 'application/json'
    }
});

// List of all Endpoints
export const registerUser = (data) => api.post('/auth/register', data);
export const verifyEmail = (token) => api.get(`/auth/verify/${token}`);
export const loginUser = (data) => api.post('/auth/login', data);
export const forgotPassword = (data) => api.post('/auth/forgotPassword', data);
export const resetPassword = (resetToken, data) => api.post(`/auth/resetPassword/${resetToken}`, data);
export const logout = () => api.post('/auth/logout');




export const getAllPizzas = () => api.get('/pizza');
export const getAllBasesName = () => api.get('/pizza/getBases');
export const getAllSaucesName = () => api.get('/pizza/getSauces');
export const getAllCheesesName = () => api.get('/pizza/getCheeses');
export const getAllVeggiesName = () => api.get('/pizza/getVeggies');


export const getAllOrders = (userId) => api.get(`/order/${userId}`);
export const getOrder = (data) => api.post(`/order/getOrder/`, data);

export const addToCart = (data) => api.post(`/order/addToCart`, data);
export const getCart = (userId) => api.post(`/order/getCart/${userId}`);
export const removeFromCart = (data) => api.post('/order/removeFromCart', data);
export const orderCart = (data) => api.post('/order/orderCart', data);

export const orderCustomPizza = (data) => api.post('/order/createOrder', data);
export const getRazorpayKey = () => api.get('/razorpay/getKey');


export const getAllBases = () => api.get('/admin/getBases');
export const getAllSauces = () => api.get('/admin/getSauces');
export const getAllCheeses = () => api.get('/admin/getCheeses');
export const getAllVeggies = () => api.get('admin/getVeggies');
export const getAllMeats = () => api.get('/admin/getMeats');


export const updateBaseStock = (data) => api.put('/admin/updateBaseStock', data);
export const updateSauceStock = (data) => api.put('/admin/updateSauceStock', data);

export const getAllOrdersAdmin = () => api.get('/admin/getAllOrders');


export const updateStatus = (data) => api.put('/admin/updateOrderStatus', data);

api.interceptors.response.use((config) => {
    return config;
}, async(error) => {
    const originalReq = error.config;
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
        originalReq._isRetry = true;
        try {
            await api.get(`${config.API_URL}/api/auth/refreshToken`, {
                withCredentials: true
            });

            return api.request(originalReq);
        } catch (err) {
            console.log(err.message);
        }
    }

    throw error;
});