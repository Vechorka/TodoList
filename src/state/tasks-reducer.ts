import {v1} from "uuid";
import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    SetTodolistsActionType
} from "./todolists-reducer";
import {Dispatch} from "redux";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskType} from "../api/todolists-api";
import {TaskStateType} from "../AppWithRedux";
import {number} from "prop-types";
import {AppRootState} from "./store";



export type RemoveTaskType = {
    type: 'REMOVE-TASK'
    todoListId: string
    taskId: string
}
export type AddTaskType = {
    type:'ADD-TASK'
    task: TaskType
}

export type UpdateTaskActionType = {
    type:'UPDATE-TASK'
    taskId: string
    model: UpdateDomainTaskModelType
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
    UpdateTaskActionType |
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
            const newTask = action.task
            const tasks = stateCopy[newTask.todoListId]
            const newTasks = [newTask, ...tasks]
            stateCopy[newTask.todoListId] = newTasks
            return stateCopy
        }
        case 'UPDATE-TASK': {
            let todolistTasks = state[action.todoListId]
            state[action.todoListId] = todolistTasks.map(t => t.id === action.taskId
                ? {...t, ...action.model}
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
            stateCopy[action.todolist.id] = []

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

export const addTaskAC = (task: TaskType): AddTaskType => {
    return { type :'ADD-TASK', task}
}

export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todoListId: string): UpdateTaskActionType => {
    return { type :'UPDATE-TASK', taskId,  model, todoListId}
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

export const removeTaskTC = ( taskId: string, todolistId: string):any => {
    return (dispatch: Dispatch) => {
        todolistsAPI.deleteTask(todolistId, taskId)
            .then ( res => {
                const action = removeTaskAC(taskId, todolistId)
                dispatch(action)
            })
    }
}

export const addTaskTC = (title:string, todolistId: string):any => {
    return (dispatch: Dispatch) => {
        todolistsAPI.createTasks(todolistId, title)
            .then ( res => {
                const task = res.data.data.item
                const action = addTaskAC(task)
                dispatch(action)
            })
    }
}

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string):any => {
    return (dispatch: Dispatch, geState:()=> AppRootState) => {
        const state = geState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task){
            throw new Error('task is not found in the state')
            return
        }
        const apiModel: UpdateTaskType = {
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            deadline: task.deadline,
            ...domainModel
        }
        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then ( res => {
                const action = updateTaskAC(taskId, domainModel, todolistId)
                dispatch(action)
            })
    }
}







