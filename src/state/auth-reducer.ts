import {authApi, LoginParamsType} from "../api/login-api";
import {handleServerAppError, handleServerNetworkError} from "../utills/error-utills";
import {setIsInitialized} from "./app-reducer";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false
}
// export type AuthActionsType = ReturnType<typeof setIsLoggedInAC>

export const loginThunk = createAsyncThunk(
    'auth/loginThunk',
    async (data: LoginParamsType, thunkAPI) => {
        try {
            const res = await authApi.login(data)
            if (res.data.resultCode === 0) {
                return {value: true}
            } else {
                handleServerAppError(res.data, thunkAPI.dispatch)
                return thunkAPI.rejectWithValue('')
            }
        } catch (e) {
            handleServerNetworkError(e, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue('')
        }
    }
)
export const initializeMeThunk = createAsyncThunk(
    'auth/initializeMeThunk',
    async (param, {dispatch, rejectWithValue}) => {
        try {
            const res = await authApi.me()
            if (res.data.resultCode === 0) {
                dispatch(setIsInitialized({value: true}))
                return {value: true}
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(setIsInitialized({value: true}))
                return rejectWithValue('')
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            dispatch(setIsInitialized({value: true}))
            return rejectWithValue('')
        }
    }
)
export const logOutThunk = createAsyncThunk(
    'auth/logOutThunk',
    async (param, {dispatch,rejectWithValue}) => {
        try {
            const res = await authApi.logOut()
            if (res.data.resultCode === 0) {
                return {value: false}
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue('')
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue('')
        }
    }
)
const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loginThunk.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.value
        })
        builder.addCase(initializeMeThunk.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.value
        })
        builder.addCase(logOutThunk.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.value
        })
    }
})

export const authReducer = authSlice.reducer
// export const {setIsLoggedInAC} = authSlice.actions


