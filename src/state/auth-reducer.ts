import {AppThunk} from "./store";
import {authApi, LoginParamsType} from "../api/login-api";
import {handleServerAppError, handleServerNetworkError} from "../utills/error-utills";
import {setIsInitialized} from "./app-reducer";

const initialState = {
    isLoggedIn: false
}
export type AuthActionsType = ReturnType<typeof setIsLoggedInAC>
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: AuthActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

export const loginThunk = (data:LoginParamsType): AppThunk => async (dispatch) => {
    try {
        const res = await authApi.login(data)
        if(res.data.resultCode === 0){
            dispatch(setIsLoggedInAC(true))
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
            dispatch(setIsLoggedInAC(true))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }
    dispatch(setIsInitialized(true))
}
export const logOutThunk = ():AppThunk => async (dispatch) => {
    try {
        const res = await authApi.logOut()
        if(res.data.resultCode === 0){
            dispatch(setIsLoggedInAC(false))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }
}
