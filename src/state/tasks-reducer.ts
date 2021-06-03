import {addToDoList, removeToDoList, setToDoLists} from "./toDoLists-reducer";
import {tasksAPI, TaskType, UpdateTaskType} from "../api/toDoLists-api";
import {ThunkDispatch} from "redux-thunk";
import {StateType} from "./store";

type ActionsType = ReturnType<typeof removeTask> |
    ReturnType<typeof addNewTask> |
    ReturnType<typeof removeToDoList> |
    ReturnType<typeof addToDoList> |
    ReturnType<typeof setToDoLists> |
    ReturnType<typeof setTasks> |
    ReturnType<typeof updateTask>
export type TaskStateType = {
    [key: string]: Array<TaskType>
}
const initialState: TaskStateType = {}

export const tasksReducer = (state: TaskStateType = initialState, action: ActionsType): TaskStateType => {
    switch (action.type) {
        case "REMOVE_TASK":
            state[action.toDoListId] = state[action.toDoListId].filter(t => t.id !== action.id)
            return {
                ...state
            }
        case "ADD_NEW_TASK":
            const newTask: TaskType = action.task
            return {
                ...state, [action.task.todoListId]: [newTask, ...state[action.task.todoListId]]
            }
        case "UPDATE_TASK":
            const updateTasks = state[action.toDoListId]
                .map(t => t.id === action.id ? {...t, ...action.model} : t)
            return {
                ...state,
                [action.toDoListId]:updateTasks
            }
        case "REMOVE_TO_DO_LIST":
            delete state[action.toDoListId]
            return {
                ...state
            }
        case "ADD_TO_DO_LIST":
            return {
                ...state, [action.toDo.id]: []
            }
        case "SET_TO_DO_LISTS":
            const stateCopy = state
            action.toDoLists.forEach(t => {
                stateCopy[t.id] = []
            })
            return stateCopy
        case "SET_TASK":
            return {
                ...state,
                [action.toDoListId]: [...action.tasks]
            }
        default:
            return state
    }
}

export const removeTask = (id: string, toDoListId: string) => {
    return {type: 'REMOVE_TASK', toDoListId, id} as const
}
export const addNewTask = (task:TaskType) => {
    return {type: 'ADD_NEW_TASK', task} as const
}
export const updateTask = (id: string, toDoListId: string, model: UpdateModelTaskType) => {
    return {type: 'UPDATE_TASK', id, toDoListId, model} as const
}
export const setTasks = (tasks: Array<TaskType>, toDoListId: string) => {
    return {type: 'SET_TASK', tasks, toDoListId} as const
}

export const setTasksThunk = (toDoListId: string) => {
    return (dispatch: ThunkDispatch<StateType, unknown, ActionsType>) => {
        tasksAPI.getTasks(toDoListId).then(res => {
            dispatch(setTasks(res.data.items, toDoListId))
        })
    }
}
export type UpdateModelTaskType = {
    title?: string
    description?: string | null
    completed?: boolean
    status?: number
    priority?: number
    startDate?: string | null
    deadline?: string | null
}
export const updateTaskThunk = (toDoListId: string, id: string, model: UpdateModelTaskType) => {
    return (dispatch: ThunkDispatch<StateType, unknown, ActionsType>, getState: () => StateType) => {
        const task = getState().tasks[toDoListId].find(t => t.id === id)
        if (task) {
            const modelTask: UpdateTaskType = {
                ...task,
                ...model
            }
            tasksAPI.updateTaskTitle(toDoListId, id, modelTask).then(res => {
                dispatch(updateTask(id, toDoListId, model))
            })
        }
    }
}
export const addNewTaskThunk = (title: string, toDoListId: string) => {
    return (dispatch: ThunkDispatch<StateType, unknown, ActionsType>) => {
        tasksAPI.createNewTask(toDoListId, title).then(res => {
            dispatch(addNewTask(res.data.data.item))
        })
    }
}
export const removeTaskThunk = (toDoListId: string, id: string) => {
    return (dispatch: ThunkDispatch<StateType, unknown, ActionsType>) => {
        tasksAPI.deleteTask(toDoListId, id).then(res => {
            if(res.data.resultCode === 0){
                dispatch(removeTask(id, toDoListId))
            }
        })
    }
}
