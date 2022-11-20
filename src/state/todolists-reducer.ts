import {v1} from "uuid";
import {Dispatch} from "redux";
import {todolistsAPI, TodolistType} from "../api/todolists-api";
import {addTaskAC, removeTaskAC} from "./tasks-reducer";




export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST'
    todoListId: string
}
export type AddTodolistActionType = {
type:'ADD-TODOLIST'
    todolist: TodolistType
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE'
    id: string
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER'
    id: string
    filter: FilterValuesType
}
export type SetTodolistsActionType = {
    type: 'SET-TODOLISTS'
    todolists: Array<TodolistType>
}

type ActionTypes = RemoveTodolistActionType |
    AddTodolistActionType |
    ChangeTodolistTitleActionType |
    ChangeTodolistFilterActionType |
    SetTodolistsActionType

const initialState: Array<TodolistDomainType> = []

export type FilterValuesType = 'all' | 'completed' | 'active'
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}


export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionTypes): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':{
            return state.filter(tl => tl.id !== action.todoListId)
        }

        case 'ADD-TODOLIST': {
            const newTodolist: TodolistDomainType = {...action.todolist, filter: 'all'}
            return [...state, newTodolist]
        }

        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id)
            if (todolist){
                todolist.title = action.title

            }
            return [...state]
        }

        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id)
            if (todolist){
                todolist.filter = action.filter

            }
            return [...state]
        }
        case "SET-TODOLISTS": {
            return action.todolists.map(tl => {
                return {
                    ...tl,
                    filter: 'all'
                }
            })
        }

        default:
            return state
    }
}

export const removeTodolistAC = (todoListId: string): RemoveTodolistActionType => {
    return { type :'REMOVE-TODOLIST', todoListId: todoListId}
}
export const addTodolistAC = (todolist: TodolistType):AddTodolistActionType  => {
    return { type: 'ADD-TODOLIST', todolist}
}

export const changeTodolistTitleAC = (id: string, title: string):ChangeTodolistTitleActionType  => {
    return { type: 'CHANGE-TODOLIST-TITLE',  id: id, title: title}
}

export const changeTodolistFilterAC = (filter: FilterValuesType, id: string):ChangeTodolistFilterActionType  => {
    return { type: 'CHANGE-TODOLIST-FILTER',filter: filter,  id: id}
}

export const setTodolistsAC = (todolists: Array<TodolistType>):SetTodolistsActionType  => {
    return { type: 'SET-TODOLISTS', todolists: todolists}
}

export const fetchTodolistsTC:any = () => {
    return (dispatch: Dispatch) => {
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC(res.data))
            })
    }
}

export const removeTodolistTC = (todolistId: string):any => {
    return (dispatch: Dispatch) => {
        todolistsAPI.deleteTodolists(todolistId)
            .then ( res => {
                const action = removeTodolistAC(todolistId)
                dispatch(action)
            })
    }
}

export const addTodolistTC = (title:string):any => {
    return (dispatch: Dispatch) => {
        todolistsAPI.createTodolists(title)
            .then ( res => {
                const todolist = res.data.data.item
                const action = addTodolistAC(todolist)
                dispatch(action)
            })
    }
}

export const changeTodolistTitleTC = (id:string, title:string):any => {
    return (dispatch: Dispatch) => {
        todolistsAPI.updateTodolists(id, title)
            .then ( res => {
                dispatch(changeTodolistTitleAC(id, title))
            })
    }
}


