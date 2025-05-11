import request from "@/utils/axios";
import type { getSkuResponseData, skuData, SkuPageQueryResponseData } from "./type";

enum API {
    ADDSKU_URL = '/goods/sku/addOrUpdateSku',
    GETSKU_URL = '/goods/sku/getSku/',
    PAGEQUERY_URL = '/goods/sku/pageQuery/',
    CHANGEISAVAILABLE_URL = '/goods/sku/changeIsAvailable/',
    DELETESKU_URL = '/goods/sku/deleteSku/'
}

export const reqAddOrUpdateSku = (data:skuData) => request.put<any, any>(API.ADDSKU_URL, data)

export const reqGetSku = (spuId:number) => request.get<any, getSkuResponseData>(API.GETSKU_URL + spuId)

export const reqPageQuery = (currentPage:number, pageSize:number) => request.get<any, SkuPageQueryResponseData>(API.PAGEQUERY_URL + `${currentPage}/${pageSize}`)

export const reqChangeIsAvailable = (id:number) => request.post<any, any>(API.CHANGEISAVAILABLE_URL + id)

export const reqDeleteSku = (id:number) => request.delete<any,any>(API.DELETESKU_URL + id)