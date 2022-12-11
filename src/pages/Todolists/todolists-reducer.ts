import {Dispatch} from "redux";
import {todolistsAPI, TodolistType} from "../../api/todolists-api";
import {ThunkTypes} from "../../app/store";
import {setStatusAC} from "../../app/app-reducer";

export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>

type ActionTypes =
    RemoveTodolistActionType |
    AddTodolistActionType |
    ReturnType<typeof changeTodolistTitleAC> |
    ReturnType<typeof changeTodolistFilterAC> |
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

        case 'ADD-TODOLIST':
            return [...state, {...action.todolist, filter: 'all'}]

        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)

        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)

        case "SET-TODOLISTS":
            return action.todolists.map(tl => ({...tl, filter: 'all'}))

        default:
            return state
    }
}

//actions
export const removeTodolistAC = (todoListId: string) => ({ type :'REMOVE-TODOLIST', todoListId}) as const
export const addTodolistAC = (todolist: TodolistType)  => ({ type: 'ADD-TODOLIST', todolist}) as const
export const changeTodolistTitleAC = (id: string, title: string)  => ({ type: 'CHANGE-TODOLIST-TITLE',  id, title}) as const
export const changeTodolistFilterAC = (filter: FilterValuesType, id: string)  => ({ type: 'CHANGE-TODOLIST-FILTER', filter,  id}) as const
export const setTodolistsAC = (todolists: Array<TodolistType>)  => ({ type: 'SET-TODOLISTS', todolists: todolists}) as const

//thunks
export const fetchTodolistsTC:any = () => {
    return (dispatch: Dispatch) => {
        dispatch(setStatusAC('loading'))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC(res.data))
                dispatch(setStatusAC('succeeded'))
            })
    }
}

export const removeTodolistTC = (todolistId: string):ThunkTypes => {
    return (dispatch: Dispatch) => {
        todolistsAPI.deleteTodolists(todolistId)
            .then ( res => {
                const action = removeTodolistAC(todolistId)
                dispatch(action)
            })
    }
}

export const addTodolistTC = (title:string):ThunkTypes => {
    return (dispatch: Dispatch) => {
        dispatch(setStatusAC('loading'))
        todolistsAPI.createTodolists(title)
            .then ( res => {
                const todolist = res.data.data.item
                const action = addTodolistAC(todolist)
                dispatch(action)
                dispatch(setStatusAC('succeeded'))
            })
    }
}

export const changeTodolistTitleTC = (id:string, title:string):ThunkTypes => {
    return (dispatch: Dispatch) => {
        todolistsAPI.updateTodolists(id, title)
            .then ( res => {
                dispatch(changeTodolistTitleAC(id, title))
            })
    }
}


