import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState:InitialStateType = {
    status: 'idle' as RequestStatusType,
    error: null,
    isInitialized:false
}

export type InitialStateType = {
    status: RequestStatusType,
    error: string | null
    isInitialized:boolean
}
export const appSlice = createSlice({
    name:'app',
    initialState,
    reducers:{
        appSetStatus(state, action:PayloadAction<{status:RequestStatusType}>){
            state.status = action.payload.status
        },
        appSetError(state, action:PayloadAction<{error: string | null}>){
            state.error = action.payload.error
        },
        setIsInitialized(state, action:PayloadAction<{value:boolean}>) {
            state.isInitialized = action.payload.value
        }
    }
})
export const appReducer = appSlice.reducer
export const {appSetStatus, appSetError, setIsInitialized} = appSlice.actions

export type StatusActionsType = ReturnType<typeof appSetStatus>
    | ReturnType<typeof appSetError>
    | ReturnType<typeof setIsInitialized>

