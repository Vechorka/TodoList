import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {Button, IconButton, TextField} from "@material-ui/core";
import {Add, AddBox} from "@material-ui/icons";

type AddItemFormPropsType = {
    addItem: (title:string) => void
}

export const AddItemForm = (props: AddItemFormPropsType) => {
    const [newTaskTitle, setNewTaskTitle] = useState("")
    const [error, setError] = useState<string | null>(null)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value)
    }

    const addItem = () => {
        if (newTaskTitle.trim())
        {
            props.addItem(newTaskTitle.trim())
            setNewTaskTitle('')
        }
        else {
            setError('Title is required')
        }

    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null)
        if (e.charCode === 13) {
            addItem()
        }
    }

    return (
        <div>
            <TextField
                value={newTaskTitle}
                variant={'outlined'}
                label={'Type value'}
                onChange={onChangeHandler}
                onKeyPress={onKeyPressHandler}
                error={!!error}
                helperText={error}
            />


        <IconButton color={'primary'} size={'small'} onClick={addItem}> <AddBox/> </IconButton>
    </div>
    )
}