import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isLogin: true,
    account: null,
}

export const loginSlice = createSlice({
    name: 'loginSlice',
    initialState: initialState,
    reducers: {
        setAccount: (state, action) => {
            state.account = action.payload
        },
        setLogin: (state, action) => {
            state.isLogin = action.payload
            !state.isLogin ? (state.account = null) : state.account
        },
    },
})

export const { setAccount, setLogin } = loginSlice.actions
export default loginSlice.reducer
