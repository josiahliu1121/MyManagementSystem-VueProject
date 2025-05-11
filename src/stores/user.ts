import { defineStore } from 'pinia'
import { ref } from 'vue';
import { reqLogin, reqUserInfo } from '@/api/user'
import type { loginForm, loginResponseData, userResponseData } from '@/api/user/type'
import { routes } from '@/router/routes';
//@ts-ignore
import cloneDeep from 'lodash/cloneDeep';
import router from '@/router';

export const useUserStore = defineStore('user', () => {
    //get token from local storage
    // Reactive token state
    const token = ref<string>(localStorage.getItem('token') || '')
    async function login(data:loginForm): Promise<string>{
        const result: loginResponseData = await reqLogin(data)
        //code:1 success
        //code:0 fail
        if(result.code == 1){
            token.value = result.data
            localStorage.setItem('token',result.data)
            //make sure async return a full fill promise
            return 'ok'
        } else {
            return Promise.reject(new Error(result.msg))
        }
    }

    const username = ref<string>('')
    const avatar = ref<string>('')
    const id = ref<number>()
    const userRoute = ref<any>([])
    const userButton = ref<string[]>([])
    const infoReady = ref<boolean>(false)
    //request username and avatar from server
    async function userInfo() {
        const result: userResponseData = await reqUserInfo()

        //remove user route from the router
        routes.forEach((route: any) => {
            if (router.hasRoute(route.name)) {
                router.removeRoute(route.name);
            }
        });

        //code:1 success
        //code:0 fail
        if(result.code == 1){
            username.value = result.data.username
            avatar.value = (result.data.avatar as string)
            id.value = result.data.id
            userButton.value = (result.data.button as string[])
            infoReady.value = true
            
            userRoute.value=[]

            if(result.data.route != null){
                userRoute.value = filterUserRoute(cloneDeep(routes) , (result.data.route as string[]))

                userRoute.value.forEach((route:any) => {
                    router.addRoute(route)
                })
            }

            //make sure async return a full fill promise
            return 'ok'
        } else {
            return Promise.reject(new Error(result.msg))
        }
    }

    function filterUserRoute(asyncRoute: any[], userRoute: string[]): any[] {
        return asyncRoute.filter((route: any) => {
            if (userRoute.includes(route.name)) {
                if (route.children && route.children.length > 0) {
                    route.children = filterUserRoute(route.children, userRoute);
                }
                return true;
            }
            return false;
        });
    }

    //log out function
    function logOut() {
        token.value = ''
        username.value = ''
        avatar.value = ''
        localStorage.removeItem('token');
    }
    return { token,login,username,avatar,userInfo,logOut,id, userRoute, userButton, infoReady }
})
