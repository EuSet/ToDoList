import {todolistsAPI, ToDoListType} from "../api/toDoLists-api";
import {AppThunk} from "./store";
import {appSetStatus, RequestStatusType} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utills/error-utills";

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
export const toDoListsReducer = (toDoLists: Array<toDoListCombineType> = initialState, action: ToDoActionsType): Array<toDoListCombineType> => {
    switch (action.type) {
        case "REMOVE_TO_DO_LIST":
            return toDoLists.filter(t => t.id !== action.toDoListId)
        case "ADD_TO_DO_LIST":
            const newToDoList: toDoListCombineType = {...action.toDo, filter: 'all', entityStatus:'idle'}
            return [newToDoList, ...toDoLists]
        case "CHANGE_TO_DO_LIST_ITEM":
            return toDoLists.map(t => t.id === action.toDoListId ?
                {...t, title: action.title} : t)
        case "CHANGE_TO_DO_LIST_FILTER":
            return toDoLists.map(tl => tl.id === action.toDoListId ?
                {...tl, filter: action.newFilterValue} : tl)
        case "SET_TO_DO_LISTS":
            return action.toDoLists.map(t => ({...t, filter: 'all', entityStatus:'idle'}))
        case "CHANGE_ENTITY_STATUS":
            return toDoLists.map(tl => tl.id === action.toDoListId ? {...tl, entityStatus: action.status} : tl)
        default:
            return toDoLists
    }
}

export const removeToDoList = (toDoListId: string) => {
    return {type: 'REMOVE_TO_DO_LIST', toDoListId} as const
}
export const addToDoList = (toDo: ToDoListType) => {
    return {type: 'ADD_TO_DO_LIST', toDo} as const
}
export const changeToDoListItem = (title: string, toDoListId: string) => {
    return {type: 'CHANGE_TO_DO_LIST_ITEM', title, toDoListId} as const
}
export const changeToDoListFilter = (newFilterValue: FiltersValueType, toDoListId: string) => {
    return {type: 'CHANGE_TO_DO_LIST_FILTER', newFilterValue, toDoListId} as const
}
export const setToDoLists = (toDoLists: Array<ToDoListType>) => {
    return {type: 'SET_TO_DO_LISTS', toDoLists} as const
}
export const changeTodolistEntityStatus = (toDoListId:string, status:RequestStatusType) => {
    return {type:'CHANGE_ENTITY_STATUS', toDoListId, status} as const
}
export const setToDoListsThunk = (): AppThunk => async dispatch => {
    try {
        dispatch(appSetStatus('loading'))
        const res = await todolistsAPI.getToDolists()
        dispatch(setToDoLists(res.data))
        dispatch(appSetStatus('idle'))
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }
}

export const addNewToDoListThunk = (title: string): AppThunk => async dispatch => {
    try {
        dispatch(appSetStatus('loading'))
        const res = await todolistsAPI.createNewToDoList(title)
        if(res.data.resultCode === 0){
            dispatch(addToDoList(res.data.data.item))
            dispatch(appSetStatus('succeeded'))
        } else{
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }
}

export const changeToDoListTitleThunk = (toDoListId: string, title: string): AppThunk => async dispatch => {
    try {
        dispatch(appSetStatus('loading'))
        const res = await todolistsAPI.updateToDoListTitle(toDoListId, title)
        if(res.data.resultCode === 0){
            dispatch(changeToDoListItem(title, toDoListId))
            dispatch(appSetStatus('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
        dispatch(appSetStatus('failed'))

    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }
}
export const removeToDoListThunk = (toDoListId: string): AppThunk => async dispatch => {
    try {
        dispatch(appSetStatus('loading'))
        dispatch(changeTodolistEntityStatus(toDoListId, "loading"))
        await todolistsAPI.deleteToDoList(toDoListId)
        dispatch(removeToDoList(toDoListId))
        dispatch(appSetStatus('succeeded'))
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }
}
