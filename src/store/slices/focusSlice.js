import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  fetchfocus: true
}

export const focusSlice = createSlice({
  name: 'focusSlice',
  initialState: initialState,
  reducers: {
    setfetchfocus: (state, action) => {
      state.fetchfocus = !state.fetchfocus
    }
  }
})

export const {setfetchfocus} = focusSlice.actions
export default focusSlice.reducer
