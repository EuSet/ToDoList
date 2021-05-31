import {v1} from 'uuid';
import {FiltersValueType, removeToDoList, toDoListCombineType, toDoListsReducer} from "./toDoLists-reducer";

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

    let newTodolistTitle = "New Todolist";

    const endState = toDoListsReducer(startState, {type: 'ADD_TO_DO_LIST', title: newTodolistTitle, newToDoLisId:v1()})

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodolistTitle);
});
test('correct todolist should change its name', () => {

    let newTodolistTitle = "New Todolist";

    const endState = toDoListsReducer(startState, {type: 'CHANGE_TO_DO_LIST_ITEM', title: newTodolistTitle, toDoListId: todolistId2})
    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
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

