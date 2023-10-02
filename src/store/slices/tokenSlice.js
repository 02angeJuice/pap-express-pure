import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    refreshToken: { expire: null, token: '' },
    accessToken: { expire: null, token: '' },
    userName: '',
}

export const tokenSlice = createSlice({
    name: 'tokenSlice',
    initialState,
    reducers: {
        // resetToken: () => initialState,
        resetToken: (state) => {
            state.accessToken = null
            state.refreshToken = null
        },
        setRefreshToken: (state, action) => {
            state.refreshToken = { ...state.refreshToken, ...action.payload }
        },
        setAccessToken: (state, action) => {
            state.accessToken = { ...state.accessToken, ...action.payload }
        },
        setUserName: (state, action) => {
            state.userName = action.payload
        },
    },
})

export const { resetToken, setAccessToken, setRefreshToken, setUserName } =
    tokenSlice.actions
export default tokenSlice.reducer
