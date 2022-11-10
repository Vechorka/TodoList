import  {TaskStateType} from "../App";
import {v1} from "uuid";
import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    SetTodolistsActionType
} from "./todolists-reducer";
import {TaskType} from "../TodoList";
import {Dispatch} from "redux";
import {todolistsAPI} from "../api/todolists-api";



export type RemoveTaskType = {
    type: 'REMOVE-TASK'
    todoListId: string
    taskId: string
}
export type AddTaskType = {
type:'ADD-TASK'
    title:string
    todoListId: string
}

export type ChangeTaskType = {
    type:'CHANGE-TASK-STATUS'
    taskId: string
    isDone: boolean
    todoListId: string
}

export type ChangeTaskTitleType = {
    type:'CHANGE-TASK-TITLE'
    taskId: string
    title: string
    todoListId: string
}

export type SetTaskActionType = {
    type: 'SET-TASKS'
    tasks: Array<TaskType>
    todolistId: string
}



type ActionTypes = RemoveTaskType |
    RemoveTodolistActionType |
    AddTaskType |
    ChangeTaskType |
    ChangeTaskTitleType |
    AddTodolistActionType |
    SetTodolistsActionType |
    SetTaskActionType


const initialState: TaskStateType = {
}

export const taskReducer = (state: TaskStateType = initialState, action: ActionTypes): TaskStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = state[action.todoListId]
            const filteredTasks = tasks.filter(t => t.id !== action.taskId)
            stateCopy[action.todoListId] = filteredTasks
            return stateCopy
        }
        case 'ADD-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todoListId]
            const newTask = {
                id: v1(),
                title: action.title,
                isDone: false
            }
            const newTasks = [newTask, ...tasks]
            stateCopy[action.todoListId] = newTasks
            return stateCopy
        }
        case 'CHANGE-TASK-STATUS': {
            let todolistTasks = state[action.todoListId]
            state[action.todoListId] = todolistTasks.map(t => t.id === action.taskId
                ? {...t, isDone: action.isDone}
                : t)
            return ({...state})
        }

        case "CHANGE-TASK-TITLE":{
            let todolistTasks = state[action.todoListId]
            state[action.todoListId] = todolistTasks
                .map(t => t.id === action.taskId
                ? {...t, title: action.title}
                : t)
            return ({...state})
        }
        case "ADD-TODOLIST":{
            const stateCopy = {...state}
            stateCopy[action.todoListId] = []

            return stateCopy
        }
        case 'REMOVE-TODOLIST': {
            const stateCopy = {...state}
            delete stateCopy[action.todoListId]

            return stateCopy
        }
        case "SET-TODOLISTS": {
            const stateCopy = {...state}
            action.todolists.forEach(tl=>{
                stateCopy[tl.id] = []
            })

            return stateCopy
        }
        case "SET-TASKS":{
            const stateCopy = {...state}
            stateCopy[action.todolistId] = action.tasks

            return stateCopy
        }


        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todoListId: string): RemoveTaskType => {
    return { type :'REMOVE-TASK',taskId, todoListId}
}

export const addTaskAC = (title: string, todoListId: string): AddTaskType => {
    return { type :'ADD-TASK', title: title, todoListId}
}

export const changeTaskStatusAC = (taskId: string, isDone: boolean, todoListId: string): ChangeTaskType => {
    return { type :'CHANGE-TASK-STATUS', taskId,  isDone, todoListId}
}

export const changeTaskTitleAC = (taskId: string, title: string, todoListId: string): ChangeTaskTitleType => {
    return { type :'CHANGE-TASK-TITLE', taskId,  title, todoListId}
}

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string):SetTaskActionType => {
    return {type: 'SET-TASKS', tasks, todolistId}
}

export const fetchTasksTC:any = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.getTasks(todolistId)
            .then((res) => {
                const tasks = res.data.items
                const action = setTasksAC(tasks,todolistId)
                dispatch(action)
            })
    }
}






