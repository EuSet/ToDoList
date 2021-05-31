import {v1} from "uuid";
import {addToDoList, removeToDoList} from "./toDoLists-reducer";
import {TaskPriorities, TaskStatuses, TaskType} from "../api/toDoLists-api";

type ActionsType = ReturnType<typeof removeTask> |
    ReturnType<typeof addNewTask> |
    ReturnType<typeof getChangeCheckedTask> |
    ReturnType<typeof changeTaskTitle> |
    ReturnType<typeof removeToDoList> |
    ReturnType<typeof addToDoList>
export type TaskStateType = {
    [key: string]: Array<TaskType>
}
const initialState: TaskStateType ={}

export const tasksReducer = (state:TaskStateType = initialState, action:ActionsType ): TaskStateType => {
    switch (action.type) {
        case "REMOVE_TASK":
            state[action.toDoListId] = state[action.toDoListId].filter(t => t.id !== action.id)
            return {
                ...state
            }
        case "ADD_NEW_TASK":
            const newTask: TaskType = {
                id: v1(), status: TaskStatuses.New, title: action.title, addedDate: '',
                completed: false, deadline: '', description: '', order:0, priority:TaskPriorities.Urgently,
                startDate:'', todoListId:action.toDoListId
            }
            return {
                ...state, [action.toDoListId]: [newTask, ...state[action.toDoListId]]
            }
        case "CHANGE_CHECKED_TASK":
           const updateChecked:Array<TaskType> = state[action.toDoListId].map(t => {
                if (t.id === action.id) {
                    // t.checked = !t.checked
                    return {...t, status: t.status === 0 ? 2 : 0}
                }
                return t
            })
            return {
                ...state, [action.toDoListId]:updateChecked
            }
        case "CHANGE_TASK_TITLE":
            const updateTasks = state[action.toDoListId].map(t => {
                if (t.id === action.id) {
                    t.title = action.title
                    return {...t, task: action.title}
                }
                return t
            })
            return {
                ...state,updateTasks
            }
        case "REMOVE_TO_DO_LIST":
            delete state[action.toDoListId]
            return {
                ...state
            }
        case "ADD_TO_DO_LIST":
            return {
                ...state, [action.newToDoLisId]: []
            }
        default:
            return state
    }
}

export const removeTask = (id: string, toDoListId: string) => {
    return {type: 'REMOVE_TASK', toDoListId, id} as const
}
export const addNewTask = (title: string, toDoListId: string) => {
    return {type: 'ADD_NEW_TASK', title, toDoListId} as const
}
export const getChangeCheckedTask = (id: string, toDoListId: string) => {
    return {type: 'CHANGE_CHECKED_TASK', id, toDoListId} as const
}
export const changeTaskTitle = (title: string, id: string, toDoListId: string) => {
    return {type: 'CHANGE_TASK_TITLE', title, id, toDoListId} as const
}
