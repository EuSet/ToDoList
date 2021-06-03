import React, {useCallback, useEffect} from "react";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, ButtonGroup} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteSweepTwoToneIcon from "@material-ui/icons/DeleteSweepTwoTone";
import {Task} from "./Task";
import {TaskStatuses, TaskType} from "../api/toDoLists-api";
import {FiltersValueType} from "../state/toDoLists-reducer";
import {useDispatch} from "react-redux";
import {setTasksThunk} from "../state/tasks-reducer";

type ToDoListType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (id: string, toDoListId: string) => void
    changeToDoListFilter: (newFilterValue: FiltersValueType, toDoListId: string) => void
    getChangeCheckedTask: (id: string, toDoListId: string, status:TaskStatuses) => void
    addNewTask: (title: string, toDoListId: string) => void
    todoListFilter: FiltersValueType
    removeToDo: (toDoListId: string) => void
    changeTaskTitle: (title: string, id: string, toDoListId: string) => void
    changeToDoListItem: (title: string, toDoListId: string) => void
}

export const ToDoList = React.memo( (
    {id, addNewTask, changeToDoListFilter, changeTaskTitle, ...props}: ToDoListType) => {
    console.log('todolist called')

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(setTasksThunk(id))
    }, [])
    const toDoListFilter = ():TaskType[] => {
        switch (props.todoListFilter) {
            case "completed":
                return props.tasks.filter(t => t.status === TaskStatuses.Completed)
            case "active":
                return props.tasks.filter(t => t.status === TaskStatuses.New)
            default:
                return props.tasks
        }
    }
    const tasksAfterFilter = toDoListFilter()
    const mapTasksElements = tasksAfterFilter.map(t => {
        return <Task t={t}
                     getChangeCheckedTask={props.getChangeCheckedTask}
                     changeTitle={changeTaskTitle}
                     removeTask={props.removeTask}
                     id={id}
                     key={t.id}
        />
    })
    const addNewItemTask = useCallback((title: string) => {
        addNewTask(title, id)
    },[id, addNewTask])

    const addNewToDoTitle = (title: string) => {
        props.changeToDoListItem(title, id)
    }

    const onAllClickHandler = useCallback(() =>
        changeToDoListFilter('all', id),[changeToDoListFilter, id])
    const onActiveClickHandler = useCallback(() =>
        changeToDoListFilter('active', id),[changeToDoListFilter, id])
    const onCompletedClickHandler = useCallback(() =>
        changeToDoListFilter('completed', id),[changeToDoListFilter, id])

    return <div>
        <h3><EditableSpan changeTitle={addNewToDoTitle} title={props.title}/> <IconButton onClick={() => {
            props.removeToDo(id)
        }}><DeleteSweepTwoToneIcon color={"primary"}/></IconButton></h3>
        <AddItemForm addNewItem={addNewItemTask}/>
        <ul style={{listStyle: 'none'}}>
            {mapTasksElements}
        </ul>
        <div>
            <ButtonGroup size={"small"} color={"primary"}>
            <Button size={'small'} color={"primary"} variant={props.todoListFilter === 'all' ? 'contained' : 'outlined'}
                    onClick={onAllClickHandler}>All
            </Button>
            <Button size={'small'} color={"primary"}
                    variant={props.todoListFilter === 'active' ? 'contained' : 'outlined'}
                    onClick={onActiveClickHandler}>Active
            </Button>
            <Button size={'small'} color={"primary"}
                    variant={props.todoListFilter === 'completed' ? 'contained' : 'outlined'}
                    onClick={onCompletedClickHandler}
            >Completed
            </Button>
            </ButtonGroup>
        </div>
    </div>
})
