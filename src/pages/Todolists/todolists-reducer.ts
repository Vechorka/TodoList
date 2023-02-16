import {todolistsAPI, TodolistType} from "../../api/todolists-api";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export type FilterValuesType = 'all' | 'completed' | 'active'
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}


const initialState: Array<TodolistDomainType> = []

export const fetchTodolistsTC = createAsyncThunk('todolist/fetchTodolist', async(param, {dispatch, rejectWithValue})=>{
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.getTodolists()
        try{
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todolists: res.data}
        }
        catch(error){
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
        }
})

export const removeTodolistTC = createAsyncThunk('todolist/removeTodolist', async(todolistId: string, {dispatch})=>{
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
    const res = await todolistsAPI.deleteTodolists(todolistId)
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todoListId: todolistId}
})

export const addTodolistTC = createAsyncThunk('todolist/addTodolist', async(title:string, {dispatch, rejectWithValue})=>{
    dispatch(setAppStatusAC({status: 'loading'}))

    try{
        const res = await todolistsAPI.createTodolists(title)
        if(res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todolist: res.data.data.item}
        }
        else{
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    }
    catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})

export const changeTodolistTitleTC = createAsyncThunk('todolist/changeTodolistTitle', async(param:{id:string, title:string}, {dispatch})=>{
   await todolistsAPI.updateTodolists(param.id, param.title)
            return {id: param.id, title: param.title}
})



const slice = createSlice({
    name: 'todolists',
    initialState: initialState,
    reducers: {
        changeTodolistFilterAC(state, action: PayloadAction<{filter: FilterValuesType, id: string}>){
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{id: string, status: RequestStatusType}>){
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        }
    },
    extraReducers:builder => {
        builder.addCase(fetchTodolistsTC.fulfilled, ((state, action)=>{
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: "idle"}))
        }))
        builder.addCase(removeTodolistTC.fulfilled, ((state, action)=>{
            const index = state.findIndex(tl => tl.id === action.payload.todoListId)
            if (index > -1){
                state.splice(index, 1)
            }
        }))
        builder.addCase(addTodolistTC.fulfilled, ((state, action)=>{
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: "idle"})
        }))
        builder.addCase(changeTodolistTitleTC.fulfilled, ((state, action)=>{
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        }))
    }
})

export const {changeTodolistFilterAC, changeTodolistEntityStatusAC} = slice.actions



export const todolistsReducer = slice.reducer



