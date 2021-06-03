import {v1} from 'uuid';
import {
    addToDoList, changeToDoListItem,
    FiltersValueType,
    removeToDoList, setToDoLists,
    toDoListCombineType,
    toDoListsReducer
} from "./toDoLists-reducer";
import {ToDoListType} from "../api/toDoLists-api";

let todolistId1: string
let todolistId2: string
let startState:Array<toDoListCombineType> = []

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();
    startState = [
        {id: todolistId1, title: 'What to learn', filter: 'all', addedDate:'', order:0},
        {id: todolistId2, title: 'What to buy', filter: 'active', addedDate:'', order:0}
    ]
})

test('correct todolist should be removed', () => {

    const action = removeToDoList(todolistId1)
    console.log(startState)
    const endState = toDoListsReducer(startState, action)


    console.log(endState)
    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});
test('correct todolist should be added', () => {

    const newToDo:ToDoListType = {
        id: 'toDoListId1', title: 'NewToDOList',  addedDate:'', order:0
    }
    const endState = toDoListsReducer(startState, addToDoList(newToDo))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe('NewToDOList');
});
test('correct todolist should change name', () => {

    const endState = toDoListsReducer(startState, changeToDoListItem("New Todolist", todolistId2))
    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe("New Todolist");
})
test('correct filter of todolist should be changed', () => {

    let newFilter: FiltersValueType = "completed";

    const action = {
        type: 'CHANGE_TO_DO_LIST_FILTER' as const,
        newFilterValue: newFilter,
        toDoListId: todolistId2,
    };

    const endState = toDoListsReducer(startState, action);

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});
test('todolists should be set in state', () => {
    const newState = toDoListsReducer([],setToDoLists(startState))
    expect(newState.length).toBe(2)
    expect(newState[0].filter).toBe('all')
})
