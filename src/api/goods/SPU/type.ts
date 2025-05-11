export interface ResponseData {
    code:number,
    msg:string,
}

export interface SpuData {
    id?:number,
    spuName:string,
    description:string,
    category3Id:number|undefined,
    brandId:number|undefined,
    spuSaleAttrList:null|SaleAttr[],
    spuImageList:null|SpuImg[]
}

export type Records = SpuData[]

export interface SpuPageQueryResponseData extends ResponseData {
    data: {
        records:Records,
        total:number
    }
}

export interface Brand{
    id:number,
    name:string,
    logoUrl:string
}

export interface BrandListResponseData extends ResponseData{
    data: Brand[]
}

export interface SpuImg {
    id?:number,
    spuId?:number,
    imgName:string,
    imgUrl:string
}

export interface ImgListResponseData extends ResponseData{
    data:SpuImg[]
}

export interface SaleAttrValue{
    id?:number,
    spuId?:number,
    baseSaleAttrId:number|undefined,
    saleAttrValueName:string,
    saleAttrName:string|undefined
}

export interface SaleAttr {
    id?:number,
    spuId?:number,
    baseSaleAttrId:number|undefined,
    saleAttrName:string|undefined,
    saleAttrValueList:SaleAttrValue[],
    inputVisible?:boolean, //use for add spu
    selectedAttrAndValue?:string //use for add sku
}

export interface SaleAttrResponseData extends ResponseData {
    data: SaleAttr[]
}

export interface BaseSaleAttr {
    id: number,
    name: string
}

export interface BaseSaleAttrResponseData extends ResponseData {
    data: BaseSaleAttr[]
}