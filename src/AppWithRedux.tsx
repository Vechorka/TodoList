import React, {useReducer, useState} from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, taskReducer} from "./state/tasks-reducer";
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

    const dispatch = useDispatch()
    const todolists = useSelector<AppRootState, Array<TodoListType>>(state => state.todolists)
    const tasks = useSelector<AppRootState, TaskStateType>(state => state.tasks)


    const removeTask = (id:string, todolistId: string) => {
        const action = removeTaskAC(id, todolistId)
        dispatch(action)

    }

    const addTask = (title:string, todolistId: string) => {
        const action = addTaskAC(title, todolistId)
        dispatch(action)
    }

    function changeStatus(taskId: string, isDone: boolean, todolistId: string) {
        const action = changeTaskStatusAC(taskId, isDone, todolistId)
        dispatch(action)
    }

    function changeTaskTitle(taskId: string, newTitle: string, todolistId: string) {
        const action = changeTaskTitleAC(taskId, newTitle, todolistId)
        dispatch(action)
    }

    function addToDoList (title:string){
        const action = addTodolistAC(title)
        dispatch(action)
    }


    function changeFilter(value: FilterValuesType, todoListId: string) {
        const action = changeTodolistFilterAC(value, todoListId)
        dispatch(action)
    }

    let removeTodoList = (todoListId: string) => {
        const action = removeTodolistAC(todoListId)
        dispatch(action)
    }

    function changeTodoListTitle (id: string, newTitle: string) {
        const action = changeTodolistTitleAC(id, newTitle)
        dispatch(action)
    }



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
                    let tasksForTodolist = tasks[tl.id]
                    if (tl.filter === 'completed'){
                        tasksForTodolist = tasksForTodolist.filter(t => t.isDone === true)
                    }
                    if (tl.filter === 'active'){
                        tasksForTodolist = tasksForTodolist.filter(t => t.isDone === false)
                    }
                    return <Grid item>
                        <Paper elevation={1} style={{padding: '10px'}}>
                        <TodoList
                        key={tl.id}
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
