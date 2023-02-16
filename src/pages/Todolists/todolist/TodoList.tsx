import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton, Paper} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {Task} from "./Tasks/Task";
import {TaskStatuses, TaskType} from "../../../api/todolists-api";
import {FilterValuesType, TodolistDomainType} from "../todolists-reducer";
import {useAppDispatch} from "../../../app/store";
import {fetchTasksTC} from "../tasks-reducer";


type TodoListPropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    removeTask: (id: string, todolistId: string) => void
    changeStatus: (taskID: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (taskID: string, newTitle: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todoListID: string) => void
    addTask: (title: string, todolistId: string) => void
    removeTodoList: (todoListID: string) => void
    changeTodoListTitle: (id: string, newTitle: string) => void
    demo?: boolean

}
export const TodoList = React.memo(({demo = false, ...props}: TodoListPropsType) => {
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (demo) {
            return
        }
        const thunk = fetchTasksTC(props.todolist.id)
        dispatch(thunk)
    }, [])

    const addTask = useCallback ((title:string) => {
        props.addTask(title, props.todolist.id)
    }, [props.addTask,  props.todolist.id])

    const onAllClickHandler = useCallback(() => {props.changeFilter('all', props.todolist.id)},[props.changeFilter, props.todolist.id])
    const onActiveClickHandler = useCallback(() => {props.changeFilter('active', props.todolist.id)},[props.changeFilter, props.todolist.id])
    const onCompletedClickHandler = useCallback(() => {props.changeFilter('completed', props.todolist.id)},[props.changeFilter, props.todolist.id])

    const removeTodoList = () => {
        props.removeTodoList(props.todolist.id)

    }
    const changeToDoListTitle = useCallback((newTitle:string) => {
        props.changeTodoListTitle(props.todolist.id, newTitle)
    }, [props.changeTodoListTitle, props.todolist.id])

    return (
            <Paper style={{padding: '10px', position: 'relative'}}>
                <IconButton onClick={removeTodoList} disabled={props.todolist.entityStatus === 'loading'}
                            style={{position: 'absolute', right:'5px', top: '5px'}}>
                    <Delete />
                </IconButton>
                <h3><EditableSpan title={props.todolist.title} onChange={changeToDoListTitle} disabled={props.todolist.entityStatus === 'loading'}/>
                </h3>
                <AddItemForm addItem={addTask} disabled={props.todolist.entityStatus === 'loading'}/>
                <div>
                    {
                        props.tasks.map(t => <Task removeTask={props.removeTask} changeStatus={props.changeStatus} changeTaskTitle={props.changeTaskTitle} task={t} todolistId={props.todolist.id} key={t.id} />)
                    }
                    { !props.tasks.length && <div style={{padding: '10px', color: 'grey'}}>No tasks</div> }
                </div>
                <div>
                    <Button size={'small'} color={props.todolist.filter === 'all' ? 'primary' : 'default'} variant={props.todolist.filter === 'all' ? 'contained' : 'text'} disableElevation
                         onClick={onAllClickHandler}>All</Button>
                    <Button size={'small'} color={props.todolist.filter === 'active' ? 'primary' : 'default'} variant={props.todolist.filter === 'active' ? 'contained' : 'text'} disableElevation
                         onClick={onActiveClickHandler}>Active</Button>
                    <Button size={'small'} color={props.todolist.filter === 'completed' ? 'primary' : 'default'} variant={props.todolist.filter === 'completed' ? 'contained' : 'text'} disableElevation
                         onClick={onCompletedClickHandler}>Completed</Button>
                </div>
            </Paper>
    );
});


