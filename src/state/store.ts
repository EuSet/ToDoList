import { createStore, combineReducers, applyMiddleware } from "redux";
import {ToDoActionsType, toDoListsReducer} from "./toDoLists-reducer";
import {TasksActionsType, tasksReducer} from "./tasks-reducer";
import thunk, {ThunkAction} from "redux-thunk";

const rootReducer = combineReducers({
    toDoLists:toDoListsReducer,
    tasks:tasksReducer
})
export type StateType = ReturnType<typeof rootReducer>
export const store = createStore(rootReducer, applyMiddleware(thunk))

export type AppActionsType = ToDoActionsType | TasksActionsType
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, StateType, unknown, AppActionsType>
// @ts-ignore
window.store = store
