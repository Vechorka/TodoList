import React, {ChangeEvent} from 'react';
import {FilterValuesType} from "./App";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";


type TodoListPropsType = {
    id:string
    title: string
    tasks: Array<TaskType>
    removeTask: (id: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todoListID: string) => void
    addTask: (title: string, todolistId: string) => void
    changeStatus: (taskID: string, isDone: boolean, todolistId: string) => void
    changeTaskTitle: (taskID: string, newTitle: string, todolistId: string) => void
    filter: FilterValuesType
    removeTodoList: (todoListID: string) => void
    changeTodoListTitle: (id: string, newTitle: string) => void
}

export type TaskType = {
    id: string
    title: string
    isDone: boolean

}

export const TodoList = (props: TodoListPropsType) => {

    const addTask = (title:string) => {
        props.addTask(title, props.id)
    }

    const onAllClickHandler = () => {props.changeFilter('all', props.id)}
    const onActiveClickHandler = () => {props.changeFilter('active', props.id)}
    const onCompletedClickHandler = () => {props.changeFilter('completed', props.id)}
    const removeTodoList = () => {
        props.removeTodoList(props.id)

    }
    const changeToDoListTitle = (newTitle:string) => {
        props.changeTodoListTitle(props.id, newTitle)

    }

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
                        props.tasks.map(t => {
                            const onRemoveHandler = () => {props.removeTask(t.id, props.id)}
                            const onChangeStatusHandler = (e:ChangeEvent<HTMLInputElement>) => {
                                props.changeStatus(t.id, e.currentTarget.checked, props.id)
                            }
                            const onChangeTitleHandler = (newValue:string) => {
                                props.changeTaskTitle(t.id, newValue, props.id)
                            }

                            return <div key={t.id}><Checkbox
                                                         onChange={onChangeStatusHandler}
                                                         checked={t.isDone}
                                                         className={t.isDone ? 'is-done' : ''} />
                                <EditableSpan title={t.title} onChange={onChangeTitleHandler}/>
                                <IconButton onClick={onRemoveHandler}>
                                    <Delete />
                                </IconButton>
                        </div>})
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
};

export default TodoList;
