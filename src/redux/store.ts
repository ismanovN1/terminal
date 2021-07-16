import { configureStore } from '@reduxjs/toolkit'
import mainReducer from './mainSlice'

export const store = configureStore({
    reducer: {
        mainState: mainReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck:false
      })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch