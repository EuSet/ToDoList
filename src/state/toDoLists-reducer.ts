import {v1} from "uuid";
import {ToDoListType} from "../api/toDoLists-api";

type ActionsType =
    ReturnType<typeof removeToDoList> |
    ReturnType<typeof addToDoList> |
    ReturnType<typeof changeToDoListItem> |
    ReturnType<typeof changeToDoListFilter>
export type FiltersValueType = "all" | "active" | "completed"
export type toDoListCombineType = ToDoListType & {
    filter:FiltersValueType
}
const initialState:Array<toDoListCombineType> = []
export const toDoListsReducer = (toDoLists: Array<toDoListCombineType> = initialState, action:ActionsType ): Array<toDoListCombineType> => {
    switch (action.type) {
        case "REMOVE_TO_DO_LIST":
            return toDoLists.filter(t => t.id !== action.toDoListId)
        case "ADD_TO_DO_LIST":
            const newToDoList: toDoListCombineType = {
                id: action.newToDoLisId, title: action.title, filter: 'all', addedDate:'', order:0}
            return [newToDoList, ...toDoLists]
        case "CHANGE_TO_DO_LIST_ITEM":
            return toDoLists.map(t => t.id === action.toDoListId ?
                {...t, title: action.title} : t)
        case "CHANGE_TO_DO_LIST_FILTER":
            return toDoLists.map(tl => tl.id === action.toDoListId ?
                {...tl, filter: action.newFilterValue} : tl)
        default:
            return toDoLists
    }
}

export const removeToDoList = (toDoListId: string) => {
    return {type: 'REMOVE_TO_DO_LIST', toDoListId} as const
}
export const addToDoList = (title: string) => {
    return {type: 'ADD_TO_DO_LIST', title, newToDoLisId:v1()} as const
}
export const changeToDoListItem = (title: string, toDoListId: string) => {
    return {type: 'CHANGE_TO_DO_LIST_ITEM', title, toDoListId} as const
}
export const changeToDoListFilter = (newFilterValue: FiltersValueType, toDoListId: string) => {
    return {type: 'CHANGE_TO_DO_LIST_FILTER', newFilterValue, toDoListId} as const
}
