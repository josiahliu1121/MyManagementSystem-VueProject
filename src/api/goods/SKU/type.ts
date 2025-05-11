export interface ResponseData {
    code:number,
    msg:string,
}

export interface skuPropertiesValue {
    propertiesName:string,
    valueName:string
}

export interface skuSaleAttrValue {
    saleAttrName:string,
    valueName:string
}

export interface skuData {
    id?:number,
    skuName:string,
    isAvailable:number,
    spuId:number|undefined,
    price:number|undefined,
    weight:number|undefined,
    description:string,
    skuPropertiesValueList: skuPropertiesValue[],
    skuSaleAttrValueList:skuSaleAttrValue[],
    skuDefaultImg:string,
    category1Id:number|undefined,
    category2Id:number|undefined,
    category3Id:number|undefined
}

export interface getSkuResponseData extends ResponseData {
    data: skuData[]
}

export interface SkuPageQueryResponseData extends ResponseData {
    data: {
        records: skuData[],
        total: number
    }
}