import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
    headers: {
        'Content-type': 'application/json',
        Accept: 'application/json'
    }
});

// List of all Endpoints
export const registerUser = (data) => api.post('/api/auth/register', data);
export const verifyEmail = (token) => api.get(`/api/auth/verify/${token}`);
export const loginUser = (data) => api.post('/api/auth/login', data);
export const forgotPassword = (data) => api.post('/api/auth/forgotPassword', data);
export const resetPassword = (resetToken, data) => api.post(`/api/auth/resetPassword/${resetToken}`, data);
export const logout = () => api.post('/api/auth/logout');




export const getAllPizzas = () => api.get('/api/pizza/');
export const getAllBasesName = () => api.get('/api/pizza/getBases');
export const getAllSaucesName = () => api.get('/api/pizza/getSauces');
export const getAllCheesesName = () => api.get('/api/pizza/getCheeses');
export const getAllVeggiesName = () => api.get('api/pizza/getVeggies');


export const getAllOrders = (userId) => api.get(`/api/order/${userId}`);
export const getOrder = (data) => api.post(`/api/order/getOrder/`, data);

export const addToCart = (data) => api.post(`/api/order/addToCart`, data);
export const getCart = (userId) => api.post(`api/order/getCart/${userId}`);
export const removeFromCart = (data) => api.post('/api/order/removeFromCart', data);
export const orderCart = (data) => api.post('/api/order/orderCart', data);

export const orderCustomPizza = (data) => api.post('api/order/createOrder', data);
export const getRazorpayKey = () => api.get('/api/razorpay/getKey');


export const getAllBases = () => api.get('/api/admin/getBases');
export const getAllSauces = () => api.get('/api/admin/getSauces');
export const getAllCheeses = () => api.get('/api/admin/getCheeses');
export const getAllVeggies = () => api.get('api/admin/getVeggies');
export const getAllMeats = () => api.get('/api/admin/getMeats');


export const updateBaseStock = (data) => api.put('/api/admin/updateBaseStock', data);
export const updateSauceStock = (data) => api.put('/api/admin/updateSauceStock', data);

export const getAllOrdersAdmin = () => api.get('/api/admin/getAllOrders');


export const updateStatus = (data) => api.put('/api/admin/updateOrderStatus', data);

api.interceptors.response.use((config) => {
    return config;
}, async(error) => {
    const originalReq = error.config;
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
        originalReq._isRetry = true;
        try {
            await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/refreshToken`, {
                withCredentials: true
            });

            return api.request(originalReq);
        } catch (err) {
            console.log(err.message);
        }
    }

    throw error;
});