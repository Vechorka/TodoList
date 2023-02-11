import {
    addTodolistAC,
    removeTodolistAC,
    setTodolistsAC

} from "./todolists-reducer";
import {Dispatch} from "redux";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskType} from "../../api/todolists-api";
import {TaskStateType} from '../../app/App';
import {AppRootState, ThunkTypes} from "../../app/store";
import {setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


const initialState: TaskStateType = {
}

export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.getTasks(todolistId)
    const tasks = res.data.items
    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
    return ({tasks, todolistId})

})
export const removeTaskTC = createAsyncThunk('tasks/removeTask', (param:{taskId: string, todolistId: string}, thunkAPI)=>{
        return todolistsAPI.deleteTask(param.todolistId, param.taskId)
            .then ( res => ({taskId: param.taskId, todolistId: param.todolistId}))
})

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers:{
        addTaskAC(state, action: PayloadAction<{task: TaskType}>){
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        updateTaskAC(state, action: PayloadAction<{taskId: string, model: UpdateDomainTaskModelType, todoListId: string}>){
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks[index] = {...tasks[index], ...action.payload.model}
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(addTodolistAC, (state, action) =>{
            state[action.payload.todolist.id] = []
        })
        builder.addCase(removeTodolistAC, (state, action) =>{
            delete state[action.payload.todoListId]
        })
        builder.addCase(setTodolistsAC, (state, action) =>{
            action.payload.todolists.forEach((tl: any)=>{
                state[tl.id] = []
            })
        })
        builder.addCase(fetchTasksTC.fulfilled, (state, action) =>{
            state[action.payload.todolistId] = action.payload.tasks
        })
        builder.addCase(removeTaskTC.fulfilled, (state, action) =>{
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks.splice(index, 1)
        })

    }
})

export const taskReducer = slice.reducer

//actions
export const {addTaskAC, updateTaskAC} = slice.actions

//thunks

export const addTaskTC = (title:string, todolistId: string):ThunkTypes => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        todolistsAPI.createTasks(todolistId, title)
            .then ( res => {
                if (res.data.resultCode === 0) {
                    const task = res.data.data.item
                    const action = addTaskAC({task})
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

export const updateTaskTC = (taskId: string, model: UpdateDomainTaskModelType, todoListId: string):ThunkTypes => {
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
            ...model
        }
        todolistsAPI.updateTask(todoListId, taskId, apiModel)
            .then ( res => {
                if (res.data.resultCode === 0){
                    const action = updateTaskAC({taskId, model, todoListId})
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







