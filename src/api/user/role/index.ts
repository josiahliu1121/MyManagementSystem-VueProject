import request from "@/utils/axios";
import type { RoleData, RolePageQueryResponseData } from "./type";

enum API{
    PAGEQUERY_URL = "/user/role/pageQuery/",
    ADDROLE_URL = "/user/role/addRole",
    UPDATEROLE_URL = "/user/role/updateRole",
    ASSIGNMENU_URL = "/user/role/assignMenu",
    DELETEROLE_URL = "/user/role/deleteRole/"
}

export const reqRolePageQuery = (currentPage: number, pageSize: number, roleName: string) => {
    return request.get<any, RolePageQueryResponseData>(API.PAGEQUERY_URL + `${currentPage}/${pageSize}`, {
      params: { roleName }
    });
  };

export const reqAddRole = (data:RoleData) => request.put<any,any>(API.ADDROLE_URL, data)

export const reqUpdateRole = (data:RoleData) => request.post<any,any>(API.UPDATEROLE_URL, data)

export const reqAssignMenu = (roleId: number, menuIdList: number[]) => 
  request.post<any, any>(API.ASSIGNMENU_URL, {}, { 
    params: { 
      roleId, 
      menuIdList: menuIdList.join(",") // Convert array to comma-separated string
    }
  });

export const reqDeleteRole = (id:number) => request.delete<any,any>(API.DELETEROLE_URL + id)