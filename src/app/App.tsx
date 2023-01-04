import React, {useCallback, useEffect} from 'react';
import './App.css';
import {TodoList} from "../pages/Todolists/todolist/TodoList";
import {AddItemForm} from "../components/AddItemForm/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography, LinearProgress} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    addTodolistTC,
    changeTodolistFilterAC,
    changeTodolistTitleTC, fetchTodolistsTC, FilterValuesType,
    removeTodolistTC,
} from "../pages/Todolists/todolists-reducer";
import {
    addTaskTC,
    removeTaskTC,
    updateTaskTC
} from "../pages/Todolists/tasks-reducer";

import {AppRootState, useAppDispatch, useAppSelector} from "./store";
import {TaskStatuses, TaskType} from "../api/todolists-api";
import {CustomizedSnackbars} from "../components/SnackBar/SnackBar";
import {useSelector} from "react-redux";
import {RequestStatusType} from "./app-reducer";

export type TaskStateType = {
    [key: string]: Array<TaskType>
}

type PropsType = {
    demo?: boolean
}

function App({demo = false}: PropsType) {
    const status = useSelector<AppRootState, RequestStatusType>(state=> state.app.status)

    return (
        <div className="App">
            <CustomizedSnackbars/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start"  color="inherit" aria-label="menu">
                        <Menu />
                    </IconButton>
                    <Typography variant="h6" >
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
                {status === 'loading' && <LinearProgress />}
            </AppBar>
            <TodolistList demo={demo}/>
        </div>
    );
}
type TodolistListPropsType = {
    demo?: boolean
}
export const TodolistList: React.FC<TodolistListPropsType> = ({demo = false}) => {
    console.log('App with redux')
    const dispatch = useAppDispatch()
    const todolists = useAppSelector(state => state.todolists)
    const tasks = useAppSelector(state => state.tasks)

    useEffect(()=> {
        if (demo){
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
        const action = changeTodolistFilterAC(value, todoListId)
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
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
            </Grid>
        </Container>

    )
}

export default App