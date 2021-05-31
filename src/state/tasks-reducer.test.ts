import {
    addNewTask,
    changeTaskTitle,
    getChangeCheckedTask,
    removeTask,
    tasksReducer,
    TaskStateType
} from './tasks-reducer';
import {addToDoList, removeToDoList} from "./toDoLists-reducer";
import {TaskPriorities, TaskStatuses} from "../api/toDoLists-api";
import {v1} from "uuid";
const toDoListId1: string = v1()
const toDoListId2 = v1()
let startState:TaskStateType = {}
beforeEach(() => {
    startState = {
        "todolistId1": [
            {
                id: '1', status: TaskStatuses.New, title: 'HTML', addedDate: '',
                completed: false, deadline: '', description: '', order:0, priority:TaskPriorities.Urgently,
                startDate:'', todoListId:toDoListId1
            },
            {
                id: '2', status: TaskStatuses.Completed, title: 'CSS', addedDate: '',
                completed: false, deadline: '', description: '', order:0, priority:TaskPriorities.Urgently,
                startDate:'', todoListId:toDoListId1
            },
            {
                id: '3', status: TaskStatuses.New, title: 'React', addedDate: '',
                completed: false, deadline: '', description: '', order:0, priority:TaskPriorities.Urgently,
                startDate:'', todoListId:toDoListId1
            }
        ],
        "todolistId2": [
            {
                id: '1', status: TaskStatuses.New, title: 'Beer', addedDate: '',
                completed: false, deadline: '', description: '', order:0, priority:TaskPriorities.Urgently,
                startDate:'', todoListId:toDoListId2
            },
            {
                id: '2', status: TaskStatuses.Completed, title: 'Fish', addedDate: '',
                completed: false, deadline: '', description: '', order:0, priority:TaskPriorities.Urgently,
                startDate:'', todoListId:toDoListId2
            },
            {
                id: '3', status: TaskStatuses.New, title: 'Chips', addedDate: '',
                completed: false, deadline: '', description: '', order:0, priority:TaskPriorities.Urgently,
                startDate:'', todoListId:toDoListId2
            }
        ]
    };
})
test('correct task should be deleted from correct array', () => {

    const action = removeTask("2", "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        "todolistId1": [
            {
                id: '1', status: TaskStatuses.New, title: 'HTML', addedDate: '',
                completed: false, deadline: '', description: '', order:0, priority:TaskPriorities.Urgently,
                startDate:'', todoListId:toDoListId1
            },
            {
                id: '2', status: TaskStatuses.Completed, title: 'CSS', addedDate: '',
                completed: false, deadline: '', description: '', order:0, priority:TaskPriorities.Urgently,
                startDate:'', todoListId:toDoListId1
            },
            {
                id: '3', status: TaskStatuses.New, title: 'React', addedDate: '',
                completed: false, deadline: '', description: '', order:0, priority:TaskPriorities.Urgently,
                startDate:'', todoListId:toDoListId1
            }
        ],
        "todolistId2": [
            {
                id: '1', status: TaskStatuses.New, title: 'Beer', addedDate: '',
                completed: false, deadline: '', description: '', order:0, priority:TaskPriorities.Urgently,
                startDate:'', todoListId:toDoListId1
            },
            {
                id: '3', status: TaskStatuses.New, title: 'Chips', addedDate: '',
                completed: false, deadline: '', description: '', order:0, priority:TaskPriorities.Urgently,
                startDate:'', todoListId:toDoListId1
            }
        ]
    });

});
test('correct task should be added to correct array', () => {

    const action = addNewTask("juce", "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe("juce");
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
})
test('status of specified task should be changed', () => {

    const action = getChangeCheckedTask("2", "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
    expect(endState["todolistId1"][1].title).toBeTruthy()
});
test('title of specified task should be changed', () => {

    const action = changeTaskTitle('Redux', '1', 'todolistId1');

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"][0].title).toBe('Redux');
});

test('tasks should be deleted', () => {

    const action = removeToDoList( 'todolistId1');

    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState);

    expect(endState["todolistId1"]).not.toBeDefined();
    expect(keys.length).toBe(1)
})
test('tasks should be added', () => {

    const action = addToDoList( 'todolistId3');

    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
    expect(endState[action.newToDoLisId]).toBeDefined();
})
