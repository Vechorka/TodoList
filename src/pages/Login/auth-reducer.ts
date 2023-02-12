import { Dispatch } from 'redux'
import {authAPI, FieldErrorType, LoginParamsType} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {ThunkTypes} from "../../app/store";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {setAppStatusAC} from "../../app/app-reducer";
import {AxiosError} from "axios";

const initialState = {
     isLoggedIn: false
}

export const loginTC = createAsyncThunk<{isLoggedIn: boolean}, LoginParamsType,{
    rejectValue: {errors: Array<string>, fieldsErrors?: Array<FieldErrorType>}
}
    >('auth/login', async(param, thunkAPI)=>{
    thunkAPI.dispatch(setAppStatusAC({status:'loading'}))
        try {
            const res = await authAPI.login(param)
            if (res.data.resultCode === 0){
                thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
                return {isLoggedIn: true}
            }
            else {
                handleServerAppError(res.data, thunkAPI.dispatch)
                return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors} )
            }
        }
        catch (err) {
        // @ts-ignore
            const error: AxiosError = err
            handleServerNetworkError(error, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined} )
        }
})


const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{value: boolean}>){
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers:(builder) => {
        builder.addCase(loginTC.fulfilled, (state, action)=>{
            if(action.payload){
                state.isLoggedIn = action.payload.isLoggedIn
            }
        })
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions

// thunks

export const logoutTC = ():ThunkTypes => {
    return (dispatch: Dispatch) =>{
        dispatch(setAppStatusAC({status:'loading'}))
        authAPI.logout()
            .then(res => {
                if (res.data.resultCode === 0){
                    dispatch(setIsLoggedInAC({value: false}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                }
                else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
}}







