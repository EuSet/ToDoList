import React from "react";
import {FiltersValueType} from "../App";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {Delete} from "@material-ui/icons";

type ToDoListType = {
    id:string
    title: string
    tasks: Array<TaskType>
    removeTask: (id: string, toDoListId:string) => void
    changeToDoListFilter: (newFilterValue: FiltersValueType, toDoListId:string) => void
    getChangeCheckedTask:(id: string,toDoListId:string) => void
    addNewTask:(title:string, toDoListId:string) => void
    todoListFilter:FiltersValueType
    removeToDo:(toDoListId:string) => void
    changeTaskTitle: (title:string, id:string, toDoListId:string) => void
    changeToDoListItem: (title:string, toDoListId:string) => void
}
export type TaskType = {
    id: string
    checked: boolean
    task: string
}

export function ToDoList(props: ToDoListType) {
    const mapTasksElements = props.tasks.map(t => {
        const changeTitle = (title:string) => {
            props.changeTaskTitle(title, t.id, props.id)
        }
        return <li style={t.checked ? {opacity: '0.5'} : {}} key={t.id}><Checkbox color={'primary'} onClick={() => {props.getChangeCheckedTask(t.id, props.id)}} checked={t.checked}/>
        <EditableSpan changeTitle={changeTitle} title={t.task}/>
            <IconButton onClick={() => {
                props.removeTask(t.id, props.id)
            }}><Delete/>
            </IconButton>
        </li>
    })
    const addNewItemTask = (title:string) => {
        props.addNewTask(title,props.id)

    }
    const addNewToDoTitle = (title:string) => {
        props.changeToDoListItem(title,props.id)
    }

    return <div>
        <h3><EditableSpan changeTitle={addNewToDoTitle} title={props.title}/> <IconButton onClick={() => {props.removeToDo(props.id)}}><Delete/></IconButton></h3>
        <AddItemForm addNewItem={addNewItemTask}/>
        <ul style={{listStyle:'none'}}>
            {mapTasksElements}
        </ul>
        <div>
            <Button size={'small'} color={"primary"} variant={props.todoListFilter === 'all' ? 'outlined' : 'contained'} onClick={() => {
                props.changeToDoListFilter('all', props.id)
            }}>All
            </Button>
            <Button size={'small'} color={"primary"} variant={props.todoListFilter === 'active' ? 'outlined' : 'contained'} onClick={() => {
                props.changeToDoListFilter('active', props.id)
            }}>Active
            </Button>
            <Button size={'small'} color={"primary"} variant={props.todoListFilter === 'completed' ? 'outlined' : 'contained'} onClick={() => {
                props.changeToDoListFilter('completed', props.id)
            }}>Completed
            </Button>
        </div>
    </div>
}