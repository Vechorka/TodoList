import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    SetTodolistsActionType
} from "./todolists-reducer";
import {Dispatch} from "redux";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskType} from "../../api/todolists-api";
import {TaskStateType} from '../../app/App';
import {AppRootState, ThunkTypes} from "../../app/store";
import {setErrorAC, setStatusAC} from "../../app/app-reducer";





type ActionTypes = ReturnType<typeof removeTaskAC> |
    RemoveTodolistActionType |
    ReturnType<typeof addTaskAC>|
    ReturnType<typeof updateTaskAC> |
    AddTodolistActionType |
    SetTodolistsActionType |
    ReturnType<typeof setTasksAC>


const initialState: TaskStateType = {
}

export const taskReducer = (state: TaskStateType = initialState, action: ActionTypes): TaskStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].filter(t => t.id !== action.taskId)
            }

        case 'ADD-TASK':
            return {
                ...state,
                [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
            }

        case 'UPDATE-TASK':
            return { ...state, [action.todoListId]: state[action.todoListId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)}

        case "ADD-TODOLIST":
            return {...state, [action.todolist.id]: []}

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
        case "SET-TASKS":
            return{...state , [action.todolistId]: action.tasks}

        default:
            return state
    }
}

//actions
export const removeTaskAC = (taskId: string, todoListId: string) =>
    ({ type :'REMOVE-TASK',taskId, todoListId}) as const
export const addTaskAC = (task: TaskType) =>
    ({type :'ADD-TASK', task}) as const
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todoListId: string) =>
    ({type :'UPDATE-TASK', model, todoListId, taskId}) as const
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
    ({type: 'SET-TASKS', tasks, todolistId}) as const

//thunks
export const fetchTasksTC:any = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setStatusAC('loading'))
        todolistsAPI.getTasks(todolistId)
            .then((res) => {
                const tasks = res.data.items
                dispatch(setTasksAC(tasks,todolistId))
                dispatch(setStatusAC('succeeded'))
            })
    }
}

export const removeTaskTC = ( taskId: string, todolistId: string):ThunkTypes => {
    return (dispatch: Dispatch) => {
        todolistsAPI.deleteTask(todolistId, taskId)
            .then ( res => {
                const action = removeTaskAC(taskId, todolistId)
                dispatch(action)
            })
    }
}

export const addTaskTC = (title:string, todolistId: string):ThunkTypes => {
    return (dispatch: Dispatch) => {
        dispatch(setStatusAC('loading'))
        todolistsAPI.createTasks(todolistId, title)
            .then ( res => {
                if (res.data.resultCode === 0) {
                    const task = res.data.data.item
                    const action = addTaskAC(task)
                    dispatch(action)
                    dispatch(setStatusAC('succeeded'))
                } else {
                    if (res.data.messages.length) {
                        dispatch(setErrorAC(res.data.messages[0]))
                    } else {
                        dispatch(setErrorAC('Some error occurred'))
                    }
                    dispatch(setStatusAC('failed'))
                }

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

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todoListId: string):ThunkTypes => {
    return (dispatch: Dispatch, geState:()=> AppRootState) => {
        const state = geState()
        const task = state.tasks[todoListId]?.find(t => t.id === taskId)
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
        todolistsAPI.updateTask(todoListId, taskId, apiModel)
            .then ( res => {
                const action = updateTaskAC(taskId, domainModel, todoListId)
                dispatch(action)
            })
    }
}







