import {todolistsAPI, ToDoListType} from "../api/toDoLists-api";
import {ThunkDispatch} from "redux-thunk";
import {StateType} from "./store";

type ActionsType =
    ReturnType<typeof removeToDoList> |
    ReturnType<typeof addToDoList> |
    ReturnType<typeof changeToDoListItem> |
    ReturnType<typeof changeToDoListFilter> |
    ReturnType<typeof setToDoLists>
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
            const newToDoList: toDoListCombineType = {...action.toDo, filter:'all'}
            return [newToDoList, ...toDoLists]
        case "CHANGE_TO_DO_LIST_ITEM":
            return toDoLists.map(t => t.id === action.toDoListId ?
                {...t, title: action.title} : t)
        case "CHANGE_TO_DO_LIST_FILTER":
            return toDoLists.map(tl => tl.id === action.toDoListId ?
                {...tl, filter: action.newFilterValue} : tl)
        case "SET_TO_DO_LISTS":
            return action.toDoLists.map(t => ({...t, filter:'all'}))
        default:
            return toDoLists
    }
}

export const removeToDoList = (toDoListId: string) => {
    return {type: 'REMOVE_TO_DO_LIST', toDoListId} as const
}
export const addToDoList = (toDo:ToDoListType) => {
    return {type: 'ADD_TO_DO_LIST', toDo} as const
}
export const changeToDoListItem = (title: string, toDoListId: string) => {
    return {type: 'CHANGE_TO_DO_LIST_ITEM', title, toDoListId} as const
}
export const changeToDoListFilter = (newFilterValue: FiltersValueType, toDoListId: string) => {
    return {type: 'CHANGE_TO_DO_LIST_FILTER', newFilterValue, toDoListId} as const
}
export const setToDoLists = (toDoLists:Array<ToDoListType>) => {
    return {type:'SET_TO_DO_LISTS', toDoLists} as const
}

export const setToDoListsThunk = () => {
    return (dispatch:ThunkDispatch<StateType, unknown, ActionsType>) => {
        todolistsAPI.getToDolists().then(res => {
            dispatch(setToDoLists(res.data))
        })
    }
}
export const addNewToDoListThunk = (title:string) => {
    return (dispatch:ThunkDispatch<StateType, unknown, ActionsType>) => {
        todolistsAPI.createNewToDoList(title).then(res => {
            dispatch(addToDoList(res.data.data.item))
        })
    }
}
export const changeToDoListTitleThunk = (toDoListId: string, title: string) => {
    return (dispatch:ThunkDispatch<StateType, unknown, ActionsType>) => {
        todolistsAPI.updateToDoListTitle(toDoListId, title).then(res => {
            dispatch(changeToDoListItem(title, toDoListId))
        })

    }
}
export const removeToDoListThunk = (toDoListId: string) => {
    return (dispatch:ThunkDispatch<StateType, unknown, ActionsType>) => {
        todolistsAPI.deleteToDoList(toDoListId).then(res => {
            if(res.data.resultCode === 0){
                dispatch(removeToDoList(toDoListId))
            }
        })
    }
}
