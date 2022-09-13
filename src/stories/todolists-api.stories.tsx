import React, {useEffect, useState} from 'react'
import axios from "axios";
import {todolistsAPI} from "../api/todolists-api";
export default {
    title: 'API'
}

const settings = {
    withCredentials: true,
    headers: {
        "API-KEY": '1d1b3ca8-5b05-4217-b570-1b1a1d28e554'
    }
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistsAPI.getTodolists()
            .then((res)=>{
            setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistsAPI.createTodolists('Dimkin ToDo')
            .then((res)=>{
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistsAPI.deleteTodolists('7760e837-c4fd-495f-a264-5237e1972b27')
            .then((res)=>{
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '715dadb1-eb56-40cf-a41e-9322a4bc893e'
        todolistsAPI.updateTodolists('715dadb1-eb56-40cf-a41e-9322a4bc893e', 'Nastin ToDo')
            .then((res)=>{
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '5aba4c81-1d7c-49b8-ad92-8d3a0289e759'
        todolistsAPI.getTasks(todolistId)
            .then((res)=>{
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState('')
    const [taskId, setTaskId] = useState('')

    const deleteTask = () => {
        todolistsAPI.deleteTask(todolistId, taskId)
            .then((res) => {
                setState(res.data)
            })
    }
    return <div> {JSON.stringify(state)}
         <div>
            <input placeholder={'todolistId'} value={todolistId} onChange={(e)=>{setTodolistId(e.currentTarget.value)}} />
            <input placeholder={'taskId'} value={taskId} onChange={(e)=>{setTaskId(e.currentTarget.value)}} />
                <button onClick={deleteTask}>Delete Task</button>
        </div>
            </div>
}

export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')
    const [title, setTitle] = useState<string>('')
    const createTask = () => {
        todolistsAPI.createTasks(todolistId, title)
            .then((res) => {
                setState(res.data)
            })
    }
    return <div> {JSON.stringify(state)}
                <div>
                    <input placeholder="todolistId" value={todolistId} onChange={(e)=>{setTodolistId(e.currentTarget.value)}} />
                    <input placeholder="title" value={title} onChange={(e)=>{setTitle(e.currentTarget.value)}} />
                    <button onClick={createTask}>Create Task</button>
                </div>
           </div>
}
export const UpdateTaskTitle = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')
    const [taskId, setTaskId] = useState<string>('')
    const [title, setTitle] = useState<string>('')

        const updateTask = () => {
            todolistsAPI.updateTask(todolistId, taskId, title)
                .then((res) => {
                    setState(res.data)
                })
        }
    return <div> {JSON.stringify(state)}
        <div>
            <input placeholder="todolistId" value={todolistId} onChange={(e)=>{setTodolistId(e.currentTarget.value)}} />
            <input placeholder="taskId" value={taskId} onChange={(e)=>{setTaskId(e.currentTarget.value)}} />
            <input placeholder="title" value={title} onChange={(e)=>{setTitle(e.currentTarget.value)}} />
            <button onClick={updateTask}>Update Task</button>
        </div>
        </div>

}


