import {todolistsAPI, ToDoListType} from "../api/toDoLists-api";
import {AppThunk} from "./store";
import {appSetStatus, RequestStatusType} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utills/error-utills";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type ToDoActionsType =
    ReturnType<typeof removeToDoList> |
    ReturnType<typeof addToDoList> |
    ReturnType<typeof changeToDoListItem> |
    ReturnType<typeof changeToDoListFilter> |
    ReturnType<typeof setToDoLists> |
    ReturnType<typeof changeTodolistEntityStatus>
export type FiltersValueType = "all" | "active" | "completed"
export type toDoListCombineType = ToDoListType & {
    filter: FiltersValueType
    entityStatus: RequestStatusType
}
const initialState: Array<toDoListCombineType> = []

const toDoListsSlice = createSlice({
    name: 'toDoLists',
    initialState,
    reducers: {
        removeToDoList(state, action: PayloadAction<{ toDoListId: string }>) {
            const index = state.findIndex(tl => action.payload.toDoListId === tl.id)
            state.splice(index, 1)
        },
        addToDoList(state, action: PayloadAction<{ toDo: ToDoListType }>) {
            const newToDoList: toDoListCombineType = {...action.payload.toDo, filter: 'all', entityStatus: 'idle'}
            state.unshift(newToDoList)
        },
        changeToDoListItem(state, action: PayloadAction<{ title: string, toDoListId: string }>) {
            const index = state.findIndex(tl => action.payload.toDoListId === tl.id)
            state[index].title = action.payload.title
        },
        changeToDoListFilter(state, action: PayloadAction<{ newFilterValue: FiltersValueType, toDoListId: string }>) {
            const index = state.findIndex(tl => action.payload.toDoListId === tl.id)
            state[index].filter = action.payload.newFilterValue
        },
        setToDoLists(state, action: PayloadAction<{ toDoLists: Array<ToDoListType> }>) {
            return action.payload.toDoLists.map(t => ({...t, filter: 'all', entityStatus: 'idle'}))
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{ toDoListId: string, status: RequestStatusType }>) {
            const index = state.findIndex(tl => action.payload.toDoListId === tl.id)
            state[index].entityStatus = action.payload.status
        }

    }
})

export const toDoListsReducer = toDoListsSlice.reducer
export const {removeToDoList, addToDoList, changeToDoListItem,
    changeToDoListFilter, setToDoLists, changeTodolistEntityStatus} = toDoListsSlice.actions

export const setToDoListsThunk = (): AppThunk => async dispatch => {
    try {
        dispatch(appSetStatus({status: 'loading'}))
        const res = await todolistsAPI.getToDolists()
        dispatch(setToDoLists({toDoLists:res.data}))
        dispatch(appSetStatus({status: 'idle'}))
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }
}

export const addNewToDoListThunk = (title: string): AppThunk => async dispatch => {
    try {
        dispatch(appSetStatus({status: 'loading'}))
        const res = await todolistsAPI.createNewToDoList(title)
        if (res.data.resultCode === 0) {
            dispatch(addToDoList({toDo: res.data.data.item}))
            dispatch(appSetStatus({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }
}

export const changeToDoListTitleThunk = (toDoListId: string, title: string): AppThunk => async dispatch => {
    try {
        dispatch(appSetStatus({status: 'loading'}))
        const res = await todolistsAPI.updateToDoListTitle(toDoListId, title)
        if (res.data.resultCode === 0) {
            dispatch(changeToDoListItem({title, toDoListId}))
            dispatch(appSetStatus({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
        dispatch(appSetStatus({status: 'failed'}))

    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }
}
export const removeToDoListThunk = (toDoListId: string): AppThunk => async dispatch => {
    try {
        dispatch(appSetStatus({status: 'loading'}))
        dispatch(changeTodolistEntityStatus({toDoListId, status:"loading"}))
        await todolistsAPI.deleteToDoList(toDoListId)
        dispatch(removeToDoList({toDoListId}))
        dispatch(appSetStatus({status: 'succeeded'}))
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }
}
