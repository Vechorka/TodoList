import {FilterValuesType, TaskStateType, TodoListType} from "../App";
import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType, todolistId1, todolistId2} from "./todolists-reducer";



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



type ActionTypes = RemoveTaskType | RemoveTodolistActionType | AddTaskType | ChangeTaskType | ChangeTaskTitleType | AddTodolistActionType


const initialState: TaskStateType = {
    [todolistId1]: [
        {id: v1(), title: 'HTML', isDone: true},
        {id: v1(), title: 'CSS', isDone: true},
        {id: v1(), title: 'JS/TS', isDone: false},
        {id: v1(), title: 'Redux', isDone: false}],
    [todolistId2]: [
        {id: v1(), title: 'Book', isDone: false},
        {id: v1(), title: 'Milk', isDone: true},
    ]
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
            const stateCopy = {...state}
            let tasks = stateCopy[action.todoListId]
            let task = tasks.find( t => t.id === action.taskId)
            if (task) {
                task.isDone = action.isDone
            }
            return stateCopy
        }

        case "CHANGE-TASK-TITLE":{
            const stateCopy = {...state}
            let tasks = stateCopy[action.todoListId]
            let task = tasks.find( t => t.id === action.taskId)
            if (task) {
                task.title = action.title
        }
            return stateCopy
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





