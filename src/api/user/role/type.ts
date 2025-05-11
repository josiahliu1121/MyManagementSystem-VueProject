export interface ResponseData {
    code:number,
    msg:string,
}

export interface RoleData {
    id?:number,
    roleName:string,
    createTime?:string,
    updateTime?:string
}

export interface RolePageQueryResponseData extends ResponseData{
    data: {
        records: RoleData[],
        total: number
    }
}