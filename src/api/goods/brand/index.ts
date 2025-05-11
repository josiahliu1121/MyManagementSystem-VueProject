import request from "@/utils/axios";
import type { BrandPageQueryData, Brand } from "./type";

enum API{
    PAGEQUERY_URL="/goods/pageQuery/",
    ADDBRAND_URL="/goods/save",
    UPDATEBRAND_URL="/goods/update",
    DELETEBRAND_URL="/goods/delete/"
}

export const reqPageQuery = (page:number, limit:number) => request.get<any, BrandPageQueryData>(API.PAGEQUERY_URL+`${page}/${limit}`)

export const reqSaveBrand = (data:Brand) => request.put<any, any>(API.ADDBRAND_URL, data,)

export const reqUpdateBrand = (data:Brand) => request.post<any,any>(API.UPDATEBRAND_URL, data)

export const reqDeleteBrand = (id:number) => request.delete<any, any>(API.DELETEBRAND_URL+`${id}`)