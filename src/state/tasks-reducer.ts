import {addNewToDoListThunk, removeToDoListThunk, setToDoListsThunk} from "./toDoLists-reducer";
import {tasksAPI, TaskType, UpdateTaskType} from "../api/toDoLists-api";
import {StateType} from "./store";
import {appSetStatus, RequestStatusType} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utills/error-utills";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export type TasksActionsType =
    ReturnType<typeof changeEntityStatusTask>
export type TaskStateType = {
    [key: string]: Array<DomainTaskType>
}
const initialState: TaskStateType = {}
export type DomainTaskType = TaskType & {
    entityStatus: RequestStatusType
}
export const setTasksThunk = createAsyncThunk(
    'tasks/setTasksThunk',
    async (toDoListId: string, thunkAPI) => {
        try {
            thunkAPI.dispatch(appSetStatus({status: 'loading'}))
            const res = await tasksAPI.getTasks(toDoListId)
            const tasks = res.data.items
            thunkAPI.dispatch(appSetStatus({status: 'idle'}))
            return {toDoListId, tasks}
        } catch (e) {
            handleServerNetworkError(e, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue('')
        }
    }
)
export const removeTaskThunk = createAsyncThunk(
    'tasks/removeTaskThunk',
    async (param: { toDoListId: string, id: string }, thunkAPI) => {
        try {
            thunkAPI.dispatch(changeEntityStatusTask({id: param.id, toDoListId: param.toDoListId, status: 'loading'}))
            thunkAPI.dispatch(appSetStatus({status: 'loading'}))
            await tasksAPI.deleteTask(param.toDoListId, param.id)
            thunkAPI.dispatch(appSetStatus({status: 'idle'}))
            return {id: param.id, toDoListId: param.toDoListId}
        } catch (e) {
            handleServerNetworkError(e, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue('')
        }

    }
)
export const addNewTaskThunk = createAsyncThunk(
    'tasks/addNewTaskThunk',
    async (param: { title: string, toDoListId: string }, thunkAPI) => {
        try {
            thunkAPI.dispatch(appSetStatus({status: 'loading'}))
            const res = await tasksAPI.createNewTask(param.toDoListId, param.title)
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(appSetStatus({status: 'succeeded'}))
                return {task: res.data.data.item}
            } else {
                handleServerAppError(res.data, thunkAPI.dispatch)
                return thunkAPI.rejectWithValue('')
            }
        } catch (e) {
            handleServerNetworkError(e, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue('')
        }
    }
)
export const updateTaskThunk = createAsyncThunk(
    'tasks/updateTaskThunk',
    async (param: { toDoListId: string, id: string, model: UpdateModelTaskType }, {dispatch, rejectWithValue, getState}) => {
        const state = getState() as StateType
        const task = state.tasks[param.toDoListId].find(t => t.id === param.id)
        if (task) {
            const modelTask: UpdateTaskType = {
                ...task,
                ...param.model
            }
            try {
                dispatch(changeEntityStatusTask({id: param.id, toDoListId: param.toDoListId, status: 'loading'}))
                dispatch(appSetStatus({status: 'loading'}))
                const res = await tasksAPI.updateTaskTitle(param.toDoListId, param.id, modelTask)
                if (res.data.resultCode === 0) {
                    // dispatch(updateTask({id: param.id, toDoListId: param.toDoListId, model: param.model}))
                    dispatch(appSetStatus({status: 'succeeded'}))
                    dispatch(changeEntityStatusTask({id: param.id, toDoListId: param.toDoListId, status: 'idle'}))
                    return {id: param.id, toDoListId: param.toDoListId, model: param.model}
                } else {
                    handleServerAppError(res.data, dispatch)
                    dispatch(changeEntityStatusTask({id: param.id, toDoListId: param.toDoListId, status: 'idle'}))
                    return rejectWithValue('')
                }
            } catch (e) {
                handleServerNetworkError(e, dispatch)
                dispatch(changeEntityStatusTask({id: param.id, toDoListId: param.toDoListId, status: 'idle'}))
                return rejectWithValue('')
            }

        }
        return rejectWithValue('')
    }
)

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        changeEntityStatusTask(state, action: PayloadAction<{ id: string, toDoListId: string, status: RequestStatusType }>) {
            const tasks = state[action.payload.toDoListId]
            const index = tasks.findIndex(t => t.id === action.payload.id)
            tasks[index].entityStatus = action.payload.status
        }
    },
    extraReducers: builder => {
        builder.addCase(removeToDoListThunk.fulfilled, (state, action) => {
            delete state[action.payload.toDoListId]
        })
        builder.addCase(addNewToDoListThunk.fulfilled, (state, action) => {
            state[action.payload.toDo.id] = []
        })
        builder.addCase(setToDoListsThunk.fulfilled, (state, action) => {
            action.payload.toDoLists.forEach(t => {
                state[t.id] = []
            })
        })
        builder.addCase(setTasksThunk.fulfilled, (state, action) => {
            state[action.payload.toDoListId] = action.payload.tasks.map(t => ({...t, entityStatus: 'idle'}))
        })
        builder.addCase(removeTaskThunk.fulfilled, (state, action) => {
            const tasks = state[action.payload.toDoListId]
            const index = tasks.findIndex(t => t.id === action.payload.id)
            tasks.splice(index, 1)
        })
        builder.addCase(addNewTaskThunk.fulfilled, (state, action) => {
            const newTask: DomainTaskType = {...action.payload.task, entityStatus: 'idle'}
            state[action.payload.task.todoListId].unshift(newTask)
        })
        builder.addCase(updateTaskThunk.fulfilled, (state, action) => {
            const tasks = state[action.payload.toDoListId]
            const index = tasks.findIndex(t => t.id === action.payload.id)
            tasks[index] = {...tasks[index], ...action.payload.model}
        })
    }
})

export const tasksReducer = tasksSlice.reducer
export const {changeEntityStatusTask} = tasksSlice.actions

export type UpdateModelTaskType = {
    title?: string
    description?: string | null
    completed?: boolean
    status?: number
    priority?: number
    startDate?: string | null
    deadline?: string | null
}

