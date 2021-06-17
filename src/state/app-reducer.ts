export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null,
    isInitialized:false
}

export type InitialStateType = {
    status: RequestStatusType,
    error: string | null
    isInitialized:boolean
}

export const appReducer = (state: InitialStateType = initialState, action: StatusActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case "APP/SET-ERROR":
            return {...state, error: action.error}
        case "APP/SET_INITIALIZED":
            return {...state, isInitialized: action.value}
        default:
            return state
    }
}

export type StatusActionsType = ReturnType<typeof appSetStatus>
    | ReturnType<typeof appSetError>
    | ReturnType<typeof setIsInitialized>

export const appSetStatus = (status: RequestStatusType) => {
    return {type: 'APP/SET-STATUS', status} as const
}
export const appSetError = (error: string | null) => {
    return {type: 'APP/SET-ERROR', error} as const
}
export const setIsInitialized = (value:boolean) => {
    return {type:'APP/SET_INITIALIZED', value} as const
}
