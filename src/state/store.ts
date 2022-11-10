import {applyMiddleware, combineReducers, createStore} from "redux";
import {taskReducer} from "./tasks-reducer";
import {todolistsReducer} from "./todolists-reducer";
import thunkMiddleware from "redux-thunk";

const rootReducers = combineReducers({
    todolists: todolistsReducer,
    tasks: taskReducer
})

export type AppRootState = ReturnType<typeof rootReducers>

export const store = createStore(rootReducers, applyMiddleware(thunkMiddleware))



// @ts-ignore
window.store = store;