import request from "@/utils/axios";
import type { GetMenuDataResponseData, MenuData } from "./type";

enum API {
    GETMENU_URL = "/user/menu/getMenu/",
    GETALLMENU_URL = "/user/menu/getAllMenu",
    ADDMENU_URL = "/user/menu/addMenu",
    UPDATEMENU_URL = "/user/menu/updateMenu",
    DELETEMENU_URL = "/user/menu/deleteMenu/"
}

export const reqGetMenu = (id:number) => request.get<any, GetMenuDataResponseData>(API.GETMENU_URL + id)

export const reqGetAllMenu = () => request.get<any, GetMenuDataResponseData>(API.GETALLMENU_URL)

export const reqAddMenu = (data:MenuData) => request.put<any, any>(API.ADDMENU_URL, data)

export const reqUpdateMenu = (data:MenuData) => request.post<any, any>(API.UPDATEMENU_URL, data)

export const reqDeleteMenu = (id:number) => request.delete<any,any>(API.DELETEMENU_URL + id)