import request from "@/utils/axios";
import type { CategoryResponseData, PropertiesResponseData, PropertiesObj } from "./type";

enum API {
    C1_URL = '/goods/getCategory1',
    C2_URL = '/goods/getCategory2/',
    C3_URL = '/goods/getCategory3/',
    PROPERTIES_URL = '/goods/getPropertiesList/',
    SAVEORUPDATE_URL = '/goods/saveOrUpdate',
    DELETE_URL = '/goods/deleteProperties/'
}

export const reqCategory1 = () => request.get<any, CategoryResponseData>(API.C1_URL);

export const reqCategory2 = (category1Id:number) => request.get<any, CategoryResponseData>(API.C2_URL + category1Id);

export const reqCategory3 = (category2Id:number) => request.get<any, CategoryResponseData>(API.C3_URL + category2Id);

export const reqPropList = (category1Id:number|undefined, category2Id:number|undefined, category3Id:number|undefined) => request.get<any, PropertiesResponseData>(API.PROPERTIES_URL + `${category1Id}/${category2Id}/${category3Id}`)

export const reqSaveOrUpdate = (data:PropertiesObj) => request.post<any,any>(API.SAVEORUPDATE_URL, data)

export const reqDeleteProp = (id:number) => request.delete<any,any>(API.DELETE_URL + id)