import {AnyAction, applyMiddleware, combineReducers, createStore} from "redux";
import {taskReducer} from "./tasks-reducer";
import {todolistsReducer} from "./todolists-reducer";
import thunkMiddleware, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

const rootReducers = combineReducers({
    todolists: todolistsReducer,
    tasks: taskReducer
})

export type ThunkTypes<ReturnType = void> = ThunkAction<ReturnType, AppRootState, unknown, AnyAction>
export type AppRootState = ReturnType<typeof rootReducers>
export type DispatchType = ThunkDispatch<AppRootState, unknown, AnyAction>
export const useAppDispatch = () => useDispatch<DispatchType>();
export const useAppSelector: TypedUseSelectorHook<AppRootState> = useSelector;

export const store = createStore(rootReducers, applyMiddleware(thunkMiddleware))



// @ts-ignore
window.store = store;