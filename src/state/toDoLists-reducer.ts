import {todolistsAPI, ToDoListType} from "../api/toDoLists-api";
import {appSetStatus, RequestStatusType} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utills/error-utills";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export type ToDoActionsType =
    ReturnType<typeof changeToDoListFilter> |
    ReturnType<typeof changeTodolistEntityStatus>
export type FiltersValueType = "all" | "active" | "completed"
export type toDoListCombineType = ToDoListType & {
    filter: FiltersValueType
    entityStatus: RequestStatusType
}
const initialState: Array<toDoListCombineType> = []
export const setToDoListsThunk = createAsyncThunk(
    'toDoLists/setToDoListsThunk',
    async (param, {dispatch, rejectWithValue}) => {
        try {
            dispatch(appSetStatus({status: 'loading'}))
            const res = await todolistsAPI.getToDolists()
            // dispatch(setToDoLists({toDoLists: res.data}))
            dispatch(appSetStatus({status: 'idle'}))
            return {toDoLists: res.data}
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue('')
        }
    }
)
export const addNewToDoListThunk = createAsyncThunk(
    'toDoLists/addNewToDoListThunk',
    async (param: { title: string }, {dispatch, rejectWithValue}) => {
        try {
            dispatch(appSetStatus({status: 'loading'}))
            const res = await todolistsAPI.createNewToDoList(param.title)
            if (res.data.resultCode === 0) {
                dispatch(appSetStatus({status: 'succeeded'}))
                return {toDo: res.data.data.item}
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue('')
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue('')
        }
    }
)
export const changeToDoListTitleThunk = createAsyncThunk(
    'toDoLists/changeToDoListTitleThunk',
    async (param: { toDoListId: string, title: string }, {dispatch, rejectWithValue}) => {
        try {
            dispatch(appSetStatus({status: 'loading'}))
            const res = await todolistsAPI.updateToDoListTitle(param.toDoListId, param.title)
            if (res.data.resultCode === 0) {
                // dispatch(changeToDoListItem({title:param.title, toDoListId:param.toDoListId}))
                dispatch(appSetStatus({status: 'succeeded'}))
                return {title: param.title, toDoListId: param.toDoListId}
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(appSetStatus({status: 'failed'}))
                return rejectWithValue('')
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue('')
        }
    }
)
export const removeToDoListThunk = createAsyncThunk(
    'toDoLists/removeToDoListThunk',
    async (param: { toDoListId: string }, {dispatch, rejectWithValue}) => {
        try {
            dispatch(appSetStatus({status: 'loading'}))
            dispatch(changeTodolistEntityStatus({toDoListId: param.toDoListId, status: "loading"}))
            await todolistsAPI.deleteToDoList(param.toDoListId)
            // dispatch(removeToDoList({toDoListId: param.toDoListId}))
            dispatch(appSetStatus({status: 'succeeded'}))
            return {toDoListId: param.toDoListId}
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue('')
        }
    }
)
const toDoListsSlice = createSlice({
    name: 'toDoLists',
    initialState,
    reducers: {
        changeToDoListFilter(state, action: PayloadAction<{ newFilterValue: FiltersValueType, toDoListId: string }>) {
            const index = state.findIndex(tl => action.payload.toDoListId === tl.id)
            state[index].filter = action.payload.newFilterValue
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{ toDoListId: string, status: RequestStatusType }>) {
            const index = state.findIndex(tl => action.payload.toDoListId === tl.id)
            state[index].entityStatus = action.payload.status
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setToDoListsThunk.fulfilled, (state, action) => {
            return action.payload.toDoLists.map(t => ({...t, filter: 'all', entityStatus: 'idle'}))
        })
        builder.addCase(addNewToDoListThunk.fulfilled, (state, action) => {
            const newToDoList: toDoListCombineType = {...action.payload.toDo, filter: 'all', entityStatus: 'idle'}
            state.unshift(newToDoList)
        })
        builder.addCase(changeToDoListTitleThunk.fulfilled, (state, action) => {
            const index = state.findIndex(tl => action.payload.toDoListId === tl.id)
            state[index].title = action.payload.title
        })
        builder.addCase(removeToDoListThunk.fulfilled, (state, action) => {
            const index = state.findIndex(tl => action.payload.toDoListId === tl.id)
            state.splice(index, 1)
        })
    }
})

export const toDoListsReducer = toDoListsSlice.reducer
export const {
    changeToDoListFilter, changeTodolistEntityStatus
} = toDoListsSlice.actions

