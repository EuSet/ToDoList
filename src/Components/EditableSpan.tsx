import React, {useState} from "react";
import {TextField} from "@material-ui/core";


type PropsType = {
    title:string
    changeTitle: (title:string) => void
}
export const EditableSpan = (props:PropsType) => {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState(props.title)
    const onEditMode = () => {
        setEditMode(true)
        setTitle(props.title)
    }
    const offEditMode = () => {
        setEditMode(false)
        props.changeTitle(title)
    }
    return editMode ? <TextField variant={'standard'} color={'primary'} value={title} onChange={(e) => {setTitle(e.currentTarget.value)}} autoFocus onBlur={offEditMode} type="text"/> : <span onDoubleClick={onEditMode}>{props.title}</span>
}
