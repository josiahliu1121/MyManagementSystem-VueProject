export interface ResponseData {
    code:number,
    msg:string,
}

export interface InitialDataResponseData extends ResponseData {
    data:{
        sexRatio:number,
        ageRatio:number[],
        predictedPlayerCount:number[],
        reviewCount:number[],
        saleCount1:number[],
        saleCount2:number[],
        downloadCount:number[]
    }
}