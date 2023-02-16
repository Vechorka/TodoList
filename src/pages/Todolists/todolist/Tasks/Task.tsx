import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskStatuses, TaskType} from "../../../../api/todolists-api";

type TaskPropsType = {
    removeTask: (id: string, todolistId: string) => void
    changeStatus: (taskID: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (taskID: string, newTitle: string, todolistId: string) => void
    task: TaskType
    todolistId: string
}

export const Task = React.memo((props: TaskPropsType) => {
    const onRemoveHandler = () => {
        props.removeTask(props.task.id, props.todolistId)
    }
    const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        props.changeStatus(props.task.id, e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New , props.todolistId)
    }
    const onChangeTitleHandler = useCallback ((newValue: string) => {
        props.changeTaskTitle(props.task.id, newValue, props.todolistId)
    }, [props.changeTaskTitle, props.task.id, props.todolistId])

    return <div key={props.task.id} style={{position:'relative'}}><Checkbox
        onChange={onChangeStatusHandler}
        checked={props.task.status === TaskStatuses.Completed}
        className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}/>
        <EditableSpan title={props.task.title} onChange={onChangeTitleHandler}/>
        <IconButton size={'small'} onClick={onRemoveHandler} style={{position:'absolute', top: '5px', right: '2px'}}>
            <Delete fontSize={'small'}/>
        </IconButton>
    </div>
})