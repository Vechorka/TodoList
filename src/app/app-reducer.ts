import { Dispatch } from "redux"
import {authAPI} from "../api/todolists-api";
import {setIsLoggedInAC} from "../pages/Login/auth-reducer";

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

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case "APP/SET-INITIALIZED":
            return {...state, isInitialized: action.value}
        default:
            return state
    }
}

export const setAppErrorAC = (error: string | null) => ({type:'APP/SET-ERROR', error } as const)
export const setAppStatusAC = (status: RequestStatusType) => ({type:'APP/SET-STATUS', status } as const)
export const setAppInitializedAC = (value: boolean) => ({type:'APP/SET-INITIALIZED', value } as const)

export const initializeAppTC = () => (dispatch: Dispatch) => {
        authAPI.me().then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))

            } else {

            }
            dispatch(setAppInitializedAC(true))
        })
}

export type AppActionsType = ReturnType<typeof setAppErrorAC> |
    ReturnType<typeof setAppStatusAC> |
    ReturnType<typeof setAppInitializedAC>

