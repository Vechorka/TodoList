import React, {ChangeEvent, useState} from "react";
import {TextField} from "@material-ui/core";

type EditableSpanType = {
    title: string
    onChange: (newValue:string) => void
    disabled?: boolean
}

export const EditableSpan = React.memo(({title, onChange, disabled = false}: EditableSpanType) => {
    console.log('EditableSpan called')
    let [editMode, setEditMode] = useState(false)
    let [titleValue, setTitleValue] = useState('')

    const activateEditMode = () => {
        setEditMode(true)
        setTitleValue(title)
    }
    const activateViewMode = () => {
        setEditMode(false)
        onChange(titleValue)
    }
    const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => setTitleValue(e.currentTarget.value)




    return editMode
        ? <TextField value={titleValue} onChange={onChangeTitleHandler} disabled={disabled} onBlur={activateViewMode} autoFocus />
        : <span onDoubleClick={activateEditMode}>{title}</span>

})