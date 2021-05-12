import React, {useCallback} from "react";
import {Checkbox} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffTwoToneIcon from "@material-ui/icons/HighlightOffTwoTone";
import {TaskType} from "./ToDoList";

type PropsType = {
    t:TaskType
    getChangeCheckedTask:(id: string, toDoListId: string) => void
    changeTitle: (title: string, id: string, toDoListId: string) => void
    removeTask: (id: string, toDoListId: string) => void
    id:string
}
export const Task = React.memo(({t, id, changeTitle, ...props}:PropsType) => {
    const onChangeTaskTitle = useCallback((newTitle:string) => {
        changeTitle(newTitle, id, t.id)
    },[id, changeTitle, t.id])
    return <div style={t.checked ? {opacity: '0.5'} : {}} key={t.id}><Checkbox color={'primary'} onClick={() => {
        props.getChangeCheckedTask(t.id, id)
    }} checked={t.checked}/>
        <EditableSpan changeTitle={onChangeTaskTitle} title={t.task}/>
        <IconButton onClick={() => {
            props.removeTask(t.id, id)
        }}><HighlightOffTwoToneIcon color={"primary"}/>
        </IconButton>
    </div>

})
