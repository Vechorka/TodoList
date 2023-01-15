import axios from "axios";


const settings = {
    withCredentials: true,
    headers: {
        "API-KEY": '1d1b3ca8-5b05-4217-b570-1b1a1d28e554'
    }
}

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    ...settings
})

export type TodolistType = {
    id:string,
    title:string,
    addedDate:string,
    order:number
}

export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: D
}

export type UpdateTaskType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}

export type ResponseTaskType<D = {
    item: {
        description: string
        title: string
        completed: boolean
        status: number
        priority: number
        startDate: string
        deadline: string
        id: string
        todoListId: string
        order: number
        addedDate: string
    }
}> = {
    data: D
    resultCode: number
    messages: Array<string>
}

export enum TaskStatuses {
    New,
    InProgress,
    Completed,
    Draft

}

export enum TaskPriorities {
    Low,
    Middle,
    Hi,
    Urgently,
    Later
}

export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

type GetTaskType = {
    items: TaskType[],
    totalCount: number,
    error: string | null
}


export const todolistsAPI = {
    getTodolists() {
        const promise = instance.get<Array<TodolistType>>('todo-lists')
        return promise
    },
    createTodolists(title: string) {
        const promise = instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title: title})
        return promise
    },
    deleteTodolists(id: string) {
        const promise = instance.delete<ResponseType>(`todo-lists/${id}`)
        return promise
    },
    updateTodolists(id: string, title: string) {
        const promise = instance.put<ResponseType>(`todo-lists/${id}`, {title: title})
        return promise
    },
    getTasks(todolistId: string) {
        return instance.get<GetTaskType>(`todo-lists/${todolistId}/tasks`)
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    createTasks(todolistId: string, title: string) {
        return instance.post<ResponseTaskType<{item: TaskType}>>(`todo-lists/${todolistId}/tasks`, {title: title})
    },
    updateTask(todolistId: string, id: string, model: UpdateTaskType) {
        const promise = instance.put<ResponseTaskType<TaskType>>(`todo-lists/${todolistId}/tasks/${id}`, model)
        return promise
    }
}

export type LoginParamsType = {
    email: string,
    password: string,
    rememberMe: boolean,
    captcha?: string
}
export const authAPI = {
    login(data: LoginParamsType){
        const promise = instance.post<ResponseType<{userId?:number}>>('auth/login', data)
        return promise
    },
    me() {
        const promise = instance.get<ResponseType<{id:number, email: string, login: string}>>('auth/me')
        return promise
    }
}

