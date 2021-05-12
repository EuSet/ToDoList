import React, {useCallback} from 'react';
import './App.css';
import {TaskType, ToDoList} from "./Components/ToDoList";
import {AddItemForm} from "./Components/AddItemForm";
import {AppBar, Container, Grid, Paper, Toolbar} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {Menu} from "@material-ui/icons";
import {addToDoList, changeToDoListFilter, changeToDoListItem, removeToDoList} from "./state/toDoLists-reducer";
import {addNewTask, changeTaskTitle, getChangeCheckedTask, removeTask} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {StateType} from "./state/store";


export type FiltersValueType = "all" | "active" | "completed"
export type ToDOListType = {
    id: string,
    title: string,
    filter: FiltersValueType
}
export type TaskStateType = {
    [key: string]: Array<TaskType>
}


function App() {

    let toDoLists = useSelector<StateType, Array<ToDOListType>>(state => state.toDoLists)
    let tasks = useSelector<StateType, TaskStateType>(state => state.tasks)
    let dispatch = useDispatch()

    const removedTask = useCallback((id: string, toDoListId: string) => {
        dispatch(removeTask(id, toDoListId))

    },[dispatch])
    const getChangedCheckedTask = useCallback((id: string, toDoListId: string) => {
        dispatch(getChangeCheckedTask(id, toDoListId))

    },[dispatch])
    const addedNewTask = useCallback((title: string, toDoListId: string) => {
        dispatch(addNewTask(title, toDoListId))
    },[dispatch])
    const changedTaskTitle = useCallback((title: string, id: string, toDoListId: string) => {
        dispatch(changeTaskTitle(title, id, toDoListId))

    },[dispatch])
    // const toDoListFilter = useCallback((toDoList: ToDOListType) => {
    //     switch (toDoList.filter) {
    //         case "completed":
    //             return tasks[toDoList.id].filter(t => t.checked)
    //         case "active":
    //             return tasks[toDoList.id].filter(t => !t.checked)
    //         default:
    //             return tasks[toDoList.id]
    //     }
    // },[tasks])

    const removeToDo = useCallback((toDoListId: string) => {
        dispatch(removeToDoList(toDoListId))
    },[dispatch])
    const AddedToDoList = useCallback((title: string) => {
        dispatch(addToDoList(title))
    },[dispatch])
    const changedToDoListItem = useCallback((title: string, toDoListId: string) => {
        dispatch(changeToDoListItem(title, toDoListId))
    },[dispatch])
    const changedToDoListFilter = useCallback((newFilterValue: FiltersValueType, toDoListId: string) => {
        dispatch(changeToDoListFilter(newFilterValue, toDoListId))
    },[dispatch])

    const gridStyle = {padding:'20px'}

    const toDoListComponent = toDoLists.map(tl => {
        return <Grid item key={tl.id}> <Paper elevation={7} style={gridStyle}><ToDoList
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

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar style={{justifyContent:'space-between'}}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        ToDoLists
                    </Typography>
                        <Button variant={'outlined'} color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={gridStyle}>
            <AddItemForm addNewItem={AddedToDoList}/>
                </Grid>
                <Grid container spacing={5}>
                {toDoListComponent}
                </Grid>
            </Container>
        </div>
    );
}

export default App;

