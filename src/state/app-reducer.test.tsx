import {appReducer, appSetError, appSetStatus, InitialStateType, RequestStatusType, setIsInitialized} from "./app-reducer";

let appTestInitialState:InitialStateType;
beforeEach(() => {
    appTestInitialState = {
        status: 'idle' as RequestStatusType,
        error: null,
        isInitialized: false
    }
})

test('app status should be changed', () => {
    const newState = appReducer(appTestInitialState, appSetStatus({status: "succeeded"}))
    expect(newState.status).toBe('succeeded')
})
test('app text error should be added', () => {
    const newState = appReducer(appTestInitialState, appSetError({error: "some error"}))
    expect(newState.error).toBe('some error')
})
test('app initialized should be changed', () => {
    const newState = appReducer(appTestInitialState, setIsInitialized({value: true}))
    expect(newState.isInitialized).toBeTruthy()
})
