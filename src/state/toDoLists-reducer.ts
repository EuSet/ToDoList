import {todolistsAPI, ToDoListType} from "../api/toDoLists-api";
import {AppThunk} from "./store";

export type ToDoActionsType =
    ReturnType<typeof removeToDoList> |
    ReturnType<typeof addToDoList> |
    ReturnType<typeof changeToDoListItem> |
    ReturnType<typeof changeToDoListFilter> |
    ReturnType<typeof setToDoLists>
export type FiltersValueType = "all" | "active" | "completed"
export type toDoListCombineType = ToDoListType & {
    filter: FiltersValueType
}
const initialState: Array<toDoListCombineType> = []
export const toDoListsReducer = (toDoLists: Array<toDoListCombineType> = initialState, action: ToDoActionsType): Array<toDoListCombineType> => {
    switch (action.type) {
        case "REMOVE_TO_DO_LIST":
            return toDoLists.filter(t => t.id !== action.toDoListId)
        case "ADD_TO_DO_LIST":
            const newToDoList: toDoListCombineType = {...action.toDo, filter: 'all'}
            return [newToDoList, ...toDoLists]
        case "CHANGE_TO_DO_LIST_ITEM":
            return toDoLists.map(t => t.id === action.toDoListId ?
                {...t, title: action.title} : t)
        case "CHANGE_TO_DO_LIST_FILTER":
            return toDoLists.map(tl => tl.id === action.toDoListId ?
                {...tl, filter: action.newFilterValue} : tl)
        case "SET_TO_DO_LISTS":
            return action.toDoLists.map(t => ({...t, filter: 'all'}))
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

export const setToDoListsThunk = (): AppThunk => async dispatch => {
    try {
        const res = await todolistsAPI.getToDolists()
        dispatch(setToDoLists(res.data))
    } catch (e) {
        throw new Error(e)
    }
}

export const addNewToDoListThunk = (title: string): AppThunk => async dispatch => {
    try {
        const res = await todolistsAPI.createNewToDoList(title)
        dispatch(addToDoList(res.data.data.item))
    } catch (e) {
        throw new Error(e)
    }
}

export const changeToDoListTitleThunk = (toDoListId: string, title: string): AppThunk => async dispatch => {
    try {
        await todolistsAPI.updateToDoListTitle(toDoListId, title)
        dispatch(changeToDoListItem(title, toDoListId))
    } catch (e) {
        throw new Error(e)
    }
}
export const removeToDoListThunk = (toDoListId: string): AppThunk => async dispatch => {
    try {
        await todolistsAPI.deleteToDoList(toDoListId)
        dispatch(removeToDoList(toDoListId))
    } catch (e) {
        throw new Error(e)
    }
}
