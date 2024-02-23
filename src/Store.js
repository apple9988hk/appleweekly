import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counter/counterSlice'
import jdataReducer from './features/jdata/jdataSlice'
import jvlfdataReducer from './features/jvlfdata/jvlfdataSlice'
import sdataReducer from './features/sdata/sdataSlice'
import ltdataReducer from './features/ltdata/ltdataSlice'
import ojdataReducer from './features/ojdata/ojdataSlice'

export const store = configureStore({
    reducer: {
      counter: counterReducer,
      jdata: jdataReducer,
      sdata: sdataReducer,
      ltdata: ltdataReducer,
      ojdata: ojdataReducer,
      jvlfdata: jvlfdataReducer
    },
  })