import {authAPI} from "../api/todolists-api";
import {setIsLoggedInAC} from "../pages/Login/auth-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type InitialStateType = {
    status: RequestStatusType,
    error: string | null,
    isInitialized: boolean
}

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}

export const initializeAppTC = createAsyncThunk('app/initialize', async(param,{dispatch})=>{
    const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}))
        }
        else {
        }
    })


const slice = createSlice({
     name: 'app',
    initialState: initialState,
    reducers:{
        setAppErrorAC: (state, action: PayloadAction<{error: string | null}>) => {
            state.error = action.payload.error
        },
        setAppStatusAC: (state, action: PayloadAction<{status: RequestStatusType}>) => {
            state.status = action.payload.status
        }
    },
    extraReducers: builder => {
         builder.addCase(initializeAppTC.fulfilled, (state) => {
             state.isInitialized = true
        })
    }
})

export const appReducer = slice.reducer
export const {setAppStatusAC, setAppErrorAC} = slice.actions





