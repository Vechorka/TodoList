import { Dispatch } from 'redux'
import { setAppStatusAC } from '../../app/app-reducer'
import {authAPI, LoginParamsType} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {ThunkTypes} from "../../app/store";

const initialState = {
     isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (data: LoginParamsType):ThunkTypes => {
    return (dispatch: Dispatch) =>{
        dispatch(setAppStatusAC('loading'))
        authAPI.login(data)
            .then(res => {
                if (res.data.resultCode === 0){
                    dispatch(setIsLoggedInAC(true))
                    dispatch(setAppStatusAC('succeeded'))
                }
                else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
}}
export const logoutTC = ():ThunkTypes => {
    return (dispatch: Dispatch) =>{
        dispatch(setAppStatusAC('loading'))
        authAPI.logout()
            .then(res => {
                if (res.data.resultCode === 0){
                    dispatch(setIsLoggedInAC(false))
                    dispatch(setAppStatusAC('succeeded'))
                }
                else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
}}


// types
type ActionsType = ReturnType<typeof setIsLoggedInAC>





