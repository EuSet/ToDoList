import {Grid, Paper} from "@material-ui/core";
import {AddItemForm} from "../components/AddItemForm";
import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {StateType} from "../state/store";
import {
    addNewToDoListThunk,
    changeToDoListFilter,
    changeToDoListTitleThunk,
    FiltersValueType,
    removeToDoListThunk,
    setToDoListsThunk,
    toDoListCombineType
} from "../state/toDoLists-reducer";
import {addNewTaskThunk, removeTaskThunk, TaskStateType, updateTaskThunk} from "../state/tasks-reducer";
import {TaskStatuses} from "../api/toDoLists-api";
import {ToDoList} from "./todolist/ToDoList";
import {Redirect} from "react-router-dom";

export const ToDoListsList = () => {
    const isLoggedIn = useSelector<StateType, boolean>(state => state.auth.isLoggedIn)
    let toDoLists = useSelector<StateType, Array<toDoListCombineType>>(state => state.toDoLists)
    let tasks = useSelector<StateType, TaskStateType>(state => state.tasks)
    let dispatch = useDispatch()

    useEffect(() => {
        if(!isLoggedIn){
            return;
        }
        dispatch(setToDoListsThunk())
    }, [])

    const removedTask = useCallback((id: string, toDoListId: string) => {
        dispatch(removeTaskThunk(toDoListId, id))

    },[dispatch])
    const getChangedCheckedTask = useCallback((id: string, toDoListId: string, status:TaskStatuses) => {
        dispatch(updateTaskThunk(toDoListId, id, {status}))

    },[dispatch])
    const addedNewTask = useCallback((title: string, toDoListId: string) => {
        dispatch(addNewTaskThunk(title, toDoListId))
    },[dispatch])
    const changedTaskTitle = useCallback((title: string, id: string, toDoListId: string) => {
        dispatch(updateTaskThunk(id, toDoListId, {title}))
    },[dispatch])

    const removeToDo = useCallback((toDoListId: string) => {
        dispatch(removeToDoListThunk(toDoListId))
    },[dispatch])
    const AddedToDoList = useCallback((title: string) => {
        dispatch(addNewToDoListThunk(title))
    },[dispatch])
    const changedToDoListItem = useCallback((title: string, toDoListId: string) => {
        dispatch(changeToDoListTitleThunk(toDoListId, title))
    },[dispatch])
    const changedToDoListFilter = useCallback((newFilterValue: FiltersValueType, toDoListId: string) => {
        dispatch(changeToDoListFilter(newFilterValue, toDoListId))
    },[dispatch])

    const gridStyle = {padding:'20px'}
    if(!isLoggedIn){
        return <Redirect to={'/login'}/>
    }
    const toDoListComponent = toDoLists.map(tl => {
        return <Grid item key={tl.id}> <Paper elevation={7} style={gridStyle}><ToDoList
            entityStatus={tl.entityStatus}
            id={tl.id}
            title={tl.title}
            tasks={tasks[tl.id]}
            removeTask={removedTask}
            changeToDoListFilter={changedToDoListFilter}
            getChangeCheckedTask={getChangedCheckedTask}
            addNewTask={addedNewTask}
            todoListFilter={tl.filter}
            removeToDo={removeToDo}
            changeTaskTitle={changedTaskTitle}
            changeToDoListItem={changedToDoListItem}
        />
        </Paper>
        </Grid>
    })
    return <>
        <Grid container style={gridStyle}>
            <AddItemForm addNewItem={AddedToDoList}/>
        </Grid>
        <Grid container spacing={5}>
            {toDoListComponent}
        </Grid>
        </>
}
