import request from "@/utils/axios";
import type { BaseSaleAttrResponseData, BrandListResponseData, SaleAttrResponseData, SpuData, SpuPageQueryResponseData } from "./type";

enum API {
    PAGEQUERY_URL = "/goods/spu/pageQuery/",
    GETBRAND_URL = "/goods/brand",
    IMAGE_URL = "/goods/spu/imageList/",
    SALEATTR_URL = "/goods/spu/saleAttrList/",
    BASESALEATTR_URL = "/goods/spu/baseSaleAttr",
    ADDSPU_URL = "/goods/spu/add",
    UPDATESPU_URL = "goods/spu/update",
    DELETESPU_URL = "goods/spu/delete/"
}

export const reqSPUList = (page:number, pageSize:number, category3Id:number|undefined) => request.get<any, SpuPageQueryResponseData>(API.PAGEQUERY_URL + `${page}/${pageSize}`, {
    params: {
        category3Id : category3Id
    }
})

export const reqBrandList = () => request.get<any, BrandListResponseData>(API.GETBRAND_URL)

export const reqImageList = (spuId:number) => request.get<any, any>(API.IMAGE_URL + spuId)

export const reqSaleAttrList = (spuId:number) => request.get<any, SaleAttrResponseData>(API.SALEATTR_URL + spuId)

export const reqBaseSaleAttrList = () => request.get<any, BaseSaleAttrResponseData>(API.BASESALEATTR_URL)

export const reqAddSpu = (data:SpuData) => request.put<any, any>(API.ADDSPU_URL, data)

export const reqUpdataSpu = (data:SpuData) => request.post<any,any>(API.UPDATESPU_URL, data)

export const reqDeleteSpu = (id:number) => request.delete<any,any>(API.DELETESPU_URL + id)