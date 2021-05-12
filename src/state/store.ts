import { createStore, combineReducers } from "redux";
import {toDoListsReducer} from "./toDoLists-reducer";
import {tasksReducer} from "./tasks-reducer";

const rootReducer = combineReducers({
    toDoLists:toDoListsReducer,
    tasks:tasksReducer
})
export type StateType = ReturnType<typeof rootReducer>
export const store = createStore(rootReducer)

// @ts-ignore
window.store = store