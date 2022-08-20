import {combineReducers, createStore} from "redux";
import {taskReducer} from "./tasks-reducer";
import {todolistsReducer} from "./todolists-reducer";

const rootReducers = combineReducers({
    todolists: todolistsReducer,
    tasks: taskReducer
})

// type AppRootState = {
//     todolists: Array<TodoListType>
//     tasks: TaskStateType
// }
export type AppRootState = ReturnType<typeof rootReducers>

export const store = createStore(rootReducers)



// @ts-ignore
window.store = store;