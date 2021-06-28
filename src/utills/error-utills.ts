import {ResponseType} from "../api/toDoLists-api";
import {appSetError, appSetStatus} from "../state/app-reducer";
import {AppActionsType, StateType} from "../state/store";
import {ThunkDispatch} from "redux-thunk";
type FuncType = (error:any, dispatch?:any) => void
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch:ThunkDispatch<StateType, unknown, AppActionsType>) => {
    if (data.messages.length) {
        dispatch(appSetError({error:data.messages[0]}))
    } else {
        dispatch(appSetError({error:'Some error occurred'}))
    }
    dispatch(appSetStatus({status:'failed'}))
}

export const handleServerNetworkError:FuncType = (error: {message: string}, dispatch:ThunkDispatch<StateType, unknown, AppActionsType>) => {
    dispatch(appSetError({error:error.message}))
    dispatch(appSetStatus({status:'failed'}))
}


//, dispatch:ThunkDispatch<StateType, unknown, AppActionsType>
