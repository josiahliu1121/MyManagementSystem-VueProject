import request from "@/utils/axios";
import type { AssignedRoleResponseData, AssignRoleRequestData, loginForm, loginResponseData, user, UserPageQueryResponseData, userResponseData } from './type'

enum API {
    LOGIN_URL = "/user/login",
    USERINFO_URL = "/user/info",
    USERPAGEQUERY_URL = "/user/pageQuery/",
    ADDUSER_URL = "/user/addUser",
    UPDATEUSER_URL = "/user/updateUser",
    GETASSIGNEDROLE_URL = "/user/getAssignedRole/",
    ASSIGNROLE_URL = "/user/assignRole",
    BATCHDELETEUSER_URL = "/user/batchDelete"
}

//login interface
export const reqLogin = (data:loginForm) => request.post<any, loginResponseData>(API.LOGIN_URL, data);

//get user info interface
export const reqUserInfo = () => request.get<any, userResponseData>(API.USERINFO_URL)

export const reqUserPageQuery = (currentPage:number, pageSize:number, userName:string) => request.get<any, UserPageQueryResponseData>(API.USERPAGEQUERY_URL + `${currentPage}/${pageSize}`,{
    params: {userName }
  })

export const reqAddOrUpdateUser = (data:user) => {
    if(data.id){
        return request.post<any, any>(API.UPDATEUSER_URL, data)
    } else {
        return request.put<any, any>(API.ADDUSER_URL, data)
    }
}

export const reqGetAssignedRole = (id:number) => request.get<any,AssignedRoleResponseData>(API.GETASSIGNEDROLE_URL + id)

export const reqAssignRole = (data:AssignRoleRequestData) => request.post<any,any>(API.ASSIGNROLE_URL, data)

export const reqBatchDeleteUser = (ids: number[]) => 
    request.delete<any, any>(API.BATCHDELETEUSER_URL, {
        data: ids // Pass ids in the request body
    });