import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    language: 'gb',
    filter_di: 'DATA ENTRY',
    filter_re: 'ONSHIP',
}

export const settingSlice = createSlice({
    name: 'settingSlice',
    initialState,
    reducers: {
        resetLanguage: () => initialState,
        resetFilter: (state, action) => {
            state.filter_di = 'DATA ENTRY'
            state.filter_re = 'ONSHIP'
        },
        setLanguage: (state, action) => {
            state.language = action.payload
        },

        setFilterDi: (state, action) => {
            state.filter_di = action.payload
        },
        setFilterRe: (state, action) => {
            state.filter_re = action.payload
        },
    },
})

export const { setLanguage, resetFilter, setFilterDi, setFilterRe } =
    settingSlice.actions
export default settingSlice.reducer
