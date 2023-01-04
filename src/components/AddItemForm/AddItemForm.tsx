import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {Button, IconButton, TextField} from "@material-ui/core";
import {Add, AddBox} from "@material-ui/icons";

type AddItemFormPropsType = {
    addItem: (title:string) => void
    disabled?: boolean
}

export const AddItemForm = React.memo(({addItem, disabled = false}: AddItemFormPropsType) => {
    console.log('Add item form')
    const [newTaskTitle, setNewTaskTitle] = useState("")
    const [error, setError] = useState<string | null>(null)

    const addItemHandler = () => {
        if (newTaskTitle.trim())
        {
            addItem(newTaskTitle.trim())
            setNewTaskTitle('')
        }
        else {
            setError('Title is required')
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value)
    }


    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null)
        }
        if (e.charCode === 13) {
            addItemHandler()
        }
    }

    return (
        <div>
            <TextField
                value={newTaskTitle}
                disabled={disabled}
                variant={'outlined'}
                label={'Type value'}
                onChange={onChangeHandler}
                onKeyPress={onKeyPressHandler}
                error={!!error}
                helperText={error}
            />


            <IconButton color={'primary'} size={'small'} onClick={addItemHandler} disabled={disabled}> <AddBox/> </IconButton>
        </div>
    )
} )