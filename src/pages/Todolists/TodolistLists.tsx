import React, {useCallback, useEffect } from 'react';
import {AppRootState, useAppDispatch, useAppSelector} from '../../app/store';
import {addTodolistTC, changeTodolistFilterAC,
    changeTodolistTitleTC, fetchTodolistsTC, FilterValuesType, removeTodolistTC } from './todolists-reducer';
import {useSelector} from "react-redux";
import { TaskStatuses } from '../../api/todolists-api';
import {addTaskTC, removeTaskTC, updateTaskTC } from './tasks-reducer';
import { Navigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Paper
} from "@material-ui/core";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {TodoList} from "./todolist/TodoList";



type TodolistListPropsType = {
    demo?: boolean
}
export const TodolistList: React.FC<TodolistListPropsType> = ({demo = false}) => {
    console.log('App with redux')
    const dispatch = useAppDispatch()
    const todolists = useAppSelector(state => state.todolists)
    const tasks = useAppSelector(state => state.tasks)
    const isLoggedIn = useSelector<AppRootState, boolean>(state => state.auth.isLoggedIn)

    useEffect(()=> {
        if (demo || !isLoggedIn){
            return
        }
        dispatch(fetchTodolistsTC())
    },[])

    const removeTask = useCallback ((id:string, todolistId: string) => {
        const thunk = removeTaskTC(id,todolistId)
        dispatch(thunk)
    }, [])

    const addTask = useCallback((title:string, todolistId: string) => {
        const thunk = addTaskTC(title, todolistId)
        dispatch(thunk)
    }, [])

    const changeStatus = useCallback((taskId: string, status: TaskStatuses, todoListId: string) => {
        const thunk = updateTaskTC(taskId, {status}, todoListId)
        dispatch(thunk)
    },[])

    const changeTaskTitle = useCallback((taskId: string, newTitle: string, todoListId: string) => {
        const thunk = updateTaskTC(taskId, {title: newTitle}, todoListId)
        dispatch(thunk)
    },[])

    const addToDoList = useCallback((title:string) => {
        const thunk = addTodolistTC(title)
        dispatch(thunk)
    }, [])


    const changeFilter = useCallback((value: FilterValuesType, todoListId: string) => {
        const action = changeTodolistFilterAC({id: todoListId, filter: value})
        dispatch(action)
    }, [])

    const removeTodoList = useCallback ((todolistId: string) => {
        const thunk = removeTodolistTC(todolistId)
        dispatch(thunk)
    }, [])

    const changeTodoListTitle = useCallback ((id: string, newTitle: string) => {
        const thunk = changeTodolistTitleTC(id, newTitle)
        dispatch(thunk)
    }, [])

    if(!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return (<Container fixed>
            <Grid container style={{padding: '20px'}}>
                <AddItemForm addItem={addToDoList} />
            </Grid>
            <Grid container spacing={5}>{
                todolists.map((tl) => {
                    let allTodolistTasks = tasks[tl.id]
                    let tasksForTodolist = allTodolistTasks
                    if (tl.filter === 'completed'){
                        tasksForTodolist = allTodolistTasks.filter(t => t.status)
                    }
                    if (tl.filter === 'active'){
                        tasksForTodolist = allTodolistTasks.filter(t => !t.status)
                    }
                    return <Grid item key={tl.id}>
                        <Paper elevation={1} style={{padding: '10px'}}>
                            <TodoList
                                todolist={tl}
                                tasks={tasksForTodolist}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeStatus={changeStatus}
                                changeTaskTitle={changeTaskTitle}
                                removeTodoList={removeTodoList}
                                changeTodoListTitle={changeTodoListTitle}
                            />
                        </Paper>
                    </Grid>
                })
            }
            </Grid>
        </Container>

    )
}