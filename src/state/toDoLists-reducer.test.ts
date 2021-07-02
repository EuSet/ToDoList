import {v1} from 'uuid';
import {
    addNewToDoListThunk,
    changeToDoListFilter, changeToDoListTitleThunk,
    FiltersValueType, removeToDoListThunk, setToDoListsThunk,
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
        {id: todolistId1, title: 'What to learn', filter: 'all', entityStatus:'idle', addedDate:'', order:0},
        {id: todolistId2, title: 'What to buy', filter: 'active', entityStatus:'idle', addedDate:'', order:0}
    ]
})

test('correct todolist should be removed', () => {

    const action = removeToDoListThunk.fulfilled({toDoListId:todolistId1}, '', {toDoListId:todolistId1})
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
    const endState = toDoListsReducer(startState, addNewToDoListThunk.fulfilled({toDo:newToDo}, '', {title:newToDo.title}))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe('NewToDOList');
});
test('correct todolist should change name', () => {
    const param = {title:"New Todolist",toDoListId: todolistId2}
    const endState = toDoListsReducer(startState, changeToDoListTitleThunk.fulfilled(param, '', param))
    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe("New Todolist");
})
test('correct filter of todolist should be changed', () => {

    let newFilter: FiltersValueType = "completed";

    const endState = toDoListsReducer(startState, changeToDoListFilter({newFilterValue: newFilter, toDoListId: todolistId2}));

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});
test('todolists should be set in state', () => {
    const action = setToDoListsThunk.fulfilled({toDoLists: startState}, '')
    const newState = toDoListsReducer([], action)
    expect(newState.length).toBe(2)
    expect(newState[0].filter).toBe('all')
})
