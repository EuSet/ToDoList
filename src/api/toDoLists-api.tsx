import axios from "axios";

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': 'bd25c1b4-72d5-4540-912d-5ef4c71f0544'
    }
}
const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1',
    ...settings
})
export type ToDoListType = {
    id: string
    title: string
    addedDate: string
    order: number
}
export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}
export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}
type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    data: D
}
export type TaskType = {
    description: string | null
    title: string
    completed: boolean
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string | null
    deadline: string | null
    id: string
    todoListId: string
    order: number
    addedDate: string
}
// type UpdateTaskType = {
//     title: string
//     description: string | null
//     completed: boolean
//     status: number
//     priority: number
//     startDate: string | null
//     deadline: string | null
// }
type GetTasksType = {
    items:Array<TaskType>
    totalCount:number
    error:string
}

export const todolistsAPI = {
    getToDolists() {
        return instance.get<Array<ToDoListType>>('/todo-lists')
    },
    createNewToDoList(title: string) {
        return instance.post<ResponseType<{ item: ToDoListType }>>('/todo-lists', {title})
    },
    deleteToDoList(id: string) {
        return instance.delete<ResponseType>(`/todo-lists/${id}`)
    },
    updateToDoListTitle(id: string, title: string) {
        return instance.put<ResponseType>(`/todo-lists/${id}`, {title})
    }
}

export const tasksAPI = {
    getTasks(todolistId:string) {
        return instance.get<GetTasksType>(`/todo-lists/${todolistId}/tasks`)
    },
    createNewTask(todolistId:string, title:string) {
        return instance.post<ResponseType<{item:TaskType}>>(`/todo-lists/${todolistId}/tasks/`, {title})
    },
    deleteTask(todolistId:string, taskId:string) {
        return instance.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTaskTitle(todolistId:string, taskId:string, Title:string) {
        return instance.put<ResponseType<{item:TaskType}>>(`/todo-lists/${todolistId}/tasks/${taskId}`, {Title} )
    }
}
