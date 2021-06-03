import React, {useCallback, useEffect} from 'react';
import './App.css';
import {ToDoList} from "./Components/ToDoList";
import {AddItemForm} from "./Components/AddItemForm";
import {AppBar, Container, Grid, Paper, Toolbar} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {Menu} from "@material-ui/icons";
import {
    addNewToDoListThunk,
    changeToDoListFilter,
    changeToDoListTitleThunk,
    FiltersValueType,
    removeToDoListThunk,
    setToDoListsThunk,
    toDoListCombineType
} from "./state/toDoLists-reducer";
import {addNewTaskThunk, removeTaskThunk, TaskStateType, updateTaskThunk} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {StateType} from "./state/store";
import {TaskStatuses} from "./api/toDoLists-api";


function App() {

    let toDoLists = useSelector<StateType, Array<toDoListCombineType>>(state => state.toDoLists)
    let tasks = useSelector<StateType, TaskStateType>(state => state.tasks)
    let dispatch = useDispatch()
    useEffect(() => {
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

