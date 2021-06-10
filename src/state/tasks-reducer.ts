import {addToDoList, removeToDoList, setToDoLists} from "./toDoLists-reducer";
import {tasksAPI, TaskType, UpdateTaskType} from "../api/toDoLists-api";
import {AppThunk} from "./store";
import {appSetStatus, RequestStatusType} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utills/error-utills";

export type TasksActionsType = ReturnType<typeof removeTask> |
    ReturnType<typeof addNewTask> |
    ReturnType<typeof removeToDoList> |
    ReturnType<typeof addToDoList> |
    ReturnType<typeof setToDoLists> |
    ReturnType<typeof setTasks> |
    ReturnType<typeof updateTask> |
    ReturnType<typeof changeEntityStatusTask>
export type TaskStateType = {
    [key: string]: Array<DomainTaskType>
}
const initialState: TaskStateType = {}
export type DomainTaskType = TaskType & {
    entityStatus:RequestStatusType
}
export const tasksReducer = (state: TaskStateType = initialState, action: TasksActionsType): TaskStateType => {
    switch (action.type) {
        case "REMOVE_TASK":
            state[action.toDoListId] = state[action.toDoListId].filter(t => t.id !== action.id)
            return {
                ...state
            }
        case "ADD_NEW_TASK":
            const newTask: DomainTaskType = {...action.task, entityStatus:'idle'}
            return {
                ...state, [action.task.todoListId]: [newTask, ...state[action.task.todoListId]]
            }
        case "UPDATE_TASK":
            const updateTasks = state[action.toDoListId]
                .map(t => t.id === action.id ? {...t, ...action.model} : t)
            return {
                ...state,
                [action.toDoListId]: updateTasks
            }
        case "REMOVE_TO_DO_LIST":
            delete state[action.toDoListId]
            return {
                ...state
            }
        case "ADD_TO_DO_LIST":
            return {
                ...state, [action.toDo.id]: []
            }
        case "SET_TO_DO_LISTS":
            const stateCopy = state
            action.toDoLists.forEach(t => {
                stateCopy[t.id] = []
            })
            return stateCopy
        case "SET_TASK":
            const tasks:DomainTaskType[] = action.tasks.map(t => ({...t, entityStatus:'idle'}))
            return {
                ...state,
                [action.toDoListId]: [...tasks]
            }
        case "CHANGE_ENTITY_STATUS":
            return {
                ...state,
                [action.toDoListId]:[...state[action.toDoListId].map(t => t.id === action.id ? ({...t, entityStatus: action.status }) : t)]
            }
        default:
            return state
    }
}

export const removeTask = (id: string, toDoListId: string) => {
    return {type: 'REMOVE_TASK', toDoListId, id} as const
}
export const addNewTask = (task: TaskType) => {
    return {type: 'ADD_NEW_TASK', task} as const
}
export const updateTask = (id: string, toDoListId: string, model: UpdateModelTaskType) => {
    return {type: 'UPDATE_TASK', id, toDoListId, model} as const
}
export const setTasks = (tasks: Array<TaskType>, toDoListId: string) => {
    return {type: 'SET_TASK', tasks, toDoListId} as const
}
export const changeEntityStatusTask = (id: string, toDoListId: string, status:RequestStatusType) => {
    return {type:'CHANGE_ENTITY_STATUS', id, toDoListId, status} as const
}
export const setTasksThunk = (toDoListId: string): AppThunk => async dispatch => {
    try {
        dispatch(appSetStatus('loading'))
        const res = await tasksAPI.getTasks(toDoListId)
        dispatch(setTasks(res.data.items, toDoListId))
        dispatch(appSetStatus('idle'))
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }
}
export type UpdateModelTaskType = {
    title?: string
    description?: string | null
    completed?: boolean
    status?: number
    priority?: number
    startDate?: string | null
    deadline?: string | null
}
export const updateTaskThunk = (toDoListId: string, id: string, model: UpdateModelTaskType): AppThunk => async (dispatch, getState) => {
    const task = getState().tasks[toDoListId].find(t => t.id === id)
    if (task) {
        const modelTask: UpdateTaskType = {
            ...task,
            ...model
        }
        try {
            dispatch(changeEntityStatusTask(id, toDoListId, 'loading' ))
            dispatch(appSetStatus('loading'))
            const res = await tasksAPI.updateTaskTitle(toDoListId, id, modelTask)
            if(res.data.resultCode === 0){
                dispatch(updateTask(id, toDoListId, model))
                dispatch(appSetStatus('succeeded'))
                dispatch(changeEntityStatusTask(id, toDoListId, 'idle' ))
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(changeEntityStatusTask(id, toDoListId, 'idle' ))
            }

        } catch (e) {
            handleServerNetworkError(e, dispatch)
            dispatch(changeEntityStatusTask(id, toDoListId, 'idle' ))
        }

    }
}
export const addNewTaskThunk = (title: string, toDoListId: string): AppThunk => async dispatch => {
    try {
        dispatch(appSetStatus('loading'))
        const res = await tasksAPI.createNewTask(toDoListId, title)
        if(res.data.resultCode === 0){
            dispatch(addNewTask(res.data.data.item))
            dispatch(appSetStatus('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }

}
export const removeTaskThunk = (toDoListId: string, id: string): AppThunk => async dispatch => {
    try {
        dispatch(changeEntityStatusTask(id, toDoListId, 'loading' ))
        dispatch(appSetStatus('loading'))
        await tasksAPI.deleteTask(toDoListId, id)
        dispatch(removeTask(id, toDoListId))
        dispatch(appSetStatus('idle'))
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }
}
