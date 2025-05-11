export interface ResponseData {
    code:number,
    msg:string,
}

export interface Brand{
    id?:number,
    name:string,
    logoUrl:string
}

export type Records = Brand[]

export interface BrandPageQueryData extends ResponseData {
    data: {
        records:Records,
        total:number
    }
}