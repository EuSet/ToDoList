import React, {useState} from "react";
import {TextField} from "@material-ui/core";
import {RequestStatusType} from "../state/app-reducer";


type PropsType = {
    title: string
    changeTitle: (title: string) => void
    entityStatus?:RequestStatusType
}
export const EditableSpan = React.memo((props: PropsType) => {
    console.log('EditableSpan')
    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState<string>(props.title)
    const onEditMode = () => {
        if(props.entityStatus !== 'loading'){
            setEditMode(true)
            setTitle(props.title)
        }
    }
    const offEditMode = () => {
        setEditMode(false)
        props.changeTitle(title)
    }
    return editMode ?
        <TextField variant={'standard'} color={'primary'}
                   value={title} onChange={(e) => {
            setTitle(e.currentTarget.value)
        }}
                   autoFocus onBlur={offEditMode} type="text"/> :
        <span onDoubleClick={onEditMode}>{props.title}</span>
})
