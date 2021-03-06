import {instance} from "./toDoLists-api";
import {ResponseType} from "./toDoLists-api"

export type LoginParamsType = {
    email:string
    password:string
    rememberMe:boolean
    captcha?:string

}
export const authApi = {
    login(data:LoginParamsType) {
        return instance.post<ResponseType<{userId: number}>>('/auth/login', data)
    },
    me() {
        return instance.get<ResponseType<{id:number, email:string, login:string}>>('/auth/me')
    },
    logOut(){
        return instance.delete<ResponseType>('/auth/login')
    }
}
