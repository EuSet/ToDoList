import {AppThunk} from "./store";
import {authApi, LoginParamsType} from "../api/login-api";
import {handleServerAppError, handleServerNetworkError} from "../utills/error-utills";
import {setIsInitialized} from "./app-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false
}
export type AuthActionsType = ReturnType<typeof setIsLoggedInAC>
const authSlice = createSlice({
  name:'auth',
  initialState:initialState,
  reducers:{
      setIsLoggedInAC(state, action:PayloadAction<{value:boolean}>) {
          state.isLoggedIn = action.payload.value
      }
  }
})

export const authReducer = authSlice.reducer
export const {setIsLoggedInAC} = authSlice.actions

export const loginThunk = (data:LoginParamsType): AppThunk => async (dispatch) => {
    try {
        const res = await authApi.login(data)
        if(res.data.resultCode === 0){
            dispatch(setIsLoggedInAC({value:true}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }
}
export const initializeMeThunk = ():AppThunk => async (dispatch) => {
    try {
        const res = await authApi.me()
        if(res.data.resultCode === 0){
            dispatch(setIsLoggedInAC({value:true}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }
    dispatch(setIsInitialized({value:true}))
}
export const logOutThunk = ():AppThunk => async (dispatch) => {
    try {
        const res = await authApi.logOut()
        if(res.data.resultCode === 0){
            dispatch(setIsLoggedInAC({value:false}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }
}
