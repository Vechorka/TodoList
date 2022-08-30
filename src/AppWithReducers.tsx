import React, {useReducer, useState} from 'react';
import './App.css';
import {TaskType, TodoList} from "./TodoList";
import {v1} from "uuid";
import {ADDRCONFIG} from "dns";
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
import {deepStrictEqual} from "assert";


export type FilterValuesType = 'all' | 'completed' | 'active'
export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TaskStateType = {
    [key: string]: Array<TaskType>
}


function App() {

    const removeTask = (id:string, todolistId: string) => {
        const action = removeTaskAC(id, todolistId)
        dispatchToTasksReducer(action)

    }

    const addTask = (title:string, todolistId: string) => {
        const action = addTaskAC(title, todolistId)
        dispatchToTasksReducer(action)
    }

    function changeStatus(taskId: string, isDone: boolean, todolistId: string) {
        const action = changeTaskStatusAC(taskId, isDone, todolistId)
        dispatchToTasksReducer(action)
    }

    function changeTaskTitle(taskId: string, newTitle: string, todolistId: string) {
        const action = changeTaskTitleAC(taskId, newTitle, todolistId)
        dispatchToTasksReducer(action)
    }

    function addToDoList (title:string){
        const action = addTodolistAC(title)
        dispatchToTasksReducer(action)
        dispatchTodolistsReducer(action)
    }


    function changeFilter(value: FilterValuesType, todoListId: string) {
        const action = changeTodolistFilterAC(value, todoListId)
        dispatchTodolistsReducer(action)
    }

    let todolistId1 = v1()
    let todolistId2 = v1()

    let [todolists, dispatchTodolistsReducer] = useReducer(todolistsReducer, [
        {id: todolistId1, title: 'What to learn', filter: 'active'},
        {id: todolistId2, title: 'What to buy', filter: 'completed'}
    ]);

    let removeTodoList = (todoListId: string) => {
        const action = removeTodolistAC(todoListId)
        dispatchToTasksReducer(action)
        dispatchTodolistsReducer(action)
    }

    function changeTodoListTitle (id: string, newTitle: string) {
        const action = changeTodolistTitleAC(id, newTitle)
        dispatchTodolistsReducer(action)
    }

    let [tasksObj , dispatchToTasksReducer] = useReducer(taskReducer,{
    [todolistId1]: [
        {id: v1(), title: 'HTML', isDone: true },
        {id: v1(), title: 'CSS', isDone: true },
        {id: v1(), title: 'JS/TS', isDone: false },
        {id: v1(), title: 'Redux', isDone: false }],
    [todolistId2]: [
        {id: v1(), title: 'Book', isDone: false },
        {id: v1(), title: 'Milk', isDone: true },
        ]

    })

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
                    let tasksForTodolist = tasksObj[tl.id]
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

export default App;

export class TasksStateType {
}