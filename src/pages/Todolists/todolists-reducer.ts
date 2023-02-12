import {Dispatch} from "redux";
import {todolistsAPI, TodolistType} from "../../api/todolists-api";
import {ThunkTypes} from "../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>


export type FilterValuesType = 'all' | 'completed' | 'active'
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}


const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: 'todolists',
    initialState: initialState,
    reducers: {
        removeTodolistAC(state, action: PayloadAction<{todoListId: string}>){
        const index = state.findIndex(tl => tl.id === action.payload.todoListId)
            if (index > -1){
                state.splice(index, 1)
            }
        },
        addTodolistAC(state, action: PayloadAction<{todolist: TodolistType}>){
            state.push({...action.payload.todolist, filter: 'all', entityStatus: "idle"})
        },
        changeTodolistTitleAC(state, action: PayloadAction<{id: string, title: string}>){
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        },
        changeTodolistFilterAC(state, action: PayloadAction<{filter: FilterValuesType, id: string}>){
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        setTodolistsAC(state, action: PayloadAction<{todolists: Array<TodolistType>}>){
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: "idle"}))
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{id: string, status: RequestStatusType}>){
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        }
    }
})

export const {removeTodolistAC, addTodolistAC, changeTodolistTitleAC,
    changeTodolistFilterAC, setTodolistsAC, changeTodolistEntityStatusAC} = slice.actions



export const todolistsReducer = slice.reducer

//thunks
export const fetchTodolistsTC = () => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC({todolists: res.data}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch)
            })
    }
}

export const removeTodolistTC = (todolistId: string):ThunkTypes => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
        todolistsAPI.deleteTodolists(todolistId)
            .then ( res => {
                const action = removeTodolistAC({todoListId: todolistId})
                dispatch(action)
                dispatch(setAppStatusAC({status: 'succeeded'}))
            })
    }
}

export const addTodolistTC = (title:string):ThunkTypes => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        todolistsAPI.createTodolists(title)
            .then ( res => {
                const todolist = res.data.data.item
                const action = addTodolistAC({todolist})
                dispatch(action)
                dispatch(setAppStatusAC({status: 'succeeded'}))
            })
    }
}

export const changeTodolistTitleTC = (id:string, title:string):ThunkTypes => {
    return (dispatch: Dispatch) => {
        todolistsAPI.updateTodolists(id, title)
            .then ( res => {
                dispatch(changeTodolistTitleAC({id, title}))
            })
    }
}


