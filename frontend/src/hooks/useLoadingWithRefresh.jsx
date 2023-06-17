import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { config } from '../config';
import { setAuth } from "../store/authSlice";

export function useLoadingWithRefresh() {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {

            try {
                const { data } = await axios.get(`${config.API_URL}/api/auth/refreshToken`, {
                    withCredentials: true
                });

                dispatch(setAuth(data));
                setLoading(false);
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        })();
    }, []);

    return { loading };
}