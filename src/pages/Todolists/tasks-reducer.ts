import {
    addTodolistAC,
    AddTodolistActionType, removeTodolistAC,
    RemoveTodolistActionType, setTodolistsAC,
    SetTodolistsActionType
} from "./todolists-reducer";
import {Dispatch} from "redux";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskType} from "../../api/todolists-api";
import {TaskStateType} from '../../app/App';
import {AppRootState, ThunkTypes} from "../../app/store";
import { setAppErrorAC, setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";





type TasksActionTypes = ReturnType<typeof removeTaskAC> |
    RemoveTodolistActionType |
    ReturnType<typeof addTaskAC>|
    ReturnType<typeof updateTaskAC> |
    AddTodolistActionType |
    SetTodolistsActionType |
    ReturnType<typeof setTasksAC>




const initialState: TaskStateType = {
}

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers:{
        removeTaskAC(state, action: PayloadAction<{taskId: string, todoListId: string}>){
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id !== action.payload.taskId)
            tasks.splice(index, 1)
        },
        addTaskAC(state, action: PayloadAction<{task: TaskType}>){
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        updateTaskAC(state, action: PayloadAction<{taskId: string, model: UpdateDomainTaskModelType, todoListId: string}>){
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id !== action.payload.taskId)
            tasks[index] = {...tasks[index], ...action.payload.model}
        },
        setTasksAC(state, action: PayloadAction<{tasks: Array<TaskType>, todolistId: string}>){
            state[action.payload.todolistId] = action.payload.tasks
        }
    },
    extraReducers: {
        [addTodolistAC.type]:(state, action: PayloadAction<{}>) =>{},
        [removeTodolistAC.type]:(state, action: PayloadAction<{}>) =>{},
        [setTodolistsAC.type]:(state, action: PayloadAction<{}>) =>{}
    }
})

export const taskReducer = slice.reducer

export const _taskReducer = (state: TaskStateType = initialState, action: any): TaskStateType => {
    switch (action.type) {

        case addTodolistAC.type:
            return {...state, [action.payload.todolist.id]: []}

        case removeTodolistAC.type: {
            const stateCopy = {...state}
            delete stateCopy[action.payload.todoListId]
            return stateCopy
        }
        case setTodolistsAC.type: {
            const stateCopy = {...state}
            action.payload.todolists.forEach((tl: any)=>{
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
export const {removeTaskAC, addTaskAC, updateTaskAC, setTasksAC} = slice.actions

//thunks
export const fetchTasksTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        todolistsAPI.getTasks(todolistId)
            .then((res) => {
                const tasks = res.data.items
                dispatch(setTasksAC(tasks,todolistId))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            })
    }
}


export const removeTaskTC = ( taskId: string, todolistId: string):ThunkTypes => {
    return (dispatch: Dispatch<TasksActionTypes>) => {
        todolistsAPI.deleteTask(todolistId, taskId)
            .then ( res => {
                const action = removeTaskAC(taskId, todolistId)
                dispatch(action)
            })
    }
}

export const addTaskTC = (title:string, todolistId: string):ThunkTypes => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        todolistsAPI.createTasks(todolistId, title)
            .then ( res => {
                if (res.data.resultCode === 0) {
                    const task = res.data.data.item
                    const action = addTaskAC(task)
                    dispatch(action)
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }

            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
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
                if (res.data.resultCode === 0){
                    const action = updateTaskAC(taskId, domainModel, todoListId)
                    dispatch(action)
                }
                else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }
}







