import {v1} from "uuid";

import {FilterValuesType, TodoListType} from "../AppWithRedux";
import {Dispatch} from "redux";
import {todolistsAPI} from "../api/todolists-api";




export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST'
    todoListId: string
}
export type AddTodolistActionType = {
type:'ADD-TODOLIST'
    title:string
    todoListId:string
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
    todolists: Array<TodoListType>
}

type ActionTypes = RemoveTodolistActionType |
    AddTodolistActionType |
    ChangeTodolistTitleActionType |
    ChangeTodolistFilterActionType |
    SetTodolistsActionType

const initialState: Array<TodoListType> = []


export const todolistsReducer = (state: Array<TodoListType> = initialState, action: ActionTypes): Array<TodoListType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':{
            return state.filter(tl => tl.id !== action.todoListId)
        }

        case 'ADD-TODOLIST': {
            return [...state, {
                id: action.todoListId,
                filter: 'all',
                title: action.title
            }]
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
export const addTodolistAC = (title: string):AddTodolistActionType  => {
    return { type: 'ADD-TODOLIST', title: title, todoListId: v1()}
}

export const changeTodolistTitleAC = (id: string, title: string):ChangeTodolistTitleActionType  => {
    return { type: 'CHANGE-TODOLIST-TITLE',  id: id, title: title}
}

export const changeTodolistFilterAC = (filter: FilterValuesType, id: string):ChangeTodolistFilterActionType  => {
    return { type: 'CHANGE-TODOLIST-FILTER',filter: filter,  id: id}
}

export const setTodolistsAC = (todolists: Array<TodoListType>):SetTodolistsActionType  => {
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


