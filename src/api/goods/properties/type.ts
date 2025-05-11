export interface ResponseData {
    code:number,
    msg:string,
}

export interface CategoryObj {
    id: number | undefined,
    name: string,
    category1Id: number,
    category2Id: number
}

export interface CategoryResponseData extends ResponseData {
    data: CategoryObj[]
}

export interface PropertiesValue {
    id?: number,
    valueName: string,
    propId?: number
}

export interface PropertiesObj {
    id?: number,
    propName: string,
    categoryId: number | undefined,
    categoryLevel: number,
    propValueList: PropertiesValue[],
    selectedPropAndValue?: string  //use for add sku
}

export interface PropertiesResponseData extends ResponseData {
    data: PropertiesObj[]
}