import {
    addNewTaskThunk,
    removeTaskThunk,
    setTasksThunk,
    tasksReducer,
    TaskStateType,
    UpdateModelTaskType, updateTaskThunk,
} from './tasks-reducer';
import {TaskPriorities, TaskStatuses, TaskType} from "../api/toDoLists-api";
import {v1} from "uuid";
import {addNewToDoListThunk, removeToDoListThunk, setToDoListsThunk} from "./toDoLists-reducer";

const toDoListId1: string = v1()
const toDoListId2 = v1()
let startState:TaskStateType = {}
beforeEach(() => {
    startState = {
        "todolistId1": [
            {
                id: '1', status: TaskStatuses.New, title: 'HTML', addedDate: '',
                completed: false, deadline: '', description: '', order:0, priority:TaskPriorities.Urgently,
                startDate:'', entityStatus:'idle', todoListId:toDoListId1
            },
            {
                id: '2', status: TaskStatuses.Completed, title: 'CSS', addedDate: '',
                completed: false, deadline: '', description: '', order:0, priority:TaskPriorities.Urgently,
                startDate:'', entityStatus:'idle', todoListId:toDoListId1
            },
            {
                id: '3', status: TaskStatuses.New, title: 'React', addedDate: '',
                completed: false, deadline: '', description: '', order:0, priority:TaskPriorities.Urgently,
                startDate:'', entityStatus:'idle', todoListId:toDoListId1
            }
        ],
        "todolistId2": [
            {
                id: '1', status: TaskStatuses.New, title: 'Beer', addedDate: '',
                completed: false, deadline: '', description: '', order:0, priority:TaskPriorities.Urgently,
                startDate:'', entityStatus:'idle', todoListId:toDoListId2
            },
            {
                id: '2', status: TaskStatuses.Completed, title: 'Fish', addedDate: '',
                completed: false, deadline: '', description: '', order:0, priority:TaskPriorities.Urgently,
                startDate:'', entityStatus:'idle', todoListId:toDoListId2
            },
            {
                id: '3', status: TaskStatuses.New, title: 'Chips', addedDate: '',
                completed: false, deadline: '', description: '', order:0, priority:TaskPriorities.Urgently,
                startDate:'', entityStatus:'idle', todoListId:toDoListId2
            }
        ]
    };
})
test('correct task should be deleted from correct array', () => {
    const param = {id: "2", toDoListId: "todolistId2"}
    const action = removeTaskThunk.fulfilled(param, '', param);
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"].length).toBe(2);
    expect(endState["todolistId2"][0].title).toBe('Beer');
    expect(endState["todolistId2"][1].title).toBe('Chips')

});
test('correct task should be added to correct array', () => {
    const task:TaskType = {
        id: v1(), status: TaskStatuses.New, title: 'juce', addedDate: '',
        completed: false, deadline: '', description: '', order:0, priority:TaskPriorities.Urgently,
        startDate:'', todoListId:"todolistId2"
    }
    const param = { title: task.title, toDoListId: task.todoListId}
    const action = addNewTaskThunk.fulfilled({task}, '', param);

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe("juce");
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
})
test('status of specified task should be changed', () => {
    const updateModel:UpdateModelTaskType = {
        status: TaskStatuses.New
    }
    const param = {id:"2", toDoListId: "todolistId2", model: updateModel}
    const action = updateTaskThunk.fulfilled(param, '' ,param);

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
    expect(endState["todolistId1"][1].title).toBeTruthy()
});
test('title of specified task should be changed', () => {
    const updateModel:UpdateModelTaskType = {
        title:'Redux'
    }
    const param = {id:"1", toDoListId: "todolistId1", model: updateModel}
    const action = updateTaskThunk.fulfilled(param, '' ,param);

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"][0].title).toBe('Redux');
});

test('tasks should be deleted', () => {

    const action = removeToDoListThunk.fulfilled( {toDoListId: 'todolistId1'}, '', {toDoListId: 'todolistId1'});

    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState);

    expect(endState["todolistId1"]).not.toBeDefined();
    expect(keys.length).toBe(1)
})
test('tasks should be added', () => {
    const newToDo = {
        id: 'toDoListId3', title: 'NewToDOList', taskFilter: 'all', addedDate:'', order:0
    }
    const action = addNewToDoListThunk.fulfilled({toDo: newToDo}, '', {title: newToDo.title});

    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
    expect(endState[action.payload.toDo.id]).toBeDefined();
})
test('empty array for tasks should be added', () => {
    const actionState = [
        {id: toDoListId1, title: 'What to learn', taskFilter: 'all', addedDate:'', order:0},
        {id: toDoListId2, title: 'What to buy', taskFilter: 'active', addedDate:'', order:0}
    ]
    const newState = tasksReducer({},setToDoListsThunk.fulfilled({toDoLists: actionState}, ''))
    const keys = Object.keys(newState)
    expect(keys.length).toBe(2)
    expect(newState[actionState[0].id]).toStrictEqual([])
})
test('tasks should be set to state', () => {
    const actionState:TaskStateType = {['toDoListId1']:[]}
    const tasks = [
        {
            id: v1(), status: TaskStatuses.Completed, title: 'HTML', addedDate: '',
            completed: false, deadline: '', description: '', order:0, priority:TaskPriorities.Urgently,
            startDate:'', todoListId:toDoListId1
        }
    ]
    const action = setTasksThunk.fulfilled({tasks, toDoListId:'toDoListId1'}, '', 'toDoListId1')
    const newState = tasksReducer(actionState, action)
    expect(newState['toDoListId1'].length).toBe(1)
})
