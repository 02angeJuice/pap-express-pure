import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage' // react-native

import loginSlice from './slices/loginSlice'
import tokenSlice from './slices/tokenSlice'
import settingSlice from './slices/settingSlice'

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
}

const rootReducer = combineReducers({
    login: loginSlice,
    token: tokenSlice,
    setting: settingSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

// const defaultMiddleware = getDefaultMiddleware({
//     serializableCheck: {
//         ignoredActions: ['persist/REHYDRATE', 'persist/PERSIST'],
//     },
// })

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
})

export const persistor = persistStore(store)
