import {addNewTask, changeTaskTitle, getChangeCheckedTask, removeTask, tasksReducer} from './tasks-reducer';
import {TaskStateType} from "../App";
import {addToDoList, removeToDoList} from "./toDoLists-reducer";

let startState:TaskStateType = {}
beforeEach(() => {
    startState = {
        "todolistId1": [
            { id: "1", task: "CSS", checked: false },
            { id: "2", task: "JS", checked: true },
            { id: "3", task: "React", checked: false }
        ],
        "todolistId2": [
            { id: "1", task: "bread", checked: false },
            { id: "2", task: "milk", checked: true },
            { id: "3", task: "tea", checked: false }
        ]
    };
})
test('correct task should be deleted from correct array', () => {

    const action = removeTask("2", "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        "todolistId1": [
            { id: "1", task: "CSS", checked: false },
            { id: "2", task: "JS", checked: true },
            { id: "3", task: "React", checked: false }
        ],
        "todolistId2": [
            { id: "1", task: "bread", checked: false },
            { id: "3", task: "tea", checked: false }
        ]
    });

});
test('correct task should be added to correct array', () => {

    const action = addNewTask("juce", "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].task).toBe("juce");
    expect(endState["todolistId2"][0].checked).toBe(false);
})
test('status of specified task should be changed', () => {

    const action = getChangeCheckedTask("2", "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].checked).toBe(false);
    expect(endState["todolistId1"][1].task).toBeTruthy()
});
test('title of specified task should be changed', () => {

    const action = changeTaskTitle('Redux', '1', 'todolistId1');

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"][0].task).toBe('Redux');
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