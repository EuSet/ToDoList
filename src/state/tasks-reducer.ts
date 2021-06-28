import {addToDoList, removeToDoList, setToDoLists} from "./toDoLists-reducer";
import {tasksAPI, TaskType, UpdateTaskType} from "../api/toDoLists-api";
import {AppThunk} from "./store";
import {appSetStatus, RequestStatusType} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utills/error-utills";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type TasksActionsType = ReturnType<typeof removeTask> |
    ReturnType<typeof addNewTask> |
    ReturnType<typeof removeToDoList> |
    ReturnType<typeof addToDoList> |
    ReturnType<typeof setToDoLists> |
    ReturnType<typeof setTasks> |
    ReturnType<typeof updateTask> |
    ReturnType<typeof changeEntityStatusTask>
export type TaskStateType = {
    [key: string]: Array<DomainTaskType>
}
const initialState: TaskStateType = {}
export type DomainTaskType = TaskType & {
    entityStatus: RequestStatusType
}

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        removeTask(state, action: PayloadAction<{ id: string, toDoListId: string }>) {
            const tasks = state[action.payload.toDoListId]
            const index = tasks.findIndex(t => t.id === action.payload.id)
            tasks.splice(index, 1)
        },
        addNewTask(state, action: PayloadAction<{ task: TaskType }>) {
            const newTask: DomainTaskType = {...action.payload.task, entityStatus: 'idle'}
            state[action.payload.task.todoListId].unshift(newTask)
        },
        updateTask(state, action: PayloadAction<{ id: string, toDoListId: string, model: UpdateModelTaskType }>) {
            const tasks = state[action.payload.toDoListId]
            const index = tasks.findIndex(t => t.id === action.payload.id)
            tasks[index] = {...tasks[index], ...action.payload.model}
        },
        setTasks(state, action: PayloadAction<{ tasks: Array<TaskType>, toDoListId: string }>) {
            state[action.payload.toDoListId] = action.payload.tasks.map(t => ({...t, entityStatus: 'idle'}))
        },
        changeEntityStatusTask(state, action: PayloadAction<{ id: string, toDoListId: string, status: RequestStatusType }>) {
            const tasks = state[action.payload.toDoListId]
            const index = tasks.findIndex(t => t.id === action.payload.id)
            tasks[index].entityStatus = action.payload.status
        }
    },
    extraReducers: builder => {
        builder.addCase(removeToDoList, (state, action) => {
            delete state[action.payload.toDoListId]
        })
        builder.addCase(addToDoList, (state, action) => {
            state[action.payload.toDo.id] = []
        })
        builder.addCase(setToDoLists, (state, action) => {
            action.payload.toDoLists.forEach(t => {
                state[t.id] = []
            })
        })
    }
})

export const tasksReducer = tasksSlice.reducer
export const {removeTask, addNewTask, updateTask, setTasks, changeEntityStatusTask} = tasksSlice.actions

export const setTasksThunk = (toDoListId: string): AppThunk => async dispatch => {
    try {
        dispatch(appSetStatus({status: 'loading'}))
        const res = await tasksAPI.getTasks(toDoListId)
        dispatch(setTasks({tasks: res.data.items, toDoListId}))
        dispatch(appSetStatus({status: 'idle'}))
    } catch (e) {
        handleServerNetworkError(e, dispatch)
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
export const updateTaskThunk = (toDoListId: string, id: string, model: UpdateModelTaskType): AppThunk => async (dispatch, getState) => {
    const task = getState().tasks[toDoListId].find(t => t.id === id)
    if (task) {
        const modelTask: UpdateTaskType = {
            ...task,
            ...model
        }
        try {
            dispatch(changeEntityStatusTask({id, toDoListId, status: 'loading'}))
            dispatch(appSetStatus({status: 'loading'}))
            const res = await tasksAPI.updateTaskTitle(toDoListId, id, modelTask)
            if (res.data.resultCode === 0) {
                dispatch(updateTask({id, toDoListId, model}))
                dispatch(appSetStatus({status: 'succeeded'}))
                dispatch(changeEntityStatusTask({id, toDoListId, status: 'idle'}))
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(changeEntityStatusTask({id, toDoListId, status: 'idle'}))
            }

        } catch (e) {
            handleServerNetworkError(e, dispatch)
            dispatch(changeEntityStatusTask({id, toDoListId, status: 'idle'}))
        }

    }
}
export const addNewTaskThunk = (title: string, toDoListId: string): AppThunk => async dispatch => {
    try {
        dispatch(appSetStatus({status: 'loading'}))
        const res = await tasksAPI.createNewTask(toDoListId, title)
        if (res.data.resultCode === 0) {
            dispatch(addNewTask({task: res.data.data.item}))
            dispatch(appSetStatus({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }

}
export const removeTaskThunk = (toDoListId: string, id: string): AppThunk => async dispatch => {
    try {
        dispatch(changeEntityStatusTask({id, toDoListId, status: 'loading'}))
        dispatch(appSetStatus({status: 'loading'}))
        await tasksAPI.deleteTask(toDoListId, id)
        dispatch(removeTask({id, toDoListId}))
        dispatch(appSetStatus({status: 'idle'}))
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }
}
