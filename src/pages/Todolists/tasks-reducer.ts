import {
    addTodolistAC,
    removeTodolistAC,
    setTodolistsAC

} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, todolistsAPI, UpdateTaskType} from "../../api/todolists-api";
import {TaskStateType} from '../../app/App';
import {AppRootState} from "../../app/store";
import {setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";


const initialState: TaskStateType = {
}

export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.getTasks(todolistId)
    const tasks = res.data.items
    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
    return ({tasks, todolistId})

})
export const removeTaskTC = createAsyncThunk('tasks/removeTask', async(param:{taskId: string, todolistId: string}, thunkAPI)=>{
        const res = await todolistsAPI.deleteTask(param.todolistId, param.taskId)
            return {taskId: param.taskId, todolistId: param.todolistId}
})

export const addTaskTC = createAsyncThunk('tasks/addTask', async(param:{title:string, todolistId: string}, {dispatch, rejectWithValue})=>{
    const res = await todolistsAPI.createTasks(param.todolistId, param.title)
        try{
            if (res.data.resultCode === 0) {
                const task = res.data.data.item
                dispatch(setAppStatusAC({status: 'succeeded'}))
                return task
            }
            else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
                }
             }
        catch(error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
        }
})

export const updateTaskTC = createAsyncThunk('tasks/updateTask', async(param:{taskId: string, model: UpdateDomainTaskModelType, todoListId: string},
                                                                       {dispatch, rejectWithValue, getState})=>{
    const state = getState() as AppRootState
    const task = state.tasks[param.todoListId]?.find(t => t.id === param.taskId)
    if (!task){
        return rejectWithValue('task is not found in the state')
    }
    const apiModel: UpdateTaskType = {
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        deadline: task.deadline,
        ...param.model
    }
    const res = await todolistsAPI.updateTask(param.todoListId, param.taskId, apiModel)
        try{
            if (res.data.resultCode === 0){
            return param
            }
            else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        }
        catch(error)  {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
        }
})


const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers:{},
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
        builder.addCase(addTaskTC.fulfilled, (state, action) =>{
            state[action.payload.todoListId].unshift(action.payload)
        })
        builder.addCase(updateTaskTC.fulfilled, (state, action) =>{
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        })

    }
})

export const taskReducer = slice.reducer

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}









