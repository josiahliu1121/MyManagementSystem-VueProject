export interface ResponseData {
    code:number,
    msg:string,
}

export interface MenuData {
    id?:number,
    menuName:string,
    code:string,
    pid:number,
    level:number,
    children?:MenuData[]
    createTime?:string,
    updateTime?:string,
    selected?:boolean
}

export interface GetMenuDataResponseData extends ResponseData {
    data:MenuData[]
}