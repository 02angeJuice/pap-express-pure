import axios from 'axios'
import {path} from '../constants/url'

axios.defaults.timeout = 5000

// const url = import.meta.env.REACT_APP_APIURL;
const instance = axios.create({
  baseURL: path.URL //ลิ้ง api
  // baseURL: 'http://localhost:3002',
  // timeout: 5000 //
})

const authHeaders = (token) => {
  return {Authorization: `Bearer ${token}`}
}

const contentJSON = {'Content-Type': 'application/json'}
const contentFormData = {'Content-Type': 'multipart/form-data'}

export const checkVersion = async () => await axios.post(`${path.APK_VERSION}`)

// ----------------------------------------------------------
// == GET
// ----------------------------------------------------------
export const fetchBox = async (item_no) => {
  return await axios
    .post(`${path.URL}/api/hh/receipt/box${item_no && `?item_no=${item_no}`}`)
    .then((res) => {
      return res
    })
    .catch((e) => {
      throw new Error(e)
    })
}

export const hh_sel_box_by_receipt = async (receipt_no) => {
  return await axios
    .post(
      `${path.URL}/api/hh/receipt/allbox${
        receipt_no && `?receipt_no=${receipt_no}`
      }`
    )
    .then((res) => {
      return res.data
    })
    .catch((e) => {
      throw new Error(e)
    })
}

export const hh_sel_box_by_od = async (od) => {
  return await axios
    .post(`${path.URL}/api/hh/receipt/allbox_od${od && `?od=${od}`}`)
    .then((res) => {
      return res.data
    })
    .catch((e) => {
      throw new Error(e)
    })
}

export const hh_check_ro_qty_box = async (data) => {
  console.log(data)
  return await axios
    .post(`${path.URL}/admin/checkRoQtyBox`, data)
    .then((res) => {
      return res.data.msg
    })
    .catch((e) => {
      throw new Error(e)
    })
}

export const fetchHeader = async (status) =>
  await axios.post(`${path.URL}/api/hh/receipt/all`, {
    status: status
  })

export const fetchHeaderSelect = async (receipt_no) =>
  await axios.post(`${path.URL}/api/hh/receipt/all`, {
    receipt_no: receipt_no
  })

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

// export const fetchOrderSelect = async (distribution_id) =>
//   await axios.post(`${path.URL}/api/hh/distribute/${distribution_id}`)
// ----------------------------------------------------------------
export const hh_sel_distributes_by_status = async (status) =>
  await axios.post(`${path.URL}/api/hh/distribute/all`, {
    status: status
  })

export const hh_sel_distributes_by_id = async (distribution_id) =>
  await axios.post(`${path.URL}/api/hh/distribute/all`, {
    distribution_id: distribution_id
  })

export const hh_sel_distributes_pagination = async (status, data) => {
  try {
    const res = await axios.post(
      `${path.URL}/api/hh/distribute/HHSelOrderDistribution?status=${
        status || ''
      }`,
      data
    )
    return res.data
  } catch (error) {
    throw error
  }
}

// ----------------------------------------------------------------

export const fetchOrderDetail = async (distribution_id) =>
  await axios.post(`${path.URL}/api/hh/distribute/${distribution_id}/detail`)

export const fetchOrderItem = async (obj) =>
  await axios.post(
    `${path.URL}/api/hh/distribute/${obj.order_id}/detail/${obj.item_id}`
  )

export const hh_confirm_all = async (obj, token) => {
  try {
    const res = await axios.post(
      `${path.URL}/api/hh/receipt/hh_confirm_all`,
      obj,
      {headers: {Authorization: `Bearer ${token}`}}
    )
    return res?.data
  } catch (error) {
    throw new Error(error.response?.data.statusCode)
  }
}

export const hh_confirm_partial = async (obj, token) => {
  try {
    const res = await axios.post(
      `${path.URL}/api/hh/receipt/hh_confirm_partial`,
      obj,
      {headers: {Authorization: `Bearer ${token}`}}
    )
    return res?.data
  } catch (error) {
    throw new Error(error.response?.data.statusCode)
  }
}

// ----------------------------------------------------------
// == PATCH
// ----------------------------------------------------------
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

// export const sendConfirm = async (obj, token) =>
//   await axios
//     .patch(`${path.JAM}/admin/UpdateRODetailForHH`, obj, {
//       headers: {Authorization: `Bearer ${token}`}
//     })
//     .then((res) => {
//       console.log('sendConfirm SUCCESS, STATUS:', res.status)
//       return res.status
//     })
//     .catch((err) => {
//       throw new Error(err.response?.data.statusCode)
//     })

// loadtotruck
// ----------------------------------------------------------
export const sendShipmentConfirm = async (obj, token) => {
  try {
    const res = await instance.patch('/api/hh/receipt/shipment', obj, {
      headers: authHeaders(token)
    })
    return {status: true, data: res?.data}
  } catch (err) {
    return {status: false, data: err?.response?.data}
  }
}

export const sendSignature = async (obj, token) => {
  try {
    const res = await instance.patch(`/admin/SaveSignature`, obj, {
      headers: {...contentFormData, ...authHeaders(token)}
    })
    return {status: true, data: res?.data}
  } catch (err) {
    return {status: false, data: err?.response?.data}
  }
}

// export const sendConfirm = async (obj, token) => {
//   try {
//     const result = await instance.patch(`/admin/UpdateRODetailForHH`, obj, {
//       headers: authHeaders(token)
//     })
//     return {status: true, data: res?.data}
//   } catch (err) {
//     return {status: false, data: err?.response?.data}
//   }
// }

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

// ----------------------------------------------------------------
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

// ----------------------------------------------------------------
// truck master
export const selTruckList = async (data) => {
  try {
    const res = await instance.post('/admin/selTruckList', data)
    return {status: true, data: res?.data}
  } catch (error) {
    return {status: false, data: error?.response?.data}
  }
}

export const insupdTruckItem = async (data) => {
  try {
    const res = await instance.post('/admin/insupdTruckItem', data)
    return {status: true, data: res?.data}
  } catch (error) {
    return {status: false, data: error?.response?.data}
  }
}

export const delTruckItem = async (data) => {
  try {
    const res = await instance.post('/admin/delTruckItem', data)
    return {status: true, data: res?.data}
  } catch (error) {
    return {status: false, data: error?.response?.data}
  }
}

// ----------------------------------------------------------------
// scan checked
export const boxItemChecked = async (data) => {
  try {
    const res = await instance.post('/admin/delTruckItem', data)
    return {status: true, data: res?.data}
  } catch (error) {
    return {status: false, data: error?.response?.data}
  }
}
