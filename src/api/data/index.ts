import request from "@/utils/axios";
import type { InitialDataResponseData } from "./type";

enum API {
    INITIALDATA_URL = "/data/initialData"
}

export const reqInitialData = () => request.get<any, InitialDataResponseData>(API.INITIALDATA_URL)