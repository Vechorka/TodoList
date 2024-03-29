import {AnyAction, applyMiddleware, combineReducers} from "redux";
import {taskReducer} from "../pages/Todolists/tasks-reducer";
import {todolistsReducer} from "../pages/Todolists/todolists-reducer";
import thunkMiddleware, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {appReducer} from "./app-reducer";
import {authReducer} from "../pages/Login/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";

const rootReducers = combineReducers({
    todolists: todolistsReducer,
    tasks: taskReducer,
    app: appReducer,
    auth: authReducer
})

export type ThunkTypes<ReturnType = void> = ThunkAction<ReturnType, AppRootState, unknown, AnyAction>
export type AppRootState = ReturnType<typeof rootReducers>
export type DispatchType = ThunkDispatch<AppRootState, unknown, AnyAction>
export const useAppDispatch = () => useDispatch<DispatchType>();
export const useAppSelector: TypedUseSelectorHook<AppRootState> = useSelector;

export const store = configureStore({
    reducer: rootReducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware)
})


// @ts-ignore
window.store = store;