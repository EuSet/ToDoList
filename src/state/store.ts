import { createStore, combineReducers, applyMiddleware } from "redux";
import {toDoListsReducer} from "./toDoLists-reducer";
import {tasksReducer} from "./tasks-reducer";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
    toDoLists:toDoListsReducer,
    tasks:tasksReducer
})
export type StateType = ReturnType<typeof rootReducer>
export const store = createStore(rootReducer, applyMiddleware(thunk))

// @ts-ignore
window.store = store
