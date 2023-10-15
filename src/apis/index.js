import axios from 'axios'
import {path} from '../constants/url'

export const checkVersion = async () => await axios.post(`${path.APK_VERSION}`)

// == GET
// =================================================================
export const fetchBox = async (item_no) =>
  await axios.post(
    `${path.URL}/api/hh/receipt/box${item_no && `?item_no=${item_no}`}`
  )

export const fetchHeader = async (status) =>
  await axios.post(
    `${path.URL}/api/hh/receipt/all${status && `?status=${status}`}`
  )

export const fetchHeaderSelect = async (receipt_no) =>
  await axios.post(`${path.URL}/api/hh/receipt/${receipt_no}`)

export const fetchDetail = async (receipt_no) =>
  await axios.post(`${path.URL}/api/hh/receipt/${receipt_no}/details`)

export const fetchDetailSelect = async (obj) =>
  await axios.post(
    `${path.URL}/api/hh/receipt/${obj.header_id}/details/${obj.detail_id}`
  )

// export const fetchOrder = async (status) =>
//   await axios.post(
//     `${path.URL}/api/hh/distribute/all${status && `?status=${status}`}`
//   )

export const fetchOrder = async (status) =>
  await axios.post(`${path.URL}/api/hh/distribute/all`, {
    status: status
  })

// export const fetchOrderSelect = async (distribution_id) =>
//   await axios.post(`${path.URL}/api/hh/distribute/${distribution_id}`)

// export const fetchOrderSelect = async (distribution_id) =>
//   await axios.post(`${path.URL}/api/hh/distribute/${distribution_id}`)

export const fetchOrderSelect = async (distribution_id) =>
  await axios.post(`${path.URL}/api/hh/distribute/all`, {
    distribution_id: distribution_id
  })

export const fetchOrderDetail = async (distribution_id) =>
  await axios.post(`${path.URL}/api/hh/distribute/${distribution_id}/detail`)

export const fetchOrderItem = async (obj) =>
  await axios.post(
    `${path.URL}/api/hh/distribute/${obj.order_id}/detail/${obj.item_id}`
  )

// == PATCH
// =================================================================
export const sendDetailsBox = async (obj, token) =>
  await axios
    .patch(`${path.URL}/api/hh/receipt/box`, obj, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((res) =>
      console.log('box: sendDetailsBox SUCCESS, STATUS:', res.status)
    )
    .catch((err) => {
      throw new Error(err.response?.data.statusCode)
    })

export const sendAvailableBox = async (obj, token) =>
  await axios
    .patch(`${path.URL}/api/hh/receipt/detail`, obj, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((res) =>
      console.log('box: sendDetailConfirm SUCCESS, STATUS:', res.status)
    )
    .catch((err) => {
      throw new Error(err.response?.data.statusCode)
    })

export const sendDetailConfirm = async (obj, token) =>
  await axios
    .patch(`${path.URL}/api/hh/receipt/detail`, obj, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((res) =>
      console.log('sendDetailConfirm SUCCESS, STATUS:', res.status)
    )
    .catch((err) => {
      throw new Error(err.response?.data.statusCode)
    })

export const sendShipmentConfirm = async (obj, token) =>
  await axios
    .patch(`${path.URL}/api/hh/receipt/shipment`, obj, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((res) =>
      console.log('sendShipmentConfirm SUCCESS, STATUS:', res.status)
    )
    .catch((err) => {
      throw new Error(err.response?.data.statusCode)
    })

export const sendConfirm = async (obj, token) =>
  await axios
    .patch(`${path.JAM}/admin/UpdateRODetailForHH`, obj, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((res) => {
      console.log('sendConfirm SUCCESS, STATUS:', res.status)
      return res.status
    })
    .catch((err) => {
      throw new Error(err.response?.data.statusCode)
    })

export const sendSignature = async (obj, token) =>
  await axios({
    method: 'patch',
    url: `${path.JAM}/admin/SaveSignature`,
    data: obj,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
    .then((res) => console.log('sendSignature SUCCESS, STATUS:', res.status))
    .catch((err) => {
      throw new Error(err.response?.data.statusCode)
    })

export const sendItemConfirm = async (obj, token) =>
  await axios
    .patch(`${path.URL}/api/hh/distribute/item`, obj, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((res) => console.log('sendItemConfirm SUCCESS, STATUS:', res.status))
    .catch((err) => {
      throw new Error(err.response?.data.statusCode)
    })

export const sendOrderConfirm = async (obj, token) =>
  await axios({
    method: 'patch',
    url: `${path.JAM}/admin/ConfirmDistribute`,
    data: obj,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
    .then((res) => {
      console.log('sendOrderConfirm SUCCESS, STATUS:', res.status)
      return res.status
    })
    .catch((err) => {
      throw new Error(err.response?.data.statusCode)
    })
