import React, {useState} from 'react';
import './App.css';
import {TaskType, TodoList} from "./TodoList";
import {v1} from "uuid";
import {ADDRCONFIG} from "dns";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";


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
        let tasks = tasksObj[todolistId]
        let filteredTasks = tasks.filter(t => t.id !== id)
        tasksObj[todolistId] = filteredTasks
        setTasks({...tasksObj})
    }

    const addTask = (title:string, todolistId: string) => {
        const task: TaskType = {
            id: v1(),
            title: title,
            isDone: false
        }
        let tasks = tasksObj[todolistId]
        let newTasks = [task, ...tasks]
        tasksObj[todolistId] = newTasks
        setTasks({...tasksObj})
    }

    function changeStatus(taskId: string, isDone: boolean, todolistId: string) {
        let tasks = tasksObj[todolistId]
        let task = tasks.find( t => t.id === taskId)
        if (task) {
            task.isDone = isDone
            setTasks({...tasksObj})
        }
    }

    function changeTaskTitle(taskId: string, newTitle: string, todolistId: string) {
        let tasks = tasksObj[todolistId]
        let task = tasks.find( t => t.id === taskId)
        if (task) {
            task.title = newTitle
            setTasks({...tasksObj})
        }
    }

    function addToDoList (title:string){
        let todolist: TodoListType = {
            id: v1(),
            filter: 'all',
            title: title
        }
        setTodolists([todolist, ...todolists])
        setTasks({...tasksObj,[todolist.id]: []})
    }





    function changeFilter(value: FilterValuesType, todoListId: string) {
        let todolist = todolists.find(tl => tl.id === todoListId)
        if (todolist) {
            todolist.filter = value;
            setTodolists([...todolists])
        }
    }

    let todolistId1 = v1()
    let todolistId2 = v1()

    let [todolists, setTodolists] = useState<Array<TodoListType>>([
        {id: todolistId1, title: 'What to learn', filter: 'active'},
        {id: todolistId2, title: 'What to buy', filter: 'completed'}
    ]);

    let removeTodoList = (todoListId: string) => {
        let filteredTodoList = todolists.filter(tl => tl.id !== todoListId)
        setTodolists(filteredTodoList)

        delete tasksObj[todoListId]
        setTasks({...tasksObj})
    }

    function changeTodoListTitle (id: string, newTitle: string) {
        const todolist = todolists.find(tl => tl.id === id)
        if (todolist){
            todolist.title = newTitle
            setTodolists([...todolists])
        }

    }

    let [tasksObj , setTasks] = useState<TaskStateType>({
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