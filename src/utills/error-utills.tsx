import {ResponseType} from "../api/toDoLists-api";
import {appSetError, appSetStatus} from "../state/app-reducer";
import {AppActionsType, StateType} from "../state/store";
import {ThunkDispatch} from "redux-thunk";

export const handleServerAppError = (data: ResponseType, dispatch:ThunkDispatch<StateType, unknown, AppActionsType>) => {
    if (data.messages.length) {
        dispatch(appSetError(data.messages[0]))
    } else {
        dispatch(appSetError('Some error occurred'))
    }
    dispatch(appSetStatus('failed'))
}

export const handleServerNetworkError = (error: {message: string}, dispatch:ThunkDispatch<StateType, unknown, AppActionsType>) => {
    dispatch(appSetError(error.message))
    dispatch(appSetStatus('failed'))
}


