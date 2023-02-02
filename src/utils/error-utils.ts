import {setAppErrorAC, setAppStatusAC} from "../app/app-reducer";
import {ResponseTaskType} from "../api/todolists-api";
import {Dispatch} from "redux";

export const handleServerAppError = <D> (data: ResponseTaskType<D>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: 'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleServerNetworkError = (error: any, dispatch: Dispatch) => {
    dispatch(setAppErrorAC( error.message ? {error: error.message} : {error: 'Some error occurred'}))
    dispatch(setAppStatusAC({status: 'failed'}))
}