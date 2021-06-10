export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null
}

export type InitialStateType = {
    status: RequestStatusType,
    error: string | null
}

export const appReducer = (state: InitialStateType = initialState, action: StatusActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case "APP/SET-ERROR":
            return {...state, error: action.error}
        default:
            return state
    }
}

export type StatusActionsType = ReturnType<typeof appSetStatus> | ReturnType<typeof appSetError>

export const appSetStatus = (status: RequestStatusType) => {
    return {type: 'APP/SET-STATUS', status} as const
}
export const appSetError = (error: string | null) => {
    return {type: 'APP/SET-ERROR', error} as const
}
