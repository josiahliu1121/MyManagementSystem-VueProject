import type { RoleData } from "./role/type"

export interface ResponseData {
    code:number,
    msg:string,
}

//data required for login interface
export interface loginForm{
    username:string,
    password:string
}

//data return by login interface
export interface loginResponseData extends ResponseData{
    data:string
}

export interface user{
    id?:number,
    avatar?:string,
    username:string,
    password?:string,
    roles?:string,
    name:string,
    createTime?:string,
    updateTime?:string,
    route?:string[],
    button?:string[]
}

//data return by check user interface
export interface userResponseData extends ResponseData{
    data:user
}

export interface UserPageQueryResponseData extends ResponseData{
    data: {
        records: user[],
        total: number
    }
}

export interface AssignedRoleResponseData extends ResponseData {
    data: {
        allRoleList:RoleData[],
        assignedRoleList:RoleData[]
    }
}

export interface AssignRoleRequestData {
    userId:number,
    roleIds:number[]
}