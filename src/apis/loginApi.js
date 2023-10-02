import axios from 'axios'
import { path } from '../constants/url'

// == GET
// =================================================================
export const fetchUserProfile = async (user_id, token) =>
    await axios.post(
        `${path.URL}/user/${user_id}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

// == POST
// =================================================================
export const sendRefreshToken = async (rf_token) =>
    await axios
        .post(
            `${path.JAM}/auth/refresh`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${rf_token}`,
                },
            }
        )
        .then((res) => res)
        .catch((err) => err)

export const sendCheckLoginHH = async (obj) =>
    await axios
        .post(`${path.JAM}/auth/local/checkLoginHH`, obj)
        .then((res) => res)
        .catch((err) => err)

export const sendLoginHH = async (obj) =>
    await axios
        .post(`${path.JAM}/auth/local/signinHH`, obj)
        .then((res) => res)
        .catch((err) => err)

export const sendLogout = async (rf_token) =>
    await axios
        .post(
            `${path.JAM}/auth/logout`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${rf_token}`,
                },
            }
        )
        .then((res) => res)
        .catch((err) => err)
