import React, {useCallback, useEffect} from 'react';
import {FilterValuesType} from "./App";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {Task} from "./Task";
import {useDispatch} from "react-redux";
import {fetchTasksTC} from "./state/tasks-reducer";


type TodoListPropsType = {
    id:string
    title: string
    tasks: Array<TaskType>
    removeTask: (id: string, todolistId: string) => void
    changeStatus: (taskID: string, isDone: boolean, todolistId: string) => void
    changeTaskTitle: (taskID: string, newTitle: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todoListID: string) => void
    addTask: (title: string, todolistId: string) => void
    filter: FilterValuesType
    removeTodoList: (todoListID: string) => void
    changeTodoListTitle: (id: string, newTitle: string) => void
}

export type TaskType = {
    id: string
    title: string
    isDone: boolean

}

export const TodoList = React.memo((props: TodoListPropsType) => {
    console.log('todolist')

    const dispatch = useDispatch()

    useEffect(()=> {
        dispatch(fetchTasksTC(props.id))
    },[])

    const addTask = useCallback ((title:string) => {
        props.addTask(title, props.id)
    }, [props.addTask,  props.id])

    const onAllClickHandler = useCallback(() => {props.changeFilter('all', props.id)},[props.changeFilter, props.id])
    const onActiveClickHandler = useCallback(() => {props.changeFilter('active', props.id)},[props.changeFilter, props.id])
    const onCompletedClickHandler = useCallback(() => {props.changeFilter('completed', props.id)},[props.changeFilter, props.id])

    const removeTodoList = () => {
        props.removeTodoList(props.id)

    }
    const changeToDoListTitle = useCallback((newTitle:string) => {
        props.changeTodoListTitle(props.id, newTitle)
    }, [props.changeTodoListTitle, props.id])

    return (
            <div>
                <h3><EditableSpan title={props.title} onChange={changeToDoListTitle}/>
                    <IconButton onClick={removeTodoList}>
                        <Delete />
                    </IconButton>
                </h3>
                <AddItemForm addItem={addTask} />
                <div>
                    {
                        props.tasks.map(t => <Task removeTask={props.removeTask} changeStatus={props.changeStatus} changeTaskTitle={props.changeTaskTitle} task={t} todolistId={props.id} key={t.id} />)
                    }
                </div>
                <div>
                    <Button size={'small'} color={props.filter === 'all' ? 'primary' : 'default'} variant={props.filter === 'all' ? 'contained' : 'text'} disableElevation
                         onClick={onAllClickHandler}>All</Button>
                    <Button size={'small'} color={props.filter === 'active' ? 'primary' : 'default'} variant={props.filter === 'active' ? 'contained' : 'text'} disableElevation
                         onClick={onActiveClickHandler}>Active</Button>
                    <Button size={'small'} color={props.filter === 'completed' ? 'primary' : 'default'} variant={props.filter === 'completed' ? 'contained' : 'text'} disableElevation
                         onClick={onCompletedClickHandler}>Completed</Button>
                </div>
            </div>
    );
});


