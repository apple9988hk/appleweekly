import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counter/counterSlice'
import jdataReducer from './features/jdata/jdataSlice'

export const store = configureStore({
    reducer: {
      counter: counterReducer,
      jdata: jdataReducer,
    },
  })