import React, {useState} from 'react';
import './App.css';
import {TaskType, ToDoList} from "./Components/ToDoList";
import {v1} from "uuid";
import {AddItemForm} from "./Components/AddItemForm";
import {AppBar, Container, Grid, Paper, Toolbar} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {Menu} from "@material-ui/icons";


export type FiltersValueType = "all" | "active" | "completed"
export type ToDOListType = {
    id: string,
    title: string,
    filter: FiltersValueType
}
export type TaskStateType = {
    [key: string]: Array<TaskType>
}
const ToDoListId1 = v1()
const ToDoListId2 = v1()

function App() {

    const [toDoLists, setToDOLists] = useState<Array<ToDOListType>>([
        {id: ToDoListId1, title: 'What to learn', filter: 'all'},
        {id: ToDoListId2, title: 'What to buy', filter: 'all'}
    ])
    const [tasks, setTasks] = useState<TaskStateType>({
        [ToDoListId1]: [
            {id: v1(), checked: true, task: 'HTML'},
            {id: v1(), checked: true, task: 'CSS'},
            {id: v1(), checked: false, task: 'React'},
        ],
        [ToDoListId2]: [
            {id: v1(), checked: true, task: 'Beer'},
            {id: v1(), checked: true, task: 'Fish'},
            {id: v1(), checked: false, task: 'Tasks'}
        ]
    })

    function changeToDoListFilter(newFilterValue: FiltersValueType, toDoListId: string) {
        // setToDOLists(toDoLists.map(tl => tl.id === toDoListId ? {...tl, filter: newFilterValue}:tl))
        const changeChecked = toDoLists.find(t => t.id === toDoListId)
        if (changeChecked) {
            changeChecked.filter = newFilterValue
        }
        setToDOLists([...toDoLists])
    }

    // function getTusksForToDoList() {
    //     switch (todoListFilter) {
    //         case "active":
    //             return tasks.filter(t => !t.checked)
    //         case "completed":
    //             return tasks.filter(t => t.checked)
    //         default:
    //             return tasks
    //     }

    // }

    function removeTask(id: string, toDoListId: string) {
        tasks[toDoListId] = tasks[toDoListId].filter(t => {
            return t.id !== id
        })
        setTasks({...tasks})
    }

    function getChangeCheckedTask(id: string, toDoListId: string) {
        tasks[toDoListId] = tasks[toDoListId].map(t => {
            if (t.id === id) {
                // t.checked = !t.checked
                return {...t, checked: !t.checked}
            }
            return t
        })
        setTasks({...tasks})
    }

    function removeToDo(toDoListId: string) {
        // toDoLists.filter(t => t.id != toDoListId)
        setToDOLists(toDoLists.filter(t => t.id !== toDoListId))
        delete tasks[toDoListId]
    }

    function addNewTask(title: string, toDoListId: string) {
        const newTask: TaskType = {id: v1(), checked: false, task: title}
        tasks[toDoListId] = [newTask, ...tasks[toDoListId]]
        setTasks({...tasks})
    }

    function toDoListFilter(toDoList: ToDOListType) {
        switch (toDoList.filter) {
            case "completed":
                return tasks[toDoList.id].filter(t => t.checked)
            case "active":
                return tasks[toDoList.id].filter(t => !t.checked)
            default:
                return tasks[toDoList.id]
        }
    }

    const AddToDoList = (title: string) => {
        const newToDoListId = v1()
        const newToDoList: ToDOListType = {
            id: newToDoListId, title, filter: 'all'
        }
        setToDOLists([newToDoList, ...toDoLists])
        setTasks({...tasks, [newToDoListId]: []})
    }
    const changeTaskTitle = (title: string, id: string, toDoListId: string) => {
        const updateTasks = tasks[toDoListId].map(t => {
            if (t.id === id) {
                t.task = title
                return {...t, task: title}
            }
            return t
        })
        setTasks({...tasks, updateTasks})

    }
    const changeToDoListItem = (title: string, toDoListId: string) => {
        const newTitle = toDoLists.map(t => t.id === toDoListId ? {...t, title: title} : t)
        setToDOLists(newTitle)
    }
    const gridStyle = {padding:'20px'}

    const toDoListComponent = toDoLists.map(tl => {
        return <Grid item key={tl.id}> <Paper elevation={7} style={gridStyle}><ToDoList
            id={tl.id}
            title={tl.title}
            tasks={toDoListFilter(tl)}
            removeTask={removeTask}
            changeToDoListFilter={changeToDoListFilter}
            getChangeCheckedTask={getChangeCheckedTask}
            addNewTask={addNewTask}
            todoListFilter={tl.filter}
            removeToDo={removeToDo}
            changeTaskTitle={changeTaskTitle}
            changeToDoListItem={changeToDoListItem}
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
            <AddItemForm addNewItem={AddToDoList}/>
                </Grid>
                <Grid container spacing={5}>
                {toDoListComponent}
                </Grid>
            </Container>
        </div>
    );
}

export default App;

