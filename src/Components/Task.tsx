import React, {useCallback} from "react";
import {Checkbox} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffTwoToneIcon from "@material-ui/icons/HighlightOffTwoTone";
import {TaskStatuses, TaskType} from "../api/toDoLists-api";

type PropsType = {
    t:TaskType
    getChangeCheckedTask:(id: string, toDoListId: string, status:TaskStatuses) => void
    changeTitle: (title: string, id: string, toDoListId: string) => void
    removeTask: (id: string, toDoListId: string) => void
    id:string
}
export const Task = React.memo(({t, id, changeTitle, ...props}:PropsType) => {
    const onChangeTaskTitle = useCallback((newTitle:string) => {
        changeTitle(newTitle, id, t.id)
    },[id, changeTitle, t.id])
    return <div style={t.status === TaskStatuses.Completed ? {opacity: '0.5'} : {}} key={t.id}><Checkbox color={'primary'} onClick={() => {
        props.getChangeCheckedTask(t.id, id, t.status === 0 ? 2 : 0)
    }} checked={t.status === TaskStatuses.Completed}/>
        <EditableSpan changeTitle={onChangeTaskTitle} title={t.title}/>
        <IconButton onClick={() => {
            props.removeTask(t.id, id)
        }}><HighlightOffTwoToneIcon color={"primary"}/>
        </IconButton>
    </div>

})
