import React, {useCallback} from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "./state/store";


export type FilterValuesType = 'all' | 'completed' | 'active'
export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TaskStateType = {
    [key: string]: Array<TaskType>
}



function AppWithRedux() {
    console.log('App with redux')
    const dispatch = useDispatch()
    const todolists = useSelector<AppRootState, Array<TodoListType>>(state => state.todolists)
    const tasks = useSelector<AppRootState, TaskStateType>(state => state.tasks)


    const removeTask = useCallback ((id:string, todolistId: string) => {
        const action = removeTaskAC(id, todolistId)
        dispatch(action)

    }, [])

    const addTask = useCallback((title:string, todolistId: string) => {
        const action = addTaskAC(title, todolistId)
        dispatch(action)
    }, [])

    const changeStatus = useCallback((taskId: string, isDone: boolean, todolistId: string) => {
        const action = changeTaskStatusAC(taskId, isDone, todolistId)
        dispatch(action)
    },[])

    const changeTaskTitle = useCallback((taskId: string, newTitle: string, todolistId: string) => {
        const action = changeTaskTitleAC(taskId, newTitle, todolistId)
        dispatch(action)
    },[])

    const addToDoList = useCallback((title:string) => {
        const action = addTodolistAC(title)
        dispatch(action)
    }, [])


    const changeFilter = useCallback((value: FilterValuesType, todoListId: string) => {
        const action = changeTodolistFilterAC(value, todoListId)
        dispatch(action)
    }, [])

    const removeTodoList = useCallback ((todoListId: string) => {
        const action = removeTodolistAC(todoListId)
        dispatch(action)
    }, [])

    const changeTodoListTitle = useCallback ((id: string, newTitle: string) => {
        const action = changeTodolistTitleAC(id, newTitle)
        dispatch(action)
    }, [])



  return (
    <div className="App">
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
        </AppBar>
        <Container fixed>
            <Grid container style={{padding: '20px'}}>
                <AddItemForm addItem={addToDoList} />
            </Grid>
            <Grid container spacing={5}>{
                todolists.map((tl) => {
                    let allTodolistTasks = tasks[tl.id]
                    let tasksForTodolist = allTodolistTasks

                    return <Grid item key={tl.id}>
                        <Paper elevation={1} style={{padding: '10px'}}>
                        <TodoList
                        id={tl.id}
                        title={tl.title}
                        tasks={tasksForTodolist}
                        removeTask={removeTask}
                        changeFilter={changeFilter}
                        addTask={addTask}
                        changeStatus={changeStatus}
                        changeTaskTitle={changeTaskTitle}
                        filter={tl.filter}
                        removeTodoList={removeTodoList}
                        changeTodoListTitle={changeTodoListTitle}
                    />
                        </Paper>
                    </Grid>
                })
            }
            </Grid>
        </Container>
    </div>
  );
}

export default AppWithRedux;
