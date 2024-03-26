import axios from 'axios'
import {path} from '../constants/url'

export const CheckOnlineWeb = async (token) => {
  return await axios
    .post(
      `${path.JAM}/admin/CheckOnlineWeb`,
      {},
      {headers: {Authorization: `Bearer ${token}`}}
    )
    .then((res) => {
      console.log('CheckOnlineWeb', res.status)
    })
    .catch((error) => {
      throw error
    })
}

// ----------------------------------------------------------
// == GET
// ----------------------------------------------------------
export const fetchUserProfile = async (user_id, token) => {
  return await axios
    .post(
      `${path.URL}/user/${user_id}`,
      {},
      {headers: {Authorization: `Bearer ${token}`}}
    )
    .then((res) => {
      return res.data
    })
    .catch((error) => {
      throw error
    })
}

// ----------------------------------------------------------
// == POST
// ----------------------------------------------------------
export const sendRefreshToken = async (token) =>
  await axios
    .post(
      `${path.JAM}/auth/refresh`,
      {},
      {headers: {Authorization: `Bearer ${token}`}}
    )
    .then((res) => res)
    .catch((err) => err)

export const sendCheckLoginHH = async (obj) => {
  return await axios
    .post(`${path.JAM}/auth/local/checkLoginHH`, obj)
    .then((res) => res)
    .catch((error) => {
      throw error?.response?.data
    })
}

export const sendLoginHH = async (obj) => {
  return await axios
    .post(`${path.JAM}/auth/local/signinHH`, obj)
    .then((res) => res)
    .catch((error) => {
      throw error
    })
}

export const sendLogout = async (token) => {
  return await axios
    .post(
      `${path.JAM}/auth/logout`,
      {},
      {headers: {Authorization: `Bearer ${token}`}}
    )
    .then((res) => res.data)
    .catch((error) => {
      throw error
    })
}
