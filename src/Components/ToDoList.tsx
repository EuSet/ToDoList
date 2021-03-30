import React, {ChangeEvent, useState} from "react";
import {FiltersValueType, ToDOListType} from "../App";

type ToDoListType = {
    id:string
    title: string
    tasks: Array<TaskType>
    removeTask: (id: string, toDoListId:string) => void
    changeToDoListFilter: (newFilterValue: FiltersValueType, toDoListId:string) => void
    getChangeCheckedTask:(id: string,toDoListId:string) => void
    addNewTask:(title:string, toDoListId:string) => void
    todoListFilter:FiltersValueType
    removeToDo:(toDoListId:string) => void
}
export type TaskType = {
    id: string
    checked: boolean
    task: string
}

export function ToDoList(props: ToDoListType) {
    const addTask = () => {if(inputValue){
        props.addNewTask(inputValue.trim(),props.id)
    } else {
        setError('Error, filed is required')
    }
        setInputValue('')}
        const changeInputValue = (e:ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
            setError('')
    }
    const [inputValue, setInputValue] = useState('')
    const [error, setError] = useState('')
    const mapTasksElements = props.tasks.map(t => {
        return <li key={t.id}><input onClick={() => {props.getChangeCheckedTask(t.id, props.id)}} type="checkbox" checked={t.checked}/> <span>{t.task}</span>
            <button onClick={() => {
                props.removeTask(t.id, props.id)
            }}>del
            </button>
        </li>
    })
    const allBtnClass = props.todoListFilter === 'all'? 'active-filter': ''
    const activeBtnClass = props.todoListFilter === 'active'? 'active-filter': ''
    const completedBtnClass = props.todoListFilter === 'completed'? 'active-filter': ''

    return <div>
        <h3>{props.title} <button onClick={() => {props.removeToDo(props.id)}}>del</button></h3>
        <div>
            <input className={error ? 'errorInput' : '' } onChange={(e) => changeInputValue(e)}
                   onKeyPress={(e) => {if(e.key === 'Enter'){addTask()}}}
                   value={inputValue}/>
            <button onClick={addTask}>+</button>
            <div>
                <span className={'error'}>{error}</span>
            </div>

        </div>
        <ul>
            {mapTasksElements}
        </ul>
        <div>
            <button className={allBtnClass} onClick={() => {
                props.changeToDoListFilter('all', props.id)
            }}>All
            </button>
            <button className={activeBtnClass} onClick={() => {
                props.changeToDoListFilter('active', props.id)
            }}>Active
            </button>
            <button className={completedBtnClass} onClick={() => {
                props.changeToDoListFilter('completed', props.id)
            }}>Completed
            </button>
        </div>
    </div>
}